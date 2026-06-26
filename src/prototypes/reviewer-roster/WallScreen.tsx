// WallScreen — the chosen reviewers shown as a photo wall of CARD Avatars (the webeval
// .photo yearbook tile the card variant reproduces): a 75-wide bordered card with the
// image and a name caption beneath. Reads the selection from shared state (falls back to
// the first two reviewers for a direct open). Card Avatar is native in legacy / lowfi and
// a flagged bridge build in one45-2020s, the same as the circle on the roster screen.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { REVIEWERS, type Reviewer } from "./data";

export function WallScreen() {
  const { back, reset, data } = usePrototypes();
  const reviewers = (data.reviewers as Reviewer[] | undefined) ?? REVIEWERS.slice(0, 2);

  return (
    <Canonical
      name="Card"
      iconName="checkCircle"
      title="Review panel"
      footer={
        <Canonical name="Button" onClick={reset}>
          Confirm panel
        </Canonical>
      }
    >
      <p className="proto__text">
        {reviewers.length} reviewer{reviewers.length === 1 ? "" : "s"} assigned to this learner.
      </p>
      <div className="proto__row">
        {reviewers.map((r) => (
          <Canonical key={r.id} name="Avatar" shape="card" personName={r.name} />
        ))}
      </div>
      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={back}>
          Back
        </Canonical>
      </div>
    </Canonical>
  );
}
