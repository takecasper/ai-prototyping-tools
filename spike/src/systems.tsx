// systems.tsx — the "puzzle pieces."
//
// Canonical components are the named pieces a prototype is authored against
// (Button, Card, Badge). Each design system provides a SKIN for the canonical
// pieces it supports. A system may NOT implement every canonical piece — that
// gap is the whole point of the bridge / graceful-degradation work.
//
// SPIKE SIMPLIFICATION: the skins here are shared, generic, token-driven
// components (their look comes entirely from the active system's CSS vars, see
// tokens.css). Real systems would ship genuinely distinct implementations. What
// the spike proves is the *mechanism*: toggle re-skins + per-system availability
// + bridge resolution — not the visual fidelity of any one system.

import type { ComponentType, ReactNode } from "react";
import { placeholderImage } from "./placeholder";

export type CanonicalName = "Button" | "Card" | "Badge" | "Image" | "Icon";
export type SystemId = "lowfi" | "modern";

export interface CanonicalDef {
  name: CanonicalName;
  label: string;
  description: string;
}

// The canonical catalogue — the only pieces a prototype is allowed to reference.
export const CANONICAL: CanonicalDef[] = [
  { name: "Button", label: "Button", description: "Primary action control" },
  { name: "Card", label: "Card", description: "Content container with optional title" },
  { name: "Badge", label: "Badge", description: "Small inline status label" },
  { name: "Image", label: "Image", description: "Placeholder image (placehold.co)" },
  { name: "Icon", label: "Icon", description: "Placeholder icon" },
];

export type Skin = ComponentType<Record<string, any> & { children?: ReactNode; title?: string }>;

// Shared, token-driven pieces (their look comes from the active system's tokens).
const Button: Skin = ({ children, ...rest }) => (
  <button className="sk-btn" {...rest}>
    {children}
  </button>
);

const Card: Skin = ({ children, title }) => (
  <div className="sk-card">
    {title ? <div className="sk-card__title">{title}</div> : null}
    <div className="sk-card__body">{children}</div>
  </div>
);

const Badge: Skin = ({ children }) => <span className="sk-badge">{children}</span>;

// Image and Icon DO differ structurally per system, so each system ships its own.
// Modern pulls a placehold.co image; low-fi draws a sketch box with no network
// request. Icons are placeholders in both systems until Acuity's real icon set
// is chosen.
const ModernImage: Skin = ({ w = 320, h = 160, label }) => (
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

const ModernIcon: Skin = ({ icon }) => (
  <span className="sk-icon sk-icon--modern" title={String(icon ?? "")}>
    {String(icon ?? "?").charAt(0).toUpperCase()}
  </span>
);

const LowfiIcon: Skin = ({ icon }) => (
  <span
    className="sk-icon sk-icon--lowfi"
    title={String(icon ?? "")}
    role="img"
    aria-label={String(icon ?? "icon")}
  />
);

export interface DesignSystem {
  id: SystemId;
  label: string;
  blurb: string;
  skins: Partial<Record<CanonicalName, Skin>>;
}

export const SYSTEMS: Record<SystemId, DesignSystem> = {
  lowfi: {
    id: "lowfi",
    label: "Low-fi wireframe",
    blurb: "A rough wireframe in the Balsamiq style. It looks deliberately unfinished, the way a draft should. No setup needed.",
    // Badge is INTENTIONALLY absent → exercises graceful degradation.
    skins: { Button, Card, Image: LowfiImage, Icon: LowfiIcon },
  },
  modern: {
    id: "modern",
    label: "Modern (One45-legacy stand-in)",
    blurb:
      "A clean placeholder system. Swap it for the real One45-legacy once we reverse-engineer it from staging.",
    skins: { Button, Card, Badge, Image: ModernImage, Icon: ModernIcon },
  },
};

export const SYSTEM_IDS = Object.keys(SYSTEMS) as SystemId[];

// The interim Claude Code would stand in when a piece has no equivalent in the
// active system. SPIKE: a heuristic — substitute the first native piece. The
// REAL tool would have Claude Code build a new component in this system's own
// language from its primitives, not reuse an unrelated piece. Either way it is
// flagged as an AI interim, never passed off as a real component.
export function interimTarget(systemId: SystemId): CanonicalName | null {
  const skins = SYSTEMS[systemId].skins;
  return CANONICAL.map((c) => c.name).find((n) => skins[n]) ?? null;
}
