import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Sesam implements Spice {
  name: string = "Sesam";
  nameSymbol: string = "Sm";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.FURFURYLTHIOL_2,
    AromaCompounds.HEXANAL,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.SESAMOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Röstige_Pysazine;
  color: AromaGroupsColors = AromaGroupsColors.Röstige_Pysazine;
}

export default Sesam;
