import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Lorbeer implements Spice {
  name: string = "Lorbeer";
  nameSymbol: string = "Lb";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.CINEOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.GERANIOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINEOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Durchdringende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Durchdringende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Gemüse,
    PairingTag.Pilze,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Linsen,
    PairingTag.Milchprodukte,
    PairingTag.Hühnchen,
    PairingTag.Tomaten ,
    PairingTag.Steinfrüchte,
    PairingTag.Äpfel,
    PairingTag.Feigen,
    PairingTag.Dunkle_Schokolade,
    PairingTag.Brühe,
    PairingTag.Zwiebelsuppe,
    PairingTag.Fischpastete,
    PairingTag.Ragu,
    PairingTag.Pfirsiche,
    PairingTag.Pflaumen,
    PairingTag.Zitronenschale,
  ];
}

export default Lorbeer;
