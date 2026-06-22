// DetailScreen — review the selected applicant and record a decision. Leads with
// a placeholder photo, reads the applicant from shared state, writes the
// decision, then moves to confirm.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { APPLICANTS } from "./data";

export function DetailScreen() {
  const { data, set, goTo, back, canBack } = usePrototypes();
  const a = APPLICANTS.find((x) => x.id === data.applicantId) ?? APPLICANTS[0];

  return (
    <Canonical name="Card" title={a.name}>
      <Canonical name="Image" w={280} h={120} label={a.name} />
      <p className="proto__row">
        Status: <Canonical name="Badge">{a.status}</Canonical>
      </p>
      <p className="proto__text">{a.role}. Read the application, then record a decision.</p>
      <div className="proto__actions">
        <Canonical
          name="Button"
          onClick={() => {
            set("decision", "advance");
            goTo("confirm");
          }}
        >
          Advance
        </Canonical>
        <Canonical
          name="Button"
          onClick={() => {
            set("decision", "reject");
            goTo("confirm");
          }}
        >
          Reject
        </Canonical>
        {canBack && (
          <Canonical name="Button" onClick={back}>
            Back
          </Canonical>
        )}
      </div>
    </Canonical>
  );
}
