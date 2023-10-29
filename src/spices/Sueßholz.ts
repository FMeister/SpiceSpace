import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Sueßholz implements Spice {
  name: string = "Süßholz";
  nameSymbol: string = "Sü";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANETHOL,
    AromaCompounds.CINEOL,
    AromaCompounds.ESTRAGOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.GLYCYRRHIZIN,
    AromaCompounds.GLYCYRRHIZIN,
    AromaCompounds.LINALOOL,
    AromaCompounds.PHENOLVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Spargel,
    PairingTag.Fenchel,
    PairingTag.Rhabarbar,
    PairingTag.Minze,
    PairingTag.Fleisch,
    PairingTag.Wildfleisch,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Beeren,
    PairingTag.Äpfel,
    PairingTag.Birne,
    PairingTag.Steinfrüchte,
    PairingTag.Bananen,
    PairingTag.Zitrusfrüchte,
    PairingTag.Mandeln,
    PairingTag.Schokolade,
    PairingTag.Vanille,
    PairingTag.Pflaumen,
    PairingTag.Kirschen,
  ]
}

export default Sueßholz;
