// ProfileScreen — the formalised Card showcased as the real DS person panels do
// (domain_demo_person_info.jsx): identity, enrolment and contact grouped into Cards,
// each with an icon + title header and an optional footer action. Reads the chosen
// person from shared state (falls back to the first fixture for a direct open).

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { PEOPLE, type Person } from "./data";

export function ProfileScreen() {
  const { data, back, goTo } = usePrototypes();
  const person = (data.person as Person) ?? PEOPLE[0];

  return (
    <div className="proto__stack">
      <Canonical
        name="Card"
        iconName="user"
        title={person.name}
        footer={<Canonical name="Badge">{person.status}</Canonical>}
      >
        <p className="proto__row">
          Year: {person.year}
        </p>
        <p className="proto__row">
          Program: {person.program}
        </p>
        <p className="proto__row">
          Site: {person.site}
        </p>
      </Canonical>

      <Canonical
        name="Card"
        iconName="checkCircle"
        title="Enrolment"
        footer={
          <Canonical name="Button" onClick={() => goTo("directory")}>
            Message learner
          </Canonical>
        }
      >
        <p className="proto__text">
          Enrolled in {person.program}, currently {person.year}. Faculty advisor: {person.advisor}.
        </p>
      </Canonical>

      <Canonical name="Card" iconName="edit" title="Contact">
        <p className="proto__row">
          Email:{" "}
          <Canonical name="Link" href="#" variant="inline">
            {person.email}
          </Canonical>
        </p>
      </Canonical>

      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={back}>
          Back
        </Canonical>
      </div>
    </div>
  );
}
