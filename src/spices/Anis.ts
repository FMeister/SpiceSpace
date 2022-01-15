import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Anis implements Spice {
  name: string = "Anis";
  nameSymbol: string = "-";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANETHOL,
    AromaCompounds.ANETHOL,
    AromaCompounds.ANISALDEHYD,
    AromaCompounds.ANISALKOHOL,
    AromaCompounds.ANISALKOHOL,
    AromaCompounds.ESTRAGOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
}

export default Anis;
