import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Muskatbluete implements Spice {
  name: string = "Muskatblüte";
  nameSymbol: string = "Mb";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ELEMICIN,
    AromaCompounds.EUGENOL,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.MYRISTICIN,
    AromaCompounds.PINENE,
    AromaCompounds.SABINEN,
    AromaCompounds.SAFROL,
    AromaCompounds.TERPINENE,
    AromaCompounds.TERPINEOL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Süßkartoffeln,
    PairingTag.Karotten,
    PairingTag.Kohl,
    PairingTag.Kürbis,
    PairingTag.Blumenkohl,
    PairingTag.Käse,
    PairingTag.Milchprodukte,
    PairingTag.Eier,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Lamm,
    PairingTag.Kalb,
    PairingTag.Schwein,
    PairingTag.Äpfel,
    PairingTag.Mango,
    PairingTag.Curry,
    PairingTag.Rhabarbar,
    PairingTag.Vanille,
    PairingTag.Pfirsiche,
    PairingTag.Birne,
    PairingTag.Zimt,
  ]
}

export default Muskatbluete;
