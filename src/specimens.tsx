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

// Table is sortable + selectable, so its specimen is a small stateful demo that owns
// the sort and selection (caller-managed, the real react-table v7 / useRowSelect shape).
const TABLE_ROWS = [
  { id: "r1", learner: "Amara Okafor", year: "PGY-2", score: 88 },
  { id: "r2", learner: "Daniel Reyes", year: "PGY-1", score: 73 },
  { id: "r3", learner: "Priya Nair", year: "PGY-3", score: 91 },
];
function TableDemo({ system }: { system: SystemId }) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "learner", dir: "asc" });
  const [selected, setSelected] = useState<string[]>(["r1"]);
  const rows = [...TABLE_ROWS].sort((a, b) => {
    const av = (a as any)[sort.key];
    const bv = (b as any)[sort.key];
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sort.dir === "asc" ? cmp : -cmp;
  });
  const onSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  return (
    <Canonical
      name="Table"
      system={system}
      rowKey={(r: any) => r.id}
      columns={[
        { key: "learner", header: "Learner", sortable: true },
        { key: "year", header: "Year" },
        { key: "score", header: "Score", align: "right", sortable: true },
      ]}
      rows={rows}
      sort={sort}
      onSort={onSort}
      selectable
      selected={selected}
      onSelectionChange={setSelected}
    />
  );
}

export const SPECIMENS: Partial<Record<CanonicalName, Specimen>> = {
  Button: { children: "Save changes" },
  // Card formalised to the real DS surface: icon + title header, body, footer action.
  // acuity renders headerless (icon + title on white); legacy adds a grey header band.
  Card: (system) => (
    <Canonical
      name="Card"
      system={system}
      iconName="user"
      title="Learner profile"
      footer={
        <Canonical name="Button" system={system} variant="secondary">
          View details
        </Canonical>
      }
    >
      <p className="proto__text">Body content inside a card, with an icon, a title, and a footer action.</p>
    </Canonical>
  ),
  Badge: { children: "New" },
  // Alert is native in acuity + legacy and bridged (flagged) in lowfi. Showing all four
  // variants documents the surface AND, in lowfi, the per-variant bridge flag.
  Alert: (system) => (
    <div>
      <Canonical name="Alert" system={system} variant="info" title="Information">
        A general informational message.
      </Canonical>
      <Canonical name="Alert" system={system} variant="success" title="Success">
        The action completed successfully.
      </Canonical>
      <Canonical name="Alert" system={system} variant="warning" title="Warning">
        Something needs your attention.
      </Canonical>
      <Canonical name="Alert" system={system} variant="error" title="Error">
        Something went wrong.
      </Canonical>
    </div>
  ),
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
  Table: (system) => <TableDemo system={system} />,
  Image: { w: 240, h: 120, label: "Image" },
  // Real DS icon-name vocabulary at both sizes, plus two semantic tones. The glyph is a
  // token-sized stand-in (the DS icon fonts are not vendored — see systems.tsx / README).
  Icon: (system) => (
    <div className="proto__row">
      <Canonical name="Icon" system={system} iconName="checkCircle" size="medium" altText="Complete" />
      <Canonical name="Icon" system={system} iconName="edit" size="small" altText="Edit" />
      <Canonical name="Icon" system={system} iconName="warning" size="medium" tone="warning" altText="Warning" />
      <Canonical name="Icon" system={system} iconName="error" size="medium" tone="error" altText="Error" />
    </div>
  ),
  IconButton: (system) => (
    <div className="proto__row">
      <Canonical name="IconButton" system={system} iconName="bookmark" iconSize="medium" label="Bookmark" />
      <Canonical name="IconButton" system={system} iconName="download" iconSize="small" label="Download" />
    </div>
  ),
};
