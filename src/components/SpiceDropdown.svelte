<script>
  export let selectedSpice;
  export let spices;

  export let onChange;
</script>

<select bind:value={selectedSpice} on:change={onChange}>
  {#each spices as spice}
    <option value={spice}>
      {spice.name}
    </option>
  {/each}
</select>

<style>
  select {
    all: unset;
    background: rgba(0, 0, 0, 0);
    color: rgb(27, 27, 27);
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    font-weight: 400;
    border-bottom-style: solid;
    border-color: rgb(185, 185, 185);
    width: 90%;
  }
</style>
