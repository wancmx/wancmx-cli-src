import { ILineMapItem } from "@/models/homePage/homePage.models";
import { piniaCameraInfo } from "@/store/camera";
import { cloneDeep } from "lodash";
import { ref } from "vue";

// 用户操作hook
export default () => {
  let cameraInfo = piniaCameraInfo();
  let initValue = ref<Map<string, ILineMapItem>>();
  let historyQueue: Array<Map<string, ILineMapItem>> = [];
  let count = -1; // 指针
  // 设置类setting方法，便于追踪initValue的变化
  const setInitValue = (value: Map<string, ILineMapItem>) => {
    initValue.value = cloneDeep(value);
  };

  /**
   * 存储用户的操作
   * @param currentMap
   */
  const saveOperate = () => {
    if (!(historyQueue.length < 40)) {
      historyQueue.shift(); // 删除队列第一项
    }
    historyQueue.push(cameraInfo.lineMap);
    count = historyQueue.length - 1;
  };

  const back = () => {
    // 进行count下标位置校验
    if (count >= 1 && count <= historyQueue.length - 1) {
      count -= 1;
      cameraInfo.changeLineMap(historyQueue[count]);
    }
  };

  const forward = () => {
    if (count >= 0 && count <= historyQueue.length - 2) {
      count += 1;
      cameraInfo.changeLineMap(historyQueue[count]);
    }
  };

  return {
    initValue,
    setInitValue,
    saveOperate,
    back,
    forward,
    historyQueue,
  };
};
