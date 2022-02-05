<script>
  import AromaGroups from "./spices/AromaGroups";
  import AromaGroupsColors from "./spices/AromaGroupsColors";
</script>

<div class="verticalGrid">
  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Süß_wärmende_Phenole};"
    />
    <div>
      {AromaGroups.Süß_wärmende_Phenole}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Wärmende_Terpene};"
    />
    <div>
      {AromaGroups.Wärmende_Terpene}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Duftende_Terpene};"
    />
    <div>
      {AromaGroups.Duftende_Terpene}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Erdige_Terpene};"
    />
    <div>
      {AromaGroups.Erdige_Terpene}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Durchdringende_Terpene};"
    />
    <div>
      {AromaGroups.Durchdringende_Terpene}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Zitrustönige_Terpene};"
    />
    <div>
      {AromaGroups.Zitrustönige_Terpene}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Süßsaure_Säuren};"
    />
    <div>
      {AromaGroups.Süßsaure_Säuren}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Fruchtige_Aldehyde};"
    />
    <div>
      {AromaGroups.Fruchtige_Aldehyde}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Röstige_Pysazine};"
    />
    <div>
      {AromaGroups.Röstige_Pysazine}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Schwefelverbindungen};"
    />
    <div>
      {AromaGroups.Schwefelverbindungen}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Stechende_Verbindungen};"
    />
    <div>
      {AromaGroups.Stechende_Verbindungen}
    </div>
  </div>

  <div class="horizontalGrid">
    <div
      class="colorBlob"
      style="background:{AromaGroupsColors.Einzigartige_Stoffe};"
    />
    <div>
      {AromaGroups.Einzigartige_Stoffe}
    </div>
  </div>
</div>

<style>
  .verticalGrid {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: 1fr;
    height: 100%;
  }
  .horizontalGrid {
    display: grid;
    grid-template-columns: auto 1fr;
  }
  .colorBlob {
    display: relative;
    left: 10%;
    width: 1rem;
    height: 1rem;
    border-radius: 100%;
    margin-right: 0.5rem;
  }
</style>
