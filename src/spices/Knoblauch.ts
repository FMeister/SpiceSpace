import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Knoblauch implements Spice {
  name: string = "Knoblauch";
  nameSymbol: string = "Kn";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CAREN,
    AromaCompounds.DIALLYLTRISULFID,
    AromaCompounds.DIALLYLTRISULFID,
    AromaCompounds.DIALLYDISULFID,
    AromaCompounds.DIALLYDISULFID,
    AromaCompounds.LIMONEN,
    AromaCompounds.SABINEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Schwefelverbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Schwefelverbindungen;
}

export default Knoblauch;
