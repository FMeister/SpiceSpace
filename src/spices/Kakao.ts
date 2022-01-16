import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Kakao implements Spice {
  name: string = "Kakao";
  nameSymbol: string = "Ka";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.DIMETHYLPYRAZIN,
    AromaCompounds.ESTERVERBINDUNGEN,
    AromaCompounds.FURANEOL,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.PHENOLVERBINDUNGEN,
    AromaCompounds.PHENYLACETALDEHYD,
  ];
  aromaGroup: AromaGroups = AromaGroups.Fruchtige_Aldehyde;
  color: AromaGroupsColors = AromaGroupsColors.Fruchtige_Aldehyde;
}

export default Kakao;
