<template>
  <div class="bpmnlist">
    <el-row :gutter="3">
      <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]">
        <!--查询-->
        <el-form :inline="true"  class="demo-form-inline" ref="formInline">
          <el-form-item>
            <el-button type="primary" icon="el-icon-upload2" @click="handleUpload">部署流程</el-button>
          </el-form-item>
        </el-form>
        <!--表单-->
        <el-table   :data="BpmnTableData"  border:height="screenHeight-110"
          v-loading="loading"  style="width: 100%">
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="id" label="流程ID"></el-table-column>
          <el-table-column  min-width="100"  prop="key" label="流程标识"></el-table-column>
          <el-table-column min-width="100" prop="name"  label="流程名称"></el-table-column>
          <el-table-column  min-width="70"  prop="rev"         label="版本"></el-table-column>
          <el-table-column min-width="100" prop="deploy_time" :formatter="dateFormatFun" label="部署时间"></el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button   size="mini" type="primary"  @click="handleBpmnView( scope.row.bytes)">查看流程图</el-button>
              <el-button   size="mini" type="warning" v-show="scope.row.is_hang==1" @click="updateBpmnStatus(scope.row,0)">挂起</el-button>
              <el-button   size="mini" type="success" v-show="scope.row.is_hang==0" @click="updateBpmnStatus( scope.row,1)">激活</el-button>
              <el-button   size="mini" type="danger" @click="deleteBpmnInfo(scope.row)">删除</el-button>
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
    <!--上传流程dialog-->
    <el-dialog class="childDialog" v-bind:title="formTitle" :append-to-body="true"   :visible.sync="dialogVisible"
               :modal-append-to-body="false" :close-on-click-modal="false" size="tiny">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="流程名称" prop="name">
          <el-input size="small" v-model="ruleForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="文件" prop="check_file" >
          <el-upload
            class="upload-demo"
            ref="upload"
            :limit="1"
            action=""
            id="file_upload"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传bpmn文件</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">上传流程</el-button>
      </div>
    </el-dialog>
    <!--查看流程dialog-->
    <el-dialog class="bpmnDialog"  :append-to-body="true" v-bind:title="formTitle"  :visible.sync="dialogBpmnViewVisible"
               :fullscreen="true">
      <bpmnView ref="bpmnView" style="height: 100%" ></bpmnView>
      <div slot="footer" class="dialog-footer" style="position: absolute;bottom:10px;right: 10px; z-index: 1000">
      <el-button size="small" type="primary" @click="dialogBpmnViewVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  import paging from '../../common/BasePaging.vue'
  import {dateFormat} from 'assets/js/date.js'
  import bpmnView from './bpmnView.vue'
  export default {
    data(){
      return {
        BpmnTableData: [],//列表数组
        sels: [],//表格选中列
        tabPage: {
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },//分页信息
        loading: true,
        dialogInfo: false,//模态框是否显示标识
        dialogVisible: false,//模态框是否显示
        dialogBpmnViewVisible: false,//流程图模态框是否显示
        ruleForm: {},//新增表单数据
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
      this.getBpmnList();
    },
    components: {
      paging,bpmnView
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
       * 查询流程列表
       */
      async getBpmnList(params){
        let data = {
          page: this.tabPage.currentPage,
          pageSize: this.tabPage.pageSize,
        };
        if (params) {
          data = params;
        }
        try{
          const res = await this.$http.get('/bpmn/BpmnController/queryBpmnList', {params: data});
          if (res.data && res.data.success) {
            this.BpmnTableData = res.data.result.row;
            this.tabPage.totalNum = res.data.result.count[0].count;
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error('查询错误！'+err);
        }
      },
      /**
       * 点击上传按钮
       */
      handleUpload(){
        this.dialogInfo = true;
        this.dialogVisible = true;
        this.formTitle = "部署流程";
        this.$refs.upload.uploadFiles.length=0;
        this.ruleForm.name='';
      },
      /**
       * 点击查看流程按钮
       */
      handleBpmnView(bytes){
        this.dialogInfo = true;
        this.dialogBpmnViewVisible = true;
        this.formTitle = "流程图";
        this.$nextTick(function(){
          this.$refs.bpmnView.importXmL(bytes);
        })

      },
      /**
       * 保存流程
       * @params {String} formName 用于验证
       */
      submitForm(formName){
        const file=this.$refs.upload.uploadFiles;
        //验证是否选择上传的文件
        if(file.length==0){
          this.$message.error('请选择bpmn文件');
          return;
        }
        const fileNameArr = file[0].name.split('.');
        const isBpmn=fileNameArr[fileNameArr.length-1]=='bpmn'
        //验证上传的文件格式是否是bpmn
        if (!isBpmn) {
          this.$message.error('上传文件只能是 bpmn 格式!');
          return ;
        }
        let formData = new FormData();
        let files =$('#file_upload input')[0].files[0];
        formData.append('bpmn', files); //file就是图片或者文件
        const _vm = this;
        const params = _vm.ruleForm;
        $.each(params, function (i, val) {
          if (val !== null&&val !== undefined&&val !=='') {
          formData.append(i, val);
          }
        });
        _vm.$refs[formName].validate(async function (valid) {
          if (valid) {
            try{

              let res = await _vm.$http.post('/bpmn/BpmnController/saveUploadBpmn', formData);
              if (res.data && res.data.success) {
                _vm.dialogInfo = false;
                _vm.$message.success("部署成功");
                _vm.dialogVisible=false;
                _vm.getBpmnList();
              } else {
                _vm.$message.error(res.data.msg);
              }
            }catch(err){
              _vm.$message.error('上传错误!'+err);
            }
          }
        });
      },

      /**
       * 删除流程信息
       * @params {Object} row|rows     行对象
       */
      deleteBpmnInfo(data){
        const _vm = this;
        _vm.$confirm('此操作将永久删除选择流程信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try{
            const res = await _vm.$http.post('/bpmn/BpmnController/deleteBpmnById', {id:data.deployment_id});
            if (res.data && res.data.success) {
              _vm.getBpmnList();
              _vm.$message.success('操作成功');
            }else{
              _vm.$message.error(res.data.msg);
            }
          }catch(err){
            _vm.$message.error('请求错误');
          }
        })
      },
      /**
       * 修改流程状态信息
       * @params {Object} row|rows     行对象
       */
    updateBpmnStatus(data,is_hang){
        const _vm = this;
        let msg;
        if(is_hang==1){
          msg='挂起'
        }else{
          msg='激活'
        }

        _vm.$confirm(`确认要${msg}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try{
            const res = await _vm.$http.post('/bpmn/BpmnController/uploadBpmnStatus', {id:data.deployment_id,is_hang:is_hang});
            if (res.data && res.data.success) {
              _vm.getBpmnList();
              _vm.$message.success(`${msg}成功`);
            }else{
              _vm.$message.error(res.data.msg);
            }
          }catch(err){
            _vm.$message.error(`${msg}错误`+err);
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
      }
    }
  }
</script>

<style >

.bpmnlist input[type="file"]{
  display:none
}
</style>
