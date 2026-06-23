// RosterScreen — the Feedback & status slice's Modal-confirm pattern, modelled on the
// real One45 destructive-action flows (confirmModal.jsx / the bulk-permission
// confirmationPopup). A rotation roster: each row's danger "Withdraw" opens a confirm
// Modal (Cancel / Withdraw); confirming removes the learner and surfaces an Alert. Built
// only from canonical pieces, so it re-skins across all three systems with zero edits —
// the Modal renders the Acuity headerless dialog, the legacy grey-band dialog, or the
// lowfi sketch, all from one component + token swap.

import { useState } from "react";
import { Canonical } from "../../resolver";
import { ROSTER, type Learner } from "./data";

export function RosterScreen() {
  const [roster, setRoster] = useState<Learner[]>(ROSTER);
  const [pending, setPending] = useState<Learner | null>(null);
  const [withdrawn, setWithdrawn] = useState<string | null>(null);

  function confirmWithdraw() {
    if (!pending) return;
    setRoster((r) => r.filter((l) => l.id !== pending.id));
    setWithdrawn(pending.name);
    setPending(null);
  }

  return (
    <Canonical name="Card" title="Internal Medicine — rotation roster">
      {withdrawn ? (
        <Canonical name="Alert" variant="success" title="Learner withdrawn">
          {withdrawn} has been removed from this rotation. Completed assessments stay on file.
        </Canonical>
      ) : null}

      <p className="proto__text">{roster.length} learners on this rotation.</p>

      <div className="flow-list">
        {roster.map((l) => (
          <div className="flow-row" key={l.id}>
            <div className="flow-row__id">
              <div className="flow-row__name">{l.name}</div>
              <div className="flow-row__meta">
                {l.year} · {l.email}
              </div>
            </div>
            <Canonical name="Button" variant="danger" onClick={() => setPending(l)}>
              Withdraw
            </Canonical>
          </div>
        ))}
      </div>

      <Canonical
        name="Modal"
        open={pending !== null}
        title="Withdraw learner?"
        icon="warning"
        dismissible
        onClose={() => setPending(null)}
        footer={
          <>
            <Canonical name="Button" variant="secondary" onClick={() => setPending(null)}>
              Cancel
            </Canonical>
            <Canonical name="Button" variant="danger" onClick={confirmWithdraw}>
              Withdraw
            </Canonical>
          </>
        }
      >
        <p className="proto__text">
          {pending
            ? `Remove ${pending.name} from the Internal Medicine rotation? Their completed assessments stay on file, and they can be re-enrolled later.`
            : ""}
        </p>
      </Canonical>
    </Canonical>
  );
}
