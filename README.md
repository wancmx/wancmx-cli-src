# wancmx-cli

### 基于 vue3 构建的模板项目，项目内包含以下部分

1. 基于 axios 的 http 请求封装，包括请求与响应拦截器，controller 中断等
2. 基于 vue-router 的路由封装
3. 内置 element-plus 组件库
4. 内置 pixijs，封装一系列基于 pixijs 的图形处理方法，包括角度弧度的计算，图形的创建、画布的拖动、获取鼠标位置等方法
5. 内置 pdfmake，支持自定义绘制 pdf 及 pdf 的在线显示和下载，并修复了默认 pdfmake 无法解析中文字符的问题
6. 内置 pdf 数据流转换方法，调用 downloadFile 方法可实现下载后端传输的数据流
7. 内置一系列关于线段、几何图形的计算方法
8. 内置 three 的基本封装方法
   ...

### 使用方法

1. 通过 wancmx-cli 下载该项目

   - npm install wancmx-cli -g
   - wancmx-cli init yourProjectName
   - 进入拉取下来的 project
   - npm install
   - npx patch-package
   - npm run dev

2. 通过 git 下载或拉取该项目
   - npm install
   - npx patch-package
   - npm run dev
