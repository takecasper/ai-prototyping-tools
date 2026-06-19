// library.tsx — the left panel, the mirror of the Controls panel. Lists every
// prototype in a sortable table (name, created, modified); click a row to open
// it. Once a prototype is open, its flow steps appear below, so you can jump
// between screens. Opens alongside Controls when "/" is pressed.

import { useState } from "react";
import { usePrototypes } from "./prototypes/context";

type SortKey = "name" | "createdAt" | "modifiedAt";

export function Library() {
  const { prototypes, activeId, setActive, active, current, goTo } = usePrototypes();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

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

  return (
    <div className="lib" role="dialog" aria-label="Prototypes">
      <div className="lib__head">
        <strong>Prototypes</strong>
      </div>

      <div className="lib__table-wrap">
        <table className="lib__table">
          <thead>
            <tr>
              <th onClick={() => setSort("name")}>Name{arrow("name")}</th>
              <th onClick={() => setSort("createdAt")}>Created{arrow("createdAt")}</th>
              <th onClick={() => setSort("modifiedAt")}>Modified{arrow("modifiedAt")}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr
                key={p.id}
                className={p.id === activeId ? "is-active" : ""}
                onClick={() => setActive(p.id)}
              >
                <td>{p.name}</td>
                <td>{p.createdAt}</td>
                <td>{p.modifiedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lib__steps">
        <div className="lib__steps-h">Flow steps: {active.name}</div>
        <div className="ov__flow">
          {active.screens.map((s, i) => (
            <button
              key={s.id}
              className={"ov__step" + (s.id === current ? " is-active" : "")}
              onClick={() => goTo(s.id)}
            >
              <span className="ov__step-n">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
