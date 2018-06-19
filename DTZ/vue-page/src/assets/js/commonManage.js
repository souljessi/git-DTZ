/**
 * 获取列表
 * @param url 路由地址
 * @param data 数据{Object}
 * @param callback 回调
 */
export function getList(url, data, callback) {
  var _self = this;
  _self.$http
    .post(url, data)
    .then(function (res) {
      callback(res);
    })
    .catch(function (error) {
      console.log(error);
      callback({
        status: false
      });
    });
}
/**
 * 提交表单数据
 */
export function submitForm(url, data, callback) {
  var _self = this;
  _self.$http
    .post(url, data)
    .then(res => {
      _self.dialogInfo = false;
      _self.$message({
        message: "保存成功",
        type: "success"
      });
      callback(res);
    })
    .catch(err => {
      console.log(err);
    });
}
export function updateForm(url, data, callback) {
  var _self = this;
  _self.$http
    .post(url, data)
    .then(res => {
      _self.dialogInfo = false;
      _self.$message({
        message: "编辑成功",
        type: "success"
      });
      callback(res);
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * 删除
 * @param url
 * @param id
 * @param callback
 */
export function deleteOne(url, id, callback) {
  var _self = this;
  _self
    .$confirm("是否确定删除该条记录?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      _self.$http
        .post(url, id)
        .then(ret => {
          callback(ret);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}
/**
 * 批量删除
 * @param url
 * @param ids 数组,id集
 * @param callback
 */
export function deletebatch(url, ids, callback) {
  var _self = this;
  if (_self.multipleSelection.length == 0) {
    _self.$message("请勾选删除项");
    return;
  }
  _self
    .$confirm("是否确定删除所选项?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      _self.$http
        .post(url, ids)
        .then(ret => {
          callback(ret);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  try {
    window.localStorage.setItem(name, content);
  } catch (oException) {
    if (oException.name == "QuotaExceededError") {
      console.log("超出本地存储限额！");
      //如果历史信息不重要了，可清空后再设置
      localStorage.clear();
      window.localStorage.setItem(name, content);
    }
  }
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

export const getUserData = item => {
  return JSON.parse(window.localStorage.getItem("userData"))[item];
};

/**
 * 设置cookie
 *
 * @param {String} cookieName    cookie名称
 * @param {String} value         cookie值
 * @param {Number} expiredays    expiredays 过期时间 （天）
 */
export const setCookie = (cookieName, value, expiredays) => {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    cookieName +
    "=" +
    escape(value) +
    (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
};
/**
 * 获取cookie
 *
 * @param {String} cookieName  cookie名称
 */
export const getCookie = cookieName => {
  let arr,
    reg = new RegExp("(^| )" + cookieName + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return arr[2];
  else return null;
};

/**
 * 删除cookie
 *
 * @param {any} cookieName cookie名称
 */
export const delCookie = cookieName => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(cookieName);
  if (cval != null)
    document.cookie = cookieName + "=" + cval + ";expires=" + exp.toGMTString();
};

/**
 * 清除所有cookie
 *
 */
export function delAllCookie() {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cookies = document.cookie.split(";");
  if (cookies.length > 0) {
    for (const item of cookies) {
      let eqPos = item.indexOf("=");
      let name = eqPos > -1 ? item.substr(0, eqPos) : item;
      document.cookie = name + "=0;expires=" + exp.toUTCString();
    }
  }
  // console.log('object'); let reg = new RegExp('/[^ =;]+(?=\=)/g') var keys =
  // document.cookie.match(reg); console.log(document.cookie); if (keys) {   for
  // (let i = keys.length; i--;)     document.cookie = keys[i] + '=0;expires=' +
  // new Date(0).toUTCString() }
}

/**
 * 修改Dom Class类型
 * @param element   Dom 节点
 * @param className Class名称
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  // let classString = element.className; const nameIndex =
  // classString.indexOf(className); console.log(nameIndex)
  //
  // if (nameIndex === -1) {   classString += '' + className; } else { classString
  // = classString.substr(0, nameIndex) + classString.substr(nameIndex +
  // className.length); }
  element.className = className;
}

/**
 * 格式转树状结构
 * @param   {Array}      原数据
 * @param   {String}    id的字符串
 * @param   {String}    父id的字符串
 * @param   {String}    children的字符串
 * @return  {Array}     数组
 */
export function transData(a, idStr, pidStr, chindrenStr) {
  var r = [],
    hash = {},
    id = idStr,
    pid = pidStr,
    children = chindrenStr,
    i = 0,
    j = 0,
    len = a.length;
  for (; i < len; i++) {
    hash[a[i][id]] = a[i];
  }
  for (; j < len; j++) {
    var aVal = a[j],
      hashVP = hash[aVal[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(aVal);
    } else {
      r.push(aVal);
    }
  }
  return r;
}

/**
 *
 * 创建树形数据
 * @export
 * @param {Object} data    树
 * @param {String} id     数据id标识
 * @param {String} parentId   数据父id标识
 * @returns
 */
export function toTree(data, id, parentId) {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.children;
  });
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  var map = {};
  data.forEach(function (item) {
    map[item[id]] = item;
  });
  // console.log(map);
  var val = [];
  data.forEach(function (item) {
    // 以当前遍历项，的pid,去map对象中找到索引的id
    var parent = map[item[parentId]];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}

/**
 * 获取字典数据信息
 *
 * @export
 * @param {any} str   字典编码
 * @returns
 */
export function getDicData(str) {
  //获取数据字典相关内容
  var dicList = JSON.parse(getStore("gDictionaryList"));
  console.log(str, dicList);
  return dicList[str];
  // var filterarray = $.grep(dicList, function (value) {     return
  // value.typegroupcode === str;//筛选出其中一个，仍为一个数组 }); if (filterarray.length > 0)
  // {//防止前端报错     return filterarray[0].typeList; }
}

/**
 * 清除原有图层，新建图层
 * @param {*} _self  this 对象
 * @param {*} layer   图层对象
 * @param {*} topic   图层topic属性
 */
export function addMapLayer(_self, layer, topic) {
  layer.topic = topic;
  // const keys = Object.keys(_self.$store.getters.getMapLayers); const values =
  // Object.values(_self.$store.getters.getMapLayers)
  let obj = Object.assign({}, _self.$store.getters.getMapLayers);
  if (!obj[layer.topic]) {
    obj[layer.topic] = [];
  }
  obj[layer.topic].push(layer);

  _self.$store.dispatch("setMapLayers", obj);
}

/**
 * 获取百度地图不规则图形中心点
 * @param {Array} path 多边形的点集合数组
 */
export function getCenterPoint(path) {
  let x = 0.0;
  let y = 0.0;
  for (var i = 0; i < path.length; i++) {
    x = x + parseFloat(path[i].lng);
    y = y + parseFloat(path[i].lat);
  }
  x = x / path.length;
  y = y / path.length;
  return new BMap.Point(x, y);
}

export function formatSeconds(date) {
  let value = date || 0;
  var theTime = parseInt(value); // 秒
  var theTime1 = 0; // 分
  var theTime2 = 0; // 小时
  // alert(theTime);
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    // alert(theTime1+"-"+theTime);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + "分" + result;
  }
  if (theTime2 > 0) {
    result = "" + parseInt(theTime2) + "小时" + result;
  }
  return result;
}
/**
 * 数字千分位格式化
 *
 * @export
 * @param {any} num
 */
export function toThousands(num) {
  var num = (num || 0).toString(),
    result = "";
  while (num.length > 3) {
    result = "," + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
}

/**
 * 统一导入vue文件格式
 * @param {*} file  文件名
 */
export const _resolve = file => resolve =>
  require([`components/${file}.vue`], resolve);

/**
 * 是否显示面包屑导航
 * @param {Boole} type  是否显示面包屑导航
 */
export const _Meta = type => {
  const meta = {
    isBreadcrumb: type //路由是否显示面包屑导航
  };
  return meta;
};
/**
 * 构建异步路由结构信息
 * @param {Array} menuList  菜单信息
 * @returns 菜单结构
 */
export const asyncRouter = menuList => {
  let defaultRouter = [{
      path: "/",
      redirect: "/Layout"
    },
    {
      path: "/Layout",
      component: _resolve("Layout"),
      children: [{
        path: "/",
        meta: {
          isBreadcrumb: false
        },
        component: _resolve("view/home/home")
      }]
    }
  ];
  let asyncMainRouter = [];
  let asyncLayoutRouter = [];
  menuList.forEach(item => {
    let arr = {
      path: `/${item.menu_url}`,
      // meta: _Meta(false),
      meta: {
        isBreadcrumb: item.is_crumb,
        data: item
      },
      component: _resolve(item.comp_path || "view/home/home"),
      name: item.menu_name
    };
    if (item.menu_level == -1) {
      asyncMainRouter.push(arr);
    } else {
      asyncLayoutRouter.push(arr);
    }
  });

  defaultRouter[1].children = [
    defaultRouter[1].children[0],
    ...asyncLayoutRouter
  ];
  defaultRouter = [...defaultRouter, ...asyncMainRouter];
  return defaultRouter.concat([{
    path: "*",
    redirect: "/404"
  }]);
};


/**
 *  截取value 值
 * @param {Array} target 数组
 * @param {String} name 截取数组值
 */
export const cutValue = (target, name) => {
  let arr = []
  for (let i = 0; i < target.length; i++) {
    arr.push(target[i][name])
  }
  return arr
}




/**
 * 获取浏览器类型
 * 
 * @export
 * @returns  String
 */
export function getHtmlType() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return "IE";
  }
  //if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
  //    return "IE";
  //}
  var isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
    return "Opera";
  } else if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  } //判断是否Firefox浏览器
  else if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  } else if (userAgent.indexOf("Netscape") != -1) {
    return 'Netscape';
  } else if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器
  else {
    return "Unkown";
  }
}

export function isPlug() {
  const htmlType = getHtmlType();
  let type = false;
  if (htmlType == "IE") {
    if (document.all.plug0.object != null) type = true;
    type = false;
  } else {
    console.log(navigator);
    for (var i = 0; i < navigator.plugins.length; i++) {
      console.log(i);
      if (navigator.plugins[i].name == "联诚播放器插件") {
        type = true;
      }
    }
  }
  return type
}
