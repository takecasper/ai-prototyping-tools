// SummaryScreen — overview of a learner's Casper results.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";

export function SummaryScreen() {
  const { goTo } = usePrototypes();

  return (
    <Canonical name="Card" title="Your Casper results">
      <Canonical name="Image" w={300} h={120} label="Score overview" />
      <Canonical name="Alert" title="Preliminary">
        These results are not final until the cycle closes.
      </Canonical>
      <p className="proto__row">
        Overall: <Canonical name="Badge">Third quartile</Canonical>
      </p>
      <p className="proto__text">Your Casper assessment results for the 2026 cycle.</p>
      <div className="proto__actions">
        <Canonical name="Button" onClick={() => goTo("breakdown")}>
          See breakdown
        </Canonical>
      </div>
    </Canonical>
  );
}
