// GroupsScreen — the Curriculum Groups entry point. Exercises the Data display slice's
// Accordion in its single-open default: a Card holding an Accordion of curriculum groups, each
// section revealing the group's objectives (a bulleted List). Opening one group closes the
// others. Accordion is native in lowfi / one45-2020s / one45-legacy and a flagged bridge interim
// in acuity-canon (the ADS package ships no Accordion) — so toggling to the Acuity Design System
// shows it flagged "AI approx" while the other three render plainly.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { GROUPS } from "./data";

export function GroupsScreen() {
  const { goTo } = usePrototypes();
  const items = GROUPS.map((g, i) => ({
    header: g.name,
    defaultOpen: i === 0,
    body: (
      <div className="proto__stack">
        <p className="proto__text">{g.summary}</p>
        <Canonical name="List" variant="bulleted" items={g.objectives} />
      </div>
    ),
  }));
  return (
    <Canonical name="Card" iconName="resourceCenter" title="Pediatrics — curriculum groups">
      <p className="proto__text">Expand a group to review its learning objectives. One group opens at a time.</p>
      <Canonical name="Accordion" items={items} />
      <div className="proto__actions">
        <Canonical name="Button" onClick={() => goTo("planner")}>
          Open group planner
        </Canonical>
      </div>
    </Canonical>
  );
}
