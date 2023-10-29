import type Spice from "./Spice";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";
import type AromaCompounds from "./AromaCompounds";

class Kubebenpfeffer implements Spice {
  name: string = "Kubebenpfeffer";
  nameSymbol: string = "Kp";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
  ];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Ingwer,
    PairingTag.Reis,
    PairingTag.Käse,
    PairingTag.Fleisch,
    PairingTag.Tomaten,
    PairingTag.Zitrusfrüchte,
    PairingTag.Getrocknete_Früchte,
    PairingTag.Sesam,
    PairingTag.Curry,
    PairingTag.Datteln,
    PairingTag.Fenchel,
    PairingTag.Thymian,
    PairingTag.Zitronenschale,
    PairingTag.Trauben,
    PairingTag.Walnüsse,
    PairingTag.Rind,
    PairingTag.Dill,
  ]
}

export default Kubebenpfeffer;
