// contrast.mjs — deterministic WCAG 2.x contrast computation for the two One45
// design systems. Ratios are COMPUTED here (sRGB relative luminance, WCAG 1.4.3
// formula), never hand-written into the reports. Same method as the internal
// analysis; reproduced in JS so it runs with the tool's Node toolchain.
//
//   Usage:  node shared/one45-design-systems/scripts/contrast.mjs
//
// Token values are lifted verbatim from the source-of-truth files:
//   Acuity  : symfony/tailwind_acuity_theme.js  (== acuity_branding.css --ds-*)
//   one45   : symfony/src/One45/PageBundle/Resources/public/css/src/includes/_colors.scss:1-35
//
// Thresholds (WCAG 1.4.3 AA / 1.4.6 AAA / 1.4.11):
//   normal text 4.5:1 · large text 3:1 · UI component 3:1 · AAA normal 7:1.

const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const hexToRgb = (h) => {
  const m = h.replace("#", "");
  const n = m.length === 3 ? m.split("").map((x) => x + x).join("") : m;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const ratio = (fg, bg) => {
  const a = L(hexToRgb(fg)) + 0.05;
  const b = L(hexToRgb(bg)) + 0.05;
  return +(Math.max(a, b) / Math.min(a, b)).toFixed(2);
};
const verdict = (r) => {
  const tags = [];
  tags.push(r >= 4.5 ? "AA-text PASS" : "AA-text FAIL");
  tags.push(r >= 3 ? "UI/large PASS" : "UI/large FAIL");
  if (r >= 7) tags.push("AAA PASS");
  return tags.join(" · ");
};

const WHITE = "#FFFFFF";

// ── one45 (2020s) (System B) — every family DEFAULT + the shades most likely used as
// fg/bg, measured on white and (for white-on-X buttons) on the colour itself.
const ONE45_2020S = {
  "acuity-blue": { darkest: "#161E4A", dark: "#253170", DEFAULT: "#364699", light: "#7779B8", lighter: "#B0B1D7", lightest: "#E9ECF6" },
  "acuity-green": { darkest: "#00514B", dark: "#007A72", DEFAULT: "#00A59B", light: "#70C0B8", lighter: "#B0DBD6", lightest: "#EBF6F5" },
  "acuity-red": { darkest: "#5C0924", dark: "#8A1339", DEFAULT: "#BA1E50", light: "#D66D80", lighter: "#ECACB5", lightest: "#FBEAEC" },
  "secondary-blue": { darkest: "#15436E", dark: "#205C94", DEFAULT: "#2C76BC", light: "#799DD1", lighter: "#B3C6E5", lightest: "#EAF1F9" },
  "information-blue": { darkest: "#0D556D", dark: "#157393", DEFAULT: "#1E93BA", light: "#76B2CF", lighter: "#B2D3E3", lightest: "#EBF4F8" },
  "success-green": { darkest: "#24590A", dark: "#387F14", DEFAULT: "#4DA81F", light: "#89C368", lighter: "#BCDEA9", lightest: "#EEF8EB" },
  "warning-yellow": { darkest: "#816E09", dark: "#E0CA01", DEFAULT: "#FCE833", light: "#FFEE7A", lighter: "#FFF5B1", lightest: "#FEFBE0" },
  "danger-red": { darkest: "#720202", dark: "#A90508", DEFAULT: "#E40A0A", light: "#F97054", lighter: "#FFB19E", lightest: "#FFECE8" },
  neutrals: { black: "#000000", darker: "#333333", dark: "#555555", DEFAULT: "#8C8C8C", light: "#B8B8B8", lighter: "#F5F5F5", white: "#FFFFFF" },
};

// ── Acuity Design System (acuity-canon) — values from
//    node_modules/@takecasper/acuity-design-system@1.27.13/dist/assets/index.css.
//    Shades absent from the compiled CSS are omitted.
const ACUITY_CANON = {
  "acuity-blue":              "#364699",  // .ds-bg-acuity-blue          rgb(54 70 153)
  "acuity-blue-darkest":      "#161E4A",  // .ds-bg-acuity-blue-darkest  rgb(22 30 74)
  "acuity-green":             "#00A59B",  // .ds-text-acuity-green       rgb(0 165 155)
  "information-blue":         "#1E93BA",  // .ds-text-information-blue   rgb(30 147 186)
  "information-blue-dark":    "#157393",  // .ds-text-information-blue-dark  rgb(21 115 147)
  "information-blue-darkest": "#0D556D",  // .ds-bg-information-blue-darkest rgb(13 85 109)
  "success-green":            "#4DA81F",  // .ds-bg-success-green        rgb(77 168 31)
  "success-green-dark":       "#387F14",  // .ds-text-success-green-dark rgb(56 127 20)
  "success-green-darkest":    "#24590A",  // .ds-text-success-green-darkest rgb(36 89 10)
  "warning-yellow-darkest":   "#816E09",  // .ds-text-warning-yellow-darkest rgb(129 110 9)
  "danger-red":               "#E40A0A",  // .ds-bg-danger-red           rgb(228 10 10)
  "danger-red-dark":          "#A90508",  // .ds-bg-danger-red-dark      rgb(169 5 8)
  "danger-red-darkest":       "#720202",  // .ds-stroke-danger-red-darkest stroke:#720202
  "neutrals-black":           "#000000",  // .ds-bg-neutrals-black       rgb(0 0 0)
  "neutrals-darker":          "#333333",  // .ds-bg-neutrals-darker      rgb(51 51 51)
  "neutrals-dark":            "#555555",  // .ds-text-neutrals-dark      rgb(85 85 85)
  "neutrals":                 "#949494",  // .ds-border-neutrals         rgb(148 148 148)
  "neutrals-light":           "#B8B8B8",  // .ds-bg-neutrals-light       rgb(184 184 184)
  "neutrals-lighter":         "#F5F5F5",  // .ds-bg-neutrals-lighter     rgb(245 245 245)
  "neutrals-white":           "#FFFFFF",  // .ds-bg-neutrals-white       rgb(255 255 255)
};

// ── one45 legacy (System A) — _colors.scss:1-35.
const ONE45 = {
  one45_black: "#27304B",
  menu_header: "#EEE5E9",
  primary_red_dark: "#C0254E", primary_red: "#F12F62", primary_red_light: "#F9ABC0",
  primary_yellow_dark: "#C0681C", primary_yellow: "#F8B223", primary_yellow_light: "#FCE0A7",
  primary_teal_dark: "#2FAEA1", primary_teal: "#3BDACA", primary_teal_light: "#B0F0E9",
  primary_purple_dark: "#344064", primary_purple: "#42507D", primary_purple_light: "#B3B9CB",
  grey_dark_3: "#535356", grey_dark_2: "#7D7D82", grey_dark_1: "#A6A6AD", grey: "#D1D1D9",
  link_color: "#0a6cbd", link_hover_color: "#064e89",
};

const section = (title) => console.log(`\n### ${title}\n`);
const row = (label, fg, bg, note = "") =>
  console.log(`${label.padEnd(34)} ${fg} on ${bg} = ${String(ratio(fg, bg)).padStart(6)}:1  ${verdict(ratio(fg, bg))}${note ? "  " + note : ""}`);

console.log("# One45 token contrast — computed (WCAG sRGB), not hand-written\n");
console.log("Method: WCAG 1.4.3 relative-luminance. Thresholds: text 4.5 · UI/large 3 · AAA 7.\n");

section("one45 (2020s) (System B) — each family DEFAULT on white, and white on it (button case)");
for (const [fam, shades] of Object.entries(ONE45_2020S)) {
  if (fam === "neutrals") continue;
  row(`${fam} DEFAULT / white`, shades.DEFAULT, WHITE);
  row(`white / ${fam} DEFAULT`, WHITE, shades.DEFAULT);
}

section("one45 (2020s) neutrals on white (text/border greys)");
for (const k of ["black", "darker", "dark", "DEFAULT", "light"]) row(`neutrals ${k} / white`, ONE45_2020S.neutrals[k], WHITE);

section("one45 (2020s) light/lighter shades on white (where used as text — the risk set)");
for (const fam of Object.keys(ONE45_2020S)) {
  if (fam === "neutrals") continue;
  row(`${fam} light / white`, ONE45_2020S[fam].light, WHITE);
}

section("one45 legacy (System A) — brand colours on white, and text on brand chrome");
for (const k of ["primary_purple", "primary_red", "primary_yellow", "primary_teal", "link_color", "grey_dark_1", "grey_dark_2", "grey_dark_3"]) {
  row(`${k} / white`, ONE45[k], WHITE);
}
row("white / primary_purple (button)", WHITE, ONE45.primary_purple);
row("white / one45_black (header)", WHITE, ONE45.one45_black);
row("one45_black / white (body text)", ONE45.one45_black, WHITE);

section("Rendered-reality colours [R] — present in NO token file (internal analysis)");
row("config nav #e46b6b / white", "#e46b6b", WHITE, "(runtime-confirmed 3.17)");
row("My eDossier #2196f3 / #27304b", "#2196f3", "#27304b", "(runtime-confirmed 4.17)");

// ── Inputs & controls slice — the form-control pairs, [R] from the live DS gallery
// (/test/designSystem, 2026-06-22) for one45 (2020s) and [D] from _forms.scss for legacy.
// Borders are judged against the 3:1 UI threshold (WCAG 1.4.11), text against 4.5.
section("one45 (2020s) form controls [R] — DS .ds-form-input/.ds-form-select on white");
row("input border #949494 / white", "#949494", WHITE, "(border, 3:1 UI) — DS already uses the accessible grey");
row("input text neutrals-darker / white", "#333333", WHITE);
row("error border danger-red / white", "#E40A0A", WHITE, "(border 3:1)");
row("error text danger-red-darkest / white", "#720202", WHITE);
row("success border success-green / white", "#4DA81F", WHITE, "(border 3:1)");
row("focus ring acuity-blue / white", "#364699", WHITE, "(3:1 non-text contrast)");
section("one45 (2020s) shell search [R] — Find-a-person field (top-bar)");
row("search text $purple / bg #EBEDF2", "#42507D", "#EBEDF2");
row("focus ring $purple / white", "#42507D", WHITE);

section("one45 legacy form controls [D] — _forms.scss base input");
row("input border #DDD / white", "#DDDDDD", WHITE, "(border fails 3:1 — flagged)");
row("input text #333 / white", "#333333", WHITE);
row("error label #B94A48 / white", "#B94A48", WHITE);
row("legacy button #364699 / white", WHITE, "#364699", "(buttons converged to acuity-blue)");

// ── Navigation slice — tab/link/breadcrumb/pagination pairs. one45 (2020s) values are [R]
// from the live DS gallery (/test/designSystem, 2026-06-22) cross-checked to
// tailwind_acuity_theme.js; legacy values are [D] from the legacy skin (themes/one45.scss,
// styles_overwrite.scss, _colors.scss). Tab active-indicator + pagination active-bg are
// judged on the 3:1 UI threshold; tab/link/crumb label text on 4.5.
section("one45 (2020s) navigation [R] — Tabs/Link on white (underline-indicator tabs)");
row("tab label neutrals-black / white", "#000000", WHITE);
row("active-tab indicator acuity-green", "#00A59B", WHITE, "(2px underline, 3:1 UI)");
row("tab strip rule #949494 / white", "#949494", WHITE, "(3:1 UI)");
row("link acuity-blue / white", "#364699", WHITE);
row("link active acuity-blue-darkest", "#161E4A", WHITE);

section("one45 legacy navigation [D] — Tabs/Link/Breadcrumb on white (Bootstrap box tabs)");
row("tab label $primary_purple / white", "#42507D", WHITE);
row("active-tab $one45_black / white", "#27304B", WHITE);
row("tab box+strip rule #AAAAAA / white", "#AAAAAA", WHITE, "(border 3:1)");
row("link $link_color / white", "#0A6CBD", WHITE);
row("link hover $link_hover / white", "#064E89", WHITE);
row("crumb link $primary_purple / white", "#42507D", WHITE);
row("crumb current $one45_black / white", "#27304B", WHITE);

// ── Feedback & status slice — Modal. one45 (2020s) values are [R] from the live DS gallery
// (/test/designSystem, 2026-06-22, getComputedStyle on the headlessui Dialog panel);
// legacy values are [D] from _bootstrap.scss (.modal / .modal-header). The modal title
// is the only TEXT pair (judged on 4.5); the grey-band-vs-panel and panel-shadow pairs
// are decorative surfaces, reported for completeness, not held to a text threshold.
section("one45 (2020s) Modal [R] — headerless dialog, title on the white panel");
row("modal title neutrals-darker / white", "#333333", WHITE, "(23px title on #fff panel)");
section("one45 legacy Modal [D] — title on the grey header band, body on white");
row("modal title $one45_black / band #F5F5F5", "#27304B", "#F5F5F5", "(title on .modal-header band)");
row("modal title $one45_black / white", "#27304B", WHITE, "(same title over the white body)");
row("header band #F5F5F5 / panel #FFFFFF", "#F5F5F5", WHITE, "(decorative band vs panel — not text)");

// ── Feedback & status slice — Alert (native-both). one45 (2020s) is a tinted-bg banner: text is
// each semantic family's darkest on its lightest tint [D families / I rendering]. Legacy is
// the real .one45-alert: $one45_black text on the solid pale fills, white on the purple info
// fill [D] (new_branding.scss:65-170). All are body text → judged on the 4.5 threshold.
section("one45 (2020s) Alert [D fam / I render] — family darkest text on family lightest tint");
row("info  info-blue-darkest / lightest", "#0D556D", "#EBF4F8");
row("success green-darkest / lightest", "#24590A", "#EEF8EB");
row("warning yellow-darkest / lightest", "#816E09", "#FEFBE0");
row("error red-darkest / lightest", "#720202", "#FFECE8");
section("one45 legacy Alert [D] — .one45-alert solid fills (success/warning/error/info)");
row("success $one45_black / $teal_light", "#27304B", "#B0F0E9");
row("warning $one45_black / $yellow_light", "#27304B", "#FCE0A7");
row("error $one45_black / pink #FFC8D7", "#27304B", "#FFC8D7");
row("info  white / $primary_purple", WHITE, "#42507D", "(solid purple fill, white text)");

// ── Foundations slice — muted text. The Foundations slice (2026-06-23) replaced the
// `.flow-row__meta { opacity: 0.7 }` chrome nit with a real --ds-fg-muted colour token
// (the css-conventions rule: never use opacity to reduce prominence). These are the
// muted-text greys; judged on the 4.5 text threshold (chrome over the white canvas).
section("Foundations — muted text (--ds-fg-muted) on white");
row("fg-muted one45-2020s/legacy #5f5f5f / white", "#5F5F5F", WHITE);
row("fg-muted lowfi #6a6a6a / white", "#6A6A6A", WHITE);

// ── Iconography slice (2026-06-23) — the semantic icon TONE colours rendered as the glyph on
// the white canvas. The Icon `tone` prop reuses the --ds-alert-*-accent colours; UNLIKE the
// Alert section (each family's darkest TEXT on its lightest tint, judged 4.5), here the accent
// colour IS the small glyph on white, so it is judged on the 3:1 non-text/UI threshold (WCAG
// 1.4.11). Several warm hues FAIL 3:1 at icon scale — a real, recorded finding: a semantic icon
// must not rely on hue alone, so the tool always pairs it with shape + an altText/adjacent label.
// (one45 (2020s) tones [D fam] = tailwind_acuity_theme.js DEFAULT shades; legacy tones [D] = the FA
// alert-icon palette, new_branding.scss:100/119/140/159.)
section("one45 (2020s) icon tones [D fam] — semantic accent as the glyph on white (3:1 UI)");
row("success-green DEFAULT / white", "#4DA81F", WHITE, "(icon glyph, 3:1 UI)");
row("warning-yellow DEFAULT / white", "#FCE833", WHITE, "(icon glyph, 3:1 UI)");
row("danger-red DEFAULT / white", "#E40A0A", WHITE, "(icon glyph, 3:1 UI)");
row("information-blue DEFAULT / white", "#1E93BA", WHITE, "(icon glyph, 3:1 UI)");
section("one45 legacy icon tones [D] — FA alert-icon palette as the glyph on white (3:1 UI)");
row("teal_dark / white (success)", "#2FAEA1", WHITE, "(icon glyph, 3:1 UI)");
row("yellow / white (warning)", "#F8B223", WHITE, "(icon glyph, 3:1 UI)");
row("red / white (error)", "#F12F62", WHITE, "(icon glyph, 3:1 UI)");
row("purple_light / white (info)", "#B3B9CB", WHITE, "(icon glyph, 3:1 UI)");

// ── Data display slice (2026-06-23) — Table. one45 (2020s) values are [R] from staging (signed in:
// a bare .table inherits Lato 14px #333 / th 700 with NO authored skin; the real marksheet
// admin/pages/marksOverview2.php renders 1px #666 row dividers). Legacy values are [D] from
// the real _tables.scss / _constants.scss skin. Cell TEXT is judged on 4.5; header/cell
// border rules on the 3:1 UI threshold (1.4.11); hover/selected fills are decorative
// surfaces, reported for completeness, not held to a text threshold.
section("one45 (2020s) Table [R] — text + dividers on white (the DS ships no table; app reality)");
row("cell/header text neutrals-darker / white", "#333333", WHITE);
row("header rule #666 / white", "#666666", WHITE, "(marksheet header border, 3:1 UI)");
row("row divider neutrals-light / white", "#B8B8B8", WHITE, "(1px divider — fails 3:1, flagged)");
row("hover neutrals-lighter / white", "#F5F5F5", WHITE, "(decorative fill — not text)");
row("selected acuity-blue-lightest / white", "#E9ECF6", WHITE, "(decorative fill — not text)");
section("one45 legacy Table [D] — _tables.scss table.report/.standard on white");
row("cell/header text #444 / white", "#444444", WHITE);
row("header rule #999 / white", "#999999", WHITE, "(border 3:1 UI)");
row("cell border #BBB / white", "#BBBBBB", WHITE, "(border — fails 3:1, flagged)");
row("hover #FEFEFE / white", "#FEFEFE", WHITE, "(decorative fill — not text)");

// ── Data display slice (2026-06-23) — Card (formalised). one45 (2020s) values are [R] from staging
// (signed in, getComputedStyle on /test/designSystem: the DS Card is a headerless white panel,
// neutrals-light #B8B8B8 1px border, neutrals-darker #333 title). Legacy values are [D] — the
// custom skin ships no bespoke card, so the tool models the legacy panel idiom ($one45_black
// title on the #F5F5F5 grey header band over the white body, $grey #D1D1D9 border). Title TEXT
// is judged on 4.5; the card border + header rule on the 3:1 UI threshold (1.4.11); the header
// band vs panel is a decorative surface, reported for completeness, not held to a text threshold.
section("one45 (2020s) Card [R] — title + border on the white panel (headerless DS Card)");
row("card title neutrals-darker / white", "#333333", WHITE, "(20px/600 title on #fff panel)");
row("card border neutrals-light / white", "#B8B8B8", WHITE, "(1px border — fails 3:1, flagged)");
section("one45 legacy Card [D] — title on the grey header band, body on white");
row("card title $one45_black / band #F5F5F5", "#27304B", "#F5F5F5", "(title on the grey header band)");
row("card title $one45_black / white", "#27304B", WHITE, "(same title over the white body)");
row("card border $grey #D1D1D9 / white", "#D1D1D9", WHITE, "(1px border — fails 3:1, flagged)");
row("header band #F5F5F5 / panel #FFFFFF", "#F5F5F5", WHITE, "(decorative band vs panel — not text)");

// ── Data display slice (2026-06-23) — Avatar. Legacy owns the only real avatars. Circle is
// .profile-img (_list_picker.scss); card is the webeval .photo yearbook tile (photoGallery.css) —
// its caption #666 is body TEXT (judged 4.5), its #BBB border is a thin UI rule (3:1, 1.4.11). The
// circle ring is `2px solid` = currentColor (no authored colour) so there is no fixed pair to test.
// The Acuity DS ships NO avatar, so the one45-2020s values style only the flagged bridge interim — the
// neutrals-light border (3:1 UI) + the accessible #5f5f5f caption (4.5 text).
section("one45 legacy Avatar [D] — .photo yearbook card caption + border on white");
row("card caption #666 / white", "#666666", WHITE, "(9px caption text)");
row("card border #BBB / white", "#BBBBBB", WHITE, "(1px border — fails 3:1, flagged)");
section("one45 (2020s) Avatar [bridge interim] — flagged build styling on white (DS ships no avatar)");
row("interim caption #5f5f5f / white", "#5F5F5F", WHITE, "(--ds-fg-muted caption text)");
row("interim ring/border neutrals-light / white", "#B8B8B8", WHITE, "(1px border — fails 3:1, flagged)");

// ── Data display slice (2026-06-29) — List. Neither DS ships a List component, so one45 (2020s)
// reproduces the real ad-hoc <ul>/<ol> reality and acuity-canon bridges a flagged interim; legacy
// has the real .list-widget (themes/one45.scss:457-467). one45 (2020s) item text is neutrals-darker
// #333 — [R] DELTA 2026-06-29: the intended `text-acuity-blue` flex list paints BLACK on the live
// DS page (the un-prefixed utility is not compiled), so list TEXT is body, not brand; links use the
// compiled acuity-blue #364699. Legacy items are $one45_black #27304b with $link_color #0a6cbd links
// (_colors.scss:34). Item/link TEXT judged on 4.5; the bullet/number MARKER is a small adjacent glyph,
// judged on the 3:1 UI threshold (1.4.11).
section("one45 (2020s) List [R/D] — item text + link + marker on white (the DS ships no list)");
row("item text neutrals-darker / white", "#333333", WHITE);
row("item link acuity-blue / white", "#364699", WHITE);
row("marker neutrals-darker / white", "#333333", WHITE, "(bullet/number glyph, 3:1 UI)");
section("one45 legacy List [D] — .list-widget item text + link + marker on white");
row("item text $one45_black / white", "#27304B", WHITE);
row("item link $link_color #0a6cbd / white", "#0A6CBD", WHITE);
row("marker $one45_black / white", "#27304B", WHITE, "(bullet/number glyph, 3:1 UI)");
section("lowfi List [sketch] — greyscale item text + marker on white");
row("item text #3a3a3a / white", "#3A3A3A", WHITE);
row("marker #6a6a6a / white", "#6A6A6A", WHITE, "(bullet/number glyph, 3:1 UI)");
section("acuity-canon List [bridge interim] — flagged build item text + link on white (package ships no list)");
row("item text neutrals.darker / white", "#333333", WHITE);
row("item link acuity-blue / white", "#364699", WHITE);

// ── Data display slice — Accordion. The ADS package exports no Accordion, so one45 (2020s)
// renders the app's react-bootstrap <Accordion> over <Card> (syncJob.jsx) — its header colours are
// pinned to the real DS Card surface (§4j); legacy renders the real .subheader-sticky.collapsible
// (collapsibleHeaders.css): navy #27304B label/underline, hover #787C88; acuity-canon bridges a
// flagged interim. Header label TEXT judged on 4.5; the chevron + the section/underline rule are
// non-text UI, judged on the 3:1 threshold (1.4.11). The card-header fill is decorative.
section("one45 (2020s) Accordion [D §4j] — header label + chevron + card border on white");
row("header label neutrals-darker / white", "#333333", WHITE);
row("chevron acuity-blue / white", "#364699", WHITE, "(chevron glyph, 3:1 UI)");
row("card border neutrals-light / white", "#B8B8B8", WHITE, "(decorative 1px card border, 1.4.11)");
section("one45 legacy Accordion [D] — .subheader-sticky.collapsible label + hover + 2px underline on white");
row("header label $one45_black / white", "#27304B", WHITE);
row("header hover #787C88 / white", "#787C88", WHITE);
row("underline rule $one45_black / white", "#27304B", WHITE, "(2px header rule, 3:1 UI)");
section("lowfi Accordion [sketch] — greyscale header label + chevron on white");
row("header label #3a3a3a / white", "#3A3A3A", WHITE);
row("chevron #6a6a6a / white", "#6A6A6A", WHITE, "(chevron glyph, 3:1 UI)");
section("acuity-canon Accordion [bridge interim] — flagged build header + chevron on white (package ships no accordion)");
row("header label neutrals.darker / white", "#333333", WHITE);
row("chevron acuity-blue / white", "#364699", WHITE, "(chevron glyph, 3:1 UI)");

// ── Data display slice — Tree. The ADS package exports no Tree, so one45-2020s renders the
// curriculum tree-table (mappingTable.jsx — indented rows + fa-angle chevrons) and legacy the
// jQuery dynatree widget (authored _dynatree.scss — acuity-blue #364699 selected); acuity-canon
// bridges a flagged interim. Node label TEXT judged on 4.5; the disclosure chevron + the active-
// node accent are non-text UI, judged on the 3:1 threshold (1.4.11).
section("one45 (2020s) Tree [D] — node label + chevron + active accent on white");
row("node label neutrals-darker / white", "#333333", WHITE);
row("chevron muted-fg / white", "#5F5F5F", WHITE, "(chevron glyph, 3:1 UI)");
row("active node acuity-blue / white", "#364699", WHITE, "(active/mapped node, 3:1 UI)");
section("one45 legacy Tree [D] — dynatree node label + acuity-blue selected on white");
row("node label $one45_black / white", "#27304B", WHITE);
row("selected node acuity-blue / white", "#364699", WHITE, "(.dynatree-selected a, 3:1 UI)");
section("lowfi Tree [sketch] — greyscale node label + chevron on white");
row("node label #3a3a3a / white", "#3A3A3A", WHITE);
row("chevron #6a6a6a / white", "#6A6A6A", WHITE, "(chevron glyph, 3:1 UI)");
section("acuity-canon Tree [bridge interim] — flagged build node + chevron on white (package ships no tree)");
row("node label neutrals.darker / white", "#333333", WHITE);
row("chevron acuity-blue / white", "#364699", WHITE, "(chevron glyph, 3:1 UI)");

// ── Data display slice — Timeline. one45-2020s-only (the EPA status-history, _history.scss); legacy
// + acuity-canon bridge a flagged interim. Date + title TEXT judged on 4.5; the marker dot is a
// non-text UI element judged on 3:1 (1.4.11).
section("one45 (2020s) Timeline [D] — entry date + title + marker on white");
row("entry date muted-fg / white", "#5F5F5F", WHITE, "(.history #5F5F5F header [D])");
row("entry title neutrals-darker / white", "#333333", WHITE);
row("marker acuity-blue / white", "#364699", WHITE, "(rail dot, 3:1 UI)");
section("one45 legacy Timeline [bridge interim] — flagged build title + marker on white (legacy ships no history)");
row("entry title $one45_black / white", "#27304B", WHITE);
row("marker $primary_purple / white", "#42507D", WHITE, "(rail dot, 3:1 UI)");
section("lowfi Timeline [sketch] — greyscale title + marker on white");
row("entry title #3a3a3a / white", "#3A3A3A", WHITE);
row("marker #3a3a3a / white", "#3A3A3A", WHITE, "(rail dot, 3:1 UI)");
section("acuity-canon Timeline [bridge interim] — flagged build title + marker on white (package ships no timeline)");
row("entry title neutrals.darker / white", "#333333", WHITE);
row("marker acuity-blue / white", "#364699", WHITE, "(rail dot, 3:1 UI)");

// ── Acuity Design System (acuity-canon) — brand + semantic families on white, and white
// on brand (button case). Values sourced from dist/assets/index.css (compiled Tailwind).
// Light tints (lightest) are backgrounds, not foregrounds — excluded from this set
// (they render white-on-white < 1.5:1). Dark shades (darkest/dark) are the text-safe
// members; DEFAULT shades are the saturated brand/button colours.
section("Acuity Design System (acuity-canon) — brand + semantic families on white, and white on brand");
for (const [name, hex] of Object.entries(ACUITY_CANON)) {
  if (name === "neutrals-white") continue; // white-on-white is trivial (1:1)
  row(`${name} / white`, hex, WHITE);
}
row("white / acuity-blue (primary button)", WHITE, ACUITY_CANON["acuity-blue"]);

// ── One45 (Fahad's temp 2.0) — the one45-fahad token skin (DE-444), reverse-engineered
// from the authed Storybook (ds.acuityinsights.io). Palette ramps [R]: acuityBlue 600
// #364699 (primary), teal 600 #00A59B (accent), slate (neutrals), sky/jade/amber/rose
// (status). Text judged on 4.5; the teal tab indicator + input border are UI elements (3:1).
// Alert tones use ramp-800 text on ramp-50 tints.
section("One45 (Fahad's temp 2.0) [R] — text, accent + UI on white");
row("fg slate-900 / white", "#0F172A", WHITE);
row("muted slate-500 / white", "#64748B", WHITE);
row("primary acuityBlue-600 / white", "#364699", WHITE);
row("white / acuityBlue-600 (button)", WHITE, "#364699");
row("link acuityBlue-600 / white", "#364699", WHITE);
row("teal-600 accent / white", "#00A59B", WHITE, "(tab indicator, 3:1 UI)");
row("input border slate-500 / white", "#64748B", WHITE, "(input border, 3:1 UI; slate-400 fails at 2.56)");
row("badge acuityBlue-800 / acuityBlue-50", "#2E3363", "#EDEEF6");
section("One45 (Fahad's temp 2.0) [R] — alert tones (ramp-800 text on ramp-50 tint)");
row("info sky-800 / sky-50", "#1F3F5C", "#F4FAFF");
row("success jade-800 / jade-50", "#065F46", "#ECFDF5");
row("warning amber-800 / amber-50", "#92400E", "#FFFBEB");
row("error rose-800 / rose-50", "#991B1B", "#FEF2F2");
