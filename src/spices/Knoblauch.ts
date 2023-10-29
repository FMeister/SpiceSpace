import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Knoblauch implements Spice {
  name: string = "Knoblauch";
  nameSymbol: string = "Kn";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CAREN,
    AromaCompounds.DIALLYLTRISULFID,
    AromaCompounds.DIALLYLTRISULFID,
    AromaCompounds.DIALLYDISULFID,
    AromaCompounds.DIALLYDISULFID,
    AromaCompounds.LIMONEN,
    AromaCompounds.SABINEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Schwefelverbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Schwefelverbindungen;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Gemüse,
    PairingTag.Trüffel,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Ziegenkäse,
    PairingTag.Butter,
    PairingTag.Fleisch,
    PairingTag.Fisch,
    PairingTag.Meeresfrüchte,
    PairingTag.Nüsse,
    PairingTag.Curry,
    PairingTag.Weißwein,
    PairingTag.Ricotta,
    PairingTag.Melone,
    PairingTag.Käse,
    PairingTag.Chili,
    PairingTag.Bärlauch,
    PairingTag.Grüne_Bohnen,
  ]
}

export default Knoblauch;
