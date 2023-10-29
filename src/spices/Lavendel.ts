import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Lavendel implements Spice {
  name: string = "Lavendel";
  nameSymbol: string = "Lv";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Mais,
    PairingTag.Rhabarbar,
    PairingTag.Vanille,
    PairingTag.Weichkäse,
    PairingTag.Hühnchen,
    PairingTag.Schwein,
    PairingTag.Lamm,
    PairingTag.Feigen,
    PairingTag.Aprikosen,
    PairingTag.Beeren,
    PairingTag.Zitrusfrüchte,
    PairingTag.Walnüsse,
    PairingTag.Schokolade,
    PairingTag.Kaffee,
    PairingTag.Ricotta,
    PairingTag.Honig,
    PairingTag.Staudensellerie,
    PairingTag.Kirschen,
    PairingTag.Pflaumen,
    PairingTag.Chili,
    PairingTag.Ingwer,
    PairingTag.Rotweinessig,
    PairingTag.Weißweinessig,
  ]
}

export default Lavendel;
