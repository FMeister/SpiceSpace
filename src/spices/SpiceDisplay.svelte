<script>
  export let selectedSpice;
  export let spices;

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
