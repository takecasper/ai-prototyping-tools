---
title: One45 Design System — one45 (legacy)
tags: design-system, one45, legacy, tokens, components, contrast, reverse-engineering
verified: true
---

# System A — one45 (legacy)

The older "one45" brand, still LIVE today on auth / password / self-send /
React-shell pages. Not deprecated in the running product — a user crossing flows
sees both this and one45 (2020s). Three layers, kept separate, same evidence labels as
`01-one45-2020s.md` (**[D]**/**[R]**/**[I]**).

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
distinct from one45 (2020s)'s Lato); base 16px; body **letter-spacing 0.4px**; `h1`
`text-transform: capitalize`; link/`.ltsk` colour `$primary_purple`.

**Drift note** [D]: `_colors.scss` carries this legacy palette **plus** a verbatim
copy of the 49 one45 (2020s) colours (`:37-95`), so two unrelated colour systems live in
one include and both feed `new_branding.scss`. The legacy half has **no one45 (2020s)
equivalent**.

---

## Layer 2 — Components (inventory + which stack renders each) [D][I]

**There is no "one45-legacy component library."** Legacy is a **CSS/brand skin**
applied — via `design_system_style = 'one45' | 'none'`
(`React/react_page_base.html.twig:14,105-129`) — over the SAME shared component
stacks one45 (2020s) uses, plus the deep-legacy webeval engine:

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
- **React-shell pages** render the `one45` brand over the same React islands one45 (2020s)
  uses (the toggle only swaps the stylesheet).

**Implication for the bridge (the anatomy question):** between `one45-2020s` and
`one45-legacy`, most pieces are the **same component re-skinned by tokens** — so a
single canonical API + token swap is the right model **at the brand level**, and
the prototyping tool proves it (toggle re-skins Button/Card/Badge/Image/Icon with
zero prototype edits). The genuine divergences are where a piece exists as a real
component in one system and a *different mechanism* in the other — e.g. **Alert**
(Acuity DS component, 14 uses) vs legacy's `Error/*` Twig partials skinned by
`.one45-alert` (154 uses). Both are real, so Alert is **native in both** systems:
the tool renders each system's own skin — one45 (2020s) a tinted banner, legacy a solid
pale fill — and the bridge fills only **lowfi**, not legacy. This is the "different
mechanism, same surface" case (axis a; see the Alert section below and reconciliation
§4d/§4e). The genuine *present-vs-absent* cases that the bridge actually fills are
**Breadcrumb** (legacy-only → bridged in one45-2020s) and **Badge** (one45-2020s-only →
bridged in legacy + lowfi).

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

**The key intent-vs-reality delta:** legacy **buttons converged to acuity-blue
`#364699`** in production while legacy **text inputs stayed the old grey one45 look**
(`#DDD` border, no radius). So at the *button* level legacy ≈ one45 (2020s) already; the real,
enshrine-able divergence is the **input chrome** (grey/no-radius/no-focus vs one45 (2020s)'s
`#949494`/radius-4/state-coloured). The tool keeps `$primary_purple` as the legacy
brand token (still live on the datepicker + the one45 (2020s) shell search) so the toggle stays
legible, and records the button convergence here and in the gap map.

**Untokened/flagged** [D]: legacy declares **no** radius, padding, focus, or success-state
token for inputs — the tool values for those are flagged tool defaults, not legacy
tokens (`tokens.css` comments). The input border `#DDD` computes **1.36:1** on white
(`scripts/contrast.mjs`) — it **fails the 3:1 UI threshold** (1.4.11); recorded, not fixed
(legacy is a migration source).

**Anatomy result:** the inputs re-skin cleanly through one canonical API + tokens — no
structural divergence in this group between legacy and one45 (2020s) (the divergence is colour
only). Confirms the single-canonical-API model for inputs; see `01-one45-2020s.md` and
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
`Alert` being one45-2020s-only. So the tool makes `Breadcrumb` native to legacy + lowfi and
**absent from one45-2020s**, where the bridge builds it (flagged AI). The tool flattens the
chevron geometry to a `/`-separated trail (simplification flagged in `tokens.css`).

**Computed contrast** (`scripts/contrast.mjs`, "one45 legacy navigation"): tab label
`#42507D` **7.85** (AAA), active `#27304B` **13.04** (AAA), link `#0a6cbd` **5.39** (PASS),
crumb link `#42507D` **7.85** (AAA). The tab strip rule **`#AAAAAA` computes 2.32:1 — fails
the 3:1 UI threshold** (1.4.11); recorded, not fixed (legacy is a migration source), same
class of failure as the `#DDD` input border.

**Anatomy result — the first crack:** the canonical `Tabs`/`Link` **API** holds (legacy's
key-based tabs absorb into the same id-based contract as one45 (2020s)'s index-tabs), but legacy
tabs are a **structurally different visual model** — Bootstrap box folder tabs vs one45 (2020s)'s
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
modal and the one45 (2020s) headlessui Dialog absorb into **one canonical Modal API**. The one
visual difference — legacy's grey header band vs one45 (2020s)'s headerless title — is a **pure
token swap** (`--ds-modal-header-bg`/`-border`), so unlike Tabs **no per-system structural
override is needed**. Modal is the cleanest both-systems result so far.

**Headline finding (reworked the next slice) — Alert is NOT one45-2020s-only.** Sourcing the
feedback group found legacy ships a **real** alert: the WidgetBundle `Error/*` Twig partials
(154 includes: error/warning/info/success/sorry/errors) skinned by `.one45-alert`
(`new_branding.scss:65-170`) with sourced fills — success `#B0F0E9`, warning `#FCE0A7`,
error `#FFC8D7`, info `#42507D` (all over `#27304B` except info over `#FFF`), radius 0,
padding 16px. The tool's earlier one45-2020s-only-with-bridge model was inaccurate; Alert is now
**native-both** (see the Alert section below and reconciliation §4d/§4e).

**Recorded gaps** [D]: legacy has **no status badge** (`.badge-details` is a profile-photo
widget), **no tag/chip, no empty-state, no toast** (only a Semantic-UI vendor override in
admin), and the spinner is the webeval `busy` **cog GIF** (an image, no CSS). `.progress`
carries only a `line-height`. Tag/chip + empty-state + toast are gaps in **both** systems →
not enshrined.

---

## Feedback & status — Alert enshrined (native here) [D]

Fourth slice (2026-06-23). `Alert` is now **native** in legacy — the earlier one45-2020s-only model
was wrong. Browser-verified across all three systems (annotations on/off); lint-gate-clean.

**Layer 1 — the real legacy alert** [D] (`new_branding.scss:65-170`, `.alert.one45-alert`,
over the WidgetBundle `Error/*` Twig partials, 154 includes): solid pale fills, **radius 0**,
**padding 16px**, `border: none`, body text `$one45_black #27304B` (white on the purple info
fill). Each variant carries a FontAwesome icon colour.

| Variant | bg | fg | icon | text contrast | source |
|---|---|---|---|---|---|
| success | `#B0F0E9` | `#27304B` | `#2FAEA1` | **10.24:1** (AAA) | `$primary_teal_light` / `$one45_black` / `$primary_teal_dark` |
| warning | `#FCE0A7` | `#27304B` | `#F8B223` | **10.16:1** (AAA) | `$primary_yellow_light` / `$one45_black` / `$primary_yellow` |
| error | `#FFC8D7` | `#27304B` | `#F12F62` | **9.00:1** (AAA) | pink (`new_branding.scss:132`, "works better as background") / `$one45_black` / `$primary_red` |
| info | `#42507D` | `#FFFFFF` | `#B3B9CB` | **7.85:1** (AAA) | `$primary_purple` (solid fill) / white / `$primary_purple_light` |

(`scripts/contrast.mjs`, "one45 legacy Alert" section.)

**Anatomy result — "different mechanism, same surface" (axis a).** Legacy's `.one45-alert`
(solid fill, radius 0) and one45 (2020s)'s tinted banner absorb into **one canonical API** (variant +
title + body), but the look does **not** token-swap — the structural difference is rendered
per-system in `app.css` (the Tabs rule), not flattened. The mirror of Tabs: API survives, skin
diverges. The earlier "Claude interim → Button" bridge fill in legacy is gone — legacy renders
its own real alert.

---

## Foundation completion — radii / elevation / motion / z-index / opacity [D]

Fifth slice (2026-06-23). Completes the token layer. No new component or prototype —
token + documentation work, browser-verified across all three systems.

**Sourcing result — legacy has real radii + shadows, but no scale for the rest** [D]
(Bootstrap-era SCSS under `PageBundle/.../css/src/`). The legacy stack is literal
per-component declarations, not foundation variables (`_constants.scss`/`_colors.scss`
define only colour/spacing/font).

| Category | Legacy reality | Cite |
|---|---|---|
| Radius | `.btn` **3px**; `.navbar-inner` 4px; `.modal` **6px** (header `3px 3px 0 0`); inputs/panels/alerts/badges declare none → Bootstrap default 4px (flagged) | `new_branding.scss:211`, `_bootstrap.scss:110,224,130` [D] |
| Elevation | `.modal` **`0 3px 7px rgba(0,0,0,.3)`**; `.navbar-inner` `0 1px 4px rgba(0,0,0,.065)`; `.page-header` `0 0 3px rgba(34,36,38,.15)`; dropdowns/popovers/panels → Bootstrap defaults (flagged) | `_bootstrap.scss:113,229`, `one45.scss:254` [D] |
| Motion | **essentially none** — the only declaration in the core SCSS is `.btn.stateful { transition: unset }` (a removal); `.fade`/`.modal.fade` render at Bootstrap defaults (`.15s linear` / `transform .3s ease-out`) | `new_branding.scss:227` [D] |
| z-index | **no organized stack** — ad-hoc `5/10/500/1000/9999` + a custom `#overlay` scrim at 9999; only real DS-layer override is `.popover 1000 !important`; the rest renders at Bootstrap defaults (1000/1040/1050/1070) | `_bootstrap.scss:153,37` [D] |
| Opacity | **no scale** — opacity used only for disabled (`.suspended` .5; disabled icons .3) and the `#overlay` scrim (solid `#cccccc` at **opacity .5**, a real opacity-based backdrop) | `_body.scss:92`, `_actions.scss:131`, `_overlay.scss:3-4` [D] |

In the tool, radius + elevation are sourced per-system (`--ds-radius-sm 3px` / `-lg 6px`,
`--ds-shadow-sm` navbar / `-lg` modal); **motion, z-index, and opacity have no legacy scale**,
so they fall through to the structural `:root` defaults (recorded gap). The legacy scrim's
opacity-based backdrop is rendered as a solid `rgba` per the no-opacity rule (already flagged
in the Modal slice).

**Two-speed confirmation:** like the Inputs slice (buttons converged to one45 (2020s), inputs did
not), foundations are two-speed — buttons carry a real 3px radius and the modal a real 6px,
but the system never grew a motion/elevation/z-index scale, leaning on Bootstrap defaults. The
gap is recorded, not invented.

---

## Iconography — enshrined slice [D]

Sixth slice (2026-06-23). Completes the last open foundation category. New canonical pieces:
**`Icon`** (real DS API) and **`IconButton`** — both native here. Browser-verified across all
three systems (annotations on/off); lint-gate-clean.

**Layer 1 — three overlapping icon mechanisms** [D] (legacy has no single icon system):

| Mechanism | What | Cite |
|---|---|---|
| **FontAwesome Pro 5.15.3** (primary webfont) | all four styles imported; the `fa-icon` mixin defaults `font-size: 0.9rem`; alert icons `1.5rem`; only scale class in use is `fa-2x`; report toolbars alias `icon-*-fa` → `@extend .fas` | `package.json:13`, `fontawesome.scss:2-47`, `new_branding.scss:86` |
| **famfamfam Silk** (older raster set) | 16×16px PNG sprites via `.icon-*` classes (colour baked into the PNG); custom one45 PNGs alongside | `themes/one45.css:289-307`; vendor `famfamfam/` |
| **Semantic UI** icon font | used by webeval-emitted markup (`<i class='angle right icon'>`) | `package.json:72`; outputter `<i>` usages |

`.icon-button` is a real **25×25px** control. **Glyphicons are not used** (one stray animation
class only). There is **no webeval icon tag** — webeval emits FA/Semantic `<i>` inline in PHP
outputters, not a first-class tag.

**Layer 2 — colour** [D]: explicit SCSS palette variables per context, not `currentColor`. The
alert icons are the clearest sourced set: success `$primary_teal_dark #2FAEA1`, warning
`$primary_yellow #F8B223`, error `$primary_red #F12F62`, info `$primary_purple_light #B3B9CB`
(`new_branding.scss:100,119,140,159`) — the tool's `tone` prop reuses these as the real legacy
semantic icon colours.

**Layer 3 — the asset gap** [D]: FontAwesome Pro is a **paid webfont** and the famfamfam set is
**binary PNGs** — neither is shipped by the tool (no-binary rule). So the legacy glyph **artwork**
is a recorded asset gap, the same kind as one45 (2020s)'s un-vendored package. The tool sizes its
stand-in at the real sourced sizes (`--ds-icon-size-sm 0.9rem` / `-md 1.5rem`, `--ds-iconbtn-size
25px`) but renders a token-driven sketch/monogram, never the real glyph.

**Icon-tone contrast** (`scripts/contrast.mjs`, "legacy icon tones", glyph on white, 3:1 UI):
red `#F12F62` **3.95**, **teal `#2FAEA1` 2.73 (FAIL)**, **yellow `#F8B223` 1.84 (FAIL)**,
**purple-light `#B3B9CB` 1.96 (FAIL)** — same finding as one45 (2020s): a small semantic glyph can't
carry meaning on hue alone, so the tool pairs shape + label.

**Anatomy result [D] — "axis a" with a shared asset gap.** Legacy's FontAwesome/sprite stack and
one45 (2020s)'s named-vocabulary component absorb into **one canonical API**, and a two-step size token
scale absorbs legacy's rem sizing vs one45 (2020s)'s named sizes. The real glyph artwork is unavailable
in both systems — the fidelity gap is the assets, recorded honestly, not fabricated.
(Reconciliation map §4g.)

---

## Layout & grid — breakpoints / grid foundation [D]

Seventh slice (2026-06-23). Closes the **last** open foundation category (breakpoints / grid &
layout). No new component or prototype — token + documentation work, browser-verified across all
three systems (no regression).

**Sourcing result — legacy is Bootstrap 2 (v2.0.2), and inherits its grid/breakpoints rather
than authoring them** [D] (`web/vendor/twitterbootstrap2/`; legacy SCSS under
`PageBundle/.../css/src/`). The one breakpoint the legacy skin authors itself is `768px`; the
grid is the stock BS2 940-grid, never overridden.

| Category | Legacy reality | Cite |
|---|---|---|
| Breakpoints | authors **one** — `min/max-width: 768px` (adaptive-nav show/collapse); BS2 default tiers `480/767/979/980/1200` inherited, not overridden | `themes/one45-responsive.scss:28,41` [D] |
| Page floor | a hard **`min-width: 1100px`** on `.page-body.row-fluid` — legacy is a **fixed-desktop** layout, not mobile-responsive | `one45-responsive.scss:6` [D] |
| Grid columns / gutter | BS2 default: **12 columns** (`.span1`-`.span12`), **20px gutter**, 60px column unit; legacy SCSS declares no `$grid-columns`/`$grid-gutter-width` override | `bootstrap.css:149-150,170,203` [D] |
| Containers | BS2 `940px` base / `1170px` large; no legacy `$container-*` override | `bootstrap.css:170`, `bootstrap-responsive.css:524` [D] |
| Component sizes (real, authored) | `$sidebar_width 250px`, nav `.span3` 220px, `$pageheaderheight 40px` | `_constants.scss:40,48`, `one45-responsive.scss:16` [D] |

In the tool, legacy carries only its real rendered grid gutter (`--ds-grid-gutter: 20px`, the BS2
value, flagged framework default); columns, container, and the breakpoint scale stay structural
(`:root`), with `--ds-bp-md 768px` coinciding with legacy's one authored breakpoint. The real
authored component sizes (sidebar 250px, page floor 1100px) are layout **facts** recorded here,
not promoted to shared `--ds-*` tokens — no component consumes them and one45 (2020s) has no equivalent,
so they would be dead per-system vars.

**Two-speed confirmation:** as elsewhere (buttons converged to one45 (2020s) while inputs did not;
buttons carry a real radius while no motion scale grew), the legacy layout is BS2-inherited with
one bespoke breakpoint and a desktop floor bolted on — never a real responsive grid system. The
gap is recorded, not invented. (Reconciliation map §4h.)

---

## Data display — enshrined slice (Table) [D]

Fourth component group, first piece (2026-06-23). New canonical piece **`Table`** (native in all
three systems); pattern prototype `src/prototypes/cohort-marksheet/`.

**Layer 1/2 — the real legacy table skin** [D] (`_tables.scss` + `_constants.scss`). Legacy
authors a **custom** table skin keyed on `table.report` / `.standard` / `.bordered` (NOT the
Bootstrap `.table*` classes, which it inherits unchanged from vendored BS2). Sort is **DataTables**:
PNG `sort_up.png` / `sort_down.png` arrows under `.dataTables_wrapper`. Real values:

| Element | Real value | Source |
|---|---|---|
| Font / cell padding | 14px / 5px | `_tables.scss:5,7` |
| Header text + rule | `#444` text, `#999` top+bottom rule, **no fill** | `_constants.scss:65-67` |
| Body cell | `#444` text, `#BBB` border | `_constants.scss:58-59` |
| Outer (`.bordered`/`.records_list`) | `#CCC` | `_constants.scss:56` |
| Hover / active-sort col | `#FEFEFE` | `_constants.scss:61-62` |
| Radius / sticky | none (collapse, square) | `_tables.scss` |

**Instances:** `table.standard` (importer/eDossier `records.html.twig`), the `report-tabular`
DataTables grids (`grades_marks.html.twig` — the colloquial "marksheet"; there is **no** `marksheet`
CSS class), rotation listings.

**Computed contrast** (`contrast.mjs`, "legacy Table"): text `#444`/white **9.74** (AAA); header
rule `#999`/white **2.85** — **fails 3:1**, added to the legacy fix list alongside the `#DDD` input
border and `#AAA` tab rule; cell border `#BBB`/white **1.92** (fails, thin decorative).

**Intent-vs-reality [R]:** this custom legacy skin is **not live on the modern one45 (2020s)-rebranded
staging** — injected `table.report`/`.standard` classes render inert there (the staging runs the
modern build). The values above are the documented **legacy-pole** reality, sourced from SCSS, the
same handling as other legacy-only chrome. The canonical Table API + a pure token swap absorb this
skin and the one45 (2020s) react-table model alike. (Reconciliation map §4i.)

## Data display — enshrined slice (Card, formalised) [D]

Second data-display piece (2026-06-23). The canonical `Card` was formalised (new `iconName` +
`footer` props); pattern prototype `src/prototypes/learner-profile/`.

**Inventory reality — legacy ships NO bespoke card** [D]. The custom one45 skin has no first-party
card component; real card surfaces come from **(a)** the vendored Bootstrap panel/modal and **(b)**
the real **`.dashboard-widget` tile** (`themes/one45.scss:657-715`: `li` 1px `#CCC` border, a grey
`h3` title band `#CCC`, content text `#000` 16px). A real React island does reach for the
react-bootstrap `Card` (`canvas_sync/.../syncJob.jsx`). So legacy "has" a card via a **different
mechanism**, the mirror of how it ships a real Alert but no Badge.

**Layer 1/2 — the legacy panel idiom the tool models** [D]. The legacy card is rendered on the
**panel/modal grey-band idiom** already enshrined for the legacy Modal (`_bootstrap.scss`): a white
body with a **`#F5F5F5` grey header band** + `#EEE` bottom rule, `#D1D1D9` (`$grey`) border, 4px
base radius, `$one45_black #27304B` title at 16px (the `.dashboard-widget` `h3` size). The grey band
is **full-bleed** (the one per-system structural flourish in app.css, like the legacy box tabs).

**Computed contrast** (`contrast.mjs`, "legacy Card"): title `#27304B` on the band `#F5F5F5`
**11.96** (AAA) and on the white body **13.04** (AAA); 1px border `#D1D1D9`/white **1.52** — fails
3:1 (thin decorative border, flagged, the real `$grey`).

**Intent-vs-reality [R]:** legacy cards render via vendored Bootstrap, not a first-party DS
component, so bespoke-card `[R]` was **not separately captured** this slice — the values are
`[D]`-sourced from the panel idiom + the `.dashboard-widget` tile, the recorded gap. The canonical
Card API + a near-pure token swap (plus the one legacy band flourish) absorb this and the Acuity DS
Card alike, so Card is native-both — no bridge. (Reconciliation map §4j.)

---

## Data display — enshrined slice (Avatar) [D]

Third data-display piece (2026-06-23). **Legacy owns the only real person-photo widgets** in One45 —
the Acuity DS ships none — so `Avatar` is a legacy-native, **present-vs-absent** piece (axis b), the
Breadcrumb mirror. Pattern prototype `src/prototypes/reviewer-roster/` (a selectable faculty roster
led by a circle `Avatar` → a photo wall of the chosen reviewers as card `Avatar`s).

**Inventory reality — TWO real shapes, both enshrined as the one canonical Avatar** (a `shape`
variant). The handoff's `.badge-details` lead was **wrong** — that is a name-dropdown text panel
(no `<img>`, `themes/one45.scss:483-499`), not a photo widget. The real widgets are:

| Shape | Source | Real rendered values |
|---|---|---|
| **circle** (`shape="circle"`, default) | people-picker / self-send `.profile-img` (`_list_picker.scss:26-31,41-54`) | circular, **25px** (sm) / **60px** (lg), border **2px** (`2px solid` = `currentColor`, no authored colour — `[I]`), `blank.gif` placeholder, **no initials** |
| **card** (`shape="card"`) | webeval yearbook tile `.photo` (`photoGallery.css:8-60`, `photo.php:14-62`) | a **75px**-wide `#FFF` card, 1px **`#BBB`** border, 3px pad, square corners, holding a **75×98** image with a name caption beneath in **`#666`** at **9px**; `blank.gif` / `person_outline.gif` fallbacks |

**Tokens enshrined** (`--ds-avatar-*`): the values above, verbatim. The circle ring is reproduced as
`currentColor` (faithful to the un-authored `2px solid`); the card caption / border carry the real
`#666` / `#BBB`. **Computed contrast** (`contrast.mjs`, "legacy Avatar"): caption `#666`/white
**5.74** (AA text); card border `#BBB`/white **1.92** — fails 3:1 (thin decorative border, flagged).

**Intent-vs-reality [R]:** not separately re-captured on staging this slice — the people-picker
circle is a non-DS hand-rolled widget and the `.photo` tile is a webeval (classic-app) view; values
are `[D]`-sourced from the SCSS / tag implementation, the recorded basis. The Acuity DS ships no
avatar at all, so one45-2020s gets a flagged bridge build (`INTERIM_BUILDS`) — never a fabricated
component (Spencer's rule). One canonical API absorbs both shapes via `shape`; no API break.
(See `01` for the one45-2020s inventory gap and reconciliation map §4k.)

---

## Data display — enshrined slice (List) [D]

Fourth data-display piece (2026-06-29). **Legacy owns a real, distinct general list — `.list-widget`**
(`themes/one45.scss:457-467`): an unstyled `<ul>` (`list-style: none`, margin/padding 0) whose `<li>`s
are padded-left **25px** (`$inline_list_spacing_unit`, `_constants.scss:15`), used for page-header /
footer navigation lists with link items; the footer variant adds a `folder.png` bullet
(`one45.scss:648-651`). So List is **native** here — the markerless default maps exactly to the
canonical `plain` variant.

**Not the same as Table or the picker.** `.records_list` / `.bordered` is **table** styling
(`_tables.scss` — the Table slice §4i), not a list. `canned_list` / `.ul_canned` (`uls.css`,
`canned_list.css`) is a search / picker dropdown UI (`#1c3caa` links, `#4275d0` selected) — a control,
not a data-display list — so it is **not** enshrined as List. The genuine general list is `.list-widget`.

**Tokens enshrined** (`--ds-list-*`): item / marker `$one45_black` **#27304B**, link `$link_color`
**#0A6CBD** (`_colors.scss:34`), indent **25px**, tight rows. **Computed contrast** (`contrast.mjs`,
"legacy List"): item text `#27304B`/white **13.04** (AAA); link `#0A6CBD`/white **5.39** (AA text).
**Intent-vs-reality [R]:** not separately re-captured — list-widgets render in nav chrome, not a DS
gallery; values are `[D]`-sourced from the SCSS. One canonical API (`items` + `variant`) holds across
both poles as a pure token swap; the divergence is **inventory** (neither DS ships a List *component*).
(See `01` for the one45-2020s ad-hoc reality and reconciliation map §4l.)

---

## Data display — enshrined slice (Accordion) [D]

Fifth data-display piece (2026-06-30), the second structural-divergence case after Tabs. **Legacy owns
a real, distinct accordion — `.subheader-sticky.collapsible`** (`webeval collapsibleHeaders.js` +
`collapsibleHeaders.css`; the canonical example is `admin/pages/classes/curricGroups.php`). A sticky
`<h2>` header carries a **2px `#27304B` underline** (border-bottom, NOT a card border), a navy `#27304B`
bold 1.2rem label, white background, and a right-floated chevron (`i.angle.right.icon`) that **rotates
90° open**; the `.section-content` body is hidden by a `.closed` modifier and sections sit 15px apart
(`.closed` margin). Hover swaps the label/rule to `#787C88`. So Accordion is **native** here.

**A second, simpler disclosure exists** — the `collapsible_section` tag (`[+] show` / `[-] hide` links,
`admin/pages/classes/tags/collapsible_section.php`) — but it is a one-region show/hide, not the
multi-section accordion; the `.collapsible` pattern is the enshrined general accordion.

**Tokens enshrined** (`--ds-accordion-*`, the underline-header model — an `app.css` structural override,
the Tabs precedent): label `$one45_black` **#27304B** bold 1.2rem over a 2px `#27304B` rule, chevron
`#27304B`, hover **#787C88**, header pad 16px/0/5px, sections 15px apart. **Computed contrast**
(`contrast.mjs`, "one45 legacy Accordion"): label/underline `#27304B`/white **13.04** (AAA); hover
`#787C88`/white **4.17** — fails AA as normal text, but the header is **1.2rem bold = large text**, judged
on 3:1, which it passes. **Intent-vs-reality [R]:** not separately re-captured (renders in curriculum
admin chrome, not a DS gallery); values are `[D]`-sourced from the CSS. One canonical API (`items` +
`single?`) holds across both poles, but the **skin diverges structurally** (legacy underline vs 2020s
card — the Tabs case), and the divergence is **inventory on both poles** (neither DS ships an Accordion
*component*). (See `01` for the one45-2020s react-bootstrap reality and reconciliation map §4m.)

---

## Data display — enshrined slice (Tree) [D]

Sixth data-display piece (2026-06-30), the third structural-divergence case after Tabs and Accordion.
**Legacy owns a real tree — the jQuery `dynatree` widget**, skinned by the authored `_dynatree.scss`
(`WidgetBundle`): `.dynatree-container` resets `border` and `margin-left`, and `.dynatree-selected a`
paints **acuity-blue `#364699`** (`font-style: normal`), over the vendored vista skin (16px node rows,
an expand triangle, a folder/doc sprite). Node label is `$one45_black` `#27304B`. So Tree is **native**
here — a classic file-tree widget with expandable nodes.

**Tokens enshrined** (`--ds-tree-*`): node label `$one45_black` **#27304B**, selected node acuity-blue
**#364699** (the one authored colour), 16px per-level indent. **Computed contrast** (`contrast.mjs`,
"one45 legacy Tree"): node label `#27304B`/white **13.04** (AAA); selected `#364699`/white **8.42**
(AAA). **Intent-vs-reality [R]:** not separately re-captured (the tree renders in curriculum admin
chrome); values are `[D]`-sourced from `_dynatree.scss`. One canonical API (recursive `nodes`) holds
across both poles, but the **skin diverges structurally** (the legacy dynatree widget vs the 2020s
indented tree-table — the Tabs/Accordion case); the divergence is **inventory on both poles** (neither
DS ships a Tree *component*). The dynatree connector lines + folder/doc sprite are a recorded
simplification (the icon asset gap — the tool renders indented rows + a chevron). (See `01` for the
one45-2020s tree-table reality and reconciliation map §4n.)

---

## Carry-forward verdict

The legacy brand is a **migration source, not a target** — it is being replaced by
one45 (2020s) (mid-flight). Preserve it in the prototyping tool as a real toggle target so
a screen can be shown old-vs-new (the convergence signal), and so the
One45-legacy ↔ One45-new comparison has a faithful "legacy" pole. Do **not** carry
its tokens forward into the unified system. The 175-tag webeval list is the
functional coverage checklist the new system must cover.
