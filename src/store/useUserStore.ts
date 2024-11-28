import { defineStore } from "pinia";
import { getInstance } from "@/api/client";

const useUserStore = defineStore("user-store", () => {
  const user = ref<LolSummonerSummoner>();
  const expPercent = ref<number>(0);

  const updateUserInfo = async () => {
    try {
      const userInfo = await getInstance().get<undefined, LolSummonerSummoner>("/lol-summoner/v1/current-summoner");
      user.value = userInfo;
      expPercent.value = calcExpPercent(userInfo.xpSinceLastLevel, userInfo.xpUntilNextLevel);
      return user;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message || "未知错误");
    }
  };

  const calcExpPercent = (curExp: number, nextExp: number) => {
    return Math.max(0.01, Number((curExp / nextExp).toFixed(2)));
  };

  return {
    user,
    expPercent,
    updateUserInfo,
  };
});

export default useUserStore;
