import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Muskatnuss implements Spice {
  name: string = "Muskatnuss";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.GERANIOL,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.PINENE,
    AromaCompounds.SABINEN,
    AromaCompounds.SAFROL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
}

export default Muskatnuss;
