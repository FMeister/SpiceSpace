import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

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
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Brokkoli,
    PairingTag.Blumenkohl,
    PairingTag.Spinat,
    PairingTag.Kichererbsen,
    PairingTag.Reis,
    PairingTag.Hühnchen,
    PairingTag.Gurke,
    PairingTag.Avocado,
    PairingTag.Tropische_Früchte,
    PairingTag.Walnüsse,
    PairingTag.Butter,
    PairingTag.Dunkle_Schokolade,
    PairingTag.Kreuzkümmel,
    PairingTag.Granatapfel,
    PairingTag.Sesam,
    PairingTag.Mango,
    PairingTag.Limette,
    PairingTag.Ente,
    PairingTag.Orange,
  ]
}

export default Anardana;
