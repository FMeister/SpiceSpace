import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Dill implements Spice {
  name: string = "Dill";
  nameSymbol: string = "Di";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARVEOL,
    AromaCompounds.D_CARVON,
    AromaCompounds.D_CARVON,
    AromaCompounds.FENCHON,
    AromaCompounds.LIMONEN,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.TERPINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Wärmende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Wärmende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Wurzelgemüse,
    PairingTag.Pilze,
    PairingTag.Grüne_Bohnen,
    PairingTag.Erbsen,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Spargel,
    PairingTag.Hüttenkäse,
    PairingTag.Joghurt,
    PairingTag.Eier,
    PairingTag.Lamm,
    PairingTag.Rind,
    PairingTag.Schwein,
    PairingTag.Fisch,
    PairingTag.Schalentiere,
    PairingTag.Zucchini,
    PairingTag.Aubergine,
    PairingTag.Avocado,
    PairingTag.Äpfel,
    PairingTag.Gurke,
    PairingTag.Karotten,
    PairingTag.Weißweinessig,
    PairingTag.Senf,
    PairingTag.Kakao,
    PairingTag.Zitrone,
    PairingTag.Feta,
    PairingTag.Knoblauch,
    PairingTag.Zitronenschale,
    PairingTag.Käse,
  ]
}

export default Dill;
