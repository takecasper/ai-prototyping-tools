// divergence.ts — the per-piece divergence DECISION artifact (DE-468).
//
// The coverage matrix (system-info.tsx) shows the raw per-piece-per-system status.
// This helper turns that same data into a convergence decision: which pieces are
// PROMOTION CANDIDATES — native in some legacy/brand system but only an interim or
// substitute in the canonical target (acuity-canon), so the canonical system should
// adopt a real component rather than keep leaning on the flagged bridge build.
//
// It is PURE: no rendering, no store access. It reads every per-system status from
// the live resolver `pieceStatus`, so the report can never drift from what actually
// renders, and it iterates the full CANONICAL catalogue, so completeness is
// structural — a new piece appears automatically, never via a hand-maintained list.

import { CANONICAL, SYSTEM_IDS, type CanonicalName, type SystemId } from "./systems";
import { pieceStatus, type PieceStatus } from "./resolver";
import type { MapRegistry } from "./store";

// The canonical target every other system is converging toward. A piece that is
// native here needs no promotion; a piece that is interim/substitute here while
// native elsewhere is the convergence-relevant gap.
export const CANON_SYSTEM_ID: SystemId = "acuity-canon";

// One canonical piece, with its resolved status in every system.
export interface PieceDivergence {
  name: CanonicalName;
  perSystem: Record<SystemId, PieceStatus>;
}

// A piece worth promoting into the canonical system: native somewhere else, but
// not yet native in acuity-canon.
export interface PromotionCandidate {
  name: CanonicalName;
  // The canonical system's current (non-native) status for this piece.
  canonStatus: PieceStatus;
  // The systems that already ship a native implementation (the canonical system is
  // never listed — it is the target, and by definition not native here).
  nativeIn: SystemId[];
}

export interface DivergenceReport {
  pieces: PieceDivergence[];
  promotionCandidates: PromotionCandidate[];
}

// Derive the full report from the live resolver. `maps` flows straight through to
// pieceStatus so a user override is reflected here exactly as it is on the canvas.
export function divergenceReport(maps: MapRegistry): DivergenceReport {
  const pieces: PieceDivergence[] = CANONICAL.map((def) => {
    const perSystem = {} as Record<SystemId, PieceStatus>;
    for (const id of SYSTEM_IDS) {
      perSystem[id] = pieceStatus(id, def.name, maps).status;
    }
    return { name: def.name, perSystem };
  });

  const promotionCandidates: PromotionCandidate[] = [];
  for (const piece of pieces) {
    const canonStatus = piece.perSystem[CANON_SYSTEM_ID];
    // Only an UNRESOLVED bridge gap is a promotion candidate. Native means the
    // canonical system already ships it; mapped means the user has consciously
    // resolved the gap to an existing canonical piece — neither needs promotion.
    if (canonStatus !== "interim" && canonStatus !== "substitute") continue;
    const nativeIn = SYSTEM_IDS.filter(
      (id) => id !== CANON_SYSTEM_ID && piece.perSystem[id] === "native",
    );
    // Only a candidate if some OTHER system proves a real implementation exists.
    if (nativeIn.length === 0) continue;
    promotionCandidates.push({ name: piece.name, canonStatus, nativeIn });
  }

  return { pieces, promotionCandidates };
}
