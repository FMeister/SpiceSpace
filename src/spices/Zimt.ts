import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Zimt implements Spice {
  name: string = "Zimt";
  nameSymbol: string = "Zi";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.EUGENOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
}

export default Zimt;
