import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

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
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Spinat,
    PairingTag.Minze,
    PairingTag.Kichererbsen,
    PairingTag.Linsen,
    PairingTag.Reis,
    PairingTag.Linsen,
    PairingTag.Reis,
    PairingTag.Joghurt,
    PairingTag.Käse,
    PairingTag.Fisch,
    PairingTag.Hühnchen,
    PairingTag.Lamm,
    PairingTag.Tomaten,
    PairingTag.Gurke,
    PairingTag.Zitrusfrüchte,
    PairingTag.Aubergine,
    PairingTag.Walnüsse,
    PairingTag.Fenchel,
    PairingTag.Rettich,
    PairingTag.Granatapfel,
    PairingTag.Ananas,
    PairingTag.Feta,
    PairingTag.Rotweinessig,
    PairingTag.Feigen,
    PairingTag.Mais,
    PairingTag.Datteln,
    PairingTag.Tahini,
  ]
}

export default Sumach;
