// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App";
import router from "./router";

// import iView from 'iview';
// import 'iview/dist/styles/iview.css'; // 使用 CSS
import store from "./store/index";
import VueSocketIo from "vue-socket.io";
import socketIo from "socket.io-client";
import webConfig from "./webconfig.js"; //前端基础配置
import * as vueExpand from "assets/js/vueExpand.js"; //vue扩展类
import "./directive.js"; //挂载自定义指令
import VueLazyload from "vue-lazyload";
import "./permission"; // 权限

import "./icons"; // icon
import "./echarts"; //echarts图表
import "./theme";
Vue.config.productionTip = false;
vueExpand.vueExpand(Vue);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require("@/assets/images/error.jpg"),
  loading: require("@/assets/images/loading.gif"),
  attempt: 1
});

// Vue.use(iView);

Vue.use(ElementUI, {
  size: "mini"
});
Vue.use(VueSocketIo, "http://" + webConfig.webSocketIp, store);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {
    App
  }
});
