import type Spice from "./Spice";
import SpiceComponents from "./SpiceComponents";

class Test2 implements Spice {
  name: string = "Test2";
  description: string = "Test2";
  spiceComponents: SpiceComponents[] = [
    SpiceComponents.component3,
    SpiceComponents.component4,
  ];
}

export default Test2;
