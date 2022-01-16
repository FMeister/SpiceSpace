import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Selleriesamen implements Spice {
  name: string = "Selleriesamen";
  nameSymbol: string = "Si";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.HUMULEN,
    AromaCompounds.LIMONEN,
    AromaCompounds.SEDANOLID,
    AromaCompounds.SEDANOLID,
    AromaCompounds.SELINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
}

export default Selleriesamen;
