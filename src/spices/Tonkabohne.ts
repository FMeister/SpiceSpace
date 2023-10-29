import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Tonkabohne implements Spice {
  name: string = "Tonkabohne";
  nameSymbol: string = "Tb";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Knollensellerie,
    PairingTag.Reis,
    PairingTag.Sahne,
    PairingTag.Milchprodukte,
    PairingTag.Eier,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Hühnchen,
    PairingTag.Kokosnuss,
    PairingTag.Tomaten,
    PairingTag.Äpfel,
    PairingTag.Steinfrüchte,
    PairingTag.Hühnchen,
    PairingTag.Tropische_Früchte,
    PairingTag.Beeren,
    PairingTag.Zitrusfrüchte,
    PairingTag.Nüsse,
    PairingTag.Schokolade,
    PairingTag.Kaffee,
    PairingTag.Nelken,
    PairingTag.Bananen,
    PairingTag.Erdbeeren,
    PairingTag.Grüner_Kardamom,
    PairingTag.Limette,
    PairingTag.Rotwein,
    PairingTag.Knoblauch,
    PairingTag.Salbei,
  ]
}

export default Tonkabohne;
