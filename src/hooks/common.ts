// import { Ref } from "vue";

import { onMounted, Ref } from "vue";

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

  /**
   * 滚动监听，上滑到dom时dom从底部向上滑动
   * @param domArr ref的dom数组
   * @param scrollCssName css动画样式名，默认为slide-in 在global.scss文件中
   */
  let scollFunction = (
    domArr: Array<Ref<HTMLElement>>,
    scrollCssName: string = "slide-in"
  ) => {
    onMounted(() => {
      window.addEventListener("scroll", checkScrollPosition);
    });
    const checkScrollPosition = () => {
      domArr.forEach((dom: Ref<HTMLElement>) => {
        scollDom(dom);
      });
    };
    const scollDom = (dom: Ref<HTMLElement>) => {
      if (dom.value) {
        // 获取目标元素的位置信息
        const targetElementPosition = dom.value.getBoundingClientRect();
        // 计算视窗底部的位置
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const viewportBottom = windowHeight;
        // 判断是否滚动到目标位置
        if (targetElementPosition.top <= viewportBottom) {
          // 添加动画类
          dom.value.classList.add(scrollCssName);
        }
      }
    };
  };

  /**
   * 实现锚点类似功能
   * @param selector id选择器，页面中必须有一个dom的id与selector变量相匹配
   */
  const clickToBottom = (selector: string) => {
    if (document.querySelector(selector)) {
      document.querySelector(selector)!.scrollIntoView({
        behavior: "smooth",
      });
    }
    scollFunction = () => {};
  };
  return {
    httpController,
    scollFunction,
    clickToBottom,
  };
};
