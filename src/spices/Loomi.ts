import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Loomi implements Spice {
  name: string = "Loomi";
  nameSymbol: string = "Lo";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CITRAL,
    AromaCompounds.CITRAL,
    AromaCompounds.FENCHON,
    AromaCompounds.HUMULEN,
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.METHOXYCOUMARIN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Zitrustönige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Zitrustönige_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Hülsenfrüchte,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Lamm,
    PairingTag.Hühnchen,
    PairingTag.Schwein,
    PairingTag.Rind,
    PairingTag.Tomaten,
    PairingTag.Gurke,
    PairingTag.Nüsse,
    PairingTag.Weiße_Bohnen,
    PairingTag.Ingwer,
    PairingTag.Avocado,
    PairingTag.Dill,
    PairingTag.Cayennepfeffer,
    PairingTag.Chili,
    PairingTag.Granatapfel,
    PairingTag.Minze,
    PairingTag.Safran,
    PairingTag.Couscous,
    PairingTag.Linsen,
  ]
}

export default Loomi;
