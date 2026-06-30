// system-info.tsx — the right-hand panel while a system gallery is on the canvas.
// It replaces ControlOverlay (which is prototype-scoped). It shows the viewed
// system's blurb, a coverage matrix across all systems, the annotations toggle
// (reused from the store, so gallery flags still toggle), and a "Compare to"
// selector that drives the gallery's second column.

import { useEffect, useRef } from "react";
import { CANONICAL, SYSTEMS, SYSTEM_IDS, type SystemId } from "./systems";
import { pieceStatus, type PieceStatus } from "./resolver";
import { divergenceReport, CANON_SYSTEM_ID } from "./divergence";
import { useStore } from "./store";
import { useView } from "./view";

// Compact cell glyph per resolution outcome for the coverage matrix.
const CELL: Record<PieceStatus, { glyph: string; cls: string; title: string }> = {
  native: { glyph: "●", cls: "is-native", title: "Native" },
  mapped: { glyph: "↔", cls: "is-map", title: "Mapped" },
  interim: { glyph: "~", cls: "is-ai", title: "AI interim" },
  substitute: { glyph: "~", cls: "is-ai", title: "Substitute" },
  none: { glyph: "·", cls: "is-none", title: "Unavailable" },
};

// Coverage-matrix legend rows — one per line, each glyph coloured to match the
// matrix cells via the shared is-* colour classes. interim/substitute share a row.
const LEGEND: { glyph: string; cls: string; label: string }[] = [
  { glyph: CELL.native.glyph, cls: "is-native", label: "native" },
  { glyph: CELL.mapped.glyph, cls: "is-map", label: "mapped" },
  { glyph: CELL.interim.glyph, cls: "is-ai", label: "AI interim / substitute" },
  { glyph: CELL.none.glyph, cls: "is-none", label: "unavailable" },
];

export function SystemInfo({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const { maps, annotations, setAnnotations } = useStore();
  const { viewedSystemId, compareSystemId, setCompareSystem } = useView();

  if (!viewedSystemId) return null;
  const system = SYSTEMS[viewedSystemId];
  const nativeCount = CANONICAL.filter((c) => system.skins[c.name]).length;

  // Promotion candidates: pieces native in another system but still an unresolved
  // bridge build in the canonical system. Derived from the same resolver the matrix
  // and the canvas read, so it cannot drift from what renders.
  const { promotionCandidates } = divergenceReport(maps);

  return (
    <div className="ov" role="region" aria-label="System controls" tabIndex={-1} ref={panelRef}>
      <div className="ov__head">
        <h2 className="panel__title">System</h2>
        <button className="ov__x" onClick={onClose} aria-label="Close controls (esc or /)">
          esc or /
        </button>
      </div>

      <section className="ov__sec">
        <h3 className="ov__h">{system.label}</h3>
        <p className="ov__blurb">{system.blurb}</p>
        <p className="ov__label">
          Coverage: {nativeCount} of {CANONICAL.length} canonical pieces native
        </p>
      </section>

      <section className="ov__sec">
        <h3 className="ov__h">Compare to</h3>
        <select
          className="ov__select ov__select--compare"
          aria-label="Compare to"
          value={compareSystemId ?? ""}
          onChange={(e) => setCompareSystem(e.target.value ? (e.target.value as SystemId) : null)}
        >
          <option value="">No comparison (this system only)</option>
          {SYSTEM_IDS.filter((id) => id !== viewedSystemId).map((id) => (
            <option key={id} value={id}>
              {SYSTEMS[id].label}
            </option>
          ))}
        </select>

        <label className="ov__toggle">
          <input
            type="checkbox"
            checked={annotations}
            onChange={(e) => setAnnotations(e.target.checked)}
          />
          Flag interim and mapped components
        </label>
      </section>

      <section className="ov__sec">
        <h3 className="ov__h">Coverage matrix</h3>
        <table className="mtx">
          <thead>
            <tr>
              <th className="mtx__corner">Component</th>
              {SYSTEM_IDS.map((id) => (
                <th key={id} className={id === viewedSystemId ? "is-viewed" : ""} title={SYSTEMS[id].label}>
                  {id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CANONICAL.map((def) => (
              <tr key={def.name}>
                <td className="mtx__name">{def.name}</td>
                {SYSTEM_IDS.map((id) => {
                  const { status } = pieceStatus(id, def.name, maps);
                  const cell = CELL[status];
                  return (
                    <td
                      key={id}
                      className={"mtx__cell " + cell.cls + (id === viewedSystemId ? " is-viewed" : "")}
                      title={cell.title}
                    >
                      {cell.glyph}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="mtx__legend">
          {LEGEND.map((item) => (
            <li className="mtx__legend-item" key={item.cls}>
              <span className={"mtx__key " + item.cls} aria-hidden="true">
                {item.glyph}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <p className="ov__foot">
          Native pieces render plainly; every bridged piece is flagged on the canvas while
          annotations are on.
        </p>
      </section>

      <section className="ov__sec">
        <h3 className="ov__h">Promotion candidates</h3>
        <p className="ov__foot">
          Pieces native in another system but still a flagged bridge build in{" "}
          {SYSTEMS[CANON_SYSTEM_ID].label} — the canonical system should adopt a real
          component for each.
        </p>
        {promotionCandidates.length === 0 ? (
          <p className="dvg__empty">
            No candidates: every divergent piece is already native or mapped in{" "}
            {SYSTEMS[CANON_SYSTEM_ID].label}.
          </p>
        ) : (
          <ul className="dvg">
            {promotionCandidates.map((c) => (
              <li className="dvg__item" key={c.name}>
                <div className="dvg__row">
                  <span className="dvg__name">{c.name}</span>
                  <span className="dvg__canon is-ai" title={`Status in ${SYSTEMS[CANON_SYSTEM_ID].label}`}>
                    {c.canonStatus}
                  </span>
                </div>
                <div className="dvg__native">
                  native in{" "}
                  {c.nativeIn.map((id, i) => (
                    <span className="dvg__sys is-native" key={id}>
                      {SYSTEMS[id].label}
                      {i < c.nativeIn.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
