// BrowseScreen — the program list. Exercises the Navigation slice: Breadcrumb trail,
// Tabs (region filter, with badge counts), and Link (a real external reference). Built
// only from canonical pieces, so it re-skins across all three systems with zero edits.
// No pagination control: neither One45 system ships one, so the tool does not fabricate
// it — the region tabs keep each list short instead.

import { useState } from "react";
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { REGION_TABS, programsForRegion, PROGRAMS } from "./data";

export function BrowseScreen() {
  const { goTo, set } = usePrototypes();
  const [region, setRegion] = useState("all");

  const tabs = REGION_TABS.map((t) => ({
    ...t,
    badge: t.id === "all" ? PROGRAMS.length : PROGRAMS.filter((p) => p.site === t.id).length,
  }));

  const rows = programsForRegion(region);

  function open(id: string, name: string) {
    set("programId", id);
    set("programName", name);
    goTo("detail");
  }

  return (
    <Canonical name="Card" title="Programs">
      <Canonical name="Breadcrumb" items={[{ label: "Home", href: "#" }, "Programs"]} />

      <Canonical name="Tabs" tabs={tabs} active={region} onSelect={setRegion} />

      <div className="flow-list">
        {rows.map((p) => (
          <div className="flow-row" key={p.id}>
            <div className="flow-row__id">
              <div className="flow-row__name">{p.name}</div>
              <div className="flow-row__meta">
                {p.site} · {p.status} · {p.learners} learners
              </div>
            </div>
            <Canonical name="Button" variant="inline" onClick={() => open(p.id, p.name)}>
              Open
            </Canonical>
          </div>
        ))}
      </div>

      <p className="proto__text">
        {rows.length} programs. Need the rubric reference?{" "}
        <Canonical name="Link" href="https://help.one45.com" external text="Open the assessment guide" />
      </p>
    </Canonical>
  );
}
