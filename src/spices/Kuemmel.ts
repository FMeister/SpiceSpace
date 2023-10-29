import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Kuemmel implements Spice {
  name: string = "Kümmel";
  nameSymbol: string = "Kü";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARVEOL,
    AromaCompounds.S_CARVON,
    AromaCompounds.S_CARVON,
    AromaCompounds.LIMONEN,
    AromaCompounds.PINENE,
    AromaCompounds.SABINEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Weißkohl,
    PairingTag.Zwiebeln,
    PairingTag.Pilze,
    PairingTag.Weichkäse,
    PairingTag.Hühnchen,
    PairingTag.Ente,
    PairingTag.Gans,
    PairingTag.Schwein,
    PairingTag.Tomaten,
    PairingTag.Äpfel,
    PairingTag.Zitrusfrüchte,
    PairingTag.Walnüsse,
    PairingTag.Shortbread,
    PairingTag.Kohl,
    PairingTag.Sauerkraut,
    PairingTag.Gurke,
    PairingTag.Harissa,
    PairingTag.Haselnüsse,
    PairingTag.Krautsalat,
    PairingTag.Käse,
    PairingTag.Joghurt,
  ]
}

export default Kuemmel;
