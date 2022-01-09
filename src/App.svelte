<script>
  import SpiceContainer from "./SpiceContainer.svelte";

  import NoSpice from "./spices/NoSpice";
  import Pepper from "./spices/Pepper";
  import Salt from "./spices/Salt";
  import Test1 from "./spices/Test1";
  import Test2 from "./spices/Test2";

  import SpiceDisplay from "./spices/SpiceDisplay.svelte";
  import SpiceSuggestion from "./spices/SpiceSuggestion.svelte";
  import SelectedSpiceSuggestions from "./spices/SelectedSpiceSuggestions.svelte";

  let allSpices = [
    new Salt(),
    new Pepper(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
    new Test1(),
    new Test2(),
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

    // Push current selected spice components into array

    let targetSpiceComponents = [];
    selectedSpices.forEach((spice) => {
      targetSpiceComponents.push(...spice.spiceComponents);
    });

    // calculate for all spices how many components match with the existing ones

    let matchingSpiceComponents = [];
    allSpices.forEach((spice) => {
      let matches = 0;
      spice.spiceComponents.forEach((canidateComponent) => {
        targetSpiceComponents.forEach((targetComponents) => {
          if (canidateComponent === targetComponents) {
            matches += 1;
          }
        });
      });
      matchingSpiceComponents.push({ spice: spice, matches: matches });
    });

    // sort spices by matches

    matchingSpiceComponents.sort(function (a, b) {
      return b.matches - a.matches;
    });

    // remove the two selected spices from the sorted spice array

    matchingSpiceComponents = matchingSpiceComponents.filter(function (
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

    spiceSuggestions = matchingSpiceComponents.slice(0, 7).map((x) => x.spice);
  }
</script>

<div class="verticalGrid">
  <div class="horizontalGrid">
    <SpiceContainer shape={Math.random()} color={baseSpice1.color}>
      <SpiceDisplay
        bind:selectedSpice={baseSpice1}
        spices={allSpices}
        onChange={newSpiceSelection}
      />
    </SpiceContainer>
    <SpiceContainer shape={Math.random()} color={baseSpice2.color}>
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
        <SpiceContainer shape={Math.random()} color={selection.color}>
          <SelectedSpiceSuggestions spice={selection} {removeFromSelection} />
        </SpiceContainer>
      {/each}
    </div>
  </div>

  <div class="scrollableContainer">
    <div class="flex">
      {#each spiceSuggestions as suggestion}
        <SpiceContainer shape={Math.random()} color={suggestion.color}>
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
