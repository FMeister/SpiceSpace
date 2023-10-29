import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import type PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Mohrenpfeffer implements Spice {
  name: string = "Mohrenpfeffer";
  nameSymbol: string = "Mp";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.FENCHON,
    AromaCompounds.FENCHON,
    AromaCompounds.GERANIOL,
    AromaCompounds.GERMACREN,
    AromaCompounds.LINALOOL,
    AromaCompounds.PINENE,
    AromaCompounds.VANILLIN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Durchdringende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Durchdringende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[];
}

export default Mohrenpfeffer;
