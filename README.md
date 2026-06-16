# HLS Use Case Catalog

Field-ready use cases for **Health Providers**, **Health Payers**, **Pharma / Life Sciences**, and **MedTech** — 129 use cases with clickable mock demos. Grounded in the FY27 HLS Cloud & AI Platforms catalog (Microsoft).

Each use case opens as a self-contained slide deck (overview · challenge · audience · value · solution · architecture · **live mock demo** · impact · discovery · objections · next step) so a seller can present directly from the browser.

## Quick start

No build step. Open `index.html` directly in a browser:

```powershell
Start-Process .\index.html
```

Or serve locally (any static server works):

```powershell
npx --yes http-server -p 8080 -c-1
# then open http://localhost:8080
```

## Pages

| Page | Scope |
|---|---|
| `index.html` | All 129 use cases, cross-subvertical filters |
| `providers.html` | Health Providers (32 use cases) |
| `payers.html` | Health Payers (33 use cases) |
| `pharma.html` | Pharma / Life Sciences (32 use cases) |
| `medtech.html` | MedTech (32 use cases) |

## Demo archetypes

Every use case maps to one of 13 interactive mock-demo renderers in `assets/demos.js`:

`chat` · `extraction` · `summarize` · `agent` · `match` · `score` · `vision` · `code` · `apps` · `analytics` · `data` · `infra` · `security`

Each renderer ships with real interactivity (free-text input, segmented toggles, click-to-detail, step-throughs, run animations) and uses synthetic illustrative data only.

## Structure

```
index.html, providers.html, payers.html, pharma.html, medtech.html
assets/
  app.js          render engine (index, subvertical, use-case overlay carousel)
  demos.js        13 demo renderers
  icons.js        inline SVG icon library
  styles.css      all visual styles
data/
  catalog.js              CATALOG  (extracted from the FY27 source markdown)
  enrichment.js           per-use-case docs/links, audiences, services
  learn-enrichment.js     Microsoft Learn references
  demo-scenarios.js       per-archetype demo scenes
  use-case-content.js     subvertical x stage persona/today/gains/steps
context/                  per-use-case background HTML (not required at runtime)
tools/
  check-links.mjs         verifies every doc URL resolves (HTTP 200)
  extract-catalog.mjs     one-time: regenerates data/catalog.js from source MD
```

## Script load order

The page scripts must load in this order (see the `<script>` tags in each HTML file):

`data/catalog.js` → `data/enrichment.js` → `data/learn-enrichment.js` → `data/use-case-content.js` → `assets/icons.js` → `data/demo-scenarios.js` → `assets/demos.js` → `assets/app.js`

## Dev tooling

```powershell
# Syntax-check all JS
node --check assets/app.js
node --check assets/demos.js
node --check data/catalog.js

# Verify every documentation URL resolves
node tools/check-links.mjs
```

## Conventions

- **Per-subvertical accent colors** are scoped to `.uc-overlay[data-sub="..."]` in `styles.css`.
- **Hash routes:** `#uc/{subvertical-id}/{use-case-id}` opens a use case overlay.
- **No build, no framework, no runtime dependencies.** Vanilla HTML/CSS/JS. Works from `file://`.
- All demo data is **fictional / illustrative**. A person reviews before any use.

## License

Internal Microsoft material. All rights reserved.
