// BreakdownScreen — per-section scores. Each row leads with a placeholder icon.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { SECTIONS } from "./data";

export function BreakdownScreen() {
  const { back } = usePrototypes();

  return (
    <Canonical name="Card" title="Score breakdown">
      <div className="flow-list">
        {SECTIONS.map((s) => (
          <div key={s.label} className="flow-row">
            <Canonical name="Icon" iconName={s.icon} size="small" />
            <div className="flow-row__id">
              <div className="flow-row__name">{s.label}</div>
            </div>
            <Canonical name="Badge">{s.score}</Canonical>
          </div>
        ))}
      </div>
      <div className="proto__actions">
        <Canonical name="Button" onClick={back}>
          Back
        </Canonical>
      </div>
    </Canonical>
  );
}
