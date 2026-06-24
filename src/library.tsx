// library.tsx — the left panel. A tabbed interface:
//   Prototypes (default) — every prototype in a sortable table; click a row to
//     open it on the canvas. Once open, its flow steps appear below.
//   Systems — the design systems; click one to view its component gallery on the
//     canvas instead of a prototype.
// Clicking a prototype row switches the canvas to prototype mode; clicking a
// system row switches it to that system's gallery. Opens alongside the right
// panel when "/" is pressed.

import { useRef, useState } from "react";
import { usePrototypes } from "./prototypes/context";
import { SYSTEMS, SYSTEM_IDS } from "./systems";
import { useView } from "./view";

type SortKey = "name" | "createdAt" | "modifiedAt";
type Tab = "prototypes" | "systems";

const TABS: { id: Tab; label: string }[] = [
  { id: "prototypes", label: "Prototypes" },
  { id: "systems", label: "Systems" },
];

export function Library() {
  const { prototypes, activeId, setActive, active, current, goTo } = usePrototypes();
  const { mode, viewedSystemId, showPrototype, showSystem } = useView();
  const [tab, setTab] = useState<Tab>("prototypes");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const tablistRef = useRef<HTMLDivElement>(null);

  const sorted = [...prototypes].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === "asc" ? cmp : -cmp;
  });

  const setSort = (k: SortKey) => {
    if (k === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setDir("asc");
    }
  };
  const arrow = (k: SortKey) => (k !== sortKey ? "" : dir === "asc" ? " ↑" : " ↓");
  const ariaSort = (k: SortKey): "ascending" | "descending" | "none" =>
    k !== sortKey ? "none" : dir === "asc" ? "ascending" : "descending";

  const openPrototype = (id: string) => {
    setActive(id);
    showPrototype();
  };

  // Roving arrow-key navigation across the two tabs.
  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === tab);
    const next = e.key === "ArrowRight" ? (i + 1) % TABS.length : (i - 1 + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    const btns = tablistRef.current?.querySelectorAll<HTMLButtonElement>(".lib__tab");
    btns?.[next]?.focus();
  };

  return (
    <div className="lib" role="region" aria-label="Prototypes and systems" tabIndex={-1}>
      <div className="lib__tabs" role="tablist" aria-label="Left panel" ref={tablistRef} onKeyDown={onTabKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`lib-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`lib-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className={"lib__tab" + (tab === t.id ? " is-active" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "prototypes" ? (
        <div className="lib__panel" role="tabpanel" id="lib-panel-prototypes" aria-labelledby="lib-tab-prototypes">
          <div className="lib__table-wrap">
            <table className="lib__table">
              <thead>
                <tr>
                  <th aria-sort={ariaSort("name")}>
                    <button className="lib__sort" onClick={() => setSort("name")}>Name{arrow("name")}</button>
                  </th>
                  <th aria-sort={ariaSort("createdAt")}>
                    <button className="lib__sort" onClick={() => setSort("createdAt")}>Created{arrow("createdAt")}</button>
                  </th>
                  <th aria-sort={ariaSort("modifiedAt")}>
                    <button className="lib__sort" onClick={() => setSort("modifiedAt")}>Modified{arrow("modifiedAt")}</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.id} className={mode === "prototype" && p.id === activeId ? "is-active" : ""}>
                    <td>
                      <button className="lib__open" onClick={() => openPrototype(p.id)}>
                        {p.name}
                      </button>
                    </td>
                    <td>{p.createdAt}</td>
                    <td>{p.modifiedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lib__steps">
            <h3 className="lib__steps-h">Flow steps: {active.name}</h3>
            <div className="ov__flow">
              {active.screens.map((s, i) => (
                <button
                  key={s.id}
                  className={"ov__step" + (s.id === current ? " is-active" : "")}
                  aria-current={s.id === current ? "step" : undefined}
                  onClick={() => goTo(s.id)}
                >
                  <span className="ov__step-n">{i + 1}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="lib__panel" role="tabpanel" id="lib-panel-systems" aria-labelledby="lib-tab-systems">
          <div className="sys">
            {SYSTEM_IDS.map((id) => {
              const s = SYSTEMS[id];
              const isActive = mode === "system" && viewedSystemId === id;
              return (
                <button
                  key={id}
                  className={"sys__item" + (isActive ? " is-active" : "")}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => showSystem(id)}
                >
                  <span className="sys__name">{s.label}</span>
                  <span className="sys__blurb">{s.blurb}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
