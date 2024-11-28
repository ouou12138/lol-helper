<template>
  <div class="loading" ref="loadingEl">
    <i>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </i>
  </div>
</template>

<script setup lang="ts">
const loadingEl = ref(null)
const height = ref(100);
const width = ref(100);
const spanWidth = ref("70px")
const spanHeight = ref("70px")


const calcDotContainer = (num: number) => {
  return Math.sqrt(Math.pow(num, 2) / 2)
}

onMounted(() => {
  if (!loadingEl.value) return
  const elStyle = getComputedStyle(loadingEl.value)
  //有时候会获取不到宽高
  setTimeout(() => {
    height.value = parseInt(elStyle.height) || 100
    width.value = parseInt(elStyle.width) || 100
    spanWidth.value = calcDotContainer(width.value) + 'px'
    spanHeight.value = calcDotContainer(height.value) + 'px'
  })

})

</script>

<style lang="scss" scoped>
.loading {
  --width: v-bind(width);
  --height: v-bind(height);
  width: 100%;
  height: 100%;
  position: relative;
}

.loading i {
  width: inherit;
  height: inherit;
  margin: auto;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading span {
  position: absolute;
  width: v-bind(spanWidth);
  height: v-bind(spanHeight);
  opacity: 0;
}

.loading span:after {
  content: "";
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  width: clamp(6px, calc(100% / 8), 15px);
  height: clamp(6px, calc(100% / 8), 15px);
  background: var(--main, #00baff);
  border-radius: 50%;
}

.loading span:nth-child(1) {
  animation: i1 5.5s 0.2s infinite;
}

.loading span:nth-child(2) {
  animation: i2 5.5s 0.4s infinite;
}

.loading span:nth-child(3) {
  animation: i3 5.5s 0.6s infinite;
}

.loading span:nth-child(4) {
  animation: i4 5.5s 0.8s infinite;
}

.loading span:nth-child(5) {
  animation: i5 5.5s 1s infinite;
}

.loading span:nth-child(6) {
  animation: i6 5.5s 1.2s infinite;
}

@keyframes i1 {
  0% {
    opacity: 1;
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }

  7% {
    opacity: 1;
    transform: rotate(335deg);
    animation-timing-function: linear;
  }

  30% {
    opacity: 1;
    transform: rotate(485deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }

  39% {
    opacity: 1;
    transform: rotate(680deg);
    animation-timing-function: linear;
  }

  63% {
    opacity: 1;
    transform: rotate(835deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }

  68% {
    opacity: 1;
    transform: rotate(900deg);
  }

  69% {
    opacity: 0;
    transform: rotate(930deg);
  }
}

@keyframes i2 {
  0% {
    opacity: 1;
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }

  7% {
    opacity: 1;
    transform: rotate(335deg);
    animation-timing-function: linear;
  }

  30% {
    opacity: 1;
    transform: rotate(485deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }

  39% {
    opacity: 1;
    transform: rotate(680deg);
    animation-timing-function: linear;
  }

  63% {
    opacity: 1;
    transform: rotate(835deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }

  68% {
    opacity: 1;
    transform: rotate(900deg);
  }

  69% {
    opacity: 0;
    transform: rotate(930deg);
  }
}

@keyframes i3 {
  0% {
    opacity: 1;
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }

  7% {
    opacity: 1;
    transform: rotate(335deg);
    animation-timing-function: linear;
  }

  30% {
    opacity: 1;
    transform: rotate(485deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }

  39% {
    opacity: 1;
    transform: rotate(680deg);
    animation-timing-function: linear;
  }

  63% {
    opacity: 1;
    transform: rotate(835deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }

  68% {
    opacity: 1;
    transform: rotate(900deg);
  }

  69% {
    opacity: 0;
    transform: rotate(930deg);
  }
}

@keyframes i4 {
  0% {
    opacity: 1;
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }

  7% {
    opacity: 1;
    transform: rotate(335deg);
    animation-timing-function: linear;
  }

  30% {
    opacity: 1;
    transform: rotate(485deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }

  39% {
    opacity: 1;
    transform: rotate(680deg);
    animation-timing-function: linear;
  }

  63% {
    opacity: 1;
    transform: rotate(835deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }

  68% {
    opacity: 1;
    transform: rotate(900deg);
  }

  69% {
    opacity: 0;
    transform: rotate(930deg);
  }
}

@keyframes i5 {
  0% {
    opacity: 1;
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }

  7% {
    opacity: 1;
    transform: rotate(335deg);
    animation-timing-function: linear;
  }

  30% {
    opacity: 1;
    transform: rotate(485deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }

  39% {
    opacity: 1;
    transform: rotate(680deg);
    animation-timing-function: linear;
  }

  63% {
    opacity: 1;
    transform: rotate(835deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }

  68% {
    opacity: 1;
    transform: rotate(900deg);
  }

  69% {
    opacity: 0;
    transform: rotate(930deg);
  }
}

@keyframes i6 {
  0% {
    opacity: 1;
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.29, 0.44, 0.32, 0.74);
  }

  7% {
    opacity: 1;
    transform: rotate(335deg);
    animation-timing-function: linear;
  }

  30% {
    opacity: 1;
    transform: rotate(485deg);
    animation-timing-function: cubic-bezier(0.53, 0.27, 0.37, 0.81);
  }

  39% {
    opacity: 1;
    transform: rotate(680deg);
    animation-timing-function: linear;
  }

  63% {
    opacity: 1;
    transform: rotate(835deg);
    animation-timing-function: cubic-bezier(0.5, 0.32, 0.82, 0.54);
  }

  68% {
    opacity: 1;
    transform: rotate(900deg);
  }

  69% {
    opacity: 0;
    transform: rotate(930deg);
  }
}
</style>