import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Senf implements Spice {
  name: string = "Senf";
  nameSymbol: string = "Se";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ACETYL_PYRROLIN,
    AromaCompounds.FURFURYLTHIOL,
    AromaCompounds.ISOTHIOCYANATE,
    AromaCompounds.ISOTHIOCYANATE,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.METHYLBUTANAL,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Schwefelverbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Schwefelverbindungen;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Kohl,
    PairingTag.Wurzelgemüse,
    PairingTag.Spinat,
    PairingTag.Eier,
    PairingTag.Käse,
    PairingTag.Hühnchen,
    PairingTag.Schwein,
    PairingTag.Rind,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Kaninchen,
    PairingTag.Tomaten,
    PairingTag.Curry,
    PairingTag.Dal,
    PairingTag.Limette,
    PairingTag.Rote_Beete,
    PairingTag.Blumenkohl,
    PairingTag.Grüne_Bohnen,
    PairingTag.Orange,
    PairingTag.Haselnüsse,
    PairingTag.Karotten,
    PairingTag.Zitronenschale,
    PairingTag.Dill,
    PairingTag.Minze,
    PairingTag.Papaya,
    ]
}

export default Senf;
