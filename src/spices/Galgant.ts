import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Galgant implements Spice {
  name: string = "Galgant";
  nameSymbol: string = "Ga";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.KAMPFER,
    AromaCompounds.CINEOL,
    AromaCompounds.CINEOL,
    AromaCompounds.ALPHA_FENCHOL,
    AromaCompounds.GALANGALACETAT,
    AromaCompounds.ZIMTSÄUREMETHYLESTER,
  ];
  aromaGroup: AromaGroups = AromaGroups.Durchdringende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Durchdringende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Karotten,
    PairingTag.Fenchel,
    PairingTag.Pilze,
    PairingTag.Chili,
    PairingTag.Knoblauch,
    PairingTag.Liebstöckel,
    PairingTag.Koriander,
    PairingTag.Reis,
    PairingTag.Nudeln,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Rind,
    PairingTag.Hühnchen,
    PairingTag.Kokosnuss,
    PairingTag.Zitrusfrüchte,
    PairingTag.Trauben,
    PairingTag.Birne,
    PairingTag.Curry,
    PairingTag.Grüne_Bohnen,
    PairingTag.Zitronengras,
    PairingTag.Limette,
    PairingTag.Pak_Choi,
    PairingTag.Gans,
    PairingTag.Gans,
  ]
}

export default Galgant;
