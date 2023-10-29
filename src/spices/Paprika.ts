import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Paprika implements Spice {
  name: string = "Paprika";
  nameSymbol: string = "Pa";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.ACETOIN,
    AromaCompounds.CAPSAICIN,
    AromaCompounds.ZITRONENSÄURE,
    AromaCompounds.ESSIGESTER,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.ÄPFELSÄURE,
    AromaCompounds.PYRAZINVERBINDUNGEN,
    AromaCompounds.PYRAZINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Röstige_Pysazine;
  color: AromaGroupsColors = AromaGroupsColors.Röstige_Pysazine;
  spice_group:SpiceGroup = SpiceGroup.Pikant;
  goes_well_with:PairingTag[]=[
    PairingTag.Kohl,
    PairingTag.Kartoffeln,
    PairingTag.Pilze,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Couscous,
    PairingTag.Eier,
    PairingTag.Milchprodukte,
    PairingTag.Fisch,
    PairingTag.Meeresfrüchte,
    PairingTag.Fleisch,
    PairingTag.Artischocken,
    PairingTag.Gurke,
    PairingTag.Pflaumen,
    PairingTag.Paella,
    PairingTag.Gulasch,
    PairingTag.Oktopus,
    PairingTag.Tomaten,
    PairingTag.Petersilie,
    PairingTag.Knoblauch,
    PairingTag.Lorbeer,
    PairingTag.Kokosnuss,
    PairingTag.Limette,
    PairingTag.Chili,
    PairingTag.Käse,
  ]
}

export default Paprika;
