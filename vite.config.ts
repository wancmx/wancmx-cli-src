import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    define: {
      "process.env": {},
    },
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    // proxy代理
    server: {
      host: "0.0.0.0",
      port: 8080,
      proxy: {
        [env.VITE_APP_ENV_API as string]: {
          target: env.VITE_APP_TARGET,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            let reg = new RegExp(`^${env.VITE_APP_ENV_API}`);
            return path.replace(reg, "/api");
          },
          // bypass: (req, res, options) => {
          //   const proxyUrl = options.target + options.rewrite(req.url);
          //   console.log(proxyUrl);
          //   req.headers["x-req-proxyURL"] = proxyUrl;
          //   res.setHeader("x-req-proxyURL", proxyUrl);
          // },
        },
      },
    },
  };
});
