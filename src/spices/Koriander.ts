import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Koriander implements Spice {
  name: string = "Koriander";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CYMOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Duftende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Duftende_Terpene;
}

export default Koriander;
