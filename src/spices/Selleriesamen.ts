import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Selleriesamen implements Spice {
  name: string = "Selleriesamen";
  nameSymbol: string = "Si";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.HUMULEN,
    AromaCompounds.LIMONEN,
    AromaCompounds.SEDANOLID,
    AromaCompounds.SEDANOLID,
    AromaCompounds.SELINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Käse,
    PairingTag.Eier,
    PairingTag.Fisch,
    PairingTag.Rind,
    PairingTag.Schwein,
    PairingTag.Hühnchen,
    PairingTag.Fisch,
    PairingTag.Zucchini,
    PairingTag.Curry,
    PairingTag.Mangold,
    PairingTag.Tahini,
    PairingTag.Joghurt,
  ]
}

export default Selleriesamen;
