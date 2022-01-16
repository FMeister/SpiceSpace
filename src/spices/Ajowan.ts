import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Ajowan implements Spice {
  name: string = "Ajowan";
  nameSymbol: string = "Aj";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CYMOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINENE,
    AromaCompounds.THYMOL,
    AromaCompounds.THYMOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
}

export default Ajowan;
