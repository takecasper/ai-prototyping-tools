// gallery-selfcheck.ts — a cheap DEV-only guard that the galleries stay honest as
// design systems are built out. It runs once when a gallery mounts in dev and
// console.warns if:
//
//   1. a canonical piece resolves to "none" in some system (the system can render
//      nothing for it — a real breakage the gallery would otherwise show as a
//      degenerate ⚠ box), or
//   2. a canonical piece has no specimen (it still appears, but renders bare).
//
// This is the lightweight stand-in for a unit test in a project with no test
// runner. TypeScript already prevents stale SPECIMENS / CanonicalDef keys at
// compile time; this catches the runtime wiring the types can't.

import { CANONICAL, SYSTEM_IDS, SYSTEMS } from "./systems";
import { pieceStatus, type PieceStatus } from "./resolver";
import { SPECIMENS } from "./specimens";

let ran = false;

// The sourced bridge topology these slices enshrined — the resolver must keep
// matching reality (shared/one45-design-systems/03 §4d/§4e). Each entry is the
// status a piece MUST resolve to in a given system; a mismatch is a sourcing
// regression the gallery would otherwise paint as if it were correct.
//   Alert   native-both (one45-2020s DS component + legacy .one45-alert) → lowfi bridge.
//   Badge   one45-2020s-only (legacy has no status badge) → legacy + lowfi bridge.
//   Avatar  legacy-only (the Acuity DS ships no avatar) → native legacy + lowfi, one45-2020s
//           bridge (INTERIM_BUILDS) — the Breadcrumb mirror.
//   List    no DS-component piece (neither DS ships a List) → native-minimal one45-2020s,
//           native legacy (.list-widget) + lowfi, acuity-canon bridge (INTERIM_BUILDS) — the
//           Table mirror.
const TOPOLOGY: Array<{ name: "Alert" | "Badge" | "Avatar" | "Breadcrumb" | "List"; system: (typeof SYSTEM_IDS)[number]; expect: PieceStatus }> = [
  { name: "Alert", system: "one45-2020s", expect: "native" },
  { name: "Alert", system: "one45-legacy", expect: "native" },
  { name: "Alert", system: "lowfi", expect: "interim" },
  { name: "Badge", system: "one45-2020s", expect: "native" },
  { name: "Badge", system: "one45-legacy", expect: "substitute" },
  { name: "Badge", system: "lowfi", expect: "substitute" },
  { name: "Avatar", system: "one45-2020s", expect: "interim" },
  { name: "Avatar", system: "one45-legacy", expect: "native" },
  { name: "Avatar", system: "lowfi", expect: "native" },
  { name: "Alert", system: "acuity-canon", expect: "native" },
  { name: "Badge", system: "acuity-canon", expect: "native" },
  { name: "Avatar", system: "acuity-canon", expect: "interim" },
  { name: "Breadcrumb", system: "acuity-canon", expect: "interim" },
  { name: "List", system: "one45-2020s", expect: "native" },
  { name: "List", system: "one45-legacy", expect: "native" },
  { name: "List", system: "lowfi", expect: "native" },
  { name: "List", system: "acuity-canon", expect: "interim" },
];

export function runGallerySelfCheck(): void {
  if (ran || !import.meta.env.DEV) return;
  ran = true;

  for (const { name, system, expect } of TOPOLOGY) {
    const { status } = pieceStatus(system, name, {});
    if (status !== expect) {
      console.warn(
        `[gallery] sourcing regression: "${name}" resolves to "${status}" in ` +
          `${SYSTEMS[system].label}, expected "${expect}" (see shared/one45-design-systems/03 §4d/§4e).`,
      );
    }
  }

  for (const def of CANONICAL) {
    for (const systemId of SYSTEM_IDS) {
      const { status } = pieceStatus(systemId, def.name, {});
      if (status === "none") {
        console.warn(
          `[gallery] "${def.name}" resolves to nothing in ${SYSTEMS[systemId].label} — ` +
            `the system has no native, mapped, or interim build for it.`,
        );
      }
    }
    if (!(def.name in SPECIMENS)) {
      console.warn(
        `[gallery] "${def.name}" has no specimen in specimens.tsx — it renders bare. ` +
          `Add one so the gallery documents it well.`,
      );
    }
  }
}
