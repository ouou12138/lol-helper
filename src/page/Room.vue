<template>
  <div class="h-100vh flex flex-col relative top--30px">
    <div class="bg absolute left-0 top-0 right-0 bottom-0">
      <Image class="w-full h-full object-cover" :src="randomChampion!.baseSplashPath" v-if="randomChampion?.id" />
      <div class="absolute top-0 w-full h-full bg-#000/60" v-if="randomChampion?.id"></div>
    </div>
    <div class="status-bar-holder h-30px"></div>
    <div class="w-full h-full flex flex-1 z-2 border-0 border-b-1px border-solid border-#999/30">
      <div class="user-list-width h-full grid grid-rows-5 relative">
        <div class="w-full h-full user-item" v-for="item in teams.left" :key="item.accountId">
          <div class="w-full h-full flex items-center justify-start box-border px-20px py-5px gap-10px">
            <LolAvatar :summonerLevel="item.summonerLevel" :profileIconId="item.profileIconId"
              :expPercent="expPercent" />
            <div class="min-h-50px">
              <div class="text-3.5 flex items-end font-bold text-base whitespace-nowrap cursor-pointer"
                @click="() => copy(item.displayName + '#' + item.tagLine)">
                <div class="i-ant-design:crown-filled text-amber inline-block text-20px mb-3px"></div>
                <span class="text-#666 dark:text-#eee"> {{ item.displayName }}</span>
                <span class="ml-5px text-3 text-#666 dark:text-#ccc">#{{ item.tagLine }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full user-item flex items-center justify-center" v-if="showLeftJoinButtom">
          <LolButton @click="() => joinTeam('left', curUser)">加入</LolButton>
        </div>
      </div>
      <div class="flex-1"></div>
      <div class="user-list-width h-full grid grid-rows-5">
        <div class="w-full h-full user-item right" v-for="item in teams.right" :key="item.accountId">
          <div
            class="w-full h-full flex flex-row-reverse items-center justify-start box-border px-20px gap-10px py-5px">
            <LolAvatar :summonerLevel="item.summonerLevel" :profileIconId="item.profileIconId"
              :expPercent="expPercent" />
            <div class="min-h-50px">
              <div class="text-3.5 font-bold text-base whitespace-nowrap cursor-pointer"
                @click="() => copy(item.displayName + '#' + item.tagLine)">
                <div class="i-ant-design:crown-filled text-amber inline-block text-20px"></div>
                <span class="text-#666 dark:text-#eee">{{ item.displayName }}</span>
                <span class="ml-5px text-3 text-#666 dark:text-#ccc">#{{ item.tagLine }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full flex items-center justify-center user-item right" v-if="showRightJoinButtom">
          <LolButton @click="() => joinTeam('right', curUser)">加入</LolButton>
        </div>
      </div>
    </div>
    <div class="w-full h-30% shrink-0 z-9">
      <div class="flex gap-5px justify-center my-10px">
        <div class="champion-item" v-for="item in 10" @click="() => chooseChampion(chooseList[item - 1])" role="button">
          <Image class="w-full h-full cursor-pointer" v-if="chooseList[item - 1]"
            :src="chooseList[item - 1]?.squarePortraitPath" />
        </div>
      </div>
      <div class="flex justify-center">
        <div class="w-128px h-40px random-button" role="button" @click="startRandom" :disabled="randomCount <= 0">
          <svg id="uuid-65e15b03-c935-473a-a404-db2e7e1f0674" data-name="layer-1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 305 80">
            <text transform="translate(174.32 45.57)" style="fill: var(--color); font-size: 32px; font-weight: 300;">
              <tspan x="0" y="8">{{ randomCount }}</tspan>
            </text>
            <path
              d="M136.76,28.76h-17.13c-2.95,0-5.34,2.4-5.35,5.35v17.13c0,2.94,2.41,5.35,5.35,5.35h17.13c2.94,0,5.35-2.41,5.35-5.35v-17.13c0-2.94-2.41-5.35-5.35-5.35M121.77,52.31c-1.77,0-3.21-1.44-3.21-3.21,0-1.77,1.44-3.21,3.21-3.21,1.77,0,3.21,1.44,3.21,3.21,0,1.77-1.44,3.21-3.21,3.21M121.77,39.47c-1.77,0-3.21-1.44-3.21-3.21,0-1.77,1.44-3.21,3.21-3.21s3.21,1.44,3.21,3.21c0,1.77-1.44,3.21-3.21,3.21h0M128.2,45.89c-1.77,0-3.21-1.44-3.21-3.21,0-1.77,1.44-3.21,3.21-3.21,1.77,0,3.21,1.44,3.21,3.21,0,1.77-1.44,3.21-3.21,3.21M134.62,52.31c-1.77,0-3.21-1.44-3.21-3.21,0-1.77,1.44-3.21,3.21-3.21h0c1.77,0,3.21,1.44,3.21,3.21,0,1.77-1.44,3.21-3.21,3.21M134.62,39.47c-1.77,0-3.21-1.44-3.21-3.21,0-1.77,1.44-3.21,3.21-3.21s3.21,1.44,3.21,3.21c0,1.77-1.44,3.21-3.21,3.21M135.58,26.62c-.52-2.49-2.7-4.27-5.24-4.28h-17.13c-2.95,0-5.34,2.4-5.35,5.35v17.13c0,2.58,1.85,4.74,4.28,5.24v-21.3c0-1.18.96-2.14,2.14-2.14h21.3Z"
              style="fill: var(--color);" />
            <path d="M299.2,54c-92,28-203,29-295,0L28.6,3h246.6l24,51Z"
              style="fill: none; stroke: var(--color); stroke-miterlimit: 10; stroke-width: 6px;" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LolAvatar from "@/components/LolAvatar.vue"
import LolButton from "@/components/LolButton.vue"
import Image from '@/components/Image.vue'
import { dialog, invoke, clipboard } from '@tauri-apps/api';
import { create, getInstance } from "@/api/client"
import useRoomStore from '@/store/useRoomStore';
import useUser from "./composable/room/useUser"
import useChampions from './composable/room/useChampions';

type TeamKey = "left" | "right"

const lcuInfo = ref<LcuInfo>()
const host = ref("https://127.0.0.1")

const query = useRoute().query
const owner = ref<boolean>(query.owner === 'true')

const { curUser, expPercent, getUserInfo } = useUser()
const { getChampions, randomChampions, randomChampion } = useChampions()

const roomStore = useRoomStore()
const { roomInfo } = storeToRefs(roomStore)

const teams = reactive<Record<TeamKey, LolSummonerSummoner[]>>({
  left: [],
  right: []
})

//
const chooseList = ref<LolChampionsV1OwnedChampionsMinimal[]>([])

const showLeftJoinButtom = computed(() => {
  // return teams.left.length < 5 && teams.left.every(e => e.accountId !== roomInfo.value.owner)
  return teams.left.length < 5
})

const showRightJoinButtom = computed(() => {
  // return teams.right.length < 5 && teams.right.every(e => e.accountId !== roomInfo.value.owner)
  return teams.right.length < 5
})

//#region

const randomCount = ref(2)


//#endregion

const startRandom = async () => {
  try {
    const count = randomCount.value
    if (count <= 0) return
    await reRandomChampion()
    randomCount.value = count - 1
  } catch (error) {
    console.error(error)
  }
}


const connectClient = async () => {
  try {
    await getClientInfo()
    create(lcuInfo.value!)
    host.value = getInstance().host
  } catch (error: any) {
    console.error(error)
    dialog.message(error.message)
  }
}

const createLolRoom = async () => {
  getInstance().post("/lol-lobby/v2/lobby", {
    "customGameLobby": {
      "configuration": {
        "gameMode": "ARAM",
        // "gameMutator": "",
        // "gameServerRegion": "",
        "mapId": 12,
        "mutators": {
          "id": 1
        },
        "spectatorPolicy": "AllAllowed",
        "teamSize": 5
      },
      "lobbyName": `${roomInfo.value.name}`,
      "lobbyPassword": roomInfo.value.password
    },
    "isCustom": true
  })
}

const reRandomChampion = async () => {
  if (chooseList.value.length >= 10) return
  let champion = randomChampions()
  while (chooseList.value.map(e => e.id).includes(champion.id)) {
    champion = randomChampions()
  }
  chooseList.value.push(champion)
}

const chooseChampion = (item: LolChampionsV1OwnedChampionsMinimal) => {
  item && (randomChampion.value = item)
}


const initUserInfo = async () => {
  try {
    await connectClient()
    const user = await getUserInfo()
    if (owner.value) {
      roomStore.updateRoomInfo({
        owner: user.accountId
      })
    }
    if (teams.left.length < 5 && teams.left.length <= teams.right.length) {
      teams.left.push(user)
    } else {
      teams.right.push(user)
    }

  } catch (error: any) {
    console.error(error)
    dialog.message(error.message || "未知错误")
  }
}

const joinTeam = (teamKey: TeamKey, user?: LolSummonerSummoner) => {
  try {
    if (!user) throw new Error("用户不存在");
    // let otherKey: TeamKey = teamKey === 'left' ? 'right' : 'left'
    // let _idx = teams[otherKey].findIndex(e => e.accountId === user.accountId)
    // teams[otherKey].splice(_idx, 1)
    teams[teamKey].push(user)
  } catch (error: any) {
    dialog.message(error.message)
  }
}


const copy = (text: string) => {
  clipboard.writeText(text)
}



onMounted(async () => {
  await initUserInfo()
  await getChampions()
  // console.log(randomChampions());



})

onUnmounted(() => {
  // disconnectClient()
  // roomStore.clear()
})
const getClientInfo = async () => {
  const data = await invoke<LcuInfo>('get_lcu_info')
  lcuInfo.value = data
  console.log(data);
}

</script>

<style lang="scss" scoped>
.user-list-width {
  width: 400px
}

.user-item {
  position: relative;

  &:not(:nth-last-child(1)) {
    &::after {
      content: "";
      position: absolute;
      left: 18px;
      bottom: 0;
      width: calc(100% - 18px);
      height: 1px;
      background: linear-gradient(to right, #503d21, transparent);
    }

    &::before {
      content: "";
      position: absolute;
      left: 10px;
      bottom: -3px;
      width: 5px;
      height: 5px;
      border: 1px solid #503d21;
      transform: rotate(45deg);
    }

    &.right {
      &::after {
        background: linear-gradient(to left, #503d21, transparent);
        right: 18px;
        left: auto;
      }

      &::before {
        right: 10px;
        left: auto;
      }
    }
  }

}

.champion-item {
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: inset 0 0 10px 0 rgba(0, 0, 0, 0.3);
  @apply w-50px h-50px flex justify-center overflow-hidden bg-#000/20;
}

.random-button {
  cursor: pointer;
  --color: #cdfafa;
  transition: all 200ms;

  &:hover {
    --color: #6deded;
  }

  &[disabled=true] {
    --color: #ccc;
    cursor: not-allowed;
  }
}

.mask {
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
  filter: blur(10px)
}
</style>