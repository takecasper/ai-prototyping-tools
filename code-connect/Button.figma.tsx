// Button.figma.tsx — Code Connect example pattern (DE-422).
//
// Connects the canonical Button's Figma component to the tool's resolver, so a
// Dev-Mode "get code" / get_code_connect_map for that component hands back the
// tool's own piece — <Canonical name="Button"> — instead of regenerated markup.
//
// This is the authored PATTERN every first-slice mapping follows; the verified
// component keys for the full first set live in
// src/code-connect/coverage.ts (CODE_CONNECT_MAPPINGS).
//
// Two things must be resolved before this can be published (see README.md);
// both are deliberately left as TODOs rather than guessed:
//   1. NODE URL — figma.connect() needs the component's node URL
//      (https://figma.com/design/<libraryFileKey>/...?node-id=<id>). We have the
//      verified componentKey (below) but not the library file key / node id yet.
//   2. PROP MAPPING — figma.enum/string option names must match the Figma
//      component's actual variant properties; confirm via
//      get_context_for_code_connect before mapping. The map below is illustrative.
//
// Figma component: "atoms / actions / button"
// componentKey:    28aad5fc5f17a96e6f1b25707ced7f25921c42ef  (verified 2026-06-30)
import figma from "@figma/code-connect";
import { Canonical } from "../src/resolver";

figma.connect(
  Canonical,
  // TODO(node-url): replace with the live component URL before publishing.
  "https://www.figma.com/design/<<LIBRARY_FILE_KEY>>/Acuity-Design-system?node-id=<<NODE_ID>>",
  {
    props: {
      // TODO(props): confirm the Figma property name + option labels against the
      // component (get_context_for_code_connect) before publishing.
      variant: figma.enum("Variant", {
        Primary: "primary",
        Secondary: "secondary",
        Danger: "danger",
        Inline: "inline",
      }),
      label: figma.string("Label"),
    },
    example: ({ variant, label }) => (
      <Canonical name="Button" variant={variant}>
        {label}
      </Canonical>
    ),
  },
);
