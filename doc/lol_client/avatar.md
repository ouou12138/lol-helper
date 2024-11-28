### 用户头像显示规则

1. 通过 `/lol-summoner/v1/current-summoner` 接口获取当前召唤师信息，其中包含召唤师头像的 `profileIconId`。
2. 通过 `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileIconId}.jpg` 接口获取当前召唤师头像。

### update 2024-10-14

##### 直接通过客户端获取召唤师头像

1. 通过 `/lol-summoner/v1/current-summoner` 接口获取当前召唤师信息，其中包含召唤师头像的 `profileIconId`。
2. 通过 `https://127.0.0.1:${port}/lol-game-data/assets/v1/profile-icons/${profileIconId}.jpg` 接口获取当前召唤师头像。
