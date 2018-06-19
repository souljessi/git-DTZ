<template>
    <div v-loading="loading" class="BGID-center">
        <base-map :center="center" :height="screenHeight-50" @ready="ready" :zoom="16"></base-map>
        <div :class="['cell-content',topShow?'':'hideSearch']" :style="themeBg">
           
            <div class="cell-search">
                <el-form :model="searchForm" inline  ref="searchForm">
                    <el-form-item prop="cycle">
                        <el-select  v-model="searchForm.cycle" placeholder="请选择">
                            <el-option
                                v-for="item in cycle"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="rangeDate" v-if='searchForm.cycle==1'>
                        <el-date-picker
                            v-model="searchForm.rangeDate"
                            align="right"
                            type="year"
                            placeholder="选择年"
                            :clearable="false"
                            :picker-options="pickerOptions1">
                        </el-date-picker>
                    </el-form-item> 
                    <el-form-item prop="rangeDate" v-if='searchForm.cycle==2'>
                        <el-date-picker
                            v-model="searchForm.rangeDate"
                            type="month"
                            placeholder="选择月"
                            :clearable="false"
                            :picker-options="pickerOptions1"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="success" @click="onSearch">评价</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="info" @click="setCenter">重置中心</el-button>
                    </el-form-item>
                </el-form>
            </div>            
        </div>

        <!--配置信息-->
        <div :class="['cell-desc',rightShow?'':'hideDesc']">
            <el-table
                :data="defaultData"
                border
                style="width: 100%">
                <el-table-column
                    prop="color"
                    width="45"
                    label="色值">
                     <template slot-scope="scope">
                        <div :style="{backgroundColor:scope.row.color,opacity:0.6}" class="mapcolor"></div>
                    </template>
                </el-table-column>
              
                <el-table-column
                    label="立案数">
                    <el-table-column
                        prop="year"
                        label="年">
                    </el-table-column>
                    <el-table-column
                        prop="month"
                        label="月">
                    </el-table-column>
                </el-table-column>              
            </el-table>
        </div>
        <!-- 显示隐藏查询form -->
        <div :class="['control-search',topShow?'':'hideRotate']" :title="topShow?'隐藏查询':'展开查询'" @click='searchControl'>
            <base-icon icon="top" :class="[topShow?'':'hideSearchIcon']"/>
        </div>
        <!-- 显示隐藏配置信息 -->
        <div :class="['control-desc',rightShow?'':'hideDescIcon']" :title="rightShow?'隐藏配置信息':'展开配置信息'" @click='descControl'>
            <base-icon icon="right" />
        </div>
    </div>
</template>


<script>
import BaseMap from "common/BaseMap";
import { addMapLayer,getCenterPoint,transData} from "assets/js/commonManage.js";
import {dateFormat} from 'assets/js/date.js';
export default {
    components: {
        BaseMap
    },
    data() {
        return {
            defaultData:[
                {
                    year:'96以下',
                    month:'小于9',
                    color:'green'
                },
                {
                    year:'96~132',
                    month:'9~12',
                    color:'blue'
                },
                {
                    
                    year:'132~168',
                    month:'12~15',
                    color:'yellow'
                },
                {
                    year:'168~204',
                    month:'15~18',
                    color:'red'
                },
                {
                    year:'216以上',
                    month:'18及以上',
                    color:'black'
                }
                
            ],
            cycle:[
                {label:'年',value:1},
                {label:'月',value:2}
            ],
            searchForm:{
                level:3,
                cycle:1,
                rangeDate:new Date()
            },
            loading: false, //遮罩
            map: "", //地图
            center: {
                //地图中心点
                lng: 103.671826,
                lat: 25.037481
            },
            areaData: [], //区域数据

            screenHeight: document.body.clientHeight - 100,
            colShow:true,//现在区域|单元网格
            pickerOptions1: {//设置可选范围
                disabledDate(time) {
                    return time.getTime() >= Date.now();
                },
            },
            rightShow:true,
            topShow:true,
        };
    },
    computed: {
        themeBg() {
            let color = {backgroundColor:"#333"};
            let value = JSON.parse(JSON.stringify(this.$store.getters.getTheme));
            if (value !=="#0e0e10") {
                color.backgroundColor = value;
                color.color = '#fff';
            }
            return color;
        },
        height() {
            return document.body.clientHeight - 50;
        },
        areaSelectOptions() {
        let list = this.areaData.filter(item => {
            return item.scope_path != null && item.scope_path != undefined;
        });
        return list;
        },
    },
    created() {},
    mounted() {
        // this.getBGIDCaseData(this.searchForm);
        const VM = this;
        window.addEventListener("resize", function(){ 
            VM.screenHeight = document.body.clientHeight-100;
        });
    },
    methods: {
        descControl(){
            this.rightShow ===false?this.rightShow=true:this.rightShow=false;
        },
        searchControl() {
            this.topShow ===false?this.topShow=true:this.topShow=false;
       
        },
        handleClick(){

        },
         /**
         * 加载动画
         */
        openScreen(key) {//加载...
            this[key] = true;
            setTimeout(() => {
                this[key] = false;
            }, 400);
        },
        /**
         * 查询按钮点击事件
         */
        onSearch(){
            let data = Object.assign({},this.searchForm);
            this.map.clearOverlays();
            this.getBGIDCaseData(data);
        },
        /**
         * 重置查询表单
         */
        resetForm(){
            this.searchForm = {
                cycle:1,
                rangeDate:new Date(),
                selList:''
            }
        },

        /**
         * 设置多边形随机颜色配置
         */

        setStyleOptions(data) {
            let count = data.count;
            if(this.searchForm.cycle===1){
                count = data.count/12;
            } 
            let color = "";
            switch (true){
                case count<9:
                    color = "green";
                    break;
                case 9<=count&&count<12:
                    color = "blue";
                    break;
                case 12<=count&&count<15:
                    color = "yellow";
                    break;
                case 15<=count&&count<18:
                    color = "red";
                    break;
                case 18<=count:
                    color = "black";
                    break;
                default:
                    break;
            }
            return {
                strokeColor: color, //边线颜色。
                fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 1, //边线的宽度，以像素为单位。
                strokeOpacity: 1, //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
                strokeStyle: "dashed" //边线的样式，solid或dashed。
            };
        },
        /**
         * 添加地图图层
         * @param {Object} data 数据源
         * @param {Number} type 数据类型，默认为0 （区域类型） 1：单元格类型
         */
        addPolygon(data) {
            let arr = JSON.parse(data.scope_path);
            var label = new BMap.Label(data.area_name, {});
            if (arr != null) {
                let point = arr.map(item => {
                    return new BMap.Point(item.lng, item.lat);
                });
               
                const style = this.setStyleOptions(data);
                let polygonLayer = new BMap.Polygon(point, style); //建立多边形覆盖物
                label.setPosition(getCenterPoint(polygonLayer.getPath()));
                polygonLayer.label = label;
                polygonLayer.data = data;
                this.map.addOverlay(polygonLayer);
                addMapLayer(this, polygonLayer, "area");
                polygonLayer.addEventListener("mouseover", (e) =>{
                    e.target.setStrokeColor("blue");
                    e.target.setStrokeStyle("solid");
                    e.target.setStrokeWeight(1);
                    const point = getCenterPoint(e.target.getPath());
                    let opts = {
                        width: 210, // 信息窗口宽度
                        title: "单元网格信息", // 信息窗口标题
                        enableMessage: true //设置允许信息窗发送短息
                    };
                    let content = `<div class="map-windInfo">
                        <p>单元网格：${this.setText(e.target.data.BGID)}</p>
                        <p>评价周期：${this.setText(e.target.data.range)}</p>
                        <p>立案数：${this.setText(e.target.data.count)}件</p>
                        </div>`;
                    var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
                    this.map.openInfoWindow(infoWindow,point); //开启信息窗口
                });
                polygonLayer.addEventListener("mouseout", function(e) {
                    e.target.setStrokeColor(e.target.getFillColor());
                    e.target.setStrokeStyle("solid");
                    e.target.setStrokeWeight(1);
                    // this.map.closeInfoWindow();
                });
               
            }
        },

        /**
         * 获取区域信息
         */
        async getBGIDCaseData(data) {
            this.openScreen('loading');            // this.map.clearOverlays();
            let date = this.searchForm.rangeDate;
            if(this.searchForm.cycle===1){
                date = dateFormat(new Date(date),"yyyy");
            }else{
                date = dateFormat(new Date(date),"yyyy-MM");
            }
            data.rangeDate = date;
            const res = await this.$http.get(
            "/overallmerit/AreaController/getBGIDCase",{params:data}
            );
            if (res.data&&res.data.success) {
                this.areaData = res.data.result;
                for(var i =0;i<this.areaData.length;i++){
                    let item = this.areaData[i];
                    this.addPolygon(item);
                }
                if(this.searchForm.level===3){
                    this.colShow = false;
                }else{
                    this.colShow = true;
                }
            }
        },

        /**
         * 地图初始化
         */
        ready({ BMap, map }) {
            this.map =  map;
            this.getBGIDCaseData(this.searchForm);

        },

        //设置点Lable文本显示
        setText(data) {
            return data != null && data != undefined ? data : "";
        },
        setCenter(){//重置中心点
            this.map.centerAndZoom(new BMap.Point(this.center.lng,this.center.lat),16);
        }

    }
};
</script>

<style lang="scss">


.BGID-center {
    position: relative;
    overflow: hidden;
    .map-windInfo{
        font-size:12px;
    }
    .mapcolor{
        width:20px;
        height:10px;
    }
    .cell-content {
        position: absolute;
        left:50%;
        top: 0px;
        width:650px;
        height:48px;
        margin-left:-325px;
        z-index: 12;
        transition: all 0.4s;
        background:#333;
        .cell-search{
            margin:7px;
        }
    }

    .cell-desc{
        height:250px;
        width:200px;
        position: absolute;
        top:0;
        right:0;
        z-index: 11;
        cursor: pointer;
        transition: all 0.4s;
        font-size: 34px;
    }

    .hideSearch {
        top: -200px !important;
    }
    .hideRotate{
        transform: rotate(180deg);
        top: 0px !important;
    }
    .hideSearchIcon {
        -webkit-animation: bounce-down 1.5s linear infinite;
        animation: bounce-down 1.5s linear infinite;
        animation-direction:alternate;
        -webkit-animation-direction:alternate;
    }
    .control-search {
        position: absolute;
        left:50%;
        top: 48px;
        z-index: 11;
        cursor: pointer;
        margin-left: -10px;
        transition: all 0.4s;
    }

    .control-desc{
        position: absolute;
        top:0;
        right:195px;
        z-index: 11;
        cursor: pointer;
        transition: all 0.4s;
        margin-top:107.5px;
        font-size: 35px;
    }
    .hideDesc {
        right: -250px !important;
    }

    .hideDescIcon {
        transform: rotate(180deg);
        right: 0px !important;

    }

    
}

@-webkit-keyframes bounce-down {
 25% {-webkit-transform: translateY(-10px);}
 50%, 100% {-webkit-transform: translateY(0);}
 75% {-webkit-transform: translateY(10px);}
}

@keyframes bounce-down {
 25% {transform: translateY(-10px);}
 50%, 100% {transform: translateY(0);}
 75% {transform: translateY(10px);}
}

</style>
