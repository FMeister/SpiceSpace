import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Wacholder implements Spice {
  name: string = "Wacholder";
  nameSymbol: string = "Wa";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.GERANIOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINEOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Duftende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Duftende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Rote_Beete,
    PairingTag.Kohl,
    PairingTag.Artischocken,
    PairingTag.Wurzelgemüse,
    PairingTag.Ingwer,
    PairingTag.Oliven,
    PairingTag.Salbei,
    PairingTag.Reis,
    PairingTag.Käse,
    PairingTag.Wildfleisch,
    PairingTag.Ente,
    PairingTag.Hase,
    PairingTag.Gans,
    PairingTag.Wachteln,
    PairingTag.Fisch,
    PairingTag.Äpfel,
    PairingTag.Zitrusfrüchte,
    PairingTag.Schwarze_Johannisbeeren,
    PairingTag.Getrocknete_Früchte,
    PairingTag.Dunkle_Schokolade,
    PairingTag.Lachs,
    PairingTag.Kaninchen,
    PairingTag.Makrele,
    PairingTag.Tiramisu,
  ];
}

export default Wacholder;
