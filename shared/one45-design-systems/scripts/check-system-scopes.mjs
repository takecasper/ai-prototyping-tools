// check-system-scopes.mjs — gate guard that every design system owns exactly one
// scoped token block, and no token block is orphaned. Run in `npm run check`.
//
//   Usage:  node shared/one45-design-systems/scripts/check-system-scopes.mjs
//
// The runtime theming mechanism scopes each system's `--ds-*` tokens under a
// `[data-ds="<id>"]` selector (src/styles/tokens.css). If a system is added to the
// SystemId registry without its scope — or a scope is left behind after a rename —
// that system renders unstyled or one system's tokens blur into another's. This
// guard makes that mismatch fail the build instead of shipping silently. It is the
// enforced half of the per-system ownership invariant (the gallery self-check
// covers bridge topology at runtime).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (rel) => readFileSync(resolve(root, rel), "utf8");

// SystemId union members from the registry (the source of truth for system ids).
const systemsSrc = read("src/systems.tsx");
const unionMatch = systemsSrc.match(/export type SystemId\s*=\s*([^;]+);/);
if (!unionMatch) {
  console.error("check-system-scopes: could not find the SystemId union in src/systems.tsx");
  process.exit(1);
}
const registered = [...unionMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

// data-ds scopes declared in the runtime token layer (block comments stripped so
// placeholder selectors in prose — e.g. `[data-ds="X"]` — are not read as systems).
const tokensCss = read("src/styles/tokens.css").replace(/\/\*[\s\S]*?\*\//g, "");
const scoped = [...new Set([...tokensCss.matchAll(/\[data-ds="([^"]+)"\]/g)].map((m) => m[1]))];

const missingScope = registered.filter((id) => !scoped.includes(id));
const orphanScope = scoped.filter((id) => !registered.includes(id));

const problems = [];
for (const id of missingScope) problems.push(`  • system "${id}" is registered (SystemId) but has no [data-ds="${id}"] token block in tokens.css`);
for (const id of orphanScope) problems.push(`  • [data-ds="${id}"] token block exists in tokens.css but "${id}" is not a registered SystemId`);

if (problems.length) {
  console.error("check-system-scopes: design system / token scope mismatch:\n" + problems.join("\n"));
  process.exit(1);
}

console.log(`check-system-scopes: OK — ${registered.length} systems, each owns its [data-ds] token scope (${registered.join(", ")}).`);
