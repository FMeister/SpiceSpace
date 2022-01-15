import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Vanille implements Spice {
  name: string = "Vanille";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANISALDEHYD,
    AromaCompounds.HYDROXYBENZALDEHYD,
    AromaCompounds.PIPERONAL,
    AromaCompounds.VANILLIN,
    AromaCompounds.VANILLIN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
}

export default Vanille;
