import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Mastix implements Spice {
  name: string = "Mastix";
  nameSymbol: string = "Mx";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CAMPHEN,
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Duftende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Duftende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Reis,
    PairingTag.Käse,
    PairingTag.Sahne,
    PairingTag.Fleisch,
    PairingTag.Hühnchen,
    PairingTag.Äpfel,
    PairingTag.Feigen,
    PairingTag.Pistazien,
    PairingTag.Mandeln,
    PairingTag.Grüner_Kardamom,
    PairingTag.Piment,
    PairingTag.Granatapfel,
    PairingTag.Spinat,
    PairingTag.Muskatnuss,
    PairingTag.Basilikum,
    PairingTag.Zitronenschale,
    PairingTag.Feta,
    PairingTag.Rote_Beete,
    PairingTag.Pinienkerne,
    PairingTag.Rettich,
    PairingTag.Pistazien,
    PairingTag.Ziegenkäse,
    PairingTag.Himbeeren,
    PairingTag.Weiße_Schokolade,
    PairingTag.Rosmarin,
  ]
}

export default Mastix;
