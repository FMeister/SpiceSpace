<script>
  export let spice;
  export let removeFromSelection;
</script>

<div>
  <h1>
    {spice.name}
  </h1>
  <p>
    {spice.description}
  </p>
  <button on:click={removeFromSelection(spice)} />
</div>
