// systems.tsx — the "puzzle pieces."
//
// Canonical components are the named pieces a prototype is authored against
// (Button, Card, Badge, ...). Each design system provides a SKIN for the
// canonical pieces it supports. A system may NOT implement every canonical
// piece — that gap is the whole point of the bridge / graceful-degradation work.
//
// THREE systems now ship:
//   lowfi          a zero-dependency Balsamiq-style wireframe baseline.
//   acuity         One45's modern, deliberate "Acuity" design system, rebuilt
//                  from its real token set (Lato, the acuity-* colour families).
//   one45-legacy   One45's older "one45" brand still live on auth / self-send /
//                  React-shell pages (Cabin, the $primary_purple palette).
//
// The acuity / one45-legacy tokens are reverse-engineered from the One45 staging
// repo and documented under shared/one45-design-systems/. The values here are the
// single source of truth the tool renders from; the reports cite this file.
//
// Component divergence is REAL, not cosmetic, and splits along two axes:
//   (a) different mechanism, same surface — BOTH systems ship a real Alert (Acuity
//       a dedicated DS component; legacy the .one45-alert skin over 154 WidgetBundle
//       Twig Error/* partials), so one canonical API absorbs both, rendered per
//       system (native-both).
//   (b) present vs absent — the Acuity DS ships a Badge the legacy one45 brand never
//       had (legacy's .badge-details is a profile-photo widget, not a status badge),
//       so Badge is acuity-only and toggling a Badge screen to one45-legacy makes the
//       bridge fill the gap.
// This is the anatomy-divergence question, exercised on two real systems rather than
// toy ones. (Sourced: shared/one45-design-systems/03 §4d/§4e.)

import { useEffect, useId, useRef, type ComponentType, type ReactNode } from "react";
import { placeholderImage } from "./placeholder";

export type CanonicalName =
  | "Button"
  | "Card"
  | "Badge"
  | "Alert"
  | "Image"
  | "Icon"
  | "IconButton"
  // Inputs & controls slice — token-driven, shared across all systems.
  | "TextField"
  | "Textarea"
  | "Select"
  | "Checkbox"
  | "Radio"
  | "Toggle"
  | "SearchField"
  // Navigation slice — token-driven. Tabs/Link are shared across all
  // systems; Breadcrumb is legacy-only (the Acuity DS ships none → bridge fills it,
  // the mirror of acuity-only Badge).
  | "Tabs"
  | "Link"
  | "Breadcrumb"
  // Feedback & status slice — Modal is token-driven and shared across all systems.
  | "Modal"
  // Data display slice — Table is native in all three (the Acuity DS ships no table
  // component, so its skin reproduces the real app-level table reality; legacy carries
  // the real _tables.scss skin). One canonical columns+rows+sort API across systems.
  | "Table";
export type SystemId = "lowfi" | "acuity" | "one45-legacy";

// The documentation slices the gallery groups by. New canonical pieces slot into
// their slice automatically — adding a piece is just giving it a `category`.
export type Slice =
  | "Actions & containers"
  | "Inputs & controls"
  | "Navigation"
  | "Data display"
  | "Feedback & status"
  | "Media";

// Slice render order in the gallery.
export const SLICES: Slice[] = [
  "Actions & containers",
  "Inputs & controls",
  "Navigation",
  "Data display",
  "Feedback & status",
  "Media",
];

export interface CanonicalDef {
  name: CanonicalName;
  label: string;
  description: string;
  category: Slice;
  // `props` / `notes` are the live documentation the Systems-tab gallery renders.
  // They are the single source of truth — the AGENTS.md table points here rather
  // than duplicating them, so the doc cannot drift from the catalogue.
  props: string;
  notes?: string;
}

// The canonical catalogue — the only pieces a prototype is allowed to reference,
// and the single source the gallery documents from. Add a piece here (with a
// `category`) and it appears in every system's gallery automatically.
export const CANONICAL: CanonicalDef[] = [
  { name: "Button", label: "Button", category: "Actions & containers", description: "Primary action control", props: "children, variant?, onClick", notes: "variant: primary (default) / secondary / danger / inline" },
  { name: "Card", label: "Card", category: "Actions & containers", description: "Content container (icon, title, body, footer actions)", props: "title?, iconName?, children, footer?", notes: "real DS Card surface — acuity: headerless white card (icon + title row, body, footer); legacy: a grey header band over the body; footer holds the action Buttons; iconName renders the per-system token glyph stand-in (real artwork is a recorded asset gap)" },
  { name: "IconButton", label: "Icon button", category: "Actions & containers", description: "Icon-only button (real DS iconName/iconSize API)", props: "iconName, iconSize?, label, onClick?, variant?, disabled?", notes: "iconSize: small / medium; label is the accessible name; native in all three; the glyph is a token-sized stand-in (real artwork is a recorded asset gap)" },
  { name: "Badge", label: "Badge", category: "Feedback & status", description: "Small inline status label", props: "children" },
  { name: "Alert", label: "Alert", category: "Feedback & status", description: "Inline message banner (info, success, warning, error)", props: "title?, children, variant?", notes: "variant: info (default) / success / warning / error; native in acuity + legacy (the bridge fills lowfi)" },
  { name: "TextField", label: "Text field", category: "Inputs & controls", description: "Labelled text input with validation state", props: "label, type?, value, onChange, state?, message?, helpText?, optionalityLabel?", notes: "state: default / error / success" },
  { name: "Textarea", label: "Textarea", category: "Inputs & controls", description: "Multi-line text input with validation state", props: "label, value, onChange, state?, message?, rows?", notes: "same validation surface as TextField" },
  { name: "Select", label: "Select", category: "Inputs & controls", description: "Labelled dropdown (native options)", props: "label, value, onChange, state?, message?, options", notes: "options: string[] or {value,label}[]" },
  { name: "Checkbox", label: "Checkbox", category: "Inputs & controls", description: "Single checkbox with label", props: "label, checked, onChange", notes: "brand-tinted via accent-color" },
  { name: "Radio", label: "Radio", category: "Inputs & controls", description: "Radio option (grouped by name)", props: "label, group, value, checked, onChange", notes: "group by shared name" },
  { name: "Toggle", label: "Toggle", category: "Inputs & controls", description: "On/off switch with label", props: "label, checked, onChange" },
  { name: "SearchField", label: "Search field", category: "Inputs & controls", description: "Pill search input with leading icon", props: "value, onChange, placeholder?" },
  { name: "Tabs", label: "Tabs", category: "Navigation", description: "Tabbed navigation (id-based active tab)", props: "tabs, active, onSelect, children", notes: "tabs: string[] or {id,label,badge?}[]; per-system visual model (acuity underline / legacy box tabs)" },
  { name: "Link", label: "Link", category: "Navigation", description: "Hyperlink (default / inline variant)", props: "children (or text), href?, variant?, external?", notes: "variant: default / inline; external opens a new tab" },
  { name: "Breadcrumb", label: "Breadcrumb", category: "Navigation", description: "Trail of ancestor links; legacy-only (bridge fills acuity)", props: "items", notes: "items: string[] or {label,href?}[]; last item is the current page; legacy-only" },
  { name: "Modal", label: "Modal", category: "Feedback & status", description: "Centred dialog overlay (title, body, footer actions); shared API across systems", props: "open, title?, onClose?, dismissible?, icon?, footer?, children", notes: "one API across all systems; footer holds the action Buttons; closes on Esc / scrim click when dismissible" },
  { name: "Table", label: "Table", category: "Data display", description: "Data table with sortable columns + optional row selection", props: "columns, rows, rowKey?, sort?, onSort?, selectable?, selected?, onSelectionChange?, empty?, caption?", notes: "columns: {key, header, align?, width?, sortable?, cell?}[]; table-wide sort — onSort(key) toggles; selectable adds a bulk-select column (select-all header); native in all three. The Acuity DS ships NO table component ([R] — real app tables inherit base type only over react-table), so its skin reproduces that minimal reality; legacy carries the real _tables.scss skin. One canonical API + pure token swap — the predicted data-grid API break did not happen" },
  { name: "Image", label: "Image", category: "Media", description: "Placeholder image (placehold.co)", props: "w, h, label?", notes: "never commit binary image files" },
  { name: "Icon", label: "Icon", category: "Media", description: "Named icon (real DS name/size vocabulary)", props: "iconName, size?, altText?, tone?", notes: "size: small / medium; iconName is the real DS vocabulary (add, edit, delete, checkCircle, warning…); tone: success / warning / error / info; renders a token-sized stand-in glyph — real glyph artwork is a recorded asset gap (no DS icon font is vendored)" },
];

export type Skin = ComponentType<Record<string, any> & { children?: ReactNode; title?: string }>;

// Token-driven pieces. Their look comes entirely from the active system's CSS
// vars (styles/tokens.css), so the same component renders as Acuity blue/Lato or
// one45 purple/Cabin depending on the active system — the real app's own brand
// mechanism (a root data attribute switching token sets) generalised to N systems.
// Button carries the real DS variant surface (statefulButton.jsx PropTypes:
// primary | secondary | danger | inline). Variant is a token/skin class, not a
// structural change, so it is shared across systems like the base Button.
const Button: Skin = ({ children, variant, ...rest }) => {
  const v = typeof variant === "string" ? variant : "primary";
  const cls = v === "primary" ? "sk-btn" : `sk-btn sk-btn--${v}`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
};

// Card — formalised to the real Acuity DS Card API (the Data display checklist's
// "card (formalise)" item; it lives in the Actions & containers gallery slice, a
// container). Sourced [D] from the islands (the DS Card is consumed with
// title/content/footer/iconName — domain_demo_person_info.jsx:24-90 real med-ed
// person/group panels; designSystemTest/main.jsx:307-334 demo) + [R] 2026-06-23
// (getComputedStyle on /test/designSystem, signed in): the Acuity DS Card is a
// HEADERLESS white flex-column — border 1px neutrals-light #B8B8B8, radius 8px
// (ds-rounded-lg), NO shadow, padding 24px, ~24px inter-block gap; the header row is a
// 24px icon + a Lato 20px/600/#333 (neutrals-darker) title (gap 12px, items-center);
// the footer holds action Button(s). Legacy [D]: the custom skin ships NO bespoke card
// — cards render via vendored Bootstrap + the real .dashboard-widget tile
// (one45.scss:657-715: 1px #CCC border, grey h3 title band) and the bootstrap/modal
// grey-band idiom (#f5f5f5 fill / #eee rule, _bootstrap.scss). So Card is native-both
// "different mechanism, same surface" (like Alert), and the look is a pure token swap
// EXCEPT legacy's full-bleed grey header band, the one per-system structural flourish
// (app.css) — acuity + lowfi stay headerless. The icon is the per-system token glyph
// stand-in (artwork asset gap, like Icon/Modal). Divergence axis = INVENTORY (Acuity
// owns a real Card; legacy borrows bootstrap/tile). See 01/02 L "Data display", 03 §4j.
const Card: Skin = ({ children, title, iconName, footer }) => (
  <div className="sk-card">
    {title || iconName ? (
      <div className="sk-card__head">
        {iconName ? (
          <span className="sk-icon sk-icon--brand" aria-hidden="true">
            {String(iconName).charAt(0).toUpperCase()}
          </span>
        ) : null}
        {title ? <div className="sk-card__title">{String(title)}</div> : null}
      </div>
    ) : null}
    <div className="sk-card__body">{children}</div>
    {footer ? <div className="sk-card__foot">{footer}</div> : null}
  </div>
);

const Badge: Skin = ({ children }) => <span className="sk-badge">{children}</span>;

// Native in acuity AND legacy — "different mechanism, same surface" (03 §4d/§4e):
// the Acuity DS Alert component and legacy's .one45-alert skin (over WidgetBundle
// Error/* Twig partials) absorb into ONE canonical API, rendered per system from
// tokens (acuity tinted-bg + accent border from the semantic families; legacy solid
// pale fills, radius 0, pad 16px — see app.css / tokens.css). lowfi has no Alert →
// the bridge fills it (INTERIM_BUILDS, flagged). variant ∈ info | success | warning |
// error (the legacy Error/* set and the acuity Alert `variant` prop); default info.
const Alert: Skin = ({ children, title, variant }) => {
  const v = typeof variant === "string" ? variant : "info";
  return (
    <div className={`sk-alert sk-alert--${v}`} role="status">
      {title ? <div className="sk-alert__title">{String(title)}</div> : null}
      <div className="sk-alert__body">{children}</div>
    </div>
  );
};

// ---- Inputs & controls (token-driven, shared across all three systems) ----
// These mirror the Acuity DS form API recovered from the React islands: the
// validation surface is `state` ∈ default|error|success + `message` + `helpText`
// (NOT an `error` boolean and NOT `placeholder` in the real DS) — see
// shared/one45-design-systems/01-acuity-modern.md L "Inputs". Legacy renders the
// same markup re-skinned by tokens (the old grey input look), which is why one
// canonical API holds for the whole group.

const fieldClass = (state?: string) =>
  state === "error"
    ? "sk-field sk-field--error"
    : state === "success"
      ? "sk-field sk-field--success"
      : "sk-field";

const helpToText = (helpText: unknown) =>
  Array.isArray(helpText) ? helpText.join(" ") : helpText ? String(helpText) : "";

const TextField: Skin = ({ label, state, message, helpText, optionalityLabel, id, ...rest }) => {
  const help = helpToText(helpText);
  return (
    <label className={fieldClass(state as string)} htmlFor={id ? String(id) : undefined}>
      {label ? (
        <span className="sk-field__label">
          {String(label)}
          {optionalityLabel ? <span className="sk-field__opt">{String(optionalityLabel)}</span> : null}
        </span>
      ) : null}
      <input className="sk-control" id={id ? String(id) : undefined} {...rest} />
      {help ? <span className="sk-field__help">{help}</span> : null}
      {message ? <span className="sk-field__msg">{String(message)}</span> : null}
    </label>
  );
};

const Textarea: Skin = ({ label, state, message, helpText, optionalityLabel, id, ...rest }) => {
  const help = helpToText(helpText);
  return (
    <label className={fieldClass(state as string)} htmlFor={id ? String(id) : undefined}>
      {label ? (
        <span className="sk-field__label">
          {String(label)}
          {optionalityLabel ? <span className="sk-field__opt">{String(optionalityLabel)}</span> : null}
        </span>
      ) : null}
      <textarea className="sk-control sk-textarea" id={id ? String(id) : undefined} {...rest} />
      {help ? <span className="sk-field__help">{help}</span> : null}
      {message ? <span className="sk-field__msg">{String(message)}</span> : null}
    </label>
  );
};

// Options pass as an `options` prop (array of strings, or {value,label} objects)
// so prototypes never hand-author raw <option> markup (the lint gate forbids it);
// the skin emits the <option>s. `children` is still accepted as an escape hatch.
const Select: Skin = ({ label, state, message, optionalityLabel, id, options, children, ...rest }) => {
  const opts = Array.isArray(options) ? options : null;
  return (
    <label className={fieldClass(state as string)} htmlFor={id ? String(id) : undefined}>
      {label ? (
        <span className="sk-field__label">
          {String(label)}
          {optionalityLabel ? <span className="sk-field__opt">{String(optionalityLabel)}</span> : null}
        </span>
      ) : null}
      <select className="sk-control" id={id ? String(id) : undefined} {...rest}>
        {opts
          ? opts.map((o: any) => {
              const value = typeof o === "object" ? o.value : o;
              const text = typeof o === "object" ? o.label : o;
              return (
                <option key={String(value)} value={value}>
                  {String(text)}
                </option>
              );
            })
          : children}
      </select>
      {message ? <span className="sk-field__msg">{String(message)}</span> : null}
    </label>
  );
};

const Checkbox: Skin = ({ label, children, ...rest }) => (
  <label className="sk-choice">
    <input type="checkbox" className="sk-choice__box" {...rest} />
    <span>{label ? String(label) : children}</span>
  </label>
);

// `group` maps to the input's `name` (radios group by shared name). It cannot be
// passed as `name` because that prop selects the canonical piece in <Canonical>.
const Radio: Skin = ({ label, group, children, ...rest }) => (
  <label className="sk-choice">
    <input type="radio" name={group ? String(group) : undefined} className="sk-choice__box" {...rest} />
    <span>{label ? String(label) : children}</span>
  </label>
);

const Toggle: Skin = ({ label, children, ...rest }) => (
  <label className="sk-switch">
    <input type="checkbox" role="switch" {...rest} />
    <span className="sk-switch__track">
      <span className="sk-switch__knob" />
    </span>
    <span>{label ? String(label) : children}</span>
  </label>
);

const SearchField: Skin = ({ placeholder, ...rest }) => (
  <div className="sk-search">
    <span className="sk-icon sk-icon--brand" aria-hidden="true">
      S
    </span>
    <input type="search" placeholder={placeholder ? String(placeholder) : "Search"} aria-label="Search" {...rest} />
  </div>
);

// ---- Navigation ----
// Recovered from the Acuity DS islands + the legacy skin (see
// shared/one45-design-systems/01/02 L "Navigation"). Two real divergences this group
// surfaces, both honoured rather than flattened:
//   1. API vs SKIN — the canonical id-based Tabs API absorbs both Acuity's index-based
//      API (activeTabIndex/handleTabChange, designSystemTest/main.jsx:935) AND legacy's
//      key-based .nav-tabs, so the API survives. But the VISUAL model does NOT token-swap:
//      Acuity tabs are an underline indicator (acuity-green) while legacy tabs are
//      Bootstrap BOX folder tabs. That structural difference is rendered per-system in
//      app.css (:root[data-ds="one45-legacy"] .sk-tab), not faked with one shared skin —
//      this is the first piece where pure token-swap stops being enough.
//   2. INVENTORY — the Acuity DS package ships no Breadcrumb component (zero island
//      usages), while legacy has a real chevron breadcrumb. So Breadcrumb is legacy-only
//      and the bridge fills acuity (the mirror of acuity-only Badge). Pagination is NOT
//      enshrined: neither system defines one, so fabricating it would misrepresent both.

// `tabs` is an array of strings or {id,label,badge}. The Acuity Tab `badgeText`
// (e.g. "CA"/"FR" on the live gallery) maps to `badge`. Active tab is by id, with
// onSelect(id) — index vs key is an implementation detail the canonical API hides.
const Tabs: Skin = ({ tabs, active, onSelect, children }) => {
  const list = Array.isArray(tabs) ? tabs : [];
  return (
    <div className="sk-tabs">
      <div className="sk-tabs__strip" role="tablist">
        {list.map((t: any) => {
          const id = typeof t === "object" ? t.id : t;
          const label = typeof t === "object" ? t.label : t;
          const badge = typeof t === "object" ? t.badge : undefined;
          const isActive = String(active) === String(id);
          return (
            <button
              key={String(id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={isActive ? "sk-tab is-active" : "sk-tab"}
              onClick={onSelect ? () => onSelect(id) : undefined}
            >
              {String(label)}
              {badge ? <span className="sk-tab__badge">{String(badge)}</span> : null}
            </button>
          );
        })}
      </div>
      {children ? (
        <div className="sk-tabs__panel" role="tabpanel">
          {children}
        </div>
      ) : null}
    </div>
  );
};

// Acuity Link API: `text` + `type` (default|inline) + `href`/`target`. The canonical
// piece accepts children OR `text`, and maps `type` → `variant`. `external` opens a
// new tab (the real DS pairs target=_blank with iconName="linkNewTab").
const Link: Skin = ({ children, text, href, variant, external, ...rest }) => {
  const cls = variant === "inline" ? "sk-link sk-link--inline" : "sk-link";
  return (
    <a
      className={cls}
      href={href ? String(href) : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      {...rest}
    >
      {children ?? (text ? String(text) : null)}
    </a>
  );
};

// `items` is an array of strings or {label,href}. The last item is the current page
// (not a link). Legacy renders a bespoke CSS-triangle chevron widget; the tool uses
// a flat "/"-separated trail (the chevron geometry is a recorded simplification).
const Breadcrumb: Skin = ({ items }) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <nav className="sk-crumbs" aria-label="Breadcrumb">
      {list.map((it: any, i: number) => {
        const label = typeof it === "object" ? it.label : it;
        const href = typeof it === "object" ? it.href : undefined;
        const last = i === list.length - 1;
        return (
          <span className="sk-crumbs__item" key={String(label) + i}>
            {last || !href ? (
              <span className="sk-crumbs__current" aria-current={last ? "page" : undefined}>
                {String(label)}
              </span>
            ) : (
              <a className="sk-crumbs__link" href={String(href)}>
                {String(label)}
              </a>
            )}
            {last ? null : (
              <span className="sk-crumbs__sep" aria-hidden="true">
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

// ---- Feedback & status: Modal (token-driven; the structural API-survival test) ----
// Sourced [D] from the islands + [R] from the live DS gallery (/test/designSystem,
// 2026-06-22). The Acuity DS Modal (headlessui Dialog — open/onClose/title/content/
// footer/backdrop static|dismissible/icon/iconName, confirmModal.jsx + pronounsModal.jsx)
// and the legacy react-bootstrap/Bootstrap .modal (show/onHide/Modal.Header+Title+Body+
// Footer, _bootstrap.scss + mappingModal.jsx) are the SAME surface: scrim + centred panel
// + title + body + footer actions. So ONE canonical API absorbs both — the second
// structural piece to survive after Tabs. And UNLIKE Tabs, even the header divergence
// (legacy grey band #f5f5f5 vs Acuity's headerless title on white) is PURE token swap
// (--ds-modal-header-bg/-border), so no per-system structural override is needed: both
// the single-canonical-API model AND pure token-swap survive Modal. radius / shadow /
// scrim / title size also token-swap. See shared/one45-design-systems/01/02 L "Feedback".
const Modal: Skin = ({ open, title, onClose, dismissible, icon, footer, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = typeof onClose === "function" ? (onClose as () => void) : undefined;
  // Move focus into the dialog when it opens so the change is announced and Esc works.
  useEffect(() => {
    if (open && panelRef.current) panelRef.current.focus();
  }, [open]);
  if (!open) return null;
  const canDismiss = Boolean(dismissible && close);
  return (
    <div className="sk-modal" role="presentation">
      <div className="sk-modal__scrim" onClick={canDismiss ? close : undefined} aria-hidden="true" />
      <div
        className="sk-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        ref={panelRef}
        onKeyDown={canDismiss ? (e) => { if (e.key === "Escape") close!(); } : undefined}
      >
        <div className="sk-modal__header">
          {icon ? (
            <span className="sk-icon sk-icon--brand" aria-hidden="true">
              {String(icon).charAt(0).toUpperCase()}
            </span>
          ) : null}
          {title ? (
            <span className="sk-modal__title" id={titleId}>
              {String(title)}
            </span>
          ) : null}
          {canDismiss ? (
            <button type="button" className="sk-modal__close" aria-label="Close" onClick={close}>
              ×
            </button>
          ) : null}
        </div>
        <div className="sk-modal__body">{children}</div>
        {footer ? <div className="sk-modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
};

// ---- Data display: Table (token-driven; the data-display group opener) ----
// Sourced [D] from the Acuity islands (react-table v7 over raw <table class="table
// table-hover">; the common SortableTable wrapper — columns {Header,accessor,Cell},
// table-wide useSortBy, caller-managed data/filter, optional useRowSelect bulk-select
// with onChange) + the legacy _tables.scss skin (table.report/.standard — header
// border #999, text #444, cell border #BBB, 5px padding, DataTables PNG sort arrows,
// #FEFEFE hover, no radius). [R] 2026-06-23 (signed in, getComputedStyle on staging):
// the Acuity DS ships NO table component (the /test/designSystem demo renders ZERO
// tables; the consumed-export list has none), and on the live app a bare .table gets
// NO skin — real tables inherit only body type (Lato 14px #333, th 700). The one real
// rendered Acuity table (the marksheet, admin/pages/marksOverview2.php) is
// border-collapse with 1px #666 row dividers, 11px headers, 12px bold key rows, tight
// padding. So Table is the INVENTORY divergence (Acuity owns no dedicated table; legacy
// owns a real skin) — but the canonical columns+rows+sort API SURVIVES all three and the
// look is a pure token swap. The predicted data-grid API break did NOT happen here.
// Native in all three; no bridge. The sort caret is a token-coloured text glyph (the
// legacy PNG arrow / Acuity FA caret geometry simplified — flagged, the Breadcrumb
// chevron handling). See shared/one45-design-systems/01/02 L "Data display", 03 §4i.
type TableColumn = {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  width?: string | number;
  sortable?: boolean;
  cell?: (row: any) => ReactNode;
};

const Table: Skin = ({
  columns,
  rows,
  rowKey,
  sort,
  onSort,
  selectable,
  selected,
  onSelectionChange,
  empty,
  caption,
}) => {
  const cols: TableColumn[] = Array.isArray(columns) ? columns : [];
  const data: any[] = Array.isArray(rows) ? rows : [];
  const keyOf = typeof rowKey === "function" ? rowKey : (_row: any, i: number) => String(i);

  // Sort is caller-managed (uncontrolled-with-initial, mirroring react-table v7's
  // useSortBy): `sort` is the current {key,dir}; onSort(key) asks the caller to flip it.
  const sortKey = sort && typeof sort === "object" ? sort.key : undefined;
  const sortDir = sort && typeof sort === "object" ? sort.dir : undefined;
  const canSort = typeof onSort === "function";

  // Selection mirrors the real useRowSelect bulk-select: internal-free, the caller
  // owns the selected set and is notified via onSelectionChange (the groupTable onChange).
  const selSet =
    selected instanceof Set
      ? selected
      : new Set<string>(Array.isArray(selected) ? selected.map(String) : []);
  const allKeys = data.map((r, i) => String(keyOf(r, i)));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selSet.has(k));
  const emit = typeof onSelectionChange === "function" ? onSelectionChange : undefined;
  const toggleAll = emit ? () => emit(allSelected ? [] : allKeys) : undefined;
  const toggleRow = emit
    ? (k: string) => {
        const next = new Set(selSet);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        emit([...next]);
      }
    : undefined;

  const alignClass = (a: TableColumn["align"], base: string) =>
    a === "right" ? `${base} ${base}--right` : a === "center" ? `${base} ${base}--center` : base;
  const span = cols.length + (selectable ? 1 : 0);

  return (
    <div className="sk-table-wrap">
      <table className="sk-table">
        {caption ? <caption className="sk-table__caption">{String(caption)}</caption> : null}
        <thead>
          <tr>
            {selectable ? (
              <th className="sk-table__sel" scope="col">
                <input
                  type="checkbox"
                  className="sk-choice__box"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            ) : null}
            {cols.map((c) => {
              const active = sortKey === c.key;
              const sortable = canSort && c.sortable !== false;
              const ariaSort = active ? (sortDir === "desc" ? "descending" : "ascending") : undefined;
              return (
                <th
                  key={c.key}
                  scope="col"
                  className={alignClass(c.align, "sk-table__th")}
                  style={c.width ? { width: typeof c.width === "number" ? `${c.width}px` : String(c.width) } : undefined}
                  aria-sort={ariaSort as any}
                >
                  {sortable ? (
                    <button type="button" className="sk-table__sort" onClick={() => onSort(c.key)}>
                      {c.header}
                      <span className={active ? "sk-table__caret is-active" : "sk-table__caret"} aria-hidden="true">
                        {active && sortDir === "desc" ? "▾" : "▴"}
                      </span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="sk-table__empty" colSpan={span}>
                {empty ? String(empty) : "No data."}
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const k = String(keyOf(row, i));
              const isSel = selSet.has(k);
              return (
                <tr key={k} className={isSel ? "is-selected" : undefined}>
                  {selectable ? (
                    <td className="sk-table__sel">
                      <input
                        type="checkbox"
                        className="sk-choice__box"
                        checked={isSel}
                        onChange={toggleRow ? () => toggleRow(k) : undefined}
                        aria-label={`Select row ${i + 1}`}
                      />
                    </td>
                  ) : null}
                  {cols.map((c) => (
                    <td key={c.key} className={alignClass(c.align, "sk-table__td")}>
                      {c.cell ? c.cell(row) : row[c.key] != null ? String(row[c.key]) : ""}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

// Image and Icon differ structurally per system. The brand systems pull a
// placehold.co image / draw a token-coloured glyph; low-fi draws a sketch box and
// an outline glyph with no network request.
const BrandImage: Skin = ({ w = 320, h = 160, label }) => (
  <img
    className="sk-img"
    width={Number(w)}
    height={Number(h)}
    alt={String(label ?? "placeholder")}
    src={placeholderImage(Number(w), Number(h), label ? String(label) : undefined)}
  />
);

const LowfiImage: Skin = ({ w = 320, h = 160, label }) => (
  <div
    className="sk-img sk-img--lowfi"
    style={{ width: Number(w), height: Number(h) }}
    role="img"
    aria-label={String(label ?? "image placeholder")}
  >
    <span>{String(label ?? "image")}</span>
  </div>
);

// ---- Iconography (the Iconography foundation slice) ----
// Sourced [D] from the islands + the legacy skin (shared/one45-design-systems/01/02 L
// "Iconography", 03 §4g). Acuity ships a custom NAMED icon vocabulary on a standalone
// <Icon name=… size=… altText=…> (size ∈ small | medium) plus iconName/iconSize convenience
// props on Button/IconButton/Modal/Link (designSystemTest/main.jsx). Legacy uses FontAwesome
// Pro 5.15.3 (+ famfamfam 16px PNG sprites + Semantic UI) sized 0.9rem default / 1.5rem in
// alerts, coloured by explicit palette vars per context. NEITHER system's glyph ASSETS are
// available — the Acuity DS package is not vendored, FA Pro is a paid webfont, the sprites are
// binaries we don't commit — so the real ARTWORK is a recorded asset gap (README "Gaps and
// legitimate omissions"). The tool renders a token-sized, currentColor stand-in glyph (a
// monogram for brand, a sketch box for lowfi), never passed off as the system's real icon.
// What IS faithful and enshrined: the API shape, the size scale, and the colour rule.
//
// The canonical name prop is exposed as `iconName` (not `name`) because `name` selects the
// canonical piece in <Canonical name="Icon">, the same collision Radio's `group` avoids. An
// optional `tone` (success | warning | error | info) maps to the sourced --ds-alert-*-accent
// colours (the legacy alert-icon colours are real DS values — teal/yellow/red/purple).
const iconSizeClass = (size: unknown) => (size === "small" ? "sk-icon--sm" : "sk-icon--md");
const iconToneClass = (tone: unknown) =>
  tone === "success" || tone === "warning" || tone === "error" || tone === "info"
    ? ` sk-icon--${tone}`
    : "";

const BrandIcon: Skin = ({ iconName, size, altText, tone }) => {
  const nm = String(iconName ?? "");
  const a11y = altText != null ? String(altText) : "";
  return (
    <span
      className={`sk-icon sk-icon--glyph ${iconSizeClass(size)}${iconToneClass(tone)}`}
      title={nm || undefined}
      role={a11y ? "img" : undefined}
      aria-label={a11y || undefined}
      aria-hidden={a11y ? undefined : true}
    >
      {(nm || "?").charAt(0).toUpperCase()}
    </span>
  );
};

const LowfiIcon: Skin = ({ iconName, size, altText }) => {
  const nm = String(iconName ?? "");
  const a11y = altText ? String(altText) : "";
  return (
    <span
      className={`sk-icon sk-icon--lowfi ${iconSizeClass(size)}`}
      title={nm || undefined}
      role={a11y ? "img" : undefined}
      aria-label={a11y || undefined}
      aria-hidden={a11y ? undefined : true}
    />
  );
};

// IconButton — the real Acuity DS icon-only button (iconName / iconSize small|medium / label /
// onClick / variant default / disabled, designSystemTest/main.jsx:486-521); legacy has a real
// 25×25 .icon-button (themes/one45.css:1279). Native in all three (token-driven); the inner
// glyph reuses the per-system Icon stand-in. `label` is the accessible name — the DS uses
// `label` (not aria-label), kept faithfully; it is set as aria-label on the button so the
// inner glyph stays decorative.
const BrandIconButton: Skin = ({ iconName, iconSize, label, ...rest }) => (
  <button
    type="button"
    className="sk-iconbtn"
    aria-label={label != null ? String(label) : undefined}
    title={label != null ? String(label) : undefined}
    {...rest}
  >
    <BrandIcon iconName={iconName} size={iconSize} />
  </button>
);

const LowfiIconButton: Skin = ({ iconName, iconSize, label, ...rest }) => (
  <button
    type="button"
    className="sk-iconbtn"
    aria-label={label != null ? String(label) : undefined}
    title={label != null ? String(label) : undefined}
    {...rest}
  >
    <LowfiIcon iconName={iconName} size={iconSize} />
  </button>
);

export interface DesignSystem {
  id: SystemId;
  label: string;
  blurb: string;
  skins: Partial<Record<CanonicalName, Skin>>;
}

// The Inputs & controls group is token-driven and shared by every system: the
// reverse-engineering found inputs are the SAME markup re-skinned by tokens (the
// genuine divergence is colour/border/radius, not anatomy), so one component set
// holds. This is the slice's headline result — the single-canonical-API model
// survives the whole inputs group; the anatomy divergence stays with Alert.
const FORM_CONTROLS = { TextField, Textarea, Select, Checkbox, Radio, Toggle, SearchField };

// Navigation pieces present in every system. Link re-skins purely by tokens; Tabs shares
// one API but renders a per-system VISUAL model (Acuity underline vs legacy box tabs, in
// app.css) — accurate to each system, not a flattened shared skin. Breadcrumb is NOT here:
// it is legacy-only (acuity has no breadcrumb component), added to legacy + lowfi below so
// acuity exercises the bridge.
const NAV_CONTROLS = { Tabs, Link };

// Feedback & status. Modal is token-driven and present in every system — the
// API-survival test PASSED here (one canonical Modal API absorbs the Acuity DS Dialog
// AND the legacy Bootstrap Modal, and the look is a pure token swap). Alert is NOT in
// this shared group: it is native in acuity + legacy but NOT lowfi, so it is added per
// system below (acuity + legacy skins) rather than spread into all three — the earlier
// "acuity-only + bridge" model was corrected to native-both once sourcing found legacy's
// real .one45-alert (154 Error/* Twig uses; 03 §4d/§4e). Toast, tag/chip and empty-state
// are gaps in BOTH systems → not enshrined (the Pagination rule).
const FEEDBACK_CONTROLS = { Modal };

// Data display. Table is token-driven and present in EVERY system — the first
// data-display piece, and the long-predicted "first true API break" test. Result:
// the canonical columns+rows+sort API SURVIVED all three (it absorbs the Acuity
// react-table-v7 column model AND the legacy DataTables/.report grid), and the look
// is a PURE token swap — no per-system structural override (unlike Tabs). The real
// divergence is INVENTORY, not API/skin: the Acuity DS package ships no table
// component, so its skin reproduces the minimal real app reality (Lato, #333, thin
// dividers — [R] marksOverview2.php) while legacy carries its real _tables.scss skin.
// Native in all three → never bridged (03 §4i). Toast/tag-chip/empty-state remain
// un-built both-systems gaps; the rest of the data-display group (list, accordion,
// avatar, tree, timeline, stat, code block, key-value) is a follow-up slice.
const DATA_DISPLAY = { Table };

export const SYSTEMS: Record<SystemId, DesignSystem> = {
  lowfi: {
    id: "lowfi",
    label: "Low-fi wireframe",
    blurb:
      "A rough wireframe in the Balsamiq style. It looks deliberately unfinished, the way a draft should. No setup needed.",
    // Badge and Alert are INTENTIONALLY absent → exercises graceful degradation.
    // Alert resolves to a flagged token-driven build via the bridge (INTERIM_BUILDS);
    // Badge demonstrates the older first-native-piece fallback. lowfi is the ONLY system
    // that bridges Alert now — both brand systems ship a real one. Breadcrumb IS present —
    // it is legacy-era and renders fine in the sketch skin.
    skins: { Button, Card, ...FORM_CONTROLS, ...NAV_CONTROLS, ...DATA_DISPLAY, ...FEEDBACK_CONTROLS, Breadcrumb, Image: LowfiImage, Icon: LowfiIcon, IconButton: LowfiIconButton },
  },
  acuity: {
    id: "acuity",
    label: "Acuity (One45 modern)",
    blurb:
      "One45's modern design system, rebuilt from its real token set: Lato, the acuity-blue family, an 8-family colour scale. The deliberate system worth carrying forward.",
    // Breadcrumb is deliberately absent: the Acuity DS package ships no Breadcrumb
    // component (zero usages recovered from the islands), so it resolves through the
    // bridge to a flagged AI build — the mirror of legacy lacking Alert.
    skins: { Button, Card, Badge, Alert, ...FORM_CONTROLS, ...NAV_CONTROLS, ...DATA_DISPLAY, ...FEEDBACK_CONTROLS, Image: BrandImage, Icon: BrandIcon, IconButton: BrandIconButton },
  },
  "one45-legacy": {
    id: "one45-legacy",
    label: "one45 legacy",
    blurb:
      "One45's older brand, still live on auth, self-send and React-shell pages: Cabin, the primary-purple palette. Ships a real alert and breadcrumb, but no status Badge — so the bridge fills Badge here.",
    // Alert IS native here — legacy ships a real .one45-alert (the earlier "acuity-only"
    // read was wrong; 03 §4d). Badge is NOT here — legacy has no status badge (its
    // .badge-details is a profile-photo widget), so Badge is the genuine acuity-only piece
    // and the bridge fills it. Breadcrumb IS native — the legacy app has a real (bespoke
    // chevron) breadcrumb the Acuity DS never built. Form + nav controls re-skin cleanly.
    skins: { Button, Card, Alert, ...FORM_CONTROLS, ...NAV_CONTROLS, ...DATA_DISPLAY, ...FEEDBACK_CONTROLS, Breadcrumb, Image: BrandImage, Icon: BrandIcon, IconButton: BrandIconButton },
  },
};

export const SYSTEM_IDS = Object.keys(SYSTEMS) as SystemId[];

// Bridge interim builds — the evolution of the old first-native-piece heuristic.
// When the active system has no native version of a DIVERGENT piece, the bridge
// builds THAT piece in the active system's own token language instead of substituting
// an unrelated component. These skins are token-driven, so they re-skin to whatever
// system is active (acuity-blue/Lato, one45 purple/Cabin, or the sketch) — but the
// resolver flags them as AI-built interims, never passed off as the system's real
// component. The divergent pieces with a build here:
//   Alert       native in acuity + legacy → built (flagged) for lowfi ONLY (lowfi has
//               no real alert; both brand systems do, so they render native).
//   Breadcrumb  legacy-only piece         → built (flagged) for acuity.
// A piece NOT listed here (e.g. Badge in legacy + lowfi) still falls back to the cruder
// first-native substitution below, so both bridge behaviours stay observable.
export const INTERIM_BUILDS: Partial<Record<CanonicalName, Skin>> = { Alert, Breadcrumb };

// The crude fallback the bridge uses ONLY when a missing piece has no INTERIM_BUILDS
// entry: substitute the first native piece. The real tool would always build the
// piece in this system's language (as INTERIM_BUILDS now does for the divergent
// pieces); this remains for pieces without a generic build, flagged as an AI interim.
export function interimTarget(systemId: SystemId): CanonicalName | null {
  const skins = SYSTEMS[systemId].skins;
  return CANONICAL.map((c) => c.name).find((n) => skins[n]) ?? null;
}
