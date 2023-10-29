import type AromaCompounds from "./AromaCompounds";
import type AromaGroups from "./AromaGroups";
import type AromaGroupsColors from "./AromaGroupsColors";
import type PairingTag from "./PairingTag";
import type SpiceGroup from "./SpiceGroup";

interface Spice {
  name: string;
  nameSymbol: string;
  description: string;
  goes_well_with:PairingTag[];
  aromaCompounds: AromaCompounds[];
  spice_group:SpiceGroup;
  aromaGroup: AromaGroups;
  color: AromaGroupsColors;
}

export default Spice;
