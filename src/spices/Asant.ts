import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Asant implements Spice {
  name: string = "Asant";
  nameSymbol: string = "As";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.EUDESMOL,
    AromaCompounds.FERULASÄURE,
    AromaCompounds.OCIMENE,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.PINENE,
    AromaCompounds.SULFIDVERBINDUNGEN,
    AromaCompounds.SULFIDVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Schwefelverbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Schwefelverbindungen;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Kohl,
    PairingTag.Blumenkohl,
    PairingTag.Okra,
    PairingTag.Pilze,
    PairingTag.Kartoffeln,
    PairingTag.Karotten,
    PairingTag.Spinat,
    PairingTag.Koriander,
    PairingTag.Minze,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Lamm,
    PairingTag.Hühnchen,
    PairingTag.Fisch,
    PairingTag.Dal,
    PairingTag.Mango,
    PairingTag.Chili,
    PairingTag.Kreuzkümmel,
    PairingTag.Grüner_Kardamom,
    PairingTag.Limette,
    PairingTag.Knoblauch,
    PairingTag.Zwiebeln,
    PairingTag.Petersilie,
    PairingTag.Käse,
    PairingTag.Lauch,
    PairingTag.Senf,
    PairingTag.Ingwer,
    PairingTag.Zimt,
  ]
}

export default Asant;
