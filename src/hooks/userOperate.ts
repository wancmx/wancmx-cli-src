import { piniaUserOperateStore } from "@/store/userOperate.ts";
import { onMounted, onUnmounted } from "vue";

export default () => {
  const userOperate = piniaUserOperateStore();
  onMounted(() => {
    window.addEventListener("keydown", keyFunc);
    window.addEventListener("keyup", keyFunc);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", keyFunc);
    window.removeEventListener("keyup", keyFunc);
  });

  const keyFunc = (e: any) => {
    if (e.keyCode === 27) {
      userOperate.changeIsEscClick(e.type === "keydown" ? true : false);
    }
    if (e.keyCode === 16) {
      userOperate.changeIsShiftClick(e.type === "keydown" ? true : false);
    }
    if (e.keyCode === 17) {
      userOperate.changeIsCtrlClick(e.type === "keydown" ? true : false);
    }
    // if (e.keyCode === 13) {
    //   getIsEnterClick.value = false;
    // }
  };

  return {};
};
