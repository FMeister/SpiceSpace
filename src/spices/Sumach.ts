import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Sumach implements Spice {
  name: string = "Sumach";
  nameSymbol: string = "Su";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.CEMBREN,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.ÄPFELSÄURE,
    AromaCompounds.ÄPFELSÄURE,
    AromaCompounds.NONANAL,
    AromaCompounds.PINENE,
    AromaCompounds.TANNINVERBINDUNGEN,
    AromaCompounds.WEINSÄURE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süßsaure_Säuren;
  color: AromaGroupsColors = AromaGroupsColors.Süßsaure_Säuren;
}

export default Sumach;
