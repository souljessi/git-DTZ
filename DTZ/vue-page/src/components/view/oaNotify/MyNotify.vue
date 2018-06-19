<template>
  <div>
    <el-row :gutter="3">
      <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
          <el-form-item label="通告名称" prop="title">
            <el-input v-model="formInline.title" placeholder="通告名称"></el-input>
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
            prop="read_flag"
            label="查阅状态"

          >

          </el-table-column>
          <el-table-column
            prop="create_by"
            label="发送者"
          >

          </el-table-column>
          <!--<el-table-column-->
            <!--prop="info.result.create_date"-->
            <!--label="创建时间"-->

          <!--&gt;-->

          <!--</el-table-column>-->
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
                         @click="showNotify(scope.$index, scope.row)">查看
              </el-button>

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

    <!--dialog-->
    <el-dialog class="childDialog" v-bind:title="formTitle" :visible.sync="dialogInfo" :modal-append-to-body="false"
               :close-on-click-modal="false" width="35%">
      <el-form  label-width="110px">

        <el-form-item label="通知标题:">
          <span>{{detail.title}}</span>

        </el-form-item>
        <el-form-item label="发送人:">
          <span>{{detail.person}}</span>

        </el-form-item>
        <el-form-item label="发送时间:">
          <span>{{detail.time}}</span>

        </el-form-item>
        <el-form-item label="通知内容:">
          <span>{{detail.content}}</span>
        </el-form-item>

        <el-form-item label="附件" v-show="file_down.length>0">
          <el-button v-for="(item,index) of file_down" :key="index" size="small" type="primary">
            {{item.file_name}}
            <a :href="href +'/'+ item.file_path" :download="item.file_name">下载</a>
          </el-button>
        </el-form-item>
        <!--<el-form-item label="备注" prop="remarks">-->
        <!--<el-input type="textarea" v-model="ruleForm.remarks"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  import paging from 'common/BasePaging.vue'
  import {dateFormat} from "../../../assets/js/date";

  export default {
    data() {
      return {
        formInline: {
          title: ''
        },
        oaNotify: [],
        allOaNotify: [],
        screenHeight: document.body.clientHeight - 125,
        tabSize: [24, 24, 24, 24],//栅格用户列表
        tabPage: { //分页信息
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },
        dialogInfo: false,//模态框是否显示标识
        dialogShow: false,
        ruleForm: {},   //新增表单数据
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
        rightTree: [],
        param: {},
        obj: {
          notify: {},
          user_id: []
        },
        file_down:[],
        detail:{
          title: '',
          content: '',
          time: '',
          person:'',

        }
      }
    },
    components: {
      paging
    },
    mounted() {
      this.loginUser = JSON.parse(this.$getStore('userData')).id;
    },
    created() {

      // this.oaNotifyList()
      this.myNotify();


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
      onSearch(formInline) {
        console.log(this.formInline)
          this.myNotify()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        if (formName === 'formInline') {
          this.myNotify();
        }
      },
      handleAdd() {


      },

      /**
       * 我的通知
       */

      async myNotify() {
        let _this = this;
         // _this.loading = true

        let user_id = _this.$getUserData('id');

        let Data = {
          page: this.tabPage.currentPage,
          pageSize: this.tabPage.pageSize,
          user_id: user_id,
          title: this.formInline.title
        };
        try{

          const ress = await _this.$http.get('/oa/OaNotifyController/userList');

          if (ress.data && ress.data.success) {
            _this.users = ress.data.result
          }
          const res = await this.$http.get('oa/OaNotifyController/getNotifyList',{params:Data});
          const counts = await this.$http.get('oa/OaNotifyController/getNotifyListCount',{params:Data});

          console.log('279',counts);


          let DATA = res.data.result;
          this.tabPage.totalNum = counts.data.result.length;
            for (let item of DATA) {
              if(item){
                item.create_date = dateFormat(new Date(item.create_date), 'yyyy-MM-dd hh:mm:ss');
                item.update_date = dateFormat(new Date(item.update_date), 'yyyy-MM-dd hh:mm:ss');


                item.remarks = item.remarks.slice(0,10);
                item.read_flag = _this.flagChange(item.read_flag);

                item.create_by = _this.idChangeName(item.create_by);
                item.update_by = _this.idChangeName(item.update_by)
              }
            }
          _this.loading = false
          setTimeout(function(){
                _this.oaNotify =  DATA


            console.log('320',_this.oaNotify )
              },500);

        }catch(error){
          console.log('149', error)
          this.$message.error('请求错误')
        }
      },
      compare(property){
        return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return new Date(value1) - new Date(value2);
        }
      },
      idChangeName(ID){
        let _this = this;
        for(let item of _this.users){
          if(ID === item.id){
            return item.realname
          }
        }
      },

      async showNotify(index,row) {
        let _this = this;
        this.dialogInfo = true;
        this.formTitle = "详情";
        this.detail.title = row.title;
        this.detail.content = row.content;
        this.detail.time = row.create_date;
        this.detail.person = row.create_by;
        let param = {
          id: row.id,
          user_id: _this.$getUserData('id')
        }
        try {
          let res_file = await _this.$http.post('/oa/OaNotifyController/getNotifyDetails',{params: param});
          let res = await _this.$http.post('/oa/OaNotifyController/updateOaNotify', param);
          if (res.data && res.data.success) {
            _this.myNotify();

          }

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

              res_file.data.result.res.files = fileArr;
              _this.file_down = fileArr
            }

          }

        } catch (error) {
          _this.$message.warning('请求错误')

        }

      },

      // 删除按钮
      async handleDelete(index, row) {
        console.log('359', row)
        let _this = this

        _this.$confirm('此操作将永久删除选择用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let param = {
            id: row.id
          };

          try {
            let res = await _this.$http.post('/oa/OaNotifyController/delOaNotify', param)
            if (res.data && res.data.success) {
              _this.$message.success('删除成功');
              _this.myNotify();

            }

          } catch (error) {
            _this.$message.warning('请求错误')

          }
        })

      },

      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange(val) {
        this.tabPage.pageSize = val;
        this.myNotify();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        this.myNotify();
      },
      flagChange(flag){
        if(flag === 0){
          return '未读'
        }else if(flag === 1){
          return '已读'

        }

      },


    }
  }
</script>

<style scoped>

</style>

