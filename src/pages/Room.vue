<template>
  <div class="h-100vh flex flex-col relative top--30px">
    <div class="bg absolute left-0 top-0 right-0 bottom-0">
      <Image class="w-full h-full object-cover" :src="randomChampion!.baseSplashPath" v-if="randomChampion?.id" />
      <div class="absolute top-0 w-full h-full radial-bg" v-if="randomChampion?.id"></div>
    </div>
    <div class="status-bar-holder h-30px"></div>
    <div class="w-full h-full flex flex-1 z-2 border-0 border-b-1px border-solid border-#999/30">
      <div class="user-list-width h-full flex items-center relative">
        <div class="w-full h-20% user-item" v-for="item in teams.left" :key="item.accountId">
          <div class="w-full h-full flex items-center justify-start box-border px-20px py-5px gap-10px">
            <LolAvatar :summonerLevel="item.summonerLevel" :profileIconId="item.profileIconId" :expPercent="expPercent"
              :avatar-size="60" :key="item.accountId" />
            <div class="min-h-50px flex-1  ">
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
      <div class="flex-1 relative overflow-hidden">
        <div class="w-full h-full absolute top--15% z--1 pointer-events-none" v-if="randomChampion?.id">
          <ChampRoundBorder />
        </div>
      </div>
      <div class="user-list-width h-full flex items-center">
        <div class="w-full h-full user-item right" v-for="item in teams.right" :key="item.accountId">
          <div
            class="w-full h-full flex flex-row-reverse items-center justify-start box-border px-20px gap-10px py-5px">
            <LolAvatar :summonerLevel="item.summonerLevel" :profileIconId="item.profileIconId" :expPercent="expPercent"
              :avatar-size="60" />
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
            :src="chooseList[item - 1]?.squarePortraitPath" :alt="chooseList[item - 1]?.name"
            :key="chooseList[item - 1]?.id" />
        </div>
      </div>
      <div class="flex justify-center">
        <RandomButton :count="randomCount" :disabled="randomCount <= 0" @click="startRandom" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LolAvatar from "@/components/LolAvatar.vue"
import LolButton from "@/components/LolButton.vue"
import ChampRoundBorder from "@/components/ChampRoundBorder.vue"
import RandomButton from "@/components/RandomButton.vue"
import Image from '@/components/Image.vue'
import { dialog, clipboard } from '@tauri-apps/api';
import { getInstance } from "@/api/client"
import useRoomStore from '@/store/useRoomStore';
import useChampions from './composable/room/useChampions';
import useUserStore from "@/store/useUserStore";
import useConnectLolClient from "@/composables/useConnectLolClient";
import { LolSocketManager } from "@/api/lolSocket";
import { LolSelectAction, lolSelectSession } from "@/api/lcuApis";


type TeamKey = "left" | "right"
const RANDOM_COUNT = 2

const userStore = useUserStore()
const roomStore = useRoomStore()
const { user: curUser, expPercent } = storeToRefs(userStore)
const { roomInfo } = storeToRefs(roomStore)
const { startConnecting } = useConnectLolClient()

const { getChampions, randomChampions, randomChampion } = useChampions()


const teams = reactive<Record<TeamKey, LolSummonerSummoner[]>>({
  left: [],
  right: []
})

//
const chooseList = ref<LolChampionsV1OwnedChampionsMinimal[]>([])

const showLeftJoinButtom = computed(() => {
  return teams.left.length < 5 && teams.left.every(e => e.accountId !== roomInfo.value.owner)
})

const showRightJoinButtom = computed(() => {
  return teams.right.length < 5 && teams.right.every(e => e.accountId !== roomInfo.value.owner)
})

//#region

const randomCount = ref(RANDOM_COUNT)


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

const debounce = <F extends (...args: any[]) => any>(fn: F, delay: number, immediate: boolean = false): ((...args: Parameters<F>) => void) => {
  let timeout: number | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      if (!timeout) fn(...args);
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
    } else {
      timeout = setTimeout(() => {
        fn(...args);
      }, delay);
    }
  };
};

const reRandomChampion = async () => {
  if (chooseList.value.length >= 10) return
  let champion = randomChampions()
  while (chooseList.value.map(e => e.id).includes(champion.id)) {
    champion = randomChampions()
  }
  chooseList.value.push(champion)
}

const chooseChampion = debounce(async (item: LolChampionsV1OwnedChampionsMinimal) => {
  try {
    if (!item) return
    await syncSelectChampion(item)
    randomChampion.value = item
    // randomChampion.value = item

  } catch (error) {
    throw error
  }
}, 200, true)



const joinTeam = (teamKey: TeamKey, user?: LolSummonerSummoner) => {
  try {
    if (!user) throw new Error("用户不存在");
    let otherKey: TeamKey = teamKey === 'left' ? 'right' : 'left'
    let _idx = teams[otherKey].findIndex(e => e.accountId === user.accountId)
    teams[otherKey].splice(_idx, 1)
    teams[teamKey].push(user)
  } catch (error: any) {
    dialog.message(error.message)
  }
}


const copy = (text: string) => {
  clipboard.writeText(text)
}

const checkConnecting = () => {
  try {
    getInstance()
  } catch (error: any) {
    if (error.message.includes("No lol client instance found")) {
      return startConnecting()
    }
    return Promise.reject(error.message)
  }
  return Promise.resolve()
}

const initUserTeams = () => {
  const user = curUser.value
  if (teams.left.length < 5 && teams.left.length <= teams.right.length) {
    teams.left.push(user)
  } else {
    teams.right.push(user)
  }
}

const connectLolSocket = async () => {
  const lcuInfo = getInstance().getLcuInfo()
  await LolSocketManager.init(lcuInfo)
  const lolSocket = LolSocketManager.getInstance()
  const stopOnLobby = lolSocket.on("/lol-lobby/v2/lobby", (data: any) => {
    console.log("single:", data);
  })
  const CHAMPION_SELECT = "/lol-champ-select/v1/session"
  const stopOnChampSelect = lolSocket.on<LolChampSelectChampSelectSession>(CHAMPION_SELECT, (data) => {
    const action = data.data.actions[0][0]
    if (!action) return
    if (action.completed) return
    const choosedChampion = randomChampion.value
    if (choosedChampion && action.championId !== choosedChampion.id) {
      console.log("锁定本软件上的英雄");
      chooseChampion(randomChampion.value)
    }

  })

  return () => {
    stopOnLobby()
    stopOnChampSelect()
  }
}

const syncSelectChampion = async (champion: LolChampionsV1OwnedChampionsMinimal) => {
  // try {
  const session = await lolSelectSession()
  const action = session.actions[0][0]
  action.completed = false
  action.championId = champion.id
  await LolSelectAction(action)
  // } catch (error: any) {
  //   console.error(error)
  //   if (error.code === 404) {
  //     dialog.message("选择英雄失败啦，可能房间已经退出啦")
  //     return
  //   }
  //   dialog.message(error.message)
  //   throw new Error(error.message)
  // }
}

let stopOnSokets: () => void
onMounted(async () => {
  await checkConnecting()
  initUserTeams()
  await getChampions()
  stopOnSokets = await connectLolSocket()
})

onBeforeUpdate(() => {
  stopOnSokets?.()
})

onUpdated(async () => {
  stopOnSokets = await connectLolSocket()
})


</script>

<style lang="scss" scoped>
.user-list-width {
  width: 300px
}

.user-item {
  position: relative;

  // &:not(:nth-last-child(1)) {
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

  // }

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

.radial-bg {
  background: radial-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
}

.mask {
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
  filter: blur(10px)
}
</style>