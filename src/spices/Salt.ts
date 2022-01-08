import type Spice from "./Spice";

class Salt implements Spice {
  name: string = "Salz";
  goesWellWith: Spice[] = [];
  description: string = "Salz ist ein einfaches Gewürz.";
}

export default Salt;
