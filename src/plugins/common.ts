import { IPosition } from "@/models/common/common.models";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash";
import * as turf from "@turf/turf";
import { Position } from "geojson";
/**
 * el消息提示
 * @param message
 */
export const alertMessage = (
  message: string,
  type: "success" | "warning" | "info" | "error" = "error",
  showClose: boolean = true,
  callback: Function = () => {}
) => {
  ElMessage({
    duration: 2000,
    message,
    type,
    showClose,
    onClose: callback(),
  });
};

/**
 * 解析wasm
 * @param url wasm的路径
 * @param importObject 参数
 * @returns
 */
// const WASM_URL = "/src/wasm/pkg/hello_wasm_bg.wasm";
//   wasmFetch(WASM_URL).then((result: any) => {
//     let { loop_test, f_to_c } = result;
//     let count = loop_test();
//     let c = f_to_c(100);
//     console.log(count);
//     console.log(c);
//   });
export const wasmFetch = async (url: string, importObject?: any) => {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  const results = await WebAssembly.instantiate(bytes, importObject);
  return results.instance.exports ? results.instance.exports : results.instance;
};

/**
 * 公共下载方法,定义对应service调用接口时，对应接口需要转为blob，如
 * export function downloadSample() {
 * return request({
 *   url: "/client/downloadSample",
 *   method: "get",
 *   responseType: "arraybuffer", // blob流处理
 *  }).catch((error: any) => {
 *   alertMessage(error.response.data.result || error.message, "error");
 *  });
}

 * @param params 接口入参
 * @param callback 接口函数 回调的方式调用
 * @param downloadFileName 下载的文件名
 * @param fileType 文件类型
 */
export function downloadFile(
  params: any,
  callback: Function,
  downloadFileName: string,
  fileType: string = "zip"
) {
  return callback(params).then((response: any) => {
    let binaryData = [];
    binaryData.push(response);
    let blob = new Blob(binaryData, {
      type: `application/${fileType}`, //word文档为msword,pdf文档为pdf
    });
    let objectUrl = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = objectUrl;
    link.setAttribute("download", downloadFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); //下载完成移除元素
    URL.revokeObjectURL(objectUrl); //释放掉blob对象
  });
}

/**
 * 图片字节流转图片
 * @param data 图片字节流
 * @returns
 */
export function byteToImage(data: any) {
  let blobUrl = "";
  const bytes = new Uint8Array(data);
  const blob = new Blob([bytes], { type: "image/png" });
  blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);
  return blobUrl;
}

/**
 * 角度转弧度
 * @param angle 角度
 * @returns
 */
export const angleToRadian = (angle: number) => {
  return angle * (Math.PI / 180);
};

/**
 * 弧度转角度
 * @param radian 弧度
 * @returns
 */
export const radianToAngle = (radian: number) => {
  return radian * (180 / Math.PI);
};

/**
 * 计算两点距离
 * @param fPoints
 * @param sPoints
 * @returns
 */
export const computedPointsLength = (
  fPoints: Array<number>,
  sPoints: Array<number>
) => {
  return Math.sqrt(
    Math.pow(fPoints[0] - sPoints[0], 2) + Math.pow(sPoints[1] - fPoints[1], 2)
  );
};

/**
 * 获取img的base64字符串
 * @param img
 * @param ext
 * @returns
 */
export const getImageBase64 = (img: any, ext: any) => {
  var canvas = document.createElement("canvas"); //创建canvas DOM元素，并设置其宽高和图片一样
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx!.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
  var dataURL = canvas.toDataURL("image/" + ext); //返回的是一串Base64编码的URL并指定格式
  (canvas as any) = null; //释放
  return dataURL;
};

/**
 * base64 解码 去除中文影响
 * @param str
 * @returns
 */
export function getDecode(str: string) {
  return decodeURIComponent(
    window
      .atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

/**
 * 计算边框扩出的宽度
 * @param xArr
 * @param yArr
 * @returns
 */
export const getFramePoints = (xArr: Array<number>, yArr: Array<number>) => {
  return {
    // 阔出1000的长宽度
    points: [
      xArr[0] - 7000,
      yArr[0] - 7000,
      xArr[0] - 7000,
      yArr[1] + 7000,
      xArr[1] + 7000,
      yArr[1] + 7000,
      xArr[1] + 7000,
      yArr[0] - 7000,
    ],
  };
};

/**
 * 生成随机颜色数组，参数为生成的数组长度
 */
export class RandomColor {
  length: number;
  hslArray: number[][];
  constructor(length: number) {
    this.length = length;
    this.hslArray = this.getHslArray();
  }
  // 获取随机HSL
  randomHsl(): number[] {
    const H = Math.random();
    const S = Math.random();
    const L = Math.random();
    return [H, S, L];
  }

  // 获取HSL数组
  getHslArray(): number[][] {
    let HSL: number[][] = [];
    const hslLength = this.length; // 获取数量
    for (let i = 0; i < hslLength; i++) {
      let ret = this.randomHsl();

      // 颜色相邻颜色差异须大于 0.25
      if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
        i--;
        continue; // 重新获取随机色
      }
      ret[1] = 0.7 + ret[1] * 0.2; // [0.7 - 0.9] 排除过灰颜色
      ret[2] = 0.4 + ret[2] * 0.4; // [0.4 - 0.8] 排除过亮过暗色

      // 数据转化到小数点后两位
      ret = ret.map((item) => {
        return parseFloat(item.toFixed(2));
      });

      HSL.push(ret);
    }
    return HSL;
  }

  /**
   * HSL颜色值转换为RGB
   * H，S，L 设定在 [0, 1] 之间
   * R，G，B 返回在 [0, 255] 之间
   * @param H 色相
   * @param S 饱和度
   * @param L 亮度
   * @returns Array RGB色值
   */
  hslToRgb(H: number, S: number, L: number): number[] {
    let R, G, B;
    if (+S === 0) {
      R = G = B = L; // 饱和度为0 为灰色
    } else {
      const hue2Rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
      const P = 2 * L - Q;
      R = hue2Rgb(P, Q, H + 1 / 3);
      G = hue2Rgb(P, Q, H);
      B = hue2Rgb(P, Q, H - 1 / 3);
    }
    return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
  }
  // 合成rgb
  get rgbArray(): {} {
    if (!this.hslArray.length) return [];
    const rgbArray1 = this.hslArray.map((v) => {
      const [H, S, L] = v;
      return this.hslToRgb(H, S, L);
    });
    return rgbArray1.map((v) => {
      return {
        // color: `rgb(${v.toString()})`,
        // color: `rgb(0,0,255)`,
        color: `rgb(0,101,255)`,
      };
    });
  }
}

/**
 * 返回数组，数组内容为绘制矩形的路径，四个点的坐标，其中起点会在数组起始与数组终点被使用两次
 * @param start 矩形左上起始点
 * @param end 矩形右下结束点
 * @returns
 */
export const countPointsArr = (start: IPosition, end: IPosition) => {
  return [
    start.x,
    start.y,
    end.x,
    start.y,
    end.x,
    end.y,
    start.x,
    end.y,
    start.x,
    start.y,
  ];
};

/**
 * 计算arr1为起点，arr2为终点的两点之间连成线的斜率
 */
export const computedK = (arr1: Array<number>, arr2: Array<number>) => {
  let x1 = arr1[0];
  let y1 = arr1[1];
  let x2 = arr2[0];
  let y2 = arr2[1];
  return (y2 - y1) / (x2 - x1);
};

/**
 * 计算磁吸点的范围，用于构建磁吸点map
 * @param first x坐标
 * @param second y坐标
 * @param range 范围，值越小，吸附能力越弱
 * @returns
 */
export const computedAdsPoints = (
  first: number,
  second: number,
  range: number = 400
) => {
  range = Number(range);
  let x = Math.floor(first / range) * range; // x坐标的范围值
  let y = Math.floor(second / range) * range; // y坐标的范围值
  let strMapKey = `${x}-${y}`;
  let mapValue = [first, second];
  return {
    mapKey: strMapKey,
    mapValue: mapValue,
  };
};

/**
 * 在磁吸点map中删除某些点，arr为数组，指代应当被删除的点位。主要应用于几何图形的删除，该几何图形被删除后，应当将磁吸点map中的几何图形顶点坐标删除，将几何图形的顶点坐标传入即可实现
 * @param arr [{points:[]},{points:[]},{points:[]}...]
 */
export const deleteAdsMapPoint = (
  arr: any,
  pointMap: Map<string, Array<number[]>>
) => {
  arr.forEach((item: any) => {
    let sameIndex: number = -1;
    for (let index in item.points) {
      let i = Number(index);
      // console.log(index);
      if (i % 2 !== 0) {
        let { mapKey, mapValue } = computedAdsPoints(
          item.points[i - 1],
          item.points[i]
        );
        if (pointMap.has(mapKey)) {
          if (pointMap.get(mapKey) && pointMap.get(mapKey)!.length) {
            sameIndex = pointMap.get(mapKey)!.findIndex((it: any) => {
              return it[0] === mapValue[0] && it[1] === mapValue[1];
            });
          }

          if (sameIndex !== -1) {
            pointMap.get(mapKey)!.splice(sameIndex, 1);
          }
        }
      }
    }
  });
};

/**
 * 寻找合适的磁吸点
 * @param x
 * @param y
 */
export const findAdsPoint = (
  x: number,
  y: number,
  pointsMap: Map<string, Array<number[]>>
) => {
  let { mapKey } = computedAdsPoints(x, y);
  let pointsArr = pointsMap.get(mapKey);
  if (pointsArr?.length) {
    let num = Infinity; // 无限大值
    let usePointArr: Array<number> = [];
    for (let item of pointsArr) {
      // let xynum = Math.abs(x - item[0]) + Math.abs(y - item[1]);
      let xynum = Math.abs(x - item[0]) + Math.abs(y - item[1]);
      if (xynum < num) {
        num = xynum;
        usePointArr = item;
      }
    }
    // 返回磁吸点
    return usePointArr;
  }
};

/**
 * 重新计算磁吸点map
 * @param pointsArr
 * @returns
 */
export const initPointsMap = (
  pointsArr: Array<any>,
  pointMap: Map<string, Array<number[]>>
) => {
  pointMap = new Map();
  return new Promise((resolve, reject) => {
    for (let i in pointsArr) {
      let iItem = pointsArr[i];
      for (let j in iItem.points) {
        let key = Number(j);
        if (key % 2 !== 0) {
          let { mapKey, mapValue } = computedAdsPoints(
            iItem.points[key - 1],
            iItem.points[key]
          );
          pointMap.has(mapKey)
            ? pointMap.get(mapKey)!.push(mapValue)
            : pointMap.set(mapKey, [mapValue]);
        }
      }
    }
    resolve(pointMap);
  });
};

/**
 * 计算矩形最大边长
 * @param points 矩形点位数组，要求需要为顺时针或逆时针，方向不重要但需要有顺序
 * @returns 最大边长
 */
export const computedLength = (points: Array<number>) => {
  let newPoints = points.slice(0, 8);

  let fPoint = [newPoints[2], newPoints[3]];

  let flPoint = [newPoints[0], newPoints[1]];

  let frPoint = [newPoints[4], newPoints[5]];

  let length1 = Math.sqrt(
    Math.pow(fPoint[0] - flPoint[0], 2) + Math.pow(fPoint[1] - flPoint[1], 2)
  );
  let length2 = Math.sqrt(
    Math.pow(fPoint[0] - frPoint[0], 2) + Math.pow(fPoint[1] - frPoint[1], 2)
  );

  return Math.max(length1, length2);
};

/**
 * 计算两个点位形成的基于y轴方向,x1y1为顶点的角度
 * @param firstPoints
 * @param secondPoints
 */
export const computedAngel = (
  firstPoints: Array<number>,
  secondPoints: Array<number>
) => {
  let x1 = firstPoints[0];
  let y1 = firstPoints[1];
  let x2 = secondPoints[0];
  let y2 = secondPoints[1];
  let angle = null;
  if ((x1 <= x2 && y1 > y2) || (x1 > x2 && y1 <= y2)) {
    // angle = Math.atan((x2 - x1) / (y1 - y2)) * (180 / Math.PI);
    angle = Math.atan((x2 - x1) / (y1 - y2));
  } else if ((x1 > x2 && y1 > y2) || (x1 <= x2 && y1 <= y2)) {
    // angle = Math.atan((x2 - x1) / (y2 - y1)) * (180 / Math.PI);
    angle = Math.atan((x2 - x1) / (y2 - y1));
  }
  return angle;
};

/**
 * 根据两个点位连成的线以及鼠标位置，确定一条与已知直线正交的线
 * @param firstPoint x1 y1
 * @param secondPoint x2 y2
 * @param pointerPosition 鼠标位置
 * @returns
 */
export const getOrthodoxPoint = (
  firstPoint: Array<number>,
  secondPoint: Array<number>,
  pointerPosition: Array<number>
) => {
  let x1 = firstPoint[0];
  let y1 = firstPoint[1];
  let x2 = secondPoint[0];
  let y2 = secondPoint[1];
  let x3 = null;
  let y3 = null;
  let xPointer = pointerPosition[0];
  let yPointer = pointerPosition[1];
  // 所需角度的补角
  let supplementaryAngle = null;
  // 计算y3所需要的角度
  let computedAngle = null;
  let angle = null;
  // 先获取补角的大小
  if (x1 > x2 && y1 > y2) {
    supplementaryAngle = Math.atan((x1 - x2) / (y1 - y2));
    computedAngle = Math.PI / 2 - supplementaryAngle;
    angle = (computedAngle * 180) / Math.PI;
    if (angle > 45) {
      x3 = xPointer;
      y3 = y2 - (x3 - x2) / Math.tan(computedAngle);
    } else {
      y3 = yPointer;
      x3 = x2 + (y2 - y3) * Math.tan(computedAngle);
    }
  }
  if (x1 < x2 && y1 > y2) {
    supplementaryAngle = Math.atan((y1 - y2) / (x2 - x1));
    computedAngle = Math.PI / 2 - supplementaryAngle;
    angle = (computedAngle * 180) / Math.PI;
    if (angle < 45) {
      x3 = xPointer;
      y3 = (x3 - x2) * Math.tan(computedAngle) + y2;
    } else {
      y3 = yPointer;
      x3 = (y3 - y2) / Math.tan(computedAngle) + x2;
    }
  }
  if (x1 < x2 && y1 < y2) {
    supplementaryAngle = Math.atan((x2 - x1) / (y2 - y1));
    computedAngle = Math.PI / 2 - supplementaryAngle;
    angle = (computedAngle * 180) / Math.PI;
    if (angle > 45) {
      x3 = xPointer;
      y3 = y2 + (x2 - x3) / Math.tan(computedAngle);
    } else {
      y3 = yPointer;
      x3 = x2 - (y3 - y2) * Math.tan(computedAngle);
    }
  }
  if (x1 > x2 && y1 < y2) {
    supplementaryAngle = Math.atan((x1 - x2) / (y2 - y1));
    computedAngle = Math.PI / 2 - supplementaryAngle;
    angle = (computedAngle * 180) / Math.PI;
    if (angle > 45) {
      x3 = xPointer;
      y3 = y2 + (x3 - x2) / Math.tan(computedAngle);
    } else {
      y3 = yPointer;
      x3 = (y3 - y2) * Math.tan(computedAngle) + x2;
    }
  }

  if (y1 === y2) {
    x3 = x2;
    y3 = yPointer;
  }

  if (x1 === x2) {
    y3 = y2;
    x3 = xPointer;
  }
  return [x3, y3];
};

/**
 * 根据两点构成的直线及距离计算在该直线上的基于firstPoint的距离为length的两个点位
 * @param firstPoint
 * @param secondPoint
 * @param length
 * @returns
 */
export const pointsAndLengthTpPolygon = (
  firstPoint: Array<number>,
  secondPoint: Array<number>,
  length: number
) => {
  let returnValue = null;
  length = Number(length);
  let x1 = firstPoint[0];
  let y1 = firstPoint[1];
  let x2 = secondPoint[0];
  let y2 = secondPoint[1];
  let x3 = null; // 沿x1y1 -> x2y2方向上的L长度的点
  let y3 = null;
  let rx3 = null; // x3关于x1的对称点
  let ry3 = null;
  let angle = null;
  let L = length;
  if (length) {
    if (x1 > x2 && y1 <= y2) {
      angle = Math.atan((y2 - y1) / (x1 - x2));
      x3 = x1 - L * Math.cos(angle);
      y3 = y1 + L * Math.sin(angle);
      rx3 = x1 + L * Math.cos(angle);
      ry3 = y1 - L * Math.sin(angle);
    } else if (x1 <= x2 && y1 <= y2) {
      if (x1 === x2) {
        angle = Math.atan(Infinity);
      } else {
        angle = Math.atan((y2 - y1) / (x2 - x1));
      }
      x3 = x1 - L * Math.cos(angle);
      y3 = y1 - L * Math.sin(angle);
      rx3 = x1 + L * Math.cos(angle);
      ry3 = y1 + L * Math.sin(angle);
    } else if (x1 <= x2 && y1 > y2) {
      angle = Math.atan((x2 - x1) / (y1 - y2));
      x3 = x1 - L * Math.sin(angle);
      y3 = y1 + L * Math.cos(angle);
      rx3 = x1 + L * Math.sin(angle);
      ry3 = y1 - L * Math.cos(angle);
    } else if (x1 > x2 && y1 > y2) {
      angle = Math.atan((x1 - x2) / (y1 - y2));
      x3 = x1 - L * Math.sin(angle);
      y3 = y1 - L * Math.cos(angle);
      rx3 = x1 + L * Math.sin(angle);
      ry3 = y1 + L * Math.cos(angle);
    }
  }
  returnValue = {
    lx: x3,
    ly: y3,
    rx: rx3,
    ry: ry3,
  };
  return returnValue;
};

/**
 * 计算几何中心点
 * @param points 构成几何图形的点位坐标
 * @returns
 */
export const computedCenterPoint = (points: Array<number>) => {
  let xCenter = 0;
  let yCenter = 0;
  for (let i in points) {
    let index = Number(i);
    if (index % 2 === 0) {
      // x坐标
      xCenter += points[index];
    } else {
      yCenter += points[index];
    }
  }
  xCenter = xCenter / (points.length / 2);
  yCenter = yCenter / (points.length / 2);
  return [xCenter, yCenter];
};

/**
 * 根据中心点及长度宽度角度计算矩形的点位信息
 * @param centerPoint
 * @param rect
 */
export const centerPointComputedRect = (
  centerPoint: Array<number>,
  rect: {
    length: number;
    width: number;
    angle: number;
    direction: number; // 1:sx<=ex&&sy<=ey  2:sx<=ex&&sy>ey  3:sx>ex&&sy>ey  4:sx>ex&&sy<=ey   sx,sy指中线起始点位的x坐标y坐标，ed,ey指终止点位的x坐标y坐标
  }
) => {
  let cx = centerPoint[0];
  let cy = centerPoint[1];
  let sx: number = 0;
  let sy: number = 0;
  let ex: number = 0;
  let ey: number = 0;
  let ox: number = 0;
  let oy: number = 0;
  let sdx1: number = 0;
  let sdy1: number = 0;
  let sdx2: number = 0;
  let sdy2: number = 0;
  let edx1: number = 0;
  let edy1: number = 0;
  let edx2: number = 0;
  let edy2: number = 0;
  let l = 0.5 * rect.length;
  let w = 0.5 * rect.width;
  let q = angleToRadian(rect.angle);
  switch (rect.direction) {
    case 1:
      sx = cx - l * Math.sin(q);
      sy = cy - l * Math.cos(q);
      ex = cx + l * Math.sin(q);
      ey = cy + l * Math.cos(q);

      ox = w * Math.sin(0.5 * Math.PI - q);
      oy = w * Math.cos(0.5 * Math.PI - q);

      sdx1 = sx - ox;
      sdy1 = sy + oy;
      sdx2 = sx + ox;
      sdy2 = sy - oy;

      edx1 = ex - ox;
      edy1 = ey + oy;
      edx2 = ex + ox;
      edy2 = ey - oy;
      break;
    case 2:
      sx = cx - l * Math.sin(q);
      sy = cy - l * Math.cos(q);
      ex = cx + l * Math.sin(q);
      ey = cy + l * Math.cos(q);

      ox = w * Math.sin(q - 0.5 * Math.PI);
      oy = w * Math.cos(q - 0.5 * Math.PI);

      sdx1 = sx + ox;
      sdy1 = sy + oy;
      sdx2 = sx - ox;
      sdy2 = sy - oy;

      edx1 = ex + ox;
      edy1 = ey + oy;
      edx2 = ex - ox;
      edy2 = ey - oy;
      break;
    case 3:
      sx = cx + l * Math.sin(q);
      sy = cy + l * Math.cos(q);
      ex = cx - l * Math.sin(q);
      ey = cy - l * Math.cos(q);

      ox = w * Math.sin(0.5 * Math.PI - q);
      oy = w * Math.cos(0.5 * Math.PI - q);

      sdx1 = sx - ox;
      sdy1 = sy + oy;
      sdx2 = sx + ox;
      sdy2 = sy - oy;

      edx1 = ex - ox;
      edy1 = ey + oy;
      edx2 = ex + ox;
      edy2 = ey - oy;
      break;
    case 4:
      sx = cx + l * Math.sin(q);
      sy = cy + l * Math.cos(q);
      ex = cx - l * Math.sin(q);
      ey = cy - l * Math.cos(q);

      ox = w * Math.sin(q - 0.5 * Math.PI);
      oy = w * Math.cos(q - 0.5 * Math.PI);

      sdx1 = sx + ox;
      sdy1 = sy + oy;
      sdx2 = sx - ox;
      sdy2 = sy - oy;

      edx1 = ex + ox;
      edy1 = ey + oy;
      edx2 = ex - ox;
      edy2 = ey - oy;
      break;
  }

  return {
    points: [sdx1, sdy1, edx1, edy1, edx2, edy2, sdx2, sdy2],
    centerPoint,
    centerLine: [sx, sy, ex, ey],
    startCenterLine: [sx, sy],
    endCenterLine: [ex, ey],
  };
};

/**
 * 将[0,1,0,2,0,3]格式的数组转换为[[0,1],[0,2],[0,3]]
 * @param arr 点位数组
 * @param isPolygon 是否为封闭几何图形
 * @returns
 */
export const getTurfArr = (arr: Array<number>, isPolygon: boolean = true) => {
  let newArr = cloneDeep(arr);
  if (
    `${newArr[0]},${newArr[1]}` !==
      `${newArr[newArr.length - 2]},${newArr[newArr.length - 1]}` &&
    isPolygon
  ) {
    newArr.push(newArr[0], newArr[1]);
  }
  return newArr.flatMap((item, index) =>
    index % 2 ? [] : [newArr.slice(index, index + 2)]
  );
};

/**
 * 获取不规则几何图形上的中心点，该中心点必在不规则几何图形上
 * @param arr 点位数组 [1,2,3]
 * @returns
 */
export const getPointOnFeature = (arr: Array<number>) => {
  let turfArr = getTurfArr(arr);
  let polygon = turf.polygon([turfArr]);
  let pointOnPolygon = turf.pointOnFeature(polygon);
  return pointOnPolygon.geometry.coordinates;
};

/**
 * 凸包算法，计算出不规则顺序点位排序好后的矩形的点位信息
 * @param arr [1,2,3]
 */
export const pointToPolygon = (arr: Array<number>): any => {
  let newArr: any = getTurfArr(arr, false);
  newArr = newArr.map((item: Position) => {
    return turf.point(item);
  });
  let points: any = turf.featureCollection(newArr);
  let options: any = { concavity: 1 };
  let hull = turf.convex(points, options);
  console.log(hull!.geometry.coordinates.flat(Infinity));
  return hull!.geometry.coordinates.flat(Infinity);
};

/**
 * 判断两条线是否相交，并返回交点
 * @param arr1 [1,2,3]
 * @param arr2 [1,2,3]
 * @returns
 */
export const judgeLineCross = (arr1: Array<number>, arr2: Array<number>) => {
  let newArr1 = getTurfArr(arr1, false);
  let newArr2 = getTurfArr(arr2, false);
  let line1 = turf.lineString(newArr1);
  let line2 = turf.lineString(newArr2);
  return turf.lineIntersect(line1, line2).features.map((item) => {
    return item.geometry.coordinates;
  });
};

/**
 * 返回与points重叠与包含的矩形
 * @param points 参照矩形点位,即单一的待比较矩形
 * @param polygonArray 用来与参照矩形比对的矩形组
 * @returns
 */
export const judgePolygonOverLapOrContains = (
  points: Array<number>,
  polygonArray: Array<{
    points: number[];
  }>
) => {
  let containsArr: Array<{ points: number[] }> = [];
  let overLapArr: Array<{ points: number[] }> = [];
  let newPointsPolygon: any = null;
  if (points.length > 3) {
    newPointsPolygon = turf.polygon([getTurfArr(points)]);
    overLapArr = polygonArray.filter((item: any) => {
      let newPolygon = turf.polygon([getTurfArr(item.points)]);
      if (turf.booleanContains(newPointsPolygon, newPolygon)) {
        containsArr.push(item);
      }
      return turf.booleanOverlap(newPointsPolygon, newPolygon) === true;
    });
  }
  return {
    overLapArr, // 矩形组内与单一待比较矩形部分重叠的矩形数组
    containsArr, // 矩形组内被单一待比较矩形完全包含的矩形数组
  };
};
