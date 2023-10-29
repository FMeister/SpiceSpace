import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Ajowan implements Spice {
  name: string = "Ajowan";
  nameSymbol: string = "Aj";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CYMOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINENE,
    AromaCompounds.THYMOL,
    AromaCompounds.THYMOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Blumenkohl,
    PairingTag.Karotten,
    PairingTag.Grüne_Bohnen,
    PairingTag.Koriander,
    PairingTag.Koriandersamen,
    PairingTag.Spinat,
    PairingTag.Reis,
    PairingTag.Hühnchen,
    PairingTag.Hülsenfrüchte,
    PairingTag.Kichererbsen,
    PairingTag.Eier,
    PairingTag.Fisch,
    PairingTag.Tomaten,
    PairingTag.Linsen,
    PairingTag.Zitronenschale,
    PairingTag.Curryblätter,
    PairingTag.Chili,
    PairingTag.Mango,
    PairingTag.Mais,
    PairingTag.Feta,
    PairingTag.Zuckererbsen,
    PairingTag.Nüsse,
    PairingTag.Buchweizen,
  ]
}

export default Ajowan;
