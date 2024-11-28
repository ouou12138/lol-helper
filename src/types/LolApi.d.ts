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

type LolSummonerProfilePrivacySetting = PUBLIC | PRIVATE;
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

type LolChampSelectChampSelectAction = {
  actorCellId: number;
  championId: number;
  completed: boolean;
  id: number;
  isAllyAction: boolean;
  isInProgress: boolean;
  pickTurn: 1;
  type: string;
};

type LolChampSelectChampSelectBannedChampions = {
  myTeamBans: nubmer[];
  numBans: number;
  theirTeamBans: number[];
};
type LolChampSelectChampSelectPlayerSelection = {
  assignedPosition: string;
  cellId: number;
  championId: number;
  championPickIntent: number;
  entitledFeatureType: string;
  selectedSkinId: number;
  spell1Id: number;
  spell2Id: number;
  summonerId: number;
  team: number;
  wardSkinId: number;
};

type LolChampSelectChampSelectTimer = {
  adjustedTimeLeftInPhase: number;
  internalNowInEpochMs: number;
  isInfinite: boolean;
  phase: "BAN_PICK";
  totalTimeInPhase: number;
};

type LolChampSelectChampSelectSession = {
  actions: LolChampSelectChampSelectAction[][];
  allowBattleBoost: boolean;
  allowDuplicatePicks: boolean;
  allowLockedEvents: boolean;
  allowRerolling: boolean;
  allowSkinSelection: boolean;
  bans: LolChampSelectChampSelectBannedChampions;
  benchChampions: number[];
  benchEnabled: boolean;
  boostableSkinCount: 1;
  chatDetails: {
    mucJwtDto: {
      channelClaim: string;
      domain: "lol-champ-select";
      jwt: string;
      targetRegion: "hn1";
    };
    multiUserChatId: string;
    multiUserChatPassword: string; //jwt
  };
  counter: number;
  gameId: number;
  hasSimultaneousBans: boolean;
  hasSimultaneousPicks: boolean;
  isCustomGame: boolean;
  isSpectating: boolean;
  localPlayerCellId: number;
  lockedEventIndex: number;
  myTeam: LolChampSelectChampSelectPlayerSelection[];
  pickOrderSwaps: [];
  recoveryCounter: number;
  rerollsRemaining: number;
  skipChampionSelect: boolean;
  theirTeam: [];
  timer: LolChampSelectChampSelectTimer;
  trades: [];
};
