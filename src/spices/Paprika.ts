import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Paprika implements Spice {
  name: string = "Paprika";
  nameSymbol: string = "Pa";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ACETOIN,
    AromaCompounds.CAPSAICIN,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.ESSIGESTER,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.ÄPFELSÄURE,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Röstige_Pysazine;
  color: AromaGroupsColors = AromaGroupsColors.Röstige_Pysazine;
}

export default Paprika;
