import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import LolSocketManager from "@/api/lolSocket";
import { createApp } from "vue";
import App from "./App.vue";
import "@/plugin/AwesomeIcon";
import router from "./router";
import "uno.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App).use(router).use(pinia);

app.mount("#app");

app.onUnmount(() => {
  LolSocketManager.disconnect();
});

window.addEventListener("unload", () => {
  LolSocketManager.disconnect();
});
