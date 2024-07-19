import { ref, toRefs } from "vue";

/**
 * 在缩放时保证线段为矢量线段，避免使用vuex计算线宽，以提高性能
 */
let strokeWidth = ref<number>(20);
let defaultStrokeWidth = ref<number>(20);
export default (stage?: any): any => {
  const initStrokeWidth = () => {
    // 换算比例  scale===0.01时 strokeWidth=50
    let scale = null;
    if (stage) {
      if (stage.value) {
        scale = stage.value.getNode().scaleX();
      } else {
        scale = stage.getNode().scaleX();
      }
      strokeWidth.value = (0.01 / scale) * 50;
      defaultStrokeWidth.value = (0.01 / scale) * 50;
    } else {
      strokeWidth.value = defaultStrokeWidth.value;
    }
  };

  return {
    strokeWidth,
    initStrokeWidth,
    defaultStrokeWidth,
  };
};
