import type Spice from "./Spice";
import AromaCompounds from "./AromaCompounds";
import AromaGroups from "./AromaGroups";
import AromaGroupsColors from "./AromaGroupsColors";

class Cassia_Zimt implements Spice {
  name: string = "Cassia-Zimt";
  nameSymbol: string = "Ca";
  description: string = "";
  aromaCompounds: AromaCompounds[] = [
    AromaCompounds.KAMPFER,
    AromaCompounds.CINEOL,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.ZIMTALDEHYD,
    AromaCompounds.COUMARIN,
    AromaCompounds.HEPTANON,
    AromaCompounds.TANNINVERBINDUNGEN,
  ];
  aromaGroup: AromaGroups = AromaGroups.Süß_wärmende_Phenole;
  color: AromaGroupsColors = AromaGroupsColors.Süß_wärmende_Phenole;
}

export default Cassia_Zimt;
