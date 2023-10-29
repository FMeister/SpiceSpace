import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Anis implements Spice {
  name: string = "Anis";
  nameSymbol: string = "An";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANETHOL,
    AromaCompounds.ANETHOL,
    AromaCompounds.ANISALDEHYD,
    AromaCompounds.ANISALKOHOL,
    AromaCompounds.ANISALKOHOL,
    AromaCompounds.ESTRAGOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.MYRCEN,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Kartoffeln,
    PairingTag.Lauch,
    PairingTag.Fenchel,
    PairingTag.Basilikum,
    PairingTag.Ingwer,
    PairingTag.Sahne,
    PairingTag.Rind,
    PairingTag.Schwein,
    PairingTag.Hühnchen,
    PairingTag.Ochsenschwanz,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Steinfrüchte,
    PairingTag.Tropische_Früchte,
    PairingTag.Zitrusfrüchte,
    PairingTag.Äpfel,
    PairingTag.Rhabarbar,
    PairingTag.Feigen,
    PairingTag.Mandeln,
    PairingTag.Schokolade,
    PairingTag.Karotten,
    PairingTag.Orange,
    PairingTag.Estragon,
    PairingTag.Tintenfisch,
    PairingTag.Speck,
    PairingTag.Grüne_Bohnen,
    PairingTag.Gurke,
  ]
}

export default Anis;
