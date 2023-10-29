import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class GruenerKardamom implements Spice {
  name: string = "Grüner Kardamom";
  nameSymbol: string = "Gka";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.CINEOL,
    AromaCompounds.ALPHA_FENCHOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Durchdringende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Durchdringende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Kohl,
    PairingTag.Karotten,
    PairingTag.Safran,
    PairingTag.Reis,
    PairingTag.Eier,
    PairingTag.Sahne,
    PairingTag.Milchprodukte,
    PairingTag.Lamm,
    PairingTag.Ente,
    PairingTag.Hühnchen,
    PairingTag.Birne,
    PairingTag.Aprikosen,
    PairingTag.Bananen,
    PairingTag.Mango,
    PairingTag.Schokolade,
    PairingTag.Kaffee,
    PairingTag.Mandeln,
    PairingTag.Aprikosen,
    PairingTag.Vanille,
    PairingTag.Zitronenschale,
    PairingTag.Limette,
    PairingTag.Koriander,
    PairingTag.Rosenblätter,
    PairingTag.Passionsfrucht,
  ]
}

export default GruenerKardamom;
