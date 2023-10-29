import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Tamarinde implements Spice {
  name: string = "Tamarinde";
  nameSymbol: string = "Ta";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.FURFURAL,
    AromaCompounds.FURFURAL,
    AromaCompounds.GERANIOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PHENYLACETALDEHYD_2,
    AromaCompounds.PHENYLACETALDEHYD_2,
    AromaCompounds.WEINSÄURE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süßsaure_Säuren;
  color: AromaGroupsColors = AromaGroupsColors.Süßsaure_Säuren;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Blumenkohl,
    PairingTag.Pilze,
    PairingTag.Nudeln,
    PairingTag.Bulgur,
    PairingTag.Reis,
    PairingTag.Linsen,
    PairingTag.Joghurt,
    PairingTag.Fisch,
    PairingTag.Fleisch,
    PairingTag.Okra,
    PairingTag.Aubergine,
    PairingTag.Kokosnuss,
    PairingTag.Datteln,
    PairingTag.Erdnüsse,
    PairingTag.Karotten,
    PairingTag.Zimt,
    PairingTag.Kreuzkümmel,
    PairingTag.Chili,
    PairingTag.Muscheln,
    PairingTag.Lamm,
    PairingTag.Curry,
  ]
}

export default Tamarinde;
