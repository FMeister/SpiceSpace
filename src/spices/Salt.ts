import type Spice from "./Spice";
import SpiceComponents from "./SpiceComponents";

class Salt implements Spice {
  name: string = "Salz";
  description: string = "Salz ist ein einfaches Gewürz.";
  spiceComponents: SpiceComponents[] = [
    SpiceComponents.component1,
    SpiceComponents.component2,
  ];
}

export default Salt;
