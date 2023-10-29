import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Vanille implements Spice {
  name: string = "Vanille";
  nameSymbol: string = "Va";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANISALDEHYD,
    AromaCompounds.HYDROXYBENZALDEHYD,
    AromaCompounds.PIPERONAL,
    AromaCompounds.VANILLIN,
    AromaCompounds.VANILLIN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Kürbis,
    PairingTag.Süßkartoffeln,
    PairingTag.Spinat,
    PairingTag.Ingwer,
    PairingTag.Rhabarbar,
    PairingTag.Kokosnusscreme,
    PairingTag.Eier,
    PairingTag.Hühnchen,
    PairingTag.Lamm,
    PairingTag.Schalentiere,
    PairingTag.Tomaten,
    PairingTag.Bananen,
    PairingTag.Steinfrüchte,
    PairingTag.Beeren,
    PairingTag.Ananas,
    PairingTag.Zitrusfrüchte,
    PairingTag.Kaffee,
    PairingTag.Nüsse,
    PairingTag.Kirschen,
    PairingTag.Muscheln,
    PairingTag.Pfirsiche,
    PairingTag.Rotwein,
  ]
}

export default Vanille;
