import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Safran implements Spice {
  name: string = "Safran";
  nameSymbol: string = "Sa";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.LANIERON,
    AromaCompounds.PICROCROCIN,
    AromaCompounds.PICROCROCIN,
    AromaCompounds.PINENE,
    AromaCompounds.SAFRANAL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
}

export default Safran;
