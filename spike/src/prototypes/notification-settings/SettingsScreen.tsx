// SettingsScreen — a single-screen prototype (no navigation).

import { Canonical } from "../../resolver";

export function SettingsScreen() {
  return (
    <Canonical name="Card" title="Notification settings">
      <p className="proto__row">
        Email alerts: <Canonical name="Badge">On</Canonical>
      </p>
      <p className="proto__text">A one-screen prototype for a settings page.</p>
      <div className="proto__actions">
        <Canonical name="Button">Save changes</Canonical>
        <Canonical name="Button">Cancel</Canonical>
      </div>
    </Canonical>
  );
}
