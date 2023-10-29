import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Kokum implements Spice {
  name: string = "Kokum";
  nameSymbol: string = "Ko";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Kürbis,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Joghurt,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Tomaten,
    PairingTag.Grüne_Bohnen,
    PairingTag.Okra,
    PairingTag.Aubergine,
    PairingTag.Bananen,
    PairingTag.Kokosnuss,
    PairingTag.Granatapfel,
    PairingTag.Curry,
    PairingTag.Tintenfisch,
    PairingTag.Rote_Beete,
    PairingTag.Walnüsse,
    PairingTag.Butter,
    PairingTag.Chili,
    PairingTag.Datteln,
  ]
}

export default Kokum;
