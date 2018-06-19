import Vue from 'vue'

import ECharts from 'vue-echarts/components/ECharts.vue'
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'            //柱状图
import 'echarts/lib/chart/pie'          //饼状图
import 'echarts/lib/chart/line'             //折线图
import 'echarts/lib/component/tooltip'      //tooltip工具

import "echarts/lib/component/legendScroll"//图例
import 'echarts/lib/component/title' //标题
import 'echarts/lib/component/toolbox' //工具栏
import 'echarts/lib/component/graphic' //原生图形元素组件
Vue.component('chart', ECharts)
