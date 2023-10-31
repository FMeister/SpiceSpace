<script>
  export let name;
  export let color;
  export let onClick;
</script>

<button on:click={onClick(name)} class="background-container" style="background-color: {color};">
      <dev class="text">
        {name}
      </dev>
</button>

<style>
  .background-container {
    cursor: pointer;
    border-radius: 0.7rem;
    margin:0.3rem;
    padding: 0.3rem;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    width:fit-content;
  }
  .background-container:hover{
    transform: scale(1.03);
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.08);
  }
  .text {
    font-size: 1rem;
  }
</style>
