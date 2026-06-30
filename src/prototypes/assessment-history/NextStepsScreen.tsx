// NextStepsScreen — the second screen. Summarises the current assessment status as a Badge and the
// outstanding steps as a numbered List, so the Timeline and List/Badge pieces sit in one prototype.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { NEXT_STEPS } from "./data";

export function NextStepsScreen() {
  const { goTo } = usePrototypes();
  return (
    <Canonical name="Card" iconName="checkCircle" title="Cardiology EPA — outstanding steps">
      <p className="proto__text">
        Current status: <Canonical name="Badge">In progress</Canonical>
      </p>
      <Canonical name="List" variant="numbered" items={NEXT_STEPS} />
      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={() => goTo("history")}>
          Back to history
        </Canonical>
      </div>
    </Canonical>
  );
}
