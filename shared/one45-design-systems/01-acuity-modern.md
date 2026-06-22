---
title: One45 Design System — Acuity (modern)
tags: design-system, one45, acuity, tokens, components, contrast, reverse-engineering
verified: true
---

# System B — Acuity (One45 modern)

The deliberate, modern design system. The one asset the internal analysis named worth
carrying forward verbatim (` §1.7`, ` thread 5`). Three
layers, kept separate: **Tokens** (documented intent), **Components** (inventory +
which stack renders each), **Rendered reality** (what actually paints, including
colours in no token file).

**Evidence labels:** **[D]** deterministic (scripted/grep, count of record) ·
**[R]** runtime-confirmed on staging 2026-06-19 · **[I]** code-derived inference.
Counts trace to the audit's `internal analysis` / `internal analysis` (re-run this
session, reproduce to the digit) and `path:line`.

Live in the prototyping tool as system id **`acuity`**
(`spike/src/systems.tsx`, `spike/src/styles/tokens.css`). Portable token export:
[`tokens/acuity.json`](tokens/acuity.json).

---

## Layer 1 — Tokens (documented intent) [D]

**Source of truth (and the problem): the same set exists in FOUR hand-synced
copies, no shared origin** (`internal analysis`; ` §1.4`):

| Representation | File | Count | Form |
|---|---|--:|---|
| Tailwind JS theme | `symfony/tailwind_acuity_theme.js:30-106` | 55 hex | build-time JS object |
| CSS custom props | `symfony/web/vendor/webeval_ss/acuity_branding.css` | 55 `--ds-*` | runtime `:root` vars |
| Tailwind compiled | `symfony/tailwind_final.css:325-466` | subset emitted | `ds-bg-acuity-*` utilities |
| SCSS vars | `_colors.scss:37-95` | 49 Acuity (+38 legacy) | build-time `$acuity-*` |

Tailwind-JS and CSS-var counts match exactly (55 = 55, verified `internal analysis`
this session). This is the **4× duplication** — see the reconciliation map.

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
theme file — the set covers colour / type / spacing / weight only. The spike uses
spike-default radius/shadow for `acuity` and flags them as non-tokens
(`tokens.css` comments). Any "Acuity radius/shadow" is a per-component CSS
decision, not a governed token. Runtime token adoption app-wide is **~nil outside
the Tailwind layer** — Semantic UI ships 0 custom props, source SCSS/CSS 0; only
`tailwind_final.css` uses CSS custom props meaningfully (53, mostly `--tw-*`
plumbing) (`internal analysis`; ` §1.2`).

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
| `@takecasper/acuity-design-system` | external npm DS, the real Acuity components | 21 distinct / **257 uses** | `package.json:53` `^1.27.0`; react-scanner via `internal analysis`; ` §2.1` |
| react-bootstrap | competing stack, same React layer | 14 / 66 | ` §2.2` |
| semantic-ui-react | competing stack | 1 / 16 | ` §2.2` |
| PageBundle/common fork | local React fork (StatefulButton/ConfirmModal/SortableTable…) | 5 / ~21 | ` §local` |

Acuity DS components by use [D] (`internal analysis` rollup): Heading 63 ·
Button 57 · Card 30 · TextInput 15 · Alert 14 · Icon 10 · Dropdown/Link/Badge/
ProgressBar 8 · Tab 7 · Textarea 7 · Modal 5 · IconButton/Spinner 4 · Tabs 3 ·
Checkbox 2 · LabelAtom/TextInputAtom/Radio/FormValidation 1 each.

**Adoption is shallow** [D]: 257 DS calls vs 1,130 raw HTML intrinsics in the same
JSX, and `ds-` Tailwind utilities appear only **402** times app-wide against
**3,165** hardcoded px + **222** unique raw hex in Symfony source
(`internal analysis`, this session). Coverage of the token-governed UI is **~10–20%**
(` §1.7`). No Storybook, no path aliases — cross-bundle reuse via
`../../../../../../` chains (` §2.6, §local`).

**In the prototyping tool:** `acuity` skins Button, Card, Badge, **Alert**, Image,
Icon (`spike/src/systems.tsx`). Alert is modelled as a first-class Acuity piece
(DS Alert, 14 uses) — and is the **sourced divergence** against legacy, which has
no Alert (Layer 2 of `02-one45-legacy.md`).

---

## Layer 3 — Rendered reality [R]

Modern Symfony surfaces (Reports Center, report param form, report table base)
scan **markedly cleaner** than the legacy layer — the Acuity-skinned pages are the
better-behaved half (` §divergence`). But the deliberate palette still
ships contrast debt, and the rendered app paints colours that exist in **no token
file**:

- **Colours in no token file** [R] (` §runtime`): config nav `#e46b6b`,
  My eDossier `#2196f3` on sidebar `#27304b`, and the rotation-grid colour-coding —
  none of these are Acuity tokens. The token set governs a minority of the painted
  surface.
- **Contrast, computed** (deterministic, `scripts/contrast.mjs`; matches
  ` §3.3`). Thresholds: text 4.5 · UI/large 3 · AAA 7.

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
checklist is tracked in `internal notes Inputs are
now live canonical pieces in the spike (`TextField, Textarea, Select, Checkbox,
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
2. The DS input focus ring is **`:focus-visible`-gated (keyboard only)**; the spike
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
reconciliation map §5). This is a positive answer to the plan's anatomy question
for inputs, recorded as data, not assumed.

---

## Navigation — enshrined slice [D][R]

Second component group enshrined (2026-06-22). New canonical pieces in the spike:
**`Tabs`, `Link`** (all three systems) + **`Breadcrumb`** (legacy-only — see below).
**No `Pagination`** is enshrined: neither DS defines one, so fabricating it would
misrepresent both systems. Browser-verified across acuity / one45-legacy / lowfi.

**Layer 1 — the real DS nav API** [D] (recovered from React-island usage):

- **Tabs** is index-based: `activeTabIndex` (number) + `handleTabChange(index)` +
  `isNested` (bool); child **`Tab`** carries `title`, `id`, `badgeText`
  (`designSystemTest/main.jsx:935-994`). The canonical spike piece exposes one
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
2. Acuity has **no breadcrumb component** at all. In the spike, `Breadcrumb` is absent
   from acuity's skins so it resolves through the **bridge** to a flagged, token-driven
   AI build (the mirror of legacy lacking `Alert`). `Pagination` is enshrined in neither
   system (it exists in neither's real DS), so it is not added at all — not fabricated as
   a spike build.

**Computed contrast** (`scripts/contrast.mjs`, "Acuity navigation" section): active-tab
indicator `#00A59B` **3.06** (UI PASS), tab strip `#949494` **3.03** (UI PASS), link
`#364699` **8.42** (PASS), link-active `#161E4A` **15.92** (AAA).

**Anatomy result — the first crack:** the canonical **API** survives (Acuity's index-tabs
and legacy's key-tabs both absorb into one id-based `Tabs` contract), but the **pure
token-swap skin does NOT**. Acuity tabs are an **underline-indicator** model (acuity-green
underline); legacy tabs are **Bootstrap box folder tabs** — a genuinely different visual
structure. The spike renders each faithfully via a per-system skin
(`:root[data-ds="one45-legacy"] .sk-tab` in `app.css`), rather than flattening legacy into
the underline model. This is the first piece where "one component, tokens only" stops being
enough; it is recorded as data, not forced. On top of that the **inventory diverges both
ways** (Acuity has a real `Tabs` DS component; legacy has `Breadcrumb`; neither has
`Pagination`) — the bridge's job (see reconciliation map §4c, §5).

---

## Carry-forward verdict

Carry the **token set verbatim, collapse the 4× duplication to one source**
(` carry-forward 5`). Add the two missing token categories (radius,
shadow) deliberately rather than leaving them per-component. Fix the contrast
failures at the token level (see reconciliation map §contrast-fix). Adopt
`@takecasper/acuity-design-system` as THE component library and extend it to the
server surface (` carries-forward 1`).
