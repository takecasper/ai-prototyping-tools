// resolver.test.tsx — locks the bridge invariant (DE-470).
//
// Two things are load-bearing and must never silently drift:
//   1. pieceStatus — the pure classifier: native / mapped / interim / substitute / none.
//   2. renderPiece — the annotation-gated flags: OFF = plain everywhere; ON = AI-approx on
//      interim+substitute, ↔ tag on mapped, and native NEVER flagged.
//
// renderPiece output is asserted as static markup (react-dom/server) so no DOM/jsdom is
// needed. Only token-driven systems with simple skins are rendered here (lowfi / legacy) —
// pieceStatus itself is pure and is checked across every system without rendering.

import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { pieceStatus, renderPiece, nativeCount } from "./resolver";
import { CANONICAL, SYSTEM_IDS, interimTarget } from "./systems";
import type { MapRegistry } from "./store";

const NO_MAPS: MapRegistry = {};
const markup = (node: ReturnType<typeof renderPiece>) => renderToStaticMarkup(node as any);

describe("pieceStatus — the pure classifier", () => {
  it("native: a system that ships the piece", () => {
    expect(pieceStatus("lowfi", "Button", NO_MAPS).status).toBe("native");
    expect(pieceStatus("one45-2020s", "Alert", NO_MAPS).status).toBe("native");
    expect(pieceStatus("one45-legacy", "Alert", NO_MAPS).status).toBe("native");
    expect(pieceStatus("acuity-canon", "Badge", NO_MAPS).status).toBe("native");
    // Accordion is native in all three non-canon systems (legacy collapsibleHeaders,
    // 2020s react-bootstrap Accordion, lowfi sketch); only the ADS package ships none.
    expect(pieceStatus("one45-legacy", "Accordion", NO_MAPS).status).toBe("native");
    expect(pieceStatus("one45-2020s", "Accordion", NO_MAPS).status).toBe("native");
    expect(pieceStatus("lowfi", "Accordion", NO_MAPS).status).toBe("native");
  });

  it("interim: missing piece with an INTERIM_BUILDS entry", () => {
    // lowfi ships no Alert; Alert is in INTERIM_BUILDS → a flagged self-build.
    expect(pieceStatus("lowfi", "Alert", NO_MAPS).status).toBe("interim");
    // acuity-canon ships no Table; Table is in INTERIM_BUILDS.
    expect(pieceStatus("acuity-canon", "Table", NO_MAPS).status).toBe("interim");
    // acuity-canon ships no Accordion (the ADS package exports none) → bridge interim.
    expect(pieceStatus("acuity-canon", "Accordion", NO_MAPS).status).toBe("interim");
  });

  it("substitute: missing piece with NO INTERIM_BUILDS entry → first-native fallback", () => {
    // Badge is acuity-only; legacy/lowfi have no Badge and no INTERIM_BUILDS.Badge.
    const legacy = pieceStatus("one45-legacy", "Badge", NO_MAPS);
    expect(legacy.status).toBe("substitute");
    expect(legacy.target).toBeTruthy();
  });

  it("mapped: a saved user override to a piece the system ships", () => {
    const maps: MapRegistry = { "one45-legacy": { Badge: "Button" } };
    const r = pieceStatus("one45-legacy", "Badge", maps);
    expect(r.status).toBe("mapped");
    expect(r.target).toBe("Button");
  });

  it("mapped only wins when the target is native in that system", () => {
    // Map Badge → a target legacy does NOT ship: falls through to substitute, never "mapped".
    const maps: MapRegistry = { "one45-legacy": { Badge: "Avatar" } };
    // Avatar IS native in legacy, so this would be mapped; use a piece legacy lacks instead.
    expect(pieceStatus("one45-legacy", "Badge", maps).status).toBe("mapped");
    const bad: MapRegistry = { "one45-legacy": { Badge: "Badge" } };
    expect(pieceStatus("one45-legacy", "Badge", bad).status).toBe("substitute");
  });

  it("none is unreachable for real systems (every system has a first-native target)", () => {
    // The degenerate 'none' only fires when interimTarget yields nothing. Guard that this
    // cannot happen for any shipped system, so 'none' stays a true dead-end, not a silent gap.
    for (const id of SYSTEM_IDS) {
      expect(interimTarget(id)).toBeTruthy();
    }
  });
});

describe("nativeCount — coverage derived from pieceStatus over CANONICAL", () => {
  it("counts only pieces a system ships natively (empty maps, no bridge interims)", () => {
    // Derived from the catalogue, never hand-maintained. The canonical Acuity
    // Design System ships no Toggle / SearchField / Breadcrumb / Table / Avatar /
    // Image / List / Accordion (8 pieces) → those bridge to flagged interims, not native.
    expect(nativeCount("acuity-canon")).toBe(14);
    // one45 legacy is the most complete — it lacks only Badge.
    expect(nativeCount("one45-legacy")).toBe(21);
    // lowfi lacks Badge + Alert; one45-2020s lacks Breadcrumb + Avatar.
    expect(nativeCount("lowfi")).toBe(20);
    expect(nativeCount("one45-2020s")).toBe(20);
  });

  it("never exceeds the catalogue size and agrees with pieceStatus", () => {
    for (const id of SYSTEM_IDS) {
      const n = nativeCount(id);
      expect(n).toBeLessThanOrEqual(CANONICAL.length);
      const byHand = CANONICAL.filter(
        (c) => pieceStatus(id, c.name, {}).status === "native",
      ).length;
      expect(n).toBe(byHand);
    }
  });
});

describe("renderPiece — annotation-gated flag invariant", () => {
  it("native is NEVER flagged, annotations on or off", () => {
    const on = markup(renderPiece("lowfi", "Button", { children: "Go" }, { maps: NO_MAPS, annotations: true }));
    const off = markup(renderPiece("lowfi", "Button", { children: "Go" }, { maps: NO_MAPS, annotations: false }));
    expect(on).not.toContain("res--");
    expect(off).not.toContain("res--");
  });

  it("interim: flagged AI-approx when on, plain when off", () => {
    const on = markup(renderPiece("lowfi", "Alert", { children: "Hi" }, { maps: NO_MAPS, annotations: true }));
    expect(on).toContain("res--ai");
    expect(on).toContain("AI approx");
    const off = markup(renderPiece("lowfi", "Alert", { children: "Hi" }, { maps: NO_MAPS, annotations: false }));
    expect(off).not.toContain("res--");
  });

  it("substitute: flagged AI-approx when on, plain when off", () => {
    const on = markup(renderPiece("one45-legacy", "Badge", { children: "New" }, { maps: NO_MAPS, annotations: true }));
    expect(on).toContain("res--ai");
    expect(on).toContain("AI approx");
    const off = markup(renderPiece("one45-legacy", "Badge", { children: "New" }, { maps: NO_MAPS, annotations: false }));
    expect(off).not.toContain("res--");
  });

  it("mapped: ↔ target tag when on, plain when off", () => {
    const maps: MapRegistry = { "one45-legacy": { Badge: "Button" } };
    const on = markup(renderPiece("one45-legacy", "Badge", { children: "New" }, { maps, annotations: true }));
    expect(on).toContain("res--map");
    expect(on).toContain("↔ Button");
    const off = markup(renderPiece("one45-legacy", "Badge", { children: "New" }, { maps, annotations: false }));
    expect(off).not.toContain("res--");
  });
});
