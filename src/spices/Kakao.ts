import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";
import SpiceGroup from "./SpiceGroup";
import PairingTag from "./PairingTag";

class Kakao implements Spice {
  name: string = "Kakao";
  nameSymbol: string = "Ka";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.DIMETHYLPYRAZIN,
    AromaCompounds.ESTERVERBINDUNGEN,
    AromaCompounds.FURANEOL,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.ISOVALERALDEHYD,
    AromaCompounds.PHENOLVERBINDUNGEN,
    AromaCompounds.PHENYLACETALDEHYD,
  ];
  aromaGroup: AromaGroups = AromaGroups.Fruchtige_Aldehyde;
  color: AromaGroupsColors = AromaGroupsColors.Fruchtige_Aldehyde;
  spice_group:SpiceGroup = SpiceGroup.Zitrisch;
  goes_well_with:PairingTag[]=[
    PairingTag.Rote_Beete,
    PairingTag.Blumenkohl,
    PairingTag.Sahne,
    PairingTag.Speck,
    PairingTag.Fleisch,
    PairingTag.Tomaten,
    PairingTag.Avocado,
    PairingTag.Kokosnuss,
    PairingTag.Bananen,
    PairingTag.Zitrusfrüchte,
    PairingTag.Steinfrüchte,
    PairingTag.Beeren,
    PairingTag.Nüsse,
    PairingTag.Kaffee,
    PairingTag.Chili,
    PairingTag.Pilze,
    PairingTag.Rose,
    PairingTag.Erdbeeren,
    PairingTag.Ziegenkäse,
    PairingTag.Kirschen,
  ]
}

export default Kakao;
