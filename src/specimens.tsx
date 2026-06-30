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
  // one45-2020s renders headerless (icon + title on white); legacy adds a grey header band.
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
  // Alert is native in one45-2020s + legacy and bridged (flagged) in lowfi. Showing all four
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
  // Avatar is legacy-only → native in legacy + lowfi, a flagged bridge build in one45-2020s.
  // Both shapes + sizes document the surface AND, in one45-2020s, the per-shape bridge flag.
  Avatar: (system) => (
    <div className="proto__row">
      <Canonical name="Avatar" system={system} personName="Amara Okafor" />
      <Canonical name="Avatar" system={system} personName="Daniel Reyes" size="lg" />
      <Canonical name="Avatar" system={system} shape="card" personName="Priya Nair" />
    </div>
  ),
  // List is native in lowfi / one45-2020s / one45-legacy and a flagged bridge interim in
  // acuity-canon (the package ships no List). All three variants document the surface AND, in
  // acuity-canon, the per-list bridge flag. Plain items are links (the legacy .list-widget +
  // 2020s flex-list reality).
  List: (system) => (
    <div className="proto__stack">
      <Canonical name="List" system={system} variant="bulleted" items={["Gradable activity", "Learner summary", "Assessment history"]} />
      <Canonical name="List" system={system} variant="numbered" items={["Complete the form", "Review your answers", "Submit for review"]} />
      <Canonical
        name="List"
        system={system}
        variant="plain"
        items={[
          { label: "View details", href: "#" },
          { label: "Edit profile", href: "#" },
        ]}
      />
    </div>
  ),
  // Accordion is native in lowfi / one45-2020s / one45-legacy and a flagged bridge interim in
  // acuity-canon (the ADS package exports no Accordion). Single-open by default — opening one
  // panel closes the others; the first panel starts open. In acuity-canon the whole accordion
  // carries the per-bridge "AI approx" flag.
  Accordion: (system) => (
    <Canonical
      name="Accordion"
      system={system}
      items={[
        { header: "Eligibility", body: <p className="proto__text">Applicants must have completed the prerequisite coursework and hold a valid registration.</p>, defaultOpen: true },
        { header: "Required documents", body: <p className="proto__text">A transcript, two references, and a personal statement are submitted through the portal.</p> },
        { header: "Key dates", body: <p className="proto__text">Applications open in September and close at the end of November.</p> },
      ]}
    />
  ),
  // Tree is native in lowfi / one45-2020s / one45-legacy and a flagged bridge interim in
  // acuity-canon (the ADS package ships no Tree). Parent nodes show a disclosure chevron that
  // rotates open; children indent under their parent. The root starts expanded.
  Tree: (system) => (
    <Canonical
      name="Tree"
      system={system}
      nodes={[
        {
          id: "pediatrics",
          label: "Pediatrics",
          defaultExpanded: true,
          children: [
            {
              id: "foundations",
              label: "Foundations of care",
              children: [
                { id: "history", label: "History taking" },
                { id: "exam", label: "Physical examination" },
              ],
            },
            {
              id: "acute",
              label: "Acute presentations",
              children: [{ id: "resus", label: "Resuscitation" }],
            },
          ],
        },
      ]}
    />
  ),
  // Timeline is one45-2020s-only: native in one45-2020s + lowfi (sketch), a flagged bridge interim
  // in one45-legacy + acuity-canon (neither ships a history/timeline). Dated entries down a marker
  // rail — the modern app's EPA status-history surface.
  Timeline: {
    entries: [
      { date: "12 Mar", title: "Assessment submitted", description: "Mini-CEX submitted for review.", status: "Complete" },
      { date: "14 Mar", title: "Feedback returned", description: "Preceptor returned feedback and a rating.", status: "Reviewed" },
      { date: "20 Mar", title: "Sign-off pending", description: "Awaiting final supervisor sign-off.", status: "In progress" },
    ],
  },
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
