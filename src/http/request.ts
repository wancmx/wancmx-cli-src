import axios from "axios";
import router from "@/router";
import { alertMessage } from "@/plugins/common";

export function request(config: any) {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_ENV_API,
    timeout: 1000000, // 在某些特殊情况下，可能要设置较长的timeout来保证接口能够顺利调用完成
  });
  // 请求拦截器
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = token;
        return config;
      } else {
        router.push("/login");
        alertMessage("请登录后使用该部分内容", "error");
      }
    },
    (error: any) => {
      router.push("/login");
      alertMessage(error.message, "error");
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  axiosInstance.interceptors.response.use(
    (response: any) => {
      return response.data;
    },
    (error: any) => {
      switch (error?.status || error?.response?.status) {
        case 400:
          // alertMessage(error.result || error.response.data.result, "error");
          break;
        case 401:
          // alertMessage(error.result || error.response.data.result, "error");
          router.push({ path: "/login" });
          break;
        case 403:
          // alertMessage(error.result || error.response.data.result, "error");
          router.push({ path: "/login" });
          localStorage.removeItem("token");
          break;
        case 404:
          // alertMessage(error.result || error.response.data.result, "error");
          // router.push({ path: "/" });
          break;
        case 500:
          alertMessage(error?.result || error?.response?.data?.result, "error");

          break;
        default:
          throw new Error(error);
        // return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  // 发送真正的网络请求
  return axiosInstance(config);
}
