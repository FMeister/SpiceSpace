import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Mohn implements Spice {
  name: string = "Mohn";
  nameSymbol: string = "Mo";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.KAMPFER,
    AromaCompounds.EUGENOL,
    AromaCompounds.GYLKOSID_VERBINDUNGEN,
    AromaCompounds.HEXANAL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PENTYLFURAN,
    AromaCompounds.PENTYLFURAN,
    AromaCompounds.PHENOLVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.VINYLAMYLKETON,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Fenchel,
    PairingTag.Käse,
    PairingTag.Sahne,
    PairingTag.Eier,
    PairingTag.Fisch,
    PairingTag.Hühnchen,
    PairingTag.Zucchini,
    PairingTag.Gurke,
    PairingTag.Zitrusfrüchte,
    PairingTag.Birne,
    PairingTag.Mandeln,
    PairingTag.Schokolade,
    PairingTag.Gebäck,
    PairingTag.Zitrone,
    PairingTag.Karotten,
    PairingTag.Knoblauch,
    PairingTag.Walnüsse,
    PairingTag.Gurke,
    PairingTag.Pistazien,
    PairingTag.Vanille,
    PairingTag.Dunkle_Schokolade,
  ]
}

export default Mohn;
