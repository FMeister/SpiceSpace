import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Sueßholz implements Spice {
  name: string = "Süßholz";
  nameSymbol: string = "Sü";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANETHOL,
    AromaCompounds.CINEOL,
    AromaCompounds.ESTRAGOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.GLYCYRRHIZIN,
    AromaCompounds.GLYCYRRHIZIN,
    AromaCompounds.LINALOOL,
    AromaCompounds.PHENOLVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
}

export default Sueßholz;
