import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Ingwer implements Spice {
  name: string = "Ingwer";
  nameSymbol: string = "In";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.CITRAL,
    AromaCompounds.CURCUMIN,
    AromaCompounds.GERANIOL,
    AromaCompounds.GINGEROL,
    AromaCompounds.GINGEROL,
    AromaCompounds.LINALOOL,
    AromaCompounds.SHOGAOL,
    AromaCompounds.SHOGAOL,
    AromaCompounds.ZINGIBEREN,
    AromaCompounds.ZINGIBEREN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Kürbis,
    PairingTag.Kohl,
    PairingTag.Gemüse,
    PairingTag.Rhabarbar,
    PairingTag.Eier,
    PairingTag.Milchprodukte,
    PairingTag.Fisch,
    PairingTag.Meeresfrüchte,
    PairingTag.Schwein,
    PairingTag.Tomaten,
    PairingTag.Birne,
    PairingTag.Tropische_Früchte,
    PairingTag.Erdnüsse,
    PairingTag.Sesam,
    PairingTag.Dunkle_Schokolade,
    PairingTag.Honig,
  ]
}

export default Ingwer;
