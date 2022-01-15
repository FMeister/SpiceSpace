import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Rose implements Spice {
  name: string = "Rose";
  nameSymbol: string = "-";
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
}

export default Rose;
