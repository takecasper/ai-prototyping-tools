// ConfirmScreen — enrolment summary after a valid submit. Reads the shared bag
// written by FormScreen and shows a success Alert (acuity-only; the bridge fills
// it for one45-legacy and lowfi).

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import type { EnrolmentDraft } from "./data";

export function ConfirmScreen() {
  const { data, reset } = usePrototypes();
  const e = (data.enrolment as EnrolmentDraft) ?? null;

  return (
    <Canonical name="Card" title="Learner enrolled">
      <Canonical name="Alert" title="Success">
        The learner has been added to the program.
      </Canonical>

      {e ? (
        <div className="flow-list">
          <p className="proto__row">
            <Canonical name="Badge">Name</Canonical> {e.name}
          </p>
          <p className="proto__row">
            <Canonical name="Badge">Email</Canonical> {e.email}
          </p>
          <p className="proto__row">
            <Canonical name="Badge">Program</Canonical> {e.program} - {e.year}
          </p>
          <p className="proto__row">
            <Canonical name="Badge">Role</Canonical> {e.role}
          </p>
          <p className="proto__row">
            <Canonical name="Badge">Notify</Canonical> {e.notify ? "Email the learner" : "No notification"}
          </p>
          {e.notes ? <p className="proto__text">Notes: {e.notes}</p> : null}
        </div>
      ) : (
        <p className="proto__text">No enrolment data.</p>
      )}

      <div className="proto__actions">
        <Canonical name="Button" onClick={reset}>
          Enrol another
        </Canonical>
      </div>
    </Canonical>
  );
}
