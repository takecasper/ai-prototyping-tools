---
title: One45 Design System — one45 (legacy)
tags: design-system, one45, legacy, tokens, components, contrast, reverse-engineering
verified: true
---

# System A — one45 (legacy)

The older "one45" brand, still LIVE today on auth / password / self-send /
React-shell pages. Not deprecated in the running product — a user crossing flows
sees both this and Acuity. Three layers, kept separate, same evidence labels as
`01-acuity-modern.md` (**[D]**/**[R]**/**[I]**).

Live in the prototyping tool as system id **`one45-legacy`**
(`src/systems.tsx`, `src/styles/tokens.css`). Portable token export:
[`tokens/one45-legacy.json`](tokens/one45-legacy.json).

---

## Layer 1 — Tokens (documented intent) [D]

**Source:** `symfony/src/One45/PageBundle/Resources/public/css/src/includes/_colors.scss:1-35`
(palette) fed into `new_branding.scss` (type/brand). This is a **flat named-colour
brand**, not a structured shade system: brand colours each with dark/light/pale
variants, plus an 8-step grey ramp. **No type scale, no spacing, no radius, no
shadow tokens** — type is per-rule CSS in `new_branding.scss`, not tokens.

**Colour** [D] (`_colors.scss:1-35`):

| Group | Values |
|---|---|
| brand chrome | `$one45_black #27304B` · `$one45_grey #F2F3F8` · `$menu_header #EEE5E9` |
| primary_red | dark `#C0254E` · **`#F12F62`** · light `#F9ABC0` · pale `#FDF3F6` |
| primary_yellow | dark `#C0681C` · **`#F8B223`** · light `#FCE0A7` · pale `#FFF9ED` |
| primary_teal | dark `#2FAEA1` · **`#3BDACA`** · light `#B0F0E9` · pale `#E9FDFF` |
| primary_purple | dark `#344064` · **`#42507D`** · light `#B3B9CB` · pale `#F2F3F8` |
| grey ramp | dark_3 `#535356` · dark_2 `#7D7D82` · dark_1 `#A6A6AD` · `#D1D1D9` · light_1 `#DADAE0` · light_2 `#E3E3E8` · light_3 `#ECECEF` |
| link | `$link_color #0a6cbd` · hover `#064e89` |

Full values in [`tokens/one45-legacy.json`](tokens/one45-legacy.json).

**Type** [D] (`new_branding.scss:1-...`): family **Cabin** (Google-Fonts remote
`@import`, `new_branding.scss:1` — a different family and a remote-font dependency
distinct from Acuity's Lato); base 16px; body **letter-spacing 0.4px**; `h1`
`text-transform: capitalize`; link/`.ltsk` colour `$primary_purple`.

**Drift note** [D]: `_colors.scss` carries this legacy palette **plus** a verbatim
copy of the 49 Acuity colours (`:37-95`), so two unrelated colour systems live in
one include and both feed `new_branding.scss`. The legacy half has **no Acuity
equivalent**.

---

## Layer 2 — Components (inventory + which stack renders each) [D][I]

**There is no "one45-legacy component library."** Legacy is a **CSS/brand skin**
applied — via `design_system_style = 'one45' | 'none'`
(`React/react_page_base.html.twig:14,105-129`) — over the SAME shared component
stacks Acuity uses, plus the deep-legacy webeval engine:

- **Server UI (Twig):** no component library at all — template inheritance + ad-hoc
  `{% include %}` partials, 15% line duplication. The de-facto alert primitive is
  the WidgetBundle `Error/*` Twig partial family (error 47× · warning 46× · info
  28× · success 8× · alert 6× = **135 includes**). **This is why legacy has no React
  Alert component** — it used these server partials.
- **Legacy webeval:** a bespoke **175-tag** template engine
  (`webeval/documentation/tag_tutorials/`) — the
  legacy UI vocabulary (48 `form_row_with_*`, 38 `cv_*`, 34 `ul_*`, ~55 primitives),
  itself full of forked-variant duplication (`chunk_table`+`chunkTable`,
  `datepicker`+`datepicker2`). OUT for rebuild; the tag list is a coverage
  checklist, not code to port.
- **React-shell pages** render the `one45` brand over the same React islands Acuity
  uses (the toggle only swaps the stylesheet).

**Implication for the bridge (the anatomy question):** between `acuity` and
`one45-legacy`, most pieces are the **same component re-skinned by tokens** — so a
single canonical API + token swap is the right model **at the brand level**, and
the prototyping tool proves it (toggle re-skins Button/Card/Badge/Image/Icon with
zero prototype edits). The genuine divergences are where a piece exists as a real
component in one system and a *different mechanism* in the other — e.g. **Alert**
(Acuity DS component, 14 uses) vs legacy's Twig `Error/*` partials. The tool
models that: `one45-legacy` ships **no Alert skin**, so a screen using Alert
(Casper Score Report → Summary) bridges it (flagged "AI approx") when toggled to
legacy — runtime-verified 2026-06-22. This is the concrete case where "components
may not map 1:1" and the bridge must evolve (the crude Button-as-Alert interim is
the motivation to teach the bridge a real per-system Alert).

---

## Layer 3 — Rendered reality [R]

Legacy surfaces are the **worse-behaved half** at runtime: the legacy webeval
frame sets **no `lang`** (Symfony base templates
do), the Rotation Schedule grid alone fires **1,239 contrast failures**, and the
legacy form layer is ~18% label-to-input. That a11y debt rides with the legacy
brand and retires when legacy screens do.

**Contrast, computed** (`scripts/contrast.mjs`). Text 4.5 · UI/large 3 · AAA 7:

| Token pair | ratio | verdict |
|---|--:|---|
| `$primary_purple #42507D` on white / white on it | 7.85 | PASS (AAA) |
| `$one45_black #27304B` on white (body text) | 13.04 | PASS (AAA) |
| white on `$one45_black` (header) | 13.04 | PASS (AAA) |
| `$grey_dark_3 #535356` on white | 7.67 | PASS (AAA) |
| `$link_color #0a6cbd` on white | 5.39 | PASS |
| **`$grey_dark_2 #7D7D82` on white** | 4.10 | **FAIL text** · ok UI/large |
| **`$primary_red #F12F62` on white** | 3.95 | **FAIL text** · ok UI/large |
| **`$grey_dark_1 #A6A6AD` on white** | 2.42 | **FAIL all** (a "dark" grey that isn't) |
| **`$primary_yellow #F8B223` on white** | 1.84 | **FAIL all** |
| **`$primary_teal #3BDACA` on white** | 1.74 | **FAIL all** |

The brand's teal/yellow/red fail badly as foregrounds; only purple, black, link
and the darkest greys are safe text colours. The prototyping-tool `one45-legacy`
skin therefore uses `$one45_black #27304B` for body text and `$primary_purple` for
the accent (both AAA), and treats teal/yellow/red as decoration only.

---

## Inputs & controls — enshrined slice [D]

Sourced from the legacy CSS skin (`PageBundle/.../css/src/`), since legacy has **no
React form-control library** — it is Bootstrap/Twig markup re-skinned by SCSS. Now
live in the tool as the same canonical pieces, re-skinned to the legacy look.

**The legacy form layer is two-speed** [D] — a headline finding of this slice:

| Control | Real source values | Cite |
|---|---|---|
| text input / select / textarea | bg `#FEFEFE`, **border 1px `#DDD`**, text `#333`; **no radius, no padding, no `:focus` rule** declared (Bootstrap default falls through) | `_forms.scss:114-127`, `_constants.scss:24-28` |
| select | height **32px**, width 300px | `_bootstrap.scss:14-18` |
| checkbox / radio | **no element styling at all** — browser default; only the *label* colour is set (`#555` neutrals-dark) | `_forms.scss:42-45` |
| label.required | bold + left-padding; `.selected` → `#364699` | `_forms.scss:26-46` |
| error label | `#B94A48` | `_forms.scss:193-199` |
| **`.btn` / `.btn-primary`** | **re-skinned to the Acuity DS**: `.btn-primary` bg `#364699`, hover `#253170`, active `#161E4A`; radius 3px, pad 12×16, weight 600 | `new_branding.scss:206-318`, `_actions.scss:233-330` |
| datepicker | `$primary_purple #42507D` trigger + selected-day | `_forms.scss:47-110` |

**The key intent-vs-reality delta:** legacy **buttons converged to Acuity-blue
`#364699`** in production while legacy **text inputs stayed the old grey one45 look**
(`#DDD` border, no radius). So at the *button* level legacy ≈ Acuity already; the real,
enshrine-able divergence is the **input chrome** (grey/no-radius/no-focus vs Acuity's
`#949494`/radius-4/state-coloured). The tool keeps `$primary_purple` as the legacy
brand token (still live on the datepicker + the Acuity shell search) so the toggle stays
legible, and records the button convergence here and in the gap map.

**Untokened/flagged** [D]: legacy declares **no** radius, padding, focus, or success-state
token for inputs — the tool values for those are flagged tool defaults, not legacy
tokens (`tokens.css` comments). The input border `#DDD` computes **1.36:1** on white
(`scripts/contrast.mjs`) — it **fails the 3:1 UI threshold** (1.4.11); recorded, not fixed
(legacy is a migration source).

**Anatomy result:** the inputs re-skin cleanly through one canonical API + tokens — no
structural divergence in this group between legacy and Acuity (the divergence is colour
only). Confirms the single-canonical-API model for inputs; see `01-acuity-modern.md` and
reconciliation map §5.

---

## Navigation — enshrined slice [D]

Sourced from the legacy CSS skin. New canonical pieces re-skinned to the legacy look:
**`Tabs`, `Link`** (shared API) + **`Breadcrumb`** (native here — a piece the Acuity DS
never built). **No `Pagination`** (legacy defines none). Browser-verified 2026-06-22.

| Element | Real source values | Cite |
|---|---|---|
| Tabs (`.nav-tabs`) | **Bootstrap BOX folder tabs** (not an underline): active tab gets a box border `#AAAAAA` top+sides, bottom merges with the strip; React-page override recolours only — label `$primary_purple #42507D`, active `.show` `$one45_black #27304B` | `themes/one45.scss:759-775`, `styles_overwrite.scss:32-40` |
| Tabs strip | border-bottom `#AAAAAA`; older Bootstrap active link was `#0088CC` | `themes/one45.scss:759-775` |
| Link | React-page `a` `$link_color #0a6cbd`, hover `$link_hover_color #064e89`; body link `#888`; `.ltsk` `$primary_purple` bold | `_colors.scss:34-35`, `styles_overwrite.scss:57-63`, `new_branding.scss:27-37` |
| **Breadcrumb** | bespoke chevron `.breadcrumb-widget` on the dark page-header: link `#364699`, current `#F5F5F5`, CSS-triangle segments `#B0B1D7`/`#666`/`#cccccc` | `themes/one45.scss:317-421` |
| Sidebar / navbar | `.ui.left.sidebar` 240px bg `#27304B`; `section.page-header` 40px bg acuity-blue-dark | `admin_interface.scss:505-529`, `themes/one45.scss:249-262` |

**Recorded gaps** [D]: legacy defines **no pagination skin** (only a margin reset,
`themes/one45.scss:553-559`; no `.pager` anywhere) and **no stepper/wizard CSS** — steps
render purely through webeval tags (`steps`, `stepsHeader`, `config_step`) with no skin.
Since pagination exists in NEITHER system, the tool does **not** enshrine it (no fabricated
component); stepper is deferred until a real instance is sourced.

**The headline divergence this group adds:** `Breadcrumb` is a **legacy-only** piece — the
legacy app has a real (chevron) breadcrumb the Acuity DS never built, the exact mirror of
`Alert` being acuity-only. So the tool makes `Breadcrumb` native to legacy + lowfi and
**absent from acuity**, where the bridge builds it (flagged AI). The tool flattens the
chevron geometry to a `/`-separated trail (simplification flagged in `tokens.css`).

**Computed contrast** (`scripts/contrast.mjs`, "one45 legacy navigation"): tab label
`#42507D` **7.85** (AAA), active `#27304B` **13.04** (AAA), link `#0a6cbd` **5.39** (PASS),
crumb link `#42507D` **7.85** (AAA). The tab strip rule **`#AAAAAA` computes 2.32:1 — fails
the 3:1 UI threshold** (1.4.11); recorded, not fixed (legacy is a migration source), same
class of failure as the `#DDD` input border.

**Anatomy result — the first crack:** the canonical `Tabs`/`Link` **API** holds (legacy's
key-based tabs absorb into the same id-based contract as Acuity's index-tabs), but legacy
tabs are a **structurally different visual model** — Bootstrap box folder tabs vs Acuity's
underline indicator. That does **not** token-swap, so the tool renders each system's real
tab model via a per-system skin (`app.css`), not a flattened shared one. On top of that the
**inventory** diverges (`Breadcrumb` here, `Alert` there, neither with a real `Pagination`).
Both are the bridge's / per-system skin's work — see reconciliation §4c/§5.

---

## Feedback & status — enshrined slice (Modal) [D][R]

Third component group, first piece (2026-06-22). New canonical piece re-skinned to the
legacy look: **`Modal`** (native here — legacy genuinely has one). Browser-verified
2026-06-22.

| Element | Real source values | Cite |
|---|---|---|
| Modal panel (`.modal`) | bg `#FFFFFF`, border-radius **6px**, box-shadow **`0 3px 7px rgba(0,0,0,.3)`** | `_bootstrap.scss:103` |
| **Modal header band** (`.modal-header`) | **grey band** bg `#F5F5F5`, bottom rule `#EEE`, radius `3px 3px 0 0` | `_bootstrap.scss` |
| Modal body (`.modal-body`) | bg `#FFFFFF`, padding 14px | `_bootstrap.scss` |
| Title | `$one45_black #27304B`, Cabin | `_colors.scss:1`, `new_branding.scss` |
| react-bootstrap usage | `Modal show/onHide/size/backdrop="static"/centered` + `Modal.Header/Title/Body/Footer` | `mappingModal.jsx:162`, `confirmationPopup.jsx:39` |

Scrim: the SCSS declares the backdrop via `opacity`, not a colour, so the tool uses a
solid `rgba(0,0,0,.5)` (Bootstrap-2 default) per the no-opacity rule — flagged [I].

**[R] confirmation** (2026-06-22, `getComputedStyle` on the tool's legacy modal): panel
radius 6px, shadow `0 3px 7px rgba(0,0,0,.3)`, header band `#F5F5F5` + `#EEE` rule, title
`#27304B` Cabin 20px, scrim `rgba(0,0,0,.5)` — matches the sourced tokens to the value.

**Computed contrast** (`scripts/contrast.mjs`, "one45 legacy Modal"): modal title `#27304B`
on the band `#F5F5F5` **11.96** (AAA); on white **13.04** (AAA).

**Anatomy result — the API-survival test PASSED.** The legacy Bootstrap/react-bootstrap
modal and the Acuity headlessui Dialog absorb into **one canonical Modal API**. The one
visual difference — legacy's grey header band vs Acuity's headerless title — is a **pure
token swap** (`--ds-modal-header-bg`/`-border`), so unlike Tabs **no per-system structural
override is needed**. Modal is the cleanest both-systems result so far.

**Headline finding for the next slice — Alert is NOT acuity-only.** Sourcing the feedback
group found legacy ships a **real** alert: the WidgetBundle `Error/*` Twig partials (154
includes: error/warning/info/success/sorry/errors) skinned by `.one45-alert`
(`new_branding.scss:66-170`) with sourced fills — success `#B0F0E9`, warning `#FCE0A7`,
error `#FFC8D7`, info `#42507D` (all over `#27304B` except info over `#FFF`), radius 0,
padding 16px. The tool currently models Alert as acuity-only with a bridge fill, which the
in-browser check shows flagged "Claude interim → Button" in legacy — now known to be
inaccurate. Recommend reworking Alert to **native-both** next slice (reconciliation §4d).

**Recorded gaps** [D]: legacy has **no status badge** (`.badge-details` is a profile-photo
widget), **no tag/chip, no empty-state, no toast** (only a Semantic-UI vendor override in
admin), and the spinner is the webeval `busy` **cog GIF** (an image, no CSS). `.progress`
carries only a `line-height`. Tag/chip + empty-state + toast are gaps in **both** systems →
not enshrined.

---

## Carry-forward verdict

The legacy brand is a **migration source, not a target** — it is being replaced by
Acuity (mid-flight). Preserve it in the prototyping tool as a real toggle target so
a screen can be shown old-vs-new (the convergence signal), and so the
One45-legacy ↔ One45-new comparison has a faithful "legacy" pole. Do **not** carry
its tokens forward into the unified system. The 175-tag webeval list is the
functional coverage checklist the new system must cover.
