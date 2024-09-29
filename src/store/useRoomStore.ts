type RoomInfo = {
  id: string;
  name: string;
  password: string;
  owner: number;
};

const createRoomInfo = (): RoomInfo => ({
  id: "",
  name: "",
  password: "",
  owner: -1,
});

const useRoomStore = defineStore(
  "room",
  () => {
    const roomInfo = ref<RoomInfo>(createRoomInfo());

    const updateRoomInfo = (info: Partial<RoomInfo>) => {
      console.log("23333333333", info);

      roomInfo.value = {
        ...roomInfo.value,
        ...info,
      };
    };

    const clear = () => {
      roomInfo.value = createRoomInfo();
    };

    return {
      roomInfo,
      updateRoomInfo,
      clear,
    };
  },
  {
    persist: true,
  }
);

export default useRoomStore;
