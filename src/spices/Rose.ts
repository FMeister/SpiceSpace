import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Rose implements Spice {
  name: string = "Rose";
  nameSymbol: string = "Ro";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CITRONELLOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.GERANIOL,
    AromaCompounds.GERANIOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.NEROL,
    AromaCompounds.ROSEN_KETONE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Duftende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Duftende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Paprika,
    PairingTag.Gurke,
    PairingTag.Milchprodukte,
    PairingTag.Käse,
    PairingTag.Eier,
    PairingTag.Lamm,
    PairingTag.Hühnchen,
    PairingTag.Fisch,
    PairingTag.Melone,
    PairingTag.Zitrusfrüchte,
    PairingTag.Beeren,
    PairingTag.Himbeeren,
    PairingTag.Steinfrüchte,
    PairingTag.Äpfel,
    PairingTag.Mandeln,
    PairingTag.Dunkle_Schokolade,
    PairingTag.Kaffee,
    PairingTag.Whiskey,
    PairingTag.Pistazien,
    PairingTag.Rettich,
    PairingTag.Feigen,
    PairingTag.Datteln,
    PairingTag.Zimt,
    PairingTag.Limette,
    PairingTag.Honig,
    PairingTag.Kümmel,
    PairingTag.Couscous,
  ]
}

export default Rose;
