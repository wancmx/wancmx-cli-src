import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import * as Elicons from "@element-plus/icons-vue";
//引入Elmessage和Elloading的css样式文件
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/src/message-box.scss";
import "./styles/global.scss";
const app = createApp(App);
const pinia = createPinia();
Object.keys(Elicons).forEach((key) => {
  app.component(key, Elicons[key as keyof typeof Elicons]);
});
app.use(router).use(pinia).mount("#app");
