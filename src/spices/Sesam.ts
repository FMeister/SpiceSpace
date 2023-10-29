import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Sesam implements Spice {
  name: string = "Sesam";
  nameSymbol: string = "Sm";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.FURFURYLTHIOL_2,
    AromaCompounds.HEXANAL,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.SESAMOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Röstige_Pysazine;
  color: AromaGroupsColors = AromaGroupsColors.Röstige_Pysazine;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Karotten,
    PairingTag.Rote_Beete,
    PairingTag.Kohl,
    PairingTag.Bohnen,
    PairingTag.Tofu,
    PairingTag.Nudeln,
    PairingTag.Käse,
    PairingTag.Meeresfrüchte,
    PairingTag.Hühnchen,
    PairingTag.Aubergine,
    PairingTag.Bananen,
    PairingTag.Äpfel,
    PairingTag.Zitrusfrüchte,
    PairingTag.Steinfrüchte,
    PairingTag.Tropische_Früchte,
    PairingTag.Honig,
    PairingTag.Sojasauce,
    PairingTag.Reisessig,
    PairingTag.Fisch,
    PairingTag.Knoblauch,
    PairingTag.Chili,
    PairingTag.Zitronenschale,
    PairingTag.Parmesan,
    PairingTag.Tahini,
    PairingTag.Aubergine,
    PairingTag.Granatapfel,
  ]
}

export default Sesam;
