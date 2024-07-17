import { piniaPageInfo } from "@/store/pageInfo";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const notFoundPage = {
  path: "/:catchAll(.*)",
  name: "404",
  component: () => import("@/views/404/index.vue"),
};

const routes: Array<RouteRecordRaw> = [notFoundPage];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
});

/**
 * 跳转成功后
 */
// router.afterEach((to: any) => {
// });

/**
 * 跳转前，路由拦截，检验是否有token
 */
router.beforeEach((to: any, from: any, next: Function) => {
  const pageInfo = piniaPageInfo();
  // 白名单
  const whiteList: Array<string> = ["/login", "/register", "/forgotPassword"];
  // 判断，当前往登录页、注册页、忘记密码页时缓存内可以没有token
  if (
    whiteList.some((str: string) => {
      return to.path.includes(str);
    })
  ) {
    next();
  } else {
    let token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      if (!sessionStorage.getItem("token")) {
        sessionStorage.setItem(
          "token",
          localStorage.getItem("token") as string
        );
      }
      if (!sessionStorage.getItem("userInfo")) {
        sessionStorage.setItem(
          "userInfo",
          localStorage.getItem("userInfo") as string
        );
      }
      next();
    } else {
      next("/login");
    }
  }
  pageInfo.changePathRouter(to.path);
});

export default router;
