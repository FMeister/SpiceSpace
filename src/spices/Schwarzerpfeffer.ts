import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Schwarzerpfeffer implements Spice {
  name: string = "Schwarzer Pfeffer";
  nameSymbol: string = "Pf";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.PINENE,
    AromaCompounds.PIPERIN,
    AromaCompounds.PIPERIN,
    AromaCompounds.ROTUNDONE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Stechende_Verbindungen;
  color: AromaGroupsColors = AromaGroupsColors.Stechende_Verbindungen;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Kartoffeln,
    PairingTag.Fenchel,
    PairingTag.Tofu,
    PairingTag.Eier,
    PairingTag.Käse,
    PairingTag.Meeresfrüchte,
    PairingTag.Fisch,
    PairingTag.Hühnchen,
    PairingTag.Lamm,
    PairingTag.Innereien,
    PairingTag.Tomaten,
    PairingTag.Zitrusfrüchte,
    PairingTag.Tropische_Früchte,
    PairingTag.Steinfrüchte,
    PairingTag.Erdbeeren,
    PairingTag.Tintenfisch,
    PairingTag.Zitrone,
    PairingTag.Ananas,
    PairingTag.Zitronengras,
    PairingTag.Rotwein,
    PairingTag.Rotweinessig,
    PairingTag.Curry,
    PairingTag.Ingwer,
    PairingTag.Erbsen,
  ]
}

export default Schwarzerpfeffer;
