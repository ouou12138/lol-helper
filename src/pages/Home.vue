  <template>
    <div class="home w-full h-full">
      <div class="card">
        <div class="card-content">
          <div class="flex mb-20px items-center gap-10px" v-if="user">
            <LolAvatar :expPercent="expPercent" :profileIconId="user.profileIconId" :summonerLevel="user.summonerLevel"
              :avatarSize="80" />
            <div>
              <span class="text-5">Hi, {{ user.displayName }}</span>
              <span class="text-#666 dark:text-#ccc">#{{ user.tagLine }}</span>
            </div>
          </div>
          <div class="choose-mode" v-show="action === 'none'">
            <div class="mode-item " @click="setAction('create')">
              <p class="m0 py-5px">创建房间</p>
              <div class="tips">创建新房间，邀请朋友加入开黑</div>
            </div>
            <div class="mode-item " @click="setAction('join')">
              <p class="m0 py-5px">加入房间</p>
              <div class="tips">输入房间id加入游戏</div>
            </div>
          </div>
          <div class="" v-if="action === 'create'">
            <CreateRoom ref="createRoomRef" />
          </div>
          <div class="join-room" v-if="action === 'join'">
            <JoinRoom ref="JoinRoomRef" />
          </div>
          <div class="flex justify-end items-center gap-2" v-show="action !== 'none'">
            <div class="cancel-btn" @click="setAction('none')">
              <button class="bg-#000/0 border-0 dark:text-#ccc text-#666 p10px">返回</button>
            </div>
            <div class="create-room-btn" v-show="action === 'create'">
              <button class="btn py-10px px-20px border-none bg-#2ecc71 rounded-10px text-white"
                @click="createRoom">创建</button>
            </div>
            <div class="join-room-btn" v-show="action === 'join'">
              <button class="btn py-10px px-20px border-none bg-#2ecc71 rounded-10px text-white"
                @click="joinRoom">加入</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import useRoomStore from '@/store/useRoomStore';
import CreateRoom from './component/CreateRoom.vue';
import JoinRoom from './component/JoinRoom.vue';
import LolAvatar from '@/components/LolAvatar.vue';
import { dialog } from '@tauri-apps/api';
import useUserStore from '@/store/useUserStore';

type ActionType = "create" | "join" | "none"

const action = ref<ActionType>("none")
const createRoomRef = ref<InstanceType<typeof CreateRoom>>()
const JoinRoomRef = ref<InstanceType<typeof JoinRoom>>()

const router = useRouter()

const roomStore = useRoomStore()
const { roomInfo } = storeToRefs(roomStore)
const { user, expPercent } = storeToRefs(useUserStore())



const setAction = (_act: ActionType) => {
  action.value = _act
}

const createRoom = async () => {
  try {
    const values = createRoomRef.value!.submitData()
    roomStore.updateRoomInfo({
      id: values.id,
      name: values.name,
      password: values.password,
      owner: user.value?.summonerId || -1
    })
    router.push('/room/' + values?.id + "?owner=true")
  } catch (error: any) {
    console.error(error.message)
  }
}
const joinRoom = async () => {
  try {
    const values = JoinRoomRef.value?.submitData()
    router.push('/room/' + values?.id)
  } catch (error: any) {
    console.error(error.message)
  }
}

const init = () => {
  if (roomInfo.value.id) {
    dialog.confirm("已加入房间，是否重连？").then(() => {
      router.push('/room/' + roomInfo.value.id)
    })
  }
}

onMounted(init)

</script>

<style lang="scss" scoped>
.card {
  interpolate-size: allow-keywords;
  width: 320px;
  min-width: 300px;
  height: auto;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 3px 3px 16px var(--un-shadow-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s, background-color 0.8s;
  @apply dark:bg-darkSecondary bg-#fefefe dark:text-#fefefe dark:shadow-#aaa/10 shadow-#000/10;
}

.choose-mode {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;

  .mode-item {
    height: 100px;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid;
    transition: all 0.3s;
    @apply dark:border-#ccc/10 border-#000/10;

    .tips {
      font-size: 14px;
      @apply dark:text-#ccc text-#000/50;
    }

    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }
}

@screen lt-sm {
  .card {
    width: 400px;
  }
}
</style>