import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Papeda implements Spice {
  name: string = "Papeda";
  nameSymbol: string = "Pa";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Blumenkohl,
    PairingTag.Pilze,
    PairingTag.Grüne_Bohnen,
    PairingTag.Zitronengras,
    PairingTag.Schalotten,
    PairingTag.Chili,
    PairingTag.Knoblauch,
    PairingTag.Ingwer,
    PairingTag.Koriander,
    PairingTag.Minze,
    PairingTag.Reis,
    PairingTag.Fisch,
    PairingTag.Meeresfrüchte,
    PairingTag.Schwein,
    PairingTag.Hühnchen,
    PairingTag.Aubergine,
    PairingTag.Kokosnuss,
    PairingTag.Papaya,
    PairingTag.Curry,
    PairingTag.Mango,
    PairingTag.Muscheln,
    PairingTag.Kurkuma,
    PairingTag.Tomaten,
  ]
}

export default Papeda;
