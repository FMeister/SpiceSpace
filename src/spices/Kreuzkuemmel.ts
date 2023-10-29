import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Kreuzkuemmel implements Spice {
  name: string = "Kreuzkümmel";
  nameSymbol: string = "Kk";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CUMINALDEHYD,
    AromaCompounds.CUMINALDEHYD,
    AromaCompounds.CYMOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Erdige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Erdige_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Rote_Beete,
    PairingTag.Kohl,
    PairingTag.Blumenkohl,
    PairingTag.Dill,
    PairingTag.Koriander,
    PairingTag.Couscous,
    PairingTag.Hülsenfrüchte,
    PairingTag.Joghurt,
    PairingTag.Eier,
    PairingTag.Feta,
    PairingTag.Fisch,
    PairingTag.Lamm,
    PairingTag.Hühnchen,
    PairingTag.Rind,
    PairingTag.Avocado,
    PairingTag.Oliven,
    PairingTag.Zucchini,
    PairingTag.Aubergine,
    PairingTag.Tomaten,
    PairingTag.Zitrusfrüchte,
    PairingTag.Aprikosen,
    PairingTag.Sesam,
    PairingTag.Walnüsse,
    PairingTag.Falafel,
    PairingTag.Zitronenschale,
    PairingTag.Minze,
    PairingTag.Karotten,
    PairingTag.Granatapfel,
    PairingTag.Feigen,
  ]
}

export default Kreuzkuemmel;
