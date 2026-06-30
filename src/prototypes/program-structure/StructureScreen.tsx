// StructureScreen — the Program Structure entry point. Exercises the Data display slice's Tree:
// a Card holding the curriculum hierarchy (programme > years > blocks/rotations) as expandable
// nodes. Parent nodes show a disclosure chevron that rotates open; the root starts expanded.
// Tree is native in lowfi / one45-2020s / one45-legacy and a flagged bridge interim in
// acuity-canon (the ADS package ships no Tree) — so toggling to the Acuity Design System shows
// it flagged "AI approx" while the other three render plainly.

import { Canonical } from "../../resolver";
import { usePrototypes } from "../context";
import { CURRICULUM } from "./data";

export function StructureScreen() {
  const { goTo } = usePrototypes();
  return (
    <Canonical name="Card" iconName="resourceCenter" title="MD Program — curriculum structure">
      <p className="proto__text">Expand a year to see its blocks and rotations.</p>
      <Canonical name="Tree" nodes={CURRICULUM} />
      <div className="proto__actions">
        <Canonical name="Button" onClick={() => goTo("outline")}>
          View flat outline
        </Canonical>
      </div>
    </Canonical>
  );
}
