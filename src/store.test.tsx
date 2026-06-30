// store.test.tsx — locks the usage-tracking reset invariant (DE-473).
//
// `used` must reflect ONLY the components rendered by the currently active
// prototype. registerUsed accumulates; switching the active prototype must reset
// the tracked set (both the ref Set and the emitted array) so a prototype's
// "Components missing here" list never leaks pieces from a previously visited
// prototype this session.
//
// The store's tracking core is extracted as a pure factory (createUsageTracker)
// so the accumulate/reset semantics are unit-testable in the node test env without
// a DOM or React-effect harness; the StoreProvider and PrototypesProvider wiring
// consume that same factory.

import { describe, it, expect } from "vitest";
import { createUsageTracker } from "./store";

describe("usage tracker — accumulate then reset (DE-473)", () => {
  it("registers distinct pieces and dedupes repeats", () => {
    const t = createUsageTracker();
    expect(t.register("Button")).toBe(true);
    expect(t.register("Alert")).toBe(true);
    // already present → no change emitted
    expect(t.register("Button")).toBe(false);
    expect(t.list()).toEqual(["Button", "Alert"]);
  });

  it("reset clears the tracked set so later registers start fresh", () => {
    const t = createUsageTracker();
    t.register("Button");
    t.register("Alert");
    expect(t.list().length).toBe(2);

    t.reset();
    expect(t.list()).toEqual([]);

    // After reset a piece counts as new again (it is no longer "used").
    expect(t.register("Badge")).toBe(true);
    expect(t.list()).toEqual(["Badge"]);
    // None of the pre-reset pieces leak into the new prototype's set.
    expect(t.list()).not.toContain("Button");
    expect(t.list()).not.toContain("Alert");
  });
});
