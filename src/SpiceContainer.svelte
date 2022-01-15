<script>
  export let shape;
  export let spice;

  let blobShapes = [
    "45% 55% 42% 58% / 63% 28% 72% 37%",
    "45% 55% 42% 58% / 63% 90% 10% 37%",
    "30% 70% 57% 43% / 50% 70% 30% 50% ",
    "30% 70% 21% 79% / 50% 70% 30% 50% ",
    "36% 64% 21% 79% / 50% 25% 75% 50% ",
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
    style="border-radius: {shapeCss}; background: radial-gradient(ellipse at top left, {spice.color}70 0%,{spice.color}FF 60%); "
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
