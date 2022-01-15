import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Schwarzkuemmel implements Spice {
  name: string = "Schwarzkümmel";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARVACROL,
    AromaCompounds.D_CARVON,
    AromaCompounds.CYMOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PINENE,
    AromaCompounds.THYMOCHINON,
  ];
  aromaGroup: AromaGroups = AromaGroups.Erdige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Erdige_Terpene;
}

export default Schwarzkuemmel;
