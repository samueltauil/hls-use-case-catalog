// One-time DEV tool. Parses the FY27 HLS Sales Play Catalog markdown into structured
// data and writes data/catalog.js (window.CATALOG = {...}). NOT required to view the site.
//
// Usage:  node tools/extract-catalog.mjs
//
// Guarantees verbatim fidelity: it copies the source text exactly, only splitting on the
// document's consistent markers. It also prints parity counts so we can verify 129 use cases.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "context/FY27_HLS_CAIP_Healthcare_Sales_Play_Catalog.md");
const OUT = resolve(ROOT, "data/catalog.js");

const SUBVERTICALS = new Set([
  "Health Providers",
  "Health Payers",
  "Pharma / Life Sciences",
  "MedTech",
]);

// ---- helpers ---------------------------------------------------------------

const EMDASH = "\u2014";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

// Split a label value that uses either "---" or em dash as a separator.
function splitOnDash(value) {
  if (value.includes(" --- ")) return value.split(" --- ");
  if (value.includes(` ${EMDASH} `)) return value.split(` ${EMDASH} `);
  if (value.includes("---")) return value.split("---");
  if (value.includes(EMDASH)) return value.split(EMDASH);
  return [value];
}

// Determine the leading Solution Pattern category token(s).
function parseSolutionPattern(text) {
  // The category prefix is separated from the description by " --- ", " / " or " - ".
  let idx = -1;
  let delim = "";
  for (const d of [" --- ", ` ${EMDASH} `, " / ", " - "]) {
    const i = text.indexOf(d);
    if (i !== -1 && (idx === -1 || i < idx)) {
      idx = i;
      delim = d;
    }
  }
  let categoryRaw = idx === -1 ? text : text.slice(0, idx);
  categoryRaw = categoryRaw.trim();
  // Combos like "Apps + Data", "Security + Governance".
  const tokens = categoryRaw.split(/\s*\+\s*/).map((t) => t.trim()).filter(Boolean);
  const primary = (tokens[0] || categoryRaw).trim();
  return { categoryRaw, categories: tokens, primaryCategory: primary, delim };
}

// Best-effort split of risk text into objection/mitigation pairs. Falls back to raw.
function parseRisks(raw) {
  const text = raw.trim();
  // Split into sentence-ish segments on ". " (keep it conservative).
  const segments = text
    .split(/\.\s+(?=[A-Z(])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(".") ? s : s + "."));
  const pairs = [];
  for (const seg of segments) {
    let parts = null;
    if (seg.includes(" --- ")) parts = seg.split(" --- ");
    else if (seg.includes(` ${EMDASH} `)) parts = seg.split(` ${EMDASH} `);
    else if (seg.includes(" - ")) parts = seg.split(" - ");
    if (parts && parts.length >= 2) {
      pairs.push({
        objection: parts[0].trim(),
        mitigation: parts.slice(1).join(" - ").trim().replace(/\.$/, ""),
      });
    }
  }
  return { raw: text, pairs };
}

function parseWorkloads(text) {
  return text
    .split(/\s*\u2022\s*/) // bullet •
    .map((w) => w.trim())
    .filter(Boolean);
}

function parseBuyer(value) {
  const parts = splitOnDash(value).map((p) => p.trim());
  const primary = parts[0] || value.trim();
  let stakeholders = [];
  if (parts[1]) {
    stakeholders = parts[1]
      .replace(/^Stakeholders:\s*/i, "")
      .split(/,\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return { primary, stakeholders };
}

// ---- parsing ---------------------------------------------------------------

const md = readFileSync(SRC, "utf8");
const lines = md.split(/\r?\n/);

const FIELD_LABELS = {
  "Customer Problem / Trigger": "problem",
  "Primary Buyer & Stakeholders": "buyerRaw",
  "Business Value": "businessValue",
  "Solution Pattern": "solutionPatternText",
  "Azure Workload Mapping": "azureWorkloadsRaw",
  "Typical Starting Motion": "startingMotion",
  "Risks / Objections & Mitigation": "risksRaw",
  "Grounding": "grounding",
};

const subverticals = [];
let currentSub = null;
let currentStage = null;
let currentUseCase = null;
let collectingDiscovery = false;
let pendingField = null; // for multi-line capture if ever needed

function finishUseCase() {
  if (currentUseCase) {
    currentStage.useCases.push(currentUseCase);
    currentUseCase = null;
  }
  collectingDiscovery = false;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Subvertical (H2) — only the 4 known ones.
  const h2 = /^##\s+(.+?)\s*$/.exec(line);
  if (h2 && SUBVERTICALS.has(h2[1].trim())) {
    finishUseCase();
    currentStage = null;
    currentSub = {
      name: h2[1].trim(),
      id: slugify(h2[1].trim()),
      summary: "",
      stages: [],
    };
    subverticals.push(currentSub);
    continue;
  }

  // Subvertical summary line, e.g. "*32 use cases across 5 buyer-journey stages.*"
  if (currentSub && !currentStage && /^\*.+use cases.+\*$/.test(trimmed)) {
    currentSub.summary = trimmed.replace(/^\*|\*$/g, "").trim();
    continue;
  }

  // Stage (H3) with a "(N)" count — only inside a subvertical.
  const h3 = /^###\s+(.+?)\s*\((\d+)\)\s*$/.exec(line);
  if (h3 && currentSub) {
    finishUseCase();
    currentStage = {
      name: h3[1].trim(),
      id: slugify(h3[1].trim()),
      declaredCount: Number(h3[2]),
      useCases: [],
    };
    currentSub.stages.push(currentStage);
    continue;
  }

  // Use case (H4).
  const h4 = /^####\s+(.+?)\s*$/.exec(line);
  if (h4 && currentSub && currentStage) {
    finishUseCase();
    currentUseCase = {
      title: h4[1].trim(),
      id: slugify(h4[1].trim()),
      problem: "",
      buyerRaw: "",
      businessValue: "",
      solutionPatternText: "",
      azureWorkloadsRaw: "",
      discoveryQuestions: [],
      startingMotion: "",
      risksRaw: "",
      grounding: "",
    };
    continue;
  }

  if (!currentUseCase) continue;

  // Labeled field line: **Label:** value
  const fieldMatch = /^\*\*(.+?):\*\*\s*(.*)$/.exec(trimmed);
  if (fieldMatch) {
    const label = fieldMatch[1].trim();
    const value = fieldMatch[2].trim();
    collectingDiscovery = false;
    if (label === "Discovery Questions") {
      collectingDiscovery = true;
      continue;
    }
    const key = FIELD_LABELS[label];
    if (key) {
      currentUseCase[key] = value;
    }
    continue;
  }

  // Discovery question bullets.
  if (collectingDiscovery) {
    const bullet = /^-\s+(.*)$/.exec(trimmed);
    if (bullet) {
      currentUseCase.discoveryQuestions.push(bullet[1].trim());
      continue;
    }
    if (trimmed === "") continue; // blank lines between bullets
  }
}
finishUseCase();

// ---- post-process / normalize ----------------------------------------------

const catalog = { generatedFrom: "context/FY27_HLS_CAIP_Healthcare_Sales_Play_Catalog.md", subverticals: [] };

for (const sub of subverticals) {
  const outSub = { name: sub.name, id: sub.id, summary: sub.summary, stages: [] };
  for (const stage of sub.stages) {
    const outStage = { name: stage.name, id: stage.id, declaredCount: stage.declaredCount, useCases: [] };
    for (const uc of stage.useCases) {
      const sp = parseSolutionPattern(uc.solutionPatternText);
      const buyer = parseBuyer(uc.buyerRaw);
      const risks = parseRisks(uc.risksRaw);
      outStage.useCases.push({
        id: uc.id,
        title: uc.title,
        subvertical: sub.name,
        subverticalId: sub.id,
        stage: stage.name,
        stageId: stage.id,
        problem: uc.problem,
        buyerPrimary: buyer.primary,
        buyerStakeholders: buyer.stakeholders,
        businessValue: uc.businessValue,
        solutionPatternText: uc.solutionPatternText,
        solutionCategory: sp.primaryCategory,
        solutionCategories: sp.categories,
        azureWorkloads: parseWorkloads(uc.azureWorkloadsRaw),
        discoveryQuestions: uc.discoveryQuestions,
        startingMotion: uc.startingMotion,
        risksRaw: risks.raw,
        risks: risks.pairs,
        grounding: uc.grounding,
      });
    }
    outSub.stages.push(outStage);
  }
  catalog.subverticals.push(outSub);
}

// ---- parity report ----------------------------------------------------------

let total = 0;
const distinctWorkloads = new Set();
const distinctCategories = new Set();
const distinctMotions = new Set();
const distinctGrounding = new Set();
const issues = [];

for (const sub of catalog.subverticals) {
  let subTotal = 0;
  for (const stage of sub.stages) {
    const n = stage.useCases.length;
    subTotal += n;
    if (n !== stage.declaredCount) {
      issues.push(`Count mismatch: ${sub.name} / ${stage.name} declared ${stage.declaredCount} got ${n}`);
    }
    for (const uc of stage.useCases) {
      distinctCategories.add(uc.solutionCategory);
      distinctMotions.add(uc.startingMotion);
      distinctGrounding.add(uc.grounding);
      uc.azureWorkloads.forEach((w) => distinctWorkloads.add(w));
      for (const [k, v] of Object.entries({
        problem: uc.problem,
        buyerPrimary: uc.buyerPrimary,
        businessValue: uc.businessValue,
        solutionPatternText: uc.solutionPatternText,
        startingMotion: uc.startingMotion,
        risksRaw: uc.risksRaw,
        grounding: uc.grounding,
      })) {
        if (!v) issues.push(`Empty field "${k}" in ${sub.name} / ${uc.title}`);
      }
      if (uc.azureWorkloads.length === 0) issues.push(`No workloads in ${sub.name} / ${uc.title}`);
      if (uc.discoveryQuestions.length === 0) issues.push(`No discovery questions in ${sub.name} / ${uc.title}`);
    }
  }
  total += subTotal;
  console.log(`${sub.name}: ${subTotal} use cases across ${sub.stages.length} stages`);
}

console.log(`\nTOTAL use cases: ${total}`);
console.log(`Distinct solution categories: ${[...distinctCategories].sort().join(", ")}`);
console.log(`Distinct starting motions: ${[...distinctMotions].sort().join(", ")}`);
console.log(`Distinct grounding values: ${[...distinctGrounding].sort().join(" | ")}`);
console.log(`Distinct Azure workloads: ${distinctWorkloads.size}`);

if (issues.length) {
  console.log(`\n!!! ${issues.length} ISSUES:`);
  issues.forEach((x) => console.log("  - " + x));
} else {
  console.log("\nNo field/count issues detected.");
}

// ---- write output -----------------------------------------------------------

mkdirSync(dirname(OUT), { recursive: true });
const banner =
  "// AUTO-GENERATED by tools/extract-catalog.mjs from\n" +
  "// context/FY27_HLS_CAIP_Healthcare_Sales_Play_Catalog.md — do not edit by hand.\n" +
  "// Content is copied verbatim from the source catalog.\n";
const body =
  banner +
  "window.CATALOG = " +
  JSON.stringify(catalog, null, 2) +
  ";\n";
writeFileSync(OUT, body, "utf8");
console.log(`\nWrote ${OUT}`);

// Also dump distinct workloads to help build enrichment.js.
console.log("\n--- DISTINCT WORKLOADS ---");
[...distinctWorkloads].sort().forEach((w) => console.log(w));
