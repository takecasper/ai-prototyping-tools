// FormScreen — the enrolment form. Exercises the full Inputs & controls slice
// (TextField with live validation state, Select, Radio group, Toggle, Textarea,
// Checkbox, SearchField, Button variants) built only from canonical pieces, so it
// re-skins across all three systems with zero edits.

import { useState } from "react";
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { PROGRAMS, YEARS, ROLES, emailState } from "./data";

export function FormScreen() {
  const { goTo, set } = usePrototypes();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState(PROGRAMS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [role, setRole] = useState(ROLES[0]);
  const [notes, setNotes] = useState("");
  const [notify, setNotify] = useState(true);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const eState = emailState(email);
  const nameState = submitted && name.trim().length === 0 ? "error" : "default";
  const consentState = submitted && !consent ? "error" : "default";
  const valid = name.trim().length > 0 && eState === "success" && consent;

  function onSubmit() {
    setSubmitted(true);
    if (!valid) return;
    set("enrolment", { name, email, program, year, role, notes, notify, consent });
    goTo("confirm");
  }

  return (
    <Canonical name="Card" title="Enrol a learner">
      <p className="proto__text">Add a learner to a program. Required fields are validated on submit.</p>

      <div className="proto__row">
        <Canonical
          name="SearchField"
          value={name}
          placeholder="Find an existing person"
          onChange={(e: { target: { value: string } }) => setName(e.target.value)}
        />
      </div>

      <Canonical
        name="TextField"
        id="le-name"
        label="Full name"
        optionalityLabel="required"
        value={name}
        state={nameState}
        message={nameState === "error" ? "Enter the learner's name." : ""}
        onChange={(e: { target: { value: string } }) => setName(e.target.value)}
      />

      <Canonical
        name="TextField"
        id="le-email"
        label="Email"
        type="email"
        optionalityLabel="required"
        value={email}
        state={eState}
        message={eState === "error" ? "That doesn't look like a valid email." : ""}
        helpText={["We send the enrolment notice here."]}
        onChange={(e: { target: { value: string } }) => setEmail(e.target.value)}
      />

      <Canonical
        name="Select"
        id="le-program"
        label="Program"
        value={program}
        options={PROGRAMS}
        onChange={(e: { target: { value: string } }) => setProgram(e.target.value)}
      />

      <Canonical
        name="Select"
        id="le-year"
        label="Academic year"
        value={year}
        options={YEARS}
        onChange={(e: { target: { value: string } }) => setYear(e.target.value)}
      />

      <p className="proto__text">Role</p>
      <div className="flow-list">
        {ROLES.map((r) => (
          <Canonical
            key={r}
            name="Radio"
            label={r}
            group="role"
            value={r}
            checked={role === r}
            onChange={() => setRole(r)}
          />
        ))}
      </div>

      <Canonical
        name="Textarea"
        id="le-notes"
        label="Notes"
        optionalityLabel="optional"
        value={notes}
        rows={3}
        onChange={(e: { target: { value: string } }) => setNotes(e.target.value)}
      />

      <Canonical name="Toggle" label="Notify the learner by email" checked={notify} onChange={() => setNotify(!notify)} />

      <Canonical
        name="Checkbox"
        label="I confirm I have consent to enrol this person."
        checked={consent}
        onChange={() => setConsent(!consent)}
      />
      {consentState === "error" ? <p className="proto__text">Consent is required to continue.</p> : null}

      <div className="proto__actions">
        <Canonical name="Button" onClick={onSubmit}>
          Enrol learner
        </Canonical>
        <Canonical name="Button" variant="secondary" onClick={() => setSubmitted(false)}>
          Clear errors
        </Canonical>
      </div>
    </Canonical>
  );
}
