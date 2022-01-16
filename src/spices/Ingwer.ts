import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

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
}

export default Ingwer;
