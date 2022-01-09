import type Spice from "./Spice";
import SpiceComponents from "./SpiceComponents";

class Test1 implements Spice {
  name: string = "Test1";
  description: string = "Test1";
  spiceComponents: SpiceComponents[] = [SpiceComponents.component1];
  color: number[] = [105, 148, 90];
}

export default Test1;
