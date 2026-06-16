// DEV tool: verifies every documentation URL in data/enrichment.js resolves (HTTP 200
// after redirects). Prints a report. No URLs are invented; failures must be fixed/removed.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILES = [
  resolve(__dirname, "..", "data", "enrichment.js"),
  resolve(__dirname, "..", "data", "learn-enrichment.js"),
];

const text = FILES.map((f) => readFileSync(f, "utf8")).join("\n");
const urls = [...new Set((text.match(/https?:\/\/[^"'\s)]+/g) || []))];

console.log(`Checking ${urls.length} URLs from enrichment.js + learn-enrichment.js…\n`);

const results = [];
for (const url of urls) {
  let status = 0, finalUrl = url, err = null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    let res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 link-check" } });
    clearTimeout(timer);
    status = res.status;
    finalUrl = res.url;
  } catch (e) {
    err = e.name === "AbortError" ? "timeout" : e.message;
  }
  const ok = status >= 200 && status < 400;
  results.push({ url, status, ok, finalUrl, err });
  console.log(`${ok ? "OK " : "XX "} ${status || "ERR"}  ${url}${err ? "  (" + err + ")" : ""}`);
}

const bad = results.filter((r) => !r.ok);
console.log(`\n${results.length - bad.length}/${results.length} OK`);
if (bad.length) {
  console.log("\nFAILURES:");
  bad.forEach((b) => console.log(`  ${b.status || "ERR"}  ${b.url}  ${b.err || ""}`));
  process.exitCode = 1;
} else {
  console.log("All documentation links resolve.");
}
