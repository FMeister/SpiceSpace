import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Zitronengras implements Spice {
  name: string = "Zitronengras";
  nameSymbol: string = "Zg";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.CITRAL,
    AromaCompounds.CITRAL,
    AromaCompounds.GERANIOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.NEROL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Zitrustönige_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Zitrustönige_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Pilze,
    PairingTag.Bambussprossen,
    PairingTag.Lotuswurzel,
    PairingTag.Wurzelgemüse,
    PairingTag.Karotten,
    PairingTag.Nudeln,
    PairingTag.Fisch,
    PairingTag.Schwein,
    PairingTag.Rind,
    PairingTag.Hühnchen,
    PairingTag.Tomaten,
    PairingTag.Kokosnuss,
    PairingTag.Kokosnusscreme,
    PairingTag.Zitrusfrüchte,
    PairingTag.Fisch,
    PairingTag.Curry,
    PairingTag.Muscheln,
    PairingTag.Schalotten,
    PairingTag.Knoblauch,
    PairingTag.Ingwer,
    PairingTag.Chili,
    PairingTag.Galgant,
    PairingTag.Thai_Basilikum,
    PairingTag.Garnelen,
    PairingTag.Kebab,
    PairingTag.Koriander,
  ]
}

export default Zitronengras;
