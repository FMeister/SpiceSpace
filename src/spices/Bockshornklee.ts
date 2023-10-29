import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Bockshornklee implements Spice {
  name: string = "Bockshornklee";
  nameSymbol: string = "Bo";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.EUGENOL,
    AromaCompounds.SOTOLON,
    AromaCompounds.VINYLAMYLKETON,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
  spice_group:SpiceGroup = SpiceGroup.Scharf;
  goes_well_with:PairingTag[]=[
    PairingTag.Süßkartoffeln,
    PairingTag.Kartoffeln,
    PairingTag.Kürbis,
    PairingTag.Kohl,
    PairingTag.Grüne_Bohnen,
    PairingTag.Hülsenfrüchte,
    PairingTag.Sahne,
    PairingTag.Käse,
    PairingTag.Joghurt,
    PairingTag.Fisch,
    PairingTag.Lamm,
    PairingTag.Rind,
    PairingTag.Tomaten,
    PairingTag.Zitrusfrüchte,
    PairingTag.Walnüsse,
    PairingTag.Fladenbrot,
    PairingTag.Rosinen,
    PairingTag.Zimt,
    PairingTag.Kreuzkümmel,
    PairingTag.Fenchel,
    PairingTag.Koriander,
    PairingTag.Curry,
    PairingTag.Schwarzer_Pfeffer,
    PairingTag.Senf,
  ]
}

export default Bockshornklee;
