import type AromaCompounds from "./AromaCompounds";
import type AromaGroups from "./AromaGroups";
import type AromaGroupsColors from "./AromaGroupsColors";

interface Spice {
  name: string;
  nameSymbol: string;
  description: string;
  aromaCompounds: AromaCompounds[];
  aromaGroup: AromaGroups;
  color: AromaGroupsColors;
}

export default Spice;
