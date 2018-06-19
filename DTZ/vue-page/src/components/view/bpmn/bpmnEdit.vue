<template>
  <div style="width: 100%;height:100%;" ref="bpmnBody" class="bpmnCss">
    <div id="modeler" class="modeler" style="height: 100%">
      <div class="canvas" id="js-canvas" style="height: 100%"></div>
      <div id="js-properties-panel">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span>{{title}}</span>
            <i :class="shrinkicon" @click='isPropertiesShow'style="float: left;font-size: 20px;margin-top: -6px " type="text"></i>
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
              <el-form-item label="表单编号:"  v-show="formParamShow" >
                <el-input v-model="base.formKey" v-on:change="changeFormCondition"></el-input>
              </el-form-item>
              <el-form-item label="用户:" v-show="userTaskParamShow" >
                <el-select v-model="base.User" clearable  placeholder="请选择" v-on:change="assigneeCondition">
                  <el-option
                    v-for=" item in userList"
                    :key="item.id"
                    :label="item.realname"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="候选用户:" v-show="userTaskParamShow" >
                <el-select v-model="base.candidateUsers" v-on:change="candidateUsersCondition"  multiple placeholder="请选择">
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.realname"
                    :value="item.id">
                  </el-option>
                </el-select>

              </el-form-item>
              <el-form-item label="角色:" v-show="userTaskParamShow" >
                <el-select v-model="base.candidateGroup" multiple  v-on:change="candidateGroupsCondition" placeholder="请选择">
                <el-option
                  v-for=" item in roleList"
                  :key="item.id"
                  :label="item.rolename"
                  :value="item.id">
                </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="超时时间:" >
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
          formKey:'',//表单编号
          condition: []//流程flow条件
        },
        userList:[],//用户列表
        roleList:[],//角色列表
        shrinkicon: 'el-icon-arrow-down',//面板伸缩图标
        flowParamShow:false,//流参数input显示/隐藏
        userTaskParamShow:false,//用户任务input显示/隐藏
        formParamShow:true,//表单input显示/隐藏
        xml:'',//流程图xml
        eventParamShow:false,//事件input显示/隐藏
        title: '',//面板标题
        formType:'add',//表单提交类型
        modelId:'',
        day:0,//超时天数
        hour:0,//超时小时
        minute:0,//超时分钟
        processID:''
      };
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
      this.getUserList();
      this.getRoleList();
    },
    components: {},
    computed: {},
    methods: {
      //得到xml
      getDiagram(done) {
        this.bpmnJS.saveXML({ format: true }, function(err, xml) {
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
      addBpmn() {
        let processId = 'Process_' + Math.random().toString(36).substr(2, 7)
        const bpmn = `<?xml version="1.0" encoding="UTF-8"?>
                      <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="http://bpmn.io" exporterVersion="0.10.1">
                        <process id="${processId}" isExecutable="true" />
                        <bpmndi:BPMNDiagram id="BpmnDiagram_1">
                          <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="${processId}" />
                        </bpmndi:BPMNDiagram>
                      </definitions> `
          this.base.id = processId;
          this.base.name='';
          this.User= '';
          this.candidateUsers= [];
          this.candidateGroup=[];
          this.formKey='';
          this.condition=[];
          this.day=0;
          this.hour=0;
          this.minute=0;
          this.formType='add'
          this.importXmL(bpmn)
      },
      //修改editBpmn
      editBpmn(data){
        this.formType='edit'
        this.modelId=data.id;
        this.title = data.name;
        let str;
        if(data.bytes==null){
          str = `<?xml version="1.0" encoding="UTF-8"?>
                      <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="http://bpmn.io" exporterVersion="0.10.1">
                        <process id="${data.key}" isExecutable="true" />
                        <bpmndi:BPMNDiagram id="BpmnDiagram_1">
                          <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="${data.key}" />
                        </bpmndi:BPMNDiagram>
                      </definitions> `
        }else{
           str=this.byteToString(data.bytes.data)
        }
        this.setOverTime(data.overtime);
        this.processID=data.key;
        this.importXmL(str)

      },
      //设置超时时间
      setOverTime(n){
        var str = '';
        if (n /24/ 60/60 >> 0 > 0) {
          this.day= (n /24/ 60/60 >> 0);
        }
        if (n / 60/60%24 >> 0 > 0) {
          this.hour= (n / 60/60%24 >> 0);
        }
        if(n/60%60>> 0>0){
          this.minute= (n/60%60>> 0)
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
          this.formParamShow=false;
        }else if(type=="bpmn:UserTask"){
          this.flowParamShow=false;
          this.userTaskParamShow=true,
          this.eventParamShow=false;
          this.formParamShow=true;
        }else if(type=="bpmn:Process"){
          this.flowParamShow=false;
          this.userTaskParamShow=false,
          this.eventParamShow=false;
          this.formParamShow=false;
        }else if(type=="bpmn:SequenceFlow"){
          this.flowParamShow=true;
          this.userTaskParamShow=false,
          this.eventParamShow=false;
          this.formParamShow=false;
        }else{
          this.flowParamShow=false;
          this.userTaskParamShow=false,
          this.eventParamShow=false;
          this.formParamShow=false;
        }
      },
      //修改用户
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
        this.base.User=''
        this.base.candidateUsers=[]
        this.base.candidateGroup=[]
        this.base.formKey=''
        if(type=='bpmn:UserTask'){
            if(attr.assignee!=undefined){
              let model=JSON.parse(attr.assignee);
              this.base.User=model.assignee
              this.base.candidateUsers=model.candidateUsers
              this.base.candidateGroup=model.candidateGroup
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
          let elementRegistry = this.bpmnJS.get('elementRegistry');
          let modeling=this.bpmnJS.get('moddle');
          var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
        var newCondition = modeling.create('bpmn:FormalExpression', {
          body: value
        });
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
      //修改用户编码
      assigneeCondition(value) {
          let elementRegistry = this.bpmnJS.get('elementRegistry');
          var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
          let model={assignee:this.base.User,
            candidateGroup:this.base.candidateGroup,
            candidateUsers:this.base.candidateUsers

          }
        this.bpmnJS.get('modeling').updateProperties(sequenceFlowElement, {
             assignee : JSON.stringify(model)
        });
      },
      //修改候选用户
      candidateUsersCondition(value) {
          let elementRegistry = this.bpmnJS.get('elementRegistry');
          var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
        let model={assignee:this.base.User,
          candidateGroup:this.base.candidateGroup,
          candidateUsers:this.base.candidateUsers

        }
           this.bpmnJS.get('modeling').updateProperties(sequenceFlowElement, {
             assignee : JSON.stringify(model)
        });
      },
      //修改候选用户组
      candidateGroupsCondition(value) {
          let elementRegistry = this.bpmnJS.get('elementRegistry');
          var sequenceFlowElement = elementRegistry.get(this.selectElement.id);
        let model={assignee:this.base.User,
          candidateGroup:this.base.candidateGroup,
          candidateUsers:this.base.candidateUsers

        }
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
      submitForm(){
        if(this.formType=='add'){
            this.addModel();
        }else if(this.formType=='edit'){
            this.editModel();
        }
      },
      //修改模型
      async editModel(){
        let  model={
          id:this.modelId,
          overtime:this.day*24*60*60+this.hour*60*60+this.minute*60
        }

        if(this.xml!=''){
          model.xml=this.xml;
        }
        try{
          const res = await this.$http.post('/bpmn/BpmnController/updateModel', {params:model});
          if (res.data && res.data.success) {
            this.$message.success('修改成功');
            this.closeDialog();
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error('修改失败，'+err);
        }
      },
      //新增
      async addModel(){
        let  model={
          xml:this.xml
        }
        try{
          const res = await this.$http.post('/bpmn/BpmnController/addModel', {params:model});
          if (res.data && res.data.success) {
            this.$message.success('新增成功');
            this.closeDialog();
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error('新增失败，'+err);
        }
      },
      //查询用户列表
      async getUserList(){
        try{
          const res = await this.$http.post('/bpmn/BpmnController/queryUserList', {});
          if (res.data && res.data.success) {
            this.userList=res.data.result;
          }else{
            this.$message.error(res.data.msg);
          }
        }catch(err){
          this.$message.error('查询失败，'+err);
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
    padding: 0
  }

</style>
