<script>
  export let shape;
  export let color;

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

<div
  class="spiceContainer"
  style="border-radius: {shapeCss}; background-color: rgb({color[0]}, {color[1]}, {color[2]});"
>
  <slot />
</div>

<style>
  .spiceContainer {
    background-color: rgb(252, 252, 252);
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.062);
    padding: 3.5rem;
    padding-right: 1rem;
    margin: 1rem;
    max-width: 20rem;
    min-width: 10rem;
  }
</style>
