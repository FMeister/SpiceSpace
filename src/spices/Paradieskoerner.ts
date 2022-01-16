import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Paradieskoerner implements Spice {
  name: string = "Paradieskörner";
  nameSymbol: string = "Pk";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.GINGEROL,
    AromaCompounds.HUMULON,
    AromaCompounds.PARADOL,
    AromaCompounds.PARADOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
}

export default Paradieskoerner;
