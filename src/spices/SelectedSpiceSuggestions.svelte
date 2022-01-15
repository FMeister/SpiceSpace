<script>
  export let spice;
  export let removeFromSelection;
</script>

<h3>
  {spice.name}
</h3>
<p>
  {spice.description}
</p>
<button on:click={removeFromSelection(spice)} />
