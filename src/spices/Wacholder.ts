import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Wacholder implements Spice {
  name: string = "Wacholder";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.GERANIOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINEOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Duftende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Duftende_Terpene;
}

export default Wacholder;
