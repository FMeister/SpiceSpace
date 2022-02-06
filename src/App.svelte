<script>
  import Chart from "svelte-frappe-charts";
  import AromaGroups from "./spices/AromaGroups";
  import AromaGroupsColors from "./spices/AromaGroupsColors";

  import SpiceContainer from "./SpiceContainer.svelte";
  import SmallSpiceContainer from "./SmallSpiceContainer.svelte";

  import SpiceDropdown from "./spices/SpiceDropdown.svelte";
  import AromaGroupLegend from "./AromaGroupLegend.svelte";

  import NoSpice from "./spices/NoSpice";
  import Zimt from "./spices/Zimt";
  import Cassia_Zimt from "./spices/Cassia_Zimt";
  import Gewuerznelke from "./spices/Gewuerznelke";
  import Piment from "./spices/Piment";
  import Anis from "./spices/Anis";
  import Sternanis from "./spices/Sternanis";
  import Fenchel from "./spices/Fenchel";
  import Sueßholz from "./spices/Sueßholz";
  import Mahlab from "./spices/Mahlab";
  import Vanille from "./spices/Vanille";
  import Muskatnuss from "./spices/Muskatnuss";
  import Muskatbluete from "./spices/Muskatbluete";
  import Kuemmel from "./spices/Kuemmel";
  import Dill from "./spices/Dill";
  import Annatto from "./spices/Annatto";
  import Mastix from "./spices/Mastix";
  import Wacholder from "./spices/Wacholder";
  import Rose from "./spices/Rose";
  import Koriander from "./spices/Koriander";
  import Kreuzkuemmel from "./spices/Kreuzkuemmel";
  import Schwarzkuemmel from "./spices/Schwarzkuemmel";
  import Mohrenpfeffer from "./spices/Mohrenpfeffer";
  import SchwarzerKardamom from "./spices/SchwarzerKardamom";
  import GruenerKardamom from "./spices/GruenerKardamom";
  import Lorbeer from "./spices/Lorbeer";
  import Galgant from "./spices/Galgant";
  import Loomi from "./spices/Loomi";
  import Zitronenmyrte from "./spices/Zitronenmyrte";
  import Zitronengras from "./spices/Zitronengras";
  import Amchur from "./spices/Amchur";
  import Anardana from "./spices/Anardana";
  import Sumach from "./spices/Sumach";
  import Tamarinde from "./spices/Tamarinde";
  import Johannisbrotschote from "./spices/Johannisbrotschote";
  import Berberitze from "./spices/Berberitze";
  import Kakao from "./spices/Kakao";
  import Paprika from "./spices/Paprika";
  import Akazie from "./spices/Akazie";
  import Sesam from "./spices/Sesam";
  import Knoblauch from "./spices/Knoblauch";
  import Asant from "./spices/Asant";
  import Curryblaetter from "./spices/Curryblaetter";
  import Senf from "./spices/Senf";
  import Paradieskoerner from "./spices/Paradieskoerner";
  import Schwarzerpfeffer from "./spices/Schwarzerpfeffer";
  import Szechuanpfeffer from "./spices/Szechuanpfeffer";
  import Ingwer from "./spices/Ingwer";
  import Chili from "./spices/Chili";
  import Safran from "./spices/Safran";
  import Mohn from "./spices/Mohn";
  import Ajowan from "./spices/Ajowan";
  import Selleriesamen from "./spices/Selleriesamen";
  import Kurkuma from "./spices/Kurkuma";
  import Bockshornklee from "./spices/Bockshornklee";
  import { not_equal } from "svelte/internal";

  let allSpices = [
    new Ajowan(),
    new Akazie(),
    new Amchur(),
    new Anardana(),
    new Anis(),
    new Annatto(),
    new Asant(),
    new Berberitze(),
    new Bockshornklee(),
    new Cassia_Zimt(),
    new Chili(),
    new Curryblaetter(),
    new Dill(),
    new Fenchel(),
    new Galgant(),
    new Gewuerznelke(),
    new GruenerKardamom(),
    new Ingwer(),
    new Johannisbrotschote(),
    new Kakao(),
    new Knoblauch(),
    new Koriander(),
    new Kreuzkuemmel(),
    new Kuemmel(),
    new Kurkuma(),
    new Mahlab(),
    new Mastix(),
    new Mohn(),
    new Loomi(),
    new Lorbeer(),
    new Mohrenpfeffer(),
    new Muskatbluete(),
    new Muskatnuss(),
    new Paprika(),
    new Paradieskoerner(),
    new Piment(),
    new Rose(),
    new Safran(),
    new SchwarzerKardamom(),
    new Schwarzerpfeffer(),
    new Schwarzkuemmel(),
    new Selleriesamen(),
    new Senf(),
    new Sesam(),
    new Sueßholz(),
    new Sumach(),
    new Sternanis(),
    new Szechuanpfeffer(),
    new Tamarinde(),
    new Vanille(),
    new Wacholder(),
    new Zimt(),
    new Zitronengras(),
    new Zitronenmyrte(),
  ];

  let visualizationData = {
    labels: [],
    datasets: [
      {
        values: [],
      },
    ],
  };

  let selectedSpices = [];
  let baseSpice1 = new NoSpice();
  let baseSpice2 = new NoSpice();

  let spiceSuggestions = [];

  let selectedSuggestions = [];

  function newSpiceSelection() {
    selectedSuggestions = [];
    selectedSpices[0] = baseSpice1;
    selectedSpices[1] = baseSpice2;
    makeSpiceSuggestion();
    visualizationData = updateVisualization();
  }

  function addSuggestionToSelection(spice) {
    selectedSuggestions = selectedSuggestions.concat([spice]);
    makeSpiceSuggestion();
    visualizationData = updateVisualization();
  }

  function removeFromSelection(spice) {
    selectedSuggestions = removeFromArray(selectedSuggestions, spice);
    makeSpiceSuggestion();
    visualizationData = updateVisualization();
  }

  function removeFromArray(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  function makeSpiceSuggestion() {
    // Idea:
    // Two primary Spices - a suggestion should always share "n" (2?) compounds of each primary spice space
    // Selections - another suggestion should always maximise the amount of compunds not yet in the total spice space
    // All compounds of a new selection get added to the total spice space

    spiceSuggestions = [];

    // Push current selected spice Compounds into array

    let currentSelections = [];
    selectedSuggestions.forEach((spice) => {
      currentSelections.push({
        spice: spice,
        compounds: [...spice.aromaCompounds],
      });
    });

    // Calculate matches with the primary and selected spice compounds
    let matchesWithPrimarySpices = [];
    allSpices.forEach((spice) => {
      let baseCounter = 0;
      let selectedCounter = 0;

      spice.aromaCompounds.forEach((compound) => {
        baseSpice1.aromaCompounds.forEach((baseCompound1) => {
          if (compound === baseCompound1) {
            baseCounter++;
          }
        });

        baseSpice2.aromaCompounds.forEach((baseCompound2) => {
          if (compound === baseCompound2) {
            baseCounter++;
          }
        });

        currentSelections.forEach((selectedSpice) => {
          selectedSpice.compounds.forEach((selectedCompound) => {
            if (compound === selectedCompound) {
              selectedCounter++;
            }
          });
        });
      });

      matchesWithPrimarySpices.push({
        baseMatches: baseCounter,
        selectedMatches: selectedCounter,
      });
    });

    // Calulate spice potential
    let minPrimaryMatches = 2;
    let spicePotentials = [];
    for (let i = 0; i < allSpices.length; i++) {
      let spice = allSpices[i];
      let potential =
        spice.aromaCompounds.length - matchesWithPrimarySpices[i].baseMatches;
      console.log(matchesWithPrimarySpices[i]);

      if (matchesWithPrimarySpices[i].baseMatches < minPrimaryMatches) {
        spicePotentials.push({ spice: spice, potential: -100 });
        continue;
      }

      spice.aromaCompounds.forEach((compound) => {
        currentSelections.forEach((selectedSpice) => {
          selectedSpice.spice.aromaCompounds.forEach((selectedCompound) => {
            if (compound === selectedCompound) {
              potential--;
            }
          });
        });
      });

      spicePotentials.push({
        spice: spice,
        potential: potential,
        matches:
          matchesWithPrimarySpices[i].selectedMatches +
          matchesWithPrimarySpices[i].baseMatches,
      });
    }

    // sort spices by potential
    spicePotentials.sort(function (a, b) {
      return b.potential - a.potential;
    });

    // find first spice with -100 potential -> so first one to drop
    let firstOneToDrop = 0;
    for (let i = 0; i < spicePotentials.length; i++) {
      if (spicePotentials[i].potential === -100) {
        firstOneToDrop = i;
        break;
      }
    }

    // move first "n" suggestions to suggestions array
    spiceSuggestions = spicePotentials.slice(0, firstOneToDrop);

    for (let i = 0; i < spiceSuggestions.length; i++) {
      spiceSuggestions[i] = spicePotentials[i].spice;
      let potential = spicePotentials[i].potential;
      let matches = spicePotentials[i].matches;
      spiceSuggestions[i].description =
        "" + potential + " Ergänzend | " + matches + " Verstärkend";
    }
  }

  function updateVisualization() {
    let spices = [...selectedSpices, ...selectedSuggestions];

    let aromaGroupValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    spices.forEach((spice) => {
      if (spice.aromaGroup === AromaGroups.Süß_wärmende_Phenole) {
        aromaGroupValues[0] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Wärmende_Terpene) {
        aromaGroupValues[1] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Duftende_Terpene) {
        aromaGroupValues[2] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Erdige_Terpene) {
        aromaGroupValues[3] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Durchdringende_Terpene) {
        aromaGroupValues[4] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Zitrustönige_Terpene) {
        aromaGroupValues[5] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Süßsaure_Säuren) {
        aromaGroupValues[6] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Fruchtige_Aldehyde) {
        aromaGroupValues[7] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Röstige_Pysazine) {
        aromaGroupValues[8] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Schwefelverbindungen) {
        aromaGroupValues[9] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Stechende_Verbindungen) {
        aromaGroupValues[10] += 1;
      }
      if (spice.aromaGroup === AromaGroups.Einzigartige_Stoffe) {
        aromaGroupValues[11] += 1;
      }
    });

    let data = {
      labels: [
        AromaGroups.Süß_wärmende_Phenole,
        AromaGroups.Wärmende_Terpene,
        AromaGroups.Duftende_Terpene,
        AromaGroups.Erdige_Terpene,
        AromaGroups.Durchdringende_Terpene,
        AromaGroups.Zitrustönige_Terpene,
        AromaGroups.Süßsaure_Säuren,
        AromaGroups.Fruchtige_Aldehyde,
        AromaGroups.Röstige_Pysazine,
        AromaGroups.Schwefelverbindungen,
        AromaGroups.Stechende_Verbindungen,
        AromaGroups.Einzigartige_Stoffe,
      ],
      datasets: [
        {
          values: aromaGroupValues,
        },
      ],
    };

    return data;
  }
</script>

<div class="verticalGrid">
  <div class="scrollableContainer">
    <div class="flex">
      <AromaGroupLegend />
      <SpiceContainer shape={Math.random()} spice={baseSpice1}>
        <SpiceDropdown
          bind:selectedSpice={baseSpice1}
          spices={allSpices}
          onChange={newSpiceSelection}
        />
      </SpiceContainer>
      <SpiceContainer shape={Math.random()} spice={baseSpice2}>
        <SpiceDropdown
          bind:selectedSpice={baseSpice2}
          spices={allSpices}
          onChange={newSpiceSelection}
        />
      </SpiceContainer>
      <div class="chartBox">
        <Chart
          data={visualizationData}
          colors={[
            AromaGroupsColors.Süß_wärmende_Phenole,
            AromaGroupsColors.Wärmende_Terpene,
            AromaGroupsColors.Duftende_Terpene,
            AromaGroupsColors.Erdige_Terpene,
            AromaGroupsColors.Durchdringende_Terpene,
            AromaGroupsColors.Zitrustönige_Terpene,
            AromaGroupsColors.Süßsaure_Säuren,
            AromaGroupsColors.Fruchtige_Aldehyde,
            AromaGroupsColors.Röstige_Pysazine,
            AromaGroupsColors.Schwefelverbindungen,
            AromaGroupsColors.Stechende_Verbindungen,
            AromaGroupsColors.Einzigartige_Stoffe,
          ]}
          type={"donut"}
          maxSlices="20"
          height={280}
          animate={true}
          truncateLegends={false}
          valuesOverPoints={true}
          axisOptions={{
            xAxisMode: "tick",
            yAxisMode: "tick",
            xIsSeries: false,
          }}
        />
      </div>
    </div>
  </div>

  <div class="scrollableContainer">
    <div class="flex">
      {#each selectedSuggestions as selection}
        <SmallSpiceContainer
          shape={Math.random()}
          spice={selection}
          onClick={removeFromSelection}
        />
      {/each}
    </div>
  </div>

  <div class="scrollableContainer">
    <div class="flex">
      {#each spiceSuggestions as suggestion}
        <SmallSpiceContainer
          shape={Math.random()}
          spice={suggestion}
          onClick={addSuggestionToSelection}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  .verticalGrid {
    display: grid;
    grid-auto-flow: row dense;
    grid-auto-rows: auto 1fr 1fr;
    gap: 2rem 2rem;
    align-items: center;
  }

  .horizontalGrid {
    display: grid;
    grid-auto-flow: column dense;
    grid-auto-columns: 1fr 1fr;
    gap: 1rem 1rem;
    justify-self: center;
  }

  .scrollableContainer {
    overflow-x: scroll;
    justify-items: start;
    padding-bottom: 0.5rem;
  }

  .flex {
    display: grid;
    grid-auto-flow: column dense;
    grid-auto-columns: 1fr;
    gap: 1rem;
  }

  .chartBox {
    width: 100%;
    height: 100%;
    min-width: 20em;
    /* min-height: 15em; */
  }
</style>
