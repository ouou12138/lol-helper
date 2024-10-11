<template>
  <div>
    <div class="relative">
      <video ref="player" :src="BgVideo" :controls="false" loop autoplay></video>
      <div class="mask absolute top-0 left-0 right-0 bottom-0 bg-#000/50"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BgVideo from '@/assets/shadow_isles.webm'

const focus = inject<Ref<boolean>>('window_focus', ref(false))

const player = ref<HTMLVideoElement | null>(null)

watch(focus, (val) => {
  val ? player.value?.play() : player.value?.pause()
})

onMounted(() => {
  if (player.value) {
    player.value.playbackRate = 0.75
  }
})
</script>

<style lang="scss" scoped></style>