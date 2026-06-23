---
title: One45 Design System — Acuity (modern)
tags: design-system, one45, acuity, tokens, components, contrast, reverse-engineering
verified: true
---

# System B — Acuity (One45 modern)

The deliberate, modern design system — the one asset worth carrying forward
verbatim. Three layers, kept separate: **Tokens** (documented intent),
**Components** (inventory + which stack renders each), **Rendered reality** (what
actually paints, including colours in no token file).

**Evidence labels:** **[D]** deterministic (scripted/grep, count of record) ·
**[R]** runtime-confirmed on staging 2026-06-19 · **[I]** code-derived inference.
Counts trace to internal analysis (re-run this session, reproduce to the digit)
and `path:line` source citations.

Live in the prototyping tool as system id **`acuity`**
(`src/systems.tsx`, `src/styles/tokens.css`). Portable token export:
[`tokens/acuity.json`](tokens/acuity.json).

---

## Layer 1 — Tokens (documented intent) [D]

**Source of truth (and the problem): the same set exists in FOUR hand-synced
copies, no shared origin** (internal analysis):

| Representation | File | Count | Form |
|---|---|--:|---|
| Tailwind JS theme | `symfony/tailwind_acuity_theme.js:30-106` | 55 hex | build-time JS object |
| CSS custom props | `symfony/web/vendor/webeval_ss/acuity_branding.css` | 55 `--ds-*` | runtime `:root` vars |
| Tailwind compiled | `symfony/tailwind_final.css:325-466` | subset emitted | `ds-bg-acuity-*` utilities |
| SCSS vars | `_colors.scss:37-95` | 49 Acuity (+38 legacy) | build-time `$acuity-*` |

Tailwind-JS and CSS-var counts match exactly (55 = 55, verified this session).
This is the **4× duplication** — see the reconciliation map.

**Colour — 8 families × 6 shades + a 9-member neutrals family** [D]
(`tailwind_acuity_theme.js:30-105`). DEFAULT values:

| Family | DEFAULT | darkest → lightest |
|---|---|---|
| acuity-blue | `#364699` | `#161E4A` `#253170` `#364699` `#7779B8` `#B0B1D7` `#E9ECF6` |
| acuity-green | `#00A59B` | `#00514B` … `#EBF6F5` |
| acuity-red | `#BA1E50` | `#5C0924` … `#FBEAEC` |
| secondary-blue | `#2C76BC` | `#15436E` … `#EAF1F9` |
| information-blue | `#1E93BA` | `#0D556D` … `#EBF4F8` |
| success-green | `#4DA81F` | `#24590A` … `#EEF8EB` |
| warning-yellow | `#FCE833` | `#816E09` … `#FEFBE0` |
| danger-red | `#E40A0A` | `#720202` … `#FFECE8` |
| neutrals | `#8C8C8C` | black `#000` · darker `#333` · dark `#555` · DEFAULT `#8C8C8C` · light `#B8B8B8` · lighter `#F5F5F5` · white `#FFF` + 2 transparents |

Full values in [`tokens/acuity.json`](tokens/acuity.json).

**Type** [D] (`tailwind_acuity_theme.js:12-29`): family **Lato** (sans) / Georgia
(serif); 7-step scale `sm` `base` `lg` `xl` `2xl` `3xl` `4xl` (0.875rem→2.25rem,
each with a paired line-height); 3 weights `normal/semibold/bold` (400/600/700).

**Spacing** [D] (`:2-11`): 8 keys `0`–`7` (0, 4, 8, 12, 16, 24, 32, 48 px).

**What is NOT tokenized** [D][I]: **no radius, no shadow** token anywhere in the
theme file — the set covers colour / type / spacing / weight only. The tool uses
tool-default radius/shadow for `acuity` and flags them as non-tokens
(`tokens.css` comments). Any "Acuity radius/shadow" is a per-component CSS
decision, not a governed token. Runtime token adoption app-wide is **~nil outside
the Tailwind layer** — Semantic UI ships 0 custom props, source SCSS/CSS 0; only
`tailwind_final.css` uses CSS custom props meaningfully (53, mostly `--tw-*`
plumbing) (internal analysis).

---

## Layer 2 — Components (inventory + which stack renders each) [D]

**Critical honesty: Acuity is a token/brand skin, not a separate component
library on the server side.** The "brand" (Acuity vs legacy one45) is selected by
a page-template toggle `design_system_style = 'acuity' | 'one45' | 'none'`
(`React/react_page_base.html.twig:14`) that swaps **stylesheets**, over the SAME
shared component stacks (Twig includes, the React islands, the webeval engine).
The brand does not change which components exist; it changes how they paint. This
is the key input for the prototyping tool's anatomy-divergence question — see the
reconciliation map.

**The one place Acuity is a real component set: the React islands.**

| Stack | What | Count | Cite |
|---|---|--:|---|
| `@takecasper/acuity-design-system` | external npm DS, the real Acuity components | 21 distinct / **257 uses** | `package.json:53` `^1.27.0`; react-scanner attribution |
| react-bootstrap | competing stack, same React layer | 14 / 66 | internal analysis |
| semantic-ui-react | competing stack | 1 / 16 | internal analysis |
| PageBundle/common fork | local React fork (StatefulButton/ConfirmModal/SortableTable…) | 5 / ~21 | internal analysis |

Acuity DS components by use [D] (react-scanner rollup): Heading 63 ·
Button 57 · Card 30 · TextInput 15 · Alert 14 · Icon 10 · Dropdown/Link/Badge/
ProgressBar 8 · Tab 7 · Textarea 7 · Modal 5 · IconButton/Spinner 4 · Tabs 3 ·
Checkbox 2 · LabelAtom/TextInputAtom/Radio/FormValidation 1 each.

**Adoption is shallow** [D]: 257 DS calls vs 1,130 raw HTML intrinsics in the same
JSX, and `ds-` Tailwind utilities appear only **402** times app-wide against
**3,165** hardcoded px + **222** unique raw hex in Symfony source (internal
analysis, this session). Coverage of the token-governed UI is **~10–20%**. No
Storybook, no path aliases — cross-bundle reuse via `../../../../../../` chains.

**In the prototyping tool:** `acuity` skins Button, Card, Badge, **Alert**, Image,
Icon (`src/systems.tsx`). Alert is modelled as a first-class Acuity piece
(DS Alert, 14 uses) — and is the **sourced divergence** against legacy, which has
no Alert (Layer 2 of `02-one45-legacy.md`).

---

## Layer 3 — Rendered reality [R]

Modern Symfony surfaces (Reports Center, report param form, report table base)
scan **markedly cleaner** than the legacy layer — the Acuity-skinned pages are the
better-behaved half. But the deliberate palette still ships contrast debt, and the
rendered app paints colours that exist in **no token file**:

- **Colours in no token file** [R]: config nav `#e46b6b`,
  My eDossier `#2196f3` on sidebar `#27304b`, and the rotation-grid colour-coding —
  none of these are Acuity tokens. The token set governs a minority of the painted
  surface.
- **Contrast, computed** (deterministic, `scripts/contrast.mjs`). Thresholds: text
  4.5 · UI/large 3 · AAA 7.

| Token pair | ratio | verdict |
|---|--:|---|
| acuity-blue DEFAULT `#364699` on white / white on it | 8.42 | PASS (incl. AAA) |
| acuity-red DEFAULT `#BA1E50` on white | 6.20 | PASS |
| danger-red DEFAULT `#E40A0A` on white | 4.83 | PASS |
| secondary-blue DEFAULT `#2C76BC` on white | 4.75 | PASS |
| neutrals dark `#555555` on white | 7.46 | PASS (AAA) |
| **information-blue DEFAULT `#1E93BA` on white** | 3.54 | **FAIL text** · ok UI/large |
| **neutrals DEFAULT `#8C8C8C` on white** | 3.36 | **FAIL text** · ok UI/large |
| **acuity-green DEFAULT `#00A59B` on white** | 3.06 | **FAIL text** · ok UI/large |
| **success-green DEFAULT `#4DA81F` (white label)** | 3.03 | **FAIL text** · ok UI/large |
| **neutrals light `#B8B8B8` on white** | 1.98 | **FAIL all** (border/placeholder) |
| **warning-yellow DEFAULT `#FCE833` on white** | 1.26 | **FAIL all** (invisible as fg) |

Every `light` shade used as text fails AA (computed: blue 4.03, red 3.30, green
2.12, etc. — `scripts/contrast.mjs`). **The deliberate palette has real
low-contrast members**; the prototyping-tool `acuity` skin therefore uses
neutrals-darker `#333` (12.63:1) for body text, not neutrals DEFAULT, and flags
the border-grey weakness (`tokens.css`).

---

## Inputs & controls — enshrined slice [D][R]

The first deliverable to enshrine the **full** component surface (the rest of the
checklist is tracked in internal analysis). Inputs are
now live canonical pieces in the tool (`TextField, Textarea, Select, Checkbox,
Radio, Toggle, SearchField` + `Button` variants), token-driven and browser-verified
across all three systems 2026-06-22.

**Layer 1 — the real DS form API** [D] (recovered from the React-island usage, since
`@takecasper/acuity-design-system ^1.27.0` is not vendored — `package.json:53`):

- Validation surface is **`state` ∈ default|error|success + `message` + `helpText[]`
  + `optionalityLabel`** — there is **no `error` boolean and no `placeholder`** on any
  DS form control (cite: `manage_pronouns/pronounsModal.jsx:72`,
  `canvas_sync/components/mappingModal.jsx:192`, `designSystemTest/main.jsx:643-668`).
- **Button variant enum is authoritative**: `primary | secondary | danger | inline`,
  default `primary` (`PageBundle/.../common/statefulButton.jsx:66,82`). Button always
  carries both `text` (visible) and `label` (a11y); **no `color`/`size` prop**.
- Production-proven controls: **TextInput, Dropdown, Button**. Demo-only (only in
  `designSystemTest/main.jsx`): Textarea, Checkbox, Radio, IconButton, FormValidation.

**Layer 3 — rendered reality** [R] (live DS gallery `/test/designSystem`, 2026-06-22,
`getComputedStyle` on `.ds-form-input`/`.ds-form-select`/`ds-btn`):

| Control | Real rendered values |
|---|---|
| TextInput / Select / Textarea | Lato 16px, text `#333`, **border 1px `#949494`**, **radius 4px**, padding 8px, height 40px |
| TextInput **error** | border `#E40A0A` (danger-red) + text `#720202` (danger-red-darkest) |
| TextInput **success** | border `#4DA81F` (success-green) |
| Button primary / secondary / danger | bg `#364699` / white+border `#949494` / bg `#E40A0A`; radius 4px, pad 12×16, h50, weight 600 |
| Shell "Find a person" search | bg `#EBEDF2`, pill radius 80px, text + focus-ring `#42507D` ($primary_purple) |

**Intent-vs-reality deltas, recorded:**
1. The DS input border is **`#949494` (3.03:1, passes 1.4.11)** — the accessible grey
   the contrast-fix map recommended, **not** the failing neutrals-light `#B8B8B8`. The
   DS already got this right; the failing grey is elsewhere.
2. The DS input focus ring is **`:focus-visible`-gated (keyboard only)**; the tool
   uses acuity-blue `#364699` (8.42:1) for a visible, branded ring.
3. The Acuity **shell** search paints **purple `#42507D`** (legacy `$primary_purple`)
   for text and focus — purple is not purely a legacy colour; it persists in the Acuity
   chrome.

**Computed contrast** (`scripts/contrast.mjs`, "Acuity form controls" section): input
border `#949494` **3.03** (UI PASS), error border `#E40A0A` **4.83** (PASS), success
border `#4DA81F` **3.03** (UI PASS), focus ring `#364699` **8.42** (PASS), shell-search
text `#42507D` on `#EBEDF2` **6.7** (PASS).

**Anatomy result:** every input maps 1:1 to a single canonical API re-skinned by tokens
— **one component set holds for the whole inputs group** across acuity / one45-legacy /
lowfi with zero prototype edits (verified in-browser). The single-canonical-API model
survives this group intact; the genuine anatomy divergence stays with Alert (see
reconciliation map §5). This is a positive answer to the anatomy question for
inputs, recorded as data, not assumed.

---

## Navigation — enshrined slice [D][R]

Second component group enshrined (2026-06-22). New canonical pieces in the tool:
**`Tabs`, `Link`** (all three systems) + **`Breadcrumb`** (legacy-only — see below).
**No `Pagination`** is enshrined: neither DS defines one, so fabricating it would
misrepresent both systems. Browser-verified across acuity / one45-legacy / lowfi.

**Layer 1 — the real DS nav API** [D] (recovered from React-island usage):

- **Tabs** is index-based: `activeTabIndex` (number) + `handleTabChange(index)` +
  `isNested` (bool); child **`Tab`** carries `title`, `id`, `badgeText`
  (`designSystemTest/main.jsx:935-994`). The canonical tool piece exposes one
  **id-based** contract (`tabs[]`, `active`, `onSelect(id)`) — index-vs-key is hidden
  behind it. `badgeText` (e.g. "CA"/"FR" on the gallery) maps to `badge`.
- **Link**: `text` + `type` ∈ `default | inline` + `href`/`target`; `iconName`
  (`"linkNewTab"`) pairs with `target="_blank"` (`one45EvaluationImporter.jsx:89`,
  `designSystemTest/main.jsx:124-299`). Canonical maps `type` → `variant`.
- **INVENTORY GAP**: the Acuity DS package ships **no Breadcrumb, no Pagination,
  no Navbar/Sidebar, no Stepper** component — zero usages recovered across every island.
  (`Heading` is a text heading, `ProgressBar` is a bar, not a stepper.) These are recorded
  gaps, not fabricated. Pagination is absent from BOTH systems, so it is not enshrined at all.

**Layer 3 — rendered reality** [R] (live DS gallery `/test/designSystem`, 2026-06-22,
`getComputedStyle` on `[role="tab"]` and `a`):

| Element | Real rendered values |
|---|---|
| Tab label | text `#000` (neutrals-black), Lato 16px, weight 400, pad 8px |
| **Active tab** | underline **`#00A59B` (acuity-green) 2px** — NOT acuity-blue; inactive underline transparent |
| Nested tab (active) | boxed variant: border `#949494` 1px + white bg (separate from the top-level strip) |
| Link | `#364699` (acuity-blue) underlined; hover removes underline; active `#161E4A` (acuity-blue-darkest); visited `#551A8B` |

**Intent-vs-reality deltas, recorded:**
1. The active-tab indicator is **acuity-green `#00A59B`**, sourced to
   `tailwind_acuity_theme.js:42` / `_colors.scss:46` — easy to assume acuity-blue; the
   render proves otherwise. Computed **3.06:1** (UI PASS, 1.4.11), but a thin 2px hue cue.
2. Acuity has **no breadcrumb component** at all. In the tool, `Breadcrumb` is absent
   from acuity's skins so it resolves through the **bridge** to a flagged, token-driven
   AI build (the mirror of legacy lacking `Alert`). `Pagination` is enshrined in neither
   system (it exists in neither's real DS), so it is not added at all — not fabricated as
   a tool build.

**Computed contrast** (`scripts/contrast.mjs`, "Acuity navigation" section): active-tab
indicator `#00A59B` **3.06** (UI PASS), tab strip `#949494` **3.03** (UI PASS), link
`#364699` **8.42** (PASS), link-active `#161E4A` **15.92** (AAA).

**Anatomy result — the first crack:** the canonical **API** survives (Acuity's index-tabs
and legacy's key-tabs both absorb into one id-based `Tabs` contract), but the **pure
token-swap skin does NOT**. Acuity tabs are an **underline-indicator** model (acuity-green
underline); legacy tabs are **Bootstrap box folder tabs** — a genuinely different visual
structure. The tool renders each faithfully via a per-system skin
(`:root[data-ds="one45-legacy"] .sk-tab` in `app.css`), rather than flattening legacy into
the underline model. This is the first piece where "one component, tokens only" stops being
enough; it is recorded as data, not forced. On top of that the **inventory diverges both
ways** (Acuity has a real `Tabs` DS component; legacy has `Breadcrumb`; neither has
`Pagination`) — the bridge's job (see reconciliation map §4c, §5).

---

## Feedback & status — enshrined slice (Modal) [D][R]

Third component group, first piece (2026-06-22). New canonical piece: **`Modal`** (all
three systems). Browser-verified across acuity / one45-legacy / lowfi.

**Layer 1 — the real DS Modal API** [D] (recovered from React-island usage): the Acuity
DS `Modal` is a headlessui Dialog: `open`, `onClose`, `title`, `content`, `footer`,
`backdrop` ∈ `static | dismissible`, `icon` + `iconName` ∈ `warning | infoCircle`,
`dismissible`, `horizontalRule` (`common/confirmModal.jsx:34`, `pronounsModal.jsx:68`,
`designSystemTest/main.jsx:541-576`). The canonical tool piece exposes one contract
(`open`, `title`, `onClose`, `dismissible`, `icon`, `footer`, children = body).

**Import-list reality** [D]: of the feedback set, the acuity package imports only
**`Alert`, `Modal`, `Badge`, `ProgressBar`, `Spinner`** — and only **Alert + Modal** are
used in production islands (Badge/ProgressBar/Spinner appear on the demo page only).
**Toast, tooltip, popover, tag/chip, empty-state are not in the package** (zero usages).

**Layer 3 — rendered reality** [R] (live DS gallery `/test/designSystem`, 2026-06-22,
`getComputedStyle` on the opened Dialog):

| Element | Real rendered values |
|---|---|
| Panel | bg `#FFFFFF`, border-radius **8px** (`ds-rounded-lg`), shadow **`0 2px 8px rgba(0,0,0,.12)`** (`ds-shadow-modal`), max-height 90vh |
| Scrim | **`rgba(0,0,0,.25)`** (`neutrals-transparent-medium` — the real token) |
| Title | `#333` (neutrals-darker), **23px** (the `2xl` step), weight 600, Lato — set on the white panel with **no header band** (headerless) |
| Footer | right-aligned action buttons (Close / Cancel / Confirm on the demo) |

**Computed contrast** (`scripts/contrast.mjs`, "Acuity Modal" section): modal title
`#333` on `#FFF` **12.63** (AAA).

**Anatomy result — the API-survival test PASSED, and so did pure token-swap.** Modal is
the second structurally-rich piece (after Tabs). One canonical API absorbs both the Acuity
headlessui Dialog and the legacy Bootstrap modal. And unlike Tabs, the visual divergence
(legacy's grey header band vs Acuity's headerless title) is **pure token swap**
(`--ds-modal-header-bg` / `-border`) — **no per-system structural override needed**. So the
single-canonical-API model holds and token-swap holds: the cleanest result yet. The first
true API break is still expected at the data grid / wizard, not here.

**Adjacent findings (reworked the following slice — see Alert below):** the tool's `Alert`
was modelled acuity-only, but legacy ships a **real** alert (`.one45-alert` + 154 `Error/*`
Twig uses) — now reworked to **native-both** (reconciliation §4d/§4e). The tool's `Badge`
was the real acuity-DS Badge but mis-shared to legacy (legacy has **no** status badge) — now
corrected to **acuity-only**. Toast, tag/chip and empty-state are absent from **both** systems
→ not enshrined.

---

## Feedback & status — Alert enshrined (native-both) [D][I]

Fourth slice (2026-06-23). New canonical piece: **`Alert`**, now native in **acuity + legacy**
(corrected from the earlier acuity-only model). Browser-verified across acuity / one45-legacy /
lowfi, annotations on and off; lint-gate-clean.

**Layer 1 — the real DS Alert API** [D] (recovered from React-island usage,
`designSystemTest/main.jsx`, `canvas_sync/components/mappingTable.jsx`): the Acuity DS `Alert`
takes `variant` ∈ `info | success | warning | error`, `title`, `titleSize` ∈
`none | small | large`, `description` / `content`, `showIcon`, `isDismissible`, `handleClose`.
The canonical tool piece exposes one contract (`variant`, `title`, children = body).

**Layer 1 — colour [D] / Layer 3 — rendering [I]:** each variant maps to a semantic colour
**family** (real tokens, `tailwind_acuity_theme.js`): info → information-blue, success →
success-green, warning → warning-yellow, error → danger-red. The acuity-DS Alert component CSS
is **not vendored**, so the tool renders each as a **tinted banner**: `bg` = family *lightest*,
`fg` = family *darkest*, accent left-border = family *DEFAULT*. The families are sourced [D];
the lightest/darkest tint pairing is the tool's faithful **rendering [I]**, flagged the same way
as the radius/shadow tool-defaults. (`mappingTable.jsx` corroborates `information-blue-darkest`
as info text.)

| Variant | bg (lightest) | fg (darkest) | accent (DEFAULT) | text contrast |
|---|---|---|---|---|
| info | `#EBF4F8` | `#0D556D` | `#1E93BA` | **7.42:1** (AAA) |
| success | `#EEF8EB` | `#24590A` | `#4DA81F` | **7.68:1** (AAA) |
| warning | `#FEFBE0` | `#816E09` | `#FCE833` | **4.82:1** (AA) |
| error | `#FFECE8` | `#720202` | `#E40A0A` | **10.68:1** (AAA) |

(`scripts/contrast.mjs`, "Acuity Alert" section.)

**Anatomy result [R] — "different mechanism, same surface" (axis a).** One canonical API
absorbs both the Acuity DS Alert and the legacy `.one45-alert`, but — like Tabs, unlike Modal —
the **skin does not pure-token-swap**: Acuity is a tinted banner with an accent border; legacy
is a solid pale fill, radius 0, padding 16px (rendered per-system in `app.css`). The API
survives; the look is per-system. Rule honoured: each system's real alert is represented
accurately, neither flattened nor fabricated.

---

## Foundation completion — radii / elevation / motion / z-index / opacity [D]

Fifth slice (2026-06-23). Completes the token layer's remaining foundation categories.
No new component or prototype — token + documentation work, browser-verified across all
three systems (the existing skins re-read the tokens).

**Sourcing result — the Acuity theme defines NONE of the five** [D]
(`tailwind_acuity_theme.js`, fully read): no `borderRadius`, `boxShadow`,
`transitionDuration`/`transitionTimingFunction`/`animation`/`keyframes`, `zIndex`, or
`opacity` key. `tailwind.config.js` spreads the theme at the `theme` root with an **empty
`extend: {}`**, so for every key the theme omits, Tailwind's built-in defaults remain.
The islands use exactly one radius utility (`ds-rounded`, `designSystemTest/main.jsx:257`)
which resolves to the framework default; zero shadow / z-index / opacity / duration
utilities are used anywhere. So all five are an explicit **"design system defines none"
gap** — the same situation as radius/shadow already flagged in Layer 1, now extended to
the full foundation set.

| Category | Acuity reality | Tool token (`tokens.css`) |
|---|---|---|
| Radius | no token; one `ds-rounded` = framework default; modal renders `ds-rounded-lg` **8px** [R] | scale `sm 4px` / `base 6px` / `lg 8px` — sm = Tailwind DEFAULT, lg = modal [R], all flagged non-tokens |
| Elevation | no token; modal renders `ds-shadow-modal` **`0 2px 8px rgba(0,0,0,.12)`** [R] | `--ds-shadow-lg` = the modal value [R]; base/`sm` tool defaults |
| Motion | no token → Tailwind default (~150ms, `cubic-bezier(.4,0,.2,1)`) | structural `:root` scale (`fast 120ms` / `base 200ms` / standard ease) — flagged |
| z-index | no token, zero `ds-z-*` usages | shared structural stack (`1000 / 1040 / 1050 / 1060 / 1070`) |
| Opacity | no scale; two colours encode alpha (`neutrals transparent-medium/-light`) — colour, not opacity | only `--ds-opacity-disabled 0.5`; muting uses a **colour** (`--ds-fg-muted`), never opacity |

**Token-layer hygiene fix** [D]: replaced the lone `.flow-row__meta { opacity: 0.7 }`
chrome rule with a real `--ds-fg-muted` colour (`#5f5f5f`, **6.39:1** on white, AA —
`contrast.mjs` "Foundations" section), honouring the no-opacity-for-prominence rule. The
new tokens have live consumers: the Modal layer reads `--ds-z-modal`; the Toggle track/knob
read `--ds-motion-fast` + `--ds-motion-ease`. The `radius`/`shadow` `-sm`/`-lg` steps are the
foundation the data-grid / dropdown / drawer slices will read instead of inventing values.

**Anatomy note:** foundations are where the systems are *least* divergent — radius/elevation
are per-brand (sourced or flagged), but motion, z-index, and opacity are **structural**, the
same for every system, so they live once in `:root` and are not re-skinned. No fabrication:
where Acuity defines nothing, the gap is recorded, not papered over with an invented token.

---

## Iconography — enshrined slice [D][R]

Sixth slice (2026-06-23). Completes the last open foundation category. New canonical pieces:
**`Icon`** (reworked from a placeholder to the real DS API) and **`IconButton`**. Browser-verified
across acuity / one45-legacy / lowfi, annotations on and off; lint-gate-clean.

**Layer 1 — the real DS Icon/IconButton API** [D] (recovered from React-island usage,
`designSystemTest/main.jsx:330-521`): the standalone Acuity DS `<Icon>` takes **`name`**
(custom icon-name vocabulary), **`size`** ∈ `small | medium`, **`altText`**, plus `filled` /
`hasIndicator`; `<IconButton>` takes **`iconName`**, **`iconSize`** ∈ `small | medium`,
**`label`** (the accessible name — not `aria-label`), `onClick`, `type`, `variant` (`default`
seen), `disabled`, `hasTooltip` / `hasIndicator`. `iconName`/`iconSize` also appear as
convenience props on Button / Card / Modal / Link. The canonical tool pieces expose `iconName`
(see API-note below), `size`/`iconSize`, `altText`/`label`, and an optional `tone`.

**Icon-name vocabulary** [D] (the real names recovered from usage — there is no separate
registry, the package is not vendored): `add`, `bookmark`, `checkCircle`, `delete`, `download`,
`edit`, `error`, `infoCircle`, `linkNewTab`, `questionCircle`, `resourceCenter`, `warning`.

**Layer 2 — colour** [D]: icon colour is set by **`ds-text-*` utility classes** (e.g.
`ds-text-success-green-darkest`, `ds-text-acuity-green`), not a colour/`fill` prop — i.e.
effectively `currentColor`. The tool defaults to `currentColor` and maps the optional `tone`
(success/warning/error/info) to the semantic accent colours.

**Layer 3 — rendered sizes [R] + the artwork asset gap** [D] (live DS gallery
`/test/designSystem`, 2026-06-23, signed in, `getComputedStyle` on the rendered `<svg>`): the DS
Icon renders as an **SVG** at **small = 16px**, **medium = 24px**, coloured by
`ds-text-*`/`ds-stroke-*` utility classes (currentColor); the DS **IconButton is 38×38px** (10px
pad, 4px `ds-rounded`, transparent bg, `neutrals-black` glyph, hover `neutrals-transparent-light`).
`tokens.css` now carries these confirmed values. The glyph **artwork** is still a recorded asset
gap — the package `@takecasper/acuity-design-system` is **not vendored**, so the actual SVG paths
are unavailable; the tool renders a token-sized currentColor **monogram stand-in** at the real
sizes, never claimed as the real icon.

**Icon-tone contrast** (`scripts/contrast.mjs`, "Acuity icon tones", glyph on white, 3:1 UI):
success-green `#4DA81F` **3.03**, danger-red `#E40A0A` **4.83**, information-blue `#1E93BA`
**3.54**, **warning-yellow `#FCE833` 1.26 (FAIL)**. Semantic icons must not rely on hue alone, so
the tool pairs every icon with shape + an `altText`/adjacent label.

**API note (recorded):** the canonical name prop is `iconName`, not the DS's `name`, because
`name` selects the canonical piece in `<Canonical name="Icon">` (the same collision `Radio`'s
`group` avoids). Everything else (size names, `IconButton.label`) is kept faithfully.

**Anatomy result [D] — "axis a" with a shared asset gap.** Both systems ship a real icon
SYSTEM built differently; one canonical API + a two-step size token scale absorb both. The new
wrinkle is that the real glyph ARTWORK is unavailable here (un-vendored package) — the first
slice whose fidelity gap is the assets, not the API or skin. Recorded honestly; the API, size
scale, and colour rule are faithful. (Reconciliation map §4g.)

---

## Layout & grid — breakpoints / grid foundation [D]

Seventh slice (2026-06-23). Closes the **last** open foundation category (breakpoints / grid &
layout). No new component or prototype — token + documentation work, browser-verified across all
three systems (no regression; no visible consumer yet, by design).

**Sourcing result — Acuity authors NO layout foundation token** [D]
(`tailwind_acuity_theme.js`, fully read; `tailwind.config.js:13-17`): no `screens`, no
`container`, no `maxWidth`, no `gridTemplateColumns`, no grid `gap` key. The config spreads the
theme at the `theme` root with an empty `extend: {}`, so for each omitted key Tailwind's stock
default remains — but the compiled `tailwind_final.css` contains **no `@media` rules and no grid
utilities**, and a grep of all 87 React islands finds **zero** responsive prefixes
(`sm:`/`md:`/`lg:`/`xl:`). Layout is done entirely with **flexbox** (`ds-flex` ×91, plus
`ds-flex-row`/`-col`/`-items-*`/`-justify-*`/`-gap-*`) over the spacing gap scale
(0/4/8/12/16/24/48px) — there is no column grid and no responsive variant in the product at all.

| Category | Acuity reality | Tool token (`tokens.css`) |
|---|---|---|
| Breakpoints | no `screens` key; **zero** responsive prefixes compiled — single-breakpoint desktop | structural `:root` reference scale `sm 640 / md 768 / lg 1024 / xl 1280` — framework/tool defaults, never Acuity tokens |
| Container / max-width | no `container`/`maxWidth` key | structural `--ds-container-max 75rem` (≈1200px) — reference, no Acuity equivalent |
| Grid columns / gutter | no `gridTemplateColumns`; layout is flexbox + the spacing gap scale | structural `12 cols` / `--ds-grid-gutter 1rem` — the 1rem gutter coincides with the real spacing-4 (16px) step |

**Reference-only caveat:** CSS custom properties **cannot** be used in `@media` query conditions,
so the breakpoint tokens are reference values (for JS, container queries, or `clamp()`), not a
drop-in for `@media (min-width: var(--ds-bp-md))`. The grid-column / gutter / container tokens DO
drive `var()`-based `grid-template-columns` / `gap` / `max-width`.

**Anatomy note:** layout is the **least-divergent** foundation — neither system authored a
responsive breakpoint/container/grid scale, so it is **structural** (defined once in `:root`,
not re-skinned), the same situation as motion/z-index/opacity (§Foundation completion). These
tokens are documentary now; the future Containers & layout component slice (stack/grid/divider/
panel) reads them, like the `radius`/`shadow` `-sm`/`-lg` steps. No fabrication: where Acuity
defines nothing, the gap is recorded, the reference scale flagged as a tool default.
(Reconciliation map §4h.)

---

## Carry-forward verdict

Carry the **token set verbatim, collapse the 4× duplication to one source**. Add
the two missing token categories (radius, shadow) deliberately rather than leaving
them per-component. Fix the contrast failures at the token level (see
reconciliation map §contrast-fix). Adopt `@takecasper/acuity-design-system` as THE
component library and extend it to the server surface.
