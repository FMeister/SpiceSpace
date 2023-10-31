<script>
  import SpiceBlendsPage from "./Pages/SpiceBlendsPage.svelte";
  import SpiceMyPlatePage from "./Pages/SpiceMyPlatePage.svelte";
  import AromaGroupsColors from "./spices/AromaGroupsColors";

  // let pageToShow = "Blends";
  let pageToShow = "SpiceMyPlate";

  function showBlends() {
    pageToShow = "Blends";
  }
  function showSpiceMyPlate() {
    pageToShow = "SpiceMyPlate";
  }
</script>

<div class="page-sized">
  <div class="vertical-grid">
    <div class="container">
      {#if pageToShow === "Blends"}
        <SpiceBlendsPage />
      {:else if pageToShow === "SpiceMyPlate"}
        <SpiceMyPlatePage />
      {:else}
        <SpiceBlendsPage />
      {/if}
    </div>

    <div class=".horizontal-grid">
      <button class="button" style="background-color: {AromaGroupsColors.Einzigartige_Stoffe};" on:click={showBlends}>Blends</button>
      <button class="button"  style="background-color: {AromaGroupsColors.Durchdringende_Terpene};" on:click={showSpiceMyPlate}>Spice Up</button>
    </div>
  </div>
</div>

<style>
  .page-sized {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: fixed;
  }
  .vertical-grid {
    display: grid;
    grid-auto-flow: row dense;
    grid-auto-rows: 95vh auto;
    gap: 0rem 0rem;
    align-items: center;
  }
  .horizontal-grid {
    display: grid;
    grid-auto-flow: column dense;
    grid-auto-rows: 1fr 1fr;
    gap: 0.5rem 0.5rem;
    align-items: center;
  }
  .container {
    padding: 1rem;
    margin: 0.3rem;
    box-shadow: 3px 3px 6px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
  }
  .button {
    cursor: pointer;
    box-shadow: 3px 3px 6px 4px rgba(0, 0, 0, 0.1);
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
    border-style: none;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    margin: 0.25rem;
    font-size: larger;
  }
  .button:hover{
    transform: scale(0.97);
    box-shadow: 3px 3px 6px 4px rgba(0, 0, 0, 0.08) inset;
  }
</style>
