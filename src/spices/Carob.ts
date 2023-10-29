import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Carob implements Spice {
  name: string = "Carob";
  nameSymbol: string = "Cb";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Aubergine,
    PairingTag.Vanille,
    PairingTag.Zimt,
    PairingTag.Joghurt,
    PairingTag.Milchprodukte,
    PairingTag.Lamm,
    PairingTag.Beeren,
    PairingTag.Orange,
    PairingTag.Sesam,
    PairingTag.Erdnüsse,
    PairingTag.Kaffee,
    PairingTag.Tahini,
    PairingTag.Buchweizen,
    PairingTag.Ricotta,
    PairingTag.Beeren,
    PairingTag.Hühnchen,
    PairingTag.Minze,
    PairingTag.Chili,
    PairingTag.Kokosnuss,
  ]
}

export default Carob;
