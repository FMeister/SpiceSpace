import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Chili implements Spice {
  name: string = "Chili";
  nameSymbol: string = "Ch";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CAPSAICIN,
    AromaCompounds.CAPSAICIN,
    AromaCompounds.CAPSAICINOIDE,
    AromaCompounds.ESTERVERBINDUNGEN,
    AromaCompounds.FURFURAL,
    AromaCompounds.HEXANAL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Mais,
    PairingTag.Süßkartoffeln,
    PairingTag.Maniok,
    PairingTag.Frischkäse,
    PairingTag.Bananen,
    PairingTag.Tomaten,
    PairingTag.Avocado,
    PairingTag.Gurke,
    PairingTag.Fisch,
    PairingTag.Tropische_Früchte,
    PairingTag.Zitrusfrüchte,
    PairingTag.Cashewnüsse,
    PairingTag.Schokolade,
    PairingTag.Kimchi,
    PairingTag.Melone,
    PairingTag.Feta,
    PairingTag.Minze,
    PairingTag.Kürbis,
    PairingTag.Lotuswurzel,
    PairingTag.Linsen,
    PairingTag.Paprika,
  ]
}

export default Chili;
