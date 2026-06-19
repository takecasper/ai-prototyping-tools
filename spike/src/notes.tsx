// notes.tsx — the System Divergence readout. Compares the active system against
// a chosen baseline across the pieces the prototype uses, and reports where the
// two agree and where they diverge. That gap is the convergence signal: how far
// apart two systems are for a real screen.

import { SYSTEMS } from "./systems";
import { useStore } from "./store";

export function DesignNotes() {
  const { systemId, compareId, used } = useStore();
  const active = SYSTEMS[systemId];

  if (!compareId) {
    return (
      <p className="notes__prompt">Pick a system above to compare against {active.label}.</p>
    );
  }

  const compare = SYSTEMS[compareId];

  let both = 0,
    onlyActive = 0,
    onlyCompare = 0,
    neither = 0;

  const rows = used.map((name) => {
    const inActive = !!active.skins[name];
    const inCompare = !!compare.skins[name];
    if (inActive && inCompare) {
      both++;
      return { name, status: "both" as const };
    }
    if (inActive) {
      onlyActive++;
      return { name, status: "onlyActive" as const };
    }
    if (inCompare) {
      onlyCompare++;
      return { name, status: "onlyCompare" as const };
    }
    neither++;
    return { name, status: "neither" as const };
  });

  const diverged = rows.filter((r) => r.status !== "both");

  return (
    <div className="notes">
      <div className="notes__sub">
        {active.label} vs {compare.label}
      </div>
      <div className="notes__counts">
        <span className="c c--native">{both} shared</span>
        <span className="c c--map">{onlyActive} only in {active.label}</span>
        <span className="c c--ai">{onlyCompare} only in {compare.label}</span>
        <span className="c c--unmapped">{neither} in neither</span>
      </div>
      <ul className="notes__list">
        {diverged.length === 0 && (
          <li className="nrow nrow--ok">
            These systems agree on every component this screen uses.
          </li>
        )}
        {diverged.map((r) => (
          <li key={r.name} className={"nrow nrow--" + r.status}>
            {r.name}:{" "}
            {r.status === "onlyActive"
              ? `only in ${active.label}`
              : r.status === "onlyCompare"
                ? `only in ${compare.label}`
                : "in neither system"}
          </li>
        ))}
      </ul>
    </div>
  );
}
