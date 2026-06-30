// OutlineScreen — the second screen. Flattens the curriculum tree into a plain List of its
// blocks and rotations (a numbered outline), so the Tree and List pieces sit side by side in one
// prototype. Both bridge to a flagged interim in acuity-canon and render plainly elsewhere.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { OUTLINE } from "./data";

export function OutlineScreen() {
  const { goTo } = usePrototypes();
  return (
    <Canonical name="Card" iconName="checkCircle" title="MD Program — block outline">
      <p className="proto__text">The blocks and rotations across all years, as a flat list.</p>
      <Canonical name="List" variant="numbered" items={OUTLINE} />
      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={() => goTo("structure")}>
          Back to structure
        </Canonical>
      </div>
    </Canonical>
  );
}
