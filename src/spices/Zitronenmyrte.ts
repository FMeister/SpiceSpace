import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import type PairingTag from "./PairingTag";

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
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[];
}

export default Zitronenmyrte;
