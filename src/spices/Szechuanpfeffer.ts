import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Szechuanpfeffer implements Spice {
  name: string = "Szechuan Pfeffer";
  nameSymbol: string = "Sz";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.GERANIOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.SANSHOOL,
    AromaCompounds.SANSHOOL,
    AromaCompounds.TERPINEOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Pilze,
    PairingTag.Blattgemüse,
    PairingTag.Tofu,
    PairingTag.Nudeln,
    PairingTag.Dan_Dan_Nudeln,
    PairingTag.Eier,
    PairingTag.Fleisch,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Gin_Tonic,
    PairingTag.Zimt,
    PairingTag.Pflaumen,
    PairingTag.Süßkartoffeln,
    PairingTag.Ente,
    PairingTag.Pak_Choi,
    PairingTag.Litschi,
    PairingTag.Orangenblüten,
    PairingTag.Gnocchi,
    PairingTag.Chinakohl,
  ]
}

export default Szechuanpfeffer;
