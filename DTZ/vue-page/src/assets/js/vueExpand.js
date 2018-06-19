/**
 * Vue扩展类，
 * 所有的原型链扩展都写在该文件。
 */
import axios from "axios";
import router from "../../router";
import * as validateRule from "./validateRule.js";
import * as commonManage from "./commonManage.js";
import webconfig from "@/webconfig.js";
import {
  Message,
  Notification
} from "element-ui";
export const vueExpand = Vue => {
  Vue.prototype.$http = axios;
  Vue.prototype.$validateRule = validateRule.rules; //表单验证规则表
  Vue.prototype.$getList = commonManage.getList;
  Vue.prototype.$submitForm = commonManage.submitForm;
  Vue.prototype.$deleteOne = commonManage.deleteOne;
  Vue.prototype.$deleteBatch = commonManage.deletebatch;
  Vue.prototype.$updateForm = commonManage.updateForm;
  Vue.prototype.$setStore = commonManage.setStore; //获取localStorage
  Vue.prototype.$getStore = commonManage.getStore; //获取localStorage
  Vue.prototype.$removeStore = commonManage.removeStore; //删除localStorage
  Vue.prototype.$getUserData = commonManage.getUserData; //获取localStorage
  Vue.prototype.$webconfig = webconfig;
  Vue.prototype.$log = (arg1 = 'log', ...logs) => {
    if (logs.length === 0) {
      console.log(arg1)
    } else {
      console.group(arg1)
      logs.forEach(e => {
        console.log(e)
      })
      console.groupEnd()
    }
  }

  /**
   * axios请求拦截
   * 可以配置axios请求
   */

  axios.interceptors.request.use(
    function (config) {
      // 处理请求之前的配置、
      if (!config.isMock) {
        const oldUrl = config.url;
        if (!webconfig.isProduct) {
          config.url = "api" + config.url;
        }
        // config.url = 'api' + config.url //用于真实环境部署，更改代理问题，生产环境下注释此行
        // let dict = config.url.includes('initdictionary');
        let login = config.url.includes("isuserlogin");
        // config.headers.access_token = window.localStorage.getItem('TOKEN');
        if (login) {
          delete config.headers.access_token;
        }
        // console.log(config);
        if (config.isInternet) {
          config.url = oldUrl;
          config.headers.post["Content-Type"] =
            "application/x-www-form-urlencoded";

          delete config.isInternet;
          // delete config.headers.access_token
        }
        // if (config.isOut) {
        //   Notification({
        //     title: "接口测试",
        //     duration: 0,
        //     dangerouslyUseHTMLString: true,
        //     customClass: "testNotif",
        //     message: `<p><strong>URL：</strong>${config.url}</p>
        //     <p><strong>参数：</strong>${JSON.stringify(config.data)}</p>`
        //   });
        // }
      }
      return config;
    },
    function (error) {
      // 请求失败的处理
      return Promise.reject(error);
    }
  );

  // 响应拦截
  axios.interceptors.response.use(
    function (response) {
      // console.log(response);

      return response;
    },
    function (error) {
      console.log("error:", error.response);
      let response = error.response;
      switch (response && response.status) {
        case 401:
          TimeOut(`登录超时，请重新登录`);
          break;
        case 403:
          TimeOut(`未授权，请重新登录`);
          break;
        case 404:
          Message({
            showClose: true,
            message: "请求地址错误，请确认是否正确",
            type: "error"
          });
          break;
        case 500:
          Message({
            showClose: true,
            message: "服务器遇到错误，无法完成请求",
            type: "error"
          });
          break;
        case 501:
          Message({
            showClose: true,
            message: "服务器不具备完成请求的功能",
            type: "error"
          });
          break;
        case 502:
          Message({
            showClose: true,
            message: "网络连接错误，请重试",
            type: "error"
          });
          break;
        case 503:
          Message({
            showClose: true,
            message: "服务器目前无法使用（由于超载或停机维护）",
            type: "error"
          });
          break;
        case 504:
          Message({
            showClose: true,
            message: "请求超时，请重试",
            type: "error"
          });
          break;
        default:
          Message({
            showClose: true,
            message: "访问失败，请重试",
            type: "error"
          });
          break;
      }
      // 处理响应失败
      return Promise.reject(error);
    }
  );

  // 下载文件
  const downloadUrl = url => {
    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    iframe.onload = function () {
      document.body.removeChild(iframe);
    };
    document.body.appendChild(iframe);
  };

  const TimeOut = text => {
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = "islogin=true; expires=" + date.toGMTString();
    //                    localStorage.removeItem('ms_username')
    window.localStorage.clear();
    router.push("Login");
    Message({
      showClose: true,
      message: text,
      type: "warning"
    });
  };
};

export const resPonse = obj => {
  return obj;
};
