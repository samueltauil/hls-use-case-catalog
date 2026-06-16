// Demo archetypes — one per Solution Pattern category. Each renderer takes a use case
// and returns interactive HTML. All concrete values are clearly-labeled SAMPLE data
// (see .mock-tag); no real customer data and no invented factual claims about the customer.
(function () {
  const I = (n, o) => window.icon(n, o);
  let CURRENT_UC = null; // set by Demos.build so chrome() can show the use case's services

  // Pull canonical product names for labeling demo nodes (max n).
  function canon(uc, n) {
    const seen = [];
    for (const w of uc.azureWorkloads) {
      const r = window.resolveWorkload(w);
      const name = (r && r.name) || w;
      if (!seen.includes(name)) seen.push(name);
      if (seen.length >= (n || 4)) break;
    }
    return seen;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function mockTag(label) {
    return `<div class="mock-tag">${I("bulb", { size: 14 })} ${esc(label || "Illustrative sample — not real customer data")}</div>`;
  }
  function chrome(url, inner) {
    const services = CURRENT_UC ? canon(CURRENT_UC, 4) : [];
    const foot = services.length
      ? `<div class="demo-foot"><span class="df-label">Built on</span>` +
        services.map((s) => `<span class="df-chip">${esc(s)}</span>`).join("") + `</div>`
      : "";
    return (
      `<div class="demo-frame"><div class="demo-chrome">` +
      `<div class="url">${esc(url)}</div>` +
      `<div class="win-controls" aria-hidden="true">` +
      `<span class="win-btn" title="Minimize">${I("windowMin", { size: 12, sw: 1.6 })}</span>` +
      `<span class="win-btn" title="Maximize">${I("windowMax", { size: 11, sw: 1.6 })}</span>` +
      `<span class="win-btn close" title="Close">${I("close", { size: 13, sw: 1.6 })}</span>` +
      `</div></div>` +
      `<div class="demo-body">${inner}</div>${foot}</div>`
    );
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  // ============================================================ AI archetypes
  // The AI solution pattern covers many distinct workloads, so we route each use
  // case to the demo that best fits its own wording (extraction, summarization,
  // agentic workflow, matching, predictive scoring, assisted read, or a grounded
  // conversational assistant). This keeps demos varied and specific per use case.
  function aiDemo(uc) {
    const t = (uc.title + " " + uc.solutionPatternText + " " + uc.problem).toLowerCase();
    if (/conversational|chatbot|virtual assistant/.test(t)) return chatDemo(uc);
    if (/ocr|idp|document (processing|extraction|intelligence)|\bextract|\bintake\b|information request|scanned|\bpdf\b/.test(t)) return extractionDemo(uc);
    if (/\bmatch|eligib|recruit|patient-to-protocol/.test(t)) return matchDemo(uc);
    if (/imaging|pathology|radiology|whole-slide|assisted read|image analysis/.test(t)) return visionDemo(uc);
    if (/summar|scribe|ambient|chart (review|summar)|handoff|drafts? note|documentation (time|integrity|burden)|note-taking|authoring|drafting|\bprotocol\b|submission|dossier|\bwriting\b|plain-language|narrative/.test(t)) return summarizeDemo(uc);
    if (/github copilot|developer (productivity|capacity)|software (delivery|development|engineering)|\bsdlc\b|secure development|ai-assisted, secure/.test(t)) return codeDemo(uc);
    if (/fraud|risk scor|anomaly|signal detection|predict|forecast|propensity|churn|optimiz|\bshift\b|workforce sched|\bdemand\b|maintenance|diagnostic|dispatch|payment.*risk/.test(t)) return scoreDemo(uc);
    if (/knowledge (agent|assistant)|engagement assistant|digital assistant|field.*copilot|\bmsl\b|sales (training|enablement)|\bassistant\b/.test(t)) return chatDemo(uc);
    if (/\bagent|automat|orchestrat|prior auth|authorization|workflow|adjustment|correction|credentialing|\baudit|next-best-action|routing|triage/.test(t)) return agentDemo(uc);
    return chatDemo(uc);
  }

  function audience(uc) {
    const t = (uc.title + " " + uc.problem + " " + uc.buyerPrimary + " " + uc.buyerStakeholders.join(" ")).toLowerCase();
    if (uc.subverticalId === "health-providers") {
      if (/patient|triage|scheduling|check-in|portal|engagement|equity|multilingual|telehealth/.test(t)) return "patient";
      return "clinician";
    }
    if (uc.subverticalId === "health-payers") {
      if (/broker/.test(t)) return "broker";
      if (/processor|adjudicat/.test(t)) return "processor";
      if (/review|utilization|care manage|clinical/.test(t)) return "clinician";
      return "member";
    }
    if (uc.subverticalId === "pharma-life-sciences") {
      if (/msl|field|sales|rep\b|commercial|broker/.test(t)) return "rep";
      return "researcher";
    }
    return "user";
  }

  // ---- AI: grounded conversational assistant
  function chatDemo(uc) {
    const aud = audience(uc);
    const scene = window.DEMOSCENES ? window.DEMOSCENES.chat(uc, aud) : null;
    const products = canon(uc, 3);
    const grounding = (scene && scene.grounding) || products.find((p) => /Search|Foundry|OpenAI|Bot/i.test(p)) || "Azure AI Search";
    const qa = (scene && scene.qa) || [
      { q: "What can you help me with?", a: "I handle the common requests for this workflow, grounded in approved sources, and hand off to a person when needed.", src: "Approved knowledge base (sample)" },
    ];
    const intro = (scene && scene.intro) || `Hi — I'm the ${uc.title} assistant (demo). Ask a sample question.`;
    const inner =
      mockTag("Sample assistant — conversation is illustrative synthetic data; grounded on approved content in production") +
      `<div class="chat" data-chat>` +
      `<div class="bubble bot">${esc(intro)}<span class="cite">${I("doc", { size: 12 })} Grounded via ${esc(grounding)}</span></div>` +
      `</div>` +
      `<div class="chat-suggest">` +
      qa.map((p, i) => `<button type="button" data-prompt="${i}">${esc(p.q)}</button>`).join("") +
      `</div>` +
      `<div class="chat-input"><input type="text" data-input placeholder="Type a message…" aria-label="Message">` +
      `<button class="ci-send" data-send aria-label="Send">${I("arrowRight", { size: 16 })}</button></div>`;
    return {
      label: "AI · conversational assistant",
      html: chrome(`assistant.demo.local/${slug(uc.title).slice(0, 26)}`, inner),
      init(root) {
        const chat = root.querySelector("[data-chat]");
        const input = root.querySelector("[data-input]");
        const send = root.querySelector("[data-send]");
        function reply(i) {
          const typing = addBubble(chat, "bot", `<div class="typing"><span></span><span></span><span></span></div>`);
          setTimeout(() => {
            typing.innerHTML = esc(qa[i].a) + `<span class="cite">${I("doc", { size: 12 })} Source: ${esc(qa[i].src)}</span>`;
            chat.scrollTop = chat.scrollHeight;
          }, 600);
        }
        function bestMatch(text) {
          const words = text.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
          let best = -1, bestScore = 0;
          qa.forEach((p, i) => {
            const q = p.q.toLowerCase();
            let s = 0;
            words.forEach((w) => { if (q.includes(w)) s++; });
            if (s > bestScore) { bestScore = s; best = i; }
          });
          return bestScore > 0 ? best : -1;
        }
        function ask(i) {
          const btn = root.querySelector(`[data-prompt="${i}"]`);
          if (btn) { btn.dataset.done = "1"; btn.classList.add("used"); }
          reply(i);
        }
        function submit() {
          const text = (input.value || "").trim();
          if (!text) return;
          input.value = "";
          addBubble(chat, "user", esc(text));
          const i = bestMatch(text);
          if (i >= 0) { ask(i); }
          else {
            const typing = addBubble(chat, "bot", `<div class="typing"><span></span><span></span><span></span></div>`);
            setTimeout(() => {
              typing.innerHTML = esc("In production I'd answer that from approved, grounded sources — and hand off to a person when needed. Try a suggested question for a worked sample.") +
                `<span class="cite">${I("doc", { size: 12 })} Grounded via ${esc(grounding)}</span>`;
              chat.scrollTop = chat.scrollHeight;
            }, 600);
          }
          chat.scrollTop = chat.scrollHeight;
        }
        send.addEventListener("click", submit);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } });
        root.querySelectorAll("[data-prompt]").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (btn.dataset.done) return;
            btn.dataset.done = "1";
            btn.classList.add("used");
            const i = +btn.dataset.prompt;
            addBubble(chat, "user", esc(qa[i].q));
            reply(i);
            chat.scrollTop = chat.scrollHeight;
          });
        });
        if (input) input.focus();
      },
    };
  }

  // ---- AI: document extraction (OCR / IDP)
  function extractionDemo(uc) {
    const sc = window.DEMOSCENES ? window.DEMOSCENES.extraction(uc) : null;
    const fields = (sc && sc.fields) || [{ k: "Document type", v: "Sample form", c: "high" }, { k: "Reference ID", v: "SAMPLE-004217", c: "med" }];
    const docText = (sc && sc.text) || [];
    const docTitle = (sc && sc.docTitle) || "Sample document";
    const low = fields.filter((f) => f.c === "low").length;
    const lineFor = (val) => {
      const v = String(val == null ? "" : val).toLowerCase().replace(/[—–-]/g, " ").trim();
      if (!v) return -1;
      let idx = docText.findIndex((l) => l.toLowerCase().includes(v));
      if (idx < 0) {
        const tok = v.split(/\s+/).find((w) => w.length > 2);
        if (tok) idx = docText.findIndex((l) => l.toLowerCase().includes(tok));
      }
      return idx;
    };
    const inner =
      mockTag("Sample document & extracted fields — fictional synthetic data, not a real document") +
      `<div class="doc-split"><div class="doc-page paper" data-doc><div class="src-label">${esc(docTitle)}</div>` +
      docText.map((l, i) => `<div class="doc-text${i === 0 ? " h" : ""}" data-line="${i}">${esc(l)}</div>`).join("") +
      `</div><div class="extract-panel"><div class="extract-head">Extracted fields <span data-status>— idle</span></div>` +
      `<div class="field-list" data-fields></div>` +
      `<button class="btn primary" data-extract style="margin-top:12px">${I("spark", { size: 16 })} Extract data</button></div></div>`;
    return {
      label: "AI · document extraction",
      html: chrome((sc && sc.url) || `idp.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const list = root.querySelector("[data-fields]");
        const status = root.querySelector("[data-status]");
        const doc = root.querySelector("[data-doc]");
        function highlight(idx) {
          doc.querySelectorAll(".doc-text").forEach((l) => l.classList.toggle("hl", +l.dataset.line === idx));
          const el = idx >= 0 ? doc.querySelector(`.doc-text[data-line="${idx}"]`) : null;
          if (el) el.scrollIntoView({ block: "nearest" });
        }
        const btn = root.querySelector("[data-extract]");
        btn.addEventListener("click", () => {
          list.innerHTML = "";
          status.textContent = "— extracting…";
          btn.disabled = true;
          fields.forEach((f, i) => setTimeout(() => {
            const ln = lineFor(f.v);
            const row = document.createElement("div");
            row.className = "field-row" + (ln >= 0 ? " has-src" : "");
            row.innerHTML = `<span class="fk">${esc(f.k)}</span><span class="fv">${esc(f.v)}</span>` +
              (f.c === "low"
                ? `<button class="conf low" data-approve type="button">review · approve</button>`
                : `<span class="conf ${f.c}">${esc(f.c)} conf.</span>`);
            if (ln >= 0) row.addEventListener("click", (e) => {
              if (e.target.closest("[data-approve]")) return;
              list.querySelectorAll(".field-row").forEach((r) => r.classList.remove("sel"));
              row.classList.add("sel");
              highlight(ln);
            });
            const appr = row.querySelector("[data-approve]");
            if (appr) appr.addEventListener("click", (e) => {
              e.stopPropagation();
              appr.outerHTML = `<span class="conf high">${I("check", { size: 11 })} approved</span>`;
            });
            list.appendChild(row);
            if (i === fields.length - 1) {
              status.textContent = `— ${fields.length} fields · ${low} to review`;
              btn.disabled = false;
            }
          }, 150 * (i + 1)));
        });
      },
    };
  }

  // ---- AI: summarization / drafting copilot
  function summarizeDemo(uc) {
    const isDraft = /authoring|drafting|protocol|submission|dossier|\bwriting\b|plain-language|narrative|design optimization/.test((uc.title + " " + uc.solutionPatternText).toLowerCase());
    const sc = window.DEMOSCENES ? window.DEMOSCENES.summarize(uc, isDraft) : null;
    const products = canon(uc, 2);
    const srcTitle = (sc && sc.srcTitle) || (isDraft ? "Source content & brief (sample)" : "Source record (sample)");
    const srcLines = (sc && sc.src) || [];
    const outTitle = (sc && sc.outTitle) || (isDraft ? "Generated draft" : "Generated summary");
    const sections = (sc && sc.sections) || [["Key points", "Sample concise summary of the record."]];
    const cite = (sc && sc.cite) || `Grounded on source via ${products.join(", ")}`;
    const btn = isDraft ? "Draft document" : "Generate summary";
    const inner =
      mockTag("Sample input & generated output — fictional synthetic data; a person reviews before use") +
      `<div class="doc-split"><div class="doc-page paper"><div class="src-label">${esc(srcTitle)}</div>` +
      srcLines.map((l) => `<div class="doc-text">${esc(l)}</div>`).join("") +
      `</div><div class="extract-panel"><div class="extract-head">${esc(outTitle)} <span data-status>— idle</span></div>` +
      `<div class="summary-out" data-out><span class="muted-hint">Click "${esc(btn)}" to generate a sample.</span></div>` +
      `<div class="gen-controls"><div class="seg-row"><button class="seg-btn active" data-mode="full" type="button">Full</button>` +
      `<button class="seg-btn" data-mode="brief" type="button">Brief</button></div>` +
      `<button class="btn primary" data-gen>${I("spark", { size: 16 })} ${esc(btn)}</button></div></div></div>`;
    return {
      label: isDraft ? "AI · drafting copilot" : "AI · summarization",
      html: chrome(`copilot.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const out = root.querySelector("[data-out]");
        const status = root.querySelector("[data-status]");
        let mode = "full";
        function gen() {
          const secs = mode === "brief" ? sections.slice(0, 1) : sections;
          out.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
          status.textContent = "— generating…";
          setTimeout(() => {
            out.innerHTML = "";
            secs.forEach(([h, b], i) => setTimeout(() => {
              const d = document.createElement("div");
              d.className = "sum-sec";
              d.innerHTML = `<h6>${esc(h)}</h6><p>${esc(b)}</p>`;
              out.appendChild(d);
              out.scrollTop = out.scrollHeight;
              if (i === secs.length - 1) {
                const c = document.createElement("span");
                c.className = "cite";
                c.innerHTML = `${I("doc", { size: 12 })} ${esc(cite)}`;
                out.appendChild(c);
                status.textContent = `— ${mode} · review required`;
              }
            }, 240 * i));
          }, 420);
        }
        root.querySelector("[data-gen]").addEventListener("click", gen);
        root.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => {
          root.querySelectorAll("[data-mode]").forEach((x) => x.classList.toggle("active", x === b));
          mode = b.dataset.mode;
          if (out.querySelector(".sum-sec") || out.querySelector(".typing")) gen();
        }));
      },
    };
  }

  // ---- AI: agentic workflow
  function agentDemo(uc) {
    const products = canon(uc, 2);
    const sc = window.DEMOSCENES ? window.DEMOSCENES.agent(uc) : null;
    const steps = (sc && sc.steps) || [
      { t: "Receive request", d: "Intake the request and validate inputs (sample)." },
      { t: "Retrieve policy & data", d: "Gather approved policy and case data via grounding (sample)." },
      { t: "Evaluate criteria", d: "Apply rules and criteria to reach a recommendation (sample)." },
      { t: "Human review", d: "Pause for a person to approve before any action (sample).", gate: true },
      { t: "Complete & log", d: "Execute the approved action and log every decision (sample)." },
    ];
    const caseTitle = (sc && sc.caseTitle) || "Automated workflow";
    const caseFields = (sc && sc.caseFields) || [];
    const cite = (sc && sc.cite) || `Orchestrated via ${products.join(", ")}`;
    const inner =
      mockTag("Sample agent run — fictional case with a human-in-the-loop approval gate") +
      (caseFields.length
        ? `<div class="agent-case"><div class="ac-title">${I("list", { size: 14 })} ${esc(caseTitle)}</div>` +
          `<div class="ac-fields">` + caseFields.map(([k, v]) => `<span class="ac-f"><span class="ac-k">${esc(k)}</span><span class="ac-v">${esc(v)}</span></span>`).join("") + `</div></div>`
        : "") +
      `<div class="agent-steps" data-steps>` +
      steps.map((s, i) => `<div class="agent-step" data-step="${i}"><span class="as-ic">${I("clock", { size: 16 })}</span>` +
        `<span class="as-body"><span class="as-t">${esc(s.t)}${s.gate ? ` <span class="gate-tag">approval</span>` : ""}</span>` +
        `<span class="as-d">${esc(s.d)}</span></span></div>`).join("") +
      `</div>` +
      `<div class="agent-actions"><button class="btn primary" data-run>${I("play", { size: 15 })} Run agent</button>` +
      `<button class="btn" data-reject hidden>${I("close", { size: 14 })} Reject</button>` +
      `<span class="cite" style="margin-left:10px">${I("doc", { size: 12 })} ${esc(cite)}</span></div>`;
    return {
      label: "AI · agentic workflow",
      html: chrome(`agent.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const rows = [...root.querySelectorAll(".agent-step")];
        const runBtn = root.querySelector("[data-run]");
        const rejectBtn = root.querySelector("[data-reject]");
        let i = 0, paused = false, finished = false;
        const setIc = (row, name) => { row.querySelector(".as-ic").innerHTML = I(name, { size: 16 }); };
        function reset() {
          i = 0; paused = false; finished = false;
          rows.forEach((r) => { r.classList.remove("active", "done", "rejected"); setIc(r, "clock"); });
          runBtn.innerHTML = `${I("play", { size: 15 })} Run agent`;
          rejectBtn.hidden = true;
        }
        function advance() {
          if (i >= rows.length) { finished = true; runBtn.innerHTML = `${I("check", { size: 15 })} Completed — run again`; return; }
          const row = rows[i];
          row.classList.add("active");
          if (steps[i].gate && !paused) {
            paused = true;
            runBtn.innerHTML = `${I("check", { size: 15 })} Approve & continue`;
            rejectBtn.hidden = false;
            return;
          }
          row.classList.add("done"); setIc(row, "check");
          paused = false; i++;
          setTimeout(advance, 450);
        }
        runBtn.addEventListener("click", () => {
          if (finished) { reset(); return; }
          if (paused) {
            paused = false; rejectBtn.hidden = true;
            rows[i].classList.add("done"); setIc(rows[i], "check");
            i++; advance(); return;
          }
          runBtn.innerHTML = `${I("clock", { size: 15 })} Running…`;
          advance();
        });
        rejectBtn.addEventListener("click", () => {
          rows[i].classList.add("rejected"); setIc(rows[i], "close");
          rejectBtn.hidden = true; paused = false; finished = true;
          runBtn.innerHTML = `${I("close", { size: 15 })} Rejected — run again`;
        });
      },
    };
  }

  // ---- AI: matching (candidate ↔ criteria)
  function matchDemo(uc) {
    const sc = window.DEMOSCENES ? window.DEMOSCENES.match(uc) : null;
    const cands = (sc && sc.cands) || [
      { n: "Candidate A (sample)", sub: "Strong match", score: 92, why: ["Meets primary criteria", "Within target range", "No exclusions found"] },
      { n: "Candidate B (sample)", sub: "Needs confirmation", score: 74, why: ["Meets most criteria", "One item needs confirmation"] },
      { n: "Candidate C (sample)", sub: "Unlikely", score: 41, why: ["Partial match only", "Two exclusion criteria met"] },
    ];
    const criteria = (sc && sc.criteria) || `Matching against sample criteria for ${uc.title} — a person makes the final call`;
    const sCls = (s) => (s >= 80 ? "hi" : s >= 55 ? "mid" : "lo");
    const inner =
      mockTag("Sample matches — fictional candidates and scores; a person confirms eligibility") +
      `<div class="match-criteria">${I("target", { size: 14 })} ${esc(criteria)}.</div>` +
      `<div class="alert-list" data-cands style="margin-top:12px">` +
      cands.map((c, i) => `<div class="alert-row" data-cand="${i}"><span class="match-score ${sCls(c.score)}">${c.score}%</span>` +
        `<span><span class="a-t">${esc(c.n)}</span><br><span class="a-s">${esc(c.sub || "Tap to see why")}</span></span>` +
        `<span class="a-act">${I("chevronRight", { size: 16 })}</span></div>`).join("") +
      `</div><div class="flow-detail" data-why style="margin-top:12px">Select a candidate to see the match rationale.</div>`;
    return {
      label: "AI · matching",
      html: chrome(`match.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const why = root.querySelector("[data-why]");
        function tag(row, label, cls) {
          const a = row.querySelector(".a-act");
          if (a) a.innerHTML = `<span class="pill-status ${cls}">${esc(label)}</span>`;
        }
        root.querySelectorAll("[data-cand]").forEach((row) => row.addEventListener("click", () => {
          root.querySelectorAll(".alert-row").forEach((r) => r.classList.remove("sel"));
          row.classList.add("sel");
          const c = cands[+row.dataset.cand];
          why.innerHTML = `<strong>${esc(c.n)} — ${c.score}% match</strong><ul class="why-list">` +
            c.why.map((w) => `<li>${esc(w)}</li>`).join("") + `</ul>` +
            `<div class="row-actions"><button class="btn primary" type="button" data-act="short">${I("check", { size: 14 })} Shortlist</button>` +
            `<button class="btn" type="button" data-act="dismiss">${I("close", { size: 14 })} Dismiss</button></div>`;
          why.querySelector('[data-act="short"]').addEventListener("click", () => {
            row.classList.remove("dismissed"); row.classList.add("shortlisted"); tag(row, "Shortlisted", "active");
          });
          why.querySelector('[data-act="dismiss"]').addEventListener("click", () => {
            row.classList.remove("shortlisted"); row.classList.add("dismissed"); tag(row, "Dismissed", "contained");
          });
        }));
      },
    };
  }

  // ---- AI: code assist (developer productivity)
  function codeDemo(uc) {
    const sc = window.DEMOSCENES ? window.DEMOSCENES.code(uc) : null;
    const pre = (sc && sc.pre) || ["// Copilot: scaffold a function", "// prompt: validate an incoming request payload"];
    const suggestion = (sc && sc.suggestion) || ["function validate(req) {", "  return Boolean(req && req.id);", "}"];
    const scanMsg = (sc && sc.scan) || "Security scan passed";
    const lang = (sc && sc.lang) || "TypeScript";
    let ln = 0;
    const preLines = pre.map((c) => `<div class="code-line"><span class="ln">${++ln}</span><span class="cmt">${esc(c)}</span></div>`).join("");
    const inner =
      mockTag("Sample editor — illustrative AI suggestion; review & security scan apply") +
      `<div class="code-head">${esc(lang)} · ${esc(slug(uc.title).slice(0, 20))}.ts <span class="code-badge">${I("bolt", { size: 11 })} AI pair</span></div>` +
      `<div class="code-block">${preLines}<div class="code-ghosts" data-ghost></div></div>` +
      `<div class="code-actions"><button class="btn primary" data-suggest>${I("spark", { size: 15 })} Suggest</button>` +
      `<button class="btn" data-accept disabled>${I("check", { size: 15 })} Accept</button>` +
      `<span class="scan-note" data-scan></span></div>`;
    return {
      label: "AI · code assist",
      html: chrome(`copilot.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const ghost = root.querySelector("[data-ghost]");
        const accept = root.querySelector("[data-accept]");
        const scan = root.querySelector("[data-scan]");
        const base = pre.length;
        const suggestBtn = root.querySelector("[data-suggest]");
        suggestBtn.addEventListener("click", () => {
          ghost.innerHTML = "";
          suggestBtn.disabled = true;
          accept.disabled = true;
          suggestion.forEach((c, i) => setTimeout(() => {
            const d = document.createElement("div");
            d.className = "code-line ghost";
            d.innerHTML = `<span class="ln">${base + i + 1}</span><span class="gtext">${esc(c)}</span>`;
            ghost.appendChild(d);
            if (i === suggestion.length - 1) { accept.disabled = false; suggestBtn.disabled = false; }
          }, 160 * (i + 1)));
        });
        accept.addEventListener("click", () => {
          ghost.querySelectorAll(".code-line").forEach((l) => l.classList.replace("ghost", "accepted"));
          accept.disabled = true;
          scan.innerHTML = `${I("shield", { size: 13 })} ${esc(scanMsg)}`;
        });
      },
    };
  }

  // ---- AI: assisted read (imaging / vision)
  function visionDemo(uc) {
    const products = canon(uc, 2);
    const sc = window.DEMOSCENES ? window.DEMOSCENES.vision(uc) : null;
    const caption = (sc && sc.caption) || "Sample image";
    const finding = (sc && sc.finding) || "Region of interest flagged";
    const conf = (sc && typeof sc.conf === "number") ? Math.round(sc.conf * 100) : 0;
    const note = (sc && sc.note) || "Illustrative finding for confirmation.";
    const cite = (sc && sc.cite) || `Inference via ${products.join(", ")}`;
    const boxStyle = sc ? `top:${sc.boxTop};left:${sc.boxLeft};width:${sc.boxW};height:${sc.boxH}` : "top:34%;left:50%;width:20%;height:18%";
    const inner =
      mockTag("Sample image analysis — fictional synthetic finding; a clinician confirms every read") +
      `<div class="vision-wrap"><div class="vision-canvas ${uc.subverticalId === "medtech" ? "vc-device" : "vc-scan"}" data-canvas role="button" tabindex="0"><span class="vc-hint">${esc(caption)} · click to scan</span>` +
      `<span class="vision-box" data-box hidden style="${boxStyle}"></span></div>` +
      `<div class="vision-side"><button class="btn primary" data-analyze>${I("spark", { size: 15 })} Analyze</button>` +
      `<div class="vision-out" data-out><span class="muted-hint">Click the image (or Analyze) to run a sample inference.</span></div></div></div>`;
    return {
      label: "AI · assisted read",
      html: chrome(`vision.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const box = root.querySelector("[data-box]");
        const out = root.querySelector("[data-out]");
        const canvas = root.querySelector("[data-canvas]");
        let analyzed = false;
        function analyze() {
          if (analyzed) return;
          analyzed = true;
          out.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
          setTimeout(() => {
            out.innerHTML =
              `<div class="vision-finding" data-find></div>` +
              `<p class="a-s" data-note></p>` +
              `<div class="toggle-row" style="margin-top:10px"><span>Sensitivity: flag at <strong data-th>75</strong>% conf.</span>` +
              `<input type="range" min="50" max="99" value="75" class="range" data-range aria-label="Sensitivity threshold"></div>` +
              `<span class="cite">${I("doc", { size: 12 })} ${esc(cite)}</span>`;
            const range = out.querySelector("[data-range]");
            const thEl = out.querySelector("[data-th]");
            const find = out.querySelector("[data-find]");
            const noteEl = out.querySelector("[data-note]");
            function applyTh() {
              const th = +range.value;
              thEl.textContent = th;
              const shown = conf >= th;
              box.hidden = !shown;
              find.innerHTML = shown
                ? `<strong>${esc(finding)}</strong> <span class="vf-conf">${conf}% conf.</span>`
                : `<strong>No finding above threshold</strong>`;
              noteEl.textContent = shown ? note : "Lower the sensitivity threshold to surface lower-confidence regions.";
              noteEl.classList.toggle("muted-hint", !shown);
            }
            range.addEventListener("input", applyTh);
            applyTh();
          }, 650);
        }
        root.querySelector("[data-analyze]").addEventListener("click", analyze);
        canvas.addEventListener("click", analyze);
        canvas.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); analyze(); } });
      },
    };
  }

  // ---- AI: predictive scoring (fraud / risk / forecast / optimization)
  function scoreDemo(uc) {
    const products = canon(uc, 2);
    const sc = window.DEMOSCENES ? window.DEMOSCENES.score(uc) : null;
    const items = (sc && sc.items) || [
      { id: "Item #1", name: "Sample item", score: 0.91, why: "High-risk pattern" },
      { id: "Item #2", name: "Sample item", score: 0.54, why: "Moderate signal" },
      { id: "Item #3", name: "Sample item", score: 0.12, why: "Minimal signal" },
    ];
    const title = (sc && sc.title) || "Predictive scoring";
    const cite = (sc && sc.cite) || `Scored via ${products.join(", ")}`;
    const inner =
      mockTag("Sample scoring — fictional synthetic items and scores; analysts review flagged items") +
      `<div class="score-head">${I("trending", { size: 14 })} ${esc(title)} — ranked by model score</div>` +
      `<div class="toggle-row"><span>Flag threshold: <strong data-th>0.50</strong> · <strong data-flagcount>0</strong> flagged</span>` +
      `<input type="range" min="0" max="100" value="50" class="range" data-range aria-label="Flag threshold"></div>` +
      `<div class="alert-list" data-items>` +
      items.map((it, i) => `<div class="alert-row clickable" data-item="${i}"><span class="score-pill">${it.score.toFixed(2)}</span>` +
        `<span><span class="a-t">${esc(it.id)} · ${esc(it.name)}</span><br><span class="a-s">${esc(it.why)}</span></span>` +
        `<span class="a-act" data-flag></span></div>`).join("") +
      `</div>` +
      `<div class="flow-detail" data-detail style="margin-top:12px">Select an item to see why it scored as it did.</div>` +
      `<div class="cite" style="margin-top:10px">${I("doc", { size: 12 })} ${esc(cite)}</div>`;
    return {
      label: "AI · predictive scoring",
      html: chrome(`score.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const range = root.querySelector("[data-range]");
        const thEl = root.querySelector("[data-th]");
        const detail = root.querySelector("[data-detail]");
        const rows = [...root.querySelectorAll("[data-item]")];
        function apply() {
          const th = +range.value / 100;
          thEl.textContent = th.toFixed(2);
          let flagged = 0;
          rows.forEach((row) => {
            const isFlagged = items[+row.dataset.item].score >= th;
            if (isFlagged) flagged++;
            const cell = row.querySelector("[data-flag]");
            cell.innerHTML = isFlagged ? `<span class="pill-status active">flagged</span>` : `<span class="pill-status contained">clear</span>`;
          });
          const fc = root.querySelector("[data-flagcount]");
          if (fc) fc.textContent = flagged;
        }
        rows.forEach((row) => row.addEventListener("click", () => {
          rows.forEach((r) => r.classList.remove("sel"));
          row.classList.add("sel");
          const it = items[+row.dataset.item];
          const pct = Math.round(it.score * 100);
          detail.innerHTML = `<strong>${esc(it.id)} · ${esc(it.name)}</strong> — model score ${it.score.toFixed(2)}` +
            `<div class="scorebar"><span style="width:${pct}%"></span></div>` +
            `<p class="a-s" style="margin-top:6px">Top contributing signal: ${esc(it.why)}. A person reviews before any action is taken.</p>`;
        }));
        range.addEventListener("input", apply);
        apply();
      },
    };
  }
  function addBubble(chat, who, html) {
    const b = document.createElement("div");
    b.className = "bubble " + who;
    b.innerHTML = html;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
    return b;
  }
  function trimDot(s) { return String(s || "").replace(/\.$/, ""); }

  // ------------------------------------------------------------- Apps (flow)
  function appsDemo(uc) {
    const steps = (window.DEMOSCENES ? window.DEMOSCENES.apps(uc) : null) || [
      { t: "Sign in", s: "Secure identity", d: "User authenticates with a managed identity provider (sample)." },
      { t: "Select task", s: "Self-service", d: `The user starts the "${uc.title}" journey from a modern, responsive UI.` },
      { t: "Complete action", s: "Guided flow", d: "A guided, validated flow captures the request and integrates with back-end systems via APIs (sample)." },
      { t: "Confirmation", s: "Done", d: "The user gets immediate confirmation and status; events flow to downstream systems." },
    ];
    const inner =
      mockTag("Sample app journey — clickable wireframe, not connected to live systems") +
      `<div class="flow" data-flow>` +
      steps.map((st, i) => `<button class="flow-step${i === 0 ? " active" : ""}" data-step="${i}">` +
        `<div class="fs-n">STEP ${i + 1}</div><div class="fs-t">${esc(st.t)}</div>` +
        `<div class="fs-s ${i === 0 ? "ok" : "pending"}">${esc(st.s)}</div></button>`).join("") +
      `</div>` +
      `<div class="flow-detail" data-detail>${esc(steps[0].d)}</div>` +
      `<div class="flow-progress"><span class="fp-bar" data-progress></span></div>` +
      `<div class="row-actions"><button class="btn" type="button" data-prev>Back</button>` +
      `<button class="btn primary" type="button" data-next>Next</button></div>`;
    return {
      html: chrome(`app.demo.local/${slug(uc.title).slice(0, 24)}`, inner),
      init(root) {
        const detail = root.querySelector("[data-detail]");
        const btns = [...root.querySelectorAll(".flow-step")];
        const progress = root.querySelector("[data-progress]");
        const nextBtn = root.querySelector("[data-next]");
        const prevBtn = root.querySelector("[data-prev]");
        let cur = 0;
        function goTo(n) {
          cur = Math.max(0, Math.min(btns.length - 1, n));
          btns.forEach((x, i) => {
            x.classList.toggle("active", i === cur);
            const s = x.querySelector(".fs-s");
            const done = i <= cur;
            s.className = "fs-s " + (done ? "ok" : "pending");
            s.textContent = done ? (i === cur ? steps[i].s : "Done") : steps[i].s;
          });
          detail.textContent = steps[cur].d;
          if (progress) progress.style.width = Math.round(((cur + 1) / btns.length) * 100) + "%";
          prevBtn.disabled = cur === 0;
          nextBtn.textContent = cur === btns.length - 1 ? "Restart" : "Next";
        }
        btns.forEach((b, i) => b.addEventListener("click", () => goTo(i)));
        nextBtn.addEventListener("click", () => { goTo(cur === btns.length - 1 ? 0 : cur + 1); });
        prevBtn.addEventListener("click", () => goTo(cur - 1));
        goTo(0);
      },
    };
  }

  // -------------------------------------------------------- Analytics (dashboard)
  function analyticsDemo(uc) {
    const a = window.DEMOSCENES ? window.DEMOSCENES.analytics(uc) : null;
    const views = (a && a.views) || [
      { id: "trend", label: "Trend", unit: "", cats: ["P1", "P2", "P3", "P4", "P5", "P6"], bars: [42, 55, 51, 63, 70, 78] },
    ];
    const kpis = (a && a.kpis) || [
      { l: "Sample metric A", v: "+18%", c: "up" }, { l: "Sample metric B", v: "−12%", c: "up" }, { l: "Sample coverage", v: "94%", c: "up" },
    ];
    const inner =
      mockTag("Sample dashboard — fictional synthetic figures for illustration only") +
      `<div class="kpi-row">` +
      kpis.map((k) => `<div class="kpi"><div class="kpi-l">${esc(k.l)}</div><div class="kpi-v">${esc(k.v)}</div>` +
        `<div class="kpi-d ${k.c}">${k.c === "up" ? "▲ improving" : "▼ down"}</div></div>`).join("") +
      `</div>` +
      `<div class="demo-tabs" data-tabs style="margin-top:16px">` +
      views.map((v, i) => `<button class="demo-tab${i === 0 ? " active" : ""}" data-view="${v.id}">${esc(v.label)}</button>`).join("") +
      `</div>` +
      `<div data-chart></div>` +
      `<div class="chart-readout" data-readout>Click a bar for detail</div>`;
    function chart(v) {
      const max = Math.max(...v.bars);
      const unit = v.unit ? `<span class="chart-unit">${esc(v.unit)}</span>` : "";
      return `<div class="chart-title">${esc(v.label)} ${unit}</div><div class="bars">` + v.bars.map((b, i) =>
        `<div class="bar-col"><div class="bv">${b}</div><div class="bar" style="height:${Math.round((b / max) * 100)}%"></div>` +
        `<div class="bl">${esc((v.cats && v.cats[i]) || "P" + (i + 1))}</div></div>`).join("") + `</div>`;
    }
    return {
      html: chrome(`fabric.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const host = root.querySelector("[data-chart]");
        const readout = root.querySelector("[data-readout]");
        function draw(id) {
          const v = views.find((x) => x.id === id) || views[0];
          host.innerHTML = chart(v);
          if (readout) readout.textContent = "Click a bar for detail";
          host.querySelectorAll(".bar-col").forEach((col, i) => col.addEventListener("click", () => {
            host.querySelectorAll(".bar-col").forEach((c) => c.classList.remove("sel"));
            col.classList.add("sel");
            const cat = (v.cats && v.cats[i]) || ("P" + (i + 1));
            if (readout) readout.innerHTML = `<strong>${esc(cat)}</strong>: ${v.bars[i]}${v.unit ? " " + esc(v.unit) : ""} <span class="muted-hint">· ${esc(v.label)}</span>`;
          }));
        }
        draw(views[0].id);
        root.querySelectorAll(".demo-tab").forEach((t) => t.addEventListener("click", () => {
          root.querySelectorAll(".demo-tab").forEach((x) => x.classList.toggle("active", x === t));
          draw(t.dataset.view);
        }));
      },
    };
  }

  // --------------------------------------------------------------- Data (lakehouse)
  function dataDemo(uc) {
    const sc = window.DEMOSCENES ? window.DEMOSCENES.data(uc) : null;
    const sources = (sc && sc.sources) || ["Clinical / EHR", "Claims", "Operational", "External / SDOH"];
    const consumers = (sc && sc.consumers) || ["Analytics & BI", "AI grounding", "Operational apps"];
    const gov = canon(uc, 3);
    const inner =
      mockTag("Sample data platform — node labels reflect this use case's mapped Azure services") +
      `<div class="lanes">` +
      `<div class="lane"><h5>Sources</h5>${sources.map((s) => `<span class="node-pill">${esc(s)}</span>`).join("")}</div>` +
      `<div class="lane-arrow">${I("arrowRight", { size: 26 })}</div>` +
      `<div class="lane"><h5>Unified foundation (OneLake)</h5>` +
      `<span class="node-pill" data-medallion="0">Bronze · raw</span><span class="node-pill" data-medallion="1">Silver · curated</span><span class="node-pill" data-medallion="2">Gold · serving</span></div>` +
      `</div>` +
      `<div class="row-actions" style="margin-top:10px"><button class="btn primary" type="button" data-run-pipe>${I("play", { size: 14 })} Run pipeline</button>` +
      `<span class="muted-hint" data-pipe-status>Idle</span></div>` +
      `<div class="lanes" style="margin-top:12px"><div class="lane"><h5>Consumers</h5>` +
      consumers.map((c) => `<span class="node-pill">${esc(c)}</span>`).join("") + `</div>` +
      `<div class="lane-arrow">${I("shield", { size: 24 })}</div>` +
      `<div class="lane"><h5>Governed by</h5>` +
      gov.map((g) => `<span class="node-pill">${esc(g)}</span>`).join("") + `</div></div>` +
      `<div class="gov-grid"><button class="gov-tile" data-gov="lineage"><span class="gic">${I("route", { size: 18 })}</span>` +
      `<span><span class="gt">Lineage</span><span class="gs">click to trace (sample)</span></span></button>` +
      `<button class="gov-tile" data-gov="class"><span class="gic">${I("lock", { size: 18 })}</span>` +
      `<span><span class="gt">PHI classification</span><span class="gs">click to scan (sample)</span></span></button>` +
      `<button class="gov-tile" data-gov="access"><span class="gic">${I("users", { size: 18 })}</span>` +
      `<span><span class="gt">Access policy</span><span class="gs">click to review (sample)</span></span></button></div>` +
      `<div class="flow-detail" data-detail style="margin-top:12px">Select a governance control above to see a sample view.</div>`;
    const detail = {
      lineage: "Sample lineage: source table → curated dataset → serving model → report. Full column-level lineage is captured automatically.",
      class: "Sample scan: 14 columns auto-classified as sensitive/PHI and labeled; protection policies applied (illustrative).",
      access: "Sample policy: role-based, least-privilege access with audit logging across the data estate (illustrative).",
    };
    return {
      html: chrome(`onelake.demo.local/${slug(uc.title).slice(0, 20)}`, inner),
      init(root) {
        const d = root.querySelector("[data-detail]");
        root.querySelectorAll("[data-gov]").forEach((b) => b.addEventListener("click", () => {
          root.querySelectorAll(".gov-tile").forEach((x) => x.style.borderColor = "");
          b.style.borderColor = "var(--ms-blue)";
          d.textContent = detail[b.dataset.gov];
        }));
        const runPipe = root.querySelector("[data-run-pipe]");
        const pipeStatus = root.querySelector("[data-pipe-status]");
        const meds = [...root.querySelectorAll("[data-medallion]")];
        const stageMsg = ["Ingesting raw data into Bronze…", "Curating & conforming into Silver…", "Publishing serving models into Gold…"];
        runPipe.addEventListener("click", () => {
          meds.forEach((m) => m.classList.remove("lit"));
          runPipe.disabled = true;
          meds.forEach((m, i) => setTimeout(() => {
            m.classList.add("lit");
            pipeStatus.textContent = stageMsg[i] || "";
            if (i === meds.length - 1) setTimeout(() => {
              pipeStatus.textContent = "Pipeline complete (sample) — Gold ready for analytics, AI grounding & apps.";
              runPipe.disabled = false;
            }, 500);
          }, 600 * (i + 1)));
        });
      },
    };
  }

  // --------------------------------------------------------------- Infra (migration)
  function infraDemo(uc) {
    const sc = window.DEMOSCENES ? window.DEMOSCENES.infra(uc) : null;
    const current = (sc && sc.current) || ["Legacy servers", "Aging databases", "Manual DR"];
    const rto = (sc && sc.rto) || "RTO 4h → 15 min";
    const phases = [
      { n: "Assess", d: "Discover & plan waves" },
      { n: "Migrate", d: "Factory-based moves" },
      { n: "Modernize", d: "Optimize & scale" },
      { n: "Operate", d: "Govern & secure" },
    ];
    const target = canon(uc, 4);
    const inner =
      mockTag("Sample migration view — target nodes reflect this use case's mapped Azure services") +
      `<div class="lanes"><div class="lane"><h5>Current (on-premises)</h5>` +
      current.map((c) => `<span class="node-pill">${esc(c)}</span>`).join("") + `</div>` +
      `<div class="lane-arrow">${I("arrowRight", { size: 26 })}</div>` +
      `<div class="lane"><h5>Target (Azure)</h5>` +
      target.map((t) => `<span class="node-pill">${esc(t)}</span>`).join("") + `</div></div>` +
      `<div class="timeline">` +
      phases.map((p, i) => `<div class="tl-phase" data-phase="${i}"><span class="dot"></span><div class="pn">${esc(p.n)}</div><div class="pd">${esc(p.d)}</div></div>`).join("") +
      `</div>` +
      `<div class="row-actions"><button class="btn primary" type="button" data-run-waves>${I("play", { size: 14 })} Run migration waves</button>` +
      `<span class="muted-hint" data-wave-status>4 waves planned</span></div>` +
      `<div class="toggle-row"><label class="switch"><input type="checkbox" data-dr><span class="track"></span></label>` +
      `<span data-drlabel>Disaster recovery: <strong>standby</strong> · ${esc(rto)} — flip to simulate failover</span></div>` +
      `<div class="flow-detail" data-drdetail>Primary region active. Recovery target is on standby (illustrative).</div>`;
    return {
      html: chrome(`portal.azure.demo.local/${slug(uc.title).slice(0, 18)}`, inner),
      init(root) {
        const cb = root.querySelector("[data-dr]");
        const label = root.querySelector("[data-drlabel]");
        const detail = root.querySelector("[data-drdetail]");
        cb.addEventListener("change", () => {
          if (cb.checked) {
            label.innerHTML = "Disaster recovery: <strong>failed over</strong> — secondary region serving traffic (sample)";
            detail.textContent = `Sample failover complete: workloads recovered to the secondary region within target (${rto}).`;
          } else {
            label.innerHTML = `Disaster recovery: <strong>standby</strong> · ${esc(rto)} — flip to simulate failover`;
            detail.textContent = "Primary region active. Recovery target is on standby (illustrative).";
          }
        });
        const runWaves = root.querySelector("[data-run-waves]");
        const waveStatus = root.querySelector("[data-wave-status]");
        const tlPhases = [...root.querySelectorAll("[data-phase]")];
        runWaves.addEventListener("click", () => {
          tlPhases.forEach((p) => p.classList.remove("done"));
          runWaves.disabled = true;
          tlPhases.forEach((p, i) => setTimeout(() => {
            p.classList.add("done");
            waveStatus.textContent = `Wave ${i + 1} of ${tlPhases.length}: ${phases[i].n} — ${phases[i].d} (sample)`;
            if (i === tlPhases.length - 1) setTimeout(() => {
              waveStatus.textContent = "All waves complete (sample) — workloads modernized & operating on Azure.";
              runWaves.disabled = false;
            }, 500);
          }, 650 * (i + 1)));
        });
      },
    };
  }

  // -------------------------------------------------------------- Security (SOC)
  function securityDemo(uc) {
    const tools = canon(uc, 3);
    const alerts = (window.DEMOSCENES ? window.DEMOSCENES.security(uc) : null) || [
      { sev: "high", t: "Suspicious sign-in (sample)", s: "Impossible-travel pattern detected", detail: "Identity revoked, session isolated, investigation playbook started." },
      { sev: "med", t: "Anomalous data access (sample)", s: "Unusual PHI query volume", detail: "Access isolated and reviewed." },
      { sev: "low", t: "Misconfiguration (sample)", s: "Public endpoint flagged", detail: "Auto-remediation tightened access." },
    ];
    const inner =
      mockTag("Sample SOC console — fictional synthetic alerts, not real incidents") +
      `<div class="kpi-row"><div class="kpi"><div class="kpi-l">Mean time to detect</div><div class="kpi-v">↓ 62%</div><div class="kpi-d up">faster</div></div>` +
      `<div class="kpi"><div class="kpi-l">Open alerts</div><div class="kpi-v" data-count>${alerts.length}</div><div class="kpi-d">live (sample)</div></div>` +
      `<div class="kpi"><div class="kpi-l">Protected by</div><div class="kpi-v" style="font-size:13px;font-weight:600">${esc(tools[0] || "Microsoft Sentinel")}</div></div></div>` +
      `<div class="seg-row" data-sevfilter style="margin-top:14px"><button class="seg-btn active" data-sev="all" type="button">All</button>` +
      `<button class="seg-btn" data-sev="high" type="button">High</button>` +
      `<button class="seg-btn" data-sev="med" type="button">Med</button>` +
      `<button class="seg-btn" data-sev="low" type="button">Low</button>` +
      `<button class="btn primary" type="button" data-triage-all style="margin-left:auto">${I("shield", { size: 14 })} Triage all</button></div>` +
      `<div class="alert-list" data-alerts style="margin-top:10px">` +
      alerts.map((a, i) => `<div class="alert-row" data-alert="${i}" data-sev="${a.sev}"><span class="sev ${a.sev}"></span>` +
        `<span><span class="a-t">${esc(a.t)}</span><br><span class="a-s">${esc(a.s)}</span></span>` +
        `<span class="a-act"><button class="btn" data-respond="${i}">Respond</button></span></div>`).join("") +
      `</div>` +
      `<div class="flow-detail" data-detail style="margin-top:12px">Triage an alert above. In production this is powered by ${esc(tools.join(", "))}.</div>`;
    return {
      html: chrome(`soc.demo.local/${slug(uc.title).slice(0, 22)}`, inner),
      init(root) {
        const detail = root.querySelector("[data-detail]");
        const count = root.querySelector("[data-count]");
        function respond(b) {
          const row = b.closest(".alert-row");
          if (row.classList.contains("done")) return;
          row.classList.add("done");
          const act = row.querySelector(".a-act");
          act.innerHTML = `<span class="pill-status contained">${I("check", { size: 12 })} Contained</span>`;
          let open = (+count.textContent || 1) - 1;
          count.textContent = open < 0 ? 0 : open;
          detail.textContent = "Auto-response: " + (alerts[+row.dataset.alert].detail || "containment playbook executed (illustrative).");
        }
        root.querySelectorAll("[data-respond]").forEach((b) => b.addEventListener("click", () => respond(b)));
        const triageAll = root.querySelector("[data-triage-all]");
        if (triageAll) triageAll.addEventListener("click", () => {
          let n = 0;
          root.querySelectorAll(".alert-row:not(.done)").forEach((row) => {
            if (row.style.display === "none") return;
            const b = row.querySelector("[data-respond]");
            if (b) setTimeout(() => respond(b), 250 * n++);
          });
          detail.textContent = "Auto-triage: containment playbooks executed across all visible alerts (illustrative).";
        });
        root.querySelectorAll("[data-sev]").forEach((chip) => chip.addEventListener("click", () => {
          root.querySelectorAll("[data-sev]").forEach((c) => c.classList.toggle("active", c === chip));
          const sev = chip.dataset.sev;
          root.querySelectorAll(".alert-row").forEach((row) => {
            row.style.display = (sev === "all" || row.dataset.sev === sev) ? "" : "none";
          });
        }));
      },
    };
  }

  const RENDERERS = {
    AI: aiDemo,
    Apps: appsDemo,
    Analytics: analyticsDemo,
    Data: dataDemo,
    Infra: infraDemo,
    Security: securityDemo,
  };
  const NONAI_LABEL = {
    Apps: "Apps · guided flow",
    Analytics: "Analytics · dashboard",
    Data: "Data · unified platform",
    Infra: "Infra · migration",
    Security: "Security · SOC console",
  };

  window.Demos = {
    // Returns { html, init(rootEl), label }. AI routes to a use-case-specific sub-demo.
    build(uc) {
      CURRENT_UC = uc;
      const fn = RENDERERS[uc.solutionCategory] || aiDemo;
      const result = fn(uc);
      if (!result.label) result.label = NONAI_LABEL[uc.solutionCategory] || uc.solutionCategory;
      CURRENT_UC = null;
      return result;
    },
    archetypeFor(uc) {
      return this.build(uc).label;
    },
  };
})();
