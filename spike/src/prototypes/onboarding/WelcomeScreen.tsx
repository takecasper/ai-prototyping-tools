// WelcomeScreen — first step of the Onboarding prototype.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";

export function WelcomeScreen() {
  const { goTo } = usePrototypes();

  return (
    <Canonical name="Card" title="Welcome to Acuity">
      <Canonical name="Image" w={280} h={120} label="Welcome" />
      <p className="proto__text">
        A short onboarding flow. This step greets a new learner before they set up a profile.
      </p>
      <div className="proto__actions">
        <Canonical name="Button" onClick={() => goTo("profile")}>
          Get started
        </Canonical>
      </div>
    </Canonical>
  );
}
