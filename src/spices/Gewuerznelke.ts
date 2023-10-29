import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import type PairingTag from "./PairingTag";

class Gewuerznelke implements Spice {
  name: string = "Gewürznelke";
  nameSymbol: string = "Gn";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.EUGENOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.SALICYLSÄUREMETHYLESTER,
    AromaCompounds.TERPINEOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[];
}

export default Gewuerznelke;
