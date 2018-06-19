<template>
  <div class="data-detail"
       :style="childrenHeight"
       v-show="showEventReport"
       style="flex:1;width: 280px;background: #ffffff;border: 1px solid #cccccc;">
    <div class="detail-head">
      <div class="detail-icon">
        <base-icon icon="newcarid"></base-icon>
      </div>
      <div class="detail-title">事件立案申请表</div>
      <div class="btn-close" @click="close_report">
        <base-icon icon="close"></base-icon>
      </div>

    </div>
    <div class="case-scroll" :style="contentHeight">

      <div class="detail-content">

        <el-form ref="form" :model="form" label-width="68px">
          <el-form-item label="事件分类">
            <el-select v-model="form.EventType" placeholder="事件分类" style="width: 100%;" @change="event_or_part">
              <el-option label="事件" value="事件"></el-option>
              <el-option label="部件" value="部件"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="事件大类">
            <el-select v-model="form.parent_name" placeholder="大类" @change="getEventChildren" filterable
                       style="width: 100%;">
              <el-option v-for="item of eventParent" :key="item.group_code" :label="item.group_name"
                         :value="item.group_code"></el-option>


            </el-select>

          </el-form-item>

          <!--<el-form-item label="部件大类"  v-show="Object.is(form.EventType,'部件')">-->
          <!--<el-select v-model="form.parent_name" placeholder="大类" @change="getPartChildren" filterable style="width: 100%;">-->
          <!--<el-option v-for="item of partParent" :key="item.group_code" :label="item.group_name"-->
          <!--:value="item.group_code"></el-option>-->


          <!--</el-select>-->

          <!--</el-form-item>-->

          <el-form-item label="事件小类">

            <el-select v-model="form.sub_name" placeholder="小类" filterable style="width: 100%;">
              <el-option v-for="item of childrenEventData" :key="item.group_code" :label="item.group_name"
                         :value="item.group_code"></el-option>
            </el-select>

          </el-form-item>
          <!--<el-form-item label="部件小类" v-show="Object.is(form.EventType,'部件')">-->

          <!--<el-select v-model="form.sub_name" placeholder="小类" filterable style="width: 100%;">-->
          <!--<el-option v-for="item of childrenPartData" :key="item.group_code" :label="item.group_name"-->
          <!--:value="item.group_code"></el-option>-->
          <!--</el-select>-->

          <!--</el-form-item>-->


          <el-form-item label="发生地点">
            <input type="text" v-model="form.ObjPosition" id="suggestion" style="width: 98%">
          </el-form-item>
          <el-form-item label="主管部门" v-model="form.DeptName1">
            <!--<el-select v-model="form.DeptName1" placeholder="主管部门" filterable>-->
            <!--<el-option v-for="item of depart_org" :key="item.org_code" :label="item.org_name"-->
            <!--:value="item.id"></el-option>-->
            <!--</el-select>-->

            <div class="userTagClass" @click="chooseDepart">
              <el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type"  v-for="item in departList0" :key="item.id">
                {{item.org_name}}
              </el-tag>
            </div>

          </el-form-item>
          <el-form-item label="来源">
            <el-select v-model="form.source" placeholder="来源" style="width: 100%;">
              <el-option v-for="item of eventSourceType" :key="item.typecode" :label="item.typename"
                         :value="item.typecode"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="问题描述">
            <el-input type="textarea" v-model="form.remarks" :autosize=true style="max-height: 66px"></el-input>
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
              :auto-upload="false" style="margin-top: 0px">
              <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
              <i class="el-icon-circle-plus-outline" style="font-size: 28px"></i>
            </el-upload>
          </el-form-item>

        </el-form>

      </div>
    </div>

    <div class="case-footer">
      <el-button type="success" style="height: 28px;width: 100%;" @click="sendCase()">确 定</el-button>

    </div>


    <!--新增编辑用户部门选择器-->
    <el-dialog title="部门选择" :visible.sync="editDialog" :close-on-click-modal="false">
      <dept-choose style="height: 335px;overflow-y: auto"
                   :dialog-visible="editDialog"
                   :setSelect='setSelectList0'
                   @selectdNode='selectedNode'
                   title="部门选择"
                   :strictly="true"
                   :multiple="false"
                   :index="index"
                   @addIndex="addIndex">
      </dept-choose>
      <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeEditDialog(1)">确 定</el-button>
                </span>
      </div>
    </el-dialog>

    <el-dialog title="选择流程" :visible.sync="showProcess" :close-on-click-modal="false">
      <el-table style="height: 335px;overflow-y: auto" v-loading="loading" :data="process_data">
        <el-table-column label="流程名" prop="name">
        </el-table-column>
        <el-table-column label="备注" prop="remarks">
        </el-table-column>
        <!--<el-table-column label="更新时间" prop="update_time">-->
        <!--</el-table-column>-->
        <!--<el-table-column label="面积(㎡)" prop="BGSQua"></el-table-column>-->
        <!--<el-table-column label="所属区域" >-->
        <!--</el-table-column>-->
        <!--<el-table-column label="备注" prop="Note">-->
        <!--<template slot-scope="scope">-->
        <!--<base-text-overflow :text="scope.row.Note"></base-text-overflow>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click='choose_process(scope.row)'>
              选择</el-button>
            <el-button type="text" @click='show_process(scope.row)'>

              查看</el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-dialog>


    <div v-show="dialogBpmnViewVisible" class="class_process" >
      <el-dialog :visible.sync="dialogBpmnViewVisible" :fullscreen="true">
        <bpmn-view ref="bpmnView"></bpmn-view>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import DeptChoose from '../user/DepartChoose'
  import BpmnView from '../bpmn/bpmnView'
  import {dateFormat} from "../../../assets/js/date";
  export default {
    components: {
      DeptChoose,
      BpmnView

    },
    data() {
      return {
        childrenHeight: {
          height: (document.body.clientHeight - 150) + 'px'
        },
        contentHeight: {
          height: (document.body.clientHeight - 220) + 'px'
        },
        eventSourceType: [], //事件来源类型
        form: {
          id: '',
          ObjCode: '',//事件代码
          ObjName: '',
          DeptCode1: '',
          DeptName1: '',
          ObjPosition: '',
          BGID: '',
          source: '',
          EventType: '事件',
          parent_name: '',
          group_code: '',
          area_code: '',
          areaCode: '',
          sub_name: '',
          verify_by: '',
          create_by: '',
          update_by: '',
          update_date: '',
          status: 0,
          is_check: 0,
          baidu_x: 0,
          baidu_y: 0,
          verify_date: '',
          remarks: '',
          sys_id: '',
          businesskey: ''
        },
        loading:false,
        parentEventData: [],
        childrenEventData: [],
        childrenPartData: [],
        partParent: [],
        eventParent: [],
        areaCodeList: [], //区域表
        cellData: [], //单元格
        event_group_data: [],
        departList0: [],//部门选择单个
        setSelectList0: [],//部门选中项单个
        editDialog:false,
        index: 0,
        fileList: [], //附件列表
        showProcess:false,
        process_data:[],
        dialogBpmnViewVisible: false,//流程图模态框是否显示
        depart_org:[],

      }
    },
    props: {
      showEventReport: {
        type: Boolean,
        default: false
      },


    },
    created() {
      console.log('129');
      this.dept_org();
      this.part_parent();
      this.parent_event();
      this.setAutoComplete();
      this.areaCode();
      this.getCellData();
      this.eventSource();
      // this.GetProcessList();

    },
    methods: {

      sendCase() {
        let _this = this;

        if (_this.form.DeptName1 === '' && _this.form.DeptCode1 === '') {
          _this.$message({
            message: '请选择主管部门',
            type: 'warning'
          });
          return
        }



        if(!_this.form.parent_name){
          _this.$message({
            message: '请选择事件分类',
            type: 'warning'
          });
          return
        }
        if(Object.is(_this.form.baidu_x,0)){
          _this.$message({
            message: '请确认发生地点',
            type: 'warning'
          });
          return
        } else {
             _this.GetProcessList();
              _this.showProcess = true

        }

      },

      choose_process(data){
        let _this = this;
        _this.$confirm('确定选用该流程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          _this.createCase(data);
        }).catch((error) => {
          console.log(error)
        })


      },

      show_process(data){

        this.dialogBpmnViewVisible = true;
        this.formTitle = "流程图";
        this.$nextTick(function(){
          this.$refs.bpmnView.setImportXml(data,[]);
        })
      },


      /**
       * 发起立案申请
       */

      async createCase(data) {
        let _this = this;
        let params = {
          case_code: '',
          case_type: Object.is(this.form.EventType, '事件') ? '1' : '2',
          key: 'caseProcess',
          username: _this.$getUserData('username'),
          userid: _this.$getUserData('id'),
          process_id:data.id,
          org_id: this.form.DeptName1
        };

        if(!this.form.group_code){
          this.form.group_code = this.form.sub_name
        }


        this.form.DeptCode1 = this.form.DeptName1;

        try{
          let resource = await _this.$http.get('/cms/EventController/queryEventGroup');
          if (resource.data.success) {
            _this.event_group_data = resource.data.result

          } else {
            _this.$message.warn('查询失败')
          }
          this.form.parent_name = this.group_code_parent(this.form.parent_name);
          this.form.sub_name = this.group_code_children(this.form.sub_name);

          let formData = new FormData();


          // let file = $('#file_upload input')[0].files;
          let file = _this.fileList;

          let query = Object.assign({}, params, this.form);

          this.parentEventData.forEach(item => {
            if(query.parent_name === item.id){
              query.parent_name = item.group_name

            }
          });

          query.create_by = _this.$getUserData('id');
          query.update_by = _this.$getUserData('id');
          query.source = this.nameChangeType(query.source);

          query.DeptName1 = this.IdChangeOrgName(query.DeptCode1);



          // let res = await _this.$http.post('/bpmn/BpmnController/startProcessInstance',Obj)
          console.log('853',query);


          let result = await _this.$http.post('/oa/OaCaseController/applyCreateCase', query);


          if (result.data && result.data.success) {
            $.each(result.data.result, function (i, val) {
              if (val !== null) {
                formData.append(i, val)
              }
            })

          }

          for (let i = 0; i < file.length; i++) {

            formData.append('file', file[i].raw);  //file就是文件

          }
          let res = await _this.$http.post('/oa/OaNotifyController/saveFile', formData);

          if (result.data.success) {
            _this.fileList = [];

            _this.showProcess = false;
            _this.$message({
              message: '立案成功',
              type: 'success'
            });

            this.$emit('OK', false);

          }



        }catch(error){
          _this.$message.error('发起失败')
        }


      },

      async GetProcessList(){
        let _this = this;
        console.log('434',_this.form);
        let param = {
          org_id: _this.form.DeptName1
        };
        try {

          let res = await _this.$http.post('/bpmn/BpmnController/cassProcessList',param);

          if(res.data.success){

            let data = res.data.result;

            for (let item of data) {

              if(item.create_time){
                item.create_time = dateFormat(new Date(item.create_time), 'yyyy-MM-dd hh:mm:ss');
              }
              if(item.update_time){
                item.update_time = dateFormat(new Date(item.update_time), 'yyyy-MM-dd hh:mm:ss');
              }
            }

            setTimeout(function () {
              _this.process_data = data
            }, 500);


          }

        }catch(error){
          _this.$message.error('请求错误', error);
        }
      },
      /**
       * sourceType转sourceName
       */
      typeChangeName(type) {
        for (let item of this.eventSourceType) {
          if (type === parseInt(item.typecode)) {
            return item.typename
          }
        }
      },
      nameChangeType(name) {
        for (let item of this.eventSourceType) {
          if (name === item.typename) {
            return item.typecode
          }

        }

      },
      /**
       * org_name转org_id
       */

      orgNameChangeId(name) {
        for (let item of this.depart_org) {
          if (name === item.org_name) {
            return item.id
          } else if (name === item.org_code) {
            return item.id
          } else if (name === '') {
            return ''

          }
        }

      },
      IdChangeOrgName(id) {
        console.log(id);

        for (let item of this.depart_org) {

          if (id === item.id) {
            console.log(item);

            return item.org_name
          } else if (id === '') {
            return ''

          }
        }

      },
      async part_parent() {
        try {
          const res = await this.$http.get(
            "/cms/PartsGroupController/queryPartsGroupForParent",
            {
              params: {
                parentId: 0
              }
            }
          );
          if (res.data.success) {
            this.partParent = res.data.result;
          }
        } catch (error) {
          console.log(error);
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
            _this.eventParent = result.data.result

          } else {
            _this.$message.warn('查询失败')
          }

        } catch (error) {
          _this.$message.error('查询失败')
        }
      },

      //获取事件来源类型
      async eventSource() {
        try {
          let result = await this.$http.get('/cms/EventController/eventSourceType');

          if (result.data.success) {
            this.eventSourceType = result.data.result

          } else {
            this.$message.warn('查询失败')
          }

        } catch (error) {
          this.$message.error('查询失败')
        }
      },

      //获取主管部门

      async dept_org() {
        let _this = this;
        try {
          let res = await _this.$http.get('/sys/DepartController/getDepartName')

          if (res.data.success) {
            _this.depart_org = res.data.result;
            _this.departOptions = transData(_this.depart_org, "id", "parent_id", "children");

            _this.$emit('depart', res.data.result)

          }
        } catch (error) {
          console.log('error', error)
        }
      },
      /**
       * 单个部门选择
       */
      chooseDepart() {
        this.editDialog = true;
        if(this.departList0.length>0){
          this.setSelectList0 = this.departList0.map((item)=>{
            return item.id;
          })
          this.index = 1;
        }else{
          this.setSelectList0 = [];
          this.index = 0;
        }
      },

      closeEditDialog(value) {
        if (value === 1) {
          this.departList0 = this.departTreeChangeArr0;
          this.form.DeptName1 = this.departList0[0].id;

        }
        this.editDialog = false;
      },
      addIndex(val){
        this.index = val;
      },
      selectedNode(data) {
        this.departTreeChangeArr0 = data;
      },
      event_or_part() {
        console.log('159', this.form);
      },
      async getPartChildren(data) {
        console.log('1', data)


        let _this = this;
        _this.form.sub_name = '';
        let param = {
          parent_id: data
        };
        try {
          let res = await _this.$http.post('/cms/EventController/queryPartChildren', param);

          if (res.data.success) {
            _this.childrenPartData = res.data.result
            console.log('198', _this.childrenPartData);

          }

        } catch (error) {
          _this.$message.error('查询失败')

        }

      },

      handleChange(file, fileList) {
        this.fileList = fileList

      },
      removeHandleChange(file, fileList) {
        this.fileList = fileList

      },
      async getEventChildren(data) {
        console.log('2', data);
        let _this = this;
        _this.form.sub_name = '';
        let param = {
          parent_id: data
        };
        try {
          let res = await _this.$http.post('/cms/EventController/queryChildrenEvent', param);

          if (res.data.success) {
            _this.childrenEventData = res.data.result

          }

        } catch (error) {
          _this.$message.error('查询失败')

        }

      },

      async event_report() {

        console.log('237', this.form)

        if (!this.form.ObjPosition) {
          this.$message({
            message: '请确定发生地点',
            type: 'warning'
          });
          return

        }
        if (!this.form.remarks) {
          this.$message({
            message: '请输入问题描述',
            type: 'warning'
          });
          return

        }

        let data = {
          userId: this.$getUserData('id'),
          objName: '',
          ObjPosition: this.form.ObjPosition,
          BGID: this.form.BGID,
          area_code: this.form.area_code,
          remarks: this.form.remarks,
          baidu_x: this.form.baidu_x,
          baidu_y: this.form.baidu_y,
          source: 1,
          type: Object.is(this.form.EventType, '事件') ? '1' : '2',
          group_code: this.form.sub_name,
          parent_name: '',
          sub_name: '',

        }
        try {
          let resource = await this.$http.get('/cms/EventController/queryEventGroup')
          if (resource.data.success) {
            this.event_group_data = resource.data.result

          } else {
            this.$message.warn('上报失败,请重试');
            return
          }
          data.parent_name = this.group_code_parent(this.form.parent_name);
          data.sub_name = this.group_code_children(this.form.sub_name);

          let result = await this.$http.post('/cms/EventController/allEventReport', data);

          if (result.data.success) {
            this.$message({
              message: '上报成功',
              type: 'success'
            });

            this.$emit('OK', false);

          }

        } catch (error) {
          console.log('281', error)
        }

      },

      close_report() {
        this.$emit('OK', false);
      },

      group_code_parent(code) {
        for (let item of this.event_group_data) {
          if (code === item.group_code) {
            return item.group_name

          } else if (code === item.group_name) {
            return item.group_name

          }

        }

      },
      group_code_children(code) {
        let _this = this;
        for (let item of _this.event_group_data) {
          if (code === item.group_code) {
            return item.group_name

          } else if (code === item.group_name) {
            return item.group_name

          }
        }
      },
      //获取区域全部信息
      async areaCode() {
        try {
          let res = await this.$http.get('/cms/AreaController/queryAllAreaData');
          if (res.data.success) {
            this.areaCodeList = res.data.result;


          }
        } catch (error) {
          console.log('查询失败')
        }
      },

      /**
       * 获取单元格信息
       */
      async getCellData() {
        try {

          const res = await this.$http.get("/cms/CellController/querCellAllList");
          if (res.data.success) {
            this.cellData = res.data.result;

          }
        } catch (error) {
          console.log(error);
        }
      },

      setStyleOptions() {
        const color =
          "#" +
          Math.random()
            .toString(16)
            .substring(2)
            .substr(0, 6);
        return {
          strokeColor: "red", //边线颜色。
          fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 1, //边线的宽度，以像素为单位。
          strokeOpacity: 1, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "dashed" //边线的样式，solid或dashed。
        };
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
      setAutoComplete(data) {

        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
          {
            "input": "suggestion"
            , "location": this.$parent.map
          });


        ac.addEventListener("onconfirm", e => {

          //鼠标放在下拉列表上的事件
          const _value = e.item.value;
          const myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
          this.setPlace(myValue, data);
        });


      },
      setPlace(value, data) {
        // this.$parent.map.clearOverlays(); //清除地图上所有覆盖物
        const vm = this;
        const myFun = () => {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果

          console.log('413',value);
          vm.$emit("getPoint", pp);
          vm.$emit("input", value);
          this.$parent.map.centerAndZoom(pp, 18);


          let maker = new BMap.Marker(pp);
          maker.enableDragging();
          this.$parent.map.addOverlay(maker);

          let myGeo = new BMap.Geocoder();

          // 将地址解析结果显示在地图上,并调整地图视野
          myGeo.getPoint(value, function(point){
            if (point) {
              vm.form.baidu_x = point.lng;
              vm.form.baidu_y = point.lat;
              vm.form.ObjPosition = value;

            }else{
              alert("您选择地址没有解析到结果!");
            }
          }, "曲靖市");


          maker.addEventListener("dragend", function (e) {  //拖动事件
            let dragPoint = e.point;
            let point = new BMap.Point(dragPoint.lng, dragPoint.lat);


            myGeo.getLocation(point, function (result) {
              if (result) {

                vm.form.baidu_x = dragPoint.lng;
                vm.form.baidu_y = dragPoint.lat;
                vm.form.ObjPosition = result.address;


                /**
                 * 反向推理获取当前所在单元格和所在区域
                 */

                for (const item of vm.areaCodeList) {
                  const arrPath = JSON.parse(item.scope_path);
                  if (arrPath != null) {

                    let pot = arrPath.map(ite => {
                      return new BMap.Point(ite.lng, ite.lat);
                    });
                    // var label = new BMap.Label(data.area_name, {
                    //   // offset: new BMap.Size(20, -10)
                    // });
                    const style = vm.setStyleOptions();
                    let polygonLayer = new BMap.Polygon(pot, style);
                    polygonLayer.data = data;
                    // polygonLayer.label = label;

                    let flag = BMapLib.GeoUtils.isPointInPolygon(point, polygonLayer);
                    console.log('350', flag);
                    if (flag) {

                      vm.form.areaCode = item.area_name;
                      vm.form.area_code = item.area_code
                    }
                  }
                }
                for (const item of vm.cellData) {
                  const arrPath = JSON.parse(item.scope_path);
                  if (arrPath != null) {

                    let pot = arrPath.map(ite => {
                      return new BMap.Point(ite.lng, ite.lat);
                    });
                    // var label = new BMap.Label(data.area_id, {
                    //   // offset: new BMap.Size(20, -10)
                    // });
                    const style = vm.setStyleOptions();
                    let polygonLayer = new BMap.Polygon(pot, style);
                    // polygonLayer.data = data;
                    // polygonLayer.label = label;

                    let flag = BMapLib.GeoUtils.isPointInPolygon(point, polygonLayer);

                    if (flag) {
                      vm.form.BGID = item.BGID
                    }
                  }
                }


              }
            });

            // _this.xinshuju = _this.newAddressInfo

            vm.$message({
              message: '位置已更新',
              type: 'warning'
            });

          });

        };
        var local = new BMap.LocalSearch(this.$parent.map, {
          //智能搜索
          onSearchComplete: myFun
        });
        local.search(value);
      },
    }
  }
</script>

<style scoped>

</style>
