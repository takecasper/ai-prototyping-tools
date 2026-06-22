---
title: One45 Design Systems — Reconciliation & Gap Map
tags: design-system, one45, reconciliation, gap-analysis, tokens, contrast, convergence
verified: true
---

# Reconciliation & Gap Map — the gap between intent and reality

The bridge between the two documented systems and the rendered product. Four
sections: **Keep** (carry verbatim), **Dedupe** (the 4× duplication), **Untokened**
(values used but not in any token file), **Contrast-fix** (token-level failures).
Evidence labels **[D]**/**[R]**/**[I]** as in the per-system reports; every count
traces to `internal analysis` / `internal analysis` (re-run this session, reproduce to
the digit), `scripts/contrast.mjs`, or `path:line`.

This is both an input to the prototyping tool's bridge and its own audit finding:
**the documented tokens govern a small minority of what actually paints.**

---

## 1. Keep [D]

| Asset | Why | Cite |
|---|---|---|
| **Acuity token set** (8 families × 6 + neutrals, 7-step type, spacing 0–7, 3 weights) | The one deliberately-designed system; complete, clean | `01-acuity-modern.md §L1`; ` §1.7` |
| **`@takecasper/acuity-design-system`** as THE component library | Real external DS, the obvious target; extend to server surface | ` carries-forward 1` |
| **WidgetBundle `Error/*` alert partials** (135 includes) | De-facto canonical alert primitive; promote to first-class | ` §2.5` |
| **175 webeval tags** as a *coverage checklist* | The full legacy UI vocabulary the new system must cover (engine dies, list survives) | ` §webeval tags` |
| **one45-legacy as a toggle target** (not its tokens) | Faithful "legacy" pole for old-vs-new convergence views | `02-one45-legacy.md §carry-forward` |

---

## 2. Dedupe — the 4× token duplication [D]

The Acuity colour set exists in **four hand-synced copies with no shared source**.
Any colour change must be made in four places or it drifts
(`internal analysis`, this session; ` §1.4`):

| # | Representation | File | Count |
|--:|---|---|--:|
| 1 | Tailwind JS theme | `symfony/tailwind_acuity_theme.js:30-106` | 55 |
| 2 | CSS custom props | `web/vendor/webeval_ss/acuity_branding.css` | 55 |
| 3 | Tailwind compiled | `symfony/tailwind_final.css:325-466` | subset |
| 4 | SCSS vars | `_colors.scss:37-95` | 49 |

Counts 1 and 2 match exactly (55 = 55, re-verified). **`_colors.scss` is the worst
offender**: it carries copy #4 of Acuity (49) *plus* the entire legacy one45
palette (38), so two unrelated colour systems share one include
(`02-one45-legacy.md §L1 drift note`).

**Fix:** one source of truth (e.g. Style Dictionary / DTCG JSON), generate the JS
theme, CSS vars, compiled utilities, and any SCSS from it. The portable
[`tokens/acuity.json`](tokens/acuity.json) in this folder is a candidate single
source. **The prototyping tool already models this discipline** — `acuity` renders
from one token block (`spike/src/styles/tokens.css`), not four.

Component-side duplication compounds it [D]: 4 coexisting React UI stacks
(acuity-DS 257 + react-bootstrap 66 + semantic-ui-react 16 + local fork) and 15%
Twig line-duplication (SCFHS/CBME forks) — `

---

## 3. Untokened — values used but in no token file [D][R]

The token set is a minority of the painted colour space:

| Zone | Raw values | Tokenized? | Cite |
|---|--:|---|---|
| Symfony source (scss+css) | **979 raw hex / 222 unique**, 105 rgb(), **3,165 px**, 215 `!important` | mostly no — 222 unique hex leak alongside 198 `$var` decls | `internal analysis` |
| webeval CSS | **7,309 raw hex / 727 unique**, 19,625 px, **1,367 `!important`** | no token system at all | `internal analysis` |
| Semantic UI dist | 418 unique colours, **0 custom props**, 733 `!important` | Semantic's own Sass vars, unrelated to Acuity | `internal analysis` |

**Adoption signal** [D]: only `tailwind_final.css` uses CSS custom properties
meaningfully (53, mostly `--tw-*` plumbing); Semantic UI and source SCSS/CSS use 0.
Runtime token adoption app-wide is **~nil outside the Tailwind layer**; `ds-`
utilities appear 402× against 3,165 hardcoded px. Coverage ~**10–20%**
(` §1.7`).

**Rendered colours in NO token file** [R] (` §runtime`;
`scripts/contrast.mjs`): config nav `#e46b6b` (3.17:1), My eDossier `#2196f3` on
`#27304b` (4.17:1), and the rotation-grid colour-coding behind 1,239 contrast
fails. **These are the rendered reality the token files cannot see** — the reason
the audit insisted on a runtime pass, and the reason the prototyping tool surfaces
divergence rather than trusting token files alone.

---

## 4. Contrast-fix — token-level failures to resolve before carry-forward

Computed deterministically (`scripts/contrast.mjs`; reconciles with `
§3.3`). **Even the deliberate Acuity palette fails**, so these must be fixed at the
token level, not per-component. Text 4.5 · UI/large 3.

**Acuity (System B) — fix list:**

| Token | on white | issue | suggested direction |
|---|--:|---|---|
| `neutrals DEFAULT #8C8C8C` | 3.36 | muted-text token fails AA | darken to ≥ `#767676` (4.5) for text use; keep `#8C8C8C` for large/UI only |
| `acuity-green DEFAULT #00A59B` | 3.06 | green as text/label fails | use `dark #007A72` (≈4.5+) for text; DEFAULT for fills only |
| `success-green DEFAULT #4DA81F` | 3.03 | white-label button fails | darken default or pair with dark variant for labels |
| `information-blue DEFAULT #1E93BA` | 3.54 | text fails | use `dark #157393` for text |
| `neutrals light #B8B8B8` | 1.98 | border/placeholder fails 1.4.11 | darken borders to ≥ `#949494` (3.0) |
| `warning-yellow DEFAULT #FCE833` | 1.26 | invisible as fg on white | never a foreground; pair with dark text on yellow fill |
| all `light` shades as text | 1.18–4.03 | fail AA | reserve `light` for fills/decoration, not text |

**one45 legacy (System A) — fix list (migration source, lower priority):**

| Token | on white | issue |
|---|--:|---|
| `$grey_dark_1 #A6A6AD` | 2.42 | a "dark" grey that fails everything |
| `$primary_yellow #F8B223` | 1.84 | fails as fg |
| `$primary_teal #3BDACA` | 1.74 | fails as fg |
| `$primary_red #F12F62` | 3.95 | fails AA text |
| `$grey_dark_2 #7D7D82` | 4.10 | fails AA text (narrow) |

**Safe text colours that pass (use these):** Acuity acuity-blue `#364699` (8.42),
acuity-red `#BA1E50` (6.20), neutrals darker `#333` (12.63) / dark `#555` (7.46);
legacy `$one45_black #27304B` (13.04), `$primary_purple #42507D` (7.85), `$link
#0a6cbd` (5.39). The prototyping-tool skins already default to these
(`spike/src/styles/tokens.css`).

---

## 4b. Inputs & controls slice — enshrined 2026-06-22 [D][R]

The first slice of the full-surface enshrining (handoff:
`internal notes Canonical pieces added: `TextField,
Textarea, Select, Checkbox, Radio, Toggle, SearchField` + `Button` variants
(primary/secondary/danger/inline) — token-driven, present in all three systems,
lint-gate-clean, browser-verified across acuity/one45-legacy/lowfi.

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **Legacy buttons already converged to Acuity-blue `#364699`** (`.btn-primary`) while legacy text inputs kept the old grey one45 look (`#DDD` border, no radius/focus) — the legacy form layer is two-speed | `02 §inputs`; `new_branding.scss:206-318` [D] |
| The DS input border is **`#949494` (3.03:1, passes 1.4.11)** — the accessible grey the §4 fix list recommended; the DS already got the input border right | `01 §inputs`; `/test/designSystem` [R]; `contrast.mjs` |
| The Acuity **shell** search paints **purple `#42507D`** (legacy `$primary_purple`) — purple is not purely legacy; it persists in the Acuity chrome | `01 §inputs` [R] |
| Real DS validation surface is **`state`+`message`+`helpText[]`+`optionalityLabel`**, NOT an `error` boolean or `placeholder` | `statefulButton.jsx:66,82`; island usage [D] |
| Legacy input border `#DDD` **fails 3:1 (1.36)** — add to the legacy fix list (migration-source priority) | `contrast.mjs` |

**Anatomy result [R]:** every input maps 1:1 to one canonical API re-skinned by tokens —
the single-canonical-API model **survives the entire inputs group** with zero prototype
edits. The genuine anatomy divergence remains narrow (Alert; see §5). The bridge did not
need to fill any input gap — a clean positive result for the plan's anatomy question
on this group.

---

## 4c. Navigation slice — enshrined 2026-06-22 [D][R]

Second slice. Canonical pieces added: `Tabs`, `Link` (all three systems) + `Breadcrumb`
(legacy + lowfi native, **acuity-absent → bridge**). **No `Pagination`** — it exists in
neither DS, so fabricating it would misrepresent both systems. Lint-gate-clean,
browser-verified across acuity / one45-legacy / lowfi; pattern prototype
`spike/src/prototypes/program-explorer/` (region tabs filter the list → detail with
section tabs + deeper breadcrumb).

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **Tabs is the first piece where pure token-swap breaks** — Acuity tabs are an underline-indicator model, legacy tabs are Bootstrap BOX folder tabs; the API survives but the skin must be per-system | `/test/designSystem` [R]; `themes/one45.scss:759-775` [D] |
| Acuity **active-tab indicator is acuity-green `#00A59B`**, NOT acuity-blue (a render-only fact) — 2px underline, 3.06:1 UI | `/test/designSystem` [R]; `tailwind_acuity_theme.js:42`; `contrast.mjs` |
| **The Acuity DS ships no Breadcrumb, Pagination, Navbar/Sidebar, or Stepper component** (zero island usages) — genuine inventory gaps, not fabricated | island recovery [D]; `01 §nav` |
| **`Breadcrumb` is a legacy-only piece** — bespoke chevron `.breadcrumb-widget`; the exact mirror of acuity-only `Alert` | `themes/one45.scss:317-421` [D] |
| **Pagination exists in NEITHER system** (legacy: margin reset only; Acuity: none) — NOT enshrined, recorded as a both-systems gap rather than a fabricated component | `themes/one45.scss:553-559` [D] |
| Legacy **tab box/strip rule `#AAAAAA` fails 3:1 (2.32)** — add to the legacy fix list, same class as the `#DDD` border | `contrast.mjs` |
| One id-based `Tabs` contract absorbs **both** Acuity's index API (`activeTabIndex`/`handleTabChange`) and legacy's key-based `.nav-tabs` | `designSystemTest/main.jsx:935`; `canvasSync.jsx:392` [D] |

**Anatomy result [R] — the first crack:** the canonical **API** survives (one id-based
`Tabs` contract absorbs both systems), but the **pure token-swap skin does NOT** — Acuity's
underline tabs vs legacy's Bootstrap box tabs are structurally different and are rendered
per-system (`app.css`), accurately, not flattened. Plus the **inventory diverges both ways**
(Acuity has a real `Tabs` component; legacy has `Breadcrumb`; neither has `Pagination`). API
intact, skin + coverage diverge — the per-system-skin + bridge work, which this slice
**evolved** (see §5). Rule honoured: no component muddied or fabricated to force a tidier story.

**Bridge evolution [D]:** the interim heuristic moved off "substitute the first native
piece." A new `INTERIM_BUILDS` map (`systems.tsx`) holds token-driven generic builds for
the divergent pieces (`Alert`, `Breadcrumb`); the resolver renders the real build of *that*
piece in the active system's token language, flagged "AI approx", instead of an unrelated
component. Verified in-browser: `Alert` → legacy/lowfi and `Breadcrumb` → acuity each
render a sensible, on-brand, flagged interim. Pieces with no generic build (e.g. `Badge` in
lowfi) still fall back to the cruder first-native substitution, so both behaviours stay
observable.

---

## 5. Convergence read [I]

The divergence between the two systems is **largely token/brand at the API level** —
the same canonical contract re-skinned (`01 §L2`, `02 §L2`). The single-canonical-API
holds for the legacy↔Acuity pair (the **Inputs slice §4b confirms this on seven controls**
that re-skin cleanly, no per-system skin needed). But the Navigation slice (§4c) found the
**first place a pure token-swap is not enough**: `Tabs` share the API yet render structurally
different models (Acuity underline vs legacy Bootstrap box tabs), so each needs its own skin.
The rule going forward: **represent each system's real model accurately — never flatten or
fabricate a component to keep the token-swap story tidy.** Beyond Tabs, the **anatomy
divergence** is nameable: a true component in one system and a different mechanism in the
other (Alert: DS component vs Twig `Error/*` partials), or a true component in one and
**absent** in the other (Breadcrumb: legacy widget vs no Acuity component — §4c). Those are
the bridge's actual work, and the Navigation slice **evolved it** past the first-native-piece
heuristic: divergent pieces now resolve to a flagged token-driven build of that piece in the
active system (`INTERIM_BUILDS`, §4c), not an unrelated component. The broader 7-system
reality (Semantic UI / Bootstrap 2 / jQuery-UI / webeval) **is** structurally
divergent — but six of seven die in the rebuild (` §1.7`), so the
convergence target is Acuity, and this map is the list of what to fix in it first.
