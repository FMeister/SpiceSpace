import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Galgant implements Spice {
  name: string = "Galgant";
  nameSymbol: string = "Ga";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.KAMPFER,
    AromaCompounds.CINEOL,
    AromaCompounds.CINEOL,
    AromaCompounds.ALPHA_FENCHOL,
    AromaCompounds.GALANGALACETAT,
    AromaCompounds.ZIMTSÄUREMETHYLESTER,
  ];
  aromaGroup: AromaGroups = AromaGroups.Durchdringende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Durchdringende_Terpene;
}

export default Galgant;
