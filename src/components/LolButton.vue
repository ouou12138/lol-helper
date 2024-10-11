<template>
  <div class="lol-button" role="button">
    <div class="z-2 lol-bt-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lol-button {
  color: #ccc;
  background-color: #967430;
  cursor: pointer;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  @apply text-3.5 p-2px;
  position: relative;

  .lol-bt-content {
    display: inline-block;
    background-color: #1e2328;
    position: relative;
    z-index: 2;
    min-width: 50px;
    text-align: center;
    padding: 5px 30px;
  }

  &:hover {
    .lol-bt-content {
      background: linear-gradient(to top, #3c382a, #1e2328 60%, #1e2328);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
      filter: saturate(0.8);
      z-index: 0;
    }
  }

  &:active {
    content: "";
    display: block;
    filter: grayscale(1);
  }
}
</style>