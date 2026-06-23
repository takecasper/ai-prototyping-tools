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
import { pieceStatus } from "./resolver";
import { SPECIMENS } from "./specimens";

let ran = false;

export function runGallerySelfCheck(): void {
  if (ran || !import.meta.env.DEV) return;
  ran = true;

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
