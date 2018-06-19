/**
 * Mutations
 * 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
 * mutation中写有修改数据的逻辑。
 * PS:(mutation里只能执行同步操作)
 */

/**
 * 加数据
 * @param {Object} state
 * @param {Object} data
 */
export const ADDNUM = (state, data) => {
  return state.getCount++;
};

/**
 * 加数据
 * @param {Object} state
 * @param {Object} data
 */
export const REDUCENUM = (state, data) => {
  return state.getCount--;
};

export const SETFULLSCREEN = (state, data) => {
  console.log(2222, data);
  return state.gFullScreen = data;
};

/**
 * 全局添加字典
 * @param {Object} state
 * @param {Object} data  字典
 */
export const ADDLIST = (state, data) => {
  return (state.gDictionaryList = data);
};

/**
 * 全局添加表单数据
 * @param {*} state
 * @param {*} data 表单数据
 */
export const ADDFORMLIST = (state, data) => {
  return (state.gFormDataList = data);
};

/**
 * 全局修侧边栏样式
 * @param state  state表
 * @param data   数据源
 * @returns {*}
 * @constructor
 */
export const CHANGETHEME = (state, data) => {
  return (state.gTheme = data);
};

/**
 * 设置做左边导航List
 * @param state
 * @param data
 * @returns {Array}
 * @constructor
 */
export const CHANGENAV = (state, data) => {
  const list = JSON.parse(window.localStorage.getItem("gMenuList")).public;
  let resData = [];
  list.forEach((item, index) => {
    if (item.menu_url == data) {
      resData = item.children;
    }
  });
  console.log(resData);
  return (state.gSiderNav = resData);
};

/**
 * 设置导航类型
 * @param state
 * @param data
 * @returns {*}
 * @constructor
 */
export const SETNAVTYPE = (state, data) => {
  return (state.gNavType = data);
};

/**
 * 设置菜单是否显示
 * @param state
 * @param data
 * @returns {*}
 * @constructor
 */
export const SETNAVSHOW = (state, data) => {
  return (state.gNavShow = data);
};
/**
 * 设置侧边栏菜单
 *
 * @param {any} state
 * @param {any} data
 * @returns
 */
export const SETVERMENUMAP = (state, data) => {
  return (state.gVerMenuMap = data);
};
export const SETISCOLLAPSE = (state, data) => {
  return (state.gisCollapse = state.gisCollapse ? false : true);
};

export const SETMAPLAYERS = (state, data) => {
  if (!state.gMapLayers) {
    state.gMapLayers = {};
  }
  state.gMapLayers = data;
  // return state.gMapLayers
};
export const SETPARTSDATA = (state, data) => {
  state.gpartsData = data;
  // return state.gMapLayers
};

export const SOCKET_CONNECT = (state, data) => {
  console.log("socketMutations");
};

//默认消息
export const SOCKET_DEFAULT_MSG = (state, data) => {
  return (state.gSocketDefaultMsg = data);
};
//socket消息盒子
export const SOCKET_MSG_BOX = (state, data) => {
  return (state.gSocketMsgBox = data);
};
//socket受理中心推送
export const SOCKET_ACCEPT_SCREEN = (state, data) => {
  return (state.gSocketAcceptScreen = data);
};
//socket呼叫中心弹屏
export const SOCKET_CALL_SCREEN = (state, data) => {
  return (state.gSocketCallScreen = data);
};
//socket呼叫中心分机号实时状态
export const SOCKET_CALL_TYPE = (state, data) => {
  return (state.gSocketCallType = data);
};
//socket协同办公通知通告推送
export const SOCKET_OA_NOTICE = (state, data) => {
  return (state.gSocketOaNotice = data);
};
//socket协同办公审批推送
export const SOCKET_OA_VERIFY = (state, data) => {
  return (state.gSocketOaVerify = data);
};
//socket待办推送
export const SOCKET_OA_WAIT_HANDLE = (state, data) => {
  return (state.gSocketOaWaitHandle = data);
};
export const SETVERDEFAULTINDEX = (state, data) => {
  return (state.gVerDefaultIndex = data);
};
export const SOCKET_CONTROL_CENTER = (state, data) => {
  return (state.gSocketControlCenter = data);
};

export const SETEVENTLIST = (state, data) => {
  return (state.gEventList = data)

};

// export const SOCKET_CONNECT=(state)=> {
//   state.connect = true;
// }

//重置vuex
export const RESTVUEXSTORE = (state, data) => {
  state.gcount = 0;
  state.gisCollapse = false; //侧边菜单折叠状态
  state.gTheme = "dark"; //侧边栏主题样式     默认为黑色
  state.gSiderNav = []; //左侧导航数据
  state.gNavType = "default"; //获取设置菜单类型
  state.gNavShow = false; //设置是否显示
  state.gVerMenuMap = []; //侧边栏菜单
  state.gMapLayers = {}; //图层管理
  state.gpartsData = []; //部件缓存
  state.gSocketSendAll = null; //向所有客户端广播的消息
  state.gSocketMsgByUser = null; ///指定消息发送给对应用户id
  state.gSocketMsgByModule = null; ///指定模块发送消息
  state.gVerDefaultIndex = ""; //侧边菜单选中项
  state.gvueLogin = false;
  return (state.gcount = 0);
};

export const SETVUELOGIN = (state, data) => {
  return (state.gvueLogin = data);
};
export const SOCKET_ABC = (state, data) => {
  console.log("mutations接收SOCKET:", data);
  state.gSocketAbc = data;
};

export const SETNEWABC = (state, data) => {
  return (state.gNewAbc = data);
};

export const SETBTNPERMISSION = (state, data) => {
  return (state.gBtnPermission = data);
};
