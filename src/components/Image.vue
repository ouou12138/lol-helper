<template>
  <img v-bind="$attrs" :src="url" alt="">
</template>

<script setup lang="ts">
import { getInstance } from '@/api/client';

const url = ref('')

const props = defineProps<{
  src: string
}>()

new Image()

const loadImage = async () => {
  try {
    const data = await getInstance().loadAssets<number[]>(props.src)
    const u8arr = new Uint8Array(data)
    const blb = new Blob([u8arr], { type: 'image/png' })
    url.value = URL.createObjectURL(blb)
  } catch (error: any) {
    console.error(error);
  }
}

watch(() => props.src, () => {
  loadImage()
})

onMounted(() => {
  console.log("Image mounted");

  loadImage()
})

</script>

<style lang="scss" scoped></style>