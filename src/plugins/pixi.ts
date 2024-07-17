import { Ref } from "vue";

// pixi工具类
export default class PIXITool {
  app: Ref<any>;
  constructor(app: Ref<any>) {
    this.app = app;
  }

  /**
   * 获取当前鼠标在整个坐标轴的位置
   */
  getPointerPosition() {
    // console.log(this.app.value.renderer.events.pointer.global); // 鼠标相较于stage左侧的位置
    // console.log(this.app.value.stage.position); // stage左上角距离原点的位置
    const pointerInWorld = this.app.value.renderer.events.pointer.global;
    const { x: px, y: py } = pointerInWorld;
    const nx =
      (px - this.app.value.stage.position.x) / this.app.value.stage.scale.x;
    const ny =
      (py - this.app.value.stage.position.y) / this.app.value.stage.scale.y;
    return {
      x: Math.floor(nx),
      y: Math.floor(ny),
    };
  }
}
