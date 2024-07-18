export interface IThreeOptions {
  PerspectiveCamera: {
    fov: number; // 摄像机视锥体垂直视野角度
    aspect: number; // 摄像机视锥体长宽比 常用 window.innerWidth / window.innerHeight
    near?: number; // 摄像机视锥体近端面
    far?: number; // 摄像机视锥体远端面
  };
}
export interface ISize {
  width: number;
  height: number;
}

export interface IXYZSize {
  x: number | undefined;
  y: number | undefined;
  z: number | undefined;
}
export interface IPosition {
  x: number;
  y: number;
}
