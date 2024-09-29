import { getInstance } from "@/api/client";

const useChampions = () => {
  const minimalChampions = ref<LolChampionsV1OwnedChampionsMinimal[]>([]);
  const randomChampion = ref<LolChampionsV1OwnedChampionsMinimal>();

  const getChampions = async () => {
    try {
      const res = await getInstance().get<undefined, LolChampionsV1OwnedChampionsMinimal[]>(
        "/lol-champions/v1/owned-champions-minimal"
      );
      minimalChampions.value = res;
      return res;
    } catch (error: any) {
      throw new Error(error.message || "未知错误");
    }
  };

  const randomChampions = () => {
    let count = minimalChampions.value.length;
    let index = Math.floor(Math.random() * count);
    randomChampion.value = minimalChampions.value[index];
    return randomChampion.value;
  };

  return {
    minimalChampions,
    randomChampion,
    getChampions,
    randomChampions,
  };
};

export default useChampions;
