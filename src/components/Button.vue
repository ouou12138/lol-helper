<template>
  <button class="btn h-max rounded-10px text-white">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">

type ButtonSizes = "mini" | "normal" | "large"

const sizes: Record<ButtonSizes, Record<string, string>> = {
  normal: {
    px: "10px",
    py: "5px",
    fontSize: "14px",
    rounded: "8px"
  },
  large: {
    px: "20px",
    py: "10px",
    fontSize: "16px",
    rounded: "10px"
  },
  mini: {
    px: "8px",
    py: "4px",
    fontSize: "12px",
    rounded: "6px"
  }
}

const props = withDefaults(defineProps<{
  color?: string,
  activeColor?: string
  plain?: boolean
  border?: boolean
  size?: ButtonSizes
}>(), {
  color: '#1677ff',
  activeColor: "#4096ff",
  plain: false,
  border: false,
  size: "normal"
})

const btSize = computed(() => sizes[props.size])

const styles = computed(() => {
  return {
    borderStyle: props.plain || props.border ? 'solid' : 'none',
    borderColor: props.plain ? 'white' : props.color,
    color: props.plain ? 'white' : props.color,
    bgColor: props.plain ? "transparent" : props.color,
    activeColor: props.plain ? props.activeColor : "white",
    activeBgColor: props.plain ? props.color : props.activeColor
  }
})



</script>

<style lang="scss" scoped>
.btn {
  box-sizing: border-box;
  border-width: 1px;
  border-style: v-bind('styles.borderStyle');
  border-color: v-bind('styles.borderColor');
  background-color: v-bind('styles.bgColor');
  padding: v-bind('btSize.py') v-bind('btSize.px');
  font-size: v-bind('btSize.fontSize');
  border-radius: v-bind('btSize.rounded');
  cursor: pointer;


  &:hover {
    background-color: v-bind('styles.activeBgColor');
    border-color: v-bind('styles.activeColor');
    color: v-bind('styles.activeColor');
  }
}
</style>