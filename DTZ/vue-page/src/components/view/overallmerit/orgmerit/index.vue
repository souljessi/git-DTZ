<template>
    <div v-loading="loading">
        <div class="area-search">
            <el-form :model="searchForm" inline  ref="searchForm">
                <el-form-item label="所属机构">
                    <div class="tagClass" @click="chooseDepart">
                        <el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type"  v-for="item in attendanceClerk" :key="item.id">
                            {{item.org_name}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item prop="cycle" label="评价周期">
                    <el-select  v-model="searchForm.cycle" placeholder="请选择">
                        <el-option
                            v-for="item in cycle"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="rangeDate" v-if='searchForm.cycle==1' label="时间选择">
                    <el-date-picker
                        v-model="searchForm.rangeDate"
                        align="right"
                        type="year"
                        placeholder="选择年"
                        :clearable="false"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item> 
                <el-form-item prop="rangeDate" v-if='searchForm.cycle==2' label="时间选择">
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
                    <el-button  type="primary" @click="onSearch">部门评价</el-button>
                </el-form-item> 
                <el-form-item>
                    <el-button type="success" v-if="listShow===true" @click="exportExcel">导出excel</el-button>
                    <a id='a_id'  :href="href" download="download" style="display:none;">下载</a>
                </el-form-item>  
                <el-form-item>
                    <el-button type="warning" @click="showEcharts">{{btnName}}</el-button>
                </el-form-item>                       
            </el-form>
        </div>
        <div v-show="listShow===true">
            <el-table
                v-loading="listLoading"
                :data="tableData"
                border
                :height="screenHeight-120"
                style="width: 100%">
                <el-table-column
                    prop="org_name"
                    label="部门名称">
                </el-table-column>
                <el-table-column
                    width="200"
                    prop="rangeDate"
                    label="评价周期">
                </el-table-column>
                <el-table-column
                    prop="totalCount"
                    label="接收案卷数">
                </el-table-column>
                <el-table-column
                    prop="closeCount"
                    label="结案数">
                </el-table-column>
                <el-table-column
                    prop="openCount"
                    label="未结案数">
                </el-table-column>
                <el-table-column
                    prop="onCloseCount"
                    label="按期结案数">
                </el-table-column>
                <el-table-column
                    prop="overCloseCount"
                    label="超期结案数">
                </el-table-column>
                <el-table-column
                    label="按期结案率(%)">
                    <template slot-scope="scope">
                        <div v-if="scope.row.totalCount!=0"> {{(scope.row.onCloseCount/scope.row.totalCount*100).toFixed(2)}}</div>
                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="超期结案率(%)">
                    <template slot-scope="scope">
                        <div v-if="scope.row.totalCount!=0"> {{(scope.row.overCloseCount/scope.row.totalCount*100).toFixed(2)}}</div>
                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="总结案率(%)">
                    <template slot-scope="scope">
                        <div v-if="scope.row.totalCount!=0"> {{(scope.row.closeCount/scope.row.totalCount*100).toFixed(2)}}</div>
                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="rejectCount"
                    label="驳回案卷数">
                </el-table-column>
                <el-table-column
                    label="完好率(%)">
                    <template slot-scope="scope">
                        <div v-if="scope.row.totalCount!=0">{{((1-scope.row.rejectCount/scope.row.totalCount)*100).toFixed(2)}}</div>

                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="评价结果">
                    <template slot-scope="scope">
                        <div v-if="scope.row.totalCount!=0"> {{((scope.row.closeCount/scope.row.totalCount*60)+(1-scope.row.rejectCount/scope.row.totalCount)*40).toFixed(2)}}</div>
                        <div v-else>100</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button
                                :disabled="scope.row.overCloseCount===0" 
                                type="primary" @click="openCaseList(scope.row,'overtime')">超期案卷
                            </el-button>
                            <el-button
                                :disabled="scope.row.rejectCount===0"
                                type="info" @click="openCaseList(scope.row,'reject')">驳回案卷
                            </el-button>
                        </template>
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
        <div v-show="listShow===false">
            <org-bar :data='echartsData' :echartsKey="echartsKey"></org-bar>
        </div>
        <el-dialog ref="test" title="部门选择" :visible.sync="dialogVisible" class="groupclass" :close-on-click-modal="false" width="35%">
            <Org style="height: 335px;overflow-y: scroll"
                :dialog-visible="dialogVisible"
                type="attendanceClerk"
                ref="attendanceClerk"
                :setSelect='setSelectList'
                @selectdNode='selectdNode'
                title="部门选择"
                :strictly="true"
            ></Org>
            <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="closeDialog()">确 定</el-button>
                </span>
            </div>
        </el-dialog>
        <el-dialog width="65%" v-bind:title="formTitle" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false">
            <el-table
                v-loading="loading"
                :data="listData"
                border
                :height="400"
                style="width: 100%">
                <el-table-column
                    prop="org_name"
                    label="部门名称">
                </el-table-column>
                <el-table-column
                    prop="case_code"
                    label="案卷编号">
                </el-table-column>
                <el-table-column
                    prop="ObjPosition"
                    label="案发地点">
                </el-table-column>
                <el-table-column
                    prop="remarks"
                    label="案卷描述">
                </el-table-column>
                 <el-table-column
                    label="案卷类型">
                    <template slot-scope="scope">
                        <div v-if="scope.row.sub_name"><span>{{scope.row.parent_name+'-'+scope.row.sub_name}}</span></div>
                        <div v-else><span>{{scope.row.parent_name}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="create_date"
                    label="立案时间"
                    width="130">
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogInfo=false">取 消</el-button>
                <el-button type="success"  @click="exportCaseExcel">导出excel</el-button>
                <a id='case_a'  :href="href" download="download" style="display:none;">下载</a>
            </div>
        </el-dialog>

    </div>
</template>


<script>
import OrgBar from './OrgBar';
import paging from 'common/BasePaging.vue'
import {dateFormat} from 'assets/js/date.js';
import Org from 'common/departTree';

export default {
    components: {
       OrgBar,paging,Org
    },
    data() {
        return {
            dialogType:0,
            orgid:'',
            listData:[],
            loading:false,
            dialogInfo:false,
            formTitle:'',
            href:`http://${this.$webconfig.serverIp}/static/upload/QYPJ.xlsx`,
            echartsKey:new Date().getTime(),
            pickerOptions1:{
                disabledDate(time) {
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
            },
            loading: false, //遮罩
            searchForm:{
                cycle:1,
                rangeDate:new Date(),
                rangeDate2:[new Date(),new Date()]
            },
            cycle:[
                {label:'年',value:1},
                {label:'月',value:2},
                {label:'自定义',value:3},
            ],
            orgMeritData:[],//部门评价全部数据
            tableData: [], //部门评价当前页数据
            listLoading:false,
            screenHeight: document.body.clientHeight - 100,
            tabPage: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50]
            },
            dialogVisible:false,
            setSelectList: [],
            attendanceClerk:[], 
            departTreeChangeArr:[],
            echartsData:[],//图表数据
            listShow:true,
            btnName:'图表评价',
        };
    },
    computed: {},
    created() {},
    mounted() {
        this.openScreen('loading');
        this.getOrgList();
        const VM = this;
        window.addEventListener("resize", function(){ 
            VM.screenHeight = document.body.clientHeight-100;
        });
    },
    methods: {
        /**
         * 默认查询所有部门
         */
        async getOrgList() {
            const res = await this.$http.get('/sys/DepartController/getDepartName');
            if (res.data&&res.data.success) {   //查询成功
                const result = res.data.result;
                this.attendanceClerk = result;
                this.departTreeChangeArr = result;
                this.getOrgEvalList();
            } else {
                this.$message.warning(res.data.msg);
            }
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
         * 评价按钮点击事件
         */
        onSearch(){
            this.getOrgEvalList();
        },
        /**
         * 获取部门评价列表
         */
        async getOrgEvalList(){
            let data = {
                cycle:this.searchForm.cycle
            };
            if(this.attendanceClerk.length>0){
                data.rangeDate = this.getFormatDate();
                data.orgList = JSON.stringify(
                    this.attendanceClerk.map((item)=>{
                        return item.id
                    })
                );
                const res = await this.$http.get('/overallmerit/OrgController/getOrgEval',{params:data});
                if(res.data&&res.data.result){
                    this.echartsData = res.data.result;
                    this.orgMeritData = res.data.result;
                    this.changeTabData();
                }else{
                    this.$message.error(res.data.msg);
                }
            }else{
                this.$message.warning('请选择至少一个部门');
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
        /**
         * 获取当前页数据
         */
        changeTabData(){
            this.openScreen('listLoading');
            this.tabPage.totalNum = this.orgMeritData.length;
            const start = this.tabPage.pageSize*(this.tabPage.currentPage-1);
            const end = start +this.tabPage.pageSize;
            this.tableData = this.orgMeritData.slice(start, end);
        },
        async exportExcel(){
            let data = {
                cycle:this.searchForm.cycle,
                rangeDate:this.getFormatDate(),
                flag:2
            };
            if(this.attendanceClerk.length>0){
                data.orgList = JSON.stringify(
                    this.attendanceClerk.map((item)=>{
                        return item.id
                    })
                );
                const a = document.getElementById('a_id');
                const res =await this.$http.get("/overallmerit/ExportController/exportExcel",{params:data});
                if(res.data&&res.data.success){
                    a.href = `http://${this.$webconfig.serverIp}/${res.data.result.filePath}`;
                    a.download = '部门评价';
                    a.click();
                }else{
                    this.$message.error('部门评价导出错误');
                }
            }else{
                this.$message.warning('请选择至少一个机构');
            }
        },
        /**
         * 排班部门选择
         */
        chooseDepart() {
            this.dialogVisible = true;
            if(this.attendanceClerk.length>0){
                this.setSelectList = this.attendanceClerk.map((item)=>{
                    return item.id;
                })
            }else{
                this.setSelectList = [];
            }

        },
        /**
        * @param {Object} data 组织树回调
        */
        selectdNode(data) {
            this.departTreeChangeArr = data;
        },
        /**
        * 确定关闭dialog
        */
        closeDialog() {
            this.attendanceClerk = this.departTreeChangeArr;
            this.dialogVisible = false;
        },
        async showEcharts(){
            (this.listShow === false) ? this.listShow =true : this.listShow =false;
            (this.btnName === '图表评价') ? this.btnName ='列表评价' : this.btnName ='图表评价';
            this.echartsKey = new Date().getTime();
            this.getOrgEvalList();
        },
        /**
         * 获取部门超期|驳回 案卷列表
         */
        async openCaseList(row,type){
            this.orgid = row.id;
            let data = {
                cycle:this.searchForm.cycle,
                rangeDate:this.getFormatDate(),
                orgid:row.id,
                type:1
            };
            let msg = '';
            if(type==='reject'){
                data.type=0;
                this.dialogType = 0;
                this.formTitle = row.org_name+'【'+this.getFormatDate()+'】驳回案卷列表';
            }else{
                data.type=1;
                this.dialogType = 1;
                this.formTitle = row.org_name+'【'+this.getFormatDate()+'】超期案卷列表';
            }
            const res = await this.$http.get("/overallmerit/OrgController/getCaseListBy",{params:data});
            if(res.data&&res.data.success){
                const list = res.data.result;
                if(list.length>0){
                    this.dialogInfo = true;
                    this.listData = list;
                }
            }else{
                this.$message.error(res.data.msg);
            }
            
        },

        async exportCaseExcel(){
            let data = {
                cycle:this.searchForm.cycle,
                rangeDate:this.getFormatDate(),
                orgid:this.orgid,
                type:this.dialogType,
                flag:4
            };
            const a = document.getElementById('case_a');
            const res =await this.$http.get("/overallmerit/ExportController/exportExcel",{params:data});
            if(res.data&&res.data.success){
                a.href = `http://${this.$webconfig.serverIp}/${res.data.result.filePath}`;
                a.download = `${this.formTitle}`;
                a.click();
            }else{
                this.$message.error('案卷列表导出错误');
            }
        }

    }
};
</script>

<style lang="scss">
.tagClass {
    height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 5px;
    line-height: 28px;
    width:200px;
    overflow: auto;
    box-sizing: border-box;
    .el-tag--depart {
        background-color: #20a0ff;
        border-color: rgba(18, 206, 102, .2);
        color: #fbfdff;
    }
    .el-tag {
        padding: 0 5px;
        height: 18px;
        line-height: 18px;
        font-size: 12px;
    }

}


</style>
