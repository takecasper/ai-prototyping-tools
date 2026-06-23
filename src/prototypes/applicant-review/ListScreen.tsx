// ListScreen — pick an applicant. Writes the choice to shared state, then moves
// to the detail screen. Each row leads with a placeholder Icon.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { APPLICANTS } from "./data";

export function ListScreen() {
  const { set, goTo } = usePrototypes();

  return (
    <Canonical name="Card" title="Applicants">
      <p className="proto__text">
        Pick an applicant to review. Your choice carries through the rest of the flow.
      </p>
      <div className="flow-list">
        {APPLICANTS.map((a) => (
          <div key={a.id} className="flow-row">
            <Canonical name="Icon" iconName="person" size="small" />
            <div className="flow-row__id">
              <div className="flow-row__name">{a.name}</div>
              <div className="flow-row__meta">{a.role}</div>
            </div>
            <Canonical name="Badge">{a.status}</Canonical>
            <Canonical
              name="Button"
              onClick={() => {
                set("applicantId", a.id);
                goTo("detail");
              }}
            >
              Review
            </Canonical>
          </div>
        ))}
      </div>
    </Canonical>
  );
}
