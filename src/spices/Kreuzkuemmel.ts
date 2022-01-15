import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Kreuzkuemmel implements Spice {
  name: string = "Kreuzkümmel";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CUMINALDEHYD,
    AromaCompounds.CUMINALDEHYD,
    AromaCompounds.CYMOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Erdige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Erdige_Terpene;
}

export default Kreuzkuemmel;
