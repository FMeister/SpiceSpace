import type Spice from "./Spice";
import type AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class NoSpice implements Spice {
  name: string = "Kein Gewürz ausgewählt";
  nameSymbol: string = "No";
  description: string = "Wählen Sie ein Gewürz aus";
  aromaCompounds: AromaCompounds[] = [];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
}

export default NoSpice;
