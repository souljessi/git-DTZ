<template>
  <div>
    <el-form>
      <!--<el-form-item>-->
      <!--<el-select v-model="eventParams.parent_name" placeholder="全部事件" @change="queryChildren" style="width: 265px;">-->
      <!--<el-option v-for="item in parentEventData" :key="item.group_code" :label="item.group_name" :value="item.id"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item style="margin-bottom: 5px;">
        <el-select v-model="eventParams.parent_name" placeholder="事件类型" style="width: 150px;">
          <el-option v-for="item in parentEventData" :key="item.group_code" :label="item.group_name"
                     :value="item.group_name"></el-option>

        </el-select>

        <el-select v-model="eventParams.source" placeholder="事件来源" style="width: 150px;">
          <el-option v-for="item of eventSourceType" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>

        <el-date-picker v-model="eventParams.start_date" value-format="yyyy-MM-dd" size="mini" type="date"
                        placeholder="开始日期" style="width: 150px"></el-date-picker>

        <el-date-picker v-model="eventParams.end_date" value-format="yyyy-MM-dd" size="mini" type="date"
                        placeholder="结束日期" style="width: 150px"></el-date-picker>

        <el-input v-model="eventParams.remarks" clearable placeholder="关键字搜索" style="width:140px"></el-input>

      </el-form-item>

      <el-form-item style="margin-bottom: 5px;">

        <el-button type="primary" icon="el-icon-search" @click="onEventSearch()"
                   style="height: 28px;border-radius: 5px;padding: 0px 10px">查询
        </el-button>
        <!--<el-button type="success" icon="el-icon-plus" @click="add_event()"-->
                   <!--style="height: 28px;border-radius: 5px;padding: 0px 10px">新增-->
        <!--</el-button>-->
        <el-button type="info" icon="el-icon-refresh" @click="refresh()"
                   style="height: 28px;border-radius: 5px;padding: 0px 10px">刷新
        </el-button>

        <el-button type="danger" icon="el-icon-delete" @click="bit_delete()"
                   style="height: 28px;border-radius: 5px;padding: 0px 10px">批量删除
        </el-button>

      </el-form-item>


      <!--<el-form-item required style="margin-bottom: 5px;">-->
      <!--<el-col :span="12">-->
      <!--<el-form-item prop="eventParams.start_date" style="margin-bottom: 5px;">-->
      <!--<el-date-picker v-model="eventParams.start_date" value-format="yyyy-MM-dd" size="mini" type="date"-->
      <!--placeholder="开始日期" style="width: 130px"></el-date-picker>-->
      <!--</el-form-item>-->
      <!--</el-col>-->

      <!--<el-col :span="12">-->
      <!--<el-form-item prop="eventParams.end_date" style="margin-bottom: 5px;">-->
      <!--<el-date-picker v-model="eventParams.end_date" value-format="yyyy-MM-dd" size="mini" type="date"-->
      <!--placeholder="结束日期" style="width: 130px"></el-date-picker>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-form-item>-->

      <!--<el-form-item prop="eventParams.ObjName" style="margin-bottom: 5px;">-->
      <!--<el-input v-model="eventParams.remarks" clearable placeholder="关键字搜索" style="width:120px"></el-input>-->
      <!--<el-button type="primary" icon="el-icon-search" @click="onEventSearch()"-->
      <!--style="height: 28px;border-radius: 5px;padding: 0px 10px">查询-->
      <!--</el-button>-->
      <!--<el-button type="success" icon="el-icon-refresh" @click="refresh()"-->
      <!--style="height: 28px;border-radius: 5px;padding: 0px 10px">刷新-->
      <!--</el-button>-->
      <!--</el-form-item>-->

    </el-form>

    <el-table :data="all_event_list"
              :highlight-current-row="true"
              v-loading="loading"
              :height="screenHeight-130"
              @selection-change="handleSelectionChange"

    >

      <el-table-column type="selection" >
      </el-table-column>
      <el-table-column
        prop="parent_name"
        label="事件大类"

      >

      </el-table-column>
      <el-table-column
        prop="sub_name"
        label="事件小类"
      >

      </el-table-column>
      <!--<el-table-column-->
      <!--prop="ObjCode"-->
      <!--label="事件代码"-->

      <!--&gt;-->

      <!--</el-table-column>-->
      <el-table-column
        prop="ObjPosition"
        label="事发位置"
      >

      </el-table-column>
      <el-table-column
        prop="create_date"
        label="上报时间"

      >

      </el-table-column>
      <el-table-column
        prop="create_by"
        label="上报者"
      >

      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
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
                     @click="showDetails(scope.$index, scope.row)">查看
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


    <!--dialog-->
    <el-dialog class="childDialog" v-bind:title="formTitle" :visible.sync="dialogInfo" :modal-append-to-body="false"
               :close-on-click-modal="false" width="35%">
      <el-form label-width="110px">

        <el-form-item label="事件代码:">
          <span>{{detail.ObjCode !== '' ? detail.ObjCode : '无'}}</span>

        </el-form-item>
        <el-form-item label="行政区域代码:">
          <span>{{detail.area_code !==''? detail.area_code : '无'}}</span>

        </el-form-item>
        <el-form-item label="事件大类:">
          <span>{{detail.parent_name}}</span>

        </el-form-item>
        <el-form-item label="事件小类:">
          <span>{{detail.sub_name}}</span>

        </el-form-item>
        <el-form-item label="事件来源:">
          <span>{{detail.source}}</span>

        </el-form-item>

        <el-form-item label="事发位置:">
          <span>{{detail.ObjPosition}}</span>

        </el-form-item>


        <el-form-item label="上报人:">
          <span>{{detail.create_by}}</span>

        </el-form-item>
        <el-form-item label="上报时间:">
          <span>{{detail.create_date}}</span>
        </el-form-item>
        <el-form-item label="描述:">
          <span>{{detail.remarks}}</span>
        </el-form-item>


        <el-form-item label="事件图片">
          <div class="case-desc-image">
            <base-img :src="showImg"></base-img>
          </div>
        </el-form-item>


        <!--<el-form-item label="备注" prop="remarks">-->
        <!--<el-input type="textarea" v-model="ruleForm.remarks"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
    </el-dialog>

    <el-dialog class="childDialog" v-bind:title="formTitle" :visible.sync="dialogAdd" :modal-append-to-body="false"
               :close-on-click-model="false" >

      <el-form ref="form" :rules="rules" :model="form" label-width="80px">

        <el-form-item label="事件分类" prop="type">
          <el-select v-model="form.EventType" placeholder="事件分类" style="width: 100%;">
            <el-option label="事件" value="1"></el-option>
            <el-option label="部件" value="2"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="大类" >
          <el-select v-model="form.parent_name" placeholder="大类" @change="getChildren" filterable style="width: 100%;">
            <el-option v-for="item of parentEventData" :key="item.group_code" :label="item.group_name"
                       :value="item.group_code"></el-option>

          </el-select>

        </el-form-item>

        <el-form-item label="小类" >

          <el-select v-model="form.sub_name" placeholder="小类" filterable style="width: 100%;">
            <el-option v-for="item of childrenEventData" :key="item.group_code" :label="item.group_name"
                       :value="item.group_code"></el-option>
          </el-select>


        </el-form-item>


        <el-form-item label="事发地点" prop="ObjPosition">
          <base-baidu-search v-model="form.ObjPosition" @getPoint='getPosition'></base-baidu-search>
          <!-- <el-input v-model="workForm.remark" type="textarea" :rows="2"></el-input> -->
        </el-form-item>

        <el-form-item label="问题描述" prop="remarks">
          <el-input type="textarea" v-model="form.remarks" style="min-height: 66px;font-size: 14px"
                    :readonly=false></el-input>
          <!--<span v-text="form.remarks" contentEditable="true"></span>-->
          <!--<div v-text="form.remarks" contenteditable="plaintext-only" style="border: 1px;"></div>-->

        </el-form-item>


        <el-form-item label="附件" prop="check_file">
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :multiple="true"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="removeHandleChange"
            id="file_upload"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
          </el-upload>
        </el-form-item>
        <!--<el-form-item label="语音">-->
        <!--<audio controls="controls"></audio>-->
        <!--</el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="submitEvent('form')">保存</el-button>
          <el-button type="primary" @click="resetFields('form')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

  </div>
</template>

<script>
  import paging from 'common/BasePaging.vue'
  import {dateFormat} from 'assets/js/date.js'
  import {getDicData} from "assets/js/commonManage.js"
  import BaseImg from "common/BaseImg";
  import * as validateFun from "assets/js/validateFun";
  import BaseBaiduSearch from "common/BaseBaiduSearch";

  export default {
    data() {

      return {
        formInline: {
          title: ''
        },
        screenHeight: document.body.clientHeight - 125,
        ruleForm: {},//新增表单数据
        isFlag: [],

        dialogInfo: false,
        formTitle: '事件详情',
        tabSize: [24, 24, 24, 24],//栅格用户列表
        tabPage: { //分页信息
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },
        eventParams: {
          parent_name: '',
          sub_name: '',
          source: '',
          start_date: '',
          end_date: '',
          ObjName: '',
          remarks: '',
        },
        all_event_list: [],
        loading: false,
        dialogInfo: false,
        dialogAdd: false,
        parentEventData: [],
        eventSourceType: [],
        eventStateType: [],
        users: [],
        detail: {},
        eventPic: [],
        del_data:[],//选中项列表数据
        form: {
          type: 1, //默认事件
          parent_name: "", //大类
          sub_name: "", //小类
          ObjPosition: "",
          remarks: ""
        }, //工单
        childrenEventData: [],
        event_group_data:[],
        fileList:[],
        rules: {
          ObjPosition: [
            { required: true, message: "事发地点不能为空", trigger: "blur" }
          ]
        }

      }
    },
    components: {
      paging,BaseImg,BaseBaiduSearch
    },
    mounted() {

      this.isFlag = [
        {label: '是', value: 1},
        {label: '否', value: 0}
      ]
      this.eventSourceType = getDicData('sjly');
      this.eventStateType = getDicData('sjzt');
      console.log('200', this.eventStateType)

      this.allEventList()
      this.parent_event()

    },
    computed: {
      showImg() {
        let imgList = this.eventPic;
        console.log('387',imgList);
        let data = imgList.map(item => {
          item =
            "http://" +
            this.$webconfig.serverIp +
            "/" +
            item.realpath;
          return item;
        });
        return data;

      },
    },
    methods: {

      idChangeName(ID) {
        let _this = this;
        if (_this.users.length > 0) {
          for (let item of _this.users) {
            if (ID === item.id) {
              return item.realname
            }
          }
        }

      },

      /**
       * sourceType转sourceName
       */
      typeChangeName(type) {
        for (let item of this.eventSourceType) {
          if (type === parseInt(item.value)) {
            return item.label
          }

        }

      },
      /**
       * StateType转name
       */
      stateChangeName(state) {
        for (let item of this.eventStateType) {
          if (state == parseInt(item.value)) {
            return item.label
          }
        }
      },

      group_code_parent(code){
        for(let item of this.event_group_data){
          if(code === item.group_code){
            return item.group_name

          }else if(code === item.group_name){
            return item.group_name

          }

        }

      },
      group_code_children(code){
        let _this = this;
        for(let item of _this.event_group_data){
          if(code === item.group_code){
            return item.group_name

          }else if(code === item.group_name){
            return item.group_name

          }
        }
      },
      /**
       * 获取事件大类
       */
      async parent_event() {
        let _this = this;
        try {
          let result = await _this.$http.get('/cms/EventController/queryParentEvent');

          if (result.data.success) {

            _this.parentEventData = result.data.result

          } else {
            _this.$message.warn('查询失败')
          }

        } catch (error) {
          _this.$message.error('查询失败')
        }
      },

      /**
       * 事件小类
       */
      async getChildren(data){

        let _this = this;
        _this.form.sub_name = ''
        let param = {
          parent_id: data
        };
        try {
          let res = await _this.$http.post('/cms/EventController/queryChildrenEvent',param)

          if(res.data.success){
            _this.childrenEventData = res.data.result

          }

        } catch (error){
          _this.$message.error('查询失败')

        }

      },


      async allEventList() {
        let _this = this;
        _this.loading = true;
        let param = {};


        param.page = _this.tabPage.currentPage;
        param.pageSize = _this.tabPage.pageSize;

        try {
          let ress = await _this.$http.get('/oa/OaNotifyController/userList');

          if (ress.data && ress.data.success) {
            _this.users = ress.data.result
          }
          let result = await _this.$http.post('/cms/EventController/queryAllEventList', param);
          console.log(result.data)

          if (result.data.success) {

            let data = result.data.result.rows;

            for (let item of data) {
              item.create_by = _this.idChangeName(item.create_by);
              item.update_by = _this.idChangeName(item.update_by);
              item.create_date = dateFormat(new Date(item.create_date), 'yyyy-MM-dd hh:mm:ss');
              item.update_date = dateFormat(new Date(item.update_date), 'yyyy-MM-dd hh:mm:ss');
              // item.type = _this.typeChange(item.type);
              item.status = _this.stateChangeName(item.status);
              item.source = this.typeChangeName(item.source);


            }
            _this.tabPage.totalNum = result.data.result.count;
            setTimeout(function () {
              _this.all_event_list = data
            }, 500);


            this.loading = false
          }
        } catch (error) {
          this.$message.error('查询失败')
        }
      },

      getPosition(opint) {
        console.log(opint);
        this.form.baidu_x = opint.lng;
        this.form.baidu_y = opint.lat;
        const Opt = {
          lng: opint.lng,
          lat: opint.lat
        };
        this.getareaAndBGID(Opt);
      },
      async getareaAndBGID(point) {
        const Res = await this.$http.post(
          "/cms/CellController/queryAreaAndBGIDByCoordinate",
          {
            point: point
          }
        );
        console.log(Res);
        if (Res && Res.data.success) {
          const data = Res.data.result;
          if (data.area.length > 0) {
            this.form.area_code = data.area[0].area_code;
            if (data.cell.length > 0) {
              this.form.BGID = data.cell[0].BGID;
            } else {
              this.form.BGID = undefined;
            }
          } else {
            this.form.area_code = undefined;
            this.form.BGID = undefined;
          }
        } else {
          this.$message.warn("查询失败");
        }
      },

      handleChange(file, fileList) {
        this.fileList = fileList

      },
      removeHandleChange(file, fileList) {
        this.fileList = fileList

      },

      async onEventSearch() {
        this.loading = true;

        let _this = this;
        let params = this.eventParams;
        params.page = this.tabPage.currentPage;
        params.pageSize = this.tabPage.pageSize;
        if (params.start_date && params.end_date) {
          if (new Date(params.start_date) > new Date(params.end_date)) {
            this.$message.error('结束时间不能小于开始时间');
            return
          }
        }
        try {
          this.all_event_list = [];
          let result = await this.$http.post('/cms/EventController/queryAllSpecific', params);
          if (result.data.success) {
            let data = result.data.result.rows;

            for (let item of data) {
              item.create_by = _this.idChangeName(item.create_by);
              item.update_by = _this.idChangeName(item.update_by);
              item.create_date = dateFormat(new Date(item.create_date), 'yyyy-MM-dd hh:mm:ss');
              item.update_date = dateFormat(new Date(item.update_date), 'yyyy-MM-dd hh:mm:ss');
              // item.type = _this.typeChange(item.type);
              // item.status = _this.statusChange(item.status);
            }
            _this.tabPage.totalNum = result.data.result.count;
            setTimeout(function () {
              _this.all_event_list = data
            }, 500);

          }
          setTimeout(function () {
            _this.loading = false
          }, 1000);
        } catch (error) {
          this.$message.error('查询失败')

        }

      },
      refresh() {
        let _this = this;
        this.loading = true;
        this.eventParams.parent_name = '';
        this.eventParams.source = '';
        this.eventParams.start_date = '';
        this.eventParams.end_date = '';
        this.eventParams.ObjName = '';
        this.eventParams.sub_name = '';
        this.eventParams.remarks = '';
        this.allEventList();
        setTimeout(function () {
          _this.loading = false

        }, 1500);
      },

     async add_event(){
        let _this = this;
        _this.dialogAdd = true;


      },

      async submitEvent(formName) {
        let _this = this;
        this.$refs[formName].validate(async valid => {
          if (valid) {
            console.log(2222);
            console.log('671',this.form);
            const data = this.form;
            data.create_by = this.$getUserData("id");
            data.create_date = new Date();
            data.source = 1;
            data.userId =  this.$getUserData("id");
            console.log(data);

            let resource = await this.$http.get('/cms/EventController/queryEventGroup');
            if (resource.data.success) {
              this.event_group_data = resource.data.result

            } else {
              this.$message.warn('查询失败')
            }
            data.parent_name = _this.group_code_parent(this.form.parent_name);
            data.sub_name = _this.group_code_children(this.form.sub_name);
            console.log('688',data);

            let formData = new FormData();


            // let file = $('#file_upload input')[0].files;
            let file = this.fileList;

            for (let i = 0; i < file.length; i++) {

              formData.append('file', file[i].raw);  //file就是文件

            }
            let res = await this.$http.post('/oa/OaNotifyController/saveFile', formData);

            data.pic_path = [];
            console.log('661',res.data);
            if(res.data.success){
              for(let item of res.data.result){
                data.pic_path.push(item.realpath)

              }
            }
            console.log('707',data)
            const Res = await this.$http.post(
              "/api/cms/EventController/addEvent",
              data
            );
            console.log(Res);
            if (Res && Res.data.success) {
              this.$message.success("保存成功");
              this.fileList = []
              this.$refs[formName].resetFields();
              this.dialogAdd = false;
              this.allEventList();

            } else {
              this.$message.error("保存失败");
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },

      resetFields(form) {
        this.fileList = []
        this.$refs[form].resetFields();
      },
     handleSelectionChange(data){

       this.del_data = data
     },
      bit_delete(){
        if (this.del_data.length === 0) {
          this.$message.warning('请选择事件');
        } else {
          const  dataArr = this.del_data.map((item)=>{
            return item.id
          });

          this.del_event_list({id:dataArr})
        }
      },
      async del_event_list(data){

        let _this = this

        _this.$confirm('此操作将永久删除已勾选事件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          try {
            let res = await _this.$http.post('/cms/EventController/deleteEvent', data);
            if (res.data && res.data.success) {
              _this.$message.success('删除成功');
              _this.allEventList();

            }

          } catch (error) {
            _this.$message.warning('请求错误')

          }
        })



      },
      showDetails(index, row) {
        this.dialogInfo = true;
        this.detail = row;

        let param = {
          id: row.id
        };
        let _this = this;
        _this.$http.post('/cms/EventController/eventPic', param).then(function (res) {
          console.log(783,res.data.result);
          if (res.data.success) {
            _this.eventPic = res.data.result

          }

        });

      },
      // 删除按钮
      async handleDelete(index, row) {

        let _this = this

        _this.$confirm('此操作将永久删除该条事件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let param = {
            id: row.id
          }

          try {
            let res = await _this.$http.post('/cms/EventController/deleteEvent', param)
            if (res.data && res.data.success) {
              _this.$message.success('删除成功');
              _this.allEventList();

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
        this.allEventList();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        this.allEventList();
      },

    },
  }
</script>

<style scoped>
  .case-desc-image {
    height: 130px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    padding: 10px;
  }

</style>
