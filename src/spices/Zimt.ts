import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import PairingTag from "./PairingTag";
import SpiceGroup from "./SpiceGroup";

class Zimt implements Spice {
  name: string = "Zimt";
  nameSymbol: string = "Zi";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.CARYOPHYLLENE,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.EUGENOL,
    AromaCompounds.LINALOOL,
    AromaCompounds.MYRCEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
  spice_group:SpiceGroup = SpiceGroup.Süß;
  goes_well_with:PairingTag[]=[
    PairingTag.Blattgemüse,
    PairingTag.Wurzelgemüse,
    PairingTag.Ingwer,
    PairingTag.Tamarinde,
    PairingTag.Haferflocken,
    PairingTag.Reis,
    PairingTag.Hülsenfrüchte,
    PairingTag.Couscous,
    PairingTag.Eier,
    PairingTag.Milchprodukte,
    PairingTag.Schalentiere,
    PairingTag.Fleisch,
    PairingTag.Tomaten,
    PairingTag.Aubergine,
    PairingTag.Äpfel,
    PairingTag.Tropische_Früchte,
    PairingTag.Steinfrüchte,
    PairingTag.Beeren,
    PairingTag.Orange,
    PairingTag.Kaffee,
    PairingTag.Mangold,
    PairingTag.Spinat,
    PairingTag.Pinienkerne,
    PairingTag.Rosinen,
    PairingTag.Feigen,
    PairingTag.Datteln,
    PairingTag.Granatapfel,
    PairingTag.Joghurt,
    PairingTag.Kokosnuss,
    PairingTag.Cashewnüsse,
    PairingTag.Rosenblätter,
    PairingTag.Schwarzerkümmel,
    PairingTag.Garam_Masala,
  ]
}

export default Zimt;
