import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Muskatbluete implements Spice {
  name: string = "Muskatblüte";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ELEMICIN,
    AromaCompounds.EUGENOL,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.PINENE,
    AromaCompounds.SABINEN,
    AromaCompounds.SAFROL,
    AromaCompounds.TERPINENE,
    AromaCompounds.TERPINEOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
}

export default Muskatbluete;
