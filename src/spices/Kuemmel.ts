import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Kuemmel implements Spice {
  name: string = "Kümmel";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARVEOL,
    AromaCompounds.S_CARVON,
    AromaCompounds.S_CARVON,
    AromaCompounds.LIMONEN,
    AromaCompounds.PINENE,
    AromaCompounds.SABINEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
}

export default Kuemmel;
