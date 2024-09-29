import { getInstance } from "@/api/client";

const useUserInfo = () => {
  const curUser = ref<LolSummonerSummoner>();
  const expPercent = ref("");

  const getUserInfo = async () => {
    try {
      const user = await getInstance().get<undefined, LolSummonerSummoner>("/lol-summoner/v1/current-summoner");
      curUser.value = user;
      expPercent.value = ((user.xpSinceLastLevel / user.xpUntilNextLevel) * 100 * 0.81).toFixed(0) + "%";
      return user;
    } catch (error: any) {
      throw new Error(error.message || "未知错误");
    }
  };

  return {
    curUser,
    expPercent,
    getUserInfo,
  };
};

export default useUserInfo;
