// ResourcesScreen — the rotation's reference links as a PLAIN List (the markerless
// .list-widget / one45-2020s flex-link-list reality), reached from the checklist. The canonical
// List renders each {label, href} item as a link; a Button returns to the requirements.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { RESOURCES } from "./data";

export function ResourcesScreen() {
  const { back } = usePrototypes();
  return (
    <Canonical name="Card" iconName="folder" title="Rotation resources">
      <p className="proto__text">Reference material for this rotation.</p>
      <Canonical name="List" variant="plain" items={RESOURCES} />
      <div className="proto__actions">
        <Canonical name="Button" variant="secondary" onClick={() => back()}>
          Back to requirements
        </Canonical>
      </div>
    </Canonical>
  );
}
