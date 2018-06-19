<template>
  <div class="bpmnlist">
    <el-row :gutter="3">
      <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]">
        <!--查询-->
        <el-form :inline="true"  class="demo-form-inline" ref="formInline">
          <el-form-item>
            <el-button type="success" icon="el-icon-plus" @click="handleAdd">新建模型</el-button>
          </el-form-item>
        </el-form>
        <!--表单-->
        <el-table   :data="modelTableData"  border:height="screenHeight-110"
          v-loading="loading"  style="width: 100%" >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column min-width="100" prop="key"  label="模型标识"></el-table-column>
          <el-table-column min-width="100" prop="name"  label="模型名称"></el-table-column>
          <el-table-column min-width="100" prop="rev"  label="版本号"></el-table-column>
          <el-table-column min-width="100" prop="create_date" :formatter="dateFormatFun" label="创建时间"></el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button   size="mini" type="success" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button   size="mini" type="success" @click="deploymentModel(scope.row)">部署</el-button>
              <el-button   size="mini" type="danger" @click="deleteModelInfo(scope.row)">删除</el-button>
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
    <!--dialog-->
    <el-dialog class="bpmnDialog" :modal-append-to-body=false :visible.sync="dialogBpmnVisible"
               style="overflow: hidden;height:100%" width="80%">
      <div slot="title" class="el-dialog_header">
        <div style="display:inline-block;background:#ffc713;width:40px;height: 40px;text-align: center ">
          <i>
            <base-icon icon="liucheng" style="font-size: 20px"/>
          </i>
        </div>
        <span class="el-dialog__title" style="color:#fff"> {{formTitle}}</span>
      </div>
      <bpmnEdit ref="bpmnEdit" @closeDialog="closeDialog" style="height: 100%;overflow:hidden"></bpmnEdit>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  import paging from '../../common/BasePaging.vue'
  import {dateFormat} from 'assets/js/date.js'
  import bpmnEdit from './bpmnEdit.vue'
  export default {
    data(){
      return {
        modelTableData: [],//列表数组
        sels: [],//表格选中列
        tabPage: {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },//分页信息
        loading: true,
        dialogInfo: false,//模态框是否显示标识
        dialogVisibles: false,//模态框是否显示
        dialogBpmnVisible: false,//模态框是否显示
        rules: {
          name: [
            {required: true, message: '请输入流程名称', trigger: 'blur'}
          ]
        },
        formTitle: '',//新增编辑模态框title
        defaultKey:[],//选中项
        tabSize:[24,24,24,24],//栅格用户列表
        screenHeight: document.body.clientHeight-125,
      }
    },
    created: function () {

    },
    mounted: function () {
     this.openScreen();
     this.getModelList();
    },
    components: {
      paging,bpmnEdit
    },
    computed: {},
    methods: {
      /**
       * 加载动画
       */
      openScreen() {//加载...
        this.loading = true;
        let self=this;
        setTimeout(() => {
          self.loading = false;
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
       *关闭dialog
       */
      closeDialog(type){
        if(type!='close'){
          this.getModelList()
        }
       this.dialogBpmnVisible=false
      },
      /**
       * 查询模型列表
       */
      async getModelList(){
        let data = {
          page: this.tabPage.currentPage,
          pageSize: this.tabPage.pageSize,
        };

        try{
          const res = await this.$http.get('/bpmn/BpmnController/queryModelList', {params: data});
          if (res.data && res.data.success) {
            this.modelTableData = res.data.result.row;
            this.tabPage.totalNum = res.data.result.count[0].count;
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error('查询失败');
        }
      },
      /**
       * 部署流程
       * @params {Object} row|rows     行对象
       */
      deploymentModel(data){
        const _vm = this;
        _vm.$confirm('确认部署该模型吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try{
            const res = await _vm.$http.post('/bpmn/BpmnController/deploymentModel', {data:data});
            if (res.data && res.data.success) {
              _vm.$message.success('部署成功');
            }else{
              _vm.$message.error(res.data.msg);
            }
          }catch(err){
            _vm.$message.error('部署失败');
          }
        })
      },
      /**
       * 点击新增按钮
       */
      handleAdd(){
        this.dialogInfo = true;
        this.dialogBpmnVisible = true;
        this.formTitle = "新增模型信息";
        this.$nextTick(function(){
          this.$refs.bpmnEdit.addBpmn();
        })

      },
      /**
       * 点击修改按钮
       */
      handleEdit(data){
        this.dialogInfo = true;
        this.dialogBpmnVisible = true;
        this.formTitle = "编辑模型信息";
        this.$nextTick(function(){
          this.$refs.bpmnEdit.editBpmn(data);
        })

      },
      /**
       * 删除流程信息
       * @params {Object} row|rows     行对象
       */
      deleteModelInfo(data){
        const _vm = this;
        _vm.$confirm('此操作将永久删除选择模型信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try{
            const res = await _vm.$http.post('/bpmn/BpmnController/deleteModelById', {id:data.id});
            if (res.data && res.data.success) {
              _vm.getModelList();
              _vm.$message.success('删除成功');
            }else{
              _vm.$message.error(res.data.msg);
            }
          }catch(err){
            _vm.$message.error('删除失败');
          }
        })
      },
      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange(val) {
        this.tabPage.pageSize = val;
        this.getSysUserList();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        this.getSysUserList();
      },
      submitForm(data){
        this.dialogBpmnVisible = false;
        this.$message.success('保存成功');
      }
    }
  }
</script>

<style  >

.bpmnlist input[type="file"]{
  display:none
}
.bpmnDialog .el-dialog {
  height: 80vh;
}
 .bpmnlist .el-dialog__header{
    background:#0e0e0f;
    padding:0;
    line-height:40px
  }
</style>
