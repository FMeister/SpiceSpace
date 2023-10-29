import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Kurkuma implements Spice {
  name: string = "Kurkuma";
  nameSymbol: string = "Ku";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.CITRAL,
    AromaCompounds.AR_TURMERON,
    AromaCompounds.AR_TURMERON,
    AromaCompounds.ZINGIBEREN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Aubergine,
    PairingTag.Blattgemüse,
    PairingTag.Spinat,
    PairingTag.Ingwer,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Eier,
    PairingTag.Milchprodukte,
    PairingTag.Fisch,
    PairingTag.Lamm,
    PairingTag.Schwein,
    PairingTag.Tomaten,
    PairingTag.Zitrusfrüchte,
    PairingTag.Weiße_Schokolade,
    PairingTag.Kartoffeln,
    PairingTag.Pfeffer,
    PairingTag.Tamarinde,
    PairingTag.Datteln,
    PairingTag.Muscheln,
    PairingTag.Curryblätter,
    PairingTag.Schalotten,
    PairingTag.Knoblauch,
    PairingTag.Weißwein,
    PairingTag.Zitronenschale,
    PairingTag.Chili,
    PairingTag.Joghurt,
    PairingTag.Honig,
    PairingTag.Mandeln,
    PairingTag.Pilze,
    PairingTag.Äpfel,
    PairingTag.Kokosnuss,
    PairingTag.Kokosnusscreme,
    PairingTag.Limette,
    PairingTag.Kohl,
    PairingTag.Bockshornklee,
    PairingTag.Mais,
    PairingTag.Curry,
  ]
}

export default Kurkuma;
