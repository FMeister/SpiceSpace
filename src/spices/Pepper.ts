import type Spice from "./Spice";

class Pepper implements Spice {
  name: string = "Pfeffer";
  goesWellWith: Spice[] = [];
  description: string = "Pfeffer ist ein anderes Standardgewürz";
}

export default Pepper;
