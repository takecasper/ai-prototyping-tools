/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { open: true },
  // Vitest: pure-logic + markup tests for the resolver/bridge invariant (DE-470).
  // The catalogue (systems.tsx) statically imports the real ADS package, which pulls
  // a CSS asset at module load — inline it so Vite handles the import and stub CSS so
  // the node-environment tests never touch a real stylesheet.
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
    server: { deps: { inline: [/@takecasper\/acuity-design-system/] } },
  },
});
