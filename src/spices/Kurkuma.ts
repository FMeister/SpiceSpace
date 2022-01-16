import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Kurkuma implements Spice {
  name: string = "Kurkuma";
  nameSymbol: string = "Ku";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.CITRAL,
    AromaCompounds.AR_TURMERON,
    AromaCompounds.AR_TURMERON,
    AromaCompounds.ZINGIBEREN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
}

export default Kurkuma;
