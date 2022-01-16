import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Anardana implements Spice {
  name: string = "Anardana";
  nameSymbol: string = "Ad";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CAREN,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.HEXANAL,
    AromaCompounds.LIMONEN,
    AromaCompounds.ÄPFELSÄURE,
    AromaCompounds.ÄPFELSÄURE,
    AromaCompounds.MYRCEN,
    AromaCompounds.TANNINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süßsaure_Säuren;
  color: AromaGroupsColors = AromaGroupsColors.Süßsaure_Säuren;
}

export default Anardana;
