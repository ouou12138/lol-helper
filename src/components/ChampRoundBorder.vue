<template>
  <div class="w-full h-full opacity-$opacity transition-opacity-800" :style="{ '--opacity': opacity }">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 773.71 773.71">
      <defs>
        <linearGradient id="linear-gradient_87" data-name="linear-gradient-87" x1="386.85" y1="773.71" x2="386.85"
          y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#82632d" />
          <stop offset=".75" stop-color="#b88a3e" />
          <stop offset="1" stop-color="#8c6a30" />
        </linearGradient>
      </defs>
      <g style="isolation: isolate;">
        <g id="layer2">
          <g id="border">
            <circle cx="386.85" cy="386.85" r="385.35"
              style="fill: none; stroke: url(#linear-gradient_87); stroke-miterlimit: 10; stroke-width: 3px;" />
            <circle cx="386.85" cy="386.85" r="374.73"
              style="fill: none; stroke: url(#linear-gradient_87); stroke-miterlimit: 10; stroke-width: 6px;" />
            <circle cx="385.85" cy="386.85" r="353.37" class="rotate-circle"
              style="fill: none; stroke: #eddab1; stroke-dasharray: 3 9.99; stroke-linejoin: round; stroke-width: 20px;" />
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
const opacity = ref(0)

onMounted(() => {
  setTimeout(() => opacity.value = 1, 100)
})

</script>

<style lang="scss" scoped>
.rotate-circle {
  animation: rotate 60s linear infinite;
}

@keyframes rotate {
  0% {
    stroke-dashoffset: 0;
  }

  100% {
    stroke-dashoffset: 2220;
  }
}
</style>
