import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import type PairingTag from "./PairingTag";

class Annatto implements Spice {
  name: string = "Annatto";
  nameSymbol: string = "Ao";
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
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[];
}

export default Annatto;
