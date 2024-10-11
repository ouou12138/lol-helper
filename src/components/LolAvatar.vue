<template>
  <div class="avatar-wrapper">
    <img class="avatar" :src="getAvatarUrl(String(profileIconId))" />
    <div class="level">{{ summonerLevel }}</div>
  </div>
</template>

<script setup lang="ts">
import { getAvatarUrl } from "@/utils/tool"

const props = defineProps<{
  profileIconId: number,
  summonerLevel: number,
  expPercent: string
}>()
const { expPercent, profileIconId, summonerLevel } = toRefs(props)

const avatarSize = ref(40)

</script>

<style lang="scss" scoped>
.avatar-wrapper {
  position: relative;
  border: 2px solid #745c2d;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  --exp-precent: v-bind(expPercent);
  --size: v-bind(avatarSize);


  .avatar {
    width: calc(var(--size) * 1px);
    height: calc(var(--size) * 1px);
    overflow: hidden;
    border: 1px solid #745c2d;
    border-radius: 50%;
    z-index: 1;
  }



  &::after {
    content: " ";
    position: absolute;
    left: -7px;
    top: -7px;
    display: block;
    width: 100%;
    height: 100%;
    padding: 5px;
    background: conic-gradient(from 215deg at 50% 50%, #0994a6 0%, #0994a6 var(--exp-precent), #0f3239 var(--exp-precent), #0f3239 81%, #745c2d 81%, #745c2d 100%);
    border-radius: 50%;
    border: 2px solid #745c2d;
    z-index: 0;
  }
}

.level {
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  font-size: max(calc(var(--size) * 0.2px), 10px);
  color: #fff;
  z-index: 2;
  border: 1px solid #745c2d;
  background: #1d2227;
  z-index: 1;
  padding: 0 3px;

  &::before,
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    padding: 2px 8px;

  }

  &::before {
    background: #745c2d;
    padding: 4px 10px;
    top: -4px;
    z-index: -2;
  }

  &::after {
    z-index: -1;
    background: #1d2227;
  }
}
</style>