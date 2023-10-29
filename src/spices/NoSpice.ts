import type Spice from "./Spice";
import type AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import type PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class NoSpice implements Spice {
  name: string = "Kein Gewürz ausgewählt";
  nameSymbol: string = "No";
  description: string = "Wählen Sie ein Gewürz aus";
  aromaCompounds: AromaCompounds[] = [];
  aromaGroup: AromaGroups = AromaGroups.None;
  color: AromaGroupsColors = AromaGroupsColors.None;
  spice_group:SpiceGroup = SpiceGroup.None;
  goes_well_with:PairingTag[]=[];
}

export default NoSpice;
