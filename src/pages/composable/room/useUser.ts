import { getInstance } from "@/api/client";

const useUserInfo = () => {
  const curUser = ref<LolSummonerSummoner>();
  const expPercent = ref(0);

  const getUserInfo = async () => {
    try {
      const user = await getInstance().get<undefined, LolSummonerSummoner>("/lol-summoner/v1/current-summoner");
      curUser.value = user;
      return user;
    } catch (error: any) {
      console.error(error.message);
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
