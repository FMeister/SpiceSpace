<script>
  export let shape;
  export let spice;
  export let onClick;

  let blobShapes = [
    "47% 53% 42% 58% / 54% 34% 66% 46% ",
    "30% 70% 42% 58% / 54% 34% 66% 46% ",
    "30% 70% 58% 42% / 54% 43% 57% 46% ",
    "60% 40% 58% 42% / 54% 43% 57% 46% ",
    "60% 40% 58% 42% / 37% 43% 57% 63% ",
    "60% 40% 58% 42% / 37% 62% 38% 63% ",
    "60% 40% 58% 42% / 59% 62% 38% 41% ",
    "58% 42% 39% 61% / 55% 62% 38% 45% ",
  ];

  let index = Math.round(shape * blobShapes.length);
  if (index == blobShapes.length) {
    index -= 1;
  }

  let shapeCss = blobShapes[index];
</script>

<button on:click={onClick(spice)}>
  <div
    class="spiceBlob"
    style="border-radius: {shapeCss}; background: radial-gradient(ellipse at top left, {spice.color}A0 0%,{spice.color}FF 50%); "
  >
    <h1 class="nameSymbol">
      [{spice.nameSymbol}]
    </h1>
  </div>
  <p>
    {spice.description}
  </p>
  <h3>
    {spice.name}
  </h3>
</button>

<style>
  .spiceBlob {
    position: relative;
    margin-left: auto;
    margin-right: auto;
    height: 6rem;
    width: 6rem;
    top: -1rem;
    text-align: center;
    box-shadow: 3px 3px 6px 4px rgba(0, 0, 0, 0.03);
  }
  .nameSymbol {
    font-weight: 400;
    padding-top: 1.9rem;
    /* color: #444444; */
    margin: 0rem;
    margin-top: 2rem;
  }
  h3 {
    font-weight: 400;
    position: relative;
    bottom: 3%;
    margin: 0rem;
  }
  p {
    font-weight: 400;
    font-size: small;
    position: relative;
    bottom: 5%;
    margin: 0rem;
  }
  button {
    all: unset;
    color: #444444;
    background-color: none;
    height: 100%;
    width: 100%;
    text-align: center;
  }
</style>
