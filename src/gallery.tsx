// gallery.tsx — the Systems-tab canvas: a self-documenting component gallery for
// a design system. It iterates the full CANONICAL catalogue (grouped by slice),
// so every piece appears, always — completeness is structural, never a
// hand-maintained list. Each piece renders through the real resolver (so the
// bridge flags stay correct and honour the annotations toggle), with a status
// chip and its catalogue docs as gallery chrome. An optional compare system adds
// a second column.

import { useEffect } from "react";
import {
  CANONICAL,
  SLICES,
  SYSTEMS,
  type CanonicalDef,
  type CanonicalName,
  type SystemId,
} from "./systems";
import { Canonical, pieceStatus, type PieceStatus } from "./resolver";
import { useStore, type MapRegistry } from "./store";
import { SPECIMENS } from "./specimens";
import { runGallerySelfCheck } from "./gallery-selfcheck";

const CHIP_LABEL: Record<PieceStatus, string> = {
  native: "Native",
  mapped: "Mapped",
  interim: "AI interim",
  substitute: "Substitute",
  none: "Unavailable",
};

const CHIP_MOD: Record<PieceStatus, string> = {
  native: "native",
  mapped: "map",
  interim: "ai",
  substitute: "ai",
  none: "none",
};

function StatusChip({ systemId, name, maps }: { systemId: SystemId; name: CanonicalName; maps: MapRegistry }) {
  const { status, target } = pieceStatus(systemId, name, maps);
  const label = target ? `${CHIP_LABEL[status]} → ${target}` : CHIP_LABEL[status];
  return <span className={`gal__chip gal__chip--${CHIP_MOD[status]}`}>{label}</span>;
}

function Specimen({ name, systemId }: { name: CanonicalName; systemId: SystemId }) {
  const spec = SPECIMENS[name];
  if (typeof spec === "function") return <>{spec(systemId)}</>;
  const node = <Canonical name={name} system={systemId} {...(spec ?? {})} />;
  if (!spec && import.meta.env.DEV) {
    return (
      <>
        {node}
        <span className="gal__needs">needs specimen</span>
      </>
    );
  }
  return node;
}

function GalleryItem({
  def,
  systems,
  maps,
}: {
  def: CanonicalDef;
  systems: SystemId[];
  maps: MapRegistry;
}) {
  return (
    <div className="gal__item">
      <div className="gal__meta">
        <div className="gal__name">{def.label}</div>
        <p className="gal__desc">{def.description}</p>
        <code className="gal__props">{def.props}</code>
        {def.notes ? <p className="gal__notes">{def.notes}</p> : null}
      </div>
      <div className={"gal__cols" + (systems.length > 1 ? " is-compare" : "")}>
        {systems.map((systemId) => (
          <div className="gal__col" key={systemId}>
            <div className="gal__col-head">
              <span className="gal__col-sys">{SYSTEMS[systemId].label}</span>
              <StatusChip systemId={systemId} name={def.name} maps={maps} />
            </div>
            <div className="gal__stage" data-ds={systemId}>
              <Specimen name={def.name} systemId={systemId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SystemGallery({
  systemId,
  compareId,
}: {
  systemId: SystemId;
  compareId: SystemId | null;
}) {
  const { maps } = useStore();
  const systems: SystemId[] = compareId ? [systemId, compareId] : [systemId];

  useEffect(() => {
    runGallerySelfCheck();
  }, []);

  return (
    <div className="gal">
      <header className="gal__head">
        <h1 className="gal__title">{SYSTEMS[systemId].label}</h1>
        <p className="gal__blurb">{SYSTEMS[systemId].blurb}</p>
      </header>

      {SLICES.map((slice) => {
        const pieces = CANONICAL.filter((c) => c.category === slice);
        if (pieces.length === 0) return null;
        return (
          <section className="gal__slice" key={slice}>
            <h2 className="gal__slice-h">{slice}</h2>
            <div className="gal__grid">
              {pieces.map((def) => (
                <GalleryItem key={def.name} def={def} systems={systems} maps={maps} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
