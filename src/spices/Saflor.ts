import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Saflor implements Spice {
  name: string = "Saflor";
  nameSymbol: string = "Sf";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Kohl,
    PairingTag.Wurzelgemüse,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Hühnchen,
    PairingTag.Fisch,
    PairingTag.Aubergine,
    PairingTag.Tomaten,
    PairingTag.Zucchini,
    PairingTag.Gurke,
    PairingTag.Zitrusfrüchte,
    PairingTag.Chicoree,
    PairingTag.Tomaten,
    PairingTag.Senf,
    PairingTag.Zitrone,
    PairingTag.Schwarzerkümmel,
    PairingTag.Minze,
    PairingTag.Weiße_Bohnen,
    PairingTag.Knoblauch,
    PairingTag.Thymian,
    PairingTag.Parmesan,
    PairingTag.Zimt,
    PairingTag.Sahne,
    PairingTag.Honig,
    PairingTag.Ricotta,
    PairingTag.Rose,
  ]
}

export default Saflor;
