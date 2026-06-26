// RosterScreen — the Avatar slice's pattern entry point, modelled on the real One45
// people-picker the circle avatar (.profile-img) comes from: pick faculty as reviewers.
// A selectable Table whose leading column is a circle Avatar (native in legacy / lowfi,
// a flagged bridge build in one45-2020s). The chosen reviewers are written to shared state and
// shown as a photo wall of card Avatars on the next screen.

import { useState } from "react";
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { REVIEWERS, type Reviewer } from "./data";

export function RosterScreen() {
  const { goTo, set } = usePrototypes();
  const [selected, setSelected] = useState<string[]>(["r1"]);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });

  const rows = [...REVIEWERS].sort((a, b) => {
    const av = String(a[sort.key as keyof Reviewer] ?? "");
    const bv = String(b[sort.key as keyof Reviewer] ?? "");
    const cmp = av.localeCompare(bv);
    return sort.dir === "asc" ? cmp : -cmp;
  });

  const onSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const confirm = () => {
    const chosen = REVIEWERS.filter((r) => selected.includes(r.id));
    set("reviewers", chosen);
    goTo("wall");
  };

  return (
    <Canonical
      name="Card"
      iconName="people"
      title="Assign reviewers"
      footer={
        <Canonical name="Button" onClick={confirm}>
          Review {selected.length} selected
        </Canonical>
      }
    >
      <p className="proto__text">Pick the faculty who will review this learner.</p>
      <Canonical
        name="Table"
        rowKey={(r: Reviewer) => r.id}
        selectable
        selected={selected}
        onSelectionChange={setSelected}
        columns={[
          {
            key: "photo",
            header: "",
            width: 44,
            cell: (r: Reviewer) => <Canonical name="Avatar" personName={r.name} />,
          },
          { key: "name", header: "Name", sortable: true },
          { key: "role", header: "Role", sortable: true },
          { key: "year", header: "Program" },
        ]}
        rows={rows}
        sort={sort}
        onSort={onSort}
      />
    </Canonical>
  );
}
