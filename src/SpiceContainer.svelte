<script>
  export let shape;
  export let spice;

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

<div class="spiceContainer">
  <div
    class="spiceBlob"
    style="border-radius: {shapeCss}; background: radial-gradient(ellipse at top left, {spice.color}A0 0%,{spice.color}FF 50%); "
  >
    <h1 style="font-weight: 400; padding-top:2.7rem; color:#444444;">
      [{spice.nameSymbol}]
    </h1>
  </div>
  <slot />
</div>

<style>
  .spiceContainer {
    background-color: rgb(251, 251, 251);
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.1);
    padding: 3rem;
    padding-top: 0rem;
    margin: 1rem;
    margin-top: 3rem;
    max-width: 20rem;
    min-width: 10rem;
    border-radius: 2rem;
  }
  .spiceBlob {
    position: relative;
    margin-left: auto;
    margin-right: auto;
    height: 8rem;
    width: 8rem;
    top: -4rem;
    text-align: center;
    box-shadow: 3px 3px 6px 4px rgba(0, 0, 0, 0.03);
  }
</style>
