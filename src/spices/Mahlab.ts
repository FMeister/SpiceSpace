import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

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
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Fleisch,
    PairingTag.Tonkabohnen,
    PairingTag.Steinfrüchte,
    PairingTag.Aprikosen,
    PairingTag.Pistazien,
    PairingTag.Kirschen,
    PairingTag.Mandeln,
    PairingTag.Rose,
  ]
}

export default Mahlab;
