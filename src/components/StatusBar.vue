<template>
  <div class="w-full h-30px" @mousedown="startMove">
    <div class="flex h-inherit items-center justify-between px-10px">
      <div class="flex items-center">
        <slot name="title"></slot>
      </div>
      <div class="tool flex flex-row-reverse items-center text-white text-12px gap-2" :class="{ active: focus }">
        <div class="radius-bt p-2px bg-red rounded-100 shadow shadow-gray-600" @mousedown.stop @click.stop="close">
          <div class="i-ep-close close"></div>
        </div>
        <div class="radius-bt p-2px bg-#2ecc71 rounded-100 shadow shadow-gray-600" @mousedown.stop
          @click.stop="minimize">
          <div class="i-ep-minus minimize"> </div>
        </div>
        <div class="text-18px" @mousedown.stop @click.stop="switchTheme">
          <div
            class="i-ant-design:sun-filled dark:i-ant-design:moon-filled dark:text-#ccc text-#999  transition-all-800">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window';

const focus = inject<Ref<boolean>>("window_focus")
console.log(focus);

type ThemeType = "light" | "dark"

const theme = ref<"light" | "dark">(localStorage.getItem("theme") as ThemeType || "dark")

const startMove = () => {
  appWindow.startDragging()
}

const minimize = () => {
  appWindow.minimize()
}
const close = () => {
  appWindow.close()
}


const switchTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark"
  localStorage.setItem("theme", theme.value)
  setTheme(theme.value)
}

const setTheme = (theme: ThemeType) => {
  document.body.classList.remove(theme === "dark" ? "light" : "dark")
  document.body.classList.add(theme)
}
setTheme(theme.value)


</script>

<style lang="scss" scoped>
.tool:not(.active):not(:hover) {
  .radius-bt {
    background-color: rgba($color: #ccc, $alpha: 30);
  }

  .minimize,
  .close {
    visibility: hidden;
  }
}
</style>