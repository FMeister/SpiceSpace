<script>
  import Pepper from "./Pepper";
  import Salt from "./Salt";

  let selectedSpice = new Salt();

  let spices = [new Salt(), new Pepper()];

  function changeSpice() {}
</script>

<div>
  <h1>{selectedSpice.name}</h1>
  <p>{selectedSpice.description}</p>
  <select bind:value={selectedSpice} on:change={changeSpice}>
    {#each spices as spice}
      <option value={spice}>
        {spice.name}
      </option>
    {/each}
  </select>
</div>
