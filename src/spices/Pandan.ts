import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Pandan implements Spice {
  name: string = "Pandan";
  nameSymbol: string = "Pd";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Fisch,
    PairingTag.Hühnchen,
    PairingTag.Reis,
    PairingTag.Milchprodukte,
    PairingTag.Kokosnuss,
    PairingTag.Cashewnüsse,
    PairingTag.Curry,
    PairingTag.Käse,
    PairingTag.Risotto,
    PairingTag.Garnelen,
    PairingTag.Zitronengras,
    PairingTag.Chili,
    PairingTag.Thai_Basilikum,
    PairingTag.Galgant,
  ]
}

export default Pandan;
