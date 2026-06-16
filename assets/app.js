// Render engine for the HLS Use Case Catalog.
// Builds the index/browse views and the full-screen use-case carousel.
// Vanilla JS, no build, works from file:// (data loaded via window.CATALOG global).

// ---- Theme (light/dark) ---------------------------------------------------
// Initial value is set by an inline <head> bootstrap to avoid a flash; this
// module handles the toggle button and persistence.
const Theme = (function () {
  const KEY = "hls-theme";
  function current() { return document.documentElement.getAttribute("data-theme") || "light"; }
  function apply(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(syncBtn);
  }
  function syncBtn(btn) {
    const dark = current() === "dark";
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    btn.title = dark ? "Light theme" : "Dark theme";
    btn.innerHTML = window.icon(dark ? "sun" : "moon", { size: 17 });
  }
  function toggle() { apply(current() === "dark" ? "light" : "dark"); }
  function makeButton(extraClass) {
    const b = document.createElement("button");
    b.className = "theme-toggle" + (extraClass ? " " + extraClass : "");
    b.type = "button";
    b.setAttribute("data-theme-toggle", "");
    b.addEventListener("click", toggle);
    syncBtn(b);
    return b;
  }
  return { current, toggle, makeButton };
})();

(function () {
  const CAT = window.CATALOG;
  const I = (n, o) => window.icon(n, o);

  const PAGE_FOR = {
    "health-providers": "providers.html",
    "health-payers": "payers.html",
    "pharma-life-sciences": "pharma.html",
    "medtech": "medtech.html",
  };
  const CATEGORIES = ["AI", "Apps", "Analytics", "Data", "Infra", "Security"];
  const CAT_ICON = { AI: "spark", Apps: "grid", Analytics: "chart", Data: "database", Infra: "server", Security: "shield" };
  const MOTION_ICON = {
    "PoV": "target", "Pilot": "play", "Assessment": "list", "Architecture Workshop": "layers",
    "Envisioning Workshop": "bulb", "Migration Factory": "factory", "Hackathon": "spark", "Briefing": "book",
  };
  const SUB_CLASS = {
    "health-providers": "sub-providers", "health-payers": "sub-payers",
    "pharma-life-sciences": "sub-pharma", "medtech": "sub-medtech",
  };
  // Generic role priorities (general business/role knowledge — not customer-specific).
  const ROLE_FOCUS = [
    [/revenue cycle/i, "net collections, denials, and cash flow"],
    [/chief financial|\bcfo\b|vp finance|controller|fp&a/i, "margin, cash flow, and ROI"],
    [/information security|\bciso\b|security/i, "risk, compliance, and breach exposure"],
    [/privacy/i, "privacy and PHI protection"],
    [/compliance|audit/i, "regulatory compliance and audit readiness"],
    [/medical information|\bcmio\b/i, "clinician adoption, workflow, and safety"],
    [/chief medical|\bcmo\b/i, "clinical quality, safety, and outcomes"],
    [/nursing|nurse/i, "staffing, workflow, and patient safety"],
    [/information officer|\bcio\b/i, "platform strategy, risk, and delivery"],
    [/chief technology|\bcto\b/i, "architecture and technical strategy"],
    [/chief data|data &|data and/i, "data strategy, governance, and AI readiness"],
    [/\bai officer|chief ai/i, "AI strategy, governance, and scale"],
    [/chief digital/i, "digital experience and engagement"],
    [/operating officer|\bcoo\b|operational|operations/i, "throughput, efficiency, and cost"],
    [/human resources|\bchro\b|workforce/i, "workforce, retention, and labor cost"],
    [/enterprise architect|architect/i, "architecture, standards, and integration"],
    [/procurement|sourcing/i, "cost, terms, and vendor risk"],
    [/patient access/i, "access, throughput, and patient experience"],
    [/patient experience|member experience|customer/i, "satisfaction and cost-to-serve"],
    [/contact center|member services/i, "handle time, resolution, and cost-to-serve"],
    [/utilization management/i, "appropriate utilization and medical cost"],
    [/care manage|clinical operations|care/i, "clinical workflow, capacity, and outcomes"],
    [/quality/i, "quality measures and safety"],
    [/network/i, "network performance, cost, and adequacy"],
    [/population health|value-based/i, "risk, quality scores, and shared savings"],
    [/supply chain|logistics|distribution/i, "continuity, cost, and service levels"],
    [/regulatory/i, "approvals, compliance, and time-to-market"],
    [/research|scientific|discovery|computational/i, "scientific productivity and pipeline velocity"],
    [/clinical develop|trial|biostat|pharmacovigilance|safety/i, "trial timelines, cost, and quality"],
    [/manufactur|plant|production|technical operations/i, "yield, uptime, and quality"],
    [/commercial|\bsales\b|marketing|brand/i, "engagement, conversion, and growth"],
    [/medical affairs|\bmsl\b/i, "scientific exchange and compliance"],
    [/product|engineering|developer|firmware|software/i, "delivery velocity and quality"],
    [/infrastructure/i, "cost, resilience, and operations"],
    [/analytics|business intelligence|\bbi\b/i, "time-to-insight and trusted data"],
  ];

  // Flatten all use cases.
  const ALL = [];
  CAT.subverticals.forEach((s) => s.stages.forEach((st) => st.useCases.forEach((uc) => ALL.push(uc))));

  const state = { q: "", subverticals: new Set(), stages: new Set(), categories: new Set(), motions: new Set(), grounding: new Set() };
  let FACETS = [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function groundClass(g) {
    if (/\+/.test(g)) return "mixed";
    if (/Inferred/i.test(g)) return "inferred";
    return "";
  }
  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }

  // ----------------------------------------------------------------- boot
  document.addEventListener("DOMContentLoaded", init);
  function init() {
    buildOverlay();
    markActiveNav();
    const page = document.body.dataset.page;
    if (page === "subvertical") {
      const sid = document.body.dataset.subvertical;
      state.subverticals.add(sid);
    }
    renderShell();
    window.addEventListener("hashchange", route);
    window.addEventListener("keydown", onKey);
    route();
  }

  function markActiveNav() {
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".topnav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === here || (here === "" && href === "index.html")) a.classList.add("active");
    });
    const inner = document.querySelector(".topbar-inner");
    if (inner && !inner.querySelector("[data-theme-toggle]")) inner.appendChild(Theme.makeButton("in-topbar"));
  }

  // ------------------------------------------------------------- shell render
  function renderShell() {
    const root = document.getElementById("app-root");
    if (!root) return;
    const page = document.body.dataset.page;
    if (page === "index") root.innerHTML = indexShell();
    else root.innerHTML = subShell(document.body.dataset.subvertical);
    wireFilters();
    renderResults();
  }

  function indexShell() {
    const subs = CAT.subverticals.length;
    return (
      `<section class="hero"><h1>HLS Use Case Catalog</h1>` +
      `<p>Field-ready use cases for Health Providers, Health Payers, Pharma / Life Sciences, and MedTech. ` +
      `Pick a use case, open it, and present directly — each includes a clickable mock demo.</p>` +
      `<div class="spine">Narrative spine: Modernize <span class="arrow">→</span> Trust <span class="arrow">→</span> Activate <span class="arrow">→</span> Outcomes</div>` +
      `</section>` +
      `<div class="stats">` +
      stat(ALL.length, "Use cases") +
      stat(subs, "Subverticals") +
      stat(CATEGORIES.length, "Solution patterns") +
      stat(distinct((u) => u.startingMotion).length, "Starting motions") +
      `</div>` +
      filtersHtml(true) +
      `<div id="results"></div>`
    );
  }
  function subShell(sid) {
    const sub = CAT.subverticals.find((s) => s.id === sid);
    const cls = SUB_CLASS[sid] || "";
    return (
      `<section class="subhero ${cls}"><h1>${esc(sub.name)}</h1>` +
      `<p>${esc(sub.summary)} — select a use case to open and present.</p></section>` +
      filtersHtml(false) +
      `<div id="results"></div>`
    );
  }
  function stat(n, l) { return `<div class="stat"><div class="n">${n}</div><div class="l">${esc(l)}</div></div>`; }

  function distinct(fn) { return [...new Set(ALL.map(fn))]; }

  function filtersHtml(showSub) {
    const stages = distinct((u) => u.stage);
    const motions = distinct((u) => u.startingMotion).sort();
    const groundings = distinct((u) => u.grounding);
    const scopeStages = document.body.dataset.page === "subvertical"
      ? CAT.subverticals.find((s) => s.id === document.body.dataset.subvertical).stages.map((s) => s.name)
      : stages;
    FACETS = [];
    if (showSub) FACETS.push({ key: "subverticals", label: "Subvertical", items: CAT.subverticals.map((s) => [s.id, s.name]) });
    FACETS.push({ key: "stages", label: "Stage", items: scopeStages.map((s) => [s, s]) });
    FACETS.push({ key: "categories", label: "Solution pattern", items: CATEGORIES.map((c) => [c, c]) });
    FACETS.push({ key: "motions", label: "Starting motion", items: motions.map((m) => [m, m]) });
    FACETS.push({ key: "grounding", label: "Grounding", items: groundings.map((g) => [g, shortGround(g)]) });
    return (
      `<div class="filters">` +
      `<div class="filter-bar">` +
      `<label class="search-box">${I("search")}` +
      `<input type="search" id="q" placeholder="Search use cases…" aria-label="Search use cases"></label>` +
      `<div class="facets">` + FACETS.map(facet).join("") + `</div>` +
      `<div class="filter-bar-end"><span id="result-count" class="result-count"></span>` +
      `<button class="btn-link" id="clear-filters" hidden>Clear all</button></div>` +
      `</div>` +
      `<div class="active-pills" id="active-pills"></div>` +
      `</div>`
    );
  }
  function shortGround(g) {
    if (/\+/.test(g)) return "Confirmed + Inferred";
    if (/Inferred/i.test(g)) return "Inferred pattern";
    return "Confirmed input";
  }
  function facet(f) {
    return (
      `<div class="facet" data-facet="${esc(f.key)}">` +
      `<button class="facet-btn" type="button" data-facet-toggle aria-expanded="false">` +
      `<span class="facet-label">${esc(f.label)}</span>` +
      `<span class="facet-count" data-facet-count hidden></span>` +
      `<span class="facet-caret">${I("chevronRight", { size: 14 })}</span></button>` +
      `<div class="facet-menu" hidden><div class="chips" data-group="${esc(f.key)}">` +
      f.items.map(([val, txt]) => `<button class="chip" type="button" aria-pressed="false" data-val="${esc(val)}">${esc(txt)}</button>`).join("") +
      `</div></div></div>`
    );
  }

  function wireFilters() {
    const q = document.getElementById("q");
    if (q) q.addEventListener("input", () => { state.q = q.value.trim().toLowerCase(); renderResults(); updateFilterChrome(); });

    document.querySelectorAll(".facet").forEach((facetEl) => {
      const key = facetEl.dataset.facet;
      const btn = facetEl.querySelector("[data-facet-toggle]");
      const menu = facetEl.querySelector(".facet-menu");
      btn.addEventListener("click", () => {
        const isOpen = !menu.hidden;
        closeAllMenus();
        if (!isOpen) { menu.hidden = false; btn.setAttribute("aria-expanded", "true"); facetEl.classList.add("open"); }
      });
      facetEl.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          const v = chip.dataset.val;
          if (state[key].has(v)) { state[key].delete(v); chip.setAttribute("aria-pressed", "false"); }
          else { state[key].add(v); chip.setAttribute("aria-pressed", "true"); }
          renderResults(); updateFilterChrome();
        });
      });
    });

    document.addEventListener("click", (e) => { if (!e.target.closest(".facet")) closeAllMenus(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !overlay.classList.contains("open")) closeAllMenus(); });

    const clear = document.getElementById("clear-filters");
    if (clear) clear.addEventListener("click", clearAllFilters);

    updateFilterChrome();
  }

  function closeAllMenus() {
    document.querySelectorAll(".facet.open").forEach((f) => {
      f.classList.remove("open");
      const m = f.querySelector(".facet-menu"); if (m) m.hidden = true;
      const b = f.querySelector("[data-facet-toggle]"); if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  function clearAllFilters() {
    state.q = "";
    ["subverticals", "stages", "categories", "motions", "grounding"].forEach((k) => state[k].clear());
    const q = document.getElementById("q"); if (q) q.value = "";
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    closeAllMenus();
    renderResults(); updateFilterChrome();
  }

  function updateFilterChrome() {
    FACETS.forEach((f) => {
      const facetEl = document.querySelector(`.facet[data-facet="${f.key}"]`);
      if (!facetEl) return;
      const n = state[f.key].size;
      const badge = facetEl.querySelector("[data-facet-count]");
      if (badge) { badge.hidden = n === 0; badge.textContent = n; }
      facetEl.classList.toggle("has-sel", n > 0);
    });
    const pillsEl = document.getElementById("active-pills");
    if (pillsEl) {
      const pills = [];
      if (state.q) pills.push({ key: "q", val: "", label: "Search", txt: state.q });
      FACETS.forEach((f) => f.items.forEach(([val, txt]) => { if (state[f.key].has(val)) pills.push({ key: f.key, val, label: f.label, txt }); }));
      pillsEl.innerHTML = pills.map((p, i) =>
        `<button class="active-pill" data-pill="${i}"><span class="ap-k">${esc(p.label)}:</span> ${esc(p.txt)} ${I("close", { size: 12 })}</button>`).join("");
      pillsEl.style.display = pills.length ? "flex" : "none";
      pillsEl.querySelectorAll("[data-pill]").forEach((btn, i) => {
        btn.addEventListener("click", () => {
          const p = pills[i];
          if (p.key === "q") { state.q = ""; const q = document.getElementById("q"); if (q) q.value = ""; }
          else {
            state[p.key].delete(p.val);
            const facetEl = document.querySelector(`.facet[data-facet="${p.key}"]`);
            if (facetEl) facetEl.querySelectorAll(".chip").forEach((c) => { if (c.dataset.val === p.val) c.setAttribute("aria-pressed", "false"); });
          }
          renderResults(); updateFilterChrome();
        });
      });
    }
    const clear = document.getElementById("clear-filters");
    if (clear) clear.hidden = !(state.q || FACETS.some((f) => state[f.key].size));
  }

  function matches(uc) {
    if (state.subverticals.size && !state.subverticals.has(uc.subverticalId)) return false;
    if (state.stages.size && !state.stages.has(uc.stage)) return false;
    if (state.categories.size && !state.categories.has(uc.solutionCategory)) return false;
    if (state.motions.size && !state.motions.has(uc.startingMotion)) return false;
    if (state.grounding.size && !state.grounding.has(uc.grounding)) return false;
    if (state.q) {
      const hay = (uc.title + " " + uc.problem + " " + uc.businessValue + " " + uc.buyerPrimary).toLowerCase();
      if (!hay.includes(state.q)) return false;
    }
    return true;
  }

  function renderResults() {
    const host = document.getElementById("results");
    if (!host) return;
    const items = ALL.filter(matches);
    const count = document.getElementById("result-count");
    if (count) count.textContent = `${items.length} of ${ALL.length} use cases`;

    if (!items.length) { host.innerHTML = `<div class="empty">No use cases match your filters. Try clearing some filters.</div>`; return; }

    // Group: index -> subvertical -> stage; subvertical page -> stage.
    let html = "";
    const onIndex = document.body.dataset.page === "index";
    if (onIndex) {
      CAT.subverticals.forEach((sub) => {
        const subItems = items.filter((u) => u.subverticalId === sub.id);
        if (!subItems.length) return;
        html += `<h2 class="stage-head" style="font-size:20px"><span class="badge subv-badge ${SUB_CLASS[sub.id]}">${esc(sub.name)}</span><span class="count">${subItems.length}</span></h2>`;
        html += stagesBlock(sub, subItems);
      });
    } else {
      const sub = CAT.subverticals.find((s) => s.id === document.body.dataset.subvertical);
      html += stagesBlock(sub, items);
    }
    host.innerHTML = html;
    host.querySelectorAll("[data-open]").forEach((c) => {
      c.addEventListener("click", () => { location.hash = "uc/" + c.dataset.open; });
    });
  }

  function stagesBlock(sub, items) {
    let html = "";
    sub.stages.forEach((stage) => {
      const stItems = items.filter((u) => u.stageId === stage.id);
      if (!stItems.length) return;
      html += `<section class="stage-section"><div class="stage-head"><h2>${esc(stage.name)}</h2>` +
        `<span class="count">${stItems.length}</span></div><div class="card-grid">` +
        stItems.map(card).join("") + `</div></section>`;
    });
    return html;
  }

  function card(uc) {
    const subCls = SUB_CLASS[uc.subverticalId] || "";
    return (
      `<button class="card ${subCls}" data-open="${esc(uc.subverticalId)}/${esc(uc.id)}">` +
      `<div class="card-top"><span class="badge cat cat-${uc.solutionCategory}">${esc(uc.solutionCategory)}</span>` +
      `<span class="badge ground ${groundClass(uc.grounding)}">${esc(shortGround(uc.grounding))}</span></div>` +
      `<h3>${esc(uc.title)}</h3>` +
      `<p class="card-problem">${esc(uc.problem)}</p>` +
      `<div class="card-foot"><span class="motion-pill">${I(MOTION_ICON[uc.startingMotion] || "target", { size: 14 })} ${esc(uc.startingMotion)}</span>` +
      `<span class="open-cue">Open use case ${I("arrowRight", { size: 14 })}</span></div>` +
      `</button>`
    );
  }

  // ------------------------------------------------------------- use case overlay
  let overlay, track, dotsEl, progressEl, titleEl, subEl;
  let current = null; // { uc, slide }
  function buildOverlay() {
    overlay = el(
      `<div class="uc-overlay" role="dialog" aria-modal="true" aria-label="Use case">` +
      `<div class="uc-bar">` +
      `<button class="iconbtn" data-close title="Back to catalog" aria-label="Close">${I("close")}</button>` +
      `<div class="pb-meta"><span class="pb-title"></span><span class="pb-sub"></span></div>` +
      `<span class="spacer"></span>` +
      `<button class="btn" data-present title="Present full screen">${I("present", { size: 16 })} Present</button>` +
      `</div>` +
      `<div class="uc-stage">` +
      `<button class="edge-nav left" data-prev aria-label="Previous slide"></button>` +
      `<div class="uc-track"></div>` +
      `<button class="edge-nav right" data-next aria-label="Next slide"></button>` +
      `</div>` +
      `<div class="uc-foot">` +
      `<span class="slide-progress"></span>` +
      `<div class="dots"></div>` +
      `<div class="nav-arrows"><button class="iconbtn" data-prev aria-label="Previous">${I("chevronLeft")}</button>` +
      `<button class="iconbtn primary" data-next aria-label="Next">${I("chevronRight")}</button></div>` +
      `</div></div>`
    );
    document.body.appendChild(overlay);
    track = overlay.querySelector(".uc-track");
    dotsEl = overlay.querySelector(".dots");
    progressEl = overlay.querySelector(".slide-progress");
    titleEl = overlay.querySelector(".pb-title");
    subEl = overlay.querySelector(".pb-sub");
    overlay.querySelector(".uc-bar .spacer").after(Theme.makeButton("in-ucbar"));
    overlay.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => { location.hash = ""; }));
    overlay.querySelectorAll("[data-prev]").forEach((b) => b.addEventListener("click", () => go(-1)));
    overlay.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => go(1)));
    overlay.querySelector("[data-present]").addEventListener("click", togglePresent);
  }

  // -------- hash routing
  function route() {
    const m = /^#uc\/([^/]+)\/(.+)$/.exec(location.hash);
    if (m) {
      const uc = ALL.find((u) => u.subverticalId === decodeURIComponent(m[1]) && u.id === decodeURIComponent(m[2]));
      if (uc) { openUseCase(uc); return; }
    }
    closeUseCase();
  }

  function openUseCase(uc) {
    current = { uc, slide: 0, slides: buildSlides(uc) };
    titleEl.textContent = uc.title;
    subEl.textContent = uc.subvertical + " · " + uc.stage;
    overlay.dataset.sub = uc.subverticalId;
    track.innerHTML = current.slides.map((s, i) => `<div class="slide" data-slide="${i}">${s.html}</div>`).join("");
    dotsEl.innerHTML = current.slides.map((s, i) => `<button class="dot" data-go="${i}" title="${esc(s.label)}" aria-label="${esc(s.label)}"></button>`).join("");
    dotsEl.querySelectorAll("[data-go]").forEach((d) => d.addEventListener("click", () => show(+d.dataset.go)));
    // init interactive demo slide
    current.slides.forEach((s, i) => { if (s.init) s.init(track.querySelector(`[data-slide="${i}"]`)); });
    overlay.classList.add("open");
    document.body.classList.add("uc-open");
    show(0);
  }
  function closeUseCase() {
    if (!overlay.classList.contains("open")) return;
    overlay.classList.remove("open", "present");
    document.body.classList.remove("uc-open");
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    current = null;
  }
  function show(i) {
    if (!current) return;
    current.slide = Math.max(0, Math.min(current.slides.length - 1, i));
    track.querySelectorAll(".slide").forEach((s, idx) => s.classList.toggle("active", idx === current.slide));
    dotsEl.querySelectorAll(".dot").forEach((d, idx) => d.classList.toggle("active", idx === current.slide));
    progressEl.textContent = `${current.slide + 1} / ${current.slides.length} · ${current.slides[current.slide].label}`;
    const active = track.querySelector(".slide.active"); if (active) { active.scrollTop = 0; animateCounters(active); }
  }
  function go(d) { if (current) show(current.slide + d); }

  function animateCounters(slideEl) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slideEl.querySelectorAll(".cnt[data-to]").forEach((node) => {
      const to = parseFloat(node.dataset.to);
      const dec = node.dataset.dec === "1";
      const fmt = (v) => (dec ? v.toFixed(1) : Math.round(v).toString());
      if (reduce || !isFinite(to)) { node.textContent = fmt(to); return; }
      const dur = 900, start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = fmt(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function togglePresent() {
    overlay.classList.toggle("present");
    if (!document.fullscreenElement) overlay.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }

  function onKey(e) {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { go(1); e.preventDefault(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { go(-1); e.preventDefault(); }
    else if (e.key === "Escape") { if (document.fullscreenElement) { /* browser exits FS */ } else location.hash = ""; }
    else if (e.key.toLowerCase() === "f") togglePresent();
  }

  // -------- slide builders
  function kicker(no, text, ic) {
    return `<div class="slide-kicker"><span class="step-no">${no}</span>${I(ic || "spark", { size: 14 })} ${esc(text)}</div>`;
  }
  function roleFocus(role) {
    for (const [re, f] of ROLE_FOCUS) if (re.test(role)) return f;
    return null;
  }
  function splitOutcomes(text) {
    return String(text || "").split(/;\s*/).map((s) => s.trim().replace(/\.$/, "")).filter(Boolean);
  }
  function valueLevers(text) {
    const t = String(text || "").toLowerCase();
    const out = [];
    if (/cost|spend|margin|efficien|expense|overtime|agency|leakage|write-off/.test(t)) out.push("Cost ↓");
    if (/revenue|growth|acquisition|retention|collections|reimburse|enrol|win rate|share/.test(t)) out.push("Revenue ↑");
    if (/risk|complian|safety|breach|denial|audit|error|fraud|exposure/.test(t)) out.push("Risk ↓");
    if (/time|faster|cycle|turnaround|speed|throughput|delay|wait|velocity/.test(t)) out.push("Time ↓");
    if (/experience|satisfaction|engagement|access|loyalty|abrasion/.test(t)) out.push("Experience ↑");
    if (/quality|outcome|accuracy|adoption|consistency|productivity/.test(t)) out.push("Quality ↑");
    return [...new Set(out)];
  }
  function genericDiscovery(uc) {
    const m = (uc.startingMotion || "engagement").toLowerCase();
    return [
      "What does success look like 6–12 months after this is in place?",
      "How are you measuring this today, and what is the target?",
      "Who owns the budget and the decision, and what is the approval path?",
      "Which systems and data sources would this need to work with?",
      `Who needs to be involved to move from a ${m} to production?`,
    ];
  }

  // ---- Impact metrics -------------------------------------------------------
  // Surface ONLY figures that literally appear in this use case's own text
  // (businessValue / problem). No external benchmarks are added or invented.
  const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
  function classifyMetric(ctx) {
    if (/roi|return on invest/i.test(ctx)) return "Return on investment";
    if (/visit|capacity|additional|extra|more\b|increase|growth|throughput|collections|win\b/i.test(ctx)) return "Capacity & growth";
    if (/\$|\bcost\b|saving|spend|margin|write-off|overtime|leakage|agency/i.test(ctx)) return "Cost impact";
    if (/faster|sooner|shorter|turnaround|time-to|cycle|wait|delay|speed|response time|days?|hours?|weeks?/i.test(ctx)) return "Time saved";
    if (/reduc|cut|lower|fewer|less|down|decrease|avoid|prevent/i.test(ctx)) return "Reduction";
    if (/revenue|reimburse|enrol/i.test(ctx)) return "Capacity & growth";
    return "Stated outcome";
  }
  function parseMetrics(uc) {
    const sentences = String(uc.businessValue + " " + uc.problem).split(/(?<=[.;])\s+/);
    const out = [], seen = new Set();
    const add = (value, suffix, prefix, sentence, ctx) => {
      const key = prefix + value + suffix;
      if (seen.has(key) || !isFinite(value)) return;
      seen.add(key);
      out.push({ value, suffix, prefix, label: classifyMetric(ctx), sub: sentence.trim().replace(/\s+/g, " ") });
    };
    sentences.forEach((s) => {
      let m;
      const win = (mm) => s.slice(Math.max(0, mm.index - 36), mm.index + mm[0].length + 36);
      const pct = /(\d{1,3}(?:\.\d+)?)\s*(?:percent|%)/gi;
      while ((m = pct.exec(s))) add(parseFloat(m[1]), "%", "", s, win(m));
      const money = /\$\s?(\d+(?:\.\d+)?)\s*(billion|million|thousand|b|m|k)?\b/gi;
      while ((m = money.exec(s))) {
        const suf = { billion: "B", million: "M", thousand: "K", b: "B", m: "M", k: "K" }[(m[2] || "").toLowerCase()] || "";
        add(parseFloat(m[1]), suf, "$", s, win(m));
      }
      const wn = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b[^.;]{0,28}?\b(visits?|days?|weeks?|hours?|months?|points?|fold|languages?)\b/gi;
      while ((m = wn.exec(s))) {
        const fwd = m[0] + " " + s.slice(m.index + m[0].length, m.index + m[0].length + 30);
        add(WORD_NUM[m[1].toLowerCase()], " " + m[2], "", s, fwd);
      }
    });
    return out.slice(0, 4);
  }
  function metricsBlock(uc) {
    const ms = parseMetrics(uc);
    let cards = ms.map((m, i) => {
      const dec = m.value % 1 !== 0;
      const init = dec ? m.value.toFixed(1) : String(m.value);
      return `<div class="imp-card reveal st${i + 1}">` +
        `<div class="imp-val"><span class="imp-pre">${esc(m.prefix)}</span>` +
        `<span class="cnt" data-to="${m.value}" data-dec="${dec ? 1 : 0}">${init}</span>` +
        `<span class="imp-suf">${esc(m.suffix)}</span></div>` +
        `<div class="imp-lbl">${esc(m.label)}</div>` +
        `<div class="imp-sub">${esc(m.sub)}</div></div>`;
    });
    if (cards.length < 2) {
      valueLevers(uc.businessValue).forEach((l) => {
        if (cards.length >= 4) return;
        cards.push(`<div class="imp-card reveal lever st${cards.length + 1}">` +
          `<div class="imp-val small">${esc(l)}</div>` +
          `<div class="imp-lbl">Value lever</div>` +
          `<div class="imp-sub">Directional impact based on this use case's stated business value.</div></div>`);
      });
    }
    const note = ms.length
      ? `${I("bulb", { size: 14 })} Figures are drawn verbatim from this use case's stated business value — no external benchmarks added.`
      : `${I("bulb", { size: 14 })} Qualitative value levers from this use case's business value — this use case states no published metric.`;
    return `<div class="impact-grid">${cards.join("")}</div><div class="imp-note">${note}</div>`;
  }
  function firstPercent(uc) {
    const m = parseMetrics(uc).find((x) => x.suffix === "%");
    return m ? `${m.value}% ${m.label === "Return on investment" ? "ROI" : "impact"}` : null;
  }

  // ---- Audience + architecture ---------------------------------------------
  function audienceLabel(uc) {
    const t = (uc.title + " " + uc.problem + " " + uc.buyerPrimary + " " + uc.buyerStakeholders.join(" ")).toLowerCase();
    if (uc.subverticalId === "health-providers") return /patient (portal|engagement|experience|access)|self-schedul|scheduling|check-in|telehealth|multilingual|health equity|equity outreach|no-show|outreach/.test(t) ? "Patient-facing" : "Clinician-facing";
    if (uc.subverticalId === "health-payers") return /broker/.test(t) ? "Broker-facing" : /member|enrol/.test(t) ? "Member-facing" : "Payer operations";
    if (uc.subverticalId === "pharma-life-sciences") return /msl|field|sales|commercial|\brep\b|market access/.test(t) ? "Field & commercial" : "R&D & scientific";
    if (uc.subverticalId === "medtech") return /service|customer|commercial|sales/.test(t) ? "Commercial & service" : "Product & engineering";
    return "Enterprise";
  }
  function flagshipService(uc) {
    const raw = uc.azureWorkloads[0];
    const r = raw && window.resolveWorkload(raw);
    return (r && (r.name || r.rawName)) || raw || null;
  }
  // ---- Architecture flow / diagram ---------------------------------------
  // The Architecture slide uses category-aware templates so the stage labels and
  // the classification of services match the actual shape of the use case. Each
  // template defines 4 stages with name + icon + regex; services that don't match
  // any stage land in the template's `residual` bucket (typically the platform /
  // operations stage) instead of polluting the AI bucket.
  const ARCH_TEMPLATES = {
    AI: {
      stages: [
        { id: "ingest", label: "Ingest & connect", icon: "database",
          re: /fhir|health data|data factory|event hub|event grid|iot|stream|integration|api management|data lake|ingest|onboard|communication services|signalr/i },
        { id: "ai", label: "Reason & generate", icon: "spark",
          re: /openai|foundry|machine learning|\bml\b|document intelligence|speech|vision|language|translator|content understanding|cognitive|anthropic|\bmodel\b|bot service|copilot studio|github copilot/i },
        { id: "ground", label: "Ground & govern", icon: "shield",
          re: /\bsearch\b|purview|key vault|entra|defender|sentinel|security copilot|github advanced|firewall|network security|policy|governance|cosmos|\bsql\b|postgres|databricks|fabric|onelake|synapse|storage|netapp|lustre|\bhpc\b|monitor|arc|backup|business continuity|bcdr|expressroute|epic|sap|windows server|linux|mainframe|virtual machine|\bvm\b/i },
        { id: "act", label: "Deliver & act", icon: "route",
          re: /app service|container apps|aks|kubernetes|functions|logic apps|service bus|teams|web app|power apps|power bi|power platform|power automate|dynamics|virtual desktop/i },
      ],
      residual: "ground",
      fallback: { ingest: "Source systems & data", ai: "Azure AI services", ground: "Secure, governed data", act: "Users & workflows" },
    },
    Analytics: {
      stages: [
        { id: "sources", label: "Sources", icon: "database",
          re: /fhir|health data|data factory|event hub|event grid|iot|stream|integration|api management|on-prem|connector|ingest|communication services|signalr/i },
        { id: "platform", label: "Unified platform", icon: "layers",
          re: /fabric|onelake|databricks|synapse|delta|lakehouse|warehouse|storage|netapp|lustre|\bhpc\b|cosmos|\bsql\b|postgres|data lake/i },
        { id: "serve", label: "Serve", icon: "spark",
          re: /power bi|notebook|machine learning|\bml\b|openai|foundry|\bmodel\b|search|copilot|vision|speech|language|cognitive|anthropic|document intelligence|content understanding/i },
        { id: "consume", label: "Consume", icon: "route",
          re: /app service|container apps|aks|kubernetes|functions|logic apps|teams|web app|power apps|power platform|power automate|dynamics|bot service|virtual desktop/i },
      ],
      residual: "platform",
      fallback: { sources: "Source systems", platform: "Microsoft Fabric / OneLake", serve: "AI & BI", consume: "Apps & users" },
    },
    Apps: {
      stages: [
        { id: "client", label: "Client", icon: "users",
          re: /power apps|teams|dynamics|web app|portal|copilot studio|virtual desktop|communication services|signalr/i },
        { id: "api", label: "API & logic", icon: "layers",
          re: /app service|functions|logic apps|api management|container apps|aks|kubernetes|service bus|event grid|event hub|bot service/i },
        { id: "data", label: "Data", icon: "database",
          re: /\bsql\b|cosmos|postgres|storage|fabric|onelake|databricks|synapse|netapp|lustre|fhir|health data|data factory|data lake/i },
        { id: "platform", label: "Platform & security", icon: "shield",
          re: /entra|key vault|monitor|sentinel|defender|github|devops|\barc\b|firewall|network security|policy|governance|expressroute|bcdr|business continuity|copilot for security|security copilot|\bhpc\b|backup|recovery/i },
      ],
      residual: "platform",
      fallback: { client: "Users & devices", api: "App services & APIs", data: "Application data", platform: "Identity, monitoring & security" },
    },
    Infra: {
      stages: [
        { id: "assess", label: "Assess", icon: "list",
          re: /migration|landing zone|cloud adoption|migrate|assess|inventory|arc-enabled|\barc\b/i },
        { id: "migrate", label: "Migrate", icon: "factory",
          re: /sap|vmware|epic|mainframe|midrange|oracle|\bsql server\b|\bsql vm\b|sqlvm|windows server|linux|red hat|virtual machine|\bvm\b|\bgpu\b/i },
        { id: "modernize", label: "Modernize", icon: "spark",
          re: /app service|container apps|kubernetes|aks|managed instance|postgres|cosmos|fabric|onelake|synapse|databricks|functions|storage|logic apps|api management|event grid|event hub|service bus|communication services/i },
        { id: "operate", label: "Operate & secure", icon: "shield",
          re: /monitor|sentinel|defender|entra|key vault|policy|governance|backup|recovery|business continuity|bcdr|netapp|lustre|\bhpc\b|firewall|network security|expressroute|copilot for security|security copilot|github advanced|github enterprise|github copilot|devops|purview/i },
      ],
      residual: "operate",
      fallback: { assess: "Discovery & planning", migrate: "Lift, shift & replatform", modernize: "Cloud-native services", operate: "Run, monitor & secure" },
    },
    Data: null, // alias of Analytics, set below
    Security: {
      stages: [
        { id: "identity", label: "Identity", icon: "users",
          re: /entra|identity|access|copilot studio|github copilot/i },
        { id: "network", label: "Network", icon: "layers",
          re: /firewall|\bwaf\b|\bddos\b|front door|bastion|network security|expressroute|virtual wan|api management/i },
        { id: "data", label: "Data & apps", icon: "shield",
          re: /purview|key vault|\bsql\b|cosmos|postgres|storage|fhir|health data|data factory|policy|governance|defender for ai|fabric|onelake|databricks|github advanced|github enterprise|app service|container apps|aks|kubernetes|functions|logic apps/i },
        { id: "ops", label: "Detect & respond", icon: "spark",
          re: /sentinel|security copilot|copilot for security|defender|monitor|\barc\b|backup|recovery|business continuity|bcdr|machine learning|\bml\b|openai|foundry/i },
      ],
      residual: "ops",
      fallback: { identity: "Identity & access", network: "Network security", data: "Data & app protection", ops: "Detection & response" },
    },
  };
  ARCH_TEMPLATES.Data = ARCH_TEMPLATES.Analytics;
  // Default template if a use case has an unknown category.
  const DEFAULT_TEMPLATE = ARCH_TEMPLATES.AI;

  function templateFor(uc) {
    return ARCH_TEMPLATES[uc.solutionCategory] || DEFAULT_TEMPLATE;
  }
  // Classify this use case's azureWorkloads into the template's stages.
  // Returns { stages: [...], buckets: { id: [items...] } } where each item is a
  // resolved-product object { name, short?, ... } so chip rendering can use the
  // canonical short name without re-resolving (which loses context).
  function classifyWorkloads(uc) {
    const tpl = templateFor(uc);
    const buckets = {};
    tpl.stages.forEach((s) => { buckets[s.id] = []; });
    const seen = new Set();
    (uc.azureWorkloads || []).forEach((raw) => {
      const r = window.resolveWorkload(raw) || { rawName: String(raw) };
      const name = r.name || r.rawName || String(raw);
      if (seen.has(name)) return;
      seen.add(name);
      const stage = tpl.stages.find((s) => s.re.test(name))
        || tpl.stages.find((s) => s.id === tpl.residual)
        || tpl.stages[tpl.stages.length - 1];
      buckets[stage.id].push({ name, short: r.short });
    });
    return { tpl, buckets };
  }
  // Chip-friendly display name for a resolved-product object: prefers `short`,
  // otherwise strips a redundant "Azure" prefix from the canonical name.
  function chipName(item) {
    if (!item) return "";
    if (typeof item === "string") {
      const r = window.resolveWorkload(item) || {};
      if (r.short) return r.short;
      return (r.name || r.rawName || item).replace(/^Azure\s+/, "");
    }
    if (item.short) return item.short;
    return String(item.name || "").replace(/^Azure\s+/, "");
  }

  function archFlow(uc) {
    const { tpl, buckets } = classifyWorkloads(uc);
    const cols = tpl.stages.map((s, i) => {
      const items = buckets[s.id];
      const chips = items.length
        ? items.map((it) => `<div class="arch-svc"><span class="az-badge">Azure</span>${esc(chipName(it))}</div>`).join("")
        : `<div class="arch-svc muted">${esc(tpl.fallback[s.id])}</div>`;
      return `<div class="arch-node reveal st${i + 1}"><div class="arch-ico">${I(s.icon, { size: 20 })}</div>` +
        `<div class="arch-stage">${esc(s.label)}</div>${chips}</div>` +
        (i < tpl.stages.length - 1 ? `<div class="arch-arrow">${I("arrowRight", { size: 18 })}</div>` : "");
    }).join("");
    return `<div class="arch-flow">${cols}</div>`;
  }

  // Map this use case's services onto the 4 workflow steps (template stages)
  // so "how it works" reads as concrete actions tied to named Azure services.
  function flowSteps(uc) {
    const labels = window.UCCONTENT ? window.UCCONTENT.steps(uc) : ["Connect the data", "Apply AI", "Ground & govern", "Deliver to users"];
    const { tpl, buckets } = classifyWorkloads(uc);
    return labels.slice(0, 4).map((label, i) => {
      const s = tpl.stages[i] || tpl.stages[tpl.stages.length - 1];
      const first = buckets[s.id][0];
      return { label, svc: first ? chipName(first) : tpl.fallback[s.id] };
    });
  }
  // Short, fact-free rationale for a discovery question (the reference "why it works" subtext).
  function qWhy(q) {
    const t = String(q || "").toLowerCase();
    if (/how many|how much|volume|hours|per (week|day|month|provider)|what (is|'s) the (rate|cost|target)/.test(t)) return "Sizes the problem — and the prize.";
    if (/cost|turnover|spend|budget|\broi\b|revenue|save/.test(t)) return "Builds the business case.";
    if (/who (owns|needs)|decision|approv|stakeholder|sponsor|involved/.test(t)) return "Maps the buying process.";
    if (/which|where|what systems|\bdata\b|integrat|source|system/.test(t)) return "Pinpoints where to start.";
    if (/success|measur|target|outcome|kpi|look like/.test(t)) return "Defines what winning looks like.";
    return "Surfaces the gap this use case closes.";
  }

  // ---- Visual components (grounded in catalog text + Microsoft Learn enrichment) ----
  // Solution-pattern coverage strip: highlights which of the 6 Microsoft solution
  // patterns this use case uses (from uc.solutionCategories — the FY27 catalog field).
  function coverageBar(uc) {
    const set = new Set(uc.solutionCategories || [uc.solutionCategory].filter(Boolean));
    return `<div class="coverage-bar" role="img" aria-label="Solution pattern coverage">` +
      CATEGORIES.map((c) => {
        const on = set.has(c);
        return `<div class="cov-cell ${on ? "on" : "off"} cov-${c}" title="${esc(c)}${on ? " — in this use case" : ""}">` +
          `<span class="cov-ic">${I(CAT_ICON[c], { size: 14 })}</span>` +
          `<span class="cov-lbl">${esc(c)}</span>` +
          `<span class="cov-dot" aria-hidden="true"></span></div>`;
      }).join("") +
      `</div>` +
      `<div class="enrich-note">${I("bulb", { size: 14 })} Solution-pattern coverage from this use case's FY27 Use Case Catalog entry — Microsoft HLS source.</div>`;
  }

  // Value-lever distribution: 6 standard levers, lit when present in this use case's
  // catalog text (using the existing valueLevers heuristic — no invented data).
  const LEVERS = [
    { id: "Cost ↓", icon: "trending", title: "Cost down" },
    { id: "Revenue ↑", icon: "trending", title: "Revenue up" },
    { id: "Risk ↓", icon: "shield", title: "Risk down" },
    { id: "Time ↓", icon: "clock", title: "Time saved" },
    { id: "Experience ↑", icon: "heart", title: "Experience up" },
    { id: "Quality ↑", icon: "check", title: "Quality up" },
  ];
  function leverBar(uc) {
    const present = new Set(valueLevers(uc.businessValue));
    const total = LEVERS.length;
    const lit = LEVERS.filter((l) => present.has(l.id)).length;
    return `<div class="lever-block">` +
      `<div class="wl-subhead">Value levers this use case moves <span class="subhead-note">— ${lit}/${total}, derived from this use case's stated business value</span></div>` +
      `<div class="lever-bar">` +
      LEVERS.map((l) => {
        const on = present.has(l.id);
        return `<div class="lev-cell ${on ? "on" : "off"}" title="${esc(l.title)}${on ? " — moved by this use case" : ""}">` +
          `<span class="lev-ic">${I(l.icon, { size: 14 })}</span>` +
          `<span class="lev-lbl">${esc(l.id)}</span>` +
          `<span class="lev-fill" aria-hidden="true"></span></div>`;
      }).join("") +
      `</div></div>`;
  }

  // SVG architecture diagram: 4 stages (per the use case's category template), nodes
  // per stage, arrow connectors. Long names wrap onto 2 lines instead of being
  // truncated mid-word.
  function archDiagram(uc) {
    const { tpl, buckets } = classifyWorkloads(uc);
    const W = 960, MX = 20, nW = 208, nH = 44, gap = 8;
    const colW = (W - 2 * MX) / 4;
    const cx = (i) => MX + colW * i + colW / 2;
    const labelY = 14, labelH = 36, itemsTop = labelY + labelH + 14;
    const stages = tpl.stages.map((s, i) => ({
      ...s, x: cx(i),
      items: buckets[s.id].length ? buckets[s.id] : [{ name: tpl.fallback[s.id], fallback: true }],
      fallback: !buckets[s.id].length,
    }));
    const maxItems = Math.max(...stages.map((s) => Math.min(s.items.length, 4)));
    const H = itemsTop + maxItems * (nH + gap) + 18;

    let svg = `<svg viewBox="0 0 ${W} ${H}" class="arch-svg" role="img" aria-label="Azure architecture flow">` +
      `<defs><marker id="archArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">` +
      `<path d="M0,0 L10,5 L0,10 Z" fill="currentColor"/></marker></defs>`;

    // Horizontal connectors between stage labels (all at the same y for clean alignment)
    const linkY = labelY + labelH / 2;
    for (let i = 0; i < stages.length - 1; i++) {
      const x1 = stages[i].x + nW / 2 + 4;
      const x2 = stages[i + 1].x - nW / 2 - 8;
      svg += `<line class="arch-link" x1="${x1}" y1="${linkY}" x2="${x2}" y2="${linkY}" marker-end="url(#archArrow)"/>`;
    }

    // Stages — label + service nodes stacked beneath
    stages.forEach((s) => {
      svg += `<g class="arch-node-g${s.fallback ? " muted" : ""}" transform="translate(${s.x - nW / 2},0)">` +
        `<rect class="arch-stage-bg" x="0" y="${labelY}" width="${nW}" height="${labelH}" rx="10"/>` +
        `<text class="arch-stage-lbl" x="${nW / 2}" y="${labelY + labelH / 2 + 4}" text-anchor="middle">${esc(s.label)}</text>`;
      s.items.slice(0, 4).forEach((item, idx) => {
        const y = itemsTop + idx * (nH + gap);
        const display = s.fallback ? String(item.name || item) : chipName(item);
        const lines = wrapChipText(display, s.fallback ? 30 : 22); // narrower limit when an Azure badge is present
        const textX = s.fallback ? nW / 2 : 50;
        const anchor = s.fallback ? "middle" : "start";
        svg += `<g class="arch-svc-g" transform="translate(0,${y})">` +
          `<rect class="arch-svc-rect" x="0" y="0" width="${nW}" height="${nH}" rx="6"/>`;
        if (!s.fallback) {
          svg += `<rect class="arch-svc-badge" x="6" y="${(nH - 16) / 2}" width="38" height="16" rx="3"/>` +
            `<text class="arch-svc-badge-t" x="25" y="${nH / 2 + 4}" text-anchor="middle">Azure</text>`;
        }
        svg += renderChipText(lines, textX, nH, anchor) + `</g>`;
      });
      if (s.items.length > 4) {
        const y = itemsTop + 4 * (nH + gap);
        svg += `<text class="arch-more" x="${nW / 2}" y="${y + 14}" text-anchor="middle">+${s.items.length - 4} more</text>`;
      }
      svg += `</g>`;
    });
    svg += `</svg>`;
    return `<div class="arch-diagram-wrap">${svg}</div>`;
  }
  // Wraps a chip label onto 1 or 2 lines, breaking at the last space within `max`
  // chars when possible; truncates the 2nd line with an ellipsis only if needed.
  function wrapChipText(s, max) {
    const str = String(s);
    if (str.length <= max) return [str];
    let cut = str.lastIndexOf(" ", max);
    if (cut < Math.floor(max / 3)) cut = max; // no good space — hard break
    let l1 = str.slice(0, cut).trim();
    let l2 = str.slice(cut).trim();
    if (l2.length > max) l2 = l2.slice(0, max - 1).trim() + "…";
    return [l1, l2];
  }
  function renderChipText(lines, x, h, anchor) {
    const cls = `arch-svc-text${anchor === "middle" ? " muted" : ""}`;
    if (lines.length === 1) {
      return `<text class="${cls}" x="${x}" y="${h / 2 + 4}" text-anchor="${anchor}">${esc(lines[0])}</text>`;
    }
    return `<text class="${cls}" x="${x}" y="${h / 2 - 3}" text-anchor="${anchor}">${esc(lines[0])}</text>` +
      `<text class="${cls} arch-svc-text-2" x="${x}" y="${h / 2 + 11}" text-anchor="${anchor}">${esc(lines[1])}</text>`;
  }

  // Reference architecture gallery: official Microsoft Learn / GitHub references
  // (URLs already verified by tools/check-links.mjs against the Learn site).
  function refArchGallery(uc) {
    const refs = window.referencesFor ? window.referencesFor(uc.solutionCategory) : [];
    if (!refs.length) return "";
    return `<div class="ref-arch-wrap">` +
      `<div class="wl-subhead">More Microsoft Learn references <span class="subhead-note">— additional guidance for this use case</span></div>` +
      `<div class="ref-arch-grid">` +
      refs.map((r) => {
        const u = String(r.url || "");
        const host = u.replace(/^https?:\/\//, "").split("/")[0] || "learn.microsoft.com";
        return `<a class="ref-arch-card" href="${esc(u)}" target="_blank" rel="noopener">` +
          `<span class="rac-badge">${I("book", { size: 12 })} Microsoft Learn</span>` +
          `<span class="rac-title">${esc(r.title)}</span>` +
          `<span class="rac-host">${esc(host)} ${I("external", { size: 11 })}</span></a>`;
      }).join("") +
      `</div></div>`;
  }

  // Featured reference architecture: a single deeply-researched, named architecture from
  // Microsoft Architecture Center / CAF / Industry Cloud, chosen for this use case's solution
  // category. For Health Providers / Payers use cases it also shows the Microsoft Cloud for
  // Healthcare end-to-end architecture. All sources are verified by tools/check-links.mjs.
  function featuredArchPanel(uc) {
    if (!window.featuredArchFor) return "";
    const { featured, industry } = window.featuredArchFor(uc.solutionCategory, uc.subverticalId);
    if (!featured && !industry) return "";
    const card = (a, tag) => {
      const u = String(a.learn || "");
      const host = u.replace(/^https?:\/\//, "").split("/")[0] || "learn.microsoft.com";
      const services = (a.services || []).map((s) => `<span class="fa-svc">${esc(s)}</span>`).join("");
      const gh = a.github
        ? `<a class="fa-link gh" href="${esc(a.github)}" target="_blank" rel="noopener">${I("book", { size: 12 })} GitHub sample ${I("external", { size: 11 })}</a>`
        : "";
      return `<article class="featured-arch reveal">` +
        `<div class="fa-head"><span class="fa-tag">${esc(tag)}</span>` +
        `<span class="fa-source">${I("book", { size: 12 })} Microsoft Learn</span></div>` +
        `<h3 class="fa-title">${esc(a.title)}</h3>` +
        `<p class="fa-desc">${esc(a.desc)}</p>` +
        (services ? `<div class="fa-svcs"><span class="fa-svcs-lbl">Key components</span>${services}</div>` : "") +
        `<div class="fa-actions"><a class="fa-link learn" href="${esc(u)}" target="_blank" rel="noopener">${I("book", { size: 12 })} Read on ${esc(host)} ${I("external", { size: 11 })}</a>${gh}</div>` +
        `</article>`;
    };
    const cards = [];
    if (featured) cards.push(card(featured, "Recommended Microsoft reference"));
    if (industry) cards.push(card(industry, "Healthcare industry reference"));
    return `<div class="featured-arch-wrap">` +
      `<div class="wl-subhead">Recommended Microsoft reference architecture <span class="subhead-note">— Azure Architecture Center / Cloud for Industry</span></div>` +
      `<div class="featured-arch-grid">${cards.join("")}</div>` +
      `</div>`;
  }

  // Azure Well-Architected Framework pillars panel — universal architectural quality
  // framework. All 5 pillars + URLs are taken verbatim from learn.microsoft.com/azure/well-architected.
  function wafPanel() {
    if (!window.ENRICHMENT || !window.ENRICHMENT.wafPillars) return "";
    const pillars = window.ENRICHMENT.wafPillars;
    const url = window.ENRICHMENT.wafOverviewUrl;
    return `<div class="waf-wrap">` +
      `<div class="wl-subhead">Architectural quality — Azure Well-Architected Framework <span class="subhead-note">— five Microsoft pillars (` +
      `<a class="waf-overview" href="${esc(url)}" target="_blank" rel="noopener">overview ${I("external", { size: 11 })}</a>` +
      `)</span></div>` +
      `<div class="waf-grid">` +
      pillars.map((p, i) =>
        `<a class="waf-pillar reveal st${(i % 4) + 1}" href="${esc(p.url)}" target="_blank" rel="noopener">` +
        `<span class="waf-ic">${I(p.icon, { size: 16 })}</span>` +
        `<span class="waf-meta"><span class="waf-name">${esc(p.id)}</span>` +
        `<span class="waf-concern">${esc(p.concern)}</span></span>` +
        `<span class="waf-short">${esc(p.short)}</span></a>`).join("") +
      `</div></div>`;
  }

  function buildSlides(uc) {
    const slides = [];
    const subCls = SUB_CLASS[uc.subverticalId] || "";

    // 1 — Title
    const heroPills = [
      ["users", audienceLabel(uc)],
      ["list", uc.stage],
      flagshipService(uc) ? ["cloud", flagshipService(uc)] : null,
      firstPercent(uc) ? ["trending", firstPercent(uc)] : null,
      [MOTION_ICON[uc.startingMotion] || "target", uc.startingMotion + " motion"],
    ].filter(Boolean);
    slides.push({ label: "Overview", html:
      `<div class="slide-inner title-slide title-hero"><div class="ts-glow" aria-hidden="true"></div>` +
      `<div class="ts-badges">` +
      `<span class="badge cat cat-${uc.solutionCategory}">${esc(uc.solutionCategory)} solution pattern</span>` +
      `<span class="badge subv-badge ${subCls}">${esc(uc.subvertical)}</span>` +
      `<span class="badge ground ${groundClass(uc.grounding)}">${esc(uc.grounding)}</span></div>` +
      `<h1>${esc(uc.title)}</h1>` +
      `<p class="ts-prob">${esc(uc.problem)}</p>` +
      `<div class="ts-pills">` +
      heroPills.map(([ic, tx]) => `<span class="ts-pill">${I(ic, { size: 14 })} ${esc(tx)}</span>`).join("") +
      `</div></div>` });

    // 2 — Challenge
    const chLevers = valueLevers(uc.businessValue);
    const persona = window.UCCONTENT ? window.UCCONTENT.persona(uc) : null;
    const pains = window.UCCONTENT ? window.UCCONTENT.today(uc) : [];
    slides.push({ label: "The challenge", html:
      `<div class="slide-inner">${kicker(1, "The challenge", "alert")}` +
      `<h2 class="slide-title">The customer problem</h2>` +
      (persona
        ? `<div class="persona-scene reveal st1"><div class="ps-avatar">${esc(persona.initials)}</div>` +
          `<div class="ps-body"><div class="ps-name">${esc(persona.name)}</div>` +
          `<div class="ps-role">${esc(persona.role)} · ${esc(persona.where)}</div>` +
          `<div class="ps-moment">${esc(persona.moment)}</div></div></div>`
        : "") +
      `<p class="big-quote">${esc(uc.problem)}</p>` +
      (pains.length
        ? `<div class="wl-subhead">What it's costing them today</div>` +
          `<ul class="pain-list">${pains.map((p, i) => `<li class="reveal st${i + 1}">${I("close", { size: 13 })}<span>${esc(p)}</span></li>`).join("")}</ul>`
        : "") +
      `<div class="ctx-row">` +
      `<span class="ctx-chip">${I("users", { size: 13 })} Felt by: ${esc(uc.buyerPrimary)}</span>` +
      `<span class="ctx-chip">${I("list", { size: 13 })} ${esc(uc.stage)}</span>` +
      (chLevers.length ? `<span class="ctx-chip">${I("trending", { size: 13 })} Impacts: ${esc(chLevers.join(" · "))}</span>` : "") +
      `</div></div>` });

    // 3 — Buyer & stakeholders
    const stakeHtml = uc.buyerStakeholders.map((s) => {
      const f = roleFocus(s);
      return `<div class="stake-row"><span class="stake-name">${esc(s)}</span>` +
        (f ? `<span class="stake-focus">${esc(f)}</span>` : `<span class="stake-focus muted">key influencer</span>`) + `</div>`;
    }).join("");
    const primaryFocus = roleFocus(uc.buyerPrimary);
    slides.push({ label: "Who we're talking to", html:
      `<div class="slide-inner">${kicker(2, "Who we're talking to", "users")}` +
      `<h2 class="slide-title">Buyer &amp; stakeholders</h2>` +
      `<div class="persona-primary"><div class="tag">Primary buyer</div>` +
      `<div class="role">${esc(uc.buyerPrimary)}</div>` +
      (primaryFocus ? `<div class="role-focus">Typically focused on ${esc(primaryFocus)}.</div>` : "") +
      `</div>` +
      `<div class="wl-subhead" style="margin-top:16px">Key stakeholders &amp; what they typically care about</div>` +
      `<div class="stake-list">${stakeHtml}</div>` +
      `<div class="enrich-note">${I("bulb", { size: 14 })} Stakeholder priorities are general role guidance to tailor your message — not customer-specific facts.</div>` +
      `</div>` });

    // 4 — Business value
    const outcomes = splitOutcomes(uc.businessValue);
    const levers = valueLevers(uc.businessValue);
    const baToday = window.UCCONTENT ? window.UCCONTENT.today(uc) : [];
    const baGains = window.UCCONTENT ? window.UCCONTENT.gains(uc) : [];
    const hasBA = baToday.length && baGains.length;
    slides.push({ label: "Business value", html:
      `<div class="slide-inner">${kicker(3, "Outcomes", "trending")}` +
      `<h2 class="slide-title">Business value</h2>` +
      `<p class="big-quote">${esc(uc.businessValue)}</p>` +
      (levers.length ? `<div class="ctx-row">${levers.map((l) => `<span class="lever-chip">${esc(l)}</span>`).join("")}</div>` : "") +
      (hasBA
        ? `<div class="ba-grid">` +
          `<div class="ba-col ba-before reveal st1"><div class="ba-h">${I("alert", { size: 14 })} Today</div>` +
          `<ul>${baToday.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>` +
          `<div class="ba-arrow" aria-hidden="true">${I("arrowRight", { size: 20 })}</div>` +
          `<div class="ba-col ba-after reveal st2"><div class="ba-h">${I("check", { size: 14 })} With this use case</div>` +
          `<ul>${baGains.map((g) => `<li>${esc(g)}</li>`).join("")}</ul></div>` +
          `</div>`
        : (outcomes.length > 1
          ? `<div class="wl-subhead" style="margin-top:18px">Outcomes at a glance</div>` +
            `<ul class="outcome-list">${outcomes.map((o) => `<li>${I("check", { size: 15 })} <span>${esc(o)}</span></li>`).join("")}</ul>`
          : "")) +
      `</div>` });

    // 5 — Solution + workloads (with Microsoft Learn capability highlights)
    const wl = uc.azureWorkloads.map((raw) => {
      const r = window.resolveWorkload(raw) || { rawName: raw };
      const cap = r.key && window.LEARN ? window.LEARN.capabilities[r.key] : null;
      const link = r.learn
        ? `<a class="wl-link" href="${esc(r.learn)}" target="_blank" rel="noopener">${I("book", { size: 13 })} Docs ${I("external", { size: 12 })}</a>`
        : `<span class="wl-link nolink">—</span>`;
      const canonName = r.name && r.name !== r.rawName ? `<span class="wl-canon"> · ${esc(r.name)}</span>` : "";
      const caps = cap ? `<ul class="wl-caps">${cap.items.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : "";
      return `<div class="workload-block"><div class="workload">` +
        `<span class="wl-dot"></span><span class="wl-main"><span class="wl-name">${esc(r.rawName || raw)}</span>${canonName}` +
        (r.desc ? `<br><span class="wl-canon">${esc(r.desc)}</span>` : "") + `</span>${link}</div>${caps}</div>`;
    }).join("");
    slides.push({ label: "The solution", html:
      `<div class="slide-inner">${kicker(4, "The solution", CAT_ICON[uc.solutionCategory])}` +
      `<h2 class="slide-title">How we solve it</h2>` +
      `<div class="solution-box"><p class="lead">${esc(uc.solutionPatternText)}</p>` +
      `<div class="wl-subhead">How it works</div>` +
      `<ol class="flow-steps">` +
      flowSteps(uc).map((s, i) =>
        `<li class="reveal st${i + 1}"><span class="fs-no">${i + 1}</span>` +
        `<div class="fs-meat"><div class="fs-act">${esc(s.label)}</div>` +
        `<div class="fs-svc">${I("cloud", { size: 12 })} ${esc(s.svc)}</div></div></li>`).join("") +
      `</ol>` +
      `<div class="wl-subhead">Solution-pattern coverage</div>` +
      coverageBar(uc) +
      `<div class="wl-subhead">Azure services in this use case <span class="subhead-note">— capability highlights from Microsoft Learn</span></div>` +
      `<div class="workloads">${wl}</div>` +
      `<div class="enrich-note">${I("book", { size: 14 })} Each service links to its official Microsoft Learn / GitHub documentation.</div>` +
      `<div class="learn-more"><div class="lm-head">${I("book", { size: 14 })} Learn more — official Microsoft documentation</div>` +
      `<div class="ref-links">` +
      window.referencesFor(uc.solutionCategory).map((r) => `<a class="ref-link" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)} ${I("external", { size: 11 })}</a>`).join("") +
      `</div></div>` +
      `</div></div>` });

    // 6 — Architecture flow
    slides.push({ label: "Architecture", html:
      `<div class="slide-inner">${kicker(5, "Azure architecture", "layers")}` +
      `<h2 class="slide-title">How it fits together on Azure</h2>` +
      `<p class="lead">The use case's Azure services arranged as an end-to-end flow — from your data to the people who act on it.</p>` +
      archDiagram(uc) +
      featuredArchPanel(uc) +
      wafPanel() +
      refArchGallery(uc) +
      `<div class="enrich-note">${I("bulb", { size: 14 })} Services are mapped to a reference flow from this use case's Azure Workload Mapping; reference architectures, WAF pillars, and Learn links all come from official Microsoft / GitHub sources.</div>` +
      `</div>` });

    // 7 — Demo
    const demo = window.Demos.build(uc);
    slides.push({ label: "Live mock demo", init: demo.init, html:
      `<div class="slide-inner">${kicker(6, "Live mock demo", "play")}` +
      `<h2 class="slide-title">See it in action</h2>` +
      `<p class="lead">A clickable <strong>${esc(demo.label)}</strong> mock, tailored to this use case. ` +
      `All data shown is illustrative sample data.</p>${demo.html}</div>` });

    // 8 — Business impact (figures sourced only from this use case's own text)
    slides.push({ label: "Business impact", html:
      `<div class="slide-inner">${kicker(7, "Business impact", "trending")}` +
      `<h2 class="slide-title">The impact you can take to the buyer</h2>` +
      `<p class="lead">What this use case moves — anchored to the outcomes this customer cares about.</p>` +
      metricsBlock(uc) +
      leverBar(uc) +
      `</div>` });

    // 7 — Discovery questions (from the use case + general qualifying)
    const gq = genericDiscovery(uc);
    slides.push({ label: "Discovery questions", html:
      `<div class="slide-inner">${kicker(8, "Discovery", "question")}` +
      `<h2 class="slide-title">Discovery questions</h2>` +
      `<div class="wl-subhead">From the use case</div>` +
      `<ol class="q-list">${uc.discoveryQuestions.map((q, i) => `<li><span class="qn">${i + 1}</span><div class="q-meat"><span class="q-txt">${esc(q)}</span><span class="q-why">${I("spark", { size: 11 })} ${esc(qWhy(q))}</span></div></li>`).join("")}</ol>` +
      `<div class="wl-subhead" style="margin-top:18px">Qualify &amp; advance <span class="subhead-note">— general</span></div>` +
      `<ol class="q-list">${gq.map((q, i) => `<li><span class="qn alt">${i + 1}</span><span>${esc(q)}</span></li>`).join("")}</ol>` +
      `</div>` });

    // 8 — Objection handling (from the use case + Microsoft Learn guidance)
    const objHtml = (uc.risks && uc.risks.length)
      ? uc.risks.map((r) =>
          `<div class="obj"><div class="obj-top"><span class="ic">${I("alert", { size: 18 })}</span>` +
          `<span class="txt">${esc(r.objection)}</span></div>` +
          `<div class="obj-bot"><span class="ic">${I("checkCircle", { size: 18 })}</span>` +
          `<span>${esc(r.mitigation)}</span></div></div>`).join("")
      : `<p class="big-quote">${esc(uc.risksRaw)}</p>`;
    const guid = window.LEARN ? window.LEARN.guidanceFor(uc) : [];
    const guidHtml = guid.map((g) =>
      `<div class="guid"><div class="guid-top"><span class="ic">${I("shield", { size: 16 })}</span>` +
      `<span class="guid-label">${esc(g.label)}</span></div>` +
      `<div class="guid-body">${esc(g.text)}<span class="guid-links">` +
      g.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.title)} ${I("external", { size: 11 })}</a>`).join("") +
      `</span></div></div>`).join("");
    slides.push({ label: "Objection handling", html:
      `<div class="slide-inner">${kicker(9, "Objection handling", "shield")}` +
      `<h2 class="slide-title">Risks &amp; objections</h2>` +
      `<div class="wl-subhead">From the use case</div>` +
      `<div class="obj-grid">${objHtml}</div>` +
      (guidHtml ? `<div class="wl-subhead" style="margin-top:18px">Microsoft guidance to anticipate concerns <span class="subhead-note">— Microsoft Learn</span></div>` +
        `<div class="guid-grid">${guidHtml}</div>` : "") +
      `</div>` });

    // 10 — Next step (CTA)
    const topObj = (uc.risks || []).slice(0, 2);
    slides.push({ label: "Next step", html:
      `<div class="slide-inner">${kicker(10, "Next step", MOTION_ICON[uc.startingMotion] || "target")}` +
      `<h2 class="slide-title">Recommended next step</h2>` +
      `<div class="next-step"><div class="ns-eyebrow">Recommended starting motion</div>` +
      `<div class="motion-name">${esc(uc.startingMotion)}</div>` +
      `<div class="motion-desc">Use the discovery questions to qualify, then propose a scoped ${esc(uc.startingMotion)} that proves value fast and de-risks the path to production.</div>` +
      (topObj.length
        ? `<div class="ns-obj"><div class="ns-obj-h">If they push back</div>` +
          topObj.map((r) => `<div class="ns-chip"><strong>${esc(r.objection)}</strong> — ${esc(r.mitigation)}</div>`).join("") +
          `</div>`
        : "") +
      `</div></div>` });

    return slides;
  }
})();
