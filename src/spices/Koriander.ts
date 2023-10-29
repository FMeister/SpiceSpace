import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Koriander implements Spice {
  name: string = "Koriander";
  nameSymbol: string = "Ko";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CYMOL,
    AromaCompounds.LIMONEN,
    AromaCompounds.LINALOOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.PINENE,
    AromaCompounds.TERPINENE,
  ];
  aromaGroup: AromaGroups = AromaGroups.Duftende_Terpene;
  color: AromaGroupsColors = AromaGroupsColors.Duftende_Terpene;
  spice_group:SpiceGroup = SpiceGroup.Erding;
  goes_well_with:PairingTag[]=[
    PairingTag.Rote_Beete,
    PairingTag.Kartoffeln,
    PairingTag.Pilze,
    PairingTag.Blattgemüse,
    PairingTag.Staudensellerie,
    PairingTag.Fenchel,
    PairingTag.Kohl,
    PairingTag.Artischocken,
    PairingTag.Blumenkohl,
    PairingTag.Grüne_Bohnen,
    PairingTag.Knoblauch,
    PairingTag.Lavendel,
    PairingTag.Hühnchen,
    PairingTag.Schwein,
    PairingTag.Ente,
    PairingTag.Wildfleisch,
    PairingTag.Blutwurst,
    PairingTag.Schalentiere,
    PairingTag.Fisch,
    PairingTag.Thunfisch,
    PairingTag.Oliven,
    PairingTag.Tomaten,
    PairingTag.Beeren,
    PairingTag.Zitrusfrüchte,
    PairingTag.Steinfrüchte,
    PairingTag.Äpfel,
    PairingTag.Kaffee,
    PairingTag.Glühwein,
    PairingTag.Gin,
    PairingTag.Dal,
    PairingTag.Curry,
    PairingTag.Eier,
    PairingTag.Schalotten,
    PairingTag.Jalapenos,
    PairingTag.Minze,
    PairingTag.Limette,
    PairingTag.Orange,
    PairingTag.Oktopus,
    PairingTag.Tintenfisch,
    PairingTag.Honig,
    PairingTag.Rose,
    PairingTag.Kreuzkümmel,
    PairingTag.Couscous,
  ]
}

export default Koriander;
