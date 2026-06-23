// DoneScreen — confirmation after a bulk release. Reads the shared bag's `released`
// list (set on the marksheet screen) and surfaces it as an Alert plus a small recap
// table. Built only from canonical pieces. `reset()` returns to the marksheet start.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";

export function DoneScreen() {
  const { data, reset } = usePrototypes();
  const released = Array.isArray(data.released) ? (data.released as string[]) : [];

  return (
    <Canonical name="Card" title="Results released">
      <Canonical name="Alert" variant="success" title="Released to learners">
        {released.length} result{released.length === 1 ? "" : "s"} are now visible to learners.
      </Canonical>

      <Canonical
        name="Table"
        rowKey={(r: { name: string }) => r.name}
        columns={[{ key: "name", header: "Learner" }]}
        rows={released.map((name) => ({ name }))}
        empty="No results were released."
      />

      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={reset}>
          Back to marksheet
        </Canonical>
      </div>
    </Canonical>
  );
}
