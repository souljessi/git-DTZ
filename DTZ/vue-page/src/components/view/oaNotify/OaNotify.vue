<template>
  <div>

    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="通知列表" name="first">
        <span @click="oaNotifyList()" slot="label"> 通知列表</span>
        <el-row :gutter="3">
          <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
              <el-form-item label="关键字搜索" prop="title">
                <el-input v-model="formInline.title" placeholder="请输入关键字"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch(formInline)">查询</el-button>
                <el-button type="info" icon="el-icon-refresh" @click="resetForm('formInline')">重置</el-button>
              </el-form-item>

            </el-form>

            <el-table :data="oaNotify" :highlight-current-row="true" v-loading="loading" :height="screenHeight-110">
              <el-table-column
                prop="title"
                label="标题"

              >

              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
              >

              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"

              >

              </el-table-column>
              <el-table-column
                prop="create_by"
                label="创建者"
              >

              </el-table-column>
              <el-table-column
                prop="create_date"
                label="创建时间"

              >

              </el-table-column>
              <el-table-column
                prop="update_by"
                label="更新者"
              >

              </el-table-column>
              <el-table-column
                prop="update_date"
                label="更新时间"
              >

              </el-table-column>
              <!--<el-table-column-->
              <!--prop="remarks"-->
              <!--label="备注"-->
              <!--&gt;-->

              <!--</el-table-column>-->
              <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                  <el-button type="primary"
                             @click="editNotify(scope.$index, scope.row)">查看
                  </el-button>
                  <!--<el-button-->

                  <!--type="primary"-->
                  <!--@click="handleEdit(scope.$index, scope.row)">编辑-->
                  <!--</el-button>-->
                  <el-button
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    :disabled="scope.row.id===''">删除
                  </el-button>
                </template>
              </el-table-column>

            </el-table>

            <!--  分页  -->
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

      <el-tab-pane :label='labelName' name="second" style="width: 60%;margin-left: 80px;">

        <el-form :model="ruleForm" :rules="this.$validateRule" ref="ruleForm" label-width="110px">

          <el-form-item label="通知标题" prop="title">
            <el-input :readonly=read_only v-model="ruleForm.title"></el-input>

          </el-form-item>
          <el-form-item label="通知内容" prop="content">
            <el-input :readonly=read_only type="textarea" v-model="ruleForm.content"></el-input>


          </el-form-item>
          <el-form-item label="通知类型" prop="type">
            <el-radio-group v-model="ruleForm.type" v-show="!read_only">
              <el-radio v-for="item of notifyType" :label="item.label" :name="item.label" :key="item.value">{{item.label}}</el-radio>

            </el-radio-group>


            <el-radio-group v-model="ruleForm.type" v-show="read_only">
              <el-radio  :label="ruleForm.type" :name="ruleForm.type">{{ruleForm.type}}</el-radio>

            </el-radio-group>




          </el-form-item>

          <el-form-item label="附件" prop="check_file" v-show="labelName=== '新增通知'">
            <el-upload
              class="upload-demo"
              :disabled=read_only
              ref="upload"
              action=""
              :multiple="true"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="removeHandleChange"
              id="file_upload"
              :auto-upload="false">
              <el-button slot="trigger"  size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>

          <el-form-item label="附件" v-show="labelName==='通知查看' && file_down.length>0">
            <el-button v-for="(item,index) of file_down" :key="index" size="small" type="primary">
              {{item.file_name}}
              <a :href="href +'/'+ item.file_path" :download="item.file_name">下载</a>

            </el-button>

          </el-form-item>


          <el-form-item label="接收人">
            <div class="tagClass" @click="chooseUser" v-show="labelName==='新增通知'">
              <el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type" v-for="item in userLists"
                      :key="item.id">
                {{item.name}}
              </el-tag>
            </div>


            <el-table :data="editDetail" :highlight-current-row="true" v-show="labelName ==='通知查看'" v-loading="loading"
                      :height="screenHeight-290">
              <el-table-column
                prop="user_id"
                label="接收人"

              >
              </el-table-column>
              <el-table-column
                prop="read_flag"
                label="阅读状态"
              >

              </el-table-column>
              <el-table-column
                prop="read_date"
                label="阅读时间"

              >
              </el-table-column>

            </el-table>

            <!--  分页  -->
            <div style=" position: absolute;bottom: 2px;width: 100%;" v-show="labelName==='通知查看'">
              <el-pagination small @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
                             :currentPage="tabPage1.currentPage"
                             :pageSizes="tabPage1.pageSizes" :pageSize="tabPage1.pageSize"
                             :total="tabPage1.totalNum"
                             layout="prev, pager, next">
              </el-pagination>

              <div>
                已查阅: {{afterRead.length}} 未查阅: {{beforeRead.length}} 总共: {{totalLength}}
              </div>

            </div>

          </el-form-item>

        </el-form>
        <div style="text-align: center">
          <el-button v-show="labelName==='新增通知'" type="primary" @click="submitForm('ruleForm')">发送</el-button>
          <el-button v-show="labelName==='新增通知'" type="info" @click="cancelSave('rileForm')">取消</el-button>
          <el-button v-show="labelName==='通知查看'" type="info" @click="cancelBack('rileForm')">返回</el-button>

        </div>

      </el-tab-pane>

    </el-tabs>

    <el-dialog class="childDialog" :visible.sync="dialogShow" :model-append-to-body="false"
               :close-on-click-modal="false" width="35%">
      <div>
        <el-row :gutter="20" class="selectDepart">
          <el-col :span="24">
            <p class="departTitle">选择接收部门与人员</p>
            <div class="surround">
              <!--<el-input placeholder="输入关键字进行过滤" v-model="filterText">-->
              <!--</el-input>-->
              <el-tree ref="treeChoose" :default-expand-all="expand" style="height: 300px;overflow: auto;" show-checkbox
                       class="filter-tree" :data="TreeData" node-key="id" :render-content="renderContent"
                       :props="defaultProps" @check-change="treeChange" :filter-node-method="filterNode">
              </el-tree>
            </div>
          </el-col>

        </el-row>

        <div style="text-align: right;margin-top: 10px;">
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(0)">取 消</el-button>
        <el-button type="primary" @click="closeDialog(1)">确 定</el-button>
      </span>
        </div>
      </div>


    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import paging from 'common/BasePaging.vue'
  import {dateFormat} from "../../../assets/js/date";
  import {
    getDicData,
    getCenterPoint,
    formatSeconds
  } from "assets/js/commonManage.js";

  export default {
    data() {
      return {
        activeName: 'first',
        formInline: {
          title: ''
        },
        labelName: '新增通知',
        oaNotify: [],
        screenHeight: document.body.clientHeight - 125,
        tabSize: [24, 24, 24, 24],//栅格用户列表
        tabPage: { //分页信息
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },
        tabPage1: { //分页信息
          currentPage: 1,
          pageSize: 7,
          pageSizes: [10, 20, 30, 50]
        },
        dialogInfo: false,//模态框是否显示标识
        dialogShow: false,
        ruleForm: {//新增表单数据
          type: '',
          title: '',
          content: '',
          files: '',
          remarks: ''
        },
        formTitle: '通知通告',//新增编辑模态框title

        file: {}, // 文件流地址
        loginUser: '',

        users: [], //用户
        newdata: [],
        loading: false,
        rightCheckList: [],
        filterText: '',
        TreeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        parmentList: [],
        userList: [],
        userLists: [],
        rightTree: [],
        param: {},
        obj: {
          notify: {},
          user_id: []
        },
        editDetail: [],
        beforeRead: [],
        afterRead: [],

        termData: {},
        fileList: [],
        notifyType:[],
        totalLength: '',
        read_only: false,
        file_down:[],
        href:`http://${this.$webconfig.serverIp}`,

      }
    },
    components: {
      paging
    },

    mounted() {
      this.oaNotifyList();
    },
    created() {
      this.loginUser = JSON.parse(this.$getStore('userData')).id;
      this.getPlOrgListToTree(this.param);
      this.notifyType = getDicData('tzlx');
      this.orgListToTree();
      this.read_only = false
    },

    props: {
      dialogVisible: {},
      title: {},
      data: {},
      type: {},
      expand: {
        type: Boolean,
        default: false
      },
      nodeKey: {
        type: Boolean,
        default: false
      },
      disabledOptions: {      //禁用选型
        type: Array,
        default: () => []         //初始化选中值 默认为id集合
      },
      remarkOptions: {       //标注选型
        type: Array,
        default: () => []         //初始化选中值 默认为id集合
      }
    },
    methods: {
      /**获取用户**/
      async getUsers() {
        let _this = this;
        try {
          const res = await _this.$http.get('/oa/OaNotifyController/userList');

          if (res.data && res.data.success) {
            _this.users = res.data.result
          }

        } catch (error) {
          _this.$message.warning('请求错误')

        }

      },

      idChangeName(ID) {
        let _this = this;
        if(_this.users.length > 0){
          for (let item of _this.users) {
            if (ID === item.id) {
              return item.realname
            }
          }
        }

      },
      flagChange(flag) {
        if (flag === 0) {
          return '未读'
        } else if (flag === 1) {
          return '已读'

        }
      },

      statusChange(status) {
        if (status === '0') {
          return '未发布'

        } else if (status === '1') {
          return '发布'

        }

      },
      typeChange(type) {
        let _this = this
        for(let item of _this.notifyType){
          if(type === item.value){
            return item.label

          }
        }
      },
      typeChangeId(type) {
        let _this = this
        for(let item of _this.notifyType){
          if(type === item.label){
            return item.value

          }
        }
      },
      onSearch(formInline) {
        let _this = this;
        _this.oaNotifyList()

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        if (formName === 'formInline') {
          this.oaNotifyList();
        }

      },
      handleAdd() {
        this.dialogInfo = true;
        this.formTitle = "新增通知通告";
      },

      //获取通告列表
      async oaNotifyList() {
        this.fileList = [];
        this.read_only = false;



        let DATA = {
          page: this.tabPage.currentPage,
          pageSize: this.tabPage.pageSize,
          title: this.formInline.title
        };

        let _this = this;
        _this.loading = true;
        _this.labelName = '新增通知';
        _this.ruleForm.type = '';
        _this.ruleForm.title = '';
        _this.ruleForm.files = '';
        _this.ruleForm.content = '';
        _this.ruleForm.remarks = '';
        _this.userList = [];

        try {
          let  ress = await _this.$http.get('/oa/OaNotifyController/userList');

          if (ress.data && ress.data.success) {
            _this.users = ress.data.result
          }
          let res = await _this.$http.post('/oa/OaNotifyController/getOaNotifyList', DATA);

          if (res.data && res.data.success) {
            let data = res.data.result.rows;


            for (let item of data) {
              item.create_by = _this.idChangeName(item.create_by);
              item.update_by = _this.idChangeName(item.update_by);
              item.create_date = dateFormat(new Date(item.create_date), 'yyyy-MM-dd hh:mm:ss');
              item.update_date = dateFormat(new Date(item.update_date), 'yyyy-MM-dd hh:mm:ss');
              item.type = _this.typeChange(item.type);
              item.status = _this.statusChange(item.status);


            }
            // _this.oldEventList = arr.sort(_this.compare('create_date')).reverse()//按事件降序排列

            _this.tabPage.totalNum = res.data.result.count;

            setTimeout(function () {
              _this.oaNotify = data
            }, 500);

            setTimeout(function () {
              _this.loading = false
            }, 500);

          } else {
            _this.$message.error(res.data.msg);
            setTimeout(function () {
              _this.loading = false
            }, 500);
          }
        } catch (error) {
          _this.$message.error('请求错误');
          setTimeout(function () {
            _this.loading = false
          }, 1000);

        }

      },

      compare(property) {
        return function (a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return new Date(value1) - new Date(value2);
        }
      },

      /** 接收人选择 **/
      chooseUser(index, row) {
        let _this = this;
        _this.dialogShow = true;
      },
      async editNotify(index, row) {
        let _this = this;
        _this.file_down = [];
        _this.activeName = 'second';
        _this.labelName = '通知查看';
        _this.ruleForm = row;
        _this.beforeRead = [];
        _this.afterRead = [];
        _this.editDetail = [];
        _this.read_only = true;
        let Data = {
          page: this.tabPage1.currentPage,
          pageSize: this.tabPage1.pageSize,
          oa_notify_id: row.id
        };
        _this.termData = Data;
        let dataId = {
          oa_notify_id: row.id
        };
        let param ={
          id: row.id,
          userId:  _this.$getUserData('id')
        };
        console.log('553',param);

        try {
          let resZero = await _this.$http.post('/oa/OaNotifyController/allNotifyIdOaNotifyList', {params: dataId});
          let res = await _this.$http.post('/oa/OaNotifyController/notifyIdOaNotifyList', {params: Data});

          let res_file = await _this.$http.post('/oa/OaNotifyController/getNotifyDetails',{params: param});

          if(res_file.data.success){
            if (res_file.data.result.result.length > 0) {
              let fileArr = [];
              let res = res_file.data.result;
              for (let item of res.result) {

                let file = {
                  file_path: item.realpath,
                  file_name: item.file_name,
                };
                fileArr.push(file)
              }

              res_file.data.result.res.files = fileArr
              _this.file_down = fileArr
            }



          }

          if (res.data && res.data.success) {

            let notify_record = res.data.result.rows;
            _this.tabPage1.totalNum = res.data.result.count;


            for (let item of notify_record) {
              item.user_id = _this.idChangeName(item.user_id);
              item.read_flag = _this.flagChange(item.read_flag);
              if(item.read_date){
                item.read_date  = dateFormat(new Date(item.read_date), 'yyyy-MM-dd hh:mm:ss');
              }

            }

            _this.editDetail = notify_record

          }
          this.totalLength = resZero.data.result.length;
          if (resZero.data && resZero.data.success) {
            for (let item of resZero.data.result) {
              if (item.read_flag === 0) {
                _this.beforeRead.push(item)

              } else if (item.read_flag === 1) {
                _this.afterRead.push(item)

              }

            }

          }


        } catch (error) {

        }
      },


      async nextSearch() {
        let _this = this;
        let data = {
          page: this.tabPage1.currentPage,
          pageSize: this.tabPage1.pageSize,
          oa_notify_id: _this.termData.oa_notify_id
        }

        let res = await _this.$http.post('/oa/OaNotifyController/notifyIdOaNotifyList', {params: data});


        if (res.data && res.data.success) {

          let notify_record = res.data.result.rows;
          _this.tabPage1.totalNum = res.data.result.count;

          for (let item of notify_record) {
            item.user_id = _this.idChangeName(item.user_id);
            item.read_flag = _this.flagChange(item.read_flag);

          }

          _this.editDetail = notify_record


        }
      },

      // 删除按钮
      async handleDelete(index, row) {

        let _this = this

        _this.$confirm('此操作将永久删除该条通知, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let param = {
            id: row.id
          }

          try {
            let res = await _this.$http.post('/oa/OaNotifyController/delOaNotify', param)
            if (res.data && res.data.success) {
              _this.$message.success('删除成功');
              _this.oaNotifyList();

            }

          } catch (error) {
            _this.$message.warning('请求错误')

          }
        })

      },

      /**
       * 文件选择change事件
       */
      onFileChange(e) {
        let _this = this;

        let files = e.target.files || e.dataTransfer.files
        for (let file of files) {
          let reader = new FileReader();
          reader.onload = function (e) {
            _this.file = {src: e.target.result}

          }
          reader.readAsDataURL(file)
        }

      },

      handleChange(file,fileList){
        this.fileList = fileList

      },
      removeHandleChange(file,fileList){
        this.fileList = fileList
      },

      /**
       * 提交表单数据
       *
       */
      submitForm(formName) {
        let _this = this;
        let params = _this.ruleForm;

        if (!params.create_by) {
          params.create_by = _this.loginUser;

        }
        if (!params.update_by) {
          params.update_by = _this.loginUser;
        }
        // if (!params.create_date) {
          params.create_date = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');

        // }

        params.update_date = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        params.status = '1';
        params.type = this.typeChangeId(params.type);
        // params.remarks = params.content.slice(140)
        if (params.content.length > 140) {

          params.remarks = params.content.slice(140)
        } else {
          params.remarks = params.content
        }
        this.$refs[formName].validate(async (valid) => {
          if (valid) {

            let formData = new FormData();

            // let file = $('#file_upload input')[0].files;
            let file = _this.fileList;

            try {
              let res = await _this.$http.post('/oa/OaNotifyController/addOaNotify', params);
              if (res.data && res.data.success) {
                res.data.result.create_date = dateFormat(new Date(res.data.result.create_date), 'yyyy-MM-dd hh:mm:ss');
                res.data.result.update_date = dateFormat(new Date(res.data.result.update_date), 'yyyy-MM-dd hh:mm:ss');

                this.obj.notify = res.data.result;
                $.each(res.data.result, function (i, val) {
                  if (val !== null) {
                    formData.append(i, val)
                  }
                })

                // let result = await _this.$http.post('/oa/OaNotifyController/saveFile', formData);
                // console.log(result.data.msg)
                for (let i = 0; i < file.length; i++) {

                  formData.append('file', file[i].raw);  //file就是文件
                }
                let result = await _this.$http.post('/oa/OaNotifyController/saveFile', formData);
                console.log(result.data.msg)


                if (this.userList.length > 0) {
                  this.obj.user_id = [];
                  for (let item of this.userList) {
                    this.obj.user_id.push(item.id)
                  }

                  try{
                    let res =await this.$http.post('/oa/OaNotifyController/sendOaNotify', this.obj);
                    if (res.data.success) {
                      _this.$message.success('发送成功');
                      _this.activeName = 'first';
                      _this.ruleForm.type = '';
                      _this.ruleForm.title = '';
                      _this.ruleForm.files = '';
                      _this.ruleForm.content = '';
                      _this.ruleForm.remarks = '';
                      _this.userList = [];
                      _this.userLists = [];
                      _this.orgListToTree();
                      _this.getPlOrgListToTree(this.param);
                    }
                  }catch(err){
                    console.log(err)
                    _this.dialogShow = false;
                    _this.$message.error('请求错误', err);


                  }

                }
                _this.oaNotifyList();

              } else {
                _this.$message.warning(res.data.msg);
              }

            } catch (error) {
              console.log('417', error)

            }

          } else {
            return false;
          }
        });

      },
      cancelBack(formName) {
        let _this = this;
        _this.userLists = [];
        _this.userList = [];
        _this.orgListToTree();
        _this.getPlOrgListToTree(this.param);
        _this.activeName = 'first';
        _this.labelName = '新增通知';
        _this.oaNotifyList()

      },

      cancelSave(formName) {
        let _this = this;
        _this.ruleForm.type = '';
        _this.ruleForm.title = '';
        _this.ruleForm.files = '';
        _this.ruleForm.content = '';
        _this.ruleForm.remarks = '';
        _this.activeName = 'first';
        _this.labelName = '新增通知';

        _this.userLists = [];
        _this.userList = [];
        _this.orgListToTree();
        _this.getPlOrgListToTree(this.param);

      },

      /**查询组织结构信息**/
      async orgListToTree() {
        try {
          const _this = this;
          const orgList = await _this.$http.get('/oa/OaNotifyController/orgAndUser')
          console.log('274', orgList)

        } catch (error) {
          console.log('查询失败')

        }

      },

      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange(val) {
        this.tabPage.pageSize = val;
        this.oaNotifyList();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        this.oaNotifyList();
      },

      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange1(val) {
        this.tabPage1.pageSize = val;
        this.nextSearch();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange1(val) {
        this.tabPage1.currentPage = val;
        this.nextSearch();
      },

      /**
       * Tree树节点显示区分（组织机构、警员）
       *@param h createlement 方法
       *@param node   节点
       */
      renderContent(h, { node, data, store }) {
        if (data.type=== 'depart') {
          return (
            <span>
            <base-icon icon="bumen" style='color:rgba(32, 160, 255, 0.52)'/>
            <span class="el-tree-node__label" style='margin-left:5px;'>{data.name}</span>
          </span>
        )
        } else {
          return (<span>
            <span style={{
            fontSize: '12px',
              width: '24px',
              height: '24px',
              'line-height': '24px',
              'text-align': 'center',
              display: 'inline-block',
              background: '#20a0ff',
              borderRadius: '15px',
              color: 'rgb(255, 255, 255)',
              margin: ' 0px 5px 0px 0px'
          }} >{data.name.substring(0, 1)}</span>
          <span class="el-tree-node__label">{data.name}</span>
          </span>)

        }

      },
      /**
       * 关闭dialog
       * @value 关闭状态 0 取消 1 确定
       */
      closeDialog(value) {

        if (value === 0) {

          this.userLists = []
          this.userList = []
          this.orgListToTree();
          this.getPlOrgListToTree(this.param);
          this.dialogShow = false


        } else if (value === 1) {
          let _this = this;
          _this.userLists = _this.userList;
          _this.dialogShow = false

        }

      },

      /**
       *查询组织结构信息(树)
       */
      async getPlOrgListToTree(parms) {

        try {
          const _self = this;
          let parm = {};
          if (parms) {
            parm = parms
          }

          const callBackData = await _self.$http.get('/oa/OaNotifyController/orgAndUser', {params: parm});

          if (callBackData.data.success) {   //查询成功
            const result = callBackData.data.result;

            _self.TreeData = _self.toTreeData(result);
            // _self.$nextTick(function() {
            //   _self.$refs.treeChoose.setCheckedNodes(_self.data.policeList);
            // });


          } else {

            _self.$message({
              message: callBackData.data.msg,
              type: 'warning'
            });
          }
        } catch (err) {
        }

      },

      /**
       * 格式转树状结构
       * @param   {Array}      原数据
       * @param   {String}    id的字符串
       * @param   {String}    父id的字符串
       * @param   {String}    children的字符串
       * @return  {Array}     数组
       */
      transData(a, idStr, pidStr, chindrenStr) {
        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
        for (; i < len; i++) {
          hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
          var aVal = a[j], hashVP = hash[aVal[pid]];
          if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
          } else {
            r.push(aVal);
          }
        }
        return r;
      },
      /**
       * 组合组织机构信息构建树结构信息
       *@param {Object} data 组织机构信息
       */
      toTreeData(data) {
        var pos = {};
        var tree = [];
        var i = 0;


        while (data.length != 0) {

          if (data[i].parent_id === 0) {

            var children = [];
            if (data[i].sys_users.length > 0) {
              for (var item of data[i].sys_users) {
                children.push({
                  id: item.id,
                  name: item.realname,
                  phone: item.phone,
                  type: 'user',
                  //                  parentname: data[i].org_name,
                  parent_id: data[i].org_id,
                })

              }
            }
            tree.push({
              id: data[i].id,
              org_code: data[i].org_code,
              name: data[i].org_name,
              org_type: data[i].org_type,
              parent_id: data[i].parent_id,
              description: data[i].description,
              children: children,
              type: 'depart',

              // disabled: true,
            });
            pos[data[i].id] = [tree.length - 1];
            data.splice(i, 1);
            i--;
          } else {
            var posArr = pos[data[i].parent_id];
            if (posArr != undefined) {
              var obj = tree[posArr[0]];
              for (var j = 1; j < posArr.length; j++) {
                obj = obj.children[posArr[j]];
              }
              var children = [];
              if (data[i].sys_users.length > 0) {
                for (var item of data[i].sys_users) {
                  children.push({
                    id: item.id,
                    name: item.realname,
                    phone: item.phone,
                    parent_id: data[i].parent_id,
                    //                    parentname: data[i].org_name,
                    type: 'user'
                  })
                }
              }

              obj.children.push({
                id: data[i].id,
                org_code: data[i].org_code,
                name: data[i].org_name,
                org_type: data[i].org_type,
                parent_id: data[i].parent_id,
                type: 'org',
                description: data[i].description,
                children: children,
              });
              pos[data[i].id] = posArr.concat([obj.children.length - 1]);
              data.splice(i, 1);
              i--;
            }
          }
          i++;
          if (i > data.length - 1) {
            i = 0;
          }
        }
        return tree;
      },
      /**
       * 判断数组是否存在某个元素
       * @param {Array} arr 数组集合
       * @param {Number,String} obj 查询元素
       */
      contains(arr, obj) {

        var i = arr.length;

        // if (i != 0) {
        while (i--) {
          if (arr[i].id === obj) {
            return true;
          }
        }
        // }
        return false;
      },
      containsType(arr, obj) {
        var i = arr.length;
        if (i != 0) {
          while (i--) {
            if (arr[i].id === obj) {
              return arr[i].disabledType;
            }
          }
        }

        return '禁用'
      },
      remarkType(arr, obj) {
        // console.warn(arr)
        var i = arr.length;
        if (i != 0) {
          while (i--) {
            if (arr[i].id === obj) {
              return arr[i].remarkType;
            }
          }
        }
        return '警告'
      },

      /**
       * 过滤tree数据
       * @param value
       * @param data
       * @returns {boolean}
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      /**
       *tree点击事件
       * @param data
       * @param isCheck
       * @param childerCheck
       */
      treeChange(data, isCheck, childerCheck) {
        this.userList = [];
        let nodeData = this.$refs.treeChoose.getCheckedNodes();
        let newdata = JSON.parse(JSON.stringify(nodeData));
        for (let item of newdata) {
          item.children = [];
        }
        for (let item of nodeData) {
           if (item.type === 'user') {
          this.userList.push(item)
           }
        }
        this.rightTree = this.transData(newdata, 'id', 'parentid', 'children')
      },

      /**
       * 移除节点
       * @param data
       */
      removeNode(data) {
        this.$refs.treeChoose.setChecked(data, false, true)
      },

    }
  }
</script>

<style lang="scss">
  .tagClass {
    height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 5px;
    line-height: 28px;
    width: 200px;
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
