// HistoryScreen — the Assessment History entry point. Exercises the Data display slice's Timeline:
// a Card holding the dated status history of an EPA assessment (newest first, each entry a date +
// title + status on a marker rail). Timeline is one45-2020s-only — native in one45-2020s + lowfi
// and a flagged bridge interim in one45-legacy + acuity-canon (neither ships a history/timeline) —
// so toggling to legacy or the Acuity Design System shows it flagged "AI approx".

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { HISTORY } from "./data";

export function HistoryScreen() {
  const { goTo } = usePrototypes();
  return (
    <Canonical name="Card" iconName="resourceCenter" title="Cardiology EPA — assessment history">
      <p className="proto__text">The status of this assessment over time, newest first.</p>
      <Canonical name="Timeline" entries={HISTORY} />
      <div className="proto__actions">
        <Canonical name="Button" onClick={() => goTo("next")}>
          What happens next
        </Canonical>
      </div>
    </Canonical>
  );
}
