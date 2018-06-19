<template>
    <div v-loading="loading">
        <div class="area-search">
            <el-form :model="searchForm" inline  ref="searchForm">
                <el-form-item prop="level">
                    <el-select  v-model="searchForm.level" placeholder="请选择">
                        <el-option
                            v-for="item in level"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
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
                 <el-form-item prop="rangeDate2" v-if='searchForm.cycle==3' label="时间选择">
                    <div>
                        <el-date-picker
                            v-model="searchForm.rangeDate2"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            default-value="2010-10-01"
                            :clearable="false"
                            :picker-options="pickerOptions2">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" @click="onSearch">评价</el-button>
                </el-form-item> 
                <el-form-item>
                    <el-button type="success" @click="exportExcel">导出excel</el-button>
                    <a id='a_id'  :href="href" download="download" style="display:none;">下载</a>
                </el-form-item> 
            </el-form>
        </div>
        <div>
            <el-table
                v-loading="rightLoading"
                :data="tableData"
                border
                :height="screenHeight-150"
                style="width: 100%">
                <el-table-column
                    v-if="colShow===true"
                    prop="area_name"
                    label="区域名称">
                </el-table-column>
                <el-table-column
                    v-if="colShow===false"
                    prop="area_name"
                    label="单元网格">
                </el-table-column>
                <el-table-column
                    prop="rangeDate"
                    label="评价周期">
                </el-table-column>
                <el-table-column
                    prop="totalCount"
                    label="立案数">
                </el-table-column>
                <el-table-column
                    prop="onCloseCount"
                    label="按期结案数">
                </el-table-column>
                <el-table-column
                    label="按期结案率(%)">
                    <template slot-scope="scope">
                        <div v-if="scope.row.totalCount!=0"> {{(scope.row.onCloseCount/scope.row.totalCount*100).toFixed(2)}}</div>
                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="overCloseCount"
                    label="超期案卷结案数">
                </el-table-column>
                <el-table-column
                    label="超期案卷结案率(%)">
                    <template slot-scope="scope">
                        <div v-if="scope.row.totalCount!=0"> {{(scope.row.overCloseCount/scope.row.totalCount*100).toFixed(2)}}</div>
                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="上报立案率(%)">
                     <template slot-scope="scope">
                        <div v-if="scope.row.eventCount!=0"> {{(scope.row.eventCaseCount/scope.row.eventCount*100).toFixed(2)}}</div>
                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="result"
                    label="综合评价等级">
                </el-table-column>
                <el-table-column
                    prop="grade"
                    label="综合得分">
                </el-table-column>
            </el-table>
            <paging @emitsizechange="handleSizeChange"
                @emitcurrentchange="handleCurrentChange"
                :currentPage="tabPage.currentPage"
                :pageSizes="tabPage.pageSizes"
                :pageSize="tabPage.pageSize"
                :total="tabPage.totalNum">
            </paging>
        </div>
    </div>
</template>


<script>
import paging from 'common/BasePaging.vue'
import {dateFormat} from 'assets/js/date.js';
export default {
    components: {
        paging
    },
    data() {
        return {
            href:`http://${this.$webconfig.serverIp}/static/upload/QYPJ.xlsx`,
            tableData:[],
            level:[
                {label:'街道评价',value:1},
                {label:'社区评价',value:2},
                {label:'网格评价',value:3},
            ],
            cycle:[
                {label:'年',value:1},
                {label:'月',value:2},
                {label:'自定义',value:3}
            ],
            searchForm:{
                level:1,
                cycle:1,
                rangeDate:new Date(),
                rangeDate2:[new Date(),new Date()]
            },
            loading: false, //遮罩
            areaData: [], //区域数据
            screenHeight: document.body.clientHeight - 100,
            colShow:true,//现在区域|单元网格
            tabPage: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50]
            },//分页信息
            rightLoading:false,//列表加载事件
            activeName:'second',
            pickerOptions1: {//设置可选范围
                disabledDate(time) {
                    console.log(time);
                    return time.getTime() >= Date.now();
                },
            },
            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() >= Date.now();
                },
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            }
        };
    },
    computed: {

    },
    created() {},
    mounted() {
        this.getAreaData();
        const VM = this;
        window.addEventListener("resize", function(){ 
            VM.$nextTick(function() {
                if(VM.$route.path === '/areaevaluate'){//在当前路由
                    VM.screenHeight = document.body.clientHeight-100;
                }
            });
        });
    },
    methods: {
        handleClick(){

        },

        /**
         * 切换每页条数
         * @params {Number} val 每页条数
         */
        handleSizeChange(val) {
            this.tabPage.pageSize = val;
            this.changeTabData();
        },
        /**
         * 切换页码
         * @params {Number} val 页码
         */
        handleCurrentChange(val) {
            this.tabPage.currentPage = val;
            this.changeTabData();
        },
        /**
         * 获取当前页数据
         */
        changeTabData(){
            this.openScreen('loading');
            this.tabPage.totalNum = this.areaData.length;
            const start = this.tabPage.pageSize*(this.tabPage.currentPage-1);
            const end = start +this.tabPage.pageSize;
            this.tableData = this.areaData.slice(start, end);
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
            this.getAreaData();
        },
        /**
         * 重置查询表单
         */
        resetForm(){
            this.searchForm = {
                level:1,
                cycle:1,
                rangeDate:new Date()
            }
        },

        /**
         * 获取区域信息
         */
        async getAreaData() {
            const data = {
                level:this.searchForm.level,
                cycle:this.searchForm.cycle,
                rangeDate:this.getFormatDate()
            };
            const res = await this.$http.get(
            "/overallmerit/AreaController/queryAllAreaData",{params:data}
            );
            if (res.data&&res.data.success) {
                this.areaData = res.data.result;
                this.changeTabData();
                if(this.searchForm.level===3){
                    this.colShow = false;
                }else{
                    this.colShow = true;
                }
            }
           
        },
        getFormatDate(){
            let formatDate = '';
            switch (this.searchForm.cycle){
                case 1:
                    formatDate = dateFormat(new Date(this.searchForm.rangeDate),"yyyy");
                    break;
                case 2:
                    formatDate = dateFormat(new Date(this.searchForm.rangeDate),"yyyy-MM");
                    break;
                case 3:
                    formatDate = dateFormat(new Date(this.searchForm.rangeDate2[0]),"yyyy-MM-dd")+'~'+dateFormat(new Date(this.searchForm.rangeDate2[1]),"yyyy-MM-dd");
                    break;
                default:
                    break;
            }
            return formatDate;
        },
        //导出excel
        async exportExcel(){
            const data = {
                level:this.searchForm.level,
                cycle:this.searchForm.cycle,
                rangeDate:this.getFormatDate(),
                flag:1
            };
            const a = document.getElementById('a_id');
            const res =await this.$http.get("/overallmerit/ExportController/exportExcel",{params:data});
            if(res.data&&res.data.success){
                a.href = `http://${this.$webconfig.serverIp}/${res.data.result.filePath}`;
                a.download = '区域评价';
                a.click();
            }else{
                this.$message.error('导出错误');
            }
        }
       
    }
};
</script>

<style lang="scss">


</style>
