import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Zitwerwurzel implements Spice {
  name: string = "Zitwerwurzel";
  nameSymbol: string = "Zw";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Gemüse,
    PairingTag.Reis,
    PairingTag.Bohnen,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Hühnchen,
    PairingTag.Schwein,
    PairingTag.Kokosnuss,
    PairingTag.Kokosnusscreme,
    PairingTag.Mango,
    PairingTag.Ingwer,
    PairingTag.Passionsfrucht,
    PairingTag.Chili,
    PairingTag.Koriander,
    PairingTag.Basilikum,
    PairingTag.Avocado,
    PairingTag.Granatapfel,
    PairingTag.Limette,
    PairingTag.Papadam,
    PairingTag.Grüne_Papaya,
    PairingTag.Tintenfisch,
    PairingTag.Rucola,
  ]
}

export default Zitwerwurzel;
