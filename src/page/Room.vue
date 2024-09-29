<template>
  <div class="h-full flex flex-col relative">
    <Image class="w-full h-full object-cover absolute left-0 top-0 right-0 bottom-0"
      :src="randomChampion!.baseSplashPath" v-if="randomChampion?.id" />
    <div class="absolute w-full h-full left-0 top-0 right-0 bottom-0 mask" v-if="randomChampion?.id"></div>
    <div class="w-full h-full flex flex-1 z-2 ">
      <div class="user-list-width h-full grid grid-rows-5 backdrop-blur-5px">
        <div class="w-full h-full user-item" v-for="item in teams.left" :key="item.accountId">
          <div class="w-full h-full flex items-center justify-start box-border px-20px py-5px gap-10px">
            <div class="avatar-wrapper">
              <img class="avatar" :src="getAvatarUrl(String(item.profileIconId))" />
              <div class="level">{{ item.summonerLevel }}</div>
            </div>
            <div class="min-h-50px">
              <div class="text-3.5 font-bold text-base whitespace-nowrap cursor-pointer"
                @click="() => copy(item.displayName + '#' + item.tagLine)">
                <span class="text-#666 dark:text-#eee"> {{ item.displayName }}</span>
                <span class="ml-5px text-3 text-#666 dark:text-#ccc">#{{ item.tagLine }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full flex items-center justify-center user-item"
          v-if="teams.left.length < 5 && teams.left.every(e => e.accountId !== roomInfo.owner)">
          <div class="lol-button" role="button" @click="() => joinTeam('left', curUser!)">
            <div class="z-2 lol-bt-content">加入</div>
          </div>
        </div>
      </div>
      <div class="w-full h-full flex flex-col">
        <div class="flex-1"></div>
        <div class="w-full h-40%">
          <div class="flex py-4 justify-center"><Button @click="reRandomChampion">重新随机</Button></div>
          <div class="grid grid-cols-5 gap-10px place-items-center">
            <div class="w-60px h-60px flex justify-center rounded-100% overflow-hidden cursor-pointer"
              v-for="item in chooseList" @click="() => chooseChampion(item)" role="button">
              <Image class="w-full h-full scale-120" :src="item.squarePortraitPath" />
            </div>
          </div>
        </div>
      </div>
      <div class="user-list-width h-full grid grid-rows-5">
        <div class="w-full h-full user-item right" v-for="item in teams.right" :key="item.accountId">
          <div
            class="w-full h-full flex flex-row-reverse items-center justify-start box-border px-20px gap-10px py-5px">
            <div class="avatar-wrapper">
              <img class="avatar" :src="getAvatarUrl(String(item.profileIconId))" />
              <div class="level">{{ item.summonerLevel }}</div>
            </div>
            <div class="min-h-50px">
              <div class="text-3.5 font-bold text-base whitespace-nowrap cursor-pointer"
                @click="() => copy(item.displayName + '#' + item.tagLine)">
                <span>{{ item.displayName }}</span>
                <span class="ml-5px text-3 text-#666 dark:text-#ccc">#{{ item.tagLine }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full flex items-center justify-center user-item right"
          v-if="teams.right.length < 5 && teams.right.every(e => e.accountId !== roomInfo.owner)">
          <div class="lol-button" role="button" @click="() => joinTeam('right', curUser!)">
            <div class="z-2 lol-bt-content">加入</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/Button.vue'
import Image from '@/components/Image.vue'
import { dialog, invoke, clipboard } from '@tauri-apps/api';
import { create, getInstance } from "@/api/client"
import useRoomStore from '@/store/useRoomStore';
import { getAvatarUrl } from "@/utils/tool"
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
  randomChampion.value = item
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
    dialog.message(error.message || "未知错误")
  }
}

const joinTeam = (teamKey: TeamKey, user: LolSummonerSummoner) => {
  try {
    if (!user) throw new Error("用户不存在")
    let index = teams[teamKey].findIndex(e => e.accountId === user.accountId)
    Object.keys(teams).forEach(key => {
      teams[key as TeamKey].splice(index, 1)
    })
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
  width: 600px
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

  // }

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

.avatar-wrapper {
  position: relative;
  border: 2px solid #745c2d;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  --exp-precent: v-bind(expPercent);


  .avatar {
    width: 60px;
    height: 60px;
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
  font-size: 12px;
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

.lol-button {
  color: #ccc;
  background-color: #967430;
  cursor: pointer;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  @apply text-3.5 p-2px;
  position: relative;

  .lol-bt-content {
    display: inline-block;
    background-color: #1e2328;
    position: relative;
    z-index: 2;
    min-width: 50px;
    text-align: center;
    padding: 5px 30px;
  }

  &:hover {
    .lol-bt-content {
      background: linear-gradient(to top, #3c382a, #1e2328 60%, #1e2328);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
      /* 创建从透明到白色的水平渐变 */
      filter: saturate(0.8);
      /* 应用模糊效果来创建柔和的阴影 */
      z-index: 0;
    }
  }

  &:active {
    content: "";
    display: block;
    filter: grayscale(1);
  }
}

.mask {
  background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
  filter: blur(10px)
}
</style>