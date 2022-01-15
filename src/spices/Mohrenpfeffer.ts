import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Mohrenpfeffer implements Spice {
  name: string = "Mohrenpfeffer";
  nameSymbol: string = "-";
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
}

export default Mohrenpfeffer;
