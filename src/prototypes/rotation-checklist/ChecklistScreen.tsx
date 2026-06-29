// ChecklistScreen — the Rotation Checklist entry point. Exercises the Data display slice's
// List in two variants inside a Card: a NUMBERED list of ordered completion steps and a
// BULLETED list of required assessments. The action moves to the resource link list.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { COMPLETION_STEPS, REQUIRED_ASSESSMENTS } from "./data";

export function ChecklistScreen() {
  const { goTo } = usePrototypes();
  return (
    <Canonical name="Card" iconName="checkCircle" title="Internal Medicine — rotation requirements">
      <p className="proto__text">Complete these steps in order before the rotation ends.</p>
      <Canonical name="List" variant="numbered" items={COMPLETION_STEPS} />
      <p className="proto__text">Required assessments for this rotation:</p>
      <Canonical name="List" variant="bulleted" items={REQUIRED_ASSESSMENTS} />
      <div className="proto__actions">
        <Canonical name="Button" onClick={() => goTo("resources")}>
          View resources
        </Canonical>
      </div>
    </Canonical>
  );
}
