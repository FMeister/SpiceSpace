import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Annatto implements Spice {
  name: string = "Annatto";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.ALPHA_COPAEN,
    AromaCompounds.ELEMAN,
    AromaCompounds.GERMACREN,
    AromaCompounds.GERMACREN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
}

export default Annatto;
