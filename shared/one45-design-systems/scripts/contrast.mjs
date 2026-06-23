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

// ── Acuity (System B) — every family DEFAULT + the shades most likely used as
// fg/bg, measured on white and (for white-on-X buttons) on the colour itself.
const ACUITY = {
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

section("Acuity (System B) — each family DEFAULT on white, and white on it (button case)");
for (const [fam, shades] of Object.entries(ACUITY)) {
  if (fam === "neutrals") continue;
  row(`${fam} DEFAULT / white`, shades.DEFAULT, WHITE);
  row(`white / ${fam} DEFAULT`, WHITE, shades.DEFAULT);
}

section("Acuity neutrals on white (text/border greys)");
for (const k of ["black", "darker", "dark", "DEFAULT", "light"]) row(`neutrals ${k} / white`, ACUITY.neutrals[k], WHITE);

section("Acuity light/lighter shades on white (where used as text — the risk set)");
for (const fam of Object.keys(ACUITY)) {
  if (fam === "neutrals") continue;
  row(`${fam} light / white`, ACUITY[fam].light, WHITE);
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
// (/test/designSystem, 2026-06-22) for Acuity and [D] from _forms.scss for legacy.
// Borders are judged against the 3:1 UI threshold (WCAG 1.4.11), text against 4.5.
section("Acuity form controls [R] — DS .ds-form-input/.ds-form-select on white");
row("input border #949494 / white", "#949494", WHITE, "(border, 3:1 UI) — DS already uses the accessible grey");
row("input text neutrals-darker / white", "#333333", WHITE);
row("error border danger-red / white", "#E40A0A", WHITE, "(border 3:1)");
row("error text danger-red-darkest / white", "#720202", WHITE);
row("success border success-green / white", "#4DA81F", WHITE, "(border 3:1)");
row("focus ring acuity-blue / white", "#364699", WHITE, "(3:1 non-text contrast)");
section("Acuity shell search [R] — Find-a-person field (top-bar)");
row("search text $purple / bg #EBEDF2", "#42507D", "#EBEDF2");
row("focus ring $purple / white", "#42507D", WHITE);

section("one45 legacy form controls [D] — _forms.scss base input");
row("input border #DDD / white", "#DDDDDD", WHITE, "(border fails 3:1 — flagged)");
row("input text #333 / white", "#333333", WHITE);
row("error label #B94A48 / white", "#B94A48", WHITE);
row("legacy button #364699 / white", WHITE, "#364699", "(buttons converged to acuity-blue)");

// ── Navigation slice — tab/link/breadcrumb/pagination pairs. Acuity values are [R]
// from the live DS gallery (/test/designSystem, 2026-06-22) cross-checked to
// tailwind_acuity_theme.js; legacy values are [D] from the legacy skin (themes/one45.scss,
// styles_overwrite.scss, _colors.scss). Tab active-indicator + pagination active-bg are
// judged on the 3:1 UI threshold; tab/link/crumb label text on 4.5.
section("Acuity navigation [R] — Tabs/Link on white (underline-indicator tabs)");
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

// ── Feedback & status slice — Modal. Acuity values are [R] from the live DS gallery
// (/test/designSystem, 2026-06-22, getComputedStyle on the headlessui Dialog panel);
// legacy values are [D] from _bootstrap.scss (.modal / .modal-header). The modal title
// is the only TEXT pair (judged on 4.5); the grey-band-vs-panel and panel-shadow pairs
// are decorative surfaces, reported for completeness, not held to a text threshold.
section("Acuity Modal [R] — headerless dialog, title on the white panel");
row("modal title neutrals-darker / white", "#333333", WHITE, "(23px title on #fff panel)");
section("one45 legacy Modal [D] — title on the grey header band, body on white");
row("modal title $one45_black / band #F5F5F5", "#27304B", "#F5F5F5", "(title on .modal-header band)");
row("modal title $one45_black / white", "#27304B", WHITE, "(same title over the white body)");
row("header band #F5F5F5 / panel #FFFFFF", "#F5F5F5", WHITE, "(decorative band vs panel — not text)");

// ── Feedback & status slice — Alert (native-both). Acuity is a tinted-bg banner: text is
// each semantic family's darkest on its lightest tint [D families / I rendering]. Legacy is
// the real .one45-alert: $one45_black text on the solid pale fills, white on the purple info
// fill [D] (new_branding.scss:65-170). All are body text → judged on the 4.5 threshold.
section("Acuity Alert [D fam / I render] — family darkest text on family lightest tint");
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
row("fg-muted acuity/legacy #5f5f5f / white", "#5F5F5F", WHITE);
row("fg-muted lowfi #6a6a6a / white", "#6A6A6A", WHITE);

// ── Iconography slice (2026-06-23) — the semantic icon TONE colours rendered as the glyph on
// the white canvas. The Icon `tone` prop reuses the --ds-alert-*-accent colours; UNLIKE the
// Alert section (each family's darkest TEXT on its lightest tint, judged 4.5), here the accent
// colour IS the small glyph on white, so it is judged on the 3:1 non-text/UI threshold (WCAG
// 1.4.11). Several warm hues FAIL 3:1 at icon scale — a real, recorded finding: a semantic icon
// must not rely on hue alone, so the tool always pairs it with shape + an altText/adjacent label.
// (Acuity tones [D fam] = tailwind_acuity_theme.js DEFAULT shades; legacy tones [D] = the FA
// alert-icon palette, new_branding.scss:100/119/140/159.)
section("Acuity icon tones [D fam] — semantic accent as the glyph on white (3:1 UI)");
row("success-green DEFAULT / white", "#4DA81F", WHITE, "(icon glyph, 3:1 UI)");
row("warning-yellow DEFAULT / white", "#FCE833", WHITE, "(icon glyph, 3:1 UI)");
row("danger-red DEFAULT / white", "#E40A0A", WHITE, "(icon glyph, 3:1 UI)");
row("information-blue DEFAULT / white", "#1E93BA", WHITE, "(icon glyph, 3:1 UI)");
section("one45 legacy icon tones [D] — FA alert-icon palette as the glyph on white (3:1 UI)");
row("teal_dark / white (success)", "#2FAEA1", WHITE, "(icon glyph, 3:1 UI)");
row("yellow / white (warning)", "#F8B223", WHITE, "(icon glyph, 3:1 UI)");
row("red / white (error)", "#F12F62", WHITE, "(icon glyph, 3:1 UI)");
row("purple_light / white (info)", "#B3B9CB", WHITE, "(icon glyph, 3:1 UI)");

// ── Data display slice (2026-06-23) — Table. Acuity values are [R] from staging (signed in:
// a bare .table inherits Lato 14px #333 / th 700 with NO authored skin; the real marksheet
// admin/pages/marksOverview2.php renders 1px #666 row dividers). Legacy values are [D] from
// the real _tables.scss / _constants.scss skin. Cell TEXT is judged on 4.5; header/cell
// border rules on the 3:1 UI threshold (1.4.11); hover/selected fills are decorative
// surfaces, reported for completeness, not held to a text threshold.
section("Acuity Table [R] — text + dividers on white (the DS ships no table; app reality)");
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
