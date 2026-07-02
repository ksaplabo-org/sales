import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";

import { BootstrapVueNextResolver } from "bootstrap-vue-next/resolvers";

export default defineConfig({
  plugins: [
    Vue(),
    Components({
      dts: true,
      deep: true,
      dirs: [
        "src/components", // デフォルトで読み込まれるディレクトリ
        "src/pages", // コンポーネントが入っているパスを追加する
        "src/**/*.vue",
      ],
      globs: ["src/**/*.vue"],
      resolvers: [BootstrapVueNextResolver()],
    }),
    /*
    VueComponents({
      resolvers: [BootstrapVueNextResolver()],
    }),
    */
  ],
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/scss/sb-admin.scss"`,
      },
    },
  },
});
