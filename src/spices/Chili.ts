import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Chili implements Spice {
  name: string = "Chili";
  nameSymbol: string = "Ch";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CAPSAICIN,
    AromaCompounds.CAPSAICIN,
    AromaCompounds.CAPSAICINOIDE,
    AromaCompounds.ESTERVERBINDUNGEN,
    AromaCompounds.FURFURAL,
    AromaCompounds.HEXANAL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
}

export default Chili;
