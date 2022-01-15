import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class GruenerKardamom implements Spice {
  name: string = "Grüner Kardamom";
  nameSymbol: string = "-";
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
}

export default GruenerKardamom;
