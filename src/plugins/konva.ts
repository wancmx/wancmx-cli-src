import { nextTick } from "vue";
import strokeWidthHook from "../hooks/konva.ts";
/**
 * 缩放画布
 * @param stage v-stage
 * @param e 鼠标滚轮事件的$event
 */
export const stageZoomInZoomOut = (
  stage: any,
  e: any,
  needReverse: boolean = true
) => {
  // let scaleBy = 1.04;
  let scaleBy = 1.34;

  e.evt.preventDefault();
  let oldScale = stage.getNode().scaleX();
  let pointer = stage.getNode().getPointerPosition();

  let mousePointTo = {
    x: (pointer.x - stage.getNode().x()) / oldScale,
    y: (pointer.y - stage.getNode().y()) / oldScale,
  };
  let direction = e.evt.deltaY < 0 ? 1 : -1;
  if (e.evt.ctrlKey) {
    direction = -direction;
  }
  let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  // 保证缩放时的线段为矢量线段
  let strokeWidth = strokeWidthHook(stage).strokeWidth;
  strokeWidth.value =
    direction > 0 ? strokeWidth.value / scaleBy : strokeWidth.value * scaleBy;
  if (needReverse) {
    stage.getNode().scale({
      x: newScale,
      y: -newScale,
    });
  } else {
    stage.getNode().scale({
      x: newScale,
      y: newScale,
    });
  }
  let newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.getNode().position(newPos);
};

/**
 * 获取鼠标在画布上的坐标
 */
export const mouseCli = (stage: any, e?: any) => {
  let pointer = stage.getNode().getRelativePointerPosition();
  return pointer;
};

/**
 * 重置相机位置
 * @param data fileUploadResponse
 * @param stage v-stage
 */
export const resetCamera = (
  data: {
    x_left: number;
    x_right: number;
    y_bot: number;
    y_top: number;
  }, // 传入要绘制区域的x最左边与最右边的坐标，y最上面与y最下面的坐标，方便确定相机在画布上的中心点
  stage: any,
  size: {
    width: string | number;
    height: string | number;
    draggable?: boolean;
  },
  needReverse: boolean = true
) => {
  let { x_left, x_right, y_top, y_bot } = data;
  let scaleX = Number(size.width) / (x_right - x_left);
  let scaleY = Number(size.width) / (y_top - y_bot);
  let resetData = {
    scale: Math.min(scaleX, scaleY),
    x: -x_left,
    y: y_top,
  };
  if (needReverse) {
    stage.getNode().scale({
      x: resetData.scale,
      y: -resetData.scale,
    });
    strokeWidthHook(stage).initStrokeWidth();
  } else {
    stage.getNode().scale({
      x: resetData.scale,
      y: resetData.scale,
    });
  }

  var newPos = {
    x: resetData.x * resetData.scale,
    y: resetData.y * resetData.scale,
  };
  stage.getNode().position(newPos);
};

/**
 * 初始化视图
 * @param value
 * @param stage
 * @param configKonva
 */
export const defaultZoomOutCanvas = (
  value: {
    x_left: number;
    x_right: number;
    y_bot: number;
    y_top: number;
  },
  stage: any,
  configKonva: {
    width: string | number;
    height: string | number;
    draggable?: boolean;
  },
  needReverse: boolean = true
) => {
  nextTick(() => {
    if (stage.value) {
      let oldScale = stage.value.getNode().scaleX();
      let newScale = oldScale / 7;
      if (needReverse) {
        stage.value.getNode().scale({
          x: newScale,
          y: -newScale,
        });
      } else {
        stage.value.getNode().scale({
          x: newScale,
          y: newScale,
        });
      }
      resetCamera(value, stage, configKonva, needReverse);
    }
  });
};

/**
 * 计算当前鼠标的位置
 * @param stage v-konva的stage dom元素
 * @returns
 */
export const countPoint = (
  stage: any
): {
  x: number | null;
  y: number | null;
} => {
  let pointerPosition: {
    x: number | null;
    y: number | null;
  } = {
    x: null,
    y: null,
  };
  if (
    stage &&
    stage.getNode().getPointerPosition() &&
    stage.getNode().getPointerPosition().x !== null &&
    stage.getNode().getPointerPosition().y !== null
  ) {
    pointerPosition.x =
      (stage.getNode().getPointerPosition().x - stage.getNode().x()) /
      stage.getNode().scaleX();
    pointerPosition.y =
      (stage.getNode().getPointerPosition().y - stage.getNode().y()) /
      stage.getNode().scaleY();
  }
  return pointerPosition;
};
