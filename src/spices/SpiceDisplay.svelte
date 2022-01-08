<script>
  import Pepper from "./Pepper";
  import Salt from "./Salt";

  export let selectedSpice;

  let spices = [new Salt(), new Pepper()];

  export let onChange;
</script>

<div>
  <h1>{selectedSpice.name}</h1>
  <p>{selectedSpice.description}</p>
  <select bind:value={selectedSpice} on:change={onChange}>
    {#each spices as spice}
      <option value={spice}>
        {spice.name}
      </option>
    {/each}
  </select>
</div>
