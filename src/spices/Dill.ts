import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Dill implements Spice {
  name: string = "Dill";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARVEOL,
    AromaCompounds.D_CARVON,
    AromaCompounds.D_CARVON,
    AromaCompounds.FENCHON,
    AromaCompounds.LIMONEN,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.TERPINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
}

export default Dill;
