// overlay.tsx — the "/" control panel, organised into three sections:
// Design System, Component Bridge, System Divergence. No "Ask Claude" button —
// the tool runs in Claude Code, so gaps are filled by Claude Code building an
// interim (auto-flagged). The user's action here is to OVERRIDE that interim by
// mapping the missing piece to an existing component, or revert to the interim.

import { CANONICAL, SYSTEMS, SYSTEM_IDS, interimTarget, type CanonicalName, type SystemId } from "./systems";
import { useStore } from "./store";
import { DesignNotes } from "./notes";

export function ControlOverlay({ onClose }: { onClose: () => void }) {
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
    <div className="ov" role="dialog" aria-label="Prototype controls">
      <div className="ov__head">
        <strong>Controls</strong>
        <button className="ov__x" onClick={onClose} aria-label="Close controls">
          esc or /
        </button>
      </div>

      <section className="ov__sec">
        <h3 className="ov__h">Design System</h3>
        <select
          className="ov__select"
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
        <h3 className="ov__h">Component Bridge</h3>

        <label className="ov__toggle">
          <input
            type="checkbox"
            checked={annotations}
            onChange={(e) => setAnnotations(e.target.checked)}
          />
          Flag interim and mapped components
        </label>

        <div className="ov__label">Components missing here ({missing.length})</div>
        {missing.length === 0 && (
          <p className="ov__ok">Every component on this screen exists here.</p>
        )}
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
      </section>

      <section className="ov__sec">
        <h3 className="ov__h">System Divergence</h3>
        <div className="ov__label">Compare to</div>
        <select
          className="ov__select ov__select--compare"
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
      </section>

      <p className="ov__foot">
        When a component has no match here, Claude Code builds a stand-in and flags it on the canvas.
        Override it by mapping to a real component. Your maps are saved. Turn flags off for a clean
        demo view.
      </p>
    </div>
  );
}
