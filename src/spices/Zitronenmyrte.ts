import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Zitronenmyrte implements Spice {
  name: string = "Zitronenmyrte";
  nameSymbol: string = "Zm";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CITRAL,
    AromaCompounds.CITRAL,
    AromaCompounds.CITRONELLAL,
    AromaCompounds.CYCLOCITRAL,
    AromaCompounds.HEPTANON,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.SULCATON,
  ];
  aromaGroup: AromaGroups = AromaGroups.Zitrustönige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Zitrustönige_Terpene;
}

export default Zitronenmyrte;
