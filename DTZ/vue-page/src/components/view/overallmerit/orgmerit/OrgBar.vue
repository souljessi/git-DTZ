<template>
    <div v-loading="loading">
        <el-row :gutter="3" class="echarts-show">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="left-pie">
                <chart :key="echartsKey" :options="chartPieOptions" auto-resize></chart>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <chart :key="echartsKey" :options="chartTypeOptions" auto-resize></chart>
            </el-col>
        </el-row>
    </div>
</template>


<script>
 import {
    graphic
  } from "echarts/lib/export";

export default {
    components: {
        
    },
    data() {
        return {
            tipDiv:[
                {color:'red',text:'及格'},
                {color:'yellow',text:'良好'},
                {color:'green',text:'优秀'}
            ],
            loading:false,
            chartPieOptions: {
                title:{
                    text:'部门立案数统计',
                    subtext:'',
                    left:'center'
                },
                legend:{
                    type: 'scroll',
                    bottom: 20,
					left: 'center',
                    data:[],
                    selected:[]
                },
                tooltip: {
                    trigger: "item",
                    position: ["50%", "10%"],
                    formatter: "{a} <br/>{b} : {c}件({d}%)"
                },
                toolbox:{
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                color:['#F9E79F','#16A085','#4A235A','#C39BD3','#0AAF9F',
                    '#E89589','#EFE42A','#4A235A','#c8c8a9','#EE9201',
                    '#83af9b','#C33531','#BA4A00','#ECF0F1','#616A6B',
                    '#EAF2F8', '#B74AE5','#3498DB','#C23531','#00FFFF',
                    '#F3C683','#fe4365','#fc9d9a','#29AAE3','#d1f5ad','#64BD3D'],
                series: [
                    {
                        name: "部门案卷数量统计",
                        type: "pie",
                        radius: [0,"40%"],
                        data: [],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        },
                       
                }]
            },
            chartTypeOptions: {
                title:{
                    text:'部门评价综合得分',
                    subtext:'',
                    left:'center'
                },
                legend:{
                    show:false
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{a} <br/>{b} : {c}分"
                },
                
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }                    
                },
                grid: {
                    top: "20%",
                    left: "5%",
                    right: "5%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [{
                    type: "category",
                    data: [],
                    axisTick: {
                    show: false
                    },
                    axisLine: {
                    show: false
                    },
                    axisLabel:{
                        rotate: 60,
                        textStyle: {
                            color: '#000'
                        }
                    }
                }],
                yAxis: [{
                    type: "value",
                    axisLine: {
                    show: false
                    },
                    axisTick: {
                    show: false
                    },
                    axisLabel: {
                    textStyle: {
                        color: "#999"
                    }
                    }
                }],
                graphic: [
                    {
                        type: 'rect',
                        right: 35,
                        top: 10,
                        z: -10,
                        shape: {
                            width: 120,
                            height: 85
                        },
                        style: {
                            fill: '#fff',
                            stroke: '#555',
                            lineWidth: 1,
                            shadowBlur: 5,
                            shadowOffsetX: 2,
                            shadowOffsetY: 2,
                            shadowColor: 'rgba(0,0,0,0.2)'
                        }
                    },
                    {
                        type: 'text',
                        right: 95,
                        top: 15,
                        z: -10,
                        style: {
                            fill: '#333',
                            text: [
                                '总分:100分'
                            ].join('\n'),
                            font: '10px Microsoft YaHei'
                        }
                    },
                    {
                        type: 'group',
                        right: 50,
                        top: 35,
                        z: -10,
                        children: [
                            {
                                type: 'rect',
                                z: 100,
                                left: 'right',
                                top: 'middle',
                                shape: {
                                    width: 20,
                                    height: 12
                                },
                                style: {
                                    fill: 'green',
                              
                                }
                            },
                            {
                                type: 'text',
                                z: 100,
                                left: 'left',
                                top: 'middle',
                                style: {
                                    fill: '#333',
                                    text: [
                                        '良好(70分以上)'
                                    ].join('\n'),
                                    font: '10px Microsoft YaHei'
                                }
                            }
                        ]
                    },
                    {
                        type: 'group',
                        right: 50,
                        top:55,
                        z: -10,
                        children: [
                            {
                                type: 'rect',
                                z: 100,
                                left: 'right',
                                top: 'middle',
                                shape: {
                                    width: 20,
                                    height: 12
                                },
                                style: {
                                    fill: 'yellow',
                              
                                }
                            },
                            {
                                type: 'text',
                                z: 100,
                                left: 'left',
                                top: 'middle',
                                style: {
                                    fill: '#333',
                                    text: [
                                        '合格(50-70分) '
                                    ].join('\n'),
                                    font: '10px Microsoft YaHei'
                                }
                            }
                        ]
                    },
                    {
                        type: 'group',
                        right: 50,
                        top: 75,
                        z: -10,
                        children: [
                            {
                                type: 'rect',
                                z: 100,
                                left: 'right',
                                top: 'middle',
                                shape: {
                                    width: 20,
                                    height: 12
                                },
                                style: {
                                    fill: 'red',
                              
                                }
                            },
                            {
                                type: 'text',
                                z: 100,
                                left: 'left',
                                top: 'middle',
                                style: {
                                    fill: '#333',
                                    text: [
                                        '警告(50分以下)'
                                    ].join('\n'),
                                    font: '10px Microsoft YaHei'
                                }
                            }
                        ]
                    }

                ],
                series: [
                    {
                        name: "综合评价",
                        type: "bar",
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color:'#000'
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10,
                                color:function(params){
                                    return params.data.color
                                }
                            }
                        },
                        data: [{color:'red',value:90}]
                    }
                ]
            },

        };
    },
    props:['data','rangeDate','echartsKey'],
    watch:{
        data:function(){
            this.chartPieOptions.legend.type = 'scroll';
            this.chartPieOptions.series[0].data = this.data.map((item)=>{
                return {name:item.org_name,value:item.totalCount};
            })
            this.chartPieOptions.legend.data = this.data.map((item)=>{
                return item.org_name;
            })
            const selectedData = {};
            for(var i=0;i<this.data.length;i++){
                selectedData[this.data[i].org_name] = this.data[i].totalCount>0;
            }
            if(this.notTrueObj(selectedData)){//全部为0,false
                for(var j=0;j<5;j++){
                    selectedData[this.data[j].org_name] = true;
                }
            }
            this.chartPieOptions.legend.selected = selectedData;
            this.chartPieOptions.title.subtext = '评价周期:'+this.data[0].rangeDate;

            this.chartTypeOptions.series[0].data = this.data.map((item2)=>{
                let result = 100;
                if(item2.totalCount!=0){
                    result = Number(((item2.closeCount/item2.totalCount*60)+(1-item2.rejectCount/item2.totalCount)*40).toFixed(2));
                }
                return {color:this.checkResult(result),value:result};
            })
            this.chartTypeOptions.xAxis[0].data=this.data.map((item3)=>{
                return item3.org_name;
            })
            this.chartTypeOptions.title.subtext = '评价周期:'+this.data[0].rangeDate;
        },
    },
    computed: {
      
    },
    created() {},
    mounted() {},
    methods: {
        checkResult(res){
            let color = 'pink';
            switch (true){
                case res>=70:
                    color='green';
                    break;
                case res>=50&&res<70:
                    color='yellow';
                    break;
                case res<50:
                    color='red';
                    break;
                default:
                    break;
            }
            return color;
        },
        /**
         * 判断object 的value是否有true
         */
        notTrueObj(obj){
            for(var i in obj){
                if(obj.hasOwnProperty(i)&&obj[i]===true){
                    return false;
                }
            }
            return true;
        }

    }
};
</script>

<style lang="scss">
.echarts-show{
    .left-pie{
        box-sizing: border-box;
        border-right: 1px solid #c0c4cc;
    }
    .echarts{
        height: calc(100vh - 145px);
        width:calc(100% - 20px);
    }   
}



</style>
