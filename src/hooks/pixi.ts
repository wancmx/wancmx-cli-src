import { Ref, ref } from "vue";
import * as PIXI from "pixi.js";

/**
 * 一切 PIXI.interface|any 主要是为了代码提示
 * @param pixi 构建的容器ref
 */
export default (pixi: Ref) => {
  // pixi 外层容器
  const app = ref<any>();
  let initPixiOption = ref<PIXI.IApplicationOptions | any>();
  let dragFlag = ref<boolean>(false);
  let startPoint = ref<any>();
  let graphics = ref<any>();
  let staticGraphics = ref<PIXI.Graphics>(new PIXI.Graphics());
  let textContainer = ref<PIXI.Container>(new PIXI.ParticleContainer());
  /**
   * 创建 app
   * @param initObj PIXI.IApplicationOptions 初始创建的参数
   */
  const createPixiApp = (initObj: PIXI.IApplicationOptions | any) => {
    initPixiOption.value = initObj;
    app.value = new PIXI.Application(initObj);

    // app.value.stage.scale.set(1, -1);
    pixi.value.appendChild(app.value.view);
  };

  /**
   * 更新staticGraphics
   */
  const getNewStaticGraphics = () => {
    let oldStaticGraphics = staticGraphics.value;
    staticGraphics.value = new PIXI.Graphics();
    return {
      oldStaticGraphics,
      newStaticGraphics: staticGraphics.value,
    };
  };

  const canvasWheel = () => {
    app.value.view.addEventListener("wheel", (e: any) => {
      e.preventDefault();

      const scaleFactor = 1.34;
      const direction = e.deltaY < 0 ? 1 : -1;

      // 鼠标在世界坐标下的位置
      const pointerInWorld = app.value.renderer.events.pointer.global;
      const { x: px, y: py } = pointerInWorld;

      // 计算缩放后的世界坐标的位置
      const newScaleX = app.value.stage.scale.x * scaleFactor ** direction;
      const newScaleY = app.value.stage.scale.x * scaleFactor ** direction;

      // (px - app.value.stage.position.x)-(px - app.value.stage.position.x) * (newScale / app.value.stage.scale.x) + app.value.stage.position.x
      // px-app.value.stage.position.x是鼠标位置相较于坐标轴原点的点位坐标
      // (px - app.value.stage.position.x) * (newScale / app.value.stage.scale.x)是经过缩放后鼠标位置相较于坐标轴原点的点位坐标
      // 二者做减法可以得到一个偏移量
      // app.value.stage.position.x 是stage左上角相较于坐标轴原点的点位信息，将所得的偏移量加上原来的点位信息，即可将图纸挪到新缩放后的位置
      // 经过约分，-app.value.stage.position.x+app.value.stage.position.x后，得到 px - (px - app.value.stage.position.x) * (newScale / app.value.stage.scale.x)
      const nx =
        px -
        (px - app.value.stage.position.x) *
          (newScaleX / app.value.stage.scale.x);
      const ny =
        py -
        (py - app.value.stage.position.y) *
          (newScaleY / app.value.stage.scale.y);

      // 更新缩放和世界坐标
      app.value.stage.scale.set(newScaleX, newScaleY);
      app.value.stage.position.set(nx, ny);
    });
  };

  /**
   * 拖拽
   */
  const dragFunc = () => {
    app.value.view.addEventListener("mousedown", (event: any) => {
      if (event.button === 1) {
        dragFlag.value = true;
        startPoint.value = {
          x: app.value.renderer.events.pointer.global.x,
          y: app.value.renderer.events.pointer.global.y,
        };
      }
    });
    app.value.view.addEventListener("mousemove", (event: any) => {
      if (dragFlag.value) {
        const dx =
          app.value.renderer.events.pointer.global.x - startPoint.value.x;
        const dy =
          app.value.renderer.events.pointer.global.y - startPoint.value.y;
        app.value.stage.position.x += dx;
        app.value.stage.position.y += dy;
        startPoint.value = {
          x: app.value.renderer.events.pointer.global.x,
          y: app.value.renderer.events.pointer.global.y,
        };
      }
    });
    app.value.view.addEventListener("mouseup", (event: any) => {
      if (event.button === 1) {
        dragFlag.value = false;
      }
    });
  };

  // 初始中心定位
  const initPosition = (xRange: any, yRange: any) => {
    let centerPoint = [
      (xRange[0] + xRange[1]) / 2,
      (yRange[0] + yRange[1]) / 2,
    ];
    let oldScaleX = app.value.stage.scale.x;
    let newScaleX = null;
    let newScaleY = null;
    newScaleX = oldScaleX / 7;
    newScaleY = -oldScaleX / 7;
    // app.value.stage.scale.x = newScale;
    // app.value.stage.scale.y = newScale;
    app.value.stage.scale.set(newScaleX, newScaleY);
    app.value.stage.position.x = -(centerPoint[0] * newScaleX);
    app.value.stage.position.y = -(centerPoint[1] * newScaleY);
    app.value.stage.position.set(
      -(centerPoint[0] * newScaleX) + app.value.renderer.width * 0.5,
      -(centerPoint[1] * newScaleY) + app.value.renderer.height * 0.5
    );
  };

  // 绘制线
  const drawLine = (
    points: Array<any>,
    eventObj?: {
      eventName: string;
      eventCallback: Function;
    },
    polygonStyle: any = {
      strokeWidth: 2, // 线宽
      stroke: "#7FCEC4", // 线颜色
      opacity: 1, // 透明度 alpha
      fill: "#7FCEC4", // 填充颜色
    }
  ) => {
    let drawPoints: Array<any> = [];
    if (points) {
      // if (eventObj) {
      //   graphics.value = new PIXI.Graphics();
      // } else {
      //   graphics.value = staticGraphics.value;
      // }
      graphics.value = new PIXI.Graphics();
      graphics.value.lineStyle(
        polygonStyle.strokeWidth,
        polygonStyle.stroke,
        polygonStyle.opacity
      );
      graphics.value.beginFill(polygonStyle.fill);
      graphics.value.drawPolygon({
        points,
        closed: false,
      });
      // graphics.value.moveTo(points[0], points[1]);
      // graphics.value.lineTo(points[2], points[3]);
      graphics.value.endFill();
      if (eventObj) {
        graphics.value.eventMode = "static";
        graphics.value.cursor = "pointer";
        if (eventObj.eventCallback) {
          graphics.value.on(eventObj.eventName, () => {
            eventObj.eventCallback(graphics);
          });
        }
        let pointsArr: Array<any> = [];
        points.forEach((i, index) => {
          if (index % 2 === 0) {
            pointsArr.push([points[index], points[index + 1]]);
          }
        });

        for (let index in pointsArr) {
          let nIndex = Number(index);

          if (nIndex + 1 <= pointsArr.length - 1) {
            let x1 = pointsArr[nIndex][0];
            let y1 = pointsArr[nIndex][1];
            let x2 = pointsArr[nIndex + 1][0];
            let y2 = pointsArr[nIndex + 1][1];
            if (x1 === x2 && y1 === y2) {
              continue;
            } else if (x1 === x2) {
              // 横坐标相等，为竖线
              drawPoints = [
                x1 - 15,
                y1,
                x1 + 15,
                y1,
                x2 + 15,
                y2,
                x2 - 15,
                y2,
                x1 - 15,
                y1,
              ];
            } else if (y1 === y2) {
              // 纵坐标相等，为横线
              drawPoints = [
                x1,
                y1 - 15,
                x2,
                y2 - 15,
                x2,
                y2 + 15,
                x1,
                y1 + 15,
                x1,
                y1 - 15,
              ];
            } else {
              drawPoints = [
                x1 - 15,
                y1,
                x2 - 15,
                y2,
                x2 + 15,
                y2,
                x1 + 15,
                y1,
                x1 - 15,
                y1,
              ];
            }
          }
        }
        graphics.value.hitArea = new PIXI.Polygon(drawPoints); // 可点击范围
      }
      return graphics.value;
    }
  };

  // 绘制圆
  const drawCircle = (
    points: Array<number>,
    radius: number,
    eventObj?: {
      eventName: string;
      eventCallback: Function;
    },
    polygonStyle: any = {
      strokeWidth: 2, // 线宽
      stroke: "#7FCEC4", // 线颜色
      opacity: 1, // 透明度 alpha
      fill: "#7FCEC4", // 填充颜色
    }
  ) => {
    graphics.value = new PIXI.Graphics();
    graphics.value.lineStyle(
      polygonStyle.strokeWidth,
      polygonStyle.stroke,
      polygonStyle.opacity
    );
    graphics.value.beginFill(polygonStyle.fill);
    graphics.value.drawCircle(points[0], points[1], radius);
    graphics.value.endFill();
    if (eventObj) {
      // 构建方形可点击区域
      let radiusOut = radius + 10;
      let hitArea = [
        points[0] - radiusOut,
        points[1] - radiusOut,
        points[0] + radiusOut,
        points[1] - radiusOut,
        points[0] + radiusOut,
        points[1] + radiusOut,
        points[0] - radiusOut,
        points[1] + radiusOut,
        points[0] - radiusOut,
        points[1] - radiusOut,
      ];

      graphics.value.eventMode = "static";
      graphics.value.cursor = "pointer";
      if (eventObj.eventCallback) {
        graphics.value.on(eventObj.eventName, (event: any) => {
          eventObj.eventCallback(event, graphics.value);
        });
      }
      graphics.value.hitArea = new PIXI.Polygon(hitArea); // 可点击范围
    }
    return graphics.value;
  };

  /**
   * 绘制文字
   * @param points
   * @param text
   * @param textStyle
   */
  const drawText = (
    points: Array<number>,
    text: string,
    textStyle: PIXI.ITextStyle | any = {
      fontFamily: "Arial",
      fontSize: 15,
      fill: "white",
      stroke: "#ffffff",
      strokeThickness: 1,
      dropShadow: false,
      dropShadowColor: initPixiOption.value.backgroundColor,
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      align: "center",
    }
  ) => {
    let style = new PIXI.TextStyle(textStyle);
    let message = new PIXI.Text(text, style);
    message.position.set(points[0], points[1]);
    message.scale.set(message.scale.x, message.scale.y);
    // app.value.stage.addChild(message);
    return message;
  };
  return {
    app,
    createPixiApp,
    canvasWheel,
    dragFunc,
    initPosition,
    drawText,
    drawCircle,
    drawLine,
    textContainer,
    getNewStaticGraphics,
    // getHitArea,
  };
};
