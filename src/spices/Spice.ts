import type SpiceComponents from "./SpiceComponents";

interface Spice {
  name: string;
  description: string;
  spiceComponents: SpiceComponents[];
  color: number[];
}

export default Spice;
