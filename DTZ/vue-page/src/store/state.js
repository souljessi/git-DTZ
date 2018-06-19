export const state = {
  gcount: 0,
  gisCollapse: false, //侧边菜单折叠状态
  gTheme: "#0e0e10", //侧边栏主题样式     默认为黑色
  gSiderNav: [], //左侧导航数据
  gNavType: "default", //获取设置菜单类型
  gNavShow: false, //设置是否显示
  gVerMenuMap: [], //侧边栏菜单
  gMapLayers: {}, //图层管理
  gpartsData: [], //部件缓存
  gSocketDefaultMsg: null, ///socket默认消息体
  gSocketMsgBox: "", //消息盒子
  gSocketAcceptScreen: null, //受理中心弹屏推送消息
  gSocketCallScreen: null, //呼叫中心弹屏推送
  gSocketCallType: {}, //呼叫中心分机号状态  默认空闲
  gSocketOaNotice: null, //通知通告推送消息
  gSocketOaVerify: null, //协同办公审批推送
  gSocketOaWaitHandle: null, //协同办公待办推送
  gSocketControlCenter: null, //监督指挥中心推送
  gVerDefaultIndex: "", //默认消息体
  gvueLogin: false, //登录状态判断
  gSocketAbc: null,
  gNewAbc: null,
  gEventList: [], //受理中心事件列表
  gBtnPermission: {}, //当前路由按钮权限
  gFullScreen: false, //全屏
};
