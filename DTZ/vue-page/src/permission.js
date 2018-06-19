import router from "./router";
import store from "./store";
import { asyncRouter } from "@/assets/js/commonManage";

const whiteList = ["/Login"]; //免登录白名单

/**
 * 是否登录
 * @returns {Boolea}
 */
const getIsLogin = () => {
  const strCookie = document.cookie;
  //将多cookie切割为多个名/值对
  const arrCookie = strCookie.split("; ");

  let islogin;
  //遍历cookie数组，处理每个cookie对
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split("=");
    //找到名称为userId的cookie，并返回它的值
    if ("islogin" == arr[0]) {
      islogin = arr[1];
      break;
    }
  }
  let type = islogin ? true : false;
  return type;
};

const setRouter = function(callback) {
  let menuList = JSON.parse(localStorage.getItem("gMenuList"));
  // console.log("asyncrouter", asyncRouter(menuList));
  router.addRoutes(asyncRouter(menuList));
  // console.log(1111);
  typeof callback === "function" && callback();
};
router.beforeEach((to, from, next) => {
  // console.log("是否登录", getIsLogin());
  // console.log(to);
  //判断是否登录
  if (getIsLogin()) {
    if (to.path === "/Login") {
      next({ path: "/" }); //若在已经登录情况下跳转登录页面，则重定向到首页
    } else {
      // console.log(to);
      let menList = JSON.parse(localStorage.getItem("gMenuList"));
      if (to.meta.data) {
        let listr = menList.filter(item => {
          return item.parent_id == to.meta.data.id && item.is_button == 1;
        });
        // let permission = {};
        let permission = {
          create: true,
          delete: true,
          read: true,
          update: true
        };

        for (let item of listr) {
          permission[item.permission] = true;
        }
        store.dispatch("setBtnPermission", permission); //修改vuex中是否等登录标识
      }

      if (store.getters.getvueLogin) {
        //通过vuex中是否登录标识来识别是否进行了刷新操作，
        //未刷新
        console.log("未刷新");
        next();
      } else {
        //刷新 ，重新注入当前用户路由信息
        console.log("刷新");
        let menuList = JSON.parse(localStorage.getItem("gMenuList"));
        router.addRoutes(asyncRouter(menuList)); //动态注入当前用户路由
        store.dispatch("setVueLogin", true); //修改vuex中是否等登录标识
        console.log(router);
        console.log(to)
        next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,replace: true so the navigation will not leave a history record
      }
    }
  } else {
    //未登录状态
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next("/Login"); // 否则全部重定向到登录页
    }
  }
});
