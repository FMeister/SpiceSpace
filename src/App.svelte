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

  let allSpices = [
    new Zimt(),
    new Cassia_Zimt(),
    new Gewuerznelke(),
    new Piment(),
    new Anis(),
    new Sternanis(),
    new Fenchel(),
    new Sueßholz(),
    new Mahlab(),
    new Vanille(),
    new Muskatnuss(),
    new Muskatbluete(),
    new Kuemmel(),
    new Dill(),
    new Annatto(),
    new Mastix(),
    new Wacholder(),
    new Rose(),
    new Koriander(),
    new Kreuzkuemmel(),
    new Schwarzkuemmel(),
    new Mohrenpfeffer(),
    new SchwarzerKardamom(),
    new GruenerKardamom(),
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

    // remove the two selected spices from the sorted spice array

    matchingAromaCompounds = matchingAromaCompounds.filter(function (
      value,
      index,
      arr
    ) {
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

    // move first 7 suggestions to suggestions array

    spiceSuggestions = matchingAromaCompounds.slice(0, 7).map((x) => x.spice);
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
