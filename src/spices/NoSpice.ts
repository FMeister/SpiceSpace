import type Spice from "./Spice";
import type SpiceComponents from "./SpiceComponents";

class NoSpice implements Spice {
  name: string = "Kein Gewürz ausgewählt";
  description: string = "Wählen Sie ein Gewürz aus";
  spiceComponents: SpiceComponents[] = [];
}

export default NoSpice;
