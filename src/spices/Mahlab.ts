import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Mahlab implements Spice {
  name: string = "Mahlab";
  nameSymbol: string = "Ma";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.AZULEN,
    AromaCompounds.COUMARIN,
    AromaCompounds.COUMARIN,
    AromaCompounds.DIOXOLAN,
    AromaCompounds.METHOXYETHYLCINNAMAT,
    AromaCompounds.PENTANOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
}

export default Mahlab;
