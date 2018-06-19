/**
 * Created by Administrator on 2017/4/6.
 */

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *
 * 例子：
 * dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * dateFormat(new Date(),"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * **/

export function dateFormat(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "" : "") : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};



/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 *可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 * pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * pattern(new Date(),"yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * pattern(new Date(),"yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * pattern(new Date(),"yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * pattern(new Date(),"yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */

export function patternFormat(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours() % 24 == 0 ? 24 : date.getHours() % 24, //小时
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  var week = {
    "0": "星期日",
    "1": "星期一",
    "2": "星期二",
    "3": "星期三",
    "4": "星期四",
    "5": "星期五",
    "6": "星期六"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "" : "") : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

//获取当前月的第一天
export function getCurrentMonthFirst() {
  var date = new Date();
  date.setDate(1);
  return date;
}
// 获取当前月的最后一天
export function getCurrentMonthLast() {
  var date = new Date();
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  return new Date(nextMonthFirstDay - oneDay);
}


/**
 * 获取本周，上周日到本周六
 */
export function getweek(n) {
  var now = new Date(); //当前日期
  var nowDayOfWeek = now.getDay(); //今天本周的第几天
  var nowDay = now.getDate(); //当前日
  var nowMonth = now.getMonth(); //当前月
  var nowYear = now.getYear(); //当前年
  nowYear += (nowYear < 2000) ? 1900 : 0; //n=0,6当前周
  var weekStartDate = new Date(nowYear, nowMonth, nowDay + (n - nowDayOfWeek));
  return weekStartDate;
}


//获取今天之前或之后天
export function setDays(n) {
  var date = new Date();
  var oneDay = 1000 * 60 * 60 * 24;
  return new Date(date - oneDay * n);
}

//将分钟转换为小时分钟
export function formHoursMin(n) {
  var str = '';
  if (n / 60 >> 0 > 0) {
    str += (n / 60 >> 0) + "小时";
  }
  if (n % 60 > 0) {
    str += (n % 60).toFixed(2) + "分钟"
  }

  return str;
}
/*
 * 方法作用：【计算2个日期之间的天数】
 * 传入格式：yyyy-mm-dd(2015-01-31)
 * 使用方法：dateUtil.dayMinus(startDate,endDate);
 * @startDate {Date}起始日期
 * @endDate {Date}结束日期
 * @return endDate - startDate的天数差
 */
export function dayMinus(startDate, endDate) {
  if (startDate instanceof Date && endDate instanceof Date) {
    var days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days;
  } else {
    return "Param error,date type!";
  }
}

//将秒转换为小时分钟秒
export function formHoursMinSecond(n) {
  var str = '';
  if (n / 24 / 60 / 60 >> 0 > 0) {
    str += (n / 24 / 60 / 60 >> 0) + "天";
  }
  if (n / 60 / 60 % 24 >> 0 > 0) {
    str += (n / 60 / 60 % 24 >> 0) + "小时";
  }
  if (n / 60 % 60 >> 0 > 0) {
    str += (n / 60 % 60 >> 0) + "分钟"
  }
  if (n % 60 > 0) {
    str += (n % 60) + "秒"
  }
  return str;
}


/**
 * 获取近几天前日期
 * 
 * @export
 * @param {any} day 天
 * @param {any} date 时间标准
 * @returns 
 */
export function getDaysBefore(day, date) {
  var date = date || new Date(),
    timestamp, newDate;
  if (!(date instanceof Date)) {
    date = new Date(date.replace(/-/g, '/'));
  }
  timestamp = date.getTime();
  newDate = new Date(timestamp - day * 24 * 3600 * 1000);
  let moth = newDate.getMonth() + 1;
  let Dat = newDate.getDate();
  if (moth < 10) {
    moth = '0' + moth;
  }
  if (Dat < 10) {
    Dat = '0' + Dat;
  }
  return [newDate.getFullYear(), moth, Dat].join('-');
}



/**
 * 获取上第几个月
 * 
 * @export
 * @param {any} m  前几个月 
 * @param {any} date 
 * @returns 
 */
export function getPreMonth(m, date) {
  var arr = [];
  var year = null; //获取当前日期的年份
  var month = null; //获取当前日期的月份
  var day = null; //获取当前日期的日
  if (!date instanceof Date) {
    arr = date.split('-');
    year = arr[0]; //获取当前日期的年份
    month = arr[1]; //获取当前日期的月份
    day = arr[2]; //获取当前日期的日
  } else {
    year = date.getFullYear(); //获取当前日期的年份
    month = date.getMonth(); //获取当前日期的月份
    day = date.getDate(); //获取当前日期的日
  }

  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中月的天数
  var year2 = year;
  var month2 = parseInt(month) - m;
  if (month2 == 0) {
    year2 = parseInt(year2) - 1;
    month2 = 12;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  var t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
}


//获得本周的开端日期 
export function getWeekStartDate() {
  var now = new Date(); //当前日期 
  var nowDayOfWeek = now.getDay(); //今天本周的第几天 
  console.log(nowDayOfWeek);
  var nowDay = now.getDate(); //当前日 
  var nowMonth = now.getMonth(); //当前月 
  var nowYear = now.getYear(); //当前年 
  nowYear += (nowYear < 2000) ? 1900 : 0; // 
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
  return dateFormat(weekStartDate, "yyyy-MM-dd");
}

//获得本周的停止日期 
export function getWeekEndDate() {
  var now = new Date(); //当前日期 
  var nowDayOfWeek = now.getDay(); //今天本周的第几天 
  var nowDay = now.getDate(); //当前日 
  var nowMonth = now.getMonth(); //当前月 
  var nowYear = now.getYear(); //当前年 
  nowYear += (nowYear < 2000) ? 1900 : 0; // 
  var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
  return dateFormat(weekEndDate, "yyyy-MM-dd");
}
