<script>
  import IngredientsTag from "../components/IngredientsTag.svelte";
  import PairingTag from "../spices/PairingTag";
  import PairingTagSynonyms from "../spices/PairingTagSynonyms";

  import NoSpice from "./../spices/NoSpice";
  import Zimt from "./../spices/Zimt";
  import Cassia_Zimt from "./../spices/Cassia_Zimt";
  import Gewuerznelke from "./../spices/Gewuerznelke";
  import Piment from "./../spices/Piment";
  import Anis from "./../spices/Anis";
  import Sternanis from "./../spices/Sternanis";
  import Fenchel from "./../spices/Fenchel";
  import Sueßholz from "./../spices/Sueßholz";
  import Mahlab from "./../spices/Mahlab";
  import Vanille from "./../spices/Vanille";
  import Muskatnuss from "./../spices/Muskatnuss";
  import Muskatbluete from "./../spices/Muskatbluete";
  import Kuemmel from "./../spices/Kuemmel";
  import Dill from "./../spices/Dill";
  import Annatto from "./../spices/Annatto";
  import Mastix from "./../spices/Mastix";
  import Wacholder from "./../spices/Wacholder";
  import Rose from "./../spices/Rose";
  import Koriander from "./../spices/Koriander";
  import Kreuzkuemmel from "./../spices/Kreuzkuemmel";
  import Schwarzkuemmel from "./../spices/Schwarzkuemmel";
  import Mohrenpfeffer from "./../spices/Mohrenpfeffer";
  import SchwarzerKardamom from "./../spices/SchwarzerKardamom";
  import GruenerKardamom from "./../spices/GruenerKardamom";
  import Lorbeer from "./../spices/Lorbeer";
  import Galgant from "./../spices/Galgant";
  import Loomi from "./../spices/Loomi";
  import Zitronenmyrte from "./../spices/Zitronenmyrte";
  import Zitronengras from "./../spices/Zitronengras";
  import Amchur from "./../spices/Amchur";
  import Anardana from "./../spices/Anardana";
  import Sumach from "./../spices/Sumach";
  import Tamarinde from "./../spices/Tamarinde";
  import Johannisbrotschote from "./../spices/Johannisbrotschote";
  import Berberitze from "./../spices/Berberitze";
  import Kakao from "./../spices/Kakao";
  import Paprika from "./../spices/Paprika";
  import Akazie from "./../spices/Akazie";
  import Sesam from "./../spices/Sesam";
  import Knoblauch from "./../spices/Knoblauch";
  import Asant from "./../spices/Asant";
  import Curryblaetter from "./../spices/Curryblaetter";
  import Senf from "./../spices/Senf";
  import Paradieskoerner from "./../spices/Paradieskoerner";
  import Schwarzerpfeffer from "./../spices/Schwarzerpfeffer";
  import Szechuanpfeffer from "./../spices/Szechuanpfeffer";
  import Ingwer from "./../spices/Ingwer";
  import Chili from "./../spices/Chili";
  import Safran from "./../spices/Safran";
  import Mohn from "./../spices/Mohn";
  import Ajowan from "./../spices/Ajowan";
  import Selleriesamen from "./../spices/Selleriesamen";
  import Kurkuma from "./../spices/Kurkuma";
  import Bockshornklee from "./../spices/Bockshornklee";
  import SpiceBlendsPage from "./SpiceBlendsPage.svelte";

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

  function removeTagFromList(name, listedItems) {
    listedItems = listedItems.filter(function (item) {
      return PairingTag[item] !== name;
    });
    listedItems = listedItems.filter(function (item) {
      return item !== name;
    });
    return listedItems;
  }

  function removeTagFromIngredientsList(name) {
    // remove Tag
    cookingIngredients = removeTagFromList(name, cookingIngredients);

    // add back to total list
    allPairingTags.push(name);

    filterSpicesByCookingIngredients();
  }

  function addTagToIngredientsList(name) {
    // add tag
    cookingIngredients.push(name);

    // remove from total list
    allPairingTags = removeTagFromList(name, allPairingTags);
    searchedIngredients = removeTagFromList(name, searchedIngredients);

    // To force a rerendering
    cookingIngredients = cookingIngredients;

    filterSpicesByCookingIngredients();
  }

  function isTextPartOfTag(text, tagString) {
    if (tagString.toLowerCase().includes(text.toLowerCase())) {
      return true;
    }

    let synonyms = pairingTagSynonyms.synonyms[tagString];
    if (!synonyms) {
      return false;
    }

    for (let i = 0; i < synonyms.length; i++) {
      if (synonyms[i].toLowerCase().includes(text.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  function getSearchedIngredients(listenerData) {
    let currentEnteredText = listenerData["srcElement"]["value"];
    searchedIngredients = allPairingTags.filter(function (item) {
      return isTextPartOfTag(currentEnteredText, PairingTag[item]);
    });
    searchedIngredients = searchedIngredients.sort();
    if (currentEnteredText == "") {
      searchedIngredients = [];
    }
  }

  function isNameInList(name, list) {
    for (let i = 0; i < list.length; i++) {
      if (name == list[i]) {
        return true;
      }
    }
    return false;
  }

  function filterSpicesByCookingIngredients() {
    filteredSpices = allSpices.filter(function (spice) {
      let goodSpicePair;
      let filterPercentage = 0.3;
      let numOfIngredients = cookingIngredients.length;
      let matchesCounter = 0;

      for (let i = 0; i < spice.goes_well_with.length; i++) {
        goodSpicePair = spice.goes_well_with[i];
        if (isNameInList(goodSpicePair, cookingIngredients)) {
          matchesCounter += 1;
        }
      }

      if (matchesCounter / numOfIngredients > filterPercentage) {
        return true;
      }
      return false;
    });
  }

  // setup global data structures
  let allPairingTags = Object.keys(PairingTag);
  allPairingTags = removeTagFromList(PairingTag.None, allPairingTags);
  let pairingTagSynonyms = new PairingTagSynonyms();

  // Setup base lists
  let filteredSpices = allSpices;
  let cookingIngredients = [];
  let searchedIngredients = allPairingTags;
</script>

<div class="vertical-grid">
  <div>
    <input
      on:input={getSearchedIngredients}
      type="text"
      placeholder="Mit was kochst du?"
    />
    <div class="scrollableContainer">
      <dev class="flex">
        {#each searchedIngredients as ingredient}
          <IngredientsTag
            name={PairingTag[ingredient]}
            color=""
            onClick={addTagToIngredientsList}
          />
        {/each}
      </dev>
    </div>
  </div>
  <div class="scrollableContainer">
    <dev class="section-text"> Das kochst du: </dev>
    <dev class="flex">
      {#each cookingIngredients as ingredient}
        <IngredientsTag
          name={ingredient}
          color=""
          onClick={removeTagFromIngredientsList}
        />
      {/each}
    </dev>
  </div>
  <div class="scrollableContainer">
    <dev class="section-text"> Probier diese Gewürze:</dev>
    <dev class="flex">
      {#each filteredSpices as spice}
        <IngredientsTag
          name={spice.name}
          color={spice.color}
          onClick={() => {}}
        />
      {/each}
    </dev>
  </div>
</div>

<style>
  .vertical-grid {
    overflow-y: scroll;
    overflow-y: visible;
    display: grid;
    grid-auto-flow: row dense;
    grid-auto-rows: 1fr auto 1fr;
    gap: 0.5rem 0.5rem;
    align-items: center;
  }

  .section-text {
    font-size: 1.5rem;
  }

  .scrollableContainer {
    overflow-y: scroll;
    justify-items: start;
    padding-bottom: 0.5rem;
    width: calc(100vw - 3rem);
  }

  .flex {
    display: grid;
    grid-auto-flow: column dense;
    grid-auto-columns: 1fr;
    justify-content: start;
    /* gap: 1rem; */
  }

  input[type="text"] {
    border: none;
    border-bottom: solid 1px;
    margin: 0.5rem;
    width: 50%;
  }
</style>
