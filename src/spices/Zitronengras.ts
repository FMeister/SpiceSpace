import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Zitronengras implements Spice {
  name: string = "Zitronengras";
  nameSymbol: string = "Zg";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.CITRAL,
    AromaCompounds.CITRAL,
    AromaCompounds.GERANIOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.NEROL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Zitrustönige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Zitrustönige_Terpene;
}

export default Zitronengras;
