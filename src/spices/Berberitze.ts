import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import type PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Berberitze implements Spice {
  name: string = "Berberitze";
  nameSymbol: string = "Be";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANISALDEHYD,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.HEXANAL,
    AromaCompounds.HEXANAL,
    AromaCompounds.LINALOOL,
    AromaCompounds.ÄPFELSÄURE,
    AromaCompounds.NONANAL,
    AromaCompounds.WEINSÄURE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Fruchtige_Aldehyde;
  color: AromaGroupsColors = AromaGroupsColors.Fruchtige_Aldehyde;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[];
}

export default Berberitze;
