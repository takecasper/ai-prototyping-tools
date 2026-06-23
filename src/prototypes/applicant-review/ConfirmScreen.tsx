// ConfirmScreen — shows the recorded decision and a mock save. Reads the
// applicant and decision from shared state. "Back to applicants" resets the flow.

import { useEffect, useState } from "react";
import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { APPLICANTS } from "./data";

export function ConfirmScreen() {
  const { data, reset } = usePrototypes();
  const a = APPLICANTS.find((x) => x.id === data.applicantId) ?? APPLICANTS[0];
  const d = (data.decision as string) ?? "advance";

  const [saving, setSaving] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSaving(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Canonical name="Card" title="Decision recorded">
      <p className="proto__text">
        {a.name} was {d === "advance" ? "advanced to the next stage" : "rejected"}.
      </p>
      <p className="proto__row">
        Save: <Canonical name="Badge">{saving ? "Saving" : "Saved"}</Canonical>
      </p>
      <div className="proto__actions">
        <Canonical name="Button" onClick={reset}>
          Back to applicants
        </Canonical>
      </div>
    </Canonical>
  );
}
