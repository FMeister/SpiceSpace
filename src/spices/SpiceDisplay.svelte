<script>
  export let selectedSpice;
  export let spices;

  export let onChange;
</script>

<h3 style="color:#444444;">{selectedSpice.name}</h3>
<p>{selectedSpice.description}</p>
<select bind:value={selectedSpice} on:change={onChange}>
  {#each spices as spice}
    <option value={spice}>
      {spice.name}
    </option>
  {/each}
</select>
