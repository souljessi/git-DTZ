/**
 * 验证数字组合
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 * 在validateRule.js里面使用
 */
export const checkNumber = (rule, value, callback) => {
  var reg = /^[0-9]*$/;//验证数字
  if (!value) {
    callback(new Error('请输入数字'));
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error('请输入数字组合'));
    }
    else {
      if (value.length > 13) {
        callback(new Error('编号不能超过13位'));
      }
      else {
        callback();
      }
    }
  }, 300);
};
/**
 * 验证年龄
 * @param rule
 * @param value
 * @param callback
 */
export const checkAge = (rule, value, callback) => {

  var reg = /^[1-9]\d{1,2}$/;//最多三位
  if (!value) {
    callback(new Error('请输入年龄'));
  }
  setTimeout(() => {

    if (!reg.test(value)) {
      callback(new Error('年龄为两位或三位整数'));
    } else if (value < 18) {
      callback(new Error('年龄必须大于18'));
    }
    else {
      callback();
    }

  }, 100);
};
/**
 * 验证手机号码
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const isMobilePhone = (rule, value, callback) => {
  var reg = /^1[34578]\d{9}$/;//手机号码
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error('请输入正确格式，如：18723346175'));
    } else {
      callback();
    }
  }, 300);
};

/**
 * 坐标浮点型
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const checkFloat = (rule, value, callback) => {
  // var reg = /^(-?\d+)(\.\d{0,5})?$/;//浮点数，最多五位小数
  var reg = /^(-?[1-9]\d*(\.\d*[1-9])?)$|^(-?0\.\d*[1-9])$|^0$/;

  if (!value && value != 0) {
    callback(new Error('请输入坐标值'));
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error('请输入正确格式数值，如-2.33'));
    } else {
      callback();

    }
  }, 300);
};

/**
 * 验证特殊字符或汉字
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export const checkCode = (rule, value, callback) => {
  // var reg = /^[\^\\%&\*~'\?\/\<\>\|\"`]+$/;//中文和特殊字符
  var reg = /^[a-zA-Z0-9_]{0,}$/;
  if (!value) {
    callback(new Error('请输入工人卡号'));
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error('不能输入汉字或者特殊字符'));
    } else {
      callback();

    }
  }, 300);
};
export const checkPassword = (rule, value, callback) => {
  var reg = /^[a-zA-Z0-9_]{0,}$/
  if (!value) {
    callback(new Error('请输入密码'));
  }
  if (value.length < 6) {
    callback(new Error('密码小于6位'));
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error('不能输入汉字或者特殊字符'));
    } else {
      callback();

    }
  }, 300)
}

/**
 * 验证组织机构编码
 * @param rule
 * @param value
 * @param callback
 */
export const checkOrgCode = (rule, value, callback) => {
  // var reg = /^[\^\\%&\*~'\?\/\<\>\|\"`]+$/;//中文和特殊字符
  var reg = /^[a-zA-Z0-9_]{0,}$/;
  if (!value) {
    callback(new Error('请输入组织机构编码'));
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error('不能输入汉字或者特殊字符'));
    } else {
      callback();

    }
  }, 300);
};

export const checkCardId = (rule, value, callback) => {
  var reg = /(^\d{15}$)|(^\d{6}[1|2]\d{10}(\d|X|x)$)/
  if (!value) {
    callback(new Error('请输入身份证号'))
  }
  if (value.length < 18) {
    callback(new Error('请输入正确格式的身份证号'));
  }
  setTimeout(() => {
    if (!reg.test(value)) {
      callback(new Error('请输入正确格式的身份证号'));
    } else {
      callback();

    }
  }, 300)
}
//身份证有效性验证
export const IdentityCodeValid = (rule, code, callback) => {
  var city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外 "
  };
  var tip = "";
  var pass = true;
  if(!code){
    callback(new Error('请输入身份证号'))
  }

  if (!/^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i.test(code)) {
    tip = "身份证号格式错误";
    callback(new Error('身份证号格式错误'))
    pass = false;
  }

  else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    callback(new Error('地址编码错误'))
    pass = false;
  }
  else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "校验位错误";
        callback(new Error('校验位错误'))
        pass = false;
      } else {
        callback()
      }
    }
  }
  if (!pass)
    return pass;
}
export const checkRequired = (rule, value, callback) => {
  if (value.length < 1) {
    callback(new Error('此项必填'));
  } else {
    callback();
  }
};
//检查出生日期
export const checkBirth = (rule, value, callback) => {
  if (!value) {
    callback(new Error('此项必填'))
  } else {
    callback()
  }
}
export const Number = (rule, value, callback) => {
  var reg = /^[0-9]*$/;//验证数字
  if (!value) {
    callback(new Error('请输入数字'));
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入数字'));
    } else {
      callback();
    }
  }

};
/**
 * 验证英文名称
 */
export const checkEnglish = (rule, value, callback) => {
  var reg = /^[a-zA-z]+$/;//验证字母
  if (!value) {
    callback(new Error('请输入英文'));
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入英文'));
    } else {
      callback();
    }
  }

};
/**
 * 验证数字且最多10位
 */
export const NumberTen = (rule, value, callback) => {
  var reg = /^[0-9]{1,10}$/;//验证数字
  if (!value) {
    callback(new Error('请输入数字'));
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入数字'));
    } else {
      callback();
    }
  }

};

/**
 * 验证数字且最多15位
 */
export const NumberTenFive = (rule, value, callback) => {
  var reg = /^[0-9]{12,15}$/;//验证数字
  if (!value) {
    callback(new Error('请输入数字'));
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入数字'));
    } else {
      callback();
    }
  }

};

