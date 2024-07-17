// import { Ref } from "vue";

export default () => {
  /**
   * 生成controller，控制http请求，该controller可以用于控制何时中断http请求，该方法需要与httpRequest中的controller入参配合使用
   */
  const httpController = () => {
    // if (refValue.value) {
    //   refValue.value.abort();
    //   refValue.value = null;
    // }
    // refValue.value = new AbortController();
    return new AbortController();
  };
  return {
    httpController,
  };
};
