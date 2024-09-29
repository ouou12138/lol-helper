### 用户头像显示规则

1. 通过 `/lol-summoner/v1/current-summoner` 接口获取当前召唤师信息，其中包含召唤师头像的 `profileIconId`。
2. 通过 `https://raw.communitydragon.org/14.9/game/assets/ux/summonericons/profileicon${profileIconId}.png` 接口获取当前召唤师头像。
