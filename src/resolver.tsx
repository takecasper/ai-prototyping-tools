// resolver.tsx — <Canonical name="Button"> resolves a puzzle piece to a design
// system. By default that is the store's ACTIVE system (how prototypes render);
// the Systems-tab gallery passes an explicit `system` to resolve against any
// system without changing the prototype's active one. Outcomes:
//
//   1. native           — the system implements it → render plainly.
//   2. mapped (override) — user mapped the missing piece to an existing one →
//                          render it, subtly tagged (when annotations on).
//   3. interim/substitute — missing, no override → Claude Code builds an interim
//                          (INTERIM_BUILDS) or substitutes the first native piece;
//                          render it with a LOUD "AI approx" flag (annotations on).
//   4. none              — degenerate: the system has no components at all.
//
// `pieceStatus` is the pure classifier (no render, no store) shared by the
// resolver, the gallery's status chips, the coverage matrix, and the dev
// self-check. The annotation flags are gated by the store's `annotations` toggle.

import { useEffect, type ReactNode } from "react";
import {
  CANONICAL,
  SYSTEMS,
  interimTarget,
  INTERIM_BUILDS,
  type CanonicalName,
  type SystemId,
} from "./systems";
import { useStore, type MapRegistry } from "./store";

export type PieceStatus = "native" | "mapped" | "interim" | "substitute" | "none";

// Pure: how many of the CANONICAL catalogue a system ships natively (everything
// else bridges to a flagged interim/substitute). Derived from pieceStatus with
// empty maps so the count can never drift from the resolver's own classifier or
// be hand-maintained — adding a piece to CANONICAL updates it automatically. Used
// by the Controls picker to surface a system's real authoring-time coverage.
const NO_MAPS: MapRegistry = {};
export function nativeCount(systemId: SystemId): number {
  return CANONICAL.filter(
    (c) => pieceStatus(systemId, c.name, NO_MAPS).status === "native",
  ).length;
}

// Pure: which outcome a piece resolves to in a given system, and (for mapped /
// substitute) the target piece. No rendering, no store access — safe to call in
// loops (gallery, matrix, self-check).
export function pieceStatus(
  systemId: SystemId,
  name: CanonicalName,
  maps: MapRegistry,
): { status: PieceStatus; target?: CanonicalName } {
  const system = SYSTEMS[systemId];
  if (system.skins[name]) return { status: "native" };

  const mapped = maps[systemId]?.[name];
  if (mapped && system.skins[mapped]) return { status: "mapped", target: mapped };

  if (INTERIM_BUILDS[name]) return { status: "interim" };

  const interim = interimTarget(systemId);
  if (interim && system.skins[interim]) return { status: "substitute", target: interim };

  return { status: "none" };
}

// Pure render of a piece in a given system, applying the bridge flags gated by
// `annotations`. Shared by <Canonical> (active system) and the gallery (explicit
// system). The flag behaviour is the bridge invariant — keep it in this one place.
export function renderPiece(
  systemId: SystemId,
  name: CanonicalName,
  props: Record<string, any>,
  opts: { maps: MapRegistry; annotations: boolean },
): ReactNode {
  const system = SYSTEMS[systemId];
  const { status, target } = pieceStatus(systemId, name, opts.maps);

  switch (status) {
    case "native": {
      const Native = system.skins[name]!;
      return <Native {...props} />;
    }
    case "mapped": {
      const Target = system.skins[target!]!;
      if (!opts.annotations) return <Target {...props} />;
      return (
        <span className="res res--map">
          <Target {...props} />
          <span className="res__tag">↔ {target}</span>
        </span>
      );
    }
    case "interim": {
      const Build = INTERIM_BUILDS[name]!;
      if (!opts.annotations) return <Build {...props} />;
      return (
        <span className="res res--ai">
          <Build {...props} />
          <span className="res__tag">AI approx</span>
        </span>
      );
    }
    case "substitute": {
      const Target = system.skins[target!]!;
      if (!opts.annotations) return <Target {...props} />;
      return (
        <span className="res res--ai">
          <Target {...props} />
          <span className="res__tag">AI approx</span>
        </span>
      );
    }
    default:
      return (
        <span className="res res--unmapped">
          ⚠ <strong>{name}</strong>: no components available in {system.label}.
        </span>
      );
  }
}

export function Canonical({
  name,
  system,
  ...props
}: { name: CanonicalName; system?: SystemId } & Record<string, any>) {
  const { systemId, maps, annotations, registerUsed } = useStore();
  const effective = system ?? systemId;

  // Only track usage when rendering in the prototype's active system (no explicit
  // `system`). The gallery renders every piece against an arbitrary system and
  // must not pollute the prototype's `used` set (which drives the Controls bridge
  // list and the divergence readout).
  useEffect(() => {
    if (!system) registerUsed(name);
  }, [name, registerUsed, system]);

  return renderPiece(effective, name, props, { maps, annotations });
}
