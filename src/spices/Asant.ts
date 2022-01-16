import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Asant implements Spice {
  name: string = "Asant";
  nameSymbol: string = "As";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.EUDESMOL,
    AromaCompounds.FERULASÄURE,
    AromaCompounds.OCIMENE,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.PINENE,
    AromaCompounds.SULFIDVERBINDUNGEN,
    AromaCompounds.SULFIDVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Schwefelverbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Schwefelverbindungen;
}

export default Asant;
