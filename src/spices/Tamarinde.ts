import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Tamarinde implements Spice {
  name: string = "Tamarinde";
  nameSymbol: string = "Ta";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.FURFURAL,
    AromaCompounds.FURFURAL,
    AromaCompounds.GERANIOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PHENYLACETALDEHYD_2,
    AromaCompounds.PHENYLACETALDEHYD_2,
    AromaCompounds.WEINSÄURE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süßsaure_Säuren;
  color: AromaGroupsColors = AromaGroupsColors.Süßsaure_Säuren;
}

export default Tamarinde;
