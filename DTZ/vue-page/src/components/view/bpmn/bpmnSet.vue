<template>
  <div style="width: 100%;height:100%;position: relative" ref="bpmnBody" class="bpmnCss" id="bpmnCss">
    <div id="modeler" class="modeler" style="height: 100%">
      <div class="canvas" id="js-canvas" style="height: 100%"></div>
      <div id="js-properties-panel">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>{{title}}</span>
            <i :class="shrinkicon" @click='isPropertiesShow' style="float: left;font-size: 20px;margin-top: -6px" type="text"></i>
          </div>
          <div class="text item" id="box-card-body" >
            <el-form ref="form" label-width="80px" size="medium">
              <el-form-item label="id:" >
                <el-input v-model="base.id" v-on:change="changeID"></el-input>
              </el-form-item>
              <el-form-item label="名称:" >
                <el-input v-model="base.name" v-on:change="changeName"></el-input>
              </el-form-item>
              <el-form-item label="条件:" v-show="flowParamShow"  >
                <el-select v-model="base.condition" v-on:change="changeFlowCondition" placeholder="请选择">
                  <el-option
                    key="true"
                    label="同意"
                    value="true">
                  </el-option>
                  <el-option
                    key="false"
                    label="驳回"
                    value="false">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="表单编号:" v-show="false">
                <el-input v-model="base.formKey" v-on:change="changeFormCondition"></el-input>
              </el-form-item>
              <el-form-item label="审批类型" v-show="userTaskParamShow">
                <el-select v-model="base.approveType" v-on:change="addUserTaskCondition"  placeholder="请选择">
                  <el-option label="审批" value="1"></el-option>
                  <el-option label="任务" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="审批人类别" v-on:change="changeUserType" v-show="userTaskParamShow">
                <el-select v-model="userType"  placeholder="请选择">
                  <el-option label="指定成员" value="user"></el-option>
                  <el-option label="角色" value="role"></el-option>
                  <el-option label="部门负责人" value="depart"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用户:" v-show="userTaskParamShow&&userType==='user'">
                <div class="userTagClass" @click="openUserSelect">
                  <el-tag class="el-tag--depart" style="margin: 0 3px;" v-for="item in userList" :key="item.id">
                    {{item.name}}
                  </el-tag>
                </div>
              </el-form-item>
              <el-form-item label="角色:" v-show="userTaskParamShow&&userType==='role'">
                <el-select v-model="base.candidateGroup" multiple  v-on:change="addUserTaskCondition" placeholder="请选择">
                  <el-option
                    v-for=" item in roleList"
                    :key="item.id"
                    :label="item.rolename"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门:" v-show="userTaskParamShow&&userType==='depart'">
                <div class="userTagClass" @click="openDepartSelect">
                  <el-tag class="el-tag--depart" style="margin: 0 3px;" v-for="item in departList1" :key="item.id">
                    {{item.org_name}}
                  </el-tag>
                </div>
              </el-form-item>
              <el-form-item label="超时时间:" v-show="overTimeShow">
                <el-input-number size="small" :min="0" v-model="day"></el-input-number>天
                <el-input-number size="small" :max="23" :min="0" v-model="hour" style="margin-top: 6px"></el-input-number>小时
                <el-input-number size="small" :max='59' :min=0 v-model="minute"  style="margin-top: 6px"></el-input-number>分
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding-top: 10px;    text-align: right;" >
              <el-button size="small" @click="closeDialog('close')">取 消</el-button>
              <el-button size="small" type="primary" @click="submitForm()">保存</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!--人员选择器-->
    <el-dialog :modal="false" style="box-shadow: 5px 5px 5px #cccccc;" class="childDialog"
               :visible.sync="personSelectDialogShow"
               append-to-body
               :close-on-click-modal="false" width="40%">
      <div style="height: 400px;">
        <el-row :gutter="20" class="selectDepart" style="padding: 10px 20px">
          <el-col :span="24">
            <p class="departTitle">人员选择</p>
            <div class="surround">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree ref="treeChoose" :default-expand-all=true style="height: 260px;overflow: auto;"
                       show-checkbox
                       class="filter-tree" :data="TreeData" node-key="id"  :render-content="renderContent"
                       :props="defaultProps" @check-change="treeChange" :filter-node-method="filterNode">
              </el-tree>
            </div>
          </el-col>

        </el-row>
        <div style="text-align: right;margin-top: 10px;">
          <span slot="footer" class="dialog-footer" style="padding: 10px 20px">
            <el-button @click="closePersonSelectDialog(0)"
                       style="height: 28px;border-radius: 5px;padding: 0px 10px">取 消</el-button>
            <el-button type="primary" @click="closePersonSelectDialog(1)"
                       style="height: 28px;border-radius: 5px;padding: 0px 10px">确 定</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
    <!--部门选择器-->
      <el-dialog  :visible.sync="departDialogShow" append-to-body :modal="false"
                 :close-on-click-modal="false">
        <Org style="height: 335px;overflow-y: auto"
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
                <el-button type="primary" @click="closeDepartDialog(1)">确 定</el-button>
                </span>
        </div>
      </el-dialog>
  </div>
</template>
<script>
  import "bpmn-js/assets/bpmn-font/css/bpmn.css";
  import "bpmn-js/assets/bpmn-font/css/bpmn-embedded.css";
  import "bpmn-js/node_modules/diagram-js/assets/diagram-js.css";
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import propertiesPanelModule from 'bpmn-js-properties-panel'
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
  import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
  import debounce from 'lodash/debounce';
  import translates from 'assets/js/bpmn/custom-translate.js';//属性面板，按钮汉化
  import Org from 'common/departTree'
  export default {
    data() {
      return {
        bpmnJS: {},//bpmn对象
        propertiesPanelModule: {},//bpmn属性对象
        base: {//流程对象，
          id: '',//流程id
          name: '',//流程名称
          User: '',//用户
          candidateUsers: [],//候选用户
          candidateGroup: [],//候选用户组
          depart: [],//候选用户组
          formKey:'',//表单编号
          approveType: '1',//审批类型
          condition: []//流程flow条件
        },
        userList:[],//用户列表
        userType: 'user',//审批人类别
        roleList:[],//角色列表
        shrinkicon: 'el-icon-arrow-down',//面板伸缩图标
        flowParamShow:false,//流参数input显示/隐藏
        userTaskParamShow:false,//用户任务input显示/隐藏
        formParamShow: false,//表单input显示/隐藏
        xml:'',//流程图xml
        dialogVisible: false,//组织机构树弹窗:
        eventParamShow:false,//事件input显示/隐藏
        overTimeShow: true,//事件input显示/隐藏
        title: '',//面板标题
        dialogShow: false,
        departDialogShow: false,
        personSelectDialogShow: false,
        form_type: '',//表单提交类型
        modelId:'',
        TreeData: [],
        depart_org: [],
        filterText: '',
        day:0,//超时天数
        hour:0,//超时小时
        deployment_id: '',
        allUserArr: [],
        allDepartArr: [],
        departList1: [],
        setSelectList1: [],//部门选中项多个
        minute:0,//超时分钟
        procDefId: '',
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        expand: {
          type: Boolean,
          default: false
        },
      };
    },
    watch:{
      filterText(val) {
        this.$refs.treeChoose.filter(val);
      },

    },
    created: function () {
    },
    mounted: function () {
      //国际化替换文件
      let customTranslate = {
        translate: ['value', translates]
      }
      let _this = this;
      //实例化bpmn
      this.bpmnJS = new BpmnModeler({
        container: '#js-canvas',
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          propertiesPanelModule,
          propertiesProviderModule,
          customTranslate
        ]

      });
      //分离bpmn自带属性面板
      let propertiesPanel = this.bpmnJS.get('propertiesPanel');
      propertiesPanel.detach();
      this.mousedown();//点击图形鼠标按下事件
      this.mouseup();//点击图形鼠标松开事件
      let self=this;
      let exportArtifacts = debounce(function() {
        self.getDiagram(function(err, xml) {
          self.xml=xml;
        });
      }, 500);
      //监听流程图改变事件,并获取流程图xml文件
      this.bpmnJS.on('commandStack.changed', exportArtifacts);
      this.$nextTick(() => {
        _this.getRoleList();
        _this.getPlOrgListToTree(this.param);
      })
    },
    components: {
      Org,
    },
    computed: {},
    methods: {
      //得到xml
      getDiagram(done) {
        this.bpmnJS.saveXML({ format: true }, function(err, xml) {
          console.log(xml)
          done(err, xml);
        });
      },
      //保存svg
      closeDialog(type) {
        this.$emit('closeDialog', type)
      },
      //导入bpmn文件
      importXmL(xml) {
        let self = this;
        this.bpmnJS.importXML(xml, function (err) {
          if (err) {
            console.log('error rendering', err);
          } else {
            console.log('rendered');
          }
        });
      },
      //显示或隐藏属性面板
      isPropertiesShow(){
        if(this.shrinkicon=='el-icon-arrow-down'){
          this.shrinkicon='el-icon-arrow-up'
        }else{
          this.shrinkicon='el-icon-arrow-down'
        }
        $(".el-card__body").animate({ height:'toggle'});
      },
      //新增bpmn文件
      addBpmn(obj) {
        const bpmn = `<?xml version="1.0" encoding="UTF-8"?>
                      <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="http://bpmn.io" exporterVersion="0.10.1">
                        <process id="${obj.key}" name='${obj.name}' isExecutable="true" />
                        <bpmndi:BPMNDiagram id="BpmnDiagram_1">
                          <bpmndi:BPMNPlane id="BpmnPlane_1"  bpmnElement="${obj.key}"/>
                        </bpmndi:BPMNDiagram>
                      </definitions> `
        this.base.id = obj.key;
        this.base.name = obj.name;
        this.User = '';
        if (obj.form_type == 3) {
          this.formParamShow = true
        }
        this.candidateUsers = [];
        this.candidateGroup = [];
        this.formKey = '';
        this.condition = [];
        this.form_type = obj.form_type;
        this.deployment_id = obj.deployment_id;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.procDefId = obj.id;
        this.importXmL(bpmn)
        this.base.User = ''
        this.departList1 = [];
        this.userList = [];
        this.userTaskParamShow = false;
      },
      //修改editBpmn
      editBpmn(data){
        this.title = data.name;
        let str;
          str=this.byteToString(data.bytes.data)
        this.setOverTime(data.overtime);
        this.procDefId = data.id;
        if (data.form_type == 3) {
          this.formParamShow = true
       }
        this.importXmL(str)
        this.deployment_id = data.deployment_id;
        this.base.id = data.key;
        this.base.name = data.name;
        this.form_type = data.form_type;
        this.departList1 = [];
        this.userList = [];
        this.userTaskParamShow = false;
      },
      //设置超时时间
      setOverTime(n){
        var str = '';
        if (n /24/ 60/60 >> 0 >= 0) {
          this.day= (n /24/ 60/60 >> 0);
        }
        if (n / 60/60%24 >> 0 >= 0) {
          this.hour= (n / 60/60%24 >> 0);
        }
        if(n/60%60>> 0>=0){
          this.minute= (n/60%60>> 0)
        }
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
      },
      //鼠标按下监听事件
      mousedown() {
        let _this = this;
        this.bpmnJS.get('eventBus').on('element.mousedown', function (e) {
          const type=e.element.businessObject.$type;
          _this.base.id = e.element.id;
          _this.title ='';
          _this.selectElement = e.element;
          const attr=e.element.businessObject.$attrs;
          const condition=e.element.businessObject.conditionExpression;
          _this.isShowInput(type)
          _this.changeUserParam(type,attr)
          _this.setFlowCondition(type,condition)
          if (e.element.businessObject.name) {
            _this.base.name = e.element.businessObject.name;
            _this.title = e.element.businessObject.name;
          } else {
            _this.base.name = '';
          }
        });
      },
      //鼠标松开监听事件
      mouseup() {
        let _this = this;
        this.bpmnJS.get('eventBus').on('element.mouseup', function (e) {
          const type=e.element.businessObject.$type;
          const attr=e.element.businessObject.$attrs;
          const condition=e.element.businessObject.conditionExpression;
          _this.title ='';
          _this.isShowInput(type)
          _this.changeUserParam(type,attr)
          _this.setFlowCondition(type,condition)
          _this.base.id = e.element.id;
          _this.selectElement = e.element;
          if (e.element.businessObject.name) {
            _this.base.name = e.element.businessObject.name;
            _this.title = e.element.businessObject.name;
          } else {
            _this.base.name = '';
          }
        });
      },
      //显示隐藏输入框
      isShowInput(type){
        if(type=="bpmn:StartEvent"){
          this.flowParamShow=false;
          this.userTaskParamShow=false,
            this.eventParamShow=false;
        }else if(type=="bpmn:UserTask"){
          this.flowParamShow=false;
          this.userTaskParamShow=true,
            this.eventParamShow=false;
        }else if(type=="bpmn:Process"){
          this.flowParamShow=false;
          this.userTaskParamShow=false,
            this.eventParamShow=false;
        }else if(type=="bpmn:SequenceFlow"){
          this.flowParamShow=true;
          this.userTaskParamShow=false,
            this.eventParamShow=false;
        }else{
          this.flowParamShow=false;
          this.userTaskParamShow=false,
            this.eventParamShow=false;

        }
      },
      //修改flow条件
      setFlowCondition(type,condition) {
        this.base.condition='';
        if(type=='bpmn:SequenceFlow'){
          if(condition!=undefined&&condition.body!=undefined){
            this.base.condition=condition.body;
          }
        }
      },
      //修改用户
      changeUserParam(type,attr) {
        let _this=this
        this.base.User=''
        this.base.candidateUsers=[]
        this.base.candidateGroup=[]
        this.base.depart=[]
        this.base.formKey=''
        this.userList=[];
        this.departList1=[];
        if(type=='bpmn:UserTask'){
          if(attr.assignee!=undefined){
            let model=JSON.parse(attr.assignee);
            this.base.candidateUsers=model.candidateUsers;
            if(model.candidateUsers.length!=0){
              this.userType='user'
              model.candidateUsers.forEach(userId=>{
                this.allUserArr.forEach(item=>{
                  if(userId===item.id){
                    _this.userList.push(item)
                  }
                })
              })

            }else if(model.candidateGroup.length!=0){
              this.userType='role'
            }else if(model.depart.length!=0){
              this.userType='depart'
            }
            this.base.approveType=model.approveType;

            if(model.depart){
              model.depart.forEach(departId=>{
                this.allDepartArr.forEach(item=>{
                  if(departId===item.id){
                    item.org_name=item.name
                    _this.departList1.push(item)
                  }
                })
              })

              this.setSelectList1=model.depart;
            }
            this.base.candidateGroup=model.candidateGroup;
          }
          if(attr.formKey!=undefined){
            this.base.formKey=attr.formKey
          }
        }
      },
      //修改bpmnid
      changeID(value) {
        this.$nextTick(() => {
          let elementRegistry = this.bpmnJS.get('elementRegistry');
          var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
          this.bpmnJS.get('modeling').updateProperties(sequenceFlowElement, {
            id: value
          });
        })
      },
      //修改bpmn 名称
      changeName(value) {
        this.$nextTick(() => {
          let elementRegistry = this.bpmnJS.get('elementRegistry');
          var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
          this.bpmnJS.get('modeling').updateProperties(sequenceFlowElement, {
            name: value
          });
        })
      },
      //修改flow条件
      changeFlowCondition(value) {
        let label;
        let elementRegistry = this.bpmnJS.get('elementRegistry');
        let modeling=this.bpmnJS.get('moddle');
        var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
        var newCondition = modeling.create('bpmn:FormalExpression', {
          body: value
        });
        if(value=='false'){
          label='驳回'
        }else{
          label='同意'
        }

        this.bpmnJS.get('modeling').updateProperties(sequenceFlowElement, {
          conditionExpression: newCondition
        });

      },
      //修改表单编号
      changeFormCondition(value) {
        let elementRegistry = this.bpmnJS.get('elementRegistry');
        var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
        this.bpmnJS.get('modeling').updateProperties(sequenceFlowElement, {
          formKey: value
        });
      },
      //修改表单编号
      changeUserType(value) {
       this.userList=[];
       this.departList1=[];
       this.roleList=[];
      },

      //修改候选用户
      addUserTaskCondition(value) {
        let elementRegistry = this.bpmnJS.get('elementRegistry');
        var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
        let depart=[];
        this.departList1.forEach(item=>{
          depart.push(item.id)
        })
        let model={
          assignee:[],
          candidateGroup:this.base.candidateGroup,
          candidateUsers:this.base.candidateUsers,
          approveType:this.base.approveType,
          depart:depart,
        }
        console.log(1111,model)
        this.bpmnJS.get('modeling').updateProperties(sequenceFlowElement, {
          assignee : JSON.stringify(model)
        });
      },
      //byte转str
      byteToString(arr) {
        if(typeof arr === 'string') {
          return arr;
        }
        let str = '',
          _arr = arr;
        for(let i = 0; i < _arr.length; i++) {
          let one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
          if(v && one.length == 8) {
            let bytesLength = v[0].length;
            let store = _arr[i].toString(2).slice(7 - bytesLength);
            for(let st = 1; st < bytesLength; st++) {
              store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
          } else {
            str += String.fromCharCode(_arr[i]);
          }
        }
        return str;
      },
      //表单提交
      async submitForm() {
        let model = {
          id: this.procDefId,
          overtime: this.day * 24 * 60 * 60 + this.hour * 60 * 60 + this.minute * 60,
          deployment_id: this.deployment_id
        }
        if (this.xml != '') {
          model.xml = this.xml;
        }
        try {
          const res = await this.$http.post('/bpmn/BpmnController/editBpmn', model);
          if (res.data && res.data.success) {
            this.$message.success('保存成功');
            this.closeDialog();
          } else {
            this.$message.error(res.data.msg);
          }
        } catch (err) {
          this.$message.error('保存失败，' + err);
        }
      },
      //人员选择器dialog
      async closePersonSelectDialog(value) {
        let _this = this;

        if (value === 0) {
          this.userList = [];
          this.getPlOrgListToTree(this.param);
          this.personSelectDialogShow = false

        } else if (value === 1) {
          this.base.candidateUsers=[];
          let _this = this;
          this.personSelectDialogShow = false;
          let userArr = [];
            this.userList.forEach(item=>{
              this.base.candidateUsers.push(item.id)
            })
          this.addUserTaskCondition(this.userList);
        }
      },

      //查询角色列表
      async getRoleList(){
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryRoleList', {});
          if (res.data && res.data.success) {
            this.roleList=res.data.result;
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error('查询失败，'+err);
        }
      },
      //显示人员选择器
      openUserSelect() {
        this.personSelectDialogShow = true;
        this.$nextTick(() => {
          this.$refs.treeChoose.setCheckedNodes(this.userList)
        })

      },

      //显示部门选择器
      openDepartSelect() {
        this.departDialogShow = true;
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
       * 过滤tree数据
       * @param value
       * @param data
       * @returns {boolean}
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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
       * @param {Object} data 组织树回调
       */
      selectedNodes(data) {
        this.departTreeChangeArr1 = data;
      },
      /**
       * 部门选择
       */
      chooseDeparts() {
        this.dialogVisible = true;
        if(this.departList1.length>0){
          this.setSelectList1 = this.departList1.map((item)=>{
            return item.id;
          })
        }else{
          this.setSelectList1 = [];
        }
      },

      /**
       * 关闭dialog
       * @value 关闭状态 0 取消 1 确定
       */
      closeDepartDialog(value) {
        if (value === 1) {
          this.departList1 = this.departTreeChangeArr1;
          this.addUserTaskCondition(this.userList);
        }
        this.departDialogShow = false;
      }


    }

  }
</script>

<style>

  .bpmnCss .el-dialog__body {
    padding: 0;

  }
  .bpmnCss a:link {
    text-decoration: none;
  }

  .bpmnCss .content, .bpmnCss
  .content > div {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .bpmnCss .content > .message {
    text-align: center;
    display: table;
    font-size: 16px;
    color: #111;
  }

  .bpmnCss .content > .message .note {
    vertical-align: middle;
    text-align: center;
    display: table-cell;
  }

  .bpmnCss .content .error .details {
    max-width: 500px;
    font-size: 12px;
    margin: 20px auto;
    text-align: left;
  }

  .bpmnCss .content .error pre {
    border: solid 1px #CCC;
    background: #EEE;
    padding: 10px;
  }

  .bpmnCss .content:not(.with-error) .error,
  .bpmnCss .content.with-error .intro,
  .bpmnCss .content.with-diagram .intro {
    display: none;
  }

  .bpmnCss .content .canvas,
  .bpmnCss .content.with-error .canvas {
    visibility: hidden;
  }

  .bpmnCss .content.with-diagram .canvas {
    visibility: visible;
  }

  .bpmnCss .buttons {
    position: absolute;
    bottom: 20px;
    left: 20px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .bpmnCss .buttons > li {
    display: inline-block;
    margin-right: 10px;
  }

  .bpmnCss .buttons > li > a {
    background: #DDD;
    border: solid 1px #666;
    display: inline-block;
    padding: 5px;
  }

  .bpmnCss .buttons a {
    opacity: 0.3;
  }

  .bpmnCss .buttons a.active {
    opacity: 1.0;
  }

  .bpmnCss .io-control-list.io-horizontal, .bpmnCss .io-control-list.io-horizontal li {
    display: inline-block;
  }

  .bpmnCss .io-control-list {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  .bpmnCss .io-control-list.io-horizontal, .bpmnCss .io-control-list.io-horizontal li {
    display: inline-block;
  }

  .bpmnCss .bjs-powered-by, .cjs-powered-by, .io-control {
    background: #FFF;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    padding: 5px;
  }

  .bpmnCss .io-control-list a, .io-control-list a:visited, .io-control-list button {
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 22px;
    line-height: 26px;
    color: #555555;
    background: none;
    border: none;
  }

  .bpmnCss .io-control-list.io-horizontal, .io-control-list.io-horizontal li {
    display: inline-block;
  }

  .bpmnCss .io-control-list {
    list-style: none;
    padding: 5px;
    margin: 0;
  }

  .bpmnCss .bjs-powered-by, .bpmnCss .cjs-powered-by, .bpmnCss .io-control {
    background: #FFF;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    padding: 5px;
  }

  .bpmnCss .io-control-list a, .bpmnCss .io-control-list a:visited, .bpmnCss .io-control-list button {
    padding: 0;
    outline: none;
    cursor: pointer;
    font-size: 22px;
    line-height: 26px;
    color: #555555;
    background: none;
    border: none;
  }

  .bpmnCss .content,
  .bpmnCss .content > div {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .bpmnCss .content > .message {
    text-align: center;
    display: table;

    font-size: 16px;
    color: #111;
  }

  .bpmnCss .content > .message .note {
    vertical-align: middle;
    text-align: center;
    display: table-cell;
  }

  .bpmnCss .content .error .details {
    max-width: 500px;
    font-size: 12px;
    margin: 20px auto;
    text-align: left;
  }

  .bpmnCss .content .error pre {
    background: #EEE;
  }

  .bpmnCss .content:not(.with-error) .error,
  .bpmnCss .content.with-error .intro,
  .bpmnCss .content.with-diagram .intro {
    display: none;
  }

  .bpmnCss .content .canvas,
  .bpmnCss .content.with-error .canvas {
    visibility: hidden;
  }

  .bpmnCss .content.with-diagram .canvas {
    visibility: visible;
  }

  .bpmnCss .buttons {
    position: absolute;
    bottom: 20px;
    left: 20px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .bpmnCss .buttons > li {
    display: inline-block;
    margin-right: 10px;
  }

  .bpmnCss .buttons > li > a {
    background: #DDD;
    border: solid 1px #666;
    display: inline-block;
    padding: 5px;
  }

  .bpmnCss .buttons a {
    opacity: 0.3;
  }

  .bpmnCss .buttons a.active {
    opacity: 1.0;
  }

  .bpmnCss .userTagClass {
    height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 5px;
    line-height: 28px;
    overflow-y: auto;
    min-width: 180px;
    max-width: 300px;
    box-sizing: border-box;
  }


  .bpmnCss .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
    fill: red !important; /* color elements as green */
  }

  #js-properties-panel {
    position: absolute;
    top: 0px;
    right: 0;
    width: 320px;
    bottom: 0;
    z-index: 10;
    overflow: auto;
  }

  #js-properties-panel .el-card {
    height: 100%;

  }

  .bjs-powered-by {
    display: none;
  }

  .bpmnDialog .el-dialog__body {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0px;
    padding: 0;
    min-height: 600px;
    background: #fff;
  }




</style>
