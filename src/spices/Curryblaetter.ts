import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Curryblaetter implements Spice {
  name: string = "Curryblätter";
  nameSymbol: string = "Cu";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.HEXANAL,
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PHENYLETHANTHIOL,
    AromaCompounds.PHENYLETHANTHIOL,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Schwefelverbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Schwefelverbindungen;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Gemüse,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Eier,
    PairingTag.Butter,
    PairingTag.Hühnchen,
    PairingTag.Lamm,
    PairingTag.Fisch,
    PairingTag.Meeresfrüchte,
    PairingTag.Zitrusfrüchte,
    PairingTag.Fladenbrot,
    PairingTag.Curry,
    PairingTag.Rührei,
    PairingTag.Grüne_Papaya,
    PairingTag.Pomelo,
    PairingTag.Kürbis,
  ];
}

export default Curryblaetter;
