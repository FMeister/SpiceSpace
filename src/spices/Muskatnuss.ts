import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Muskatnuss implements Spice {
  name: string = "Muskatnuss";
  nameSymbol: string = "Mu";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CINEOL,
    AromaCompounds.EUGENOL,
    AromaCompounds.GERANIOL,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.PINENE,
    AromaCompounds.SABINEN,
    AromaCompounds.SAFROL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Blattgemüse,
    PairingTag.Wurzelgemüse,
    PairingTag.Kohl,
    PairingTag.Pilze,
    PairingTag.Weichkäse,
    PairingTag.Käse,
    PairingTag.Avocado,
    PairingTag.Tomaten,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Hühnchen,
    PairingTag.Schwein,
    PairingTag.Lamm,
    PairingTag.Kalb,
    PairingTag.Bananen,
    PairingTag.Pflaumen,
    PairingTag.Zitrusfrüchte,
    PairingTag.Äpfel,
    PairingTag.Pfirsiche,
    PairingTag.Pistazien,
    PairingTag.Walnüsse,
    PairingTag.Kartoffeln,
    PairingTag.Vanille,
    PairingTag.Gratins,
    PairingTag.Spinat,
    PairingTag.Parmesan,
    PairingTag.Zitronenschale,
    PairingTag.Gnocchi,
    PairingTag.Kürbis,
    PairingTag.Ricotta,
    PairingTag.Salbei,
    PairingTag.Chili,
  ]
}

export default Muskatnuss;
