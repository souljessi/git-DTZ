/**
 * action,动作。
 * 对于store中数据的修改操作动作在action中提交。
 * 其实action和mutation类似，但是action提交是mutation，并不直接修改数据，而是触发mutation修改数据。
 * PS:(action能执行一步操作，如定时器)
 ****************************************************************************/
/**
 * 加数据
 * @param {*} commit 默认
 * @param {*} data
 */
export const addNum = ({
  commit
}, data) => {
  commit("ADDNUM", data);
};
/**
 * 减数据
 * @param {*} commit 默认
 * @param {*} data
 */
export const reduceNum = ({
  commit
}, data) => {
  commit("REDUCENUM", data);
};

/**
 * 添加字典
 * @param {*} commit 默认
 * @param {*} data 字典数据
 */
export const addlist = ({
  commit
}, data) => {
  commit("ADDLIST", data);
};

/**
 * 添加表单数据
 * @param {*} commit
 * @param {*} data  表单数据
 */
export const addFormList = ({
  commit
}, data) => {
  commit("ADDFORMLIST", data);
};

export const setFullScreen = ({
  commit
}, data) => {
  commit("SETFULLSCREEN", data);
};


/**
 *字典过滤器
 * @param name
 * @param echartsInstance
 * @param echarts
 */
export const getDicData = ({
  commit
}, data) => {
  // commit('GETDICDATA',data)
  return data;
};

/**
 * 侧边栏主题修改
 * @param commit
 * @param data
 */
export const changeTheme = ({
  commit
}, data) => {
  commit("CHANGETHEME", data);
};

/**
 * 菜单导航修改
 * @param commit
 * @param data
 */

export const changeNav = ({
  commit
}, data) => {
  commit("CHANGENAV", data);
};

/**
 *
 * 设置导航类型
 * @param commit
 * @param data
 */
export const setNavTye = ({
  commit
}, data) => {
  commit("SETNAVTYPE", data);
};

/**
 * 设置菜单是否显示
 * @param commit
 * @param data
 */
export const setNavShow = ({
  commit
}, data) => {
  commit("SETNAVSHOW", data);
};

/**
 * 设置侧边栏
 *
 * @param {any} {
 *   commit
 * }
 * @param {any} data
 */
export const setVerMenuMap = ({
  commit
}, data) => {
  commit("SETVERMENUMAP", data);
};

export const setIsCollapse = ({
  commit
}, data) => {
  commit("SETISCOLLAPSE", data);
};

export const setMapLayers = ({
  commit
}, data) => {
  commit("SETMAPLAYERS", data);
};
export const setPartsdata = ({
  commit
}, data) => {
  commit("SETPARTSDATA", data);
};

export const setVerDefaultIndex = ({
  commit
}, data) => {
  commit("SETVERDEFAULTINDEX", data);
};

//重置vuex

export const restVuexStore = ({
  commit
}, data) => {
  commit("RESTVUEXSTORE", data);
};

export const setVueLogin = ({
  commit
}, data) => {
  commit("SETVUELOGIN", data);
};

export function socket_abc({
  commit
}, value) {
  console.log("Action接收SOCKET:", value);
  commit("SETNEWABC", value);
}

export function socket_connect(context, value) {
  console.log("连接成功");
}

export const setBtnPermission = ({
  commit
}, data) => {
  commit("SETBTNPERMISSION", data);
};

export const setEventList = ({
  commit
}, data) => {
  commit("SETEVENTLIST", data)
}
