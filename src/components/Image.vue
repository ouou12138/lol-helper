<template>
  <props.tag v-bind="$attrs" v-show="url" :src="url" :href="url" alt="" />
</template>

<script setup lang="ts">
import { getInstance } from '@/api/client';

const url = ref('')

const props = withDefaults(defineProps<{
  src: string,
  tag?: string
}>(), {
  tag: 'img'
})

const loadImage = async () => {
  try {
    if (!props.src) {
      url.value = ""
      return
    }
    let blb = await getInstance().loadAssets(props.src)
    url.value = URL.createObjectURL(blb)
  } catch (error: any) {
    console.error(error);
  }
}

watch(() => props.src, () => {
  loadImage()
})

onBeforeMount(() => {
  URL.revokeObjectURL(url.value)
})
onMounted(() => {
  loadImage()
})

</script>

<style lang="scss" scoped></style>