type LolSummonerSummoner = {
  accountId: number;
  displayName: string;
  internalName: string;
  nameChangeFlag: boolean;
  percentCompleteForNextLevel: number;
  privacy: LolSummonerProfilePrivacySetting;
  profileIconId: number;
  puuid: string;
  rerollPoints: LolSummonerRerollPoints;
  summonerId: number;
  summonerLevel: number;
  unnamed: boolean;
  tagLine: string;
  xpSinceLastLevel: number;
  xpUntilNextLevel: number;
};

type LolSummonerProfilePrivacySetting = "PUBLIC" | "PRIVATE";
type LolSummonerRerollPoints = {
  currentPoints: number;
  maxRolls: number;
  numberOfRolls: number;
  pointsCostToRoll: number;
  pointsToReroll: number;
};

type LolChampionsV1OwnedChampionsMinimal = {
  active: boolean;
  alias: string;
  banVoPath: string;
  baseLoadScreenPath: string;
  baseSplashPath: string;
  botEnabled: boolean;
  chooseVoPath: string;
  disabledQueues: string[];
  freeToPlay: boolean;
  id: number;
  name: string;
  ownership: LolChampionsCollectionsOwnership;
  purchased: number;
  rankedPlayEnabled: boolean;
  roles: string[];
  squarePortraitPath: string;
  stingerSfxPath: string;
  title: string;
};

type LolChampionsCollectionsOwnership = {
  freeToPlayReward: boolean;
  owned: boolean;
  rental: LolChampionsCollectionsRental;
};
type LolChampionsCollectionsRental = {
  endDate: number;
  purchaseDate: number;
  rented: boolean;
  winCountRemaining: number;
};
