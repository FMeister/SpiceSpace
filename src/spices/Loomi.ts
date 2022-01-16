import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Loomi implements Spice {
  name: string = "Loomi";
  nameSymbol: string = "Lo";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CITRAL,
    AromaCompounds.CITRAL,
    AromaCompounds.FENCHON,
    AromaCompounds.HUMULEN,
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.METHOXYCOUMARIN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Zitrustönige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Zitrustönige_Terpene;
}

export default Loomi;
