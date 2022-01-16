<script>
  import SpiceContainer from "./SpiceContainer.svelte";

  import SpiceDisplay from "./spices/SpiceDisplay.svelte";
  import SpiceSuggestion from "./spices/SpiceSuggestion.svelte";
  import SelectedSpiceSuggestions from "./spices/SelectedSpiceSuggestions.svelte";

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
    spiceSuggestions = [];

    // Push current selected spice Compounds into array

    let targetAromaCompounds = [];
    selectedSpices.forEach((spice) => {
      targetAromaCompounds.push(...spice.aromaCompounds);
    });

    // calculate for all spices how many Compounds match with the existing ones

    let matchingAromaCompounds = [];
    allSpices.forEach((spice) => {
      let matches = 0;
      spice.aromaCompounds.forEach((canidateComponent) => {
        targetAromaCompounds.forEach((targetCompounds) => {
          if (canidateComponent === targetCompounds) {
            matches += 1;
          }
        });
      });
      matchingAromaCompounds.push({ spice: spice, matches: matches });
    });

    // sort spices by matches

    matchingAromaCompounds.sort(function (a, b) {
      return b.matches - a.matches;
    });

    // remove the selected spices and spices with no enough match from the sorted spice array

    matchingAromaCompounds = matchingAromaCompounds.filter(function (
      value,
      index,
      arr
    ) {
      let enoughMatches = 2;

      if (value.matches < enoughMatches) {
        return false;
      }

      for (const selection of selectedSpices) {
        if (value.spice.name === selection.name) {
          return false;
        }
      }

      for (const selection of selectedSuggestions) {
        if (value.spice.name === selection.name) {
          return false;
        }
      }

      return true;
    });

    // move first "n" suggestions to suggestions array

    spiceSuggestions = matchingAromaCompounds.slice(0, 20).map((x) => x.spice);
  }
</script>

<div class="verticalGrid">
  <div class="horizontalGrid">
    <SpiceContainer shape={Math.random()} spice={baseSpice1}>
      <SpiceDisplay
        bind:selectedSpice={baseSpice1}
        spices={allSpices}
        onChange={newSpiceSelection}
      />
    </SpiceContainer>
    <SpiceContainer shape={Math.random()} spice={baseSpice2}>
      <SpiceDisplay
        bind:selectedSpice={baseSpice2}
        spices={allSpices}
        onChange={newSpiceSelection}
      />
    </SpiceContainer>
  </div>

  <div class="scrollableContainer">
    <div class="flex">
      {#each selectedSuggestions as selection}
        <SpiceContainer shape={Math.random()} spice={selection}>
          <SelectedSpiceSuggestions spice={selection} {removeFromSelection} />
        </SpiceContainer>
      {/each}
    </div>
  </div>

  <div class="scrollableContainer">
    <div class="flex">
      {#each spiceSuggestions as suggestion}
        <SpiceContainer shape={Math.random()} spice={suggestion}>
          <SpiceSuggestion
            spice={suggestion}
            addToSelection={addSuggestionToSelection}
          />
        </SpiceContainer>
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
