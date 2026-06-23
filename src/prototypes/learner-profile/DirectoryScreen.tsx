// DirectoryScreen — the learner-profile pattern's entry point. A Card wraps a sortable
// Table of people (the Data display slice's Table + the formalised Card together); each
// row's View action writes the chosen person to shared state and moves to the profile.

import { useState } from "react";
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { PEOPLE, type Person } from "./data";

export function DirectoryScreen() {
  const { goTo, set } = usePrototypes();
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });

  const rows = [...PEOPLE].sort((a, b) => {
    const av = String(a[sort.key as keyof Person] ?? "");
    const bv = String(b[sort.key as keyof Person] ?? "");
    const cmp = av.localeCompare(bv);
    return sort.dir === "asc" ? cmp : -cmp;
  });

  const onSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const open = (person: Person) => {
    set("person", person);
    goTo("profile");
  };

  return (
    <Canonical name="Card" iconName="people" title="Internal Medicine — learners">
      <p className="proto__text">Pick a learner to open their profile.</p>
      <Canonical
        name="Table"
        rowKey={(r: Person) => r.id}
        columns={[
          { key: "name", header: "Name", sortable: true },
          { key: "year", header: "Year", sortable: true },
          { key: "status", header: "Status" },
          {
            key: "open",
            header: "",
            align: "right",
            cell: (r: Person) => (
              <Canonical name="Button" variant="inline" onClick={() => open(r)}>
                View
              </Canonical>
            ),
          },
        ]}
        rows={rows}
        sort={sort}
        onSort={onSort}
      />
    </Canonical>
  );
}
