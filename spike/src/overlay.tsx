// overlay.tsx — the "/" control panel, organised into: Design System, then
// System Divergence with the Component Bridge nested under it (the two are
// related — divergence is what the bridge resolves). No "Ask Claude" button —
// the tool runs in Claude Code, so gaps are filled by Claude Code building an
// interim (auto-flagged). The user's action here is to OVERRIDE that interim by
// mapping the missing piece to an existing component, or revert to the interim.

import { useEffect, useRef } from "react";
import { CANONICAL, SYSTEMS, SYSTEM_IDS, interimTarget, type CanonicalName, type SystemId } from "./systems";
import { useStore } from "./store";
import { DesignNotes } from "./notes";

export function ControlOverlay({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  // On open, move focus into the panel so screen-reader and keyboard users
  // know the controls appeared (the "/" key has no visible trigger to focus).
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const {
    systemId,
    setSystemId,
    compareId,
    setCompareId,
    used,
    maps,
    setMap,
    clearMap,
    annotations,
    setAnnotations,
  } = useStore();
  const system = SYSTEMS[systemId];
  const nativeNames = CANONICAL.map((c) => c.name).filter((n) => system.skins[n]);
  const missing = used.filter((n) => !system.skins[n]);
  const interim = interimTarget(systemId);

  return (
    <div className="ov" role="region" aria-label="Prototype controls" tabIndex={-1} ref={panelRef}>
      <div className="ov__head">
        <h2 className="panel__title">Controls</h2>
        <button className="ov__x" onClick={onClose} aria-label="Close controls (esc or /)">
          esc or /
        </button>
      </div>

      <section className="ov__sec">
        <h3 className="ov__h">Design System</h3>
        <select
          className="ov__select"
          aria-label="Design system"
          value={systemId}
          onChange={(e) => setSystemId(e.target.value as SystemId)}
        >
          {SYSTEM_IDS.map((id) => (
            <option key={id} value={id}>
              {SYSTEMS[id].label}
            </option>
          ))}
        </select>
        <p className="ov__blurb">{system.blurb}</p>
      </section>

      <section className="ov__sec">
        <h3 className="ov__h">System Divergence</h3>
        <div className="ov__label">Compare to</div>
        <select
          className="ov__select ov__select--compare"
          aria-label="Compare to"
          value={compareId ?? ""}
          onChange={(e) => setCompareId(e.target.value ? (e.target.value as SystemId) : null)}
        >
          <option value="">Select a system to compare</option>
          {SYSTEM_IDS.filter((id) => id !== systemId).map((id) => (
            <option key={id} value={id}>
              {SYSTEMS[id].label}
            </option>
          ))}
        </select>
        <DesignNotes />

        <div className="ov__sub">
          <h4 className="ov__subh">Component Bridge</h4>

          <label className="ov__toggle">
            <input
              type="checkbox"
              checked={annotations}
              onChange={(e) => setAnnotations(e.target.checked)}
            />
            Flag interim and mapped components
          </label>

          <div role="status">
            <div className="ov__label">Components missing here ({missing.length})</div>
            {missing.length === 0 && (
              <p className="ov__ok">
                Every component on this screen exists in the currently selected design system.
              </p>
            )}
          </div>
          {missing.map((name) => {
            const mapped = maps[systemId]?.[name];
            return (
              <div key={name} className="ov__row">
                <div className="ov__name">
                  {name}
                  {mapped ? (
                    <span className="ov__pill is-map">mapped → {mapped}</span>
                  ) : (
                    <span className="ov__pill is-ai">
                      Claude interim{interim ? ` → ${interim}` : ""}
                    </span>
                  )}
                </div>
                <div className="ov__actions">
                  <label className="ov__map">
                    map to&nbsp;
                    <select
                      value={mapped ?? ""}
                      onChange={(e) =>
                        e.target.value && setMap(systemId, name, e.target.value as CanonicalName)
                      }
                    >
                      <option value="">Use Claude interim</option>
                      {nativeNames.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  {mapped && (
                    <button className="ov__clear" onClick={() => clearMap(systemId, name)}>
                      Revert to interim
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="ov__foot">
        When a component has no match here, Claude Code builds a stand-in and flags it on the canvas.
        Override it by mapping to a real component. Your maps are saved. Turn flags off for a clean
        demo view.
      </p>
    </div>
  );
}
