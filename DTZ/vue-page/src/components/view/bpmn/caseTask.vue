<template>
  <div class="case" style="height: 100%;overflow: auto" >
    <div class="cardBody" >
      <div slot="header" class="clearfix" style="color:#015aaa;border-bottom:1px solid #cccccc">
        <div style="display:inline-block;width:130px;height: 30px;text-align: left; ">
          <i>
            <base-icon icon="custext" style="font-size: 20px"/>
          </i>
          <span  style="color:#015aaa"> 详细信息</span>
        </div>

      </div>
        <el-form  label-position="left" inline class="demo-table-expand" style="color:#99A9BF;" v-show="form_type==3" >
          <el-form-item label="主管部门名称:" >
            <span>{{caseData.DeptName1}}</span>
          </el-form-item>
          <el-form-item label="事发位置:">
            <span>{{caseData.ObjPosition}}</span>
          </el-form-item>
          <el-form-item label="案卷编号:">
            <span>{{caseData.case_code}}</span>
          </el-form-item>
          <el-form-item label="大类名称:">
            <span>{{caseData.parent_name}}</span>
          </el-form-item>
          <el-form-item label="小类名称:">
            <span>{{caseData.sub_name}}</span>
          </el-form-item>
          <el-form-item label="创建人:">
            <span>{{caseData.realname}}</span>
          </el-form-item>
          <el-form-item label="创建时间:">
            <span >{{dateObjFormatFun(caseData.create_date)}}</span>
          </el-form-item>
          <el-form-item label="修改人:">
            <span>{{caseData.update_name}}</span>
          </el-form-item>
          <el-form-item label="修改时间:">
            <span>{{dateObjFormatFun(caseData.update_date)}}</span>
          </el-form-item>
          <el-form-item label="描述:">
            <span>{{caseData.remarks}}</span>
          </el-form-item>


        </el-form>

        <el-form  label-position="left" inline class="demo-table-expand" style="color:#99A9BF;" v-if="form_type!=3">
          <el-form-item v-for="(item, index) in formJsonList" :key="index" v-if="item.type=='text'">
          <label style="font-size: 14px;color: #606266;" >{{item.label}}</label>
          <span>{{item.value}}</span>
          </el-form-item>
          <div v-for="(item, index) in formJsonList" :key="index" v-if="item.type=='m-upload-img'" style="height: 100px;margin-bottom: 40px">
            <label style="font-size: 14px;color: #606266;" >{{item.label}}</label>
            <base-img :src="showImg(item.value)" />
          </div>
        </el-form>
      <div v-for="(item, index) in userTaskList" :key="item.id">
        <el-form>
          <el-form-item >
            <label style="font-size: 14px;color: #606266;" >{{item.name}}意见：</label>
            <span>{{item.description}}</span>
          </el-form-item>
        </el-form>
      </div>
      <el-form  style="" v-show="uploadShow">
        <el-upload
          class="upload-demo"
          ref="upload"
          action=""
          :limit="3"
          :multiple="true"
          :file-list="fileList"
          :on-change="handleChange"
          :on-remove="removeHandleChange"
          id="file_upload"
          :auto-upload="false">
          <el-button slot="trigger"  size="small" type="primary">选取图片</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </el-form>
          <div v-for="(item, index) in WaitUserTaskList" :key="index">
          <label style="font-size: 14px;color: #606266;" >{{item.name}}意见：</label>
            <textarea style="width: 100%;height: 100px;resize: none;" v-model="taskDescription"></textarea>
          </div>
        <div  style="text-align: right" >
          <span v-for="(item, index) in flowList" :key="index" >
            <el-button type="primary" v-if="item.condition=='true'" @click="submitFlow(item.id,item.act_name,item.approveType)" style="margin: 10px 10px">{{item.act_name}}</el-button>
            <el-button v-else-if="item.condition=='false'" @click="submitFlow(item.id,item.act_name,item.approveType)" style="margin: 10px 10px">{{item.act_name}}</el-button>
            <el-button type="primary" v-else @click="submitFlow(item.id,item.act_name,item.approveType)" style="margin: 10px 10px">{{item.act_name}}</el-button>
          </span>
        </div>

    </div>
    <div class="cardBody" style="margin-top: 40px">
      <div slot="header" class="clearfix" style="color:#015aaa;border-bottom:1px solid #cccccc">
        <div style="display:inline-block;width:130px;height: 30px;text-align: left; ">
          <!--<i>-->
            <!--<base-icon icon="liucheng" style="font-size: 20px"/>-->
          <!--</i>-->
          <span  style="color:#015aaa"> 流转信息</span>
        </div>

      </div>
      <!--表单-->
      <el-table   :data="taskTableData"  border:height="screenHeight-110"
                  v-loading="loading"  style="width: 100%;margin-top: 10px" border>
        <el-table-column min-width="100" prop="name"  label="执行环节"></el-table-column>
        <el-table-column min-width="100" prop="sys_user.realname"  label="执行人"></el-table-column>
        <el-table-column min-width="100" prop="start_time" :formatter="dateFormatFun" label="开始时间"></el-table-column>
        <el-table-column min-width="100" prop="end_time" :formatter="dateFormatFun" label="结束时间"></el-table-column>
        <el-table-column min-width="100" prop="description"  label="提交意见"></el-table-column>
        <el-table-column min-width="100" prop="duration" :formatter="dateTransform"  label="任务历时"></el-table-column>
        <el-table-column min-width="180"    label="图片">
          <template slot-scope="scope">
            <div  style="overflow: hidden;height:110px;">
              <base-img v-if='scope.row.uploadImgs!=null' :src="showImg(scope.row.uploadImgs)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--人员选择器-->
    <el-dialog :modal="false" style="box-shadow: 5px 5px 5px #cccccc;" class="childDialog"
               :visible.sync="personSelectDialogShow"
               append-to-body
               :close-on-click-modal="false" width="40%">
      <div style="height: 400px;">
        <el-row :gutter="20" class="selectDepart" style="padding: 10px 20px">
          <el-col :span="24">
            <p class="departTitle">请选择下一步执行人</p>
            <div class="surround">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree ref="treeChoose" :default-expand-all=false style="height: 260px;overflow: auto;"
                       show-checkbox
                       class="filter-tree" :data="TreeData" node-key="id" :render-content="renderContent"
                       :props="defaultProps" @check-change="treeChange" :filter-node-method="filterNode">
              </el-tree>
            </div>
          </el-col>

        </el-row>

        <div style="text-align: right;margin-top: 10px;">
      <span slot="footer" class="dialog-footer" style="padding: 10px 20px;">

        <el-button type="primary" @click="closePersonSelectDialog(1)"
                   style="height: 28px;border-radius: 5px;padding: 0px 10px">确 定</el-button>
      </span>
        </div>

      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer" style="padding-top: 10px;margin-bottom:40px;margin-right: 30px;    text-align: right;" >
      <el-button size="small" @click="closeDialog('close')">关闭</el-button>
    </div>
  </div>
</template>

<script>
  import {dateFormat,formHoursMinSecond} from 'assets/js/date.js'
  import BaseImg from "common/BaseImg";
  export default {
    data(){
      return {
        title:'',
        caseData:{},
        taskTableData:[],
        userTaskList:[],
        WaitUserTaskList:[],
        formJsonList:[],
        flowList:[],
        fileList: [],
        uploadShow:false,
        form_type:'',
        taskDescription:'',
        loading:true,
        proc_inst_id:'',
        userList:[],
        userIdList:[],
        personSelectDialogShow:false,
        TreeData:[],
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        actinstId:'',
        expand: {
          type: Boolean,
          default: false
        },
      }
    },
    created: function () {

    },
    mounted: function () {
     this.openScreen();
      this.getPlOrgListToTree(this.param);
    },
    components: {
      BaseImg,
    },
    watch:{
      filterText(val) {
        this.$refs.treeChoose.filter(val);
      },

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
       *表格时间格式化
       */
      dateFormatFun(row, colum){
        if (row[colum.property] != null) {
          const d = row[colum.property];
          return dateFormat(new Date(d),"yyyy-MM-dd hh:mm:ss")
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
       *字段时间格式化
       */
      dateObjFormatFun(date){
          return dateFormat(new Date(date),"yyyy-MM-dd hh:mm:ss")
      },
      initMsg(data,type){
        this.title=data.act_name;
        this.form_type=data.form_type;
        this.fileList=[];
        this.uploadShow=false;
        if(data.form_type==3){
          this.queryCase(data.id);
        }else if(data.form_type==1){
          let arr=[];
          let itemObj=JSON.parse(data.form_json);
          for(let j of itemObj){
              arr=this.getFormJsonValue(j,arr)
          }
          this.formJsonList=arr;
        }
        this.queryTaskList(data.id);
        this.WaitUserTaskList=[];
        this.flowList=[];
        this.taskDescription='';

        this.queryUserTaskList(data.id);
        if(type=='edit'){
          this.queryWaitUserTaskByProcId(data.id);
        }
        this.proc_inst_id=data.id;
      },
      //查询案件信息
     async queryCase(proc_inst_id){
        try{
          const res = await this.$http.post('/oa/CaseController/queryCaseByProcId', {proc_inst_id: proc_inst_id});
          if (res.data && res.data.success) {
            this.caseData = res.data.result[0]
          }else{
            this.$message.error('查询错误！'+res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }

      },
      //流转案件信息
      async  queryTaskList(proc_inst_id){
        this.taskTableData=[];
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryTaskByProcId', {id: proc_inst_id})
          if (res.data && res.data.success) {
            this.taskTableData = res.data.result
          }else{
            this.$message.error('查询错误！'+res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }

      }    ,
      //流转案件信息
      async  queryUserTaskList(proc_inst_id){
        this.userTaskList=[];
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryUserTaskByProcId', {id: proc_inst_id})
          if (res.data && res.data.success) {
            this.userTaskList = res.data.result
            if(this.userList.length>0){

            }
          }else{
            this.$message.error('查询错误！'+res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }

      }   ,
      //等待流转案件信息
      async  queryWaitUserTaskByProcId(proc_inst_id){
        let params={
          id: proc_inst_id,
          assignee:JSON.parse(this.$getStore("userData")).id,
          group:JSON.parse(this.$getStore("userData")).roleList
        }
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryWaitUserTaskByProcId', params)
          if (res.data && res.data.success) {
            this.WaitUserTaskList = res.data.result;
            if(this.WaitUserTaskList.length>0){
              this.uploadShow=true;
              this.queryFlowMsgByElementId()
            }

          }else{
            this.$message.error('查询错误！'+res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }

      },

      //等待流转案件信息
      async  queryFlowMsgByElementId(){
          let params={
            proc_element_id: this.WaitUserTaskList[0].proc_element_id,
            proc_def_id: this.WaitUserTaskList[0].proc_def_id,
        }
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryFlowMsgByElementId', params)
          if (res.data && res.data.success) {
            this.flowList = res.data.result;
          }else{
            this.$message.error('查询错误！'+res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }

      },
      //提交结果
      async submitFlow(id,act_name,approveType){
        let formData = new FormData();
        let file = this.fileList;
        for (let i = 0; i < file.length; i++) {
          formData.append('file', file[i].raw);  //file就是文件
        }
        formData.append('flowid', id);
        formData.append('act_name', act_name);
        formData.append('taskDescription', this.taskDescription);
        formData.append('proc_element_id', this.WaitUserTaskList[0].proc_element_id);
        formData.append('userid', JSON.parse(this.$getStore("userData")).id);
        formData.append('proc_inst_id', this.proc_inst_id);
        formData.append('approveType', approveType);
        try{
          const res = await this.$http.post('/bpmn/BpmnController/executeFlow', formData)
          if (res.data && res.data.success) {
            if(res.data.result.selectPerson){
              this.personSelectDialogShow=true;
              this.actinstId=res.data.result.id
            }else{
              this.closeDialog('refresh')
              this.WaitUserTaskList=[];
              this.flowList=[];
              this.uploadShow=false;
              this.WaitUserTaskList(this.proc_inst_id)
              this.queryTaskList(this.proc_inst_id)

            }

          }else{
            if(res.data.state==1){
              this.closeDialog('refresh')
              this.WaitUserTaskList=[];
              this.flowList=[];
              this.uploadShow=false;
              this.WaitUserTaskList(this.proc_inst_id)
              this.queryTaskList(this.proc_inst_id)
              this.$message.error(res.data.msg);
            }else{
              this.$message.error(res.data.msg);
            }

          }
        }catch(err){
          this.$message.error(err);
        }
      },
      //关闭dialog
      closeDialog(type) {
        this.$emit('closeDialog', type)
      },
      getFormJsonValue(element,arr){
        if(element.type=='m-radio'){
          arr.push({label:element.label,value:element.value.name,type:'text'})
        }else  if(element.type=='m-datetime-range'){
          arr.push({label:'开始时间',value:element.value.begin,type:'text'})
          arr.push({label:'结束时间',value:element.value.end,type:'text'})
          arr.push({label:'时长',value:element.value.intervalUnit,type:'text'})
        }else if(element.type=='m-datetime'){
          arr.push({label:element.label,value:element.value,type:'text'})
        }else if(element.type=='m-textarea'){
          arr.push({label:element.label,value:element.value.text,type:'text'})
        }else if(element.type=='m-switch'){
          let value=''
          if(element.value=='false'){
            value='否'
          }else{
            value='是'
          }
          arr.push({label:element.label,value:value,type:'text'})
        }else if(element.type=='m-scan'){
          arr.push({label:element.label,value:element.value,type:'scan'})
        }else if(element.type=='m-checkbox'){
          let str='';
          element.value.forEach(item=>{
            str+=item.name+'  '
          })
          arr.push({label:element.label,value:str,type:'text'})
        }else if(element.type=='m-upload-file'){
          arr.push({label:element.label,value:element.value,type:'m-upload-file'})
        }else if(element.type=='m-upload-img'){
          let url='';
          element.value.forEach(item=>{
              url+=item.fileName+','
          })
          url=url.substr(0,url.length-1)
          arr.push({label:'图片',value:url,type:'m-upload-img'})
        }else if(element.type=='m-select-person'){
          arr.push({label:element.label,value:element.value,type:'m-select-person'})
        }else if(element.type=='m-input'){
          arr.push({label:element.label,value:element.value,type:'text'})
        }else if(element.type=='m-gps-point'){
          arr.push({label:element.label,value:element.value.address,type:'text'})
        }else if(element.type=='m-select-area'){
          arr.push({label:element.label,value:element.name,type:'text'})
        }
        return arr;
      },

      handleChange(file,fileList){
        var allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
          let isAllowFileTypes=false;
        // 如果文件的文件类型属于allowFileTypes其中的一种
        if (allowedFileTypes.indexOf(file.raw.type) > -1) {
          isAllowFileTypes=true
        }
        if (!isAllowFileTypes ) {
          this.$message.error('只能上传图片');
          this.fileList=[];
          return;
        }
        this.fileList.push(file)

      },
      removeHandleChange(file,fileList){
        this.fileList = fileList
      },

      showImg(picPathStr) {
        if(picPathStr==null){
          return [];
        }
        let imgList = picPathStr.split(',');
        let data = imgList.map(item => {
          item =
            "http://" +
            this.$webconfig.serverIp +
            "/" +
            item;
          return item;
        });
        return data;

      },

      /**
       * Tree树节点显示区分（组织机构、警员）
       *@param h createlement 方法
       *@param node   节点
       */
      renderContent(h, {node, data, store}) {
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
       *查询组织结构信息(树)
       */
      async getPlOrgListToTree(parms) {
        const _self = this;
        try {
          let parm = {id:JSON.parse(this.$getStore("userData")).org_id};

          if (parms) {
            parm = parms
          }
          const callBackData = await _self.$http.get('/bpmn/BpmnController/orgAndUser',  parm);
          if (callBackData.data.success) {   //查询成功

            let result = callBackData.data.result;
            _self.allUserArr=[];
            _self.allDepartArr=[];
            result.forEach(item=>{
              _self.allDepartArr.push({
                id: item.id,
                org_code: item.org_code,
                name: item.org_name,
                org_type: item.org_type,
                parent_id: item.parent_id,
                description: item.description,
                type: 'depart',

                // disabled: true,
              });
              item.sys_users.forEach(userItem=>{
                _self.allUserArr.push({
                  id: userItem.id,
                  name: userItem.realname,
                  phone: userItem.phone,
                  type: 'user',
                  parent_id: userItem.org_id,
                })
              })
            })
            _self.TreeData = _self.toTreeData(result);
          } else {

            _self.$message({
              message: callBackData.data.msg,
              type: 'warning'
            });
          }
        } catch (err) {
        }
      },  toTreeData(data) {
        var pos = {};
        var tree = [];
        for (var i=0;i<data.length;i++) {

          if (!pos[data[i].id]) {

            var children = [];
            if (data[i].sys_users.length > 0) {
              for (var item of data[i].sys_users) {
                children.push({
                  id: item.id,
                  name: item.realname,
                  phone: item.phone,
                  type: 'user',
                  //parentname: data[i].org_name,
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
          }else {
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
        }
        return tree;
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
      //人员选择器dialog
      async closePersonSelectDialog(value) {
        let _this = this;

        if (value === 0) {
          this.userList = [];
          this.getPlOrgListToTree(this.param);
          this.personSelectDialogShow = false

        } else if (value === 1) {
          this.personSelectDialogShow = false;
          this.userIdList= [];

          this.userList.forEach(item=>{
            this.userIdList.push(item.id)
          })
           this.submitApprovePerson()
        }

      },

      //下一步执行人
      async submitApprovePerson(){

        try{
          const res = await this.$http.post('/api/bpmn/BpmnController/setApprovePerson', {id:this.actinstId,userId:JSON.stringify(this.userIdList)})
          if (res.data && res.data.success) {
            this.WaitUserTaskList=[];
            this.flowList=[];
            this.uploadShow=false;
            this.WaitUserTaskList(this.proc_inst_id)
            this.queryTaskList(this.proc_inst_id)
            this.closeDialog('refresh')
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error(err);
        }
      },
    }
  }
</script>

<style >

  .case .el-form-item{
    width:40%
  }
  .cardBody{
    padding:10px 20px;    border-radius: 4px;   border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: .3s;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .case .el-form-item__content{
   height:40px;
    line-height: 40px;
  }
  .case  .el-form--inline .el-form-item {
    margin-bottom: 0px;
  }


</style>
