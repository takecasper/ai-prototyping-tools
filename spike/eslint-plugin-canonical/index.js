// eslint-plugin-canonical — the hard lint gate for prototypes.
//
// AGENTS.md is the soft layer (documented rule). This plugin is the hard layer:
// it FAILS the lint check when a prototype screen reaches past the canonical
// puzzle pieces into raw markup. Four rules, all errors:
//
//   no-raw-elements    raw <button>/<img>/<a>/<h1>... must go through <Canonical>
//   no-inline-style    style={{...}} is design-by-inline, banned
//   no-hex-colors      a hex colour literal anywhere is a design escape hatch
//   restrict-classnames  className tokens must be layout-only (allowed prefixes)
//
// ─────────────────────────────────────────────────────────────────────────────
// REVISIT WHEN REAL COMPONENTS LAND  (spike-scoped, provisional)
// ─────────────────────────────────────────────────────────────────────────────
// Everything in CONFIG below encodes the THROWAWAY spike's primitives, not real
// design-system components (which do not exist yet). Each real Acuity design
// system the tool toggles between will ship its OWN component set. When those
// arrive, these lists must be re-derived against them:
//
//   - ALLOWED_RAW_ELEMENTS  the layout wrappers a prototype may still write raw.
//     Today: div/p, the spike's only layout primitives. Real systems may expose
//     their own layout components, shrinking or replacing this list.
//   - ALLOWED_CLASS_PREFIXES  the spike's layout class namespaces (proto__/flow-).
//     Real token/utility conventions will change what a legal className looks like.
//   - CANONICAL_HINTS  the spike's canonical names (Button/Image/Icon/...). The
//     real canonical set is per design system and not yet known.
//
// The rule logic itself does NOT hardcode canonical component names: any
// Capitalized JSX element passes (it is treated as a component, not raw markup),
// so the gate keeps working as the real component catalogue grows. Only the
// three lists below are provisional. Do not let them silently calcify.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // Raw lowercase elements a prototype may still author directly, for layout and
  // spacing only (AGENTS.md "plain wrapper elements"). Everything else lowercase
  // is design markup and must be a <Canonical> piece.
  ALLOWED_RAW_ELEMENTS: new Set(["div", "p"]),

  // className tokens must start with one of these. Blocks Tailwind-style utility
  // classes and arbitrary design classes; permits the spike's layout namespaces.
  ALLOWED_CLASS_PREFIXES: ["proto", "flow"],

  // Lowercase element -> the canonical piece that replaces it. Drives the error
  // message. Spike-scoped names; see banner above.
  CANONICAL_HINTS: {
    button: 'Canonical name="Button"',
    a: 'Canonical name="Link" (or Button for in-app actions)',
    nav: 'Canonical name="Tabs"/"Breadcrumb"',
    img: 'Canonical name="Image"',
    image: 'Canonical name="Image"',
    svg: 'Canonical name="Icon"',
    i: 'Canonical name="Icon"',
    input: 'Canonical name="TextField" (or Checkbox/Radio/Toggle/SearchField)',
    select: 'Canonical name="Select"',
    textarea: 'Canonical name="Textarea"',
    h1: 'Canonical name="Card" (use its title prop)',
    h2: 'Canonical name="Card" (use its title prop)',
    h3: 'Canonical name="Card" (use its title prop)',
    h4: 'Canonical name="Card" (use its title prop)',
    h5: 'Canonical name="Card" (use its title prop)',
    h6: 'Canonical name="Card" (use its title prop)',
    span: 'Canonical name="Badge"',
    table: "a canonical data piece",
    ul: 'Canonical name="Tabs"/"Breadcrumb", or the "flow-list" layout wrapper',
    ol: 'the "flow-list" layout wrapper plus canonical rows',
    li: "a canonical row piece",
  },
};

// #RGB, #RGBA, #RRGGBB, #RRGGBBAA. Word boundary keeps it off icon names like
// "#person" (the chars after # are not all hex).
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;

function classTokenAllowed(token) {
  return CONFIG.ALLOWED_CLASS_PREFIXES.some((prefix) => token.startsWith(prefix));
}

const plugin = {
  meta: { name: "eslint-plugin-canonical", version: "0.0.0" },
  rules: {
    "no-raw-elements": {
      meta: {
        type: "problem",
        docs: { description: "Prototypes build only from <Canonical> pieces, not raw markup." },
        schema: [],
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            const name = node.name;
            // Member (Foo.Bar) and namespaced names are components, not raw DOM.
            if (name.type !== "JSXIdentifier") return;
            const tag = name.name;
            // Capitalized = React component (incl. <Canonical>). Always allowed.
            if (!/^[a-z]/.test(tag)) return;
            if (CONFIG.ALLOWED_RAW_ELEMENTS.has(tag)) return;
            const hint = CONFIG.CANONICAL_HINTS[tag] || "a <Canonical> piece";
            context.report({
              node: name,
              message: `Raw <${tag}> is not allowed in a prototype. Use ${hint} instead. (Allowed raw wrappers: ${[...CONFIG.ALLOWED_RAW_ELEMENTS].join(", ")}, for layout only.)`,
            });
          },
        };
      },
    },

    "no-inline-style": {
      meta: {
        type: "problem",
        docs: { description: "Inline style={{...}} is design-by-inline; use canonical pieces." },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name && node.name.name === "style") {
              context.report({
                node,
                message: "Inline style is not allowed in a prototype. Design comes from canonical pieces, not inline styles.",
              });
            }
          },
        };
      },
    },

    "no-hex-colors": {
      meta: {
        type: "problem",
        docs: { description: "Hex colour literals are a design escape hatch; not allowed in prototypes." },
        schema: [],
      },
      create(context) {
        function check(node, raw) {
          if (typeof raw === "string" && HEX.test(raw)) {
            context.report({
              node,
              message: "Hex colour literal is not allowed in a prototype. Colour comes from the active design system, never a hardcoded hex.",
            });
          }
        }
        return {
          Literal(node) {
            if (typeof node.value === "string") check(node, node.value);
          },
          TemplateElement(node) {
            check(node, node.value && node.value.raw);
          },
        };
      },
    },

    "restrict-classnames": {
      meta: {
        type: "problem",
        docs: { description: "className tokens must be layout-only, from an allowed namespace." },
        schema: [],
      },
      create(context) {
        function checkString(node, value) {
          for (const token of value.split(/\s+/).filter(Boolean)) {
            if (!classTokenAllowed(token)) {
              context.report({
                node,
                message: `className "${token}" is not an allowed layout class. Wrapper classes must start with one of: ${CONFIG.ALLOWED_CLASS_PREFIXES.join(", ")}. Design (colour, type, tokens) belongs in canonical pieces, not utility classes.`,
              });
            }
          }
        }
        return {
          JSXAttribute(node) {
            if (!node.name || node.name.name !== "className" || !node.value) return;
            const v = node.value;
            if (v.type === "Literal" && typeof v.value === "string") {
              checkString(node, v.value);
            } else if (v.type === "JSXExpressionContainer") {
              const expr = v.expression;
              if (expr.type === "Literal" && typeof expr.value === "string") {
                checkString(node, expr.value);
              } else if (expr.type === "TemplateLiteral") {
                for (const quasi of expr.quasis) checkString(node, quasi.value.raw);
              }
            }
          },
        };
      },
    },
  },
};

export default plugin;
