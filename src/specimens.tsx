// specimens.tsx — curated example props/markup the gallery renders each canonical
// piece with. A specimen is either a props bag spread into <Canonical>, or a
// render function (system) => ReactNode for pieces that need composed children
// (Card body, Tabs panel, Modal trigger+dialog).
//
// This map is OPTIONAL and additive: the gallery iterates the full CANONICAL
// catalogue regardless, so a piece without a specimen still appears (rendered
// with no props, plus a dev-only "needs specimen" marker). Typed against
// CanonicalName, so a stale key cannot compile.

import { useState, type ReactNode } from "react";
import { Canonical } from "./resolver";
import { type CanonicalName, type SystemId } from "./systems";

export type Specimen = Record<string, any> | ((system: SystemId) => ReactNode);

// Modal is position:fixed and would cover the gallery if rendered open inline, so
// its specimen is a trigger button that opens the real canonical Modal.
function ModalDemo({ system }: { system: SystemId }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Canonical name="Button" system={system} variant="secondary" onClick={() => setOpen(true)}>
        Open modal
      </Canonical>
      <Canonical
        name="Modal"
        system={system}
        open={open}
        title="Confirm action"
        dismissible
        onClose={() => setOpen(false)}
        footer={
          <>
            <Canonical name="Button" system={system} variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Canonical>
            <Canonical name="Button" system={system} onClick={() => setOpen(false)}>
              Confirm
            </Canonical>
          </>
        }
      >
        <p className="proto__text">A centred dialog with a title, body, and footer actions.</p>
      </Canonical>
    </>
  );
}

export const SPECIMENS: Partial<Record<CanonicalName, Specimen>> = {
  Button: { children: "Save changes" },
  Card: (system) => (
    <Canonical name="Card" system={system} title="Card title">
      <p className="proto__text">Body content inside a card container.</p>
    </Canonical>
  ),
  Badge: { children: "New" },
  Alert: { title: "Heads up", children: "This is an inline alert message." },
  TextField: { label: "Full name", defaultValue: "Ada Lovelace", helpText: "As it appears on your ID." },
  Textarea: { label: "Notes", defaultValue: "A few lines of longer text…", rows: 3 },
  Select: { label: "Role", options: ["Student", "Instructor", "Admin"], defaultValue: "Instructor" },
  Checkbox: { label: "Email me updates", defaultChecked: true },
  Radio: { label: "Standard delivery", group: "demo-delivery", defaultChecked: true },
  Toggle: { label: "Enabled", defaultChecked: true },
  SearchField: { placeholder: "Search programs" },
  Tabs: (system) => (
    <Canonical name="Tabs" system={system} tabs={["Overview", "Details", "History"]} active="Overview">
      <p className="proto__text">Panel content for the active tab.</p>
    </Canonical>
  ),
  Link: { children: "View details", href: "#" },
  Breadcrumb: { items: ["Home", "Programs", "Biology"] },
  Modal: (system) => <ModalDemo system={system} />,
  Image: { w: 240, h: 120, label: "Image" },
  Icon: { icon: "star" },
};
