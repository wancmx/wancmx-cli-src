import { defineStore } from "pinia";

// 定义 pinia 的 user store部分
export const piniaUserOperateStore = defineStore({
  id: "userOperate",
  state: () => ({
    isEscClick: false,
    isShiftClick: false,
    isCtrlClick: false,
  }),

  getters: {},

  actions: {
    changeIsEscClick(value: boolean) {
      this.isEscClick = value;
    },
    changeIsShiftClick(value: boolean) {
      this.isShiftClick = value;
    },
    changeIsCtrlClick(value: boolean) {
      this.isCtrlClick = value;
    },
  },
});
