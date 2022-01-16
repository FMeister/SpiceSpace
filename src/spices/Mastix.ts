import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Mastix implements Spice {
  name: string = "Mastix";
  nameSymbol: string = "Mx";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CAMPHEN,
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Duftende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Duftende_Terpene;
}

export default Mastix;
