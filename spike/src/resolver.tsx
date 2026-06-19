// resolver.tsx — <Canonical name="Button"> resolves a puzzle piece to the
// ACTIVE system. Outcomes:
//
//   1. native           — the system implements it → render plainly.
//   2. mapped (override) — user mapped the missing piece to an existing one →
//                          render it, subtly tagged (when annotations on).
//   3. AI interim        — missing, no override → Claude Code builds an interim;
//                          render it with a LOUD "AI approx" flag (when
//                          annotations on). A gap is never left broken.
//
// The annotation flags (both the AI flag and the map tag) are gated by the
// store's `annotations` toggle — on for working, off for a clean demo view.

import { useEffect } from "react";
import { SYSTEMS, interimTarget, type CanonicalName } from "./systems";
import { useStore } from "./store";

export function Canonical({
  name,
  ...props
}: { name: CanonicalName } & Record<string, any>) {
  const { systemId, maps, annotations, registerUsed } = useStore();

  useEffect(() => {
    registerUsed(name);
  }, [name, registerUsed]);

  const system = SYSTEMS[systemId];

  // 1. Native.
  const Native = system.skins[name];
  if (Native) return <Native {...props} />;

  // 2. Manual override (saved ground truth).
  const mapped = maps[systemId]?.[name];
  if (mapped && system.skins[mapped]) {
    const Target = system.skins[mapped]!;
    if (!annotations) return <Target {...props} />;
    return (
      <span className="res res--map">
        <Target {...props} />
        <span className="res__tag">↔ {mapped}</span>
      </span>
    );
  }

  // 3. AI interim — Claude Code fills the gap, auto-flagged.
  const interim = interimTarget(systemId);
  if (interim && system.skins[interim]) {
    const Target = system.skins[interim]!;
    if (!annotations) return <Target {...props} />;
    return (
      <span className="res res--ai">
        <Target {...props} />
        <span className="res__tag">AI approx</span>
      </span>
    );
  }

  // Degenerate: the system has no components at all to substitute.
  return (
    <span className="res res--unmapped">
      ⚠ <strong>{name}</strong>: no components available in {system.label}.
    </span>
  );
}
