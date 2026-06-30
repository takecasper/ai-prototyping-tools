// coverage.ts — Code Connect coverage manifest (DE-422).
//
// Records how each CANONICAL piece relates to the engineering Acuity Design
// System's Figma library, "Acuity Design system - CANONICAL"
// (libraryKey lk-4a0722da…). This is the source-of-truth the .figma.tsx Code
// Connect files (../../code-connect/) are authored from, and the coverage +
// gap record the ticket asks for. It is data only — it imports nothing from
// Figma and is never rendered, so it stays node-safe and build-cheap.
//
// Component keys were read first-hand from the live library via the remote
// Figma MCP (search_design_system scoped to the library key) on 2026-06-30.
// Nothing here is guessed: a piece whose Figma node was not located sits in
// CANONICAL_FIGMA_UNRESOLVED, not in a fabricated mapping.
//
// Scope: this manifest is authored locally and NOT yet published. Publishing
// (which flips get_code_connect_map off `{}`) writes Code Connect records onto
// the engineering-owned library and needs the per-component node URLs resolved
// first — see ../../code-connect/README.md.
import type { CanonicalName } from "../systems";

export interface CodeConnectMapping {
  /** The tool's canonical piece (the code side of the connection). */
  canonical: CanonicalName;
  /** Layer name of the component in the Figma library. */
  figmaComponentName: string;
  /** Figma componentKey (verified via the remote MCP), 40-hex. */
  figmaComponentKey: string;
  /** The ADS package export the canonical skin renders (context for authoring). */
  adsExport: string;
}

// First slice — canonical pieces with a cleanly located Figma component in the
// canonical library. The code side of every connection is the tool's resolver
// (<Canonical name="…">), so generated output reuses our piece, not raw markup.
export const CODE_CONNECT_MAPPINGS: CodeConnectMapping[] = [
  { canonical: "Button", figmaComponentName: "atoms / actions / button", figmaComponentKey: "28aad5fc5f17a96e6f1b25707ced7f25921c42ef", adsExport: "Button" },
  { canonical: "IconButton", figmaComponentName: "atoms / action / icon-button", figmaComponentKey: "2a1b3e70206a106ac52f18a3b433179843daf146", adsExport: "IconButton" },
  { canonical: "Card", figmaComponentName: "molecules / content / card", figmaComponentKey: "9a4e7d314b04c6846f134c5f3c106050739a439e", adsExport: "Card" },
  { canonical: "Textarea", figmaComponentName: "atoms / forms / textarea", figmaComponentKey: "50a0bff492c00127a8ff0b4e6303d53160f9b4bb", adsExport: "Textarea" },
  { canonical: "Checkbox", figmaComponentName: "ions / forms / checkbox-with-label", figmaComponentKey: "cceef91e48d1a3be0acc052478e188427f4af6b3", adsExport: "Checkbox" },
  { canonical: "Radio", figmaComponentName: "ions / forms / radio-button", figmaComponentKey: "5c12125ea5334c9121f0ec5a0826b4c4bac64762", adsExport: "Radio" },
  { canonical: "Tabs", figmaComponentName: "molecules / navigation / tablist", figmaComponentKey: "4e591cd47d07c9a14ddb8e2ea269f8916ce1a2aa", adsExport: "Tabs" },
  { canonical: "Link", figmaComponentName: "atoms / content / link", figmaComponentKey: "d9c2884454e00e02bffa608b71f44dbad9fa1447", adsExport: "Link" },
  { canonical: "Modal", figmaComponentName: "molecule / content / modal", figmaComponentKey: "00692c165bd8468a4bf5fb18ce1e31db1dd407fa", adsExport: "Modal" },
];

// Coverage gaps — canonical pieces the canonical system (the ADS package) ships
// no component for. The runtime resolver already bridges these (INTERIM_BUILDS,
// flagged when annotations are on); there is no Figma component to connect, so
// they are recorded, not mapped. Mirrors the on-ramp spec's coverage deficit.
export const CANONICAL_FIGMA_GAPS: CanonicalName[] = [
  "Toggle",
  "SearchField",
  "Breadcrumb",
  "Table",
  "Avatar",
  "List",
  "Accordion",
  "Tree",
  "Timeline",
  "Image",
];

// Unresolved — the canonical system HAS these (the ADS package exports them),
// but a fuzzy library search did not surface a single clean Figma component to
// connect this pass. Not a coverage gap; a follow-up resolution step. Recorded
// honestly rather than mapped to a guessed node.
//   TextField / Select — ADS TextInput / Dropdown; the library exposes the
//     dropdown *icon*, not a form-control component, under this search.
//   Badge / Alert — ADS Badge / Alert; no matching library component surfaced.
//   Icon — ADS Icon; the library models icons as many individual `ions / …`
//     components rather than one Icon node, so it needs a deliberate mapping.
export const CANONICAL_FIGMA_UNRESOLVED: CanonicalName[] = [
  "TextField",
  "Select",
  "Badge",
  "Alert",
  "Icon",
];

export function mappedCanonicalNames(): CanonicalName[] {
  return CODE_CONNECT_MAPPINGS.map((m) => m.canonical);
}
