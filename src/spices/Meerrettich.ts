import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Meerrettich implements Spice {
  name: string = "Meerrettich";
  nameSymbol: string = "Mr";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Pastinaken,
    PairingTag.Pilze,
    PairingTag.Erbsen,
    PairingTag.Kartoffeln,
    PairingTag.Karotten,
    PairingTag.Wurzelgemüse,
    PairingTag.Rote_Beete,
    PairingTag.Staudensellerie,
    PairingTag.Rucola,
    PairingTag.Sahne,
    PairingTag.Eier,
    PairingTag.Muscheln,
    PairingTag.Fisch,
    PairingTag.Schwein,
    PairingTag.Rind,
    PairingTag.Gurke,
    PairingTag.Tomaten,
    PairingTag.Avocado,
    PairingTag.Äpfel,
    PairingTag.Sahne,
    PairingTag.Thymian,
    PairingTag.Käse,
    PairingTag.Walnüsse,
  ]
}

export default Meerrettich;
