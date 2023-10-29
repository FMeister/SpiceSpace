import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Akazie implements Spice {
  name: string = "Akazie";
  nameSymbol: string = "Ak";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CITRAL,
    AromaCompounds.PHENOLVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Röstige_Pysazine;
  color: AromaGroupsColors = AromaGroupsColors.Röstige_Pysazine;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Süßkartoffeln,
    PairingTag.Pilze,
    PairingTag.Reis,
    PairingTag.Eier,
    PairingTag.Fisch,
    PairingTag.Rind,
    PairingTag.Hühnchen,
    PairingTag.Lamm,
    PairingTag.Nüsse,
    PairingTag.Schokolade,
    PairingTag.Kaffee,
    PairingTag.Sahne,
    PairingTag.Schokolade,
    PairingTag.Pflaumen,
    PairingTag.Ingwer,
    PairingTag.Cashewnüsse,
    PairingTag.Rotwein,
    PairingTag.Bananen,
    PairingTag.Kokosnuss,
    ]
}

export default Akazie;
