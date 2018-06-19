export const formType = [{
    type: 'm-input',
    icon:'custexto',
    label: '文本输入框',
    name: 'input',
    inputType: 'text',
    value: '',
    required: false,
    minLength: 0,
    maxlength: 100,
    readonly: false,
    placeholder: '请输入文本'
  },
  {
    type: 'm-address',
    icon:'quyu',
    label: '地址选择器',
    name: 'address',
    hideDistrict: false,
    value: [],
    required: false,
    readonly: false,
    placeholder: '请选择地址'
  },
  {
    type: 'm-datetime',
    icon:'custime',
    label: '时间选择器',
    name: 'datetime',
    value: '',
    format: 'YYYY-MM-DD HH:mm:ss',
    minYear: null,
    maxYear: null,
    startDate: '',
    endDate: '',
    required: false,
    readonly: false,
    placeholder: '请选择时间'
  }, {
    type: 'm-datetime-scope',
    icon:'custime',
    label: '时间范围选择器',
    name: 'dataScope',
    value: {
      beigin: '2017-01-01',
      end: '2017-01-01',
      interva: '时间间隔',
      intervalUnit: '间隔单位'
    },
    beginTimeLabel: '开始时间',
    endTimeLabel: '结束时间',
    format: 'YYYY-MM-DD HH:mm:ss',
    minYear: null,
    maxYear: null,
    startDate: '',
    endDate: '',
    startDateIsToday: false,
    endDateIsToday: false,
    required: false,
    readonly: false,
    placeholder: '请选择时间'
  }, {
    type: 'm-textarea',
    icon:'cuszh',
    label: '备注文本区域',
    name: 'remark',
    value: {
      text: '',
      record: {
        path: '',
        duration: 0
      }
    },
    required: false,
    readonly: false,
    maxLength: 0,
    rows: 3,
    cols: 30,
    isEnableRecord: false,
    placeholder: '提示文本'
  }, {
    type: 'm-switch',
    icon:'cusswitch',
    label: '选择器',
    name: 'switch',
    value: false,
    readonly: true,
  }, {
    type: 'm-selector',
    icon:'cusxialadx',
    label: '单项下拉',
    name: 'selector',
    value: '',
    readonly: true,
    disabled: true,
    options: [
      {key:0,value:'选项1'},
      {key:1,value:'选项2'},
      {key:2,value:'选项3'}
    ],
    placeholder: '请选择'
  }, {
    type: 'm-radio',
    icon:'cusmore',
    label: '单项选择',
    name: 'radio',
    value: '',
    readonly: false,
    options: [
      {key:0,value:'选项1'},
      {key:1,value:'选项2'},
      {key:2,value:'选项3'}
    ],
    placeholder: '请选择'
  },
  {
    type: 'm-picker',
    icon:'cusselectmore',
    label: '关系选择',
    name: 'picker',
    value: [],
    readonly: false,
    disabled: true,
    options: [],
    columns: 0,
    fixedColumns: 0,
    columnWidth: 0,
    placeholder: '提示文字'
  },
  {
    type: 'm-checkbox',
    icon:'cusbtn',
    label: '按钮选择器',
    name: 'checkbox',
    value: '',
    checkType: 'checkbox',
    readonly: false,
    max: 5,
    required: false,
    options: [
      {key:0,value:'选项1'},
      {key:1,value:'选项2'},
      {key:2,value:'选项3'}
    ],
  },
  {
    type: 'm-scan',
    icon:'saoma',
    label: '扫描组件',
    name: 'scan',
    value: '',
    required: false,
    options: [],
  },
  {
    type: 'm-text',
    icon:'cuszt',
    label: '文本说明',
    name: 'text',
    text: '文本说明'
  },
  {
    type: 'm-upload-img',
    icon:'cusimg',
    label: '图片选择',
    name: 'img',
    targetWidth: 100,
    targetHeight: 100,
    required: false,
    options: [],
    max: 10,
    min: 1,
  },
  {
    type: 'm-person',
    icon:'bangong',
    label: '人选选择',
    name: 'person',
    vaule: [],
    selectType: 'mselect',
    readonly: false,
    required: false,
    options: [
      {key:0,value:'选项1'},
      {key:1,value:'选项2'}
    ],
  },
]
