import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Piment implements Spice {
  name: string = "Piment";
  nameSymbol: string = "Pi";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Aubergine,
    PairingTag.Fleisch,
    PairingTag.Hühnchen,
    PairingTag.Fisch,
    PairingTag.Tomaten,
    PairingTag.Kokosnuss,
    PairingTag.Steinfrüchte,
    PairingTag.Zitrusfrüchte,
    PairingTag.Tropische_Früchte,
    PairingTag.Curry,
    PairingTag.Reis,
    PairingTag.Erbsen,
    PairingTag.Blumenkohl,
    PairingTag.Zwiebeln,
    PairingTag.Rosinen,
    PairingTag.Haselnüsse,
    PairingTag.Minze,
    PairingTag.Dill,
    PairingTag.Petersilie,
    PairingTag.Chili,
    PairingTag.Avocado,
    PairingTag.Käse,
    PairingTag.Lamm,
    PairingTag.Rote_Beete,
    PairingTag.Schwarzerkümmel,
    PairingTag.Orange,
    PairingTag.Mango,
  ]
}

export default Piment;
