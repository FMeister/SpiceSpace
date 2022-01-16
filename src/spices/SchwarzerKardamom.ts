import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

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
}

export default SchwarzerKardamom;
