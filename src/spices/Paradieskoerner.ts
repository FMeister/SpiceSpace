import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Paradieskoerner implements Spice {
  name: string = "Paradieskörner";
  nameSymbol: string = "Pk";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.GINGEROL,
    AromaCompounds.HUMULON,
    AromaCompounds.PARADOL,
    AromaCompounds.PARADOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Schwarzer_Pfeffer,
    PairingTag.Langer_Pfeffer,
    PairingTag.Wurzelgemüse,
    PairingTag.Kürbis,
    PairingTag.Reis,
    PairingTag.Bohnen,
    PairingTag.Haferflocken,
    PairingTag.Käse,
    PairingTag.Sahne,
    PairingTag.Fisch,
    PairingTag.Fleisch,
    PairingTag.Aubergine,
    PairingTag.Tomaten,
    PairingTag.Orange,
    PairingTag.Pomelo,
    PairingTag.Grapefruit,
    PairingTag.Äpfel,
    PairingTag.Erdnüsse,
    PairingTag.Nelken,
    PairingTag.Safran,
    PairingTag.Ingwer,
    PairingTag.Grüner_Kardamom,
    PairingTag.Haselnüsse,
    PairingTag.Knoblauch,
  ]
}

export default Paradieskoerner;
