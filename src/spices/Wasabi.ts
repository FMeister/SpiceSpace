import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Wasabi implements Spice {
  name: string = "Wasabi";
  nameSymbol: string = "Wb";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Rote_Beete,
    PairingTag.Kartoffeln,
    PairingTag.Erbsen,
    PairingTag.Milchprodukte,
    PairingTag.Fisch,
    PairingTag.Fleisch,
    PairingTag.Avocado,
    PairingTag.Tomaten,
    PairingTag.Äpfel,
    PairingTag.Gurke,
    PairingTag.Grüne_Bohnen,
    PairingTag.Speck,
    PairingTag.Sesam,
    PairingTag.Garnelen,
  ]
}

export default Wasabi;
