<template>
  <div class="w-$avatar-size h-$avatar-size" :style="{ '--avatar-size': avatarSize + 'px' }">
    <svg id="uuid-bdf264f8-db04-4cd6-b31f-4fa52e922e1e" data-name="layer_x5F_1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 250 250">
      <defs>
        <clipPath id="uuid-a2c8e2ae-bfc9-4f50-a410-3e9c3ca46427">
          <path id="uuid-588c68ba-8b0b-4898-92bd-b435b72b0940" data-name="border"
            d="M125,205c-48.6,0-88-39.4-88-88S76.4,29,125,29s88,39.4,88,88-39.4,88-88,88Z" style="fill: none;" />
        </clipPath>
      </defs>
      <path id="uuid-3dcdbbff-fb6f-4bc9-ac72-b028d6bfae11" data-name="border"
        d="M125,6C63.7,6,14,55.7,14,117s49.7,111,111,111,111-49.7,111-111S186.3,6,125,6ZM125,208c-50.26,0-91-40.74-91-91S74.74,26,125,26s91,40.74,91,91-40.74,91-91,91Z"
        style="fill: #0a323c; stroke: #e1ac48; stroke-miterlimit: 10; stroke-width: 6px;" />
      <g id="uuid-3f686b39-7df5-454d-ba4b-4852fd5bd65a" data-name="avatar_x5F_group">
        <g style="clip-path: url(#uuid-a2c8e2ae-bfc9-4f50-a410-3e9c3ca46427);">
          <g id="uuid-c049a60f-d391-41dc-8933-aa10319ddb09" data-name="avatar">
            <Image width="176" height="176" transform="translate(37 29)" :src="url" tag="image"></Image>
          </g>
        </g>
      </g>
      <path id="uuid-bf616094-99a6-43cf-9fd6-78264080a626" data-name="progress"
        d="M72.84,203.51c-29.27-17.69-48.84-49.81-48.84-86.51,0-55.78,45.22-101,101-101s101,45.22,101,101c0,36.06-18.9,67.71-47.34,85.58"
        style="fill: none; stroke: #0594a8; stroke-miterlimit: 10; stroke-width: 14px; transition: all 0.3s;"
        :stroke-dasharray="PROGRESS_STROKE_DASHARRAY" :stroke-dashoffset="progress" stroke-linecap="round" />
      <g id=" uuid-cf374481-a6bf-495e-913f-35c84dd27657" data-name="level">
        <polygon id="uuid-b3f598c2-edb4-4d04-bcd0-17e626c084d1" data-name="wrapper"
          points="86.5 188 168.59 188 188.5 216 170.5 246 86.5 246 63.5 218 86.5 188"
          style="fill: #2d343c; stroke: #e1ac48; stroke-miterlimit: 10; stroke-width: 6px;" />
        <text transform="translate(95 230)" style="fill: #fff; font-size: 36px; text-anchor: middle;">
          <tspan x="30" y="0">{{ summonerLevel }}</tspan>
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import Image from '@/components/Image.vue'

//固定值
const PROGRESS_STROKE_DASHARRAY = 525

const props = withDefaults(defineProps<{
  profileIconId: number,
  summonerLevel: number,
  expPercent?: number,
  avatarSize?: number
}>(), {
  expPercent: 0,
  avatarSize: 40
})

const { expPercent, profileIconId, summonerLevel, avatarSize } = toRefs(props)
const url = computed(() => `/lol-game-data/assets/v1/profile-icons/${profileIconId.value}.jpg`)

const progress = computed(() => {
  return Number(PROGRESS_STROKE_DASHARRAY * (1 - expPercent.value))
})


</script>

<style lang="scss" scoped></style>