<script>
  import SpiceContainer from "./SpiceContainer.svelte";
  import SmallSpiceContainer from "./SmallSpiceContainer.svelte";

  import SpiceDropdown from "./spices/SpiceDropdown.svelte";

  import NoSpice from "./spices/NoSpice";
  import Zimt from "./spices/Zimt";
  import Cassia_Zimt from "./spices/Cassia_Zimt";
  import Gewuerznelke from "./spices/Gewuerznelke";
  import Piment from "./spices/Piment";
  import Anis from "./spices/Anis";
  import Sternanis from "./spices/Sternanis";
  import Fenchel from "./spices/Fenchel";
  import Sueßholz from "./spices/Sueßholz";
  import Mahlab from "./spices/Mahlab";
  import Vanille from "./spices/Vanille";
  import Muskatnuss from "./spices/Muskatnuss";
  import Muskatbluete from "./spices/Muskatbluete";
  import Kuemmel from "./spices/Kuemmel";
  import Dill from "./spices/Dill";
  import Annatto from "./spices/Annatto";
  import Mastix from "./spices/Mastix";
  import Wacholder from "./spices/Wacholder";
  import Rose from "./spices/Rose";
  import Koriander from "./spices/Koriander";
  import Kreuzkuemmel from "./spices/Kreuzkuemmel";
  import Schwarzkuemmel from "./spices/Schwarzkuemmel";
  import Mohrenpfeffer from "./spices/Mohrenpfeffer";
  import SchwarzerKardamom from "./spices/SchwarzerKardamom";
  import GruenerKardamom from "./spices/GruenerKardamom";
  import Lorbeer from "./spices/Lorbeer";
  import Galgant from "./spices/Galgant";
  import Loomi from "./spices/Loomi";
  import Zitronenmyrte from "./spices/Zitronenmyrte";
  import Zitronengras from "./spices/Zitronengras";
  import Amchur from "./spices/Amchur";
  import Anardana from "./spices/Anardana";
  import Sumach from "./spices/Sumach";
  import Tamarinde from "./spices/Tamarinde";
  import Johannisbrotschote from "./spices/Johannisbrotschote";
  import Berberitze from "./spices/Berberitze";
  import Kakao from "./spices/Kakao";
  import Paprika from "./spices/Paprika";
  import Akazie from "./spices/Akazie";
  import Sesam from "./spices/Sesam";
  import Knoblauch from "./spices/Knoblauch";
  import Asant from "./spices/Asant";
  import Curryblaetter from "./spices/Curryblaetter";
  import Senf from "./spices/Senf";
  import Paradieskoerner from "./spices/Paradieskoerner";
  import Schwarzerpfeffer from "./spices/Schwarzerpfeffer";
  import Szechuanpfeffer from "./spices/Szechuanpfeffer";
  import Ingwer from "./spices/Ingwer";
  import Chili from "./spices/Chili";
  import Safran from "./spices/Safran";
  import Mohn from "./spices/Mohn";
  import Ajowan from "./spices/Ajowan";
  import Selleriesamen from "./spices/Selleriesamen";
  import Kurkuma from "./spices/Kurkuma";
  import Bockshornklee from "./spices/Bockshornklee";

  let allSpices = [
    new Ajowan(),
    new Akazie(),
    new Amchur(),
    new Anardana(),
    new Anis(),
    new Annatto(),
    new Asant(),
    new Berberitze(),
    new Bockshornklee(),
    new Cassia_Zimt(),
    new Chili(),
    new Curryblaetter(),
    new Dill(),
    new Fenchel(),
    new Galgant(),
    new Gewuerznelke(),
    new GruenerKardamom(),
    new Ingwer(),
    new Johannisbrotschote(),
    new Kakao(),
    new Knoblauch(),
    new Koriander(),
    new Kreuzkuemmel(),
    new Kuemmel(),
    new Kurkuma(),
    new Mahlab(),
    new Mastix(),
    new Mohn(),
    new Loomi(),
    new Lorbeer(),
    new Mohrenpfeffer(),
    new Muskatbluete(),
    new Muskatnuss(),
    new Paprika(),
    new Paradieskoerner(),
    new Piment(),
    new Rose(),
    new Safran(),
    new SchwarzerKardamom(),
    new Schwarzerpfeffer(),
    new Schwarzkuemmel(),
    new Selleriesamen(),
    new Senf(),
    new Sesam(),
    new Sueßholz(),
    new Sumach(),
    new Sternanis(),
    new Szechuanpfeffer(),
    new Tamarinde(),
    new Vanille(),
    new Wacholder(),
    new Zimt(),
    new Zitronengras(),
    new Zitronenmyrte(),
  ];

  let selectedSpices = [];
  let baseSpice1 = new NoSpice();
  let baseSpice2 = new NoSpice();

  let spiceSuggestions = [];

  let selectedSuggestions = [];

  function newSpiceSelection() {
    selectedSuggestions = [];
    selectedSpices[0] = baseSpice1;
    selectedSpices[1] = baseSpice2;
    makeSpiceSuggestion();
  }

  function addSuggestionToSelection(spice) {
    selectedSuggestions = selectedSuggestions.concat([spice]);
    makeSpiceSuggestion();
  }

  function removeFromSelection(spice) {
    selectedSuggestions = removeFromArray(selectedSuggestions, spice);
    makeSpiceSuggestion();
  }

  function removeFromArray(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  function makeSpiceSuggestion() {
    // Idea:
    // Two primary Spices - a suggestion should always share "n" (2?) compounds of each primary spice space
    // Selections - another suggestion should always maximise the amount of compunds not yet in the total spice space
    // All compounds of a new selection get added to the total spice space

    spiceSuggestions = [];

    // Push current selected spice Compounds into array

    let currentSelections = [];
    selectedSuggestions.forEach((spice) => {
      currentSelections.push({
        spice: spice,
        compounds: [...spice.aromaCompounds],
      });
    });

    // Calculate macthes with the primary compounds
    let matchesWithPrimarySpices = [];
    allSpices.forEach((spice) => {
      let counter = 0;

      spice.aromaCompounds.forEach((compound) => {
        baseSpice1.aromaCompounds.forEach((baseCompond1) => {
          if (compound === baseCompond1) {
            counter++;
          }
        });

        baseSpice2.aromaCompounds.forEach((baseCompond2) => {
          if (compound === baseCompond2) {
            counter++;
          }
        });
      });

      matchesWithPrimarySpices.push(counter);
    });

    // Calulate spice potential
    let minPrimaryMatches = 2;
    let spicePotentials = [];
    for (let i = 0; i < allSpices.length; i++) {
      let spice = allSpices[i];
      let potential = spice.aromaCompounds.length - matchesWithPrimarySpices[i];

      if (matchesWithPrimarySpices[i] < minPrimaryMatches) {
        spicePotentials.push({ spice: spice, potential: -100 });
        continue;
      }

      spice.aromaCompounds.forEach((compound) => {
        currentSelections.forEach((selectedSpice) => {
          selectedSpice.spice.aromaCompounds.forEach((selectedCompound) => {
            if (compound === selectedCompound) {
              potential--;
            }
          });
        });
      });

      spicePotentials.push({ spice: spice, potential: potential });
    }

    // sort spices by potential
    spicePotentials.sort(function (a, b) {
      return b.potential - a.potential;
    });

    // find first spice with -100 potential -> so first one to drop
    let firstOneToDrop = 0;
    for (let i = 0; i < spicePotentials.length; i++) {
      if (spicePotentials[i].potential === -100) {
        firstOneToDrop = i;
        break;
      }
    }
    console.log(firstOneToDrop);

    // move first "n" suggestions to suggestions array
    console.log(spicePotentials);
    spiceSuggestions = spicePotentials
      .slice(0, firstOneToDrop)
      .map((x) => x.spice);
    console.log(spiceSuggestions);
  }
</script>

<div class="verticalGrid">
  <div class="horizontalGrid">
    <SpiceContainer shape={Math.random()} spice={baseSpice1}>
      <SpiceDropdown
        bind:selectedSpice={baseSpice1}
        spices={allSpices}
        onChange={newSpiceSelection}
      />
    </SpiceContainer>
    <SpiceContainer shape={Math.random()} spice={baseSpice2}>
      <SpiceDropdown
        bind:selectedSpice={baseSpice2}
        spices={allSpices}
        onChange={newSpiceSelection}
      />
    </SpiceContainer>
  </div>

  <div class="scrollableContainer">
    <div class="flex">
      {#each selectedSuggestions as selection}
        <SmallSpiceContainer
          shape={Math.random()}
          spice={selection}
          onClick={removeFromSelection}
        />
      {/each}
    </div>
  </div>

  <div class="scrollableContainer">
    <div class="flex">
      {#each spiceSuggestions as suggestion}
        <SmallSpiceContainer
          shape={Math.random()}
          spice={suggestion}
          onClick={addSuggestionToSelection}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  .verticalGrid {
    display: grid;
    grid-auto-flow: row dense;
    grid-auto-rows: auto 1fr 1fr;
    gap: 2rem 2rem;
    align-items: center;
  }

  .horizontalGrid {
    display: grid;
    grid-auto-flow: column dense;
    grid-auto-columns: 1fr 1fr;
    gap: 1rem 1rem;
    justify-self: center;
  }

  .scrollableContainer {
    overflow-x: scroll;
    justify-items: start;
    padding-bottom: 0.5rem;
  }

  .flex {
    display: grid;
    grid-auto-flow: column dense;
    grid-auto-columns: 1fr;
    gap: 1rem;
  }
</style>
