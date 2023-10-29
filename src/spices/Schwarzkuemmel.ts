import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Schwarzkuemmel implements Spice {
  name: string = "Schwarzkümmel";
  nameSymbol: string = "Sk";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARVACROL,
    AromaCompounds.D_CARVON,
    AromaCompounds.CYMOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PINENE,
    AromaCompounds.THYMOCHINON,
  ];
  aromaGroup: AromaGroups = AromaGroups.Erdige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Erdige_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Rote_Beete,
    PairingTag.Hülsenfrüchte,
    PairingTag.Eier,
    PairingTag.Ziegenkäse,
    PairingTag.Lamm,
    PairingTag.Rind,
    PairingTag.Hühnchen,
    PairingTag.Tomaten,
    PairingTag.Mozzarella,
    PairingTag.Basilikum,
    PairingTag.Rührei,
    PairingTag.Feta,
    PairingTag.Granatapfel,
    PairingTag.Minze,
    PairingTag.Kichererbsen,
    PairingTag.Zitronenschale,
    ]
}

export default Schwarzkuemmel;
