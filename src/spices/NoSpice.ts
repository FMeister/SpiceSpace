import type Spice from "./Spice";

class NoSpice implements Spice {
  name: string = "Kein Gewürz ausgewählt";
  goesWellWith: Spice[] = [];
  description: string = "Wählen Sie ein Gewürz aus";
}

export default NoSpice;
