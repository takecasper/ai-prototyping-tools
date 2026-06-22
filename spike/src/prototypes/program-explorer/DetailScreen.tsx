// DetailScreen — a single program. Exercises Breadcrumb (deeper trail), Tabs as a
// section switcher (Overview / Rotations / Learners) with live panel content, and an
// inline Button back to the list. The active program comes from the shared state bag.

import { useState } from "react";
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { DETAIL_TABS } from "./data";

export function DetailScreen() {
  const { back, data } = usePrototypes();
  const [section, setSection] = useState("overview");

  const name = typeof data.programName === "string" ? data.programName : "Program";

  return (
    <Canonical name="Card" title={name}>
      <Canonical
        name="Breadcrumb"
        items={[{ label: "Home", href: "#" }, { label: "Programs", href: "#" }, name]}
      />

      <Canonical name="Tabs" tabs={DETAIL_TABS} active={section} onSelect={setSection}>
        {section === "overview" ? (
          <p className="proto__text">
            Accreditation summary, contacts and the current academic year for {name}.
          </p>
        ) : null}
        {section === "rotations" ? (
          <p className="proto__text">Rotation blocks, sites and the marksheet schedule for {name}.</p>
        ) : null}
        {section === "learners" ? (
          <p className="proto__text">Enrolled learners, their stage and outstanding assessments.</p>
        ) : null}
      </Canonical>

      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={() => back()}>
          Back to programs
        </Canonical>
      </div>
    </Canonical>
  );
}
