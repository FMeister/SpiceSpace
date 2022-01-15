import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Sternanis implements Spice {
  name: string = "Sternanis";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANETHOL,
    AromaCompounds.ANETHOL,
    AromaCompounds.CINEOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.SAFROL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
}

export default Sternanis;
