<template>
  <div  class="mysTask" >
    <el-tabs type="border-card" style="height:100%">
      <el-tab-pane label="待办任务">
        <el-row :gutter="3">
          <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]">
            <!--表单-->
            <el-table   :data="taskTableData"  border:height="screenHeight-110"
                        v-loading="loading"  style="width: 100%">
              <el-table-column prop="id" label="任务编号"></el-table-column>
              <el-table-column  min-width="100"  prop="act_name" label="当前环节"></el-table-column>
              <el-table-column min-width="100" prop="name"  label="流程名称"></el-table-column>
              <el-table-column min-width="100" prop="start_time" :formatter="dateFormatFun" label="开始时间"></el-table-column>
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="handleTaskView(scope.row)">任务办理</el-button>
                  <el-button size="mini" type="primary" @click="handleBpmnView(scope.row.id)">查看流程图</el-button>
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
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="已办任务">
        <el-row :gutter="3">
        <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]"  >
          <!--表单-->
          <div style="margin: 6px 0">
            类型
            <el-select  v-model="bpmnType" clearable    placeholder="请选择">
              <el-option
                v-for=" item in bpmnTypeList"  :key="item.id"    :label="item.NAME"       :value="item.id+','+item.KEY">
              </el-option>
            </el-select>

            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="pickTime" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
            </el-date-picker>

            <el-button type="primary" @click="getTaskEndList()">查询</el-button>
          </div>
          <el-table   :data="taskEndTableData"  border:height="screenHeight-110"
                      v-loading="taskEndloading"  style="width: 100%">
            <el-table-column prop="id" label="任务编号"></el-table-column>
            <el-table-column min-width="100" prop="name"  label="流程名称"></el-table-column>
            <el-table-column min-width="100" prop="start_time" :formatter="dateFormatFun" label="开始时间"></el-table-column>
            <el-table-column min-width="100" prop="end_time" :formatter="dateFormatFun" label="结束时间"></el-table-column>
            <el-table-column min-width="100" prop="duration" :formatter="dateTransform" label="任务历时"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <el-button   size="mini" type="primary"  @click="handleTaskEnd( scope.row)">查看详情</el-button>
                <el-button   size="mini" type="primary" @click="handleBpmnView( scope.row.id)" >查看流程图</el-button>
              </template>
            </el-table-column>
          </el-table>
          <paging @emitsizechange="taskEndhandleSizeChange"
                  @emitcurrentchange="taskEndhandleCurrentChange"
                  :currentPage="taskEndtabPage.currentPage"
                  :pageSizes="taskEndtabPage.pageSizes"
                  :pageSize="taskEndtabPage.pageSize"
                  :total="taskEndtabPage.totalNum">
          </paging>
        </el-col>
      </el-row></el-tab-pane>
    </el-tabs>
    <!--查看流程dialog-->
    <el-dialog class="bpmnDialog" :modal-append-to-body=false :visible.sync="dialogBpmnViewVisible"
               style="overflow: hidden;height:100%" width="80%">
      <div slot="title" class="el-dialog_header">
        <div style="display:inline-block;background:#ffc713;width:40px;height: 40px;text-align: center ">
          <i>
            <base-icon icon="liucheng" style="font-size: 20px"/>
          </i>
        </div>
        <span class="el-dialog__title" style="color:#fff"> {{formTitle}}</span>
      </div>
      <bpmnView ref="bpmnView" style="height: 100%" ></bpmnView>
      <div slot="footer" class="dialog-footer" style="position: absolute;bottom:10px;right: 10px; z-index: 1000">
        <el-button size="small" type="primary" @click="dialogBpmnViewVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <!--任务办理-->
    <el-dialog   :modal-append-to-body=false  :visible.sync="dialogTaskViewVisible"   >
      <div slot="title" class="el-dialog_header" style="color:#015aaa;border-bottom:1px solid #cccccc;">
        <div style="display:inline-block;width:130px;height: 40px;text-align: center; border-bottom:1px solid #015aaa">
          <i>
            <base-icon icon="liucheng" style="font-size: 20px"/>
          </i>
          <span class="el-dialog__title" style="color:#015aaa;" > {{formTitle}}</span>
        </div></div>
      <TaskView ref="taskView" @closeDialog="closeDialog" style="height: 100%" ></TaskView>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  import paging from '../../common/BasePaging.vue'
  import {dateFormat,formHoursMinSecond} from 'assets/js/date.js'
  import bpmnView from './bpmnView.vue'
  import TaskView from './caseTask.vue'
  export default {
    data(){
      return {
        tabPage: {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },//分页信息
        taskEndtabPage: {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },//分页信息
        tabSize:[24,24,24,24],//栅格用户列表
        loading: true,
        bpmnType: '',
        pickTime: null,
        bpmnTypeList:[],
        taskEndloading: true,
        formTitle: '',//新增编辑模态框title
        taskTableData:[],
        taskEndTableData:[],
        dialogBpmnViewVisible: false,//流程图模态框是否显示
        dialogTaskViewVisible: false,//流程图模态框是否显示
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
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
      }
    },
    created: function () {
    },
    mounted: function () {
      this.openScreen();
      this.getTaskList();
      this.getTaskEndList();
      this.openCaseTask(this.$route.query);
      this.queryBpmnTypeList();


    },
    components: {
      paging,bpmnView,TaskView

    },
    computed: {},
    watch:{

    },
    methods: {
      /**
       * 加载动画
       */
      openScreen() {//加载...
        this.loading = true;
        this.taskEndloading = true;
        let self=this;
        setTimeout(() => {
          self.loading = false;
          self.taskEndloading = false;
        }, 400);
      },
      /**
       *时间格式化
       */
      dateFormatFun(row, colum){
        if (row[colum.property] != null) {
          const d = row[colum.property];
          return dateFormat(new Date(d),"yyyy-MM-dd hh:mm:ss")
        }
      },
      /**
       * 查询代办流程列表
       */
      async getTaskList(){
        let data = {
          page: this.tabPage.currentPage,
          pageSize: this.tabPage.pageSize,
          assignee: JSON.parse(this.$getStore("userData")).id,
          group: JSON.parse(this.$getStore("userData")).roleList
        };
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryAgency', {params: data});
          if (res.data && res.data.success) {
            this.taskTableData = res.data.result.row;
            this.tabPage.totalNum = res.data.result.count[0].count;
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }
      },
      /**
       *任务历时
       */
      dateTransform(row, colum){
        if (row[colum.property] != null) {
          const d = row[colum.property];
          if(d==0){
            return '0秒'
          }else{
            return formHoursMinSecond(d)
          }
        }
      },
      /**
       * 查询已办流程列表
       */
      async getTaskEndList(){
        this.taskEndloading = true;
        let data = {
          page: this.taskEndtabPage.currentPage,
          pageSize: this.taskEndtabPage.pageSize,
          assignee: JSON.parse(this.$getStore("userData")).id
        };
        let bpmnArr=this.bpmnType.split(',');
        if(bpmnArr.length>1){
          data.deployment_id=bpmnArr[0]
          data.key=bpmnArr[1]
        }
        if(this.pickTime!=null){
          data.startTime=this.pickTime[0]
          data.endTime=this.pickTime[1]
        }
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryProcinstEnd', {params: data});
          if (res.data && res.data.success) {
            this.taskEndTableData = res.data.result.row;
            this.taskEndtabPage.totalNum = res.data.result.count[0].count;
            this.taskEndloading = false;
          }else{
            this.$message.error(res.data.msg);
            this.taskEndloading = false;
          }
        }catch(err){
          this.$message.error(err);
        }
      },

      /**
       * 查询流程类型
       */
      async queryBpmnTypeList(){

        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryBpmnTypeList', {});
          if (res.data && res.data.success) {
            this.bpmnTypeList = res.data.result;
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }
      },
      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange(val) {
        this.tabPage.pageSize = val;
        this.getTaskList();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        this.getTaskList();
      },
      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      taskEndhandleSizeChange(val) {
        this.taskEndtabPage.pageSize = val;
        this.getTaskEndList()
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      taskEndhandleCurrentChange(val) {
        this.taskEndtabPage.currentPage = val;
        this.getTaskEndList();
      },
      /**
       * 点击查看流程按钮
       */
      handleBpmnView(proc_id){
        this.dialogBpmnViewVisible = true;
        this.formTitle = "流程图";
        this.$nextTick(function(){
         this.$refs.bpmnView.getTaskXml(proc_id);
        })
1      },
      /**
       * 点击任务办理按钮
       */
      handleTaskView(proc){
        this.dialogTaskViewVisible = true;
        this.formTitle = "任务办理";
        this.$nextTick(function(){
         this.$refs.taskView.initMsg(proc,'edit');
        })
      },
      /**
       * 点击任务办理按钮
       */
      handleTaskEnd(proc){
        this.dialogTaskViewVisible = true;
        this.formTitle = "任务详情";
        this.$nextTick(function(){
         this.$refs.taskView.initMsg(proc,'');
        })
      },
      /**
       *关闭dialog
       */
      closeDialog(type){
        if(type!='close'){
          this.getTaskList()
          this.getTaskEndList()
        }else if(type=='close'){
          this.dialogTaskViewVisible=false
        }

      },
      /**
       * 监听参数id打开任务列表
       */
    async  openCaseTask(query){
        if(query.id){
          this.dialogTaskViewVisible = true;
          const res = await this.$http.post('/bpmn/BpmnController/queryProcinstMsg', {id: query.id});
          if (res.data && res.data.success) {
            this.formTitle = "任务详情";
            this.$refs.taskView.initMsg(res.data.result[0],'edit')
          }else{
            this.$message.error(res.data.msg);
          }

        }

      }
    }
  }
</script>

<style lang="scss">
  .mysTask{
    height: calc(100vh - 100px);
  }
  .mysTask .demo-table .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .mysTask  .el-form--inline .el-form-item__label {
    float: none;
    display: inline-block;
  }
  .mysTask .el-form--label-left .el-form-item__label {
    text-align: left;
  }
  .mysTask  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }

  .mysTask .el-dialog__body {
    padding: 10px 20px;
   background: #fefefe;
    height: calc(100vh - 300px);
  }

  .mysTask .el-dialog {
    height: 76vh;
    overflow: hidden;
  }

  .bpmnDialog .el-dialog__header {
    background: #0e0e0f;
    padding: 0;
    line-height: 40px;
  }

  .mysTask .el-table thead th {
    background: #ddd;
    color: #000
  }
</style>
