// three.js hooks
import { Ref, onMounted } from "vue";
import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";
// import { GUI } from "three/addons/libs/lil-gui.module.min.js"; // 用于显示当前动画的fps
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { IThreeOptions, ISize, IXYZSize } from "@/models/common/common.models";
import { Color, Mesh } from "three";
export default (
  threeDom: Ref<HTMLDivElement | undefined>,
  threeOptions: IThreeOptions
) => {
  const scene = new THREE.Scene(); // 三维场景

  const renderer = new THREE.WebGLRenderer({
    alpha: true, //渲染器透明
    antialias: true, //抗锯齿
    precision: "highp", //着色器开启高精度
    logarithmicDepthBuffer: true, //使用对数深度缓存(如果要在单个场景中处理巨大的比例差异，就有必要使用, 默认是false。 使用了会带来额外的开销, 但是效果会变好)
  }); // 渲染器，相当于画布
  const camera = new THREE.PerspectiveCamera(
    threeOptions.PerspectiveCamera.fov,
    threeOptions.PerspectiveCamera.aspect,
    0.1,
    50000
  );
  onMounted(() => {
    // gui 调节某个参数的尺寸
    // const gui = new GUI();
    // gui.domElement.style.right = "0px";
    // gui.domElement.style.width = "300px";
    // const obj = {
    //   x: 30,
    // };
    // // gui增加交互界面，用来改变obj对应属性
    // gui.add(obj, "x", 0, 100);

    const ambientLight = new THREE.AmbientLight(0x404040, 6); // 创建环境光
    // scene.fog = new THREE.Fog(0xcccccc, 10, 15);
    scene.add(ambientLight); // 将环境光添加到场景

    // const dirLight = new THREE.DirectionalLight(0xffffff); // 创建平行光
    // scene.add(dirLight);

    var spotLight1 = new THREE.SpotLight(0xffffff, 40000000.0);
    // spotLight1.position.set(4000, 4000, 4000);
    spotLight1.position.set(4500, 4500, 4500);
    var spotLight2 = new THREE.SpotLight(0xffffff, 40000000.0);
    spotLight2.position.set(-4500, -4500, -4500);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight1, 10);
    const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2, 10);
    scene.add(spotLight1); //光线加入场景中
    scene.add(spotLight2); //光线加入场景中

    scene.add(spotLightHelper); // 光源辅助件
    scene.add(spotLightHelper2); // 光源辅助件
    webGLAvailable();
    mouseMove();
    windowResize();
    animate();
  });

  /**
   * 兼容性检测
   */
  let webGLAvailable = () => {
    if (WebGL.isWebGLAvailable()) {
      // 此处兼容性检测通过，执行初始化逻辑即可
    } else {
      // 兼容性未通过，报错
      const warning = WebGL.getWebGLErrorMessage();
      threeDom.value!.appendChild(warning);
    }
  };

  /**
   * 初始化renderer
   * @param color
   */
  let initRender = (color: string | number, renderSize: ISize) => {
    renderer.setClearColor(new Color(color));
    renderer.setSize(renderSize.width * 4, renderSize.height * 4);
    renderer.domElement.style.width = renderSize.width + "px";
    renderer.domElement.style.height = renderSize.height + "px";
    threeDom.value!.appendChild(renderer.domElement);
  };

  /**
   * 生成 Box Mesh
   */
  let getMesh = (
    cubeGeometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    meshBasicMaterial: {
      color: number;
      wireframe: boolean;
    },
    position: Array<number> = [0, 0, 0],
    isNeedLine: boolean = true
  ) => {
    // const cubeGeometry = new BoxGeometry(boxSize.x, boxSize.y, boxSize.z);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({
      color: meshBasicMaterial.color,
      emissive: 0x333333,
      metalness: 1.0,
      roughness: 0.6,
      // flatShading: true,
      // wireframe: meshBasicMaterial.wireframe,
    }); // 材质

    const cube = new Mesh(cubeGeometry, cubeMaterial); // 网格模型 将材质与几何形体结合为一个物体

    // 生成对应的线段网格模型
    let edges = new THREE.EdgesGeometry(cubeGeometry);
    let edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
    });
    let line = new THREE.LineSegments(edges, edgesMaterial);
    isNeedLine ? scene.add(cube, line) : scene.add(cube);
    let [x, y, z] = position;
    cube.position.set(x, y, z);
    line.position.set(x, y, z);
    return cube;
  };

  /**
   * threejs原生拖动缩放等引入
   */
  let mouseMove = () => {
    new OrbitControls(camera, renderer.domElement);
  };

  /**
   * 窗口缩放事件
   */
  let windowResize = () => {
    window.onresize = function () {
      // 重置渲染器输出画布canvas尺寸
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
      camera.aspect = window.innerWidth / window.innerHeight;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      camera.updateProjectionMatrix();
    };
  };

  /**
   * 帧渲染模型
   */
  let animate = () => {
    // cube.scale.set(1.1, 1.1, 1.1);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  /**
   * 按比例缩放或扩大mesh
   */
  let changeMesh = (
    mesh: Mesh,
    meshOldValue: IXYZSize,
    meshNewValue: IXYZSize
  ) => {
    if (meshNewValue.x && meshNewValue.y && meshNewValue.z) {
      let xScale = Number(meshNewValue.x) / Number(meshOldValue.x);
      let yScale = Number(meshNewValue.y) / Number(meshOldValue.y);
      let zScale = Number(meshNewValue.z) / Number(meshOldValue.z);
      mesh.scale.set(xScale, yScale, zScale);
    }
  };

  class meshMaterial {
    color: number;
    wireframe: boolean;
    constructor(color: number = 0xc0c0c0, wireframe = false) {
      this.color = color;
      this.wireframe = wireframe;
    }
  }

  return {
    scene,
    renderer,
    camera,
    initRender,
    getMesh,
    changeMesh,
    meshMaterial,
  };
};
