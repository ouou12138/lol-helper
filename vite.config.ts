import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Jsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    Jsx(),
    UnoCss(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      // dts: true,
    }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  resolve: {
    alias: {
      "@": "/src",
    },
  },
}));
