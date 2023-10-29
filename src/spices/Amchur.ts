import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Amchur implements Spice {
  name: string = "Amchur";
  nameSymbol: string = "Am";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CADINENE,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.CUBEBIN,
    AromaCompounds.LIMONEN,
    AromaCompounds.OCIMENE,
    AromaCompounds.OCIMENE,
    AromaCompounds.SELINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süßsaure_Säuren;
  color: AromaGroupsColors = AromaGroupsColors.Süßsaure_Säuren;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Blumenkohl,
    PairingTag.Kartoffeln,
    PairingTag.Aubergine,
    PairingTag.Okra,
    PairingTag.Hülsenfrüchte,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Garnelen,
    PairingTag.Hühnchen,
    PairingTag.Lamm,
    PairingTag.Tropische_Früchte,
    PairingTag.Pakoras,
    PairingTag.Samosas,
    PairingTag.Mango,
    PairingTag.Sesam,
    PairingTag.Koriander,
    PairingTag.Koriandersamen,
    PairingTag.Limette,
    PairingTag.Butter,
    PairingTag.Senf,
    PairingTag.Zitronengras,
    PairingTag.Curryblätter,
  ]
}

export default Amchur;
