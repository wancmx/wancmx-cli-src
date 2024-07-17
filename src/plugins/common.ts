import { ElMessage } from "element-plus";

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
