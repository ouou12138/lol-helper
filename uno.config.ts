import { defineConfig, presetMini } from "unocss";
import presetUno, { type Theme } from "@unocss/preset-uno";
import transformerDirectives from "@unocss/transformer-directives";
import presetIcons from "@unocss/preset-icons";

export default defineConfig<Theme>({
  presets: [presetUno({ dark: "class" }), presetMini(), presetIcons()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      darkPrimary: "#000",
      darkSecondary: "#333",
      darkTertiary: "#666",

      primary: "#1677ff",
      "primary-active": "#4096ff",
    },
  },
});
