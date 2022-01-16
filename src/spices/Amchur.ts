import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Amchur implements Spice {
  name: string = "Amchur";
  nameSymbol: string = "Am";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CADINENE,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.CUBEBIN,
    AromaCompounds.LIMONEN,
    AromaCompounds.OCIMENE,
    AromaCompounds.OCIMENE,
    AromaCompounds.SELINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süßsaure_Säuren;
  color: AromaGroupsColors = AromaGroupsColors.Süßsaure_Säuren;
}

export default Amchur;
