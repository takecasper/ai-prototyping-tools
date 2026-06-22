// Renderer.tsx — renders the active prototype's current screen.

import { usePrototypes } from "./context";

export function PrototypeRenderer() {
  const { currentScreen } = usePrototypes();
  const Screen = currentScreen.Component;
  return <Screen />;
}
