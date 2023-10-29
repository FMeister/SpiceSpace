import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Sternanis implements Spice {
  name: string = "Sternanis";
  nameSymbol: string = "St";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ANETHOL,
    AromaCompounds.ANETHOL,
    AromaCompounds.CINEOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.PHELLANDREN,
    AromaCompounds.SAFROL,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Aromatisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Gemüse,
    PairingTag.Nudeln,
    PairingTag.Reis,
    PairingTag.Milchprodukte,
    PairingTag.Eier,
    PairingTag.Meeresfrüchte,
    PairingTag.Fisch,
    PairingTag.Hühnchen,
    PairingTag.Rind,
    PairingTag.Schwein,
    PairingTag.Schweinebauch,
    PairingTag.Ente,
    PairingTag.Ochsenschwanz,
    PairingTag.Rhabarbar,
    PairingTag.Steinfrüchte,
    PairingTag.Tropische_Früchte,
    PairingTag.Zitrusfrüchte,
    PairingTag.Birne,
    PairingTag.Dunkle_Schokolade,
    PairingTag.Pho,
    PairingTag.Fünf_Gewürz_Pulver,
    PairingTag.Biryani,
    PairingTag.Kaninchen,
    PairingTag.Ingwer,
    PairingTag.Garam_Masala,
    PairingTag.Schwarzerkümmel,
    PairingTag.Zimt,
    PairingTag.Ente,
    PairingTag.Pilze,
    PairingTag.Bohnensprossen,
    PairingTag.Kokosnuss,
    PairingTag.Curry,
    PairingTag.Knoblauch,
    PairingTag.Vanille,
    PairingTag.Sesam,
  ];
}

export default Sternanis;
