import type Spice from "./Spice";
import SpiceComponents from "./SpiceComponents";

class Pepper implements Spice {
  name: string = "Pfeffer";
  description: string = "Pfeffer ist ein anderes Standardgewürz";
  spiceComponents: SpiceComponents[] = [
    SpiceComponents.component1,
    SpiceComponents.component3,
    SpiceComponents.component4,
  ];
  color: number[] = [156, 121, 98];
}

export default Pepper;
