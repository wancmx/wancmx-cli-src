import { defineStore } from "pinia";

// 定义 pinia 的 user store部分
export const piniaPageInfo = defineStore({
  id: "pageInfo",
  state: () => ({
    pathRouter: "",
  }),

  getters: {},

  actions: {
    /**
     * 存储当前路由
     * @param newPath 新的路由地址
     */
    changePathRouter(newPath: string) {
      this.pathRouter = newPath;
    },
  },
});
