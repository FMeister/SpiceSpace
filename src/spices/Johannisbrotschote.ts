import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Johannisbrotschote implements Spice {
  name: string = "Johannisbrotschote";
  nameSymbol: string = "Jo";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.FARNESENE,
    AromaCompounds.FURANEOL,
    AromaCompounds.CAPRONSÄURE,
    AromaCompounds.CAPRONSÄURE,
    AromaCompounds.VALERIANSÄURE,
    AromaCompounds.VALERIANSÄURE,
    AromaCompounds.PYRAZINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süßsaure_Säuren;
  color: AromaGroupsColors = AromaGroupsColors.Süßsaure_Säuren;
}

export default Johannisbrotschote;
