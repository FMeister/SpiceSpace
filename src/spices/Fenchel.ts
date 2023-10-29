import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Fenchel implements Spice {
  name: string = "Fenchelsamen";
  nameSymbol: string = "Fs";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANETHOL,
    AromaCompounds.ANETHOL,
    AromaCompounds.ESTRAGOL,
    AromaCompounds.FENCHON,
    AromaCompounds.LIMONEN,
    AromaCompounds.PINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Rote_Beete,
    PairingTag.Karotten,
    PairingTag.Fenchel,
    PairingTag.Kohl,
    PairingTag.Rosenkohl,
    PairingTag.Schwein,
    PairingTag.Rind,
    PairingTag.Kaninchen,
    PairingTag.Fisch,
    PairingTag.Avocado,
    PairingTag.Steinfrüchte,
    PairingTag.Zitrusfrüchte,
    PairingTag.Curry,
    PairingTag.Mandeln,
    PairingTag.Käse,
    PairingTag.Tomaten,
    PairingTag.Rosmarin,
    PairingTag.Honig,
    PairingTag.Chili,
    PairingTag.Blattgemüse,
    PairingTag.Knoblauch,
    PairingTag.Weißwein,
    PairingTag.Orange,
    PairingTag.Senf,
    PairingTag.Oliven,
  ]
}

export default Fenchel;
