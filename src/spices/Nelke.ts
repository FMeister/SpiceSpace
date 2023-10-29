import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Nelke implements Spice {
  name: string = "Nelke";
  nameSymbol: string = "Nk";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Rotkohl,
    PairingTag.Kürbis,
    PairingTag.Ingwer,
    PairingTag.Reis,
    PairingTag.Milchprodukte,
    PairingTag.Lamm,
    PairingTag.Schwein,
    PairingTag.Innereien,
    PairingTag.Fisch,
    PairingTag.Hühnchen,
    PairingTag.Tomaten,
    PairingTag.Fleisch,
    PairingTag.Orange,
    PairingTag.Äpfel,
    PairingTag.Pfirsiche,
    PairingTag.Kaffee,
    PairingTag.Rum,
    PairingTag.Schinken,
    PairingTag.Zwiebeln,
    PairingTag.Rotweinessig,
    PairingTag.Weißweinessig,
    PairingTag.Mango,
    PairingTag.Rosinen,
  ]
}

export default Nelke;
