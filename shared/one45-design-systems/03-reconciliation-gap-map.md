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
traces to internal analysis (re-run this session, reproduce to the digit),
`scripts/contrast.mjs`, or `path:line` source citations.

This is both an input to the prototyping tool's bridge and its own finding:
**the documented tokens govern a small minority of what actually paints.**

---

## 1. Keep [D]

| Asset | Why | Cite |
|---|---|---|
| **one45 (2020s) token set** (8 families × 6 + neutrals, 7-step type, spacing 0–7, 3 weights) | The one deliberately-designed system; complete, clean | `01-one45-2020s.md §L1` |
| **`@takecasper/acuity-design-system`** as THE component library | Real external DS, the obvious target; extend to server surface | internal analysis |
| **WidgetBundle `Error/*` alert partials** (135 includes) | De-facto canonical alert primitive; promote to first-class | internal analysis |
| **175 webeval tags** as a *coverage checklist* | The full legacy UI vocabulary the new system must cover (engine dies, list survives) | internal analysis |
| **one45-legacy as a toggle target** (not its tokens) | Faithful "legacy" pole for old-vs-new convergence views | `02-one45-legacy.md §carry-forward` |

---

## 2. Dedupe — the 4× token duplication [D]

The one45 (2020s) colour set exists in **four hand-synced copies with no shared source**.
Any colour change must be made in four places or it drifts
(internal analysis, this session):

| # | Representation | File | Count |
|--:|---|---|--:|
| 1 | Tailwind JS theme | `symfony/tailwind_acuity_theme.js:30-106` | 55 |
| 2 | CSS custom props | `web/vendor/webeval_ss/acuity_branding.css` | 55 |
| 3 | Tailwind compiled | `symfony/tailwind_final.css:325-466` | subset |
| 4 | SCSS vars | `_colors.scss:37-95` | 49 |

Counts 1 and 2 match exactly (55 = 55, re-verified). **`_colors.scss` is the worst
offender**: it carries copy #4 of one45 (2020s) (49) *plus* the entire legacy one45
palette (38), so two unrelated colour systems share one include
(`02-one45-legacy.md §L1 drift note`).

**Fix:** one source of truth (e.g. Style Dictionary / DTCG JSON), generate the JS
theme, CSS vars, compiled utilities, and any SCSS from it. The portable
[`tokens/one45-2020s.json`](tokens/one45-2020s.json) in this folder is a candidate single
source. **The prototyping tool already models this discipline** — `one45-2020s` renders
from one token block (`src/styles/tokens.css`), not four.

Component-side duplication compounds it [D]: 4 coexisting React UI stacks
(acuity-DS 257 + react-bootstrap 66 + semantic-ui-react 16 + local fork) and 15%
Twig line-duplication (SCFHS/CBME forks) — internal analysis.

---

## 3. Untokened — values used but in no token file [D][R]

The token set is a minority of the painted colour space:

| Zone | Raw values | Tokenized? | Cite |
|---|--:|---|---|
| Symfony source (scss+css) | **979 raw hex / 222 unique**, 105 rgb(), **3,165 px**, 215 `!important` | mostly no — 222 unique hex leak alongside 198 `$var` decls | internal analysis |
| webeval CSS | **7,309 raw hex / 727 unique**, 19,625 px, **1,367 `!important`** | no token system at all | internal analysis |
| Semantic UI dist | 418 unique colours, **0 custom props**, 733 `!important` | Semantic's own Sass vars, unrelated to one45 (2020s) | internal analysis |

**Adoption signal** [D]: only `tailwind_final.css` uses CSS custom properties
meaningfully (53, mostly `--tw-*` plumbing); Semantic UI and source SCSS/CSS use 0.
Runtime token adoption app-wide is **~nil outside the Tailwind layer**; `ds-`
utilities appear 402× against 3,165 hardcoded px. Coverage ~**10–20%**.

**Rendered colours in NO token file** [R] (`scripts/contrast.mjs`): config nav
`#e46b6b` (3.17:1), My eDossier `#2196f3` on `#27304b` (4.17:1), and the
rotation-grid colour-coding behind 1,239 contrast fails. **These are the rendered
reality the token files cannot see** — the reason a runtime pass was needed, and
the reason the prototyping tool surfaces divergence rather than trusting token
files alone.

---

## 4. Contrast-fix — token-level failures to resolve before carry-forward

Computed deterministically (`scripts/contrast.mjs`). **Even the deliberate one45 (2020s)
palette fails**, so these must be fixed at the
token level, not per-component. Text 4.5 · UI/large 3.

**one45 (2020s) (System B) — fix list:**

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

**Safe text colours that pass (use these):** one45 (2020s) acuity-blue `#364699` (8.42),
acuity-red `#BA1E50` (6.20), neutrals darker `#333` (12.63) / dark `#555` (7.46);
legacy `$one45_black #27304B` (13.04), `$primary_purple #42507D` (7.85), `$link
#0a6cbd` (5.39). The prototyping-tool skins already default to these
(`src/styles/tokens.css`).

---

## 4b. Inputs & controls slice — enshrined 2026-06-22 [D][R]

The first slice of the full-surface enshrining (tracked in internal analysis).
Canonical pieces added: `TextField,
Textarea, Select, Checkbox, Radio, Toggle, SearchField` + `Button` variants
(primary/secondary/danger/inline) — token-driven, present in all three systems,
lint-gate-clean, browser-verified across one45-2020s/one45-legacy/lowfi.

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **Legacy buttons already converged to acuity-blue `#364699`** (`.btn-primary`) while legacy text inputs kept the old grey one45 look (`#DDD` border, no radius/focus) — the legacy form layer is two-speed | `02 §inputs`; `new_branding.scss:206-318` [D] |
| The DS input border is **`#949494` (3.03:1, passes 1.4.11)** — the accessible grey the §4 fix list recommended; the DS already got the input border right | `01 §inputs`; `/test/designSystem` [R]; `contrast.mjs` |
| The one45 (2020s) **shell** search paints **purple `#42507D`** (legacy `$primary_purple`) — purple is not purely legacy; it persists in the one45 (2020s) chrome | `01 §inputs` [R] |
| Real DS validation surface is **`state`+`message`+`helpText[]`+`optionalityLabel`**, NOT an `error` boolean or `placeholder` | `statefulButton.jsx:66,82`; island usage [D] |
| Legacy input border `#DDD` **fails 3:1 (1.36)** — add to the legacy fix list (migration-source priority) | `contrast.mjs` |

**Anatomy result [R]:** every input maps 1:1 to one canonical API re-skinned by tokens —
the single-canonical-API model **survives the entire inputs group** with zero prototype
edits. The genuine anatomy divergence remains narrow (Alert; see §5). The bridge did not
need to fill any input gap — a clean positive result for the anatomy question on this
group.

---

## 4c. Navigation slice — enshrined 2026-06-22 [D][R]

Second slice. Canonical pieces added: `Tabs`, `Link` (all three systems) + `Breadcrumb`
(legacy + lowfi native, **one45-2020s-absent → bridge**). **No `Pagination`** — it exists in
neither DS, so fabricating it would misrepresent both systems. Lint-gate-clean,
browser-verified across one45-2020s / one45-legacy / lowfi; pattern prototype
`src/prototypes/program-explorer/` (region tabs filter the list → detail with
section tabs + deeper breadcrumb).

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **Tabs is the first piece where pure token-swap breaks** — one45 (2020s) tabs are an underline-indicator model, legacy tabs are Bootstrap BOX folder tabs; the API survives but the skin must be per-system | `/test/designSystem` [R]; `themes/one45.scss:759-775` [D] |
| one45 (2020s) **active-tab indicator is acuity-green `#00A59B`**, NOT acuity-blue (a render-only fact) — 2px underline, 3.06:1 UI | `/test/designSystem` [R]; `tailwind_acuity_theme.js:42`; `contrast.mjs` |
| **The Acuity DS ships no Breadcrumb, Pagination, Navbar/Sidebar, or Stepper component** (zero island usages) — genuine inventory gaps, not fabricated | island recovery [D]; `01 §nav` |
| **`Breadcrumb` is a legacy-only piece** — bespoke chevron `.breadcrumb-widget`; the exact mirror of one45-2020s-only `Alert` | `themes/one45.scss:317-421` [D] |
| **Pagination exists in NEITHER system** (legacy: margin reset only; one45 (2020s): none) — NOT enshrined, recorded as a both-systems gap rather than a fabricated component | `themes/one45.scss:553-559` [D] |
| Legacy **tab box/strip rule `#AAAAAA` fails 3:1 (2.32)** — add to the legacy fix list, same class as the `#DDD` border | `contrast.mjs` |
| One id-based `Tabs` contract absorbs **both** one45 (2020s)'s index API (`activeTabIndex`/`handleTabChange`) and legacy's key-based `.nav-tabs` | `designSystemTest/main.jsx:935`; `canvasSync.jsx:392` [D] |

**Anatomy result [R] — the first crack:** the canonical **API** survives (one id-based
`Tabs` contract absorbs both systems), but the **pure token-swap skin does NOT** — one45 (2020s)'s
underline tabs vs legacy's Bootstrap box tabs are structurally different and are rendered
per-system (`app.css`), accurately, not flattened. Plus the **inventory diverges both ways**
(one45 (2020s) has a real `Tabs` component; legacy has `Breadcrumb`; neither has `Pagination`). API
intact, skin + coverage diverge — the per-system-skin + bridge work, which this slice
**evolved** (see §5). Rule honoured: no component muddied or fabricated to force a tidier story.

**Bridge evolution [D]:** the interim heuristic moved off "substitute the first native
piece." A new `INTERIM_BUILDS` map (`systems.tsx`) holds token-driven generic builds for
the divergent pieces (`Alert`, `Breadcrumb`); the resolver renders the real build of *that*
piece in the active system's token language, flagged "AI approx", instead of an unrelated
component. Verified in-browser: `Alert` → legacy/lowfi and `Breadcrumb` → one45-2020s each
render a sensible, on-brand, flagged interim. Pieces with no generic build (e.g. `Badge` in
lowfi) still fall back to the cruder first-native substitution, so both behaviours stay
observable.

---

## 4d. Feedback & status slice — Modal enshrined 2026-06-22 [D][R]

Third slice, first piece. Canonical piece added: **`Modal`** (native in all three systems).
Lint-gate-clean, browser-verified across one45-2020s / one45-legacy / lowfi; pattern prototype
`src/prototypes/learner-withdrawal/` (a roster with a destructive Withdraw guarded by
a confirm Modal, acknowledged by an Alert). The Feedback group is being sliced; only Modal is
enshrined this pass, the rest recorded as findings/gaps below.

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **Modal PASSES the API-survival test AND pure token-swap** — one canonical API absorbs the one45 (2020s) headlessui Dialog and the legacy Bootstrap modal; the only visual difference (legacy grey header band vs one45 (2020s) headerless title) is captured as tokens (`--ds-modal-header-bg`/`-border`), so unlike Tabs no per-system structural override is needed | `confirmModal.jsx:34`, `mappingModal.jsx:162` [D]; `/test/designSystem` + tool [R] |
| one45 (2020s) modal [R]: panel radius **8px**, shadow `0 2px 8px rgba(0,0,0,.12)`, scrim `rgba(0,0,0,.25)` (`neutrals-transparent-medium`), title `#333` 23px, **headerless** | `/test/designSystem` getComputedStyle [R] |
| Legacy modal [D]: panel radius **6px**, shadow `0 3px 7px rgba(0,0,0,.3)`, **grey header band `#F5F5F5` + `#EEE` rule**, title `$one45_black #27304B` | `_bootstrap.scss:103` [D]; tool [R] |
| **Alert is NOT one45-2020s-only** — legacy ships a real alert: WidgetBundle `Error/*` Twig partials (154 uses) skinned by `.one45-alert` (success `#B0F0E9` / warning `#FCE0A7` / error `#FFC8D7` / info `#42507D`, over `#27304B`/`#FFF`, radius 0, pad 16px). The tool's one45-2020s-only model + bridge fill is now known inaccurate → **rework Alert to native-both next slice** | `Error/*.twig`; `new_branding.scss:66-170` [D] |
| **Badge is mis-shared to legacy** — the real Badge is the acuity-DS component (`label`/`color`/`type`, demo-page only); legacy has **no** status badge (`.badge-details` is a profile-photo widget) → correct Badge to one45-2020s-only next slice | island recovery [D] |
| **Toast, tag/chip, empty-state are gaps in BOTH systems** (zero in either DS) → NOT enshrined (the Pagination rule). **Spinner**: one45-2020s-real, legacy is a webeval `busy` cog **GIF** (no CSS). **ProgressBar**: one45-2020s-real, legacy near-absent (`.progress` line-height only). **Tooltip/Popover**: react-bootstrap in both, not DS components. All deferred | island recovery + `_bootstrap.scss` [D] |

**Modal title contrast** (`scripts/contrast.mjs`, "Modal" sections): one45 (2020s) `#333` on `#FFF`
**12.63** (AAA); legacy `#27304B` on band `#F5F5F5` **11.96** (AAA), on white **13.04**
(AAA). The header band `#F5F5F5` vs panel `#FFF` is **1.09** — decorative, as intended.

**Anatomy result [R] — the cleanest both-systems result yet.** Modal is the second
structurally-rich piece after Tabs, and it survives more completely: API absorbs both AND
the look is a pure token swap. The single-canonical-API model still holds; the first true
API break is still expected at the **data grid / wizard**, not here. Rule honoured: nothing
muddied or fabricated — pieces absent from both systems (toast/tag/empty-state) are recorded
gaps, not tool builds.

---

## 4e. Alert native-both + Badge one45-2020s-only — enshrined 2026-06-23 [D][I]

Fourth slice. Corrects the two pieces §4d flagged as mis-sourced; no new component invented,
the topology fixed to match reality.

**Alert → native-both.** Legacy ships a real `.one45-alert` (`new_branding.scss:65-170`, over
154 `Error/*` Twig includes), so Alert is now native in **one45-2020s + legacy** (was one45-2020s-only +
bridge). `INTERIM_BUILDS` keeps Alert for **lowfi only** (lowfi has no real alert). The
canonical API gains `variant` ∈ info/success/warning/error. "Different mechanism, same surface"
(axis a, §5): one API, but the skin is **per-system** — one45 (2020s) a tinted banner (family
lightest-bg / darkest-fg / DEFAULT accent; families [D], tint pairing [I]); legacy a solid pale
fill, radius 0, pad 16px (`app.css` structural override, the Tabs rule). All eight variant text
pairs pass AA (`contrast.mjs`):

| | info | success | warning | error |
|---|--:|--:|--:|--:|
| one45 (2020s) (darkest on lightest) | 7.42 | 7.68 | 4.82 | 10.68 |
| legacy ($one45_black / white on fill) | 7.85 | 10.24 | 10.16 | 9.00 |

**Badge → one45-2020s-only.** The real Badge is the acuity-DS component (`label`/`color`/`type`,
demo-page only); legacy has **no** status badge (`.badge-details` is a profile-photo widget), so
Badge is removed from legacy's skins and resolves through the bridge (first-native substitution,
no `INTERIM_BUILDS` entry — so the cruder fallback stays observable) in **legacy + lowfi**. Badge
is now the genuine present-vs-absent piece (axis b), the mirror of one45-2020s-lacking-Breadcrumb.

**Net bridge topology after this slice:** Alert native one45-2020s+legacy, interim lowfi · Breadcrumb
native legacy+lowfi, interim one45-2020s · Badge native one45-2020s, substitute legacy+lowfi. A DEV
self-check (`gallery-selfcheck.ts`) now asserts this topology so a future regression warns.

---

## 4f. Foundation completion slice — enshrined 2026-06-23 [D]

Fifth slice. Completes the token layer's remaining foundation categories (radii,
elevation/shadow, motion, z-index, opacity). No component or prototype — token +
documentation work, browser-verified across one45-2020s / one45-legacy / lowfi (the existing
skins re-read the tokens). Closes the open foundation rows from the handoff checklist.

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **The one45 (2020s) theme defines NONE of the five** (no `borderRadius`/`boxShadow`/`transition*`/`zIndex`/`opacity` key; `tailwind.config.js` `extend: {}` empty → Tailwind defaults render) — extends the Layer-1 radius/shadow gap to the full foundation set | `tailwind_acuity_theme.js` (full read); `main.jsx:257` [D] |
| **Legacy has real radii + shadows but no motion/z-index/opacity scale** — `.btn` 3px / `.modal` 6px / modal `0 3px 7px rgba(0,0,0,.3)` / navbar `0 1px 4px rgba(0,0,0,.065)`; the only motion is `transition: unset`; z-index is ad-hoc (`.popover 1000` override, `#overlay` 9999); opacity only for disabled + the `#overlay` scrim | `_bootstrap.scss:110,113,153,229`, `new_branding.scss:211,227`, `_overlay.scss:3-4` [D] |
| **Motion / z-index / opacity are STRUCTURAL, not per-brand** — neither system defines a scale, so they live once in `:root` (motion `120/200ms` + standard ease; z-stack `1000–1070`; `--ds-opacity-disabled 0.5`) and are not re-skinned per system | `tokens.css`; both theme sources [D] |
| **Opacity-for-prominence nit fixed** — `.flow-row__meta { opacity: 0.7 }` replaced with a real `--ds-fg-muted` colour (`#5f5f5f` **6.39:1** AA on white; lowfi `#6a6a6a` 5.41:1) per the no-opacity rule; ratios computed | `contrast.mjs` "Foundations"; `app.css` |

**Anatomy result [D] — foundations are the LEAST divergent layer.** Radius and elevation are
per-brand (sourced for legacy; framework/tool defaults flagged for one45 (2020s), which tokenizes
neither), but motion, z-index, and opacity are structural and identical across systems — so
they are defined once, not bridged or re-skinned. The new `radius`/`shadow` `-sm`/`-lg` steps
are the foundation the data-grid / dropdown / drawer slices will read. Rule honoured: every
one45 (2020s) "value" is flagged as a framework/tool default, not presented as an authored token;
the gap is recorded, never papered over.

---

## 4g. Iconography slice — enshrined 2026-06-23 [D][R]

Sixth slice. Completes the last open foundation category (iconography) and adds the real DS
icon API. Canonical pieces: `Icon` reworked from a placeholder to the real named API, and a
new **`IconButton`** — both native in all three systems. No new prototype (a foundation slice,
like §4f); `Icon` is wired into the `casper-score-report` + `applicant-review` rows, exercised
in the gallery via specimens. `npm run check` clean; gallery + coverage matrix verified across
one45-2020s / one45-legacy / lowfi with annotations on and off (both native → never flagged).

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **The Acuity DS Icon API is `name` + `size` (small\|medium) + `altText`** on a standalone `<Icon>`, plus `iconName`/`iconSize` convenience props on Button/IconButton/Modal/Link. The icon-name vocabulary is a **custom named set** (`add`, `edit`, `delete`, `checkCircle`, `warning`, `bookmark`, `download`, `infoCircle`, `linkNewTab`, `questionCircle`, `resourceCenter`, `error`), recovered from usage | `designSystemTest/main.jsx:330-521` island recovery [D] |
| **The one45 (2020s) icon glyph ENGINE is not vendored** — `@takecasper/acuity-design-system` is absent from the snapshot, so which renderer (sprite/font/inline-SVG) draws the names is undeterminable; the names are the only registry. Recorded **asset gap**, not guessed | island recovery [D] |
| **one45 (2020s) icon sizes [R]-confirmed** — the DS renders Icon as an SVG at **small 16px / medium 24px**, and **IconButton at 38×38px** (10px pad, 4px radius); colour via `ds-text-*`/`ds-stroke-*` (currentColor). Now carried in `tokens.css` | `/test/designSystem` getComputedStyle, 2026-06-23 (signed in) [R] |
| **Legacy iconography is THREE overlapping mechanisms**, not one: **FontAwesome Pro 5.15.3** webfont (default `0.9rem`, alert icons `1.5rem`, only scale class `fa-2x`), older **famfamfam Silk** 16px PNG sprites, and **Semantic UI** icon font in webeval markup; `.icon-button` is 25×25px | `package.json:13`, `fontawesome.scss:2-16`, `new_branding.scss:86`, `themes/one45.css:289,1279` [D] |
| **FA Pro + the PNG sprites are assets the tool can't ship** (a paid webfont / binaries) — the legacy glyph artwork is the same kind of **asset gap** as one45 (2020s)'s. Both systems render a token-sized currentColor stand-in (brand monogram / lowfi sketch box), never claimed as the real glyph | `fontawesome.scss:1` (font path) [D] |
| **No webeval icon tag exists** — `tag_tutorials/` has zero icon/glyph entries; webeval emits FA/Semantic `<i>` markup inline in the PHP outputters, not a first-class tag | `tag_tutorials/` grep = 0; outputter `<i>` usages [D] |
| **Legacy icon colour is explicit palette vars per context** (the alert icons: teal `#2FAEA1` / yellow `#F8B223` / red `#F12F62` / purple-light `#B3B9CB`) — no `currentColor` rule; the tool's `tone` prop reuses these as the real semantic icon colours | `new_branding.scss:100,119,140,159`; `_colors.scss` [D] |
| **Semantic icon tones FAIL 3:1 at icon scale** — as the glyph on white: one45 (2020s) warning-yellow `#FCE833` **1.26**, info-blue `#1E93BA` 3.54, success-green `#4DA81F` 3.03; legacy yellow `#F8B223` **1.84**, teal `#2FAEA1` **2.73**, info purple-light `#B3B9CB` **1.96**, red `#F12F62` 3.95. A semantic icon must not rely on hue alone — the tool pairs shape + `altText`/adjacent label | `contrast.mjs` "icon tones" [D] |

**API adaptation (recorded):** the canonical name prop is exposed as **`iconName`** (not the DS's
`name`) because `name` selects the canonical piece in `<Canonical name="Icon">` — the same
selector collision `Radio`'s `group` avoids. The DS size names (small/medium) and `IconButton`'s
`label`-as-accessible-name are kept faithfully.

**Anatomy result [D] — iconography is an "axis a" divergence with a shared asset gap.** Both
systems have a real icon SYSTEM built differently (one45 (2020s) a named-vocabulary component; legacy a
FontAwesome/sprite webfont stack), so one canonical API absorbs both and the two-step size scale
absorbs named (one45-2020s) vs rem (legacy) sizing — the single-canonical-API model survives again.
The genuinely new wrinkle is that the real GLYPH ARTWORK is unavailable in BOTH systems (un-vendored
DS package / paid font / binaries), so this is the first slice whose fidelity gap is the assets
themselves, not the API or skin. Recorded honestly as a stand-in (README "Gaps and legitimate
omissions"); the API, size scale, and colour rule ARE faithful. Rule honoured: no glyph artwork
fabricated and passed off as a system's real icons.

---

## 4h. Layout & grid slice — breakpoints / grid foundation enshrined 2026-06-23 [D]

Seventh slice. Closes the **last** open foundation row from the handoff checklist
(breakpoints / grid & layout). No component or prototype — token + documentation work,
browser-verified across one45-2020s / one45-legacy / lowfi (no regression; the new tokens have no
visible consumer yet, by design). With this row the foundation token layer is complete.

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **Neither system authored a responsive breakpoint scale** — one45 (2020s)'s Tailwind theme has no `screens` key (`tailwind.config.js` spreads it with empty `extend:{}`) and **zero** responsive prefixes (`sm:`/`md:`/`lg:`) compile across the 87 islands; legacy authors exactly **one** breakpoint, `768px` (adaptive-nav collapse) | `tailwind_acuity_theme.js` (no screens); island grep = 0; `themes/one45-responsive.scss:28,41` [D] |
| **Both products are effectively single-breakpoint DESKTOP apps** — one45 (2020s) lays out with flexbox (`ds-flex` ×91) + the spacing gap scale, no column grid; legacy is Bootstrap-2 with a hard **`min-width: 1100px`** page floor (`.page-body.row-fluid`) — a fixed-desktop layout, not mobile-responsive | island flex usage; `themes/one45-responsive.scss:6` [D] |
| **Legacy's grid is inherited BS2, never authored** — 12 columns, 20px gutter, 60px column unit, 940/1170px containers are Bootstrap-2 defaults; the legacy SCSS declares no `$grid-columns`/`$grid-gutter-width`/`$container-*` override | `bootstrap.css:149-150,170,203`, `bootstrap-responsive.css:524` [D] |
| **Real legacy-authored layout values are component sizes, not a grid scale** — `$sidebar_width 250px`, nav `.span3` 220px, `$pageheaderheight 40px`, the 1100px page floor; documented, not promoted to shared `--ds-*` tokens (no component consumes them, no one45 (2020s) equivalent) | `_constants.scss:40,48`, `one45-responsive.scss:6,16` [D] |
| **CSS custom properties cannot drive `@media` conditions** — so the breakpoint tokens (`--ds-bp-sm/-md/-lg/-xl`) are reference values for JS / container queries / `clamp()`, not a drop-in for `@media (min-width: var(...))`; the grid-column / gutter / container tokens DO drive `var()`-based `grid-template-columns` / `gap` / `max-width` | CSS spec; `tokens.css` comment [D] |

**No new colour pair** — layout tokens are dimensions, not colours, so `scripts/contrast.mjs` is
unchanged (the slice introduces zero new colours to compute).

**Anatomy result [D] — layout is STRUCTURAL, the least-divergent foundation of all.** Neither
system authored a responsive breakpoint/container/grid-column scale, so — exactly like
motion / z-index / opacity (§4f) — the reference scale lives once in `:root` (bp 640/768/1024/1280;
12 cols; 1rem gutter; 75rem container) and each system overrides only what it really renders
(legacy: the BS2 20px gutter, flagged framework default). These tokens are documentary now,
consumed by the future **Containers & layout** component slice (stack / grid / divider / panel) —
the same defined-now-read-later pattern as the `radius`/`shadow` `-sm`/`-lg` steps. Rule honoured:
no responsive system fabricated where neither product has one; both gaps recorded, the real legacy
768px breakpoint and 1100px desktop floor surfaced as facts. **The foundation token layer is now
complete** (colour / type / spacing / radius / shadow / motion / z-index / opacity / iconography /
breakpoints-grid all enshrined or recorded as a sourced gap).

---

## 4i. Data display slice — Table enshrined 2026-06-23 [D][R]

Fifth slice (first data-display piece), and the long-flagged **"first true API break" test**.
Canonical piece added: **`Table`** (native in all three systems), token-driven, lint-gate-clean,
browser-verified across one45-2020s / one45-legacy / lowfi; pattern prototype
`src/prototypes/cohort-marksheet/` (filter → sort → multi-select → bulk release → confirm Modal → summary).

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **The Acuity DS ships NO table component** — the `/test/designSystem` demo renders zero tables, the consumed-export set has none; real tables are app-level **react-table v7** over a raw `.table` | island recovery [D]; `/test/designSystem` + live-app probe [R] 2026-06-23 |
| On the live one45 (2020s) app a bare `.table` gets **no authored skin** — inherits only Lato 14px `#333`, `th` 700 (`--bs-table-hover-bg` empty; the BS5 `#FDF3F6` is not live on the classic app) | staging `getComputedStyle` [R] |
| The one real rendered one45 (2020s) table (the marksheet, `marksOverview2.php`) = `border-collapse`, 1px **`#666`** dividers, tight padding, bold navy `#333366` key rows | staging [R] |
| Legacy owns a **real** custom table skin (`table.report`/`.standard`: `#999` rule, `#444` text, `#BBB` cells, 5px pad, DataTables PNG arrows) — but it is **not live on the modern staging** (legacy classes render inert there) | `_tables.scss` [D]; staging [R] |
| Legacy table header rule **`#999` fails 3:1 (2.85)** — add to the legacy fix list (same class as the `#DDD` input + `#AAA` tab greys) | `contrast.mjs` |

**Anatomy result [R] — the predicted break did NOT happen.** The canonical columns+rows+sort API
absorbs **both** the one45 (2020s) react-table-v7 column model and the legacy DataTables/`.report` grid,
and the skin is a **pure token swap** — no per-system structural override (unlike Tabs). The real
divergence is **inventory**: one45 (2020s) owns no dedicated table (its tables are app-level), legacy owns a
real `_tables.scss` skin. Both render a genuine status quo → Table is **native in all three**, no
bridge, no fabrication. Rule honoured: the one45 (2020s) skin reproduces the minimal real app-table reality
rather than inventing a polished DS table. The rest of data display (list, accordion, avatar, tree,
timeline, stat, code block, key-value) is a follow-up slice.

---

## 4j. Data display slice — Card formalised 2026-06-23 [D][R]

Sixth slice (second data-display piece). The tool's stub `Card` (title + body only) was
**formalised** to the real Acuity DS Card API — new props **`iconName`** + **`footer`** (kept
`title` + children). Native in all three systems, token-driven (`--ds-card-*`), lint-gate-clean,
browser-verified across one45-2020s / one45-legacy / lowfi (annotations on + off — Card never flagged);
pattern prototype `src/prototypes/learner-profile/` (a learner directory `Table` → a profile built
from icon/title/footer Cards, the real DS person-panel shape).

**New findings from this slice:**

| Finding | Evidence |
|---|---|
| **Card is a real first-party Acuity DS component** — consumed with `title`/`content`/`footer`/`iconName` in genuine med-ed domains (person info, group rosters, current-user panels) | island recovery [D] `domain_demo_person_info.jsx:24-90`, `designSystemTest/main.jsx:307-334` |
| The DS Card is a **headerless white flex-column**: border 1px `#B8B8B8`, radius **8px**, padding 24px, ~24px gap, **no shadow**; header row = 24px icon + Lato **20px/600** `#333` title (gap 12px); footer holds the action Buttons | `/test/designSystem` `getComputedStyle` [R] 2026-06-23 |
| **Legacy ships NO bespoke card** — real card surfaces are vendored Bootstrap + the real `.dashboard-widget` tile (1px `#CCC`, grey `h3` band, `#000` 16px); a real island uses react-bootstrap `Card` | `themes/one45.scss:657-715` [D]; `syncJob.jsx` [D] |
| Card border greys **fail 1.4.11** — one45 (2020s) neutrals-light `#B8B8B8` **1.98**, legacy `$grey #D1D1D9` **1.52** (thin decorative borders, flagged, both real tokens) | `contrast.mjs` |

**Anatomy result [R] — Card survives the API test and is a near-pure token swap.** one45-2020s
(headerless) and lowfi (sketch) re-skin purely by tokens; **legacy adds one** per-system
structural flourish — a full-bleed grey header band (app.css), like the legacy box-tab override.
Divergence axis is again **inventory** (axis b): one45 (2020s) owns a real Card, legacy borrows Bootstrap +
the `.dashboard-widget` tile, so Card is **native-both** ("different mechanism, same surface", like
Alert) — no bridge, no fabrication. Legacy bespoke-card `[R]` was not separately captured (cards
render via vendored Bootstrap, not a first-party component); the values are `[D]`-sourced from the
panel idiom — a recorded gap.

---

## 4k. Data display slice — Avatar enshrined 2026-06-23 [D]

Seventh slice (third data-display piece). Canonical **`Avatar`** added — a person photo with a
**`shape` variant** (`circle` default / `card`) carrying BOTH real legacy photo shapes. Native in
one45-legacy + lowfi, token-driven (`--ds-avatar-*`); the **Acuity DS ships no avatar**, so one45-2020s
resolves a **flagged bridge build** (`INTERIM_BUILDS`) — the mirror of Breadcrumb. Lint-gate-clean,
browser-verified across all three (annotations on → flagged in one45-2020s, off → clear; legacy + lowfi
native, never flagged). Pattern prototype `src/prototypes/reviewer-roster/` (a selectable faculty
roster led by a circle `Avatar` → a photo wall of the chosen reviewers as card `Avatar`s — the real
people-picker → roster shape). Prop is **`personName`** (not `name` — `name` selects the canonical
piece, the same collision `Icon`'s `iconName` / `Radio`'s `group` avoid).

**New findings from this slice (the handoff's `.badge-details` lead was wrong):**

| Finding | Evidence |
|---|---|
| `.badge-details` is **NOT** a profile-photo widget — it is a name-dropdown text panel (no `<img>`); the handoff mislabelled it | `themes/one45.scss:483-499`, `userprofile_badge.js:1-50` [D] |
| **Two** real legacy photo shapes, both enshrined as the one Avatar: the inline **circle** `.profile-img` (circular, 25px sm / 60px lg, 2px ring, `blank.gif` fallback) and the yearbook **card** `.photo` (a 75-wide `#bbb`-bordered `#fff` card, 3px pad, square corners, holding a 75×98 image with a name caption beneath in `#666` at 9px) | `_list_picker.scss:26-31,41-54` [D]; `photoGallery.css:8-60`, `photo.php:14-62` [D] |
| **Acuity DS ships NO avatar/profile-photo component** — the DS demo page enumerates every component and has none; zero island usages; no avatar token in the theme | `designSystemTest/main.jsx:3-23` [D]; theme `tailwind_acuity_theme.js` [D] |
| **No initials fallback in either widget** — a missing photo shows a placeholder IMAGE (`blank.gif` / `add_photo.gif` / `person_outline.gif`), so the skin renders a placeholder image, never a monogram | `photo.php`, `PersonInfoPage.php:2390-2406` [D] |
| The circle ring is `2px solid` with **no authored colour** (renders `currentColor`) — reproduced faithfully as `currentColor`, flagged `[I]` (colour not separately sourced) | `_list_picker.scss:41-54` [D] |
| Card border `#bbb` / white **fails 1.4.11** (a thin decorative border, flagged, the real token) | `contrast.mjs` |

**Anatomy result — Avatar is a present-vs-absent (axis b) divergence, the Breadcrumb mirror.**
A real legacy piece (two real shapes) with no Acuity DS counterpart, so legacy + lowfi render it
natively and the bridge fills one45-2020s with a flagged token-driven build — never a fabricated
stand-in (Spencer's rule: a bridge demo needs a genuinely one-system-only real component, which
Avatar is). The single canonical API absorbs both shapes via one `shape` variant; no API break.

---

## 4l. Data display slice — List enshrined 2026-06-29 [R][D]

Fourth data-display piece. **Neither DS ships a List component** — so List is the second
inventory-gap-on-both-poles piece after Table, resolved per pole because each One45 system genuinely
renders lists, just without a component:

- **one45-2020s — native-minimal.** The Acuity DS package exports no List
  (`designSystemTest/main.jsx:3-23`); the app uses ad-hoc `<ul>`/`<ol>` + `ds-*` utilities
  (`ds-list-disc` `privacyPolicyEn.jsx:79`, `ds-list-decimal` `main.jsx:557`, `flex gap-3`
  `main.jsx:318`). **[R] 2026-06-29 delta:** the intended `text-acuity-blue` flex list paints **black
  `#000`, no gap** on the live DS page — the un-prefixed utilities are not in the compiled `ds-` build
  — so list text is **body, not brand**. The skin reproduces that reality (text `#333`, links the
  compiled `#364699`, gap 12px, indent 16px) — the **Table precedent**.
- **one45-legacy — native.** A real `.list-widget` (`themes/one45.scss:457-467`): markerless `<ul>`,
  25px indent (`$inline_list_spacing_unit`), link items (`$link_color #0A6CBD`). `.records_list` is
  **table** styling (§4i); `canned_list`/`.ul_canned` a **picker** control — neither is the general
  list, so the genuine `.list-widget` is what's enshrined.
- **lowfi** — greyscale sketch. **acuity-canon** — the **package** ships no List, so it resolves
  through the bridge to a flagged interim (`INTERIM_BUILDS`) — the **Table mirror**.

One canonical API (`items` + `variant` ∈ bulleted/numbered/plain) absorbs both poles as a **pure
token swap**; the divergence is **inventory** (axis b on both sides — neither owns a List component)
plus the legacy markerless default (the canonical `plain` variant). **Computed contrast**
(`contrast.mjs`): one45-2020s text `#333`/white **12.63** (AAA) + link `#364699` **8.42** (AAA); legacy
text `#27304B` **13.04** (AAA) + link `#0A6CBD` **5.39** (AA text); lowfi text **11.37**. No new
contrast failures. Tokens `--ds-list-*`; pattern `src/prototypes/rotation-checklist/` (numbered steps
+ bulleted assessments → plain link list), browser-verified across all four systems with the
annotations toggle on (acuity-canon flagged "AI approx") and off (all plain) — native never flagged.

## 4m. Data display slice — Accordion enshrined 2026-06-30 [D][R]

Fifth data-display piece, and the second structural-divergence case after Tabs. **Neither
system ships a dedicated Accordion component** — the third inventory-gap-on-both-poles piece
after Table and List — but each renders collapsible sections, by different mechanisms:

- **one45-legacy — native.** A real authored pattern: `.subheader-sticky.collapsible`
  (`collapsibleHeaders.js` + `collapsibleHeaders.css`, example `curricGroups.php`). A sticky `<h2>`
  header carries a **2px `#27304B` underline** (border-bottom, NOT a card border), a navy
  `#27304B` bold 1.2rem label, white background, and a right-floated chevron that **rotates 90° open**;
  the `.section-content` body is hidden by a `.closed` modifier and sections sit 15px apart
  (`.closed` margin). Hover swaps the label/rule to `#787C88`.
- **one45-2020s — native-via-vendor.** The app renders **react-bootstrap** `<Accordion>` over
  `<Card>` (`syncJob.jsx:2-71` — `Accordion.Toggle` as `Card.Header` + `Accordion.Collapse` +
  `useAccordionToggle`, `defaultActiveKey` single-open). The Acuity DS package exports no Accordion
  (`index.d.ts`), so this is the **Table precedent**: a real status quo built from a vendor lib, not
  a DS component. The skin reproduces the bootstrap card-accordion, its colours pinned to the real
  DS Card surface (§4j): `#B8B8B8` border, 8px radius, `#333` label, `#364699` chevron.
- **lowfi** — greyscale sketch card. **acuity-canon** — the **package** ships no Accordion, so it
  resolves through the bridge to a flagged interim (`INTERIM_BUILDS`) — the **Table/List mirror**.

One canonical API (`items` {header, body, defaultOpen?} + `single?`, single-open by default — the
2020s `defaultActiveKey` model; `single={false}` gives the legacy independent-collapsibles model).
**Computed contrast** (`contrast.mjs`): legacy label/underline `#27304B`/white **13.04** (AAA) +
hover `#787C88` **4.17** (fails AA as normal text, but the header is **1.2rem bold = large text**,
judged on 3:1, which it passes); 2020s + acuity-canon label `#333` **12.63** (AAA) + chevron
`#364699` **8.42** (AAA); lowfi label `#3a3a3a` **11.37**. The `#B8B8B8` card border is a thin
decorative 1px rule (1.98, flagged 1.4.11). No new AA-text failures. Tokens `--ds-accordion-*`;
pattern `src/prototypes/curriculum-groups/` (single-open groups → an independent-panel planner,
mirroring `curricGroups.php`), browser-verified across all four systems with the annotations toggle
on (acuity-canon flagged "AI approx") and off (all plain) — native never flagged.

**Anatomy result [D][R] — the Tabs case repeats: API survives, skin diverges structurally.** The
single canonical API absorbs both the 2020s react-bootstrap single-open accordion and the legacy
independent collapsibles, but the **pure token-swap does NOT** hold — legacy is an underline-header
accordion and 2020s/lowfi/acuity-canon are card accordions, structurally different and rendered
per-system (`app.css`), exactly like Tabs (underline vs box). The divergence is **inventory on both
poles** (axis b — neither DS owns an Accordion component; the 2020s borrows react-bootstrap, legacy
authored its own CSS pattern), plus the structural skin split. Rule honoured: each system's real
mechanism is reproduced accurately, neither flattened to force a tidier token-swap story nor
fabricated where the DS package ships nothing.

## 4n. Data display slice — Tree enshrined 2026-06-30 [D]

Sixth data-display piece, the third structural-divergence case (after Tabs and Accordion).
**Neither system ships a dedicated Tree component** — the fourth inventory-gap-on-both-poles
piece after Table, List, and Accordion — but each renders a real curriculum hierarchy, by
different mechanisms:

- **one45-legacy — native.** The jQuery **dynatree** widget, skinned by the authored
  `_dynatree.scss` (`WidgetBundle`: `.dynatree-container` `border:none` + `margin-left:0`;
  `.dynatree-selected a` colour **acuity-blue `#364699`**, `font-style:normal`) over the vendored
  vista skin (16px node rows, expand triangle, folder/doc sprite). Node label is `$one45_black`
  `#27304B`; the one authored colour is the acuity-blue selected node.
- **one45-2020s — native.** The curriculum tree renders as an indented **tree-TABLE**
  (`canvas_sync mappingTable.jsx` — a recursive `getOne45Events(currics, indentation)` emitting
  `<td style={{paddingLeft: Nrem}}>` rows, an `fa-angle-right`/`fa-angle-down` expand chevron, and
  `collapseEventIds` toggle state). So Tree is **native-via-vendor / app-level** here, the **Table
  precedent** — a real status quo, not a DS component (the ADS package exports none, `index.d.ts`).
- **lowfi** — greyscale sketch. **acuity-canon** — the **package** ships no Tree, so it resolves
  through the bridge to a flagged interim (`INTERIM_BUILDS`) — the **Table/List/Accordion mirror**.

One canonical API (`nodes` — recursive `{id?, label, children?, defaultExpanded?}`). The skin —
indented rows with a rotating disclosure chevron — is the **common denominator** of the two real
trees; the dynatree connector lines + folder/doc sprite are a recorded simplification (the same
icon asset gap as Icon). Indentation per level reads `--ds-tree-indent`. **Computed contrast**
(`contrast.mjs`): 2020s label `#333`/white **12.63** (AAA) + chevron `#5f5f5f` **6.39** (AA) +
accent `#364699` **8.42** (AAA); legacy label `#27304B` **13.04** (AAA) + selected `#364699`
**8.42**; lowfi label `#3a3a3a` **11.37**. No new contrast failures. Pattern prototype
`src/prototypes/program-structure/` (a curriculum tree → a flat List outline), browser-verified
across all four systems with the annotations toggle on (acuity-canon flagged "AI approx") and off
(all plain) — native never flagged.

**Anatomy result [D] — a "different mechanism, same surface" + structural divergence.** Like
Accordion and Tabs, the single canonical API survives (recursive nodes absorb both the dynatree
widget and the indented tree-table), while the underlying mechanisms differ entirely (a jQuery tree
widget vs an indented HTML table). The divergence is **inventory on both poles** (axis b — neither
DS owns a Tree component) plus the per-mechanism skin; the tool reproduces the shared
indented-rows-with-chevron surface honestly and records the dynatree sprite/connector chrome as a
simplification rather than fabricating it.

## 4o. Data display slice — Timeline enshrined 2026-06-30 [D]

Seventh data-display piece, and the first **one45-2020s-only** piece — the inverse of legacy-only
Avatar (axis b, present-vs-absent, pointing the other way):

- **one45-2020s — native.** A real status-history: the EPA requirements history
  (`StagesTrainingBundle/_history.scss` — a `.history-row` flex layout of **date | description |
  status** columns, `#5F5F5F` bold headers, **1px `#f2f2f2`** row dividers, 10px row padding). A
  chronological dated event/status list, rendered server-side (Twig) in the modern app.
- **one45-legacy — absent → bridge.** The legacy/webeval era ships **no** history or timeline
  component at all (zero matches across `webeval` CSS/Twig/PHP). So Timeline resolves through the
  bridge to a flagged interim (`INTERIM_BUILDS`), re-skinned on-brand legacy ($primary_purple
  `#42507D` marker, `$one45_black` `#27304B` title) — the **mirror of one45-2020s lacking Avatar**.
- **lowfi** — native sketch. **acuity-canon** — the **package** ships no Timeline, so it too bridges
  a flagged interim.

One canonical API (`entries` — `{date, title, description?, status?}`, newest-first). The real
`.history-row` is a dated table-row layout; the tool generalises it to a **marker-rail timeline** (a
vertical rail + per-entry dot is a light affordance over the dated rows, recorded as such — not a
fabricated mechanism). **Computed contrast** (`contrast.mjs`): 2020s date `#5f5f5f`/white **6.39**
(AA) + title `#333` **12.63** (AAA) + marker `#364699` **8.42** (AAA); legacy interim title
`#27304B` **13.04** + marker `#42507D` **7.85**; lowfi title `#3a3a3a` **11.37**. No new contrast
failures. Tokens `--ds-timeline-*`; pattern prototype `src/prototypes/assessment-history/` (an EPA's
dated status history → its outstanding steps), browser-verified across all four systems with the
annotations toggle on (one45-legacy + acuity-canon flagged "AI approx") and off (all plain) — the
two native systems never flagged.

**Anatomy result [D] — a clean present-vs-absent (axis b) case, the Avatar mirror.** A real piece in
one one45 pole (the modern app's status-history) with no counterpart in the other (the legacy app
has none), so the owning pole + lowfi render it natively and the bridge fills the rest with a flagged
build. No API break; the only generalisation is the marker-rail presentation of the real dated rows,
recorded honestly rather than claimed as the app's exact chrome.

## 5. Convergence read [I]

The divergence between the two systems is **largely token/brand at the API level** —
the same canonical contract re-skinned (`01 §L2`, `02 §L2`). The single-canonical-API
holds for the legacy↔one45 (2020s) pair (the **Inputs slice §4b confirms this on seven controls**
that re-skin cleanly, no per-system skin needed). But the Navigation slice (§4c) found the
**first place a pure token-swap is not enough**: `Tabs` share the API yet render structurally
different models (one45 (2020s) underline vs legacy Bootstrap box tabs), so each needs its own skin.
The rule going forward: **represent each system's real model accurately — never flatten or
fabricate a component to keep the token-swap story tidy.** The **Modal slice (§4d) then
restored the clean result**: one canonical API absorbs both systems AND the look is a pure
token swap (even the legacy grey header band is two tokens, not a structural override) — so
token-swap holds wherever the two systems share a real structure, and breaks (Tabs) only
where they genuinely render different structures. Beyond Tabs, the **anatomy divergence** is
nameable along two axes: **(a) different mechanism, same surface** — a real component in both,
built differently (Alert: Acuity DS component vs legacy Twig `Error/*` partials + `.one45-alert`
skin; §4d corrected the earlier "one45-2020s-only" read and §4e **enshrined it native-both** — one
API, per-system skin); and **(b) present vs absent** — a real component in one and none
in the other (Breadcrumb: legacy widget vs no one45 (2020s) component — §4c; and Badge: acuity DS vs
no legacy status badge — §4d, **corrected to one45-2020s-only §4e**). Those are the bridge's actual work, and the Navigation slice
**evolved it** past the first-native-piece heuristic: divergent pieces now resolve to a flagged
token-driven build of that piece in the active system (`INTERIM_BUILDS`, §4c), not an unrelated
component. The Data display slice (§4i) then ran the long-predicted **data-grid API-break test —
and it passed**: one columns+rows+sort API absorbs both the one45 (2020s) react-table-v7 model and the
legacy DataTables/`.report` grid as a **pure token swap**, no structural override. The divergence
there is **inventory** (axis b — the Acuity DS owns no table component; legacy owns a real
`_tables.scss` skin), not API or structure. **Card (§4j) repeats the pattern with the axes
inverted**: one45 (2020s) owns a real first-party Card while legacy owns none (borrowing Bootstrap + the
`.dashboard-widget` tile) — native-both inventory divergence, a near-pure token swap with the one
legacy grey-band flourish (like the legacy box tabs). **Avatar (§4k) is the cleanest axis-b case
yet** — a real legacy piece (two real photo shapes) with no Acuity DS counterpart at all, so it is
the genuine one-system-only bridge demo (the Breadcrumb mirror): legacy + lowfi native, one45-2020s a
flagged interim, one `shape` variant absorbing both shapes with no API break. The broader 7-system
reality (Semantic UI / Bootstrap 2 / jQuery-UI / webeval) **is** structurally
divergent — but six of seven die in the rebuild, so the convergence target is
one45 (2020s), and this map is the list of what to fix in it first.
