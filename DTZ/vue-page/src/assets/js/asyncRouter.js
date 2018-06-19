import { _resolve, _Meta } from "@/assets/js/commonManage";

export const asyncRouterccc = [
  {
    path: "/sysMenu",
    meta: _Meta(true),
    component: _resolve("view/sysMenu/MenuManage"),
    name: "菜单管理"
  },
  {
    path: "/testSoc",
    meta: _Meta(true),
    component: _resolve("view/testSoc"),
    name: "webSocket测试"
  },
  {
    path: "/sysDepart",
    meta: _Meta(true),
    component: _resolve("view/sysDepart/DepartManage"),
    name: "部门管理"
  },
  {
    path: "/sysUser",
    meta: _Meta(true),
    component: _resolve("view/user/UserManage"),
    name: "用户管理"
  },
  {
    path: "/sysRole",
    meta: _Meta(true),
    component: _resolve("view/role/RoleManage"),
    name: "角色管理"
  },
  {
    path: "/dictionary",
    meta: _Meta(true),
    component: _resolve("view/dictionary/DictionaryManage"),
    name: "字典管理"
  },
  {
    path: "/icon",
    meta: _Meta(true),
    component: _resolve("view/iconDemo/index"),
    name: "图标集合"
  },
  {
    path: "/timeLine",
    meta: _Meta(true),
    component: _resolve("view/timeLineDemo/index"),
    name: "时间轴"
  },
  {
    path: "/img",
    meta: _Meta(true),
    component: _resolve("view/imgDemo/index"),
    name: "图片"
  },
  {
    path: "/controlCenter",
    name: "指挥中心",
    meta: _Meta(false),
    component: _resolve("view/controlCenter/index")
  },
  {
    path: "/area",
    name: "区域地图绘制",
    meta: _Meta(true),
    component: _resolve("view/area/areaPath")
  },
  {
    path: "/cell",
    name: "单元网格绘制",
    meta: _Meta(true),
    component: _resolve("view/cell/cellPath")
  },
  {
    path: "/cellTable",
    meta: _Meta(true),
    component: _resolve("view/cell/index"),
    name: "单元网格",
    children: [
      {
        path: "/",
        name: "单元网格表格管理",
        meta: _Meta(true),
        component: _resolve("view/cell/cellTable")
      },
      {
        path: "/addCell",
        name: "新增(编辑)单元网格",
        meta: _Meta(true),
        component: _resolve("view/cell/addCell")
      }
    ]
  },
  {
    path: "/office",
    meta: _Meta(true),
    component: _resolve("view/oaNotify/OaNotify"),
    name: "通知管理"
  },
  {
    path: "/myOffice",
    meta: _Meta(true),
    component: _resolve("view/oaNotify/MyNotify"),
    name: "我的通知"
  },
  {
    path: "/tree",
    component: _resolve("common/BaseTree"),
    name: "组织树"
  },
  {
    path: "/eventgroup",
    component: _resolve("view/cms/eventgroup/EventGroupManage"),
    name: "事件分类管理"
  },
  {
    path: "/partsgroup",
    component: _resolve("view/cms/partsgroup/PartsGroupManage"),
    name: "部件分类管理"
  },
  {
    path: "/accept",
    component: _resolve("view/centerAcceptance/centerAcceptance"),
    name: "监督中心受理"
  },
  {
    path: "/areaevaluate",
    component: _resolve("view/overallmerit/areamerit/index"),
    name: "区域评价"
  },
  {
    path: "/orgevaluate",
    component: _resolve("view/overallmerit/orgmerit/index"),
    name: "部门评价"
  },
  {
    path: "/deploymentList",
    component: _resolve("view/bpmn/deploymentList"),
    name: "流程列表"
  },
  {
    path: "/modelList",
    component: _resolve("view/bpmn/modelList"),
    name: "模型列表"
  },
  {
    path: "/myTask",
    component: _resolve("view/bpmn/myTask"),
    name: "我的任务"
  },
  {
    path: "/myadmin",
    component: _resolve("test"),
    name: "test"
  },
  {
    path: "/approve",
    component: _resolve("view/bpmn/approve"),
    name: "审批"
  }
];

export const defaultRouter = [
  {
    path: "/",
    redirect: "/Layout"
  },
  {
    path: "/Layout",
    component: _resolve("Layout"),
    children: [
      {
        path: "/",
        meta: _Meta(false),
        component: _resolve("view/home/home")
      }
    ]
  }
];
// defaultRouter[1].children = [defaultRouter[1].children[0], ...asyncRouter];
// defaultRouter=[defaultRouter,...asyncRouter];

// let data = defaultRouter.concat([
//   {
//     path: "*",
//     redirect: "/404"
//   }
// ]);
export default defaultRouter
