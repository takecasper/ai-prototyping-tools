// ProfileScreen — second step of the Onboarding prototype.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";

export function ProfileScreen() {
  const { back } = usePrototypes();

  return (
    <Canonical name="Card" title="Set up your profile">
      <p className="proto__row">
        Step: <Canonical name="Badge">2 of 2</Canonical>
      </p>
      <p className="proto__text">Add a name and a photo. This is the last onboarding step.</p>
      <div className="proto__actions">
        <Canonical name="Button" onClick={back}>
          Back
        </Canonical>
      </div>
    </Canonical>
  );
}
