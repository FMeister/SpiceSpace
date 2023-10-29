import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Papayakerne implements Spice {
  name: string = "Papayakerne";
  nameSymbol: string = "Pk";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Kürbis,
    PairingTag.Käse,
    PairingTag.Fisch,
    PairingTag.Fleisch,
    PairingTag.Zucchini,
    PairingTag.Tomaten,
    PairingTag.Paprika,
    PairingTag.Avocado,
    PairingTag.Zitrusfrüchte,
    PairingTag.Tropische_Früchte,
    PairingTag.Papaya,
    PairingTag.Knoblauch,
    PairingTag.Lamm,
    PairingTag.Rind,
    PairingTag.Tamarinde,
    PairingTag.Erdnüsse,
    PairingTag.Chili,
    PairingTag.Limette,
    PairingTag.Thai_Basilikum,
  ]
}

export default Papayakerne;
