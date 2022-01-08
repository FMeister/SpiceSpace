<script>
  import NoSpice from "./spices/NoSpice";
  import Pepper from "./spices/Pepper";
  import Salt from "./spices/Salt";

  import SpiceDisplay from "./spices/SpiceDisplay.svelte";
  import Test1 from "./spices/Test1";
  import Test2 from "./spices/Test2";

  let selectedSpices = [];
  let baseSpice1 = new NoSpice();
  let baseSpice2 = new NoSpice();

  let spiceSuggestions = [];

  function newSpiceSelection() {
    selectedSpices[0] = baseSpice1;
    selectedSpices[1] = baseSpice2;
    makeSpiceSuggestion();
  }

  function makeSpiceSuggestion() {
    spiceSuggestions = [];
    selectedSpices.forEach((spice) => {
      if (spice.name === new Salt().name) {
        pushNewSpiceIfNotExisting(spiceSuggestions, new Test1());
      }

      if (spice.name === new Pepper().name) {
        pushNewSpiceIfNotExisting(spiceSuggestions, new Test2());
      }
    });
    console.log(spiceSuggestions);
  }

  function pushNewSpiceIfNotExisting(spices, spice) {
    let isExisting = false;
    spices.forEach((item) => {
      if (item.name === spice.name) {
        isExisting = true;
      }
    });

    if (!isExisting) {
      spices.push(spice);
    }
  }
</script>

<SpiceDisplay bind:selectedSpice={baseSpice1} onChange={newSpiceSelection} />
<SpiceDisplay bind:selectedSpice={baseSpice2} onChange={newSpiceSelection} />

{#each spiceSuggestions as spice}
  <p>
    {spice.name}
  </p>
{/each}
