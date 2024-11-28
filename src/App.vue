<script setup lang="ts">
import StatusBar from "@/components/StatusBar.vue"
import Background from "@/components/Background.vue"
import { appWindow } from "@tauri-apps/api/window";
import useRoomStore from "./store/useRoomStore";
import { clipboard, dialog } from "@tauri-apps/api"
import useConnectLolClient from "./composables/useConnectLolClient";



const roomStore = useRoomStore()
const { roomInfo } = storeToRefs(roomStore)
const router = useRouter()

const { startConnecting } = useConnectLolClient()
const shareRoom = () => {
  clipboard.writeText(`lol-helper:${roomInfo.value.id}:${roomInfo.value.password}`)
}

const focus = ref(true)

appWindow.onFocusChanged((event) => {
  focus.value = event.payload
})

const exitRoom = async () => {
  try {
    await dialog.confirm("确定要退出房间吗", {
      "okLabel": "确定",
      "cancelLabel": "取消",
      "title": "退出房间",
      "type": "warning",
    })
    roomStore.clear()
    router.push("/home")
  } catch (error) {
    return
  }
}

provide("window_focus", focus)

onMounted(() => {
  startConnecting()
})


onErrorCaptured(error => {
  console.log("onErrorCaptured", error);
  return false
})

</script>

<template>
  <div id="page" class="w-100vw h-100vh dark:bg-darkTertiary bg-#fff transition-background-color duration-800 rounded-10px overflow-hidden backdrop-blur-18px border border-#999/30
    select-none flex flex-col">
    <Background class="absolute z--1 top-0 w-100vw h-100vh"></Background>
    <StatusBar class="z-99999" fixed placeholder>
      <template #title v-if="roomInfo.id">
        <div class="text-#666 dark:text-#ddd text-3.5 flex gap-2 items-center">
          <span>{{ roomInfo.name }} - {{ roomInfo.id }}:{{ roomInfo.password }}</span>
          <span class="block i-ant-design:share-alt-outlined cursor-pointer" @mousedown.stop @click="shareRoom"></span>
          <div class="cursor-pointer text-red popover" popover-data="退出房间" @mousedown.stop @click="exitRoom">
            <span class="block i-ant-design:export-outlined"></span>
          </div>
        </div>
      </template>
    </StatusBar>
    <div class="flex-1 z-2">
      <RouterView> </RouterView>
    </div>

  </div>
</template>

<style>
body {
  margin: 0;
}
</style>

<style lang="scss" scoped>
.popover {
  position: relative;

  &::after {
    content: attr(popover-data);
    width: max-content;
    display: none;
    position: absolute;
    left: 10px;
    bottom: -25px;
    border-radius: 5px;
    padding: 2px 10px;
    @apply text-#eee dark:text-#333 bg-darkTertiary/50 dark:bg-#fff/50;
  }

  &:hover::after {
    display: block;
  }
}
</style>
