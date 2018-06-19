/**
 * getters
 * 对于state中数据的过滤，属于一种加强属性
 * 是action和mutations的一个简化
 * 一些简单或通用的操作可以抽取到getters上来，方便在应用中引用。
 * * ****************************************************/

//获取数字
export const getCount = state => {
  return state.gcount;
};

//获取字典
export const getDicList = state => {
  return state.gDictionaryList;
};

/**
 * 全屏
 */
export const getFullScreen = state => {
  return state.gFullScreen;
};


//获取表单数据
export const getFormDataList = state => {
  return state.gFormDataList;
};

/**
 * 获取侧边菜单状态
 * @param state
 * @returns {string}
 */
export const getTheme = state => {
  return state.gTheme;
};

/**
 * 获取导航二左侧菜单List
 * @param state
 * @returns {Array}
 */
export const getnavList = state => {
  return state.gSiderNav;
};

/**
 * 获取导航类型
 * @param state
 * @returns {string}
 */
export const getNavType = state => {
  return state.gNavType;
};

/**
 * 获取菜单是否显示
 * @param state
 * @returns {boolean}
 */
export const getNavShow = state => {
  return state.gNavShow;
};

/**
 * 获取侧边栏菜单
 *
 * @param {any} state
 * @returns
 */
export const getVerMenuMap = state => {
  return state.gVerMenuMap;
};

export const getisCollapse = state => {
  return state.gisCollapse;
};

export const getMapLayers = state => {
  return state.gMapLayers;
};
export const getPartsdata = state => {
  return state.gpartsData;
};

export const getEventList = state => {
  return state.gEventList;
};
/**
 * socket消息
 * @param state
 * @returns {null}
 */
export const getSocketMsgByUser = state => {
  return state.gSocketMsgByUser;
};
export const getSocketMsgBox = state => {
  return state.gSocketMsgBox;
};
export const getSocketControlCenter = state => {
  return state.gSocketControlCenter;
};

export const getSocketAcceptScreen = state => {
  return state.gSocketAcceptScreen;
};



/**
 * socket呼叫中心弹屏消息
 * @param state
 * @returns {null}
 */
export const getCallScreen = state => {
  return state.gSocketCallScreen;
};
/**
 * socket呼叫中心分机号状态
 * @param state
 * @returns {null}
 */
export const getCallType = state => {
  return state.gSocketCallType;
};
/**
 * @description 侧边菜单默认选择项
 *
 * @param {any} state
 * @returns
 */
export const getVerDefaultIndex = state => {
  return state.gVerDefaultIndex;
};

export const getvueLogin = state => state.gvueLogin;
export const getBtnPermission = state => state.gBtnPermission;
