import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Senf implements Spice {
  name: string = "Senf";
  nameSymbol: string = "Se";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ACETYL_PYRROLIN,
    AromaCompounds.FURFURYLTHIOL,
    AromaCompounds.ISOTHIOCYANATE,
    AromaCompounds.ISOTHIOCYANATE,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.METHYLBUTANAL,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Schwefelverbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Schwefelverbindungen;
}

export default Senf;
