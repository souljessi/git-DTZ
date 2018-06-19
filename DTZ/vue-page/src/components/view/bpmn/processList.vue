<template>
  <div class="proclist" style="height: 100%;">
    <p style="margin:16px 0">
    <span style="margin-right:10px;">{{processType}}审批流程</span>
      <el-button type="primary" class="btn_group right"  @click="handleTemplateView()">
        <base-icon  icon="count" />创建新审批
      </el-button>
    </p>
    <div class="tablist" v-for="(item,index)  in result" style="overflow-y: visible;">
      <div class="group_title"  >
        <span>{{item.typename}}</span><span>({{item.list.length}})</span>
      </div>
        <ul>
          <li v-for="(proc,index)  in item.list" >
            <div style="float:left;width: 400px;border-right:1px solid #ccc">
              <img v-lazy="'http://'+ServerimageUrl+proc.icon_path" :src="'http://'+ServerimageUrl+item.icon_path" >
              <div class="approve_title">{{proc.name}}</div>
              <div class="approve_content">{{proc.remarks}}</div>
              <div class="approve_content" v-if="proc.update_time">{{dateFormatFun(proc.update_time)}}更新</div>
              <div class="approve_content" v-else>{{dateFormatFun(proc.create_time)}}创建</div>
            </div>
            <div style="float:left;width: 300px;border-right:1px solid #ccc;padding-left: 10px;height: 85px" >
              <div class="approve_title" v-if="formType==3">主管部门</div>
              <div class="approve_title" v-else>可见范围</div>
              <div class="approve_content"  style="position: relative;width:200px"><span v-if="proc.orgList.length==allDepartArr.length">全部可见</span>
                  <span v-else >
                   <el-tag type="info" style="margin: 0 3px;height: 20px;" v-for="item in proc.orgList1" :key="item.id">
                    {{item.org_name}}
                  </el-tag>

                  </span>
            </div>
            <div class="approve_content" v-if="proc.update_time"><a style="cursor: pointer;color: #38adff;" @click="openDepartSelect(proc)">编辑 </a></div></div>
            <div style="line-height: 80px;text-align: left" class="btn_list" v-if="proc.is_hang==0">
              <a @click="editTemplate(proc.id,proc)"v-if="formType==3">编辑 </a>
              <a @click="editTemplate(proc.id,proc)" v-else>编辑表单 </a>
              <a @click="editBpmnSet(proc)">审批流程 <span class="tip" v-if="proc.bytes!=null">(已设置)</span><span class="tip" v-else>(未设置)</span></a>
              <a @click="updateBpmnStatus(proc,1)">启用</a>
              <a @click="deleteBpmnDef(proc.deployment_id)">删除 </a>
            </div>
            <div style="line-height: 80px;text-align: left" class="btn_list" v-if="proc.is_hang==1">
              <a @click="editTemplate(proc.id,proc)"v-if="formType==3">编辑 </a>
              <a @click="editTemplate(proc.id,proc)" v-else>编辑表单 </a>
              <a @click="editBpmnSet(proc)">审批流程<span class="tip" v-if="proc.bytes!=null">(已设置)</span><span v-else>(未设置)</span> </a>
              <a @click="updateBpmnStatus(proc,0)">停用</a>
              <a @click="deleteBpmnDef(proc.deployment_id)">删除 </a>
            </div>
          </li>
        </ul>

    </div>

    <!--创建表单列表-->
    <el-dialog   :append-to-body="true"  :visible.sync="templateViewVisible"
                 width="60%" height="80%">
      <div slot="title" class="el-dialog_header">
        <!--<i><base-icon icon="shenpi"/></i> -->
        <span class="el-dialog__title"> 创建新审批</span>
      </div>
      <el-button type="primary" class="btn_group" style="margin-bottom: 10px" @click="editTemplate(null,null)" >
        <base-icon  icon="count" /> 自定义模板
      </el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane label="使用经典模版"  name="jingdian"></el-tab-pane>
      </el-tabs>
      <ul class="template_list">
        <li v-for="(item,index) in templateList" :key="index" @click="editTemplate(null,item)">
            <img v-lazy="'http://'+ServerimageUrl+item.icon_path" :src="'http://'+ServerimageUrl+item.icon_path">
            <div data-v-aa43be52="" class="approve_title">{{item.template_name}}</div>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer" style="position: absolute;bottom:10px;right: 10px; z-index: 1000">
        <el-button size="small" type="primary" @click="templateViewVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <!--系統表单-->
    <el-dialog :append-to-body="true" :visible.sync="sysViewVisible"
               width="40%" height="80%">
      <div slot="title" class="el-dialog_header">
        <!--<i><base-icon icon="shenpi"/></i> -->
        <span class="el-dialog__title"> 创建新审批</span>
      </div>
      <el-form>
        <el-form-item label="审批名称">
          <el-input v-model="bpmnDef.name"></el-input>
        </el-form-item>
        <el-form-item label="审批编码">
          <el-input v-model="bpmnDef.key"></el-input>
        </el-form-item>
        <el-form-item label="审批分组">
          <el-select v-model="template_group">
            <el-option
              v-for="(items,index) in result" :key="index"
              :label="items.typename"
              :value="items.typecode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="remarks"></el-input>
        </el-form-item>
        <div class="tm-wrap">
          <div>
            <label class="tm-label">图标</label>
            <span class="tm-label-span"></span>
          </div>
          <div class="wf-field wf-setting-icon" style="height: 240px">
            <div class="fieldblock">
              <div class="wf-iconselect" style="display: block">
                <ul id="approveIcon" style="display: block;float: left;padding-left:0px;">
                  <li v-for="(item,index) in iconArr" :key="index" class="iconitem selected">
                    <img :src="'http://'+ServerimageUrl+item.img" @click="iconSelect(index)">
                    <span v-show="item.showing" :index=index class="el-checkbox__input is-checked" style="top:-26px;left:21px;">
                            <span class="el-checkbox__inner"></span>
                            <input type="checkbox" class="el-checkbox__original" value="workHours">
                          </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer" style="position: absolute;bottom:10px;right: 10px; z-index: 1000">
        <el-button type="primary" @click="addBpmnDef">保存</el-button>
        <el-button size="small" type="primary" @click="sysViewVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <!--新增分组-->
    <el-dialog  :visible.sync="addGroupVisible" width="400px">
      <div slot="title" >
        <!--<i><base-icon icon="shenpi"/></i> -->
        <span class="el-dialog__title"> 新增分组</span>
      </div>
      <el-form :model="groupData">
        <el-form-item label="分组名称" :label-width="formLabelWidth">
          <el-input v-model="groupData.name"   size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addGroupVisible = false">取 消</el-button>
    <el-button type="primary" @click="addGroup">保存</el-button>
  </span>
    </el-dialog>

    <!--流程图-->
    <el-dialog class="bpmnDialog" :modal-append-to-body=false :visible.sync="dialogBpmnVisible"
               style="overflow: hidden;height: 100%;" width="80%">
      <div slot="title" class="el-dialog_header">
        <div style="display:inline-block;background:#ffc713;width:40px;height: 40px;text-align: center ">
          <i>
            <base-icon icon="liucheng" style="font-size: 20px"/>
          </i>
        </div>
        <span class="el-dialog__title" style="color:#fff"> 编辑流程图</span>
      </div>
      <bpmnSet ref="bpmnEdit" @closeDialog="closeDialog" style="height: 100%;overflow:hidden"></bpmnSet>
    </el-dialog>

    <!--部门选择器-->
    <el-dialog  :visible.sync="departDialogShow" :modal-append-to-body=false
                :close-on-click-modal="false">
      <Org style="height: 335px;overflow-y: auto;margin-top: 10px"
           :dialog-visible="true"
           :setSelect='setSelectList1'
           @selectdNode='selectedNodes'
           title="部门选择"
           :strictly="true"
           :multiple="true">
      </Org>
      <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDepartDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeDepartDialog(1)">保存</el-button>
                </span>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>
<script>
  import {dateFormat} from 'assets/js/date.js'
  import bpmnSet from './bpmnSet.vue'
  import Org from 'common/departTree'
  export default {
    data(){
      return {
        formType:'',//表单类型 1-app 2-web
        result:[],
        activeName: 'jingdian',
        templateList:[],
        addGroupVisible:false,
        groupData:{
          name:''
        },
        template_group: '',
        iconArr: [],
        departList1: [],
        allDepartArr: [],
        icon_path: '',
        proc_def_id:'',
        bpmnDef: {
          name: '',
          key: ''
        },
        defId: '',
        remarks: '',
        formLabelWidth: '120px',
        templateViewVisible:false,
        sysViewVisible: false,
        TreeData: [],
        departDialogShow: false,
        setSelectList1: [],//部门选中项多个
        dialogBpmnVisible:false,
        ServerimageUrl:'',
      }
    },
    template: '<div>{{ hi }}</div>',
    created: function () {
      this.ServerimageUrl = this.$webconfig.serverIp;

    },
    mounted: function () {
     this.openScreen();
      this.getIcon();
      this.getPlOrgListToTree(this.param);
    },
    components: {
      bpmnSet,Org
    },
    computed: {},
    methods: {
      /**
       * 加载动画
       */
      openScreen() {//加载...
        this.loading = true;
        let self = this;
        setTimeout(() => {
          self.loading = false;
        }, 400);
      },
      /**
       *时间格式化
       */
      dateFormatFun(colum) {
        return dateFormat(new Date(colum), "yyyy-MM-dd hh:mm:ss")
      },
      async processList(formType) {
        this.formType = formType;
        let data = {
          formType: formType
        };

        try {
          const res = await this.$http.post('/bpmn/BpmnController/processList', data);
          this.getTemplateList();
          if (res.data && res.data.success) {
            this.result = res.data.result
          } else {
            this.$message.error(res.data.msg);
          }
        } catch (err) {
          this.$message.error('查询错误！' + err);
        }
      },
      /**
       * 点击新建模板按钮
       */
      handleTemplateView() {
        if (this.formType != 3) {
          this.templateViewVisible = true;
        } else {

          this.bpmnDef.name = '';
          this.bpmnDef.key = '';
          this.template_group = '';
          this.icon_path = '';
          this.remarks = '';
          this.defId = '';
          this.selectIcon();
          this.sysViewVisible = true;
        }

      },
      /**
       * 点击新建模板按钮
       */
      handleGroupView() {
        this.addGroupVisible = true;
      },
      editBpmnSet(obj) {
        this.dialogBpmnVisible = true;
        if (obj.bytes == null) {
          this.$nextTick(function () {
            this.$refs.bpmnEdit.addBpmn(obj);
          })
        } else {
          this.$nextTick(function () {
            this.$refs.bpmnEdit.editBpmn(obj);
          })
        }

      },
      async getTemplateList() {
        let data = {
          form_type: this.formType,
          template_name: ""
        };

        try {
          const res = await this.$http.get('/oa/CustFormController/getCusFormInfoByAll', {params: data});
          if (res.data && res.data.success) {
            this.templateList = res.data.result
          } else {
            this.$message.error(res.data.msg);
          }
        } catch (err) {
          this.$message.error('查询错误！' + err);
        }
      },

      async addGroup() {
        let data = {
          groupName: this.groupData.name,
        };

        try {
          const res = await this.$http.post('/bpmn/BpmnController/addGroup', data);
          this.$message.success('保存成功');
          if (res.data && res.data.success) {
            this.addGroupVisible = false;
          } else {
            this.$message.error(res.data.msg);
          }
        } catch (err) {
          this.$message.error('查询错误！' + err);
        }
      },
      async addBpmnDef() {
        if (this.bpmnDef.name == '') {
          this.$message.warning('请填写审批名称！');
          return;
        } else if (this.bpmnDef.key == '') {
          this.$message.warning('请填写审批编码！');
          return;
        } else if (this.template_group == '') {
          this.$message.warning('请选择审批分组！');
          return;
        } else if (this.icon_path == '') {
          this.$message.warning('请选择图标！');
          return;
        }
        let data = {
          name: this.bpmnDef.name,
          key: this.bpmnDef.key,
          template_group: this.template_group,
          icon_path: this.icon_path,
          remarks: this.remarks,
          userId: JSON.parse(this.$getStore("userData")).id,
          formId: this.defId
        };

        try {
          const res = await this.$http.post('/bpmn/BpmnController/addSysForm', data);
          this.$message.success('保存成功');
          if (res.data && res.data.success) {
            this.processList(this.formType)
            this.sysViewVisible = false;
          } else {
            this.$message.error(res.data.msg);
          }
        } catch (err) {
          this.$message.error('查询错误！' + err);
        }
      },
      editTemplate(id, obj) {
        let data = {
          isApprove: 1
        }
        if (id) {
          data.id = id;
          data.isApprove = 2
        }
        if (obj) {
          data.template_code = obj.key;
          data.template_name = obj.name;
          data.icon_path = obj.icon_path;
          data.form_items = obj.form_items;
          data.remarks = obj.remarks;
          data.template_group = obj.template_group;
        }
        let path = '';
        if (this.formType == 1) {
          path = 'addapp'
          this.$router.push({path: path, query: data});
        } else if (this.formType == 2) {
          path = 'addweb'
          this.$router.push({path: path, query: data});
        } else if (this.formType == 3) {
          this.sysViewVisible = true;
          this.bpmnDef.name = obj.name;
          this.bpmnDef.key = obj.key;
          this.remarks = obj.remarks;
          this.template_group = parseInt(obj.template_group);
          this.icon_path = obj.icon_path;
          this.selectIcon();
          this.defId = obj.id;
        }


      },
      /**
       * 修改流程状态信息
       * @params {Object} row|rows     行对象
       */
      updateBpmnStatus(data, is_hang) {
        const _vm = this;
        let msg;
        if (is_hang == 1) {
          msg = '启用'
        } else {
          msg = '停用'
        }

        _vm.$confirm(`确认要${msg}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          if (data.bytes == null) {
            _vm.$message.error('请先编辑审批流程');
            return;
          }
          try {
            const res = await _vm.$http.post('/bpmn/BpmnController/uploadBpmnStatus', {
              procDefId: data.id,
              id: data.deployment_id,
              is_hang: is_hang
            });
            if (res.data && res.data.success) {
              _vm.processList(this.formType);
              _vm.$message.success(`${msg}成功`);
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error(`${msg}错误` + err);
          }
        })
      },
      /**
       *关闭dialog
       */
      closeDialog(type) {
        if (type != 'close') {
          this.processList(this.formType)
        }
        this.dialogBpmnVisible = false
      }, /**
       * 图标选择
       * @param index
       */
      iconSelect(index) {
        let vm = this;
        for (let i = 0; i < vm.iconArr.length; i++) {
          if (index === i) {
            vm.iconArr[i].showing = true;
            vm.icon_path = vm.iconArr[i].img;
          } else {
            vm.iconArr[i].showing = false;
          }
        }
      },

      /**
       * 读取服务端图标
       */
      getIcon() {
        let vm = this;
        vm.$http
          .post("/oa/CustFormController/getCusFormIcon")
          .then(function (res) {
            let obj = {};
            if (res && res.data && res.data.success) {
              let iconData = res.data.result;
              for (let i = 0; i < iconData.length; i++) {
                obj.img = iconData[i].img;
                obj.showing = iconData[i].showing;
                vm.iconArr.push(obj);
                obj = {};
              }
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      },
      selectIcon() {
        this.iconArr = this.iconArr.map(item => {
          if (this.icon_path === item.img) {
            item.showing = true;
          } else {
            item.showing = false;
          }

          return item;
        });
      },
      /**
       * 删除流程信息
       * @params {Object} row|rows     行对象
       */
      deleteBpmnDef(id) {
        const _vm = this;
        _vm.$confirm(`确认要删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          try {
            const res = await _vm.$http.post('/bpmn/BpmnController/deleteBpmnDef', {
              id: id,
            });
            if (res.data && res.data.success) {
              _vm.processList(this.formType);
              _vm.$message.success(`删除成功`);
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error(`删除错误` + err);
          }
        })
      },
      /**
       *查询组织结构信息(树)
       */
      async getPlOrgListToTree(parms) {
        const _self = this;
        try {
          let parm = {};
          if (parms) {
            parm = parms
          }
          const callBackData = await _self.$http.get('/oa/OaNotifyController/orgAndUser', {params: parm});
          if (callBackData.data.success) {   //查询成功

            let result = callBackData.data.result;
            _self.allUserArr = [];
            _self.allDepartArr = [];
            result.forEach(item => {
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
              item.sys_users.forEach(userItem => {
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
      },
      /**
       * @param {Object} data 组织树回调
       */
      selectedNodes(data) {
        this.departTreeChangeArr1 = data;
      },
      //显示部门选择器
      openDepartSelect(proc) {
        this.proc_inst_id=proc.id
        let orgList=[];
        proc.orgList.forEach(item=>{
          orgList.push(item.org_id)
        })
        this.setSelectList1=orgList;
        this.departDialogShow = true;
      },
      /**
       * 部门选择
       */
      chooseDeparts() {
        this.dialogVisible = true;
        if (this.departList1.length > 0) {
          this.setSelectList1 = this.departList1.map((item) => {
            return item.id;
          })
        } else {
          this.setSelectList1 = [];
        }
      },
      toTreeData(data) {
        var pos = {};
        var tree = [];
        var i = 0;
        while (data.length !== 0) {
          if (data[i].parent_id === 0) {
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
      }, /**
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
       * 关闭dialog
       * @value 关闭状态 0 取消 1 确定
       */
      async closeDepartDialog(value) {
        if (value === 1) {
          this.departList1 = this.departTreeChangeArr1;
          let data = {
            orgIdList: this.departList1,
            proc_def_id: this.proc_inst_id
          };
            try{
              const res = await this.$http.post('/bpmn/BpmnController/setBpmnOrg', data);
              if(res.data.success){
                this.$message.success(`保存成功`);
                this.processList(this.formType)
              }else{
                this.$message.warning(`保存失败`);
              }
            }catch(e){
              this.$message.warning(`保存失败`);
            }
          }
          this.departDialogShow = false;
        }

    },
    props:['processType']

  }
</script>

<style scoped>

  .proclist{
    width:1200px;
    padding-right: 10px;
  }
.proclist .btn_group{
  font-size: 14px;
  border:1px solid #409eff
}
.proclist .btn_group_icon{
  color:#409eff;
  padding: 0 5px;
}
  .right{
    float: right;
  }
.proclist .group_title{
    background-color:#f7f3f3;
  padding:6px;
  margin:6px 0;
  }
  .proclist ul li {

    height: 100px;
  }
  .proclist .tip {
    display: inline-block;
color:#858585;
    float: none;
  }
 .proclist ul li img {
   float:left;
  border-radius: 10px;
  width: 85px;
  height: 85px;
   margin-right: 12px;
}
.proclist ul li span {
  float:left;

}
  ul, li{
    list-style: none;
  }
  .proclist .approve_title{
    font-size:14px;
    font-weight: bold;
    line-height: 30px;

  }
  .proclist .approve_content{
    font-size:14px;
    width:180px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    color:#858585;

    line-height: 26px;
  }

  .proclist .el-dialog_header {
    border-bottom: 1px dashed #ccc;
  }
  .template_list li{
    width:30%;
    margin-right: 1%;
    height:100px;
    border:1px solid #ccc;
    border-radius:6px;
    display: inline-block;
    margin-top: 10px;
    padding: 10px 10px 0 10px;
    cursor:pointer;
  }
  .template_list li:hover{
    -moz-box-shadow:3px 3px 5px #333333;
    -webkit-box-shadow:3px 3px 5px #333333;
    box-shadow:3px 3px 5px #333333;
  }
  .template_list  li img {
    float:left;
    border-radius: 10px;
    width: 80px;
    height: 80px;
    margin-right: 12px;
  }
  .template_list li .approve_title{
    font-size:16px;
    font-weight: bold;
    line-height: 30px;
  }
  .template_list li .approve_content{
    font-size:14px;
    color:#1f1c1c;
    line-height: 26px;
  }
  .btn_list a{
    padding: 0 10px;
    cursor:pointer;
    color:#38adff;
  }
  .proclist .el-tabs__content{
    height:100%;
  }

  .proclist .el-dialog__header {
    background: #0e0e0f;
    padding: 0;
    line-height: 40px;
  }

  .bpmnDialog .el-dialog {
    height: 80vh;
  }

  .tm-wrap #approveIcon li {
    display: list-item;
    margin-right: 10px;
    float: left;
    cursor: pointer;
  }

  .tm-wrap #approveIcon li img {
    width: 40px;
    height: 40px;
  }

  .tm-wrap #approveIcon li {
    display: list-item;
    margin-right: 10px;
    float: left;
    cursor: pointer;
  }

  .tm-wrap .wf-iconselect .iconitem {
    width: 50px;
    height: 50px;
    display: block;
    float: left;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid transparent;
    overflow: hidden;
    position: relative;
  }

  .tm-wrap .wf-iconselect {
    overflow: auto;
    height: 191px;
  }

  .tm-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    /* background: red; */
    /* background-image: url(/static/img/loginBg11.936629c.jpg); */
    background-size: 100% 100%;
  }
  .bpmnDialog .el-dialog {
    height:400px
  }

</style>
