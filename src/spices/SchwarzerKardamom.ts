import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class SchwarzerKardamom implements Spice {
  name: string = "Schwarzer Kardamom";
  nameSymbol: string = "Ska";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.CINEOL,
    AromaCompounds.DIMETHOXYPHENOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PINENE,
    AromaCompounds.SABINEN,
    AromaCompounds.TERPINYLACETAT,
  ];
  aromaGroup: AromaGroups = AromaGroups.Durchdringende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Durchdringende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Blattgemüse,
    PairingTag.Karotten,
    PairingTag.Kartoffeln,
    PairingTag.Erbsen,
    PairingTag.Blumenkohl,
    PairingTag.Kokosnuss,
    PairingTag.Ingwer,
    PairingTag.Reis,
    PairingTag.Linsen,
    PairingTag.Hühnchen,
    PairingTag.Ente,
    PairingTag.Speck,
    PairingTag.Rind,
    PairingTag.Lamm,
    PairingTag.Limette,
    PairingTag.Dunkle_Schokolade,
    PairingTag.Pho,
    PairingTag.Muscheln,
    PairingTag.Mais,
    PairingTag.Tomaten,
    PairingTag.Curryblätter,
    PairingTag.Chili,
    PairingTag.Rührei,
    PairingTag.Karamell,
    PairingTag.Käse,
    PairingTag.Thymian,
    PairingTag.Honig,
  ]
}

export default SchwarzerKardamom;
