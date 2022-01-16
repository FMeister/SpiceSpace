import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Schwarzerpfeffer implements Spice {
  name: string = "Schwarzer Pfeffer";
  nameSymbol: string = "Pf";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.PINENE,
    AromaCompounds.PIPERIN,
    AromaCompounds.PIPERIN,
    AromaCompounds.ROTUNDONE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
}

export default Schwarzerpfeffer;
