import Vue from "vue";
import Router from "vue-router";
import Layout from "@/components/Layout";
import { _resolve, _Meta } from "@/assets/js/commonManage";

Vue.use(Router);
const routes = [
  {
    path: "/Login",
    name: "登录",
    component: _resolve("Login")
  },
  {
    path:'/',
    component:_resolve('Layout'),
    children: [
      {
        path: "/",
        meta: _Meta(false),
        component: _resolve("view/home/home")
      }
    ]
  },
  {
    path: "/404",
    component: _resolve("404"),
    name: ""
  }
];

const router = new Router({
  mode: "history",
  routes: routes
});

// router.beforeEach((to, from, next) => {
//   console.log(2,to);
//   // 判断该路由是否需要登录权限
//   if (to.matched[0].meta.requireAuth) {
//     const strCookie = document.cookie;
//     //将多cookie切割为多个名/值对
//     const arrCookie = strCookie.split("; ");

//     let islogin;
//     //遍历cookie数组，处理每个cookie对
//     for (var i = 0; i < arrCookie.length; i++) {
//       var arr = arrCookie[i].split("=");
//       //找到名称为userId的cookie，并返回它的值
//       if ("islogin" == arr[0]) {
//         islogin = arr[1];
//         break;
//       }
//     }

//     if (islogin != null) {
//       let data = JSON.parse(localStorage.getItem("gMenuList"));
//       console.log(data, to);
//       let proms = false;
//       if (to.path.slice(1) == "Layout") {
//         proms = true;
//       } else {
//         data.forEach(item => {
//           if (item.menu_url.includes(to.path.slice(1))) {
//             //判断是否 拥有权限
//             proms = true;
//           }
//         });
//         console.log(to.path.slice(1));
//         if (to.path.slice(1) == "addCell") {
//           data.forEach(item => {
//             if (item.menu_url.includes("cellTable")) {
//               //判断是否 拥有权限
//               proms = true;
//             }
//           });
//         }
//       }

//       if (proms) {
//         //判断用户是否拥有权限进入此路由
//         next();
//       } else {
//         //没有权限则跳转到404
//         next({
//           path: "/404",
//           query: {} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//         });
//       }
//       next();
//     } else {
//       next({
//         path: "/login",
//         query: {} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       });
//     }
//   } else {
//     next();
//   }
// });
export default router;
