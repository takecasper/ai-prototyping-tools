// check-system-coverage.mjs — gate guard that every registered design system
// covers every CANONICAL piece: either a native skin, or a bridge path
// (an INTERIM_BUILDS entry, or — as a last resort — a first-native substitute).
// A piece that would resolve to "none" (no skin, no bridge) fails the build.
// Static-parses src/systems.tsx (node cannot import TSX), like check-system-scopes.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const src = readFileSync(resolve(root, "src/systems.tsx"), "utf8");

// CANONICAL piece names from the CanonicalName union.
// We match from `export type CanonicalName` up to the next `export type` declaration
// rather than stopping at `;` (which appears inside inline comments inside the union).
const nameUnion = src.match(/export type CanonicalName\s*=([\s\S]*?)(?=\nexport type )/);
if (!nameUnion) { console.error("check-system-coverage: CanonicalName union not found"); process.exit(1); }
const canonical = [...nameUnion[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

// INTERIM_BUILDS keys (bridge can build these in any system).
const interimBlock = src.match(/INTERIM_BUILDS[^{]*\{([\s\S]*?)\}/);
const interim = interimBlock ? [...interimBlock[1].matchAll(/(\w+)\s*:/g)].map((m) => m[1]) : [];

// Each system's skins object: the keys it provides natively. Match each
// `"<id>": { ... skins: { ... } }` entry inside the SYSTEMS record.
//
// NOTE: The brief's `([\s\S]*?);` regex for CanonicalName stops at the first
// semicolon inside an inline comment. Fixed above. The brief's skinsRe
// `([\s\S]*?)\},?\s*\}` could also stop at the wrong `}` inside a multi-key
// skins block (e.g. acuity-canon's 14 explicit adapters). Fixed below with
// brace-depth counting instead of a non-greedy regex.
const systemsBlock = src.match(/export const SYSTEMS[^{]*\{([\s\S]*?)\n\};/);
if (!systemsBlock) { console.error("check-system-coverage: SYSTEMS record not found"); process.exit(1); }

// Parse each system by finding its id and then the skins: { … } content.
// We count brace depth rather than relying on a non-greedy regex that stops
// at the wrong `}` inside nested blocks.
const blockText = systemsBlock[1];
const systems = [];

// Find positions of `skins:` inside each system entry by matching the
// `"<id>": { ... skins:` pattern (non-greedy — stops at the FIRST skins:
// which is always the right one since each system has exactly one).
const idRe = /["']?([\w-]+)["']?\s*:\s*\{[\s\S]*?skins\s*:/g;
let idMatch;
const sysPositions = [];
while ((idMatch = idRe.exec(blockText)) !== null) {
  sysPositions.push({ id: idMatch[1].replace(/["']/g, ""), skinsAt: idMatch.index + idMatch[0].length });
}

for (const pos of sysPositions) {
  // Starting right after `skins:`, find the opening `{` then count brace depth.
  let i = pos.skinsAt;
  while (i < blockText.length && blockText[i] !== "{") i++;
  if (i >= blockText.length) continue;
  let depth = 0;
  let start = i;
  let end = i;
  for (; i < blockText.length; i++) {
    if (blockText[i] === "{") depth++;
    else if (blockText[i] === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  const body = blockText.slice(start + 1, end);
  // Explicit PascalCase keys (CanonicalName-shaped keys).
  const explicit = [...body.matchAll(/\b([A-Z]\w+)\s*:/g)].map((x) => x[1]);
  // Spread groups e.g. `...FORM_CONTROLS`.
  const spreads = [...body.matchAll(/\.\.\.(\w+)/g)].map((x) => x[1]);
  systems.push({ id: pos.id, explicit, spreads, body });
}

// Resolve spread group memberships (FORM_CONTROLS, NAV_CONTROLS, FEEDBACK_CONTROLS,
// DATA_DISPLAY) by reading their const definitions.
const groupKeys = (groupName) => {
  const g = src.match(new RegExp(`const ${groupName}\\s*=\\s*\\{([\\s\\S]*?)\\}`));
  return g ? [...g[1].matchAll(/(\b[A-Z]\w+)\b/g)].map((x) => x[1]).filter((k) => canonical.includes(k)) : [];
};

const problems = [];
const hasAnyNative = (sys) => sys.explicit.length > 0 || sys.spreads.length > 0;
for (const sys of systems) {
  const native = new Set(sys.explicit.filter((k) => canonical.includes(k)));
  for (const grp of sys.spreads) groupKeys(grp).forEach((k) => native.add(k));
  for (const piece of canonical) {
    const ok = native.has(piece) || interim.includes(piece) || hasAnyNative(sys); // first-native substitute exists if the system has ANY skin
    if (!ok) problems.push(`  • system "${sys.id}" cannot resolve "${piece}" (no skin, no INTERIM_BUILDS, no native to substitute)`);
  }
}

if (problems.length) {
  console.error("check-system-coverage: a system cannot resolve a canonical piece:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`check-system-coverage: OK — ${systems.length} systems each cover all ${canonical.length} canonical pieces (native or bridged).`);
