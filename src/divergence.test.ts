// divergence.test.ts — locks the per-piece divergence helper (DE-468).
//
// divergenceReport is the PURE delta-derivation behind the Systems-view
// Divergence report chrome. It must:
//   1. cover EVERY canonical piece across EVERY system (structural completeness —
//      iterates CANONICAL, never a hand-maintained list);
//   2. read its per-system status from the live resolver (pieceStatus), so it can
//      never drift from what actually renders;
//   3. surface promotion candidates — pieces native in some other system but only
//      interim/substitute (not native) in acuity-canon, the canonical target.

import { describe, it, expect } from "vitest";
import { divergenceReport } from "./divergence";
import { pieceStatus } from "./resolver";
import { CANONICAL, SYSTEM_IDS } from "./systems";
import type { MapRegistry } from "./store";

const NO_MAPS: MapRegistry = {};

describe("divergenceReport — structural completeness", () => {
  it("covers every canonical piece, every system", () => {
    const { pieces } = divergenceReport(NO_MAPS);
    expect(pieces).toHaveLength(CANONICAL.length);
    for (const p of pieces) {
      expect(Object.keys(p.perSystem).sort()).toEqual([...SYSTEM_IDS].sort());
    }
  });

  it("per-system status matches the live resolver exactly (cannot drift)", () => {
    const { pieces } = divergenceReport(NO_MAPS);
    for (const def of CANONICAL) {
      const row = pieces.find((p) => p.name === def.name)!;
      for (const id of SYSTEM_IDS) {
        expect(row.perSystem[id]).toBe(pieceStatus(id, def.name, NO_MAPS).status);
      }
    }
  });
});

describe("divergenceReport — promotion candidates", () => {
  it("flags Table: native in one45-legacy but interim in acuity-canon", () => {
    // Real values: Table is native in lowfi/one45-2020s/one45-legacy, but the ADS
    // package ships no table → acuity-canon resolves it as a flagged interim. So it
    // is a promotion candidate: the canonical system should adopt a real Table.
    expect(pieceStatus("one45-legacy", "Table", NO_MAPS).status).toBe("native");
    expect(pieceStatus("acuity-canon", "Table", NO_MAPS).status).toBe("interim");

    const { promotionCandidates } = divergenceReport(NO_MAPS);
    const table = promotionCandidates.find((c) => c.name === "Table");
    expect(table).toBeTruthy();
    expect(table!.canonStatus).toBe("interim");
    expect(table!.nativeIn).toContain("one45-legacy");
    expect(table!.nativeIn).toContain("one45-2020s");
    // acuity-canon is the target, never listed as a place it is already native.
    expect(table!.nativeIn).not.toContain("acuity-canon");
  });

  it("flags Breadcrumb and Avatar: native in legacy, interim in acuity-canon", () => {
    const { promotionCandidates } = divergenceReport(NO_MAPS);
    const names = promotionCandidates.map((c) => c.name);
    expect(names).toContain("Breadcrumb");
    expect(names).toContain("Avatar");
    const crumb = promotionCandidates.find((c) => c.name === "Breadcrumb")!;
    expect(crumb.nativeIn).toContain("one45-legacy");
    expect(crumb.canonStatus).not.toBe("native");
  });

  it("does NOT flag a piece native in acuity-canon (e.g. Button)", () => {
    expect(pieceStatus("acuity-canon", "Button", NO_MAPS).status).toBe("native");
    const { promotionCandidates } = divergenceReport(NO_MAPS);
    expect(promotionCandidates.map((c) => c.name)).not.toContain("Button");
  });

  it("does NOT flag a piece that is non-native everywhere it diverges but never native elsewhere", () => {
    // Badge is native in one45-2020s + acuity-canon. Since it IS native in the
    // canonical system, it is not a promotion candidate regardless of legacy/lowfi.
    expect(pieceStatus("acuity-canon", "Badge", NO_MAPS).status).toBe("native");
    const { promotionCandidates } = divergenceReport(NO_MAPS);
    expect(promotionCandidates.map((c) => c.name)).not.toContain("Badge");
  });

  it("a user map to a native target in acuity-canon removes the promotion pressure", () => {
    // If the user maps Table → a piece acuity-canon ships natively, acuity-canon's
    // status becomes "mapped" (not interim/substitute), so it is no longer an
    // unresolved promotion candidate.
    const maps: MapRegistry = { "acuity-canon": { Table: "Card" } };
    expect(pieceStatus("acuity-canon", "Table", maps).status).toBe("mapped");
    const { promotionCandidates } = divergenceReport(maps);
    expect(promotionCandidates.map((c) => c.name)).not.toContain("Table");
  });
});
