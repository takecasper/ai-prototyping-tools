---
title: One45 Design Systems — Documented (for the prototyping tool)
tags: design-system, one45, acuity, legacy, tokens, handoff, index
verified: true
---

# One45 design systems — documented

Two of One45's real, currently-live design systems, reverse-engineered from the
staging repo so the [prototyping tool](../../) can toggle between them and
surface their divergence. This folder extracts the two systems from internal
analysis and turns them into usable, documented design systems plus a
reconciliation map.

**Audience:** Claude agents and the Acuity team. Dense and citable. **Evidence
labels:** **[D]** deterministic · **[R]** runtime-confirmed (staging, 2026-06-19) ·
**[I]** code-derived inference. Counts trace to internal analysis (re-run this
session, reproduce to the digit) and `path:line` source citations.

---

## The two systems

| System | id | Brand | Where it's live | Report | Tokens |
|---|---|---|---|---|---|
| **Acuity** (modern) | `acuity` | Lato, acuity-blue, 8 colour families | main interface pages (default brand) | [01-acuity-modern.md](01-acuity-modern.md) | [tokens/acuity.json](tokens/acuity.json) |
| **one45** (legacy) | `one45-legacy` | Cabin, primary-purple | auth / password / self-send / React-shell pages | [02-one45-legacy.md](02-one45-legacy.md) | [tokens/one45-legacy.json](tokens/one45-legacy.json) |

Selected in the product by the page-template toggle
`design_system_style = 'acuity' | 'one45' | 'none'`
(`React/react_page_base.html.twig:14`) — a **migration toggle** (old one45 brand →
new Acuity brand), not a tenant skin. The split is by **page-type**, so a user
crossing flows sees both.

Each report keeps **three layers separate**:
1. **Tokens** — the documented intent (colour/type/spacing/radius/shadow).
2. **Components** — inventory + which stack renders each (acuity-DS npm vs
   react-bootstrap vs semantic-ui-react vs PageBundle/common fork vs server
   Semantic UI / Bootstrap 2 / jQuery-UI vs the webeval 175-tag engine).
3. **Rendered reality** — what actually paints, including colours in no token file.

---

## The gap map

[**03-reconciliation-gap-map.md**](03-reconciliation-gap-map.md) — keep / dedupe /
untokened / contrast-fix, plus the **4× token duplication** and a convergence read.
Headline facts it carries (all [D] unless marked):

- Acuity tokens exist in **4 hand-synced copies** (JS theme / CSS vars / compiled /
  SCSS), no single source; `_colors.scss` also holds the whole legacy palette.
- **222 unique raw hex** in Symfony source, **727** in webeval, **1,367** webeval
  `!important` — the rendered surface is mostly untokened. Token coverage ~10–20%.
- The deliberate Acuity palette has **real contrast failures** (green 3.06,
  warning-yellow 1.26, neutrals 3.36) — computed, not asserted.
- Rendered colours in **no token file** [R]: `#e46b6b`, `#2196f3`, `#27304b`.

---

## In the prototyping tool

These are **live, usable skinned systems** in the tool, not just docs:

- `src/systems.tsx` — `acuity`, `one45-legacy`, `lowfi` as real skins.
- `src/styles/tokens.css` — the rendered token blocks (single source of
  truth; the reports cite it). Real values, with faithful choices and known
  weaknesses commented inline.
- **Real, sourced divergence:** Acuity ships `Alert` (DS component, 14 uses);
  legacy one45 has no Alert (it used Twig `Error/*` partials). So `one45-legacy`
  has no Alert skin, and a screen using Alert (Casper Score Report → Summary)
  **bridges** it when toggled to legacy — verified in-browser 2026-06-22. This is
  the anatomy-divergence question, exercised on two real systems; the
  crude Button-as-Alert interim is the concrete motivation for the bridge to evolve
  a per-system Alert. **Updated:** the bridge has since evolved (`INTERIM_BUILDS`,
  Navigation slice) so Alert now resolves to a flagged token-driven Alert build in
  legacy, not Button. And the Feedback slice (§4d) corrected the premise itself —
  legacy DOES ship a real alert (`.one45-alert` + `Error/*` Twig), so Alert is owed a
  native-both rework rather than a bridge fill.

**Inputs & controls slice (enshrined 2026-06-22):** the first slice of the full
component surface is live — `TextField, Textarea, Select, Checkbox, Radio, Toggle,
SearchField` + `Button` variants (primary/secondary/danger/inline), token-driven,
present in all three systems, lint-gate-clean, browser-verified across acuity /
one45-legacy / lowfi, with a real `learner-enrolment` form+validation prototype.
Sourced from the real DS API (React-island usage) + the live DS gallery
(`/test/designSystem`) and the legacy skin; deltas recorded (legacy buttons converged
to acuity-blue while inputs stayed grey; the DS input border is the accessible
`#949494`; purple persists in the Acuity shell search). Result: **the
single-canonical-API + token-swap model survives the whole inputs group** — no bridge
needed for any input. See each report's "Inputs & controls — enshrined slice" and gap
map §4b. The remaining component groups + patterns are tracked in internal analysis.

**Navigation slice (2026-06-22):** `Tabs`, `Link` (all systems) + `Breadcrumb`
(legacy-only → bridge fills acuity). First place pure token-swap broke — Acuity underline
tabs vs legacy Bootstrap box tabs share the API but render a per-system visual model. The
bridge **evolved** here (`INTERIM_BUILDS`): a missing divergent piece now resolves to a
flagged token-driven build of *that* piece, not an unrelated component. `program-explorer`
prototype; gap map §4c.

**Feedback & status slice (2026-06-22):** `Modal` enshrined (native in all three systems),
the structural API-survival test — **it passed, and so did pure token-swap**: one canonical
API absorbs the Acuity headlessui Dialog and the legacy Bootstrap modal, and the only visual
difference (legacy grey header band vs Acuity headerless title) is two tokens, no structural
override. `learner-withdrawal` prototype (confirm-modal over a roster). Toast / tag-chip /
empty-state are gaps in **both** systems (not enshrined). Gap map §4d.

**Alert + Badge correction (2026-06-23):** sourcing found **Alert is NOT acuity-only** —
legacy ships a real alert (`.one45-alert` + 154 `Error/*` Twig uses), now enshrined
**native-both** (variant info/success/warning/error; Acuity tinted-family banners, legacy
solid pale fills — "different mechanism, same surface": one API + per-system skin). And
**Badge is acuity-only** — legacy has no status badge, so it now resolves through the bridge
in legacy + lowfi (the genuine present-vs-absent piece, mirror of acuity lacking Breadcrumb).
Gap map §4e.

**Iconography slice (2026-06-23):** the last open foundation category. `Icon` reworked from a
placeholder to the real DS API + a new `IconButton` — both native in all three systems, with the
real `iconName` vocabulary, a small/medium size scale, and an optional semantic `tone`. Sourced
from the Acuity DS islands (a custom named icon set) and the legacy FontAwesome Pro 5.15.3 / sprite
skin. The real glyph **artwork** is unavailable in both systems (un-vendored DS package; paid
webfont + binary sprites) — a recorded **asset gap**, so the tool renders a token-sized stand-in,
never the real icon. See "Gaps and legitimate omissions" below and gap map §4g.

**Honest scope:** between `acuity` and `one45-legacy`, most pieces are the **same
component re-skinned by tokens**, not structurally different — so a single
canonical API + token swap is the right model at the brand level (and the tool
proves it). The genuine anatomy divergences are narrower and named in the gap map
§5. The broader 7-system reality is structurally divergent, but six of seven die in
the rebuild, so the convergence target is Acuity.

---

## Reproduce

- **Contrast** (computed, not hand-written): `node shared/one45-design-systems/scripts/contrast.mjs`
- **Source token files:** `symfony/tailwind_acuity_theme.js` (Acuity) and
  `symfony/src/One45/PageBundle/Resources/public/css/src/includes/_colors.scss:1-35`
  (legacy).

## Files

```
shared/one45-design-systems/
  README.md                      this index
  01-acuity-modern.md            System B — 3 layers + computed contrast
  02-one45-legacy.md             System A — 3 layers + computed contrast
  03-reconciliation-gap-map.md   keep / dedupe / untokened / contrast-fix + 4× dup
  tokens/acuity.json             portable Acuity token set (documented intent)
  tokens/one45-legacy.json       portable legacy token set (documented intent)
  scripts/contrast.mjs           deterministic WCAG contrast (ratios of record)
```

---

## Gaps and legitimate omissions

Some things are deliberately *not* in the tool. Each is a recorded gap, not an oversight —
the governing rule is **never fabricate a component, token, or asset to tidy the story**
(no fabrication; the Pagination rule). The honest omissions:

- **Icon glyph artwork.** The tool enshrines the real iconography *API*, size scale, and
  colour rule, but **not** the actual glyphs. The sizes are confirmed (Acuity SVG icons render
  small 16px / medium 24px, IconButton 38×38px — `/test/designSystem` [R]), but neither system's
  glyph artwork is available to ship: the Acuity DS package (`@takecasper/acuity-design-system`)
  is not vendored, so its SVG paths are unrecoverable; legacy draws on **FontAwesome Pro 5.15.3**
  (a paid webfont) plus binary PNG sprites, neither of which the tool commits. So `Icon`/`IconButton`
  render a token-sized **stand-in** (a brand monogram / a lowfi sketch box) at the real sourced
  sizes, with the real `iconName` vocabulary and semantic `tone` — clearly a placeholder, never
  passed off as the system's real icon. (Reports §Iconography; gap map §4g.)
- **Pagination, stepper/wizard.** Exist in *neither* One45 system as a styled component, so
  the tool does not build them — fabricating one would misrepresent both systems.
- **Toast/snackbar, tag/chip, empty-state.** Gaps in both systems → not enshrined.
- **Spinner, ProgressBar, Tooltip, Popover.** One-sided or non-DS (react-bootstrap); deferred
  to a later bridge-interim slice, not faked now.
- **`[R]`-pending values (the discipline).** Where a value needs a signed-in staging read to
  confirm, it is flagged as a tool default in `src/styles/tokens.css` and recorded as pending,
  never silently invented. (None currently open — the Acuity icon `small`/`medium` px and the
  IconButton box were confirmed 2026-06-23.)
