export const formType = [
  {
    type: "m-input",
    icon: "custexto",
    label: "文本输入框",
    key: "input",
    inputType: "text", //即input的type属性，目前支持 text, number, email, url, tel, date, datetime, password, textarea
    value: "",
    required: false,
    // minLength: 0, maxlength: 100,
    readonly: false,
    placeholder: "请输入文本",
    role: [],
    listShow: false
  },
  //  {   type: 'm-address',   icon: 'quyu',   label: '地址选择器',   key: 'address',
  // hideDistrict: false,   value: [],   required: false,   readonly: false,
  // placeholder: '请选择地址' },
  {
    type: "m-datetime",
    icon: "custime",
    label: "时间选择器",
    key: "datetime",
    value: "",
    // format: 'YYYY-MM-DD HH:mm:ss', minYear: null, maxYear: null, startDate: '',
    // endDate: '',
    required: false,
    readonly: false,
    placeholder: "请选择时间",
    role: [],
    listShow: false
  },
  {
    type: "m-datetime-range",
    icon: "custime",
    label: "时间范围选择器",
    key: "dataScope",
    value: {
      beigin: "2017-01-01",
      end: "2017-01-01",
      interva: "时间间隔",
      intervalUnit: "间隔单位"
    },
    beginTimeLabel: "开始时间",
    endTimeLabel: "结束时间",
    format: "YYYY-MM-DD HH:mm:ss",
    // minYear: null, maxYear: null, startDate: '', endDate: '', startDateIsToday:
    // false, endDateIsToday: false,
    required: false,
    readonly: false,
    placeholder: "请选择时间",
    role: [],
    listShow: false
  },
  {
    type: "m-textarea",
    icon: "cuszh",
    label: "备注文本区域",
    key: "remark",
    value: {
      text: "",
      record: {
        path: "",
        duration: 0
      }
    },
    required: false,
    readonly: false,
    // maxLength: 0,
    rows: 3, //行数
    // cols: 30,
    isEnableRecord: false, //是否开启录音功能
    placeholder: "提示文本",
    role: [],
    listShow: false
  },
  {
    type: "m-switch",
    icon: "cusswitch",
    label: "选择器",
    key: "switch",
    value: false,
    readonly: false, //是否可用
    required: false,
    role: [],
    listShow: false
  },
  // {   type: 'm-selector',   icon: 'cusxialadx',   label: '单项下拉',   name:
  // 'selector',   value: '',   readonly: true,   disabled: true,   options: [ {
  // key: 0,       value: '选项1'     }, {       key: 1,       value: '选项2' }, {
  // key: 2,       value: '选项3'     }   ],   placeholder: '请选择' },
  {
    type: "m-radio",
    icon: "cusmore",
    label: "单项选择",
    key: "radio",
    value: {}, //返回的为name的值
    readonly: false,
    required: false,
    options: [
      {
        name: "选项1",
        value: 0
      },
      {
        name: "选项2",
        value: 1
      },
      {
        name: '选项3',
        value: 2
      }
    ],
    placeholder: "请选择",
    role: [],
    listShow: false
  },
  // {   type: 'm-picker',   icon: 'cusselectmore',   label: '关系选择',   name:
  // 'picker',   value: [],   readonly: false,   disabled: true,   options: [],
  // columns: 0,   fixedColumns: 0,   columnWidth: 0,   placeholder: '提示文字' },
  {
    type: "m-checkbox",
    icon: "cusbtn",
    label: "按钮选择器",
    key: "checkbox",
    value: [],
    // checkType: 'checkbox',
    // readonly: false,
    max: 5,
    required: false,
    options: [
      {
        name: "选项1",
        value: 0
      },
      {
        name: "选项2",
        value: 1
      },
      {
        name: "选项3",
        value: 2
      }
    ],
    role: [],
    listShow: false
  },
  {
    type: "m-scan",
    icon: "saoma",
    label: "扫描组件",
    key: "scan",
    value: "",
    required: false,
    readonly: false,
    role: [],
    listShow: false

    // options: []
  },
  // {
  //   type: "m-text",
  //   icon: "cuszt",
  //   label: "文本说明",
  //   name: "text",
  //   text: "文本说明",
  //   required: false,
  //   readonly: false,
  //   role: [],
  //   listShow: false
  // },
  {
    type: "m-upload-img",
    icon: "cusimg",
    label: "图片选择",
    value: [],
    key: "img",
    targetWidth: 100,
    targetHeight: 100,
    required: false,
    readonly: false,
    // options: [],
    max: 0,
    min: 0,
    role: [],
    listShow: false
  },
  {
    type: "m-upload-file",
    icon: "cusfile",
    label: "文件选择",
    key: "file",
    value: [], //[{url:’上传后的地址’,fileName:’文件名’}]
    required: false,
    max: 0,
    min: 0,
    role: [],
    listShow: false
  },
  {
    type: "m-select-person",
    icon: "bangong",
    label: "人选选择",
    key: "person",
    vaule: [],
    selectType: "mselect", //单选:select 多选:mselect
    readonly: false,
    required: false,
    disDelAble: false, //当为true时，点击item会发送 on-click-item 事件 否则点击后会删除item，默认flase
    role: [],
    listShow: false
  },
  {
    type: "m-select-area",
    label: "地区选择器",
    icon: "quyu",
    key: "area",
    value: {}, //{name:’’,value:’’}
    // selectType: "mselect", //单选:select 多选:mselect
    readonly: false,
    required: false,
    role: [],
    listShow: false
  },
  {
    type: "m-gps-point",
    icon: "map2",
    label: "坐标选择器",
    key: "point",
    value: {}, //{lon: 0, lat: 0,address:’’，unit:’单元格ID’,areaCode:’区域编码’}
    readonly: false,
    required: false,
    isAutoGetGPS: false, //默认5秒一次 自动刷新，如果进行手动纠偏操作， 自动刷新停止
    isGetUnit: false,
    isGetAreaCode: false,
    role: [],
    listShow: false
  }
];
