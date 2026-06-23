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
  // Navigation slice — token-driven. Tabs/Link/Pagination are shared across all
  // systems; Breadcrumb is legacy-only (the Acuity DS ships none → bridge fills it,
  // the mirror of acuity-only Badge).
  | "Tabs"
  | "Link"
  | "Breadcrumb"
  // Feedback & status slice — Modal is token-driven and shared across all systems.
  | "Modal";
export type SystemId = "lowfi" | "acuity" | "one45-legacy";

// The documentation slices the gallery groups by. New canonical pieces slot into
// their slice automatically — adding a piece is just giving it a `category`.
export type Slice =
  | "Actions & containers"
  | "Inputs & controls"
  | "Navigation"
  | "Feedback & status"
  | "Media";

// Slice render order in the gallery.
export const SLICES: Slice[] = [
  "Actions & containers",
  "Inputs & controls",
  "Navigation",
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
  { name: "Card", label: "Card", category: "Actions & containers", description: "Content container with optional title", props: "title?, children" },
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

const Card: Skin = ({ children, title }) => (
  <div className="sk-card">
    {title ? <div className="sk-card__title">{title}</div> : null}
    <div className="sk-card__body">{children}</div>
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
    skins: { Button, Card, ...FORM_CONTROLS, ...NAV_CONTROLS, ...FEEDBACK_CONTROLS, Breadcrumb, Image: LowfiImage, Icon: LowfiIcon, IconButton: LowfiIconButton },
  },
  acuity: {
    id: "acuity",
    label: "Acuity (One45 modern)",
    blurb:
      "One45's modern design system, rebuilt from its real token set: Lato, the acuity-blue family, an 8-family colour scale. The deliberate system worth carrying forward.",
    // Breadcrumb is deliberately absent: the Acuity DS package ships no Breadcrumb
    // component (zero usages recovered from the islands), so it resolves through the
    // bridge to a flagged AI build — the mirror of legacy lacking Alert.
    skins: { Button, Card, Badge, Alert, ...FORM_CONTROLS, ...NAV_CONTROLS, ...FEEDBACK_CONTROLS, Image: BrandImage, Icon: BrandIcon, IconButton: BrandIconButton },
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
    skins: { Button, Card, Alert, ...FORM_CONTROLS, ...NAV_CONTROLS, ...FEEDBACK_CONTROLS, Breadcrumb, Image: BrandImage, Icon: BrandIcon, IconButton: BrandIconButton },
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
