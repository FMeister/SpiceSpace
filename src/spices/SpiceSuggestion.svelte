<script>
  export let spice;
  export let addToSelection;
</script>

<div>
  <h3>
    {spice.name}
  </h3>
  <p>
    {spice.description}
  </p>
  <button on:click={addToSelection(spice)} />
</div>
