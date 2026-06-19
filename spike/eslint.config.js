// eslint.config.js — flat config (ESLint 9). The hard lint gate for the
// puzzle-piece rule. Scoped to prototypes only: this gate exists to keep
// prototype screens building from <Canonical> pieces. The spike's own infra
// (resolver, store, overlay, systems) is intentionally NOT linted by it.
//
// Run with `npm run lint`. A violation exits non-zero, which is the gate.

import tsParser from "@typescript-eslint/parser";
import canonical from "./eslint-plugin-canonical/index.js";

export default [
  {
    files: ["src/prototypes/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { canonical },
    rules: {
      "canonical/no-raw-elements": "error",
      "canonical/no-inline-style": "error",
      "canonical/no-hex-colors": "error",
      "canonical/restrict-classnames": "error",
    },
  },
];
