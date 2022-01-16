import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Mohn implements Spice {
  name: string = "Mohn";
  nameSymbol: string = "Mo";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.KAMPFER,
    AromaCompounds.EUGENOL,
    AromaCompounds.GYLKOSID_VERBINDUNGEN,
    AromaCompounds.HEXANAL,
    AromaCompounds.LIMONEN,
    AromaCompounds.PENTYLFURAN,
    AromaCompounds.PENTYLFURAN,
    AromaCompounds.PHENOLVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.VINYLAMYLKETON,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
}

export default Mohn;
