// GroupPlannerScreen — the second screen. Exercises the Accordion's single={false} opt-out:
// the planner's session panels open INDEPENDENTLY (the legacy collapsibleHeaders model), so a
// learner can review several at once. Same canonical Accordion API as GroupsScreen, single-open
// turned off. The flag behaviour is identical — flagged in acuity-canon, plain elsewhere.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { SESSIONS } from "./data";

export function GroupPlannerScreen() {
  const { goTo } = usePrototypes();
  const items = SESSIONS.map((s) => ({
    header: s.title,
    body: <p className="proto__text">{s.detail}</p>,
  }));
  return (
    <Canonical name="Card" iconName="edit" title="Foundations of Pediatric Care — planner">
      <p className="proto__text">Plan the block. These panels open independently — keep several open as you work.</p>
      <Canonical name="Accordion" single={false} items={items} />
      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={() => goTo("groups")}>
          Back to groups
        </Canonical>
      </div>
    </Canonical>
  );
}
