import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Safran implements Spice {
  name: string = "Safran";
  nameSymbol: string = "Sa";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.LANIERON,
    AromaCompounds.PICROCROCIN,
    AromaCompounds.PICROCROCIN,
    AromaCompounds.PINENE,
    AromaCompounds.SAFRANAL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Einzigartige_Stoffe;
  color: AromaGroupsColors = AromaGroupsColors.Einzigartige_Stoffe;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Lauch,
    PairingTag.Pilze,
    PairingTag.Spinat,
    PairingTag.Kürbis,
    PairingTag.Kartoffeln,
    PairingTag.Karotten,
    PairingTag.Fenchel,
    PairingTag.Rhabarbar,
    PairingTag.Reis,
    PairingTag.Milchprodukte,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Kaninchen,
    PairingTag.Hühnchen,
    PairingTag.Tomaten,
    PairingTag.Orange,
    PairingTag.Mandeln,
    PairingTag.Honig,
    PairingTag.Weiße_Schokolade,
    PairingTag.Sardinen,
    PairingTag.Blumenkohl,
    PairingTag.Pinienkerne,
    PairingTag.Rosinen,
    PairingTag.Fenchel,
    PairingTag.Chili,
    PairingTag.Zitronenschale,
    PairingTag.Parmesan,
    PairingTag.Sahne,
    PairingTag.Schalotten,
    PairingTag.Limette,
    PairingTag.Papaya,
    PairingTag.Käse,
  ]
}

export default Safran;
