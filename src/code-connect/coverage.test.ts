// coverage.test.ts — locks the Code Connect coverage manifest (DE-422).
// The manifest records, for each CANONICAL piece, its relationship to the
// "Acuity Design system - CANONICAL" Figma library: mapped to a real component,
// a coverage gap (the canonical system ships none → bridged), or unresolved
// (the system has it but its Figma node was not located this pass). These
// invariants keep it honest: no fabricated canonical names, real Figma component
// keys, three disjoint buckets, and every canonical piece classified.
import { describe, it, expect } from "vitest";
import { CANONICAL } from "../systems";
import {
  CODE_CONNECT_MAPPINGS,
  CANONICAL_FIGMA_GAPS,
  CANONICAL_FIGMA_UNRESOLVED,
  mappedCanonicalNames,
} from "./coverage";

const canonicalNames = new Set(CANONICAL.map((c) => c.name));

describe("Code Connect coverage manifest (DE-422)", () => {
  it("every mapping targets a real CanonicalName (no fabricated pieces)", () => {
    for (const m of CODE_CONNECT_MAPPINGS) {
      expect(canonicalNames.has(m.canonical)).toBe(true);
    }
  });

  it("every mapping records a real Figma component key (40-hex) + name", () => {
    for (const m of CODE_CONNECT_MAPPINGS) {
      expect(m.figmaComponentKey).toMatch(/^[0-9a-f]{40}$/);
      expect(m.figmaComponentName.length).toBeGreaterThan(0);
    }
  });

  it("at most one mapping per canonical name", () => {
    const seen = new Set<string>();
    for (const m of CODE_CONNECT_MAPPINGS) {
      expect(seen.has(m.canonical)).toBe(false);
      seen.add(m.canonical);
    }
  });

  it("gaps and unresolved are real canonical names", () => {
    for (const name of [...CANONICAL_FIGMA_GAPS, ...CANONICAL_FIGMA_UNRESOLVED]) {
      expect(canonicalNames.has(name)).toBe(true);
    }
  });

  it("the three buckets are pairwise disjoint", () => {
    const mapped = new Set<string>(mappedCanonicalNames());
    const gaps = new Set<string>(CANONICAL_FIGMA_GAPS);
    const unresolved = new Set<string>(CANONICAL_FIGMA_UNRESOLVED);
    for (const name of mapped) {
      expect(gaps.has(name)).toBe(false);
      expect(unresolved.has(name)).toBe(false);
    }
    for (const name of gaps) expect(unresolved.has(name)).toBe(false);
  });

  it("every canonical piece is classified (mapped | gap | unresolved)", () => {
    const mapped = new Set<string>(mappedCanonicalNames());
    const gaps = new Set<string>(CANONICAL_FIGMA_GAPS);
    const unresolved = new Set<string>(CANONICAL_FIGMA_UNRESOLVED);
    for (const name of canonicalNames) {
      const seen = mapped.has(name) || gaps.has(name) || unresolved.has(name);
      expect(seen, `${name} is unclassified`).toBe(true);
    }
  });
});
