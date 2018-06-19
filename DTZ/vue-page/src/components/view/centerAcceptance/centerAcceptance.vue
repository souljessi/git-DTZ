<template>
  <keep-alive>
    <div v-loading="allLoading" element-loading-text="加载中" element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="map-view">
        <base-map :center="center" :height="height" @ready="ready" :zoom="16"></base-map>
      </div>

      <div class="text-input">
        <!--<input type="text" v-model="address" id="suggestId" placeholder="请输入地址"/>-->
        <!--<div class="text-close" @click="clearInput()">-->
          <!--<base-icon icon="close"/>-->
        <!--</div>-->

        <div class="" @click="showAreaSearch" title="区域查找" style="color:#ffffff;cursor: pointer;margin: auto">
            <i class="el-icon-d-arrow-right el-icon--right" v-show="!showArea" style="margin-left: 0px;font-size: 22px"></i>
            <i class="el-icon-d-arrow-left el-icon--left" v-show="showArea" style="margin-right: 0px;font-size: 22px"></i>

        </div>

      </div>
      <div class="text-add">
        <!-- 地图工具 -->
        <div class="control-map-tool">
          <!-- 地图工具选择 -->
          <div class="control-content-tool">
            <div  class="control-content-tool-item "
                  @click="event_report" title="事件立案申请">
              <div>
                <base-icon class="control-icon" icon="shijian"/>
              </div>
              <!--<span>{{toolAreaInfo.toolPartName}}</span>-->
            </div>

          </div>
        </div>



      </div>


      <transition name="slide-showArea">

      <div class="area-search" style="background: #409EFF;"v-show="showArea">

        <el-form :model="searchForm" inline ref="searchForm" label-width="300px" width="320px">
          <el-form-item label="" style="margin:3px" label-width="300px">

            <el-cascader @change="selectArea" :placeholder='searchForm.area_name' :props="areaProps"
                         :options="areaOptions" clearable
                         filterable style="width: 240px;">
            </el-cascader>
          </el-form-item>




          <!--<el-form-item prop="type_name" label="">-->
            <!--<el-select v-model="searchForm.type_name" placeholder="" @change="searchFormType">-->
              <!--<el-option-->
                <!--v-for="item in option2"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->

          <!--<el-form-item label="">-->
            <!--<el-cascader-->
              <!--@change="partsTypeChange"-->
              <!--:props="groupProps"-->
              <!--:options="partsTypeOptions"-->
              <!--clearable-->
              <!--filterable>-->
            <!--</el-cascader>-->
          <!--</el-form-item>-->
        </el-form>




      </div>
      </transition>


      <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
      <div class="data-view" v-show="showPartInfo">
        <div class="data-head">
          <div class="data-head-title">
            <div class="data-head-title-one">
              <div class="title-one" v-text="partInfo.cms_parts_group.group_name"></div>

              <div class="title-two"><span v-text="partInfo.cms_parts_group.parent_id !== undefined ? partInfo.cms_parts_group.parent_id : '公用设施'"></span></div>
            </div>
            <div class="title-three" @click="openPartsDetails()"><span>上报部件</span></div>
            <div class="btn-close" style="margin-left: 5px" @click="showPartInfo = false">
              <base-icon icon="close"></base-icon>
            </div>
          </div>
          <div class="data-head-address">
            <div class="icon">
              <base-icon icon="map"/>
            </div>
            <div class="address" v-text="partInfo.address_name"></div>
          </div>
        </div>

        <div class="data-status">
          <div class="data-status-one">
            部件状态:
          </div>
          <span class="data-status-two">
        <div :style="icon_color"><base-icon :icon="icon_text" style="font-size: 18px"></base-icon></div>
        <div :style="icon_color" v-text="partInfo.ObjState"></div>
      </span>

        </div>
        <div class="data-describe">
          <div class="data-describe-title">描述</div>
          <div class="data-describe-address" v-text="partInfo.Note"></div>
          <div class="data-describe-image" style="width: 95%">
            <base-img :src="showImg" class="case-image"/>
          </div>
        </div>
        <!--<div class="data-event">-->
        <!--<div class="data-event-title">-->
        <!--事件记录-->
        <!--</div>-->
        <!--<div class="data-event-list">-->
        <!--<div class="data-event-list-item">-->
        <!--<div class="event-describe">-->
        <!--<div class="event-icon">icon</div>-->
        <!--<div class="event-address">春城路雨水井盖陷落(北向南)</div>-->
        <!--<div class="event-date">2018-01-04 13:37</div>-->
        <!--</div>-->
        <!--<div class="event-reason">公共部件故障</div>-->
        <!--</div>-->

        <!--</div>-->
        <!--</div>-->
      </div>

      <!--<div class="data-tab" v-show="showBack">-->
        <!--<div class="back-icon" @click="comeBack()">-->
          <!--<base-icon icon="back"></base-icon>-->
        <!--</div>-->
        <!--<div class="back-text" @click="comeBack()">返回</div>-->
        <!--<div class="back-address" v-text="partInfo.address_name"></div>-->
        <!--<div class="back-result">的搜索结果</div>-->
      <!--</div>-->


      <div class="data-detail" v-show="showPartDetail" :style="childrenHeight"
           style="flex:1;width: 280px;background: #ffffff;border: 1px solid #cccccc;">
        <div class="detail-head">
          <div class="detail-icon">
            <base-icon icon="newcarid"></base-icon>
          </div>
          <div class="detail-title">部件详情</div>
          <div class="btn-close" @click="closePage()">
            <base-icon icon="close"></base-icon>
          </div>

        </div>
        <div class="case-scroll" :style="contentHeight">

          <div class="detail-content">

            <el-form ref="partInfo" :model="partInfo" label-width="68px">
              <el-form-item label="部件标码" prop="ObjID">
                <el-input :readonly=true v-model="partInfo.ObjID"></el-input>
              </el-form-item>

              <el-form-item label="主管部门" prop="Dept1" v-model="partInfo.DeptName1">

                <div class="userTagClass" @click="chooseDepart">
                  <el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type"  v-for="item in departList0" :key="item.id">
                    {{item.org_name}}
                  </el-tag>
                </div>

              </el-form-item>

              <el-form-item label="权属单位" v-model="partInfo.DeptName2">


                <div class="userTagClass" @click="chooseDepart1">
                  <el-tag class="el-tag--depart" :type="item.type" v-for="item in departList1" :key="item.id">
                    {{item.org_name}}
                  </el-tag>
                </div>

              </el-form-item>

              <el-form-item label="养护单位"v-model="partInfo.DeptName3">
                <div class="userTagClass" @click="chooseDepart2">
                  <el-tag class="el-tag--depart" :type="item.type" v-for="item in departList2" :key="item.id">
                    {{item.org_name}}
                  </el-tag>
                </div>

              </el-form-item>
              <el-form-item label="部件分类">
                <el-input :readonly=true v-model="partInfo.cms_parts_group.parent_id"></el-input>

              </el-form-item>

              <el-form-item label="部件大类">
                <el-input  :readonly=true v-model="partInfo.cms_parts_group.parent_id"></el-input>

              </el-form-item>

              <el-form-item label="部件小类">
                <el-input :readonly=true v-model="partInfo.cms_parts_group.group_name"></el-input>

              </el-form-item>

              <el-form-item label="发生地点">
                <el-input type="textarea" v-model="partInfo.address_name" :readonly=true></el-input>
              </el-form-item>

              <el-form-item label="单位网格">
                <el-input :readonly=true v-model="partInfo.BGID"></el-input>
              </el-form-item>
              <el-form-item label="数据来源">

                <el-select v-model="partInfo.DataSource" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="(item ,index) in sourceType"
                    :label="item.label"
                    :value="item.label"
                    :key="index">
                  </el-option>
                </el-select>

              </el-form-item>
              <el-form-item label="初始日期">
                <!--<el-input v-model="partInfo.DataSource"></el-input>-->
                <el-input :readonly=true v-model="partInfo.create_date"></el-input>

              </el-form-item>
              <el-form-item label="变更日期">
                <!--<el-input v-model="partInfo.DataSource"></el-input>-->
                <el-input :readonly=true v-model="partInfo.update_date"></el-input>

              </el-form-item>

              <el-form-item label="问题描述">
                <el-input type="textarea" v-model="partInfo.Note" :autosize=true style="max-height: 66px"></el-input>
              </el-form-item>

              <div class="case-desc">
                <div class="case-desc-title">事件图片</div>
                <div class="case-desc-image" style="width: 95%;">
                  <base-img :src="showImg" class="case-image"/>
                </div>
              </div>
            </el-form>

          </div>
        </div>

        <div class="case-footer">
          <el-button type="success" style="height: 28px;width: 100%;" @click="isOrg_process()">发起立案申请</el-button>

        </div>
      </div>


      <event-report :showEventReport="show_event_report" @OK="ok_report"></event-report>



      <div class="center-accept-layer" :style="layerRight">
        <!-- 地图工具 -->
        <div class="control-map-tool">
          <!-- 地图工具选择 -->
          <div class="control-content-tool">
            <div  class="control-content-tool-item " :class="{'control-content-tool-color': oneActive}"
                 @click="setTool(1)" :title="toolAreaInfo.toolPartName">
              <div>
                <base-icon class="control-icon" icon="quyu"/>
              </div>
              <!--<span>{{toolAreaInfo.toolPartName}}</span>-->
            </div>
            <div style="margin-top:5px" class="control-content-tool-item" :class="{'control-content-tool-color': twoActive}"
                 @click="setTool(2)" :title="toolCellInfo.toolPartName">
              <div>
                <base-icon class="control-icon" icon="danyuange"/>
              </div>
              <!--<span>{{toolCellInfo.toolPartName}}</span>-->
            </div>
            <!-- 案件、部件显示隐藏 -->
            <div style="margin-top:5px" class="control-content-tool-item"
                 :class="{'control-content-tool-color': threeActive}" @click="setTool(3)" :title="toolInfo.toolPartName">
              <div>
                <base-icon class="control-icon" :icon="toolInfo.toolPartIcon" />
              </div>
              <!--<span>{{toolInfo.toolPartName}}</span>-->
            </div>

            <div style="margin-top:5px" class="control-content-tool-item" :class="{'control-content-tool-color': fourActive}"
                 @click="setTool(4)" :title="toolEventInfo.toolPartName">
              <div>
                <base-icon class="control-icon" :icon="toolEventInfo.toolPartIcon"/>
              </div>
              <!--<span>{{toolEventInfo.toolPartName}}</span>-->
            </div>

            <div style="margin-top:5px" class="control-content-tool-item"
                 @click="addressSearch()" :title="toolReturnInfo.toolPartName">
              <div>
                <!--<base-icon class="control-icon" :icon="toolReturnInfo.toolPartIcon"/>-->
                <i class="el-icon-refresh" style="font-size: 25px"></i>
              </div>
                <!--<span style="font-size:12px">{{toolReturnInfo.toolPartName}}</span>-->
            </div>
          </div>
        </div>



      </div>

      <div class="event-wrapper" :style="wrapperHeight">
        <transition name="slide-fade">
          <event-list v-show="disShow" :showList="showScreen"
                      @layerShow="layerShow" @ievent="ievent"

                      :message-info="parentInfo"
                      :showClose="closeChild"
                      @depart="depart" />
        </transition>
      </div>
      <!--主管部门选择器-->
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

      <!--权属单位选择器-->
      <el-dialog title="部门选择" :visible.sync="unitDialog" :close-on-click-modal="false">
        <dept-choose style="height: 335px;overflow-y: auto"
                     :dialog-visible="unitDialog"
                     :setSelect='setSelectList1'
                     @selectdNode='selectedNode1'
                     title="部门选择"
                     :strictly="true"
                     :multiple="false"
                     :index="index1"
                     @addIndex="addIndex1">
        </dept-choose>
        <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeUnitDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeUnitDialog(1)">确 定</el-button>
                </span>
        </div>
      </el-dialog>

      <!--保护单位选择器-->
      <el-dialog title="部门选择" :visible.sync="protectDialog" :close-on-click-modal="false">
        <dept-choose style="height: 335px;overflow-y: auto"
                     :dialog-visible="protectDialog"
                     :setSelect='setSelectList2'
                     @selectdNode='selectedNode2'
                     title="部门选择"
                     :strictly="true"
                     :multiple="false"
                     :index="index2"
                     @addIndex="addIndex2">
        </dept-choose>
        <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeProtectDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeProtectDialog(1)">确 定</el-button>
                </span>
        </div>
      </el-dialog>



      <el-dialog title="选择流程" :visible.sync="showProcess" :close-on-click-modal="false">
        <el-table style="height: 335px;overflow-y: auto" v-loading="loading" :data="process_data">
          <el-table-column label="流程名" prop="name">
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time">
          </el-table-column>
          <el-table-column label="更新时间" prop="update_time">
          </el-table-column>

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
  </keep-alive>
</template>

<script>
  import {
    transData,
    getDicData,
    getCenterPoint,
    formatSeconds,addMapLayer} from "assets/js/commonManage.js";
  import BaseMap from "common/BaseMap";
  import paging from "common/BasePaging.vue";
  import BaseImg from "common/BaseImg";

  import eventList from './eventList'
  import {dateFormat} from "../../../assets/js/date";

  import DeptChoose from '../user/DepartChoose';
  import BpmnView from '../bpmn/bpmnView';
  import EventReport from './EventReport.vue'

  const mapv = require("mapv");
  export default {
    components: {
      BaseMap,
      paging,
      eventList,
      BaseImg,
      DeptChoose,
      BpmnView,
      EventReport

    },
    data() {
      return {
        parentInfo:{},
        closeChild:false,
        height: document.body.clientHeight - 50,
        childrenHeight: {
          height: (document.body.clientHeight - 150) + 'px'
        },
        contentHeight: {
          height: (document.body.clientHeight - 220) + 'px'
        },
        option2:[{
          value: '1',
          label: '部件'
        },
          {
            value: '2',
            label: '事件'
          }

        ],
        searchForm: {
          area_name: '区域',
          type_name: '部件',
          type_state: ''
        },
        layerRight: {
          right: 290 + 'px'
        },
        partsTypeOptions:[],
        groupProps: {
          value: "group_code",
          label: "group_name",
          children: "children",
          disabled: "disabled"
        },
        areaOptions: [],
        areaProps: {
          value: "value",
          label: "area_name",
          children: "children",
          disabled: "disabled"
        },
        toolInfo: {
          toolPartName: "隐藏部件",
          toolPartIcon: "bujian",
          toolCaseRLi: "热力图"
        },
        toolEventInfo: {
          toolPartName: "隐藏事件",
          toolPartIcon: "shijian",
          toolCaseRLi: "热力图"
        },
        toolReturnInfo: {
          toolPartName: "重置",
          toolPartIcon: "home",
          toolCaseRLi: "热力图"
        },
        toolAreaInfo: {
          toolPartName: "隐藏区域",
          toolPartIcon: "yincan",
          toolCaseRLi: "热力图"
        },
        toolCellInfo: {
          toolPartName: "隐藏网格",
          toolPartIcon: "yincan",
          toolCaseRLi: "热力图"
        },
        showScreen: true,
        address: '',
        disShow: true,
        toolMode: 2, //地图工具模式 (1:区域选择 2：单元格选择 3：热力图)
        partGroupData: [], //部件大类数据
        partsGroupData:[], //部件分类
        eventGroupData:[],//事件分类

        partsGroupMode: "", // 部件类型复选框
        searchPartsMode: "", //部件搜索
        selectList: {
          //区域，单元格下拉选择
          areaSelectMode: "", //区域select选择
          cellSelectMode: "" // 单元格select选择
        },
        icon_color: {
          color: '#2cc26b'
        },
        icon_text: 'wanhao',
        tabsIndex: 1, //选项卡切换初始值
        loading: false, //遮罩
        allLoading: true,
        partsData: [], //损坏部件数据
        allPartsData: [], //所有部件数据
        eventData: [], //事件数据
        map: "", //地图

        center: {
          //地图中心点
          lng: 103.671826,
          lat: 25.037481
        },
        areaData: [], //区域数据
        cellData: [], //单元格数据
        defaultStyle: {
          //多边形style
          // 默认样式
          strokeColor: this.$webconfig.PolygonStyle.strokeColor, //边线颜色。
          fillColor: this.$webconfig.PolygonStyle.fillColor, //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 2, //边线的宽度，以像素为单位。
          strokeOpacity: 1, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "solid" //边线的样式，solid或dashed。
        },
        markerClusterer: "", //聚合图层
        marks: [], //聚合所有点坐标信息
        caseMarkerClusterer: "", //部件聚合图层
        eventMarkerClusterer: "",
        conditionMarkerClusterer: "",
        partsConditionMarkerClusterer: "",

        partsMarks: [], //部件聚合所有点坐标信息
        eventMarks: [], //事件聚合所有点坐标信息
        conditionMarks: [],
        partsConditionMarks: [],
        tabPage: {
          //分页
          totalNum: 0,
          currentPage: 1,
          pageSize: 15,
          pageSizes: [15, 30, 50]
        },

        screenHeight: document.body.clientHeight-125,
        showPartInfo: false,
        showBack: false,
        showPartDetail: false,
        show_event_report:false,
        parentEventData: [], //事件大类数据
        partInfo: {
          DataSource: "",
          DeptName1: "",
          DeptCode1: '',
          DeptName2: "",
          DeptCode2: '',
          DeptCode3: '',
          DeptName3: "",
          ORDate: null,
          CHDate: null,
          Note: "",
          ObjID: "",
          ObjName: "",
          BGID: "",
          ObjState: "",
          address_name: "",
          create_by: '',
          create_date: '',
          update_by: '',
          update_date: '',
          baidu_x: "",
          baidu_y: "",
          cms_parts_group: {
            id: 8,
            parent_id: 2,
            group_name: "",
            group_pic_path: ""
          },
          id: "",
          pic_path: ""
        },

        partTypeStyle: [
          {
            key: "全部"
          },
          {
            key: "完好",
            value: "#2cc26b",
            icon: "wanhao"
          },
          {
            key: "损坏",
            value: "#e6a23c",
            icon: "sunhuai"
          },
          {
            key: "废弃",
            value: "#f56c6c",
            icon: "feiqi"
          },
          {
            key: "丢失",
            value: "#909399",
            icon: "diushi"
          }
        ],

        cascaderProps: {
          value: "org_code",
          label: "org_name",
          children: "children",
          disabled: "disabled"
        },
        CascaderArray:[],
        CascaderArray2:[],
        CascaderArray3:[],
        departOptions: [],
        groupList: [],

        depart_org: [],  //部门
        sourceType: [],
        oneActive: false,
        twoActive: false,
        threeActive: false,
        fourActive: false,

        chooseArea:[],
        showArea: false,
        NoDept:'',
        departList0: [],//主管部门选择单个
        departList1:[],//权属单位
        departList2:[],//养护单位
        editDialog:false,
        unitDialog:false,
        protectDialog:false,
        setSelectList0: [],//部门选中项单个
        setSelectList1: [],//权属单位选中项单个
        setSelectList2: [],//养护单位选中项单个
        index: 0,
        index1:0,
        index2:0,
        showProcess: false,
        process_data:[],
        dialogBpmnViewVisible: false,//流程图模态框是否显示
        // newAddressInfo:{
        //   baidu_x:'',
        //   baidu_y:'',
        //   address_name:'',
        //   area_info:{},
        //   cell_info:{}
        // }
        newAddressInfo:{},
        eventStateType: [],//事件状态类型

      };
    },
    computed: {
      wrapperHeight() {
        return {
          height: (document.body.clientHeight - 50) + 'px'
        }
      },
      height() {
        return document.body.clientHeight - 50;
      },
      areaSelectOptions() {
        let list = this.areaData.filter(item => {
          return item.scope_path != null && item.scope_path != undefined;
        });
        return list;
      },
      cellSelectOptions() {
        let list = this.cellData.filter(item => {
          return item.area_id == this.selectList.areaSelectMode;
        });
        return list;
      },
      showImg() {
        // let imgList=['']
        let imgList = this.partInfo.pic_path.split(",");
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

    },
    created() {
      this.dept_org();
      this.eventState();
      this.sourceType = getDicData('bjsjly');
      this.getPGData();
      this.getEVData();
      // this.GetProcessList()
    },
    mounted() {
      const vm = this;
      window.addEventListener('resize', function() {
        vm.$nextTick(function() {
          vm.height = document.body.clientHeight - 50;
          vm.$log('Height:',vm.height)
        });
      });

    },
    methods: {
      layerShow(data) {

        if (data === true) {
          this.layerRight.right = 570 + 'px'

        } else {
          this.layerRight.right = 290 + 'px'
        }

      },
      showAreaSearch(){
        this.showArea = !this.showArea

      },

      //获取事件状态类型
      async eventState() {
        try {
          let result = await this.$http.get('/cms/EventController/eventStateType');
          if (result.data.success) {
            this.eventStateType = result.data.result

          } else {
            this.$message.warn('查询失败')
          }

        } catch (error) {
          this.$message.error('查询失败')

        }
      },
      /**
       * StateType转name
       */
      stateChangeName(state) {
        for (let item of this.eventStateType) {
          if (state == parseInt(item.typecode)) {
            return item.typename
          }
        }
      },
      ievent(data) {
        let _this = this;

        console.log('750',data);

        if(!data.baidu_x || !data.baidu_y){

          let myGeo = new BMap.Geocoder();

          // myGeo.getPoint(data.ObjPosition, function(point){
          //   if (point) {
          //     console.log('756',point);
          //     _this.map.centerAndZoom(point, 16);
          //
          //     for (let eventItem of _this.parentEventData) {
          //       let icon;
          //       if (data.parent_name === eventItem.group_name) {
          //          icon = new BMap.Icon(`http://${_this.$webconfig.serverIp}/${eventItem.group_pic_path}`, new BMap.Size(30, 30))
          //
          //       }else {
          //          icon = new BMap.Icon(`http://${_this.$webconfig.serverIp}/static/upload/eventIcons/其他事件.svg`,new BMap.Size(30,30))
          //       }
          //
          //       let Options = {
          //         icon: icon,
          //         title: data.ObjPosition
          //       };
          //
          //
          //       let maker = new BMap.Marker(point,Options);
          //       // maker.enableDragging();
          //       _this.map.addOverlay(maker);
          //
          //
          //
          //       maker.addEventListener("dragend", function (e) {  //拖动事件
          //         let dragPoint = e.point;
          //         let point = new BMap.Point(dragPoint.lng, dragPoint.lat);
          //
          //
          //         myGeo.getLocation(point, function (result) {
          //           if (result) {
          //             console.log('位置信息', result);
          //             _this.newAddressInfo.baidu_x = dragPoint.lng;
          //             _this.newAddressInfo.baidu_y = dragPoint.lat;
          //             _this.newAddressInfo.address_name = result.address;
          //
          //
          //             /**
          //              * 反向推理获取当前所在单元格和所在区域
          //              */
          //
          //             for (const item of _this.areaData) {
          //               const arrPath = JSON.parse(item.scope_path);
          //               if (arrPath != null) {
          //
          //                 let pot = arrPath.map(ite => {
          //                   return new BMap.Point(ite.lng, ite.lat);
          //                 });
          //                 var label = new BMap.Label(data.area_name, {
          //                   // offset: new BMap.Size(20, -10)
          //                 });
          //                 const style = _this.setStyleOptions();
          //                 let polygonLayer = new BMap.Polygon(pot, style);
          //                 polygonLayer.data = data;
          //                 polygonLayer.label = label;
          //
          //                 let flag = BMapLib.GeoUtils.isPointInPolygon(point, polygonLayer);
          //                 console.log(flag)
          //                 if (flag) {
          //                   _this.newAddressInfo.area_info = item;
          //
          //
          //                 }
          //               }
          //             }
          //             for (const item of _this.cellData) {
          //               const arrPath = JSON.parse(item.scope_path);
          //               if (arrPath != null) {
          //
          //                 let pot = arrPath.map(ite => {
          //                   return new BMap.Point(ite.lng, ite.lat);
          //                 });
          //                 var label = new BMap.Label(data.area_id, {
          //                   // offset: new BMap.Size(20, -10)
          //                 });
          //                 const style = _this.setStyleOptions();
          //                 let polygonLayer = new BMap.Polygon(pot, style);
          //                 polygonLayer.data = data;
          //                 polygonLayer.label = label;
          //
          //                 let flag = BMapLib.GeoUtils.isPointInPolygon(point, polygonLayer);
          //                 console.log(flag)
          //                 if (flag) {
          //                   _this.newAddressInfo.cell_info = item
          //                 }
          //               }
          //             }
          //
          //
          //             _this.$store.dispatch("setNewAddress", _this.newAddressInfo);
          //
          //           }
          //         });
          //
          //
          //         // _this.xinshuju = _this.newAddressInfo
          //
          //       });
          //
          //     }
          //
          //
          //
          //   }else{
          //     // alert("您选择地址没有解析到结果!");
          //   }
          // }, "陆良县");


        } else{
          // this.togleLayer(this.showMarks, 2, 2);
          const point = new BMap.Point(data.baidu_x, data.baidu_y);
          // this.map.panTo(point);

          let content =
            `<div class="map-windInfo" style="font-size: 12px;">
            <div>事件标识码：${this.setText(data.ObjCode)}</div>
             <div>事件类型：${this.setText(data.parent_name)}</div>
             <div>事件状态：${this.setText(this.stateChangeName(data.status))}</div>
             <div>事件位置：${this.setText(data.ObjPosition !== '' ? data.ObjPosition : '无')}</div>
            <div>小类名称：${this.setText(data.sub_name !=='' ? data.sub_name : '无')}</div>
            <div>上报时间:${this.setText(dateFormat(new Date(data.create_date),'yyyy-MM-dd hh:mm:ss'))}</div>
            </div>
            `;
          var infoWindow = new BMap.InfoWindow(content, {
            width: 250
          }); // 创建信息窗口对象
          this.map.openInfoWindow(infoWindow, point);
          this.map.centerAndZoom(point,19);
          // this.isShowPartInfo = true;
          // this.partInfo = Object.assign({}, data);
          // this.getPartsCaseInfo(data.id);
        }


      },

      // inewPoint(data){
      //   function myFun() {
      //     var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
      //     this.map.centerAndZoom(pp, 24);
      //     this.map.addOverlay(new BMap.Marker(pp));    //添加标注
      //   }
      //
      //   var local = new BMap.LocalSearch(map, { //智能搜索
      //     onSearchComplete: myFun
      //   });
      //   local.search(data);
      //
      // },

      //部件大类name/id转换
      name_id(id) {
        let _this = this;
        for (let item of _this.partGroupData) {
          if (id === item.id) {
            return item.group_name

          }
        }
      },
      //区域编码转code
      areaCode_name(code) {
        let _this = this;
        for (let item of _this.areaData) {
          if (code === item.area_code) {
            return item.area_name
          }
        }
      },
      IDareaCode_name(code) {
        let _this = this;
        for (let item of _this.areaData) {
          if (code === item.id) {
            return item.area_name
          }
        }
      },

      IdChangeOrgName(id){

        for (let item of this.depart_org) {

          if (id === item.id) {
            console.log('item',item);
            return item.org_name
          } else if(id === ''){
            return '暂无'

          }
        }

      },
      /**
       * 获取部件分类信息
       */
      async getPGData() {
        const res = await this.$http.get("basesource/PartsController/getPGData");
        if (res.data && res.data.success) {
          this.partsGroupData = res.data.result;
        } else {
          this.$message.error(res.data.msg);
        }
      },

      /**
       * 获取事件分类信息
       */

      async getEVData(){
        const res = await this.$http.get('basesource/PartsController/getEVData')
        if (res.data && res.data.success) {
          this.eventGroupData = res.data.result;
        } else {
          this.$message.error(res.data.msg);
        }
      },

      depart(data) {
        this.depart_org = data
      },
      selectArea(data) {
        console.log('1025');
        this.chooseArea = data;

        this.caseMarkerClusterer.clearMarkers();
        this.eventMarkerClusterer.clearMarkers();
        this.conditionMarkerClusterer.clearMarkers();
        this.partsConditionMarkerClusterer.clearMarkers();

       this.map.clearOverlays();



        let areaLayer = this.$store.getters.getMapLayers.area || [];
        let cellLayer = this.$store.getters.getMapLayers.cell || [];
        for (const item of areaLayer) {
          this.map.removeOverlay(item);
        }

        for (const item of cellLayer) {
          this.map.removeOverlay(item);
        }


        if(data.length> 0){
          this.conditionMarks = [];
          this.partsConditionMarks = [];

          let info = data[data.length - 1];
          let arr = JSON.parse(info.scope_path);


          if (arr != null) {
            console.log('857',info);
            this.addPolygon(info);
            for (const itemAr of this.cellData) {
              if(info.id === itemAr.area_id){
                this.addPolygon(itemAr,1, itemAr.BGID);
              }

            }
            let point = arr.map(item => {
              return new BMap.Point(item.lng, item.lat);
            });


            let pot = new BMap.Point(arr[0].lng, arr[0].lat);
            this.map.centerAndZoom(pot, 16);
            const style = this.setStyleOptions1();
            let polygonLayer = new BMap.Polygon(point, style); //建立多边形覆盖物
            polygonLayer.data = data;
            //判断事件是否在某个区域内
            let mark = [];
            this.eventData.forEach(item => {
              let pt = new BMap.Point(item.baidu_x, item.baidu_y);
              let flag = BMapLib.GeoUtils.isPointInPolygon(pt, polygonLayer);
              if (flag) {
                for (let eventItem of this.parentEventData) {
                  if (item.parent_name === eventItem.group_name) {
                    let icon = new BMap.Icon(`http://${this.$webconfig.serverIp}/${eventItem.group_pic_path}`, new BMap.Size(40, 40))
                    let Options = {
                      icon: icon,
                      title: item.ObjPosition
                    };
                    let marker = new BMap.Marker(pt, Options);
                    marker.data = item;
                    this.markerEventListener(marker);
                    mark.push(marker);
                    this.conditionMarks.push(marker)
                  }
                }
              }
            });

            let marks = [];
            this.partsData.forEach(item => {
              let pt = new BMap.Point(item.baidu_x, item.baidu_y);
              let flag = BMapLib.GeoUtils.isPointInPolygon(pt, polygonLayer);
              if (flag) {

                let icon = new BMap.Icon(
                  `http://${this.$webconfig.serverIp}/${
                    item.cms_parts_group.group_pic_path
                    }`,
                  new BMap.Size(30, 30)
                );
                let Options = {
                  icon: icon,
                  title: item.ObjPosition
                };
                let marker = new BMap.Marker(pt, Options);
                marker.data = item;

                this.markerEventListener(marker);
                marks.push(marker)
                this.partsConditionMarks.push(marker);
              }
            });
            this.conditionMarkerClusterer.addMarkers(mark);
            this.partsConditionMarkerClusterer.addMarkers(marks);
          } else {
            this.$message({
              message: '该地未划分区域单元格',
              type: 'warning'
            });
          }


        }else {
          this.caseMarkerClusterer.addMarkers(this.partsMarks);
          this.eventMarkerClusterer.addMarkers(this.eventMarks);
          for (const itemAr of this.areaData) {
            this.addPolygon(itemAr);
          }
          for (const itemAr of this.cellData) {
            this.addPolygon(itemAr,1, itemAr.BGID);
          }
        }


      },
      searchFormType(data){
        this.conditionMarkerClusterer.clearMarkers();
        this.partsConditionMarkerClusterer.clearMarkers();
        this.caseMarkerClusterer.clearMarkers();
        this.eventMarkerClusterer.clearMarkers();
        this.conditionMarks = [];
        this.partsConditionMarks = [];
        if(data==='2'){
          this.partsTypeOptions = transData(this.eventGroupData, "id", "parent_id", "children");
          if(this.chooseArea.length > 0){
            let info = this.chooseArea[this.chooseArea.length - 1];
            let arr = JSON.parse(info.scope_path);
            if (arr != null) {
              let point = arr.map(item => {
                return new BMap.Point(item.lng, item.lat);
              });
              const style = this.setStyleOptions();
              let polygonLayer = new BMap.Polygon(point, style); //建立多边形覆盖物
              polygonLayer.data = data;
              //判断事件是否在某个区域内
              let mark = [];
              this.eventData.forEach(item => {
                let pt = new BMap.Point(item.baidu_x, item.baidu_y);
                let flag = BMapLib.GeoUtils.isPointInPolygon(pt, polygonLayer);
                if (flag) {
                  for (let eventItem of this.parentEventData) {
                    if (item.parent_name === eventItem.group_name) {
                      let icon = new BMap.Icon(`http://${this.$webconfig.serverIp}/${eventItem.group_pic_path}`, new BMap.Size(40, 40))
                      let Options = {
                        icon: icon,
                        title: item.ObjPosition
                      };
                      let marker = new BMap.Marker(pt, Options);
                      marker.data = item;
                      this.markerEventListener(marker);
                      mark.push(marker);
                      this.conditionMarks.push(marker)
                    }
                  }
                }
              });

              this.conditionMarkerClusterer.addMarkers(mark);
          }

        } else {
            let mark = [];
            this.eventData.forEach(item => {
              let pt = new BMap.Point(item.baidu_x, item.baidu_y);
                for (let eventItem of this.parentEventData) {
                  if (item.parent_name === eventItem.group_name) {
                    let icon = new BMap.Icon(`http://${this.$webconfig.serverIp}/${eventItem.group_pic_path}`, new BMap.Size(40, 40))
                    let Options = {
                      icon: icon,
                      title: item.ObjPosition
                    };
                    let marker = new BMap.Marker(pt, Options);
                    marker.data = item;
                    this.markerEventListener(marker);
                    mark.push(marker);
                    this.conditionMarks.push(marker)
                  }
                }

            });

            this.conditionMarkerClusterer.addMarkers(mark);
          }
        }
        if(data === '1'){
          this.partsTypeOptions = transData(this.partsGroupData, "id", "parent_id", "children");
          if(this.chooseArea.length > 0){
            let info = this.chooseArea[this.chooseArea.length - 1];
            let arr = JSON.parse(info.scope_path);
            if (arr != null) {
              let point = arr.map(item => {
                return new BMap.Point(item.lng, item.lat);
              });
              const style = this.setStyleOptions();
              let polygonLayer = new BMap.Polygon(point, style); //建立多边形覆盖物
              polygonLayer.data = data;
              //判断事件是否在某个区域内
              let mark = [];

              this.partsData.forEach(item => {
                let pt = new BMap.Point(item.baidu_x, item.baidu_y);
                let flag = BMapLib.GeoUtils.isPointInPolygon(pt, polygonLayer);
                if (flag) {

                  let icon = new BMap.Icon(
                    `http://${this.$webconfig.serverIp}/${
                      item.cms_parts_group.group_pic_path
                      }`,
                    new BMap.Size(30, 30)
                  );
                  let Options = {
                    icon: icon,
                    title: item.ObjPosition
                  };
                  let marker = new BMap.Marker(pt, Options);
                  marker.data = item;

                  this.markerEventListener(marker);
                  mark.push(marker);
                  this.partsConditionMarks.push(marker);
                }
              });


              this.partsConditionMarkerClusterer.addMarkers(mark);
            }

          } else {
            let marks = [];
            this.partsData.forEach(item => {
              let pt = new BMap.Point(item.baidu_x, item.baidu_y);
                let icon = new BMap.Icon(
                  `http://${this.$webconfig.serverIp}/${
                    item.cms_parts_group.group_pic_path
                    }`,
                  new BMap.Size(30, 30)
                );
                let Options = {
                  icon: icon,
                  title: item.ObjPosition
                };
                let marker = new BMap.Marker(pt, Options);
                marker.data = item;

                this.markerEventListener(marker);
                marks.push(marker)
                this.partsConditionMarks.push(marker);

            });
            this.partsConditionMarkerClusterer.addMarkers(marks);

          }
        }

      },

      partsTypeChange(data){
        this.conditionMarkerClusterer.clearMarkers();
        this.partsConditionMarkerClusterer.clearMarkers();
        this.caseMarkerClusterer.clearMarkers();
        this.eventMarkerClusterer.clearMarkers();
        let info = data[data.length - 1];
        let marks = [];

        if(this.searchForm.type_name == "1"){
          if(this.partsConditionMarks.length > 0){
            this.partsConditionMarks.forEach(item => {
              if(info === item.data.group_code){
                marks.push(item)

              }
            });
            this.partsConditionMarkerClusterer.addMarkers(marks);
          }

        }else if(this.searchForm.type_name == "2") {
          if(this.conditionMarks.length > 0){
            this.conditionMarks.forEach(item => {
              if(info === item.data.group_code){
                marks.push(item)
                }
            })

            this.conditionMarkerClusterer.addMarkers(marks)
          }

        }

      },
      // selectDept(data) {
      //
      //   let info = data[data.length - 1];
      //   // this.partsForm.area_id = info.id;
      //
      //   this.NoDept = info;
      // },

      selectDept(data) {
        if(data){
          let info = data[data.length - 1];
          // this.form.area_id = info.id;
          this.partInfo.DeptCode1 = info;
          // this.selectArea = info;
          for (let item of this.depart_org) {
            if (this.partInfo.DeptCode1 === item.org_code) {
              this.partInfo.DeptName1 = item.org_name
            }
          }

        }else {
          this.CascaderArray.push(this.partInfo.DeptName1)
        }

      },
      selectBelongCompany(data) {

        if(data){
          let info = data[data.length - 1];
          // this.form.area_id = info.id;
          this.partInfo.DeptCode2 = info;
          // this.selectArea = info;
          for (let item of this.depart_org) {
            if (this.partInfo.DeptCode2 === item.org_code) {
              this.partInfo.DeptName2 = item.org_name
            }
          }

        }else {
          this.CascaderArray2.push(this.partInfo.DeptName2)
        }
      },
      selectCuringCompany(data) {
        if(data){
          let info = data[data.length - 1];
          // this.form.area_id = info.id;
          this.partInfo.DeptCode3 = info;
          // this.selectArea = info;
          for (let item of this.depart_org) {
            if (this.partInfo.DeptCode3 === item.org_code) {
              this.partInfo.DeptName3 = item.org_name
            }
          }

        }else {
          this.CascaderArray3.push(this.partInfo.DeptName3)
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

          }
        } catch (error) {
          console.log('error', error)
        }
      },
      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange(val) {
        this.tabPage.pageSize = val;
        // this.getAreaData();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        // this.getAreaData();
      },
      /**
       * 清除按钮
       */
      clearInput() {
        let _this = this
        _this.address = ''
      },
      /**
       * 获取部件大类分类信息
       */
      async getPartGroupData() {
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
            this.partGroupData = res.data.result;
          }
        } catch (error) {
          console.log(error);
        }
      },

      addressSearch() {
        /**
         * 百度地图逆地址查询
         */
        let myGeo = new BMap.Geocoder();
        let point = new BMap.Point(103.671826, 25.037481);
        this.map.centerAndZoom(point, 16);
        // const _self = this;
        // myGeo.getPoint(
        //   _self.address,
        //   function (point) {
        //
        //     if (point) {
        //       _self.map.centerAndZoom(point, 16);
        //       _self.map.addOverlay(new BMap.Marker(point));
        //       _self.map.panTo(point, {
        //         noAnimation: false
        //       });
        //
        //       // _self.map.addOverlay(new BMap.Marker(point));
        //     } else {
        //       _self.$message({
        //         message: "当前地址搜索无定位信息，请手动拖动地图查找",
        //         type: "warning"
        //       });
        //     }
        //   },
        //   "陆良县"
        // );

      },
      /**
       * 返回按钮
       */
      comeBack() {
        let _this = this;
        _this.showPartInfo = true;
        _this.showPartDetail = false;
        _this.showBack = false

      },
      /**
       * 上报事件按钮
       */
      openPartsDetails() {
        let _this = this;

        this.departList0 = [];
        this.departList1 = [];
        this.departList2 = [];
        console.log('1050',this.partInfo);
        console.log('1052',this.partInfo.DeptName1)
        this.selectDept();
        this.selectBelongCompany();
        this.selectCuringCompany();
        _this.showPartInfo = false
        _this.showPartDetail = true
        _this.showBack = true
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

      chooseDepart1() {
        this.unitDialog = true;
        if(this.departList1.length>0){
          this.setSelectList1 = this.departList1.map((item)=>{
            return item.id;
          });
          this.index1 = 1;
        }else{
          this.setSelectList1 = [];
          this.index1 = 0;
        }
      },
      chooseDepart2() {
        this.protectDialog = true;
        if(this.departList2.length>0){
          this.setSelectList2 = this.departList2.map((item)=>{
            return item.id;
          });
          this.index2 = 1;
        }else{
          this.setSelectList2 = [];
          this.index2 = 0;
        }
      },
      selectedNode(data) {
        this.departTreeChangeArr0 = data;
      },
      addIndex(val){
        this.index = val;
      },

      selectedNode1(data) {
        this.departTreeChangeArr1 = data;
      },
      addIndex1(val){
        this.index1 = val;
      },

      selectedNode2(data) {
        this.departTreeChangeArr2 = data;
      },
      addIndex2(val){
        this.index2 = val;
      },


      closeEditDialog(value) {
        if (value === 1) {
          this.departList0 = this.departTreeChangeArr0;
          this.partInfo.DeptName1 = this.departList0[0].id;
          console.log(this.departList0)
        }
        this.editDialog = false;
      },
      closeUnitDialog(value) {
        if (value === 1) {
          this.departList1 = this.departTreeChangeArr1;
          this.partInfo.DeptName2 = this.departList1[0].id;
          console.log(this.departList1)
        }
        this.unitDialog = false;
      },
      closeProtectDialog(value) {
        if (value === 1) {
          this.departList2 = this.departTreeChangeArr2;
          this.partInfo.DeptName3 = this.departList2[0].id;
          console.log(this.departList2)
        }
        this.protectDialog = false;
      },

      async GetProcessList(){
        let _this = this;
        console.log('1589',_this.partInfo);
        let param = {
          org_id: _this.partInfo.DeptName1
        }
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

      isOrg_process(){
        let _this = this;

        if ((_this.partInfo.DeptName1 === ''|| _this.partInfo.DeptName1 === '暂无' ) && _this.partInfo.DeptCode1 === '') {
          _this.$message({
            message: '请选择主管部门',
            type: 'warning'
          });
        } else if (_this.partInfo.Note === '') {
          _this.$message.error('请填写问题描述');
          return

        }else {
          _this.GetProcessList();
          _this.showProcess = true

        }

      },
      show_process(data){
        console.log('2021',data.bytes);
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
        let Obj = {
          key: 'caseProcess',
          username: _this.$getUserData('username'),
          userid: _this.$getUserData('id'),
          process_id:data.id,
          org_id: this.partInfo.DeptName1
        };

        _this.partInfo.create_by = _this.$getUserData('id');
        // _this.partInfo.create_date = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        _this.partInfo.update_by = _this.$getUserData('id');
        _this.partInfo.update_date = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        _this.partInfo.DeptCode1 = _this.partInfo.DeptName1;
        _this.partInfo.DeptCode2 =  _this.partInfo.DeptName2;
        _this.partInfo.DeptCode3 = _this.partInfo.DeptName3;


        _this.partInfo.DeptName1 = _this.IdChangeOrgName(_this.partInfo.DeptCode1);
        _this.partInfo.DeptName2 = _this.IdChangeOrgName(_this.partInfo.DeptCode2);
        _this.partInfo.DeptName3 = _this.IdChangeOrgName(_this.partInfo.DeptCode3);

        let query = Object.assign({}, Obj, _this.partInfo);




        if( query.DeptCode1 === '' || Object.is(query.DeptCode1, '暂无')){
          _this.$message({
            message: '请选择主管部门',
            type: 'warning'
          });
        }else {
          console.log('1688',query);

          try {
            // let res = await _this.$http.post('/bpmn/BpmnController/startProcessInstance',Obj);
            let result = await _this.$http.post('/oa/OaCaseController/applyPartCase', query);
            if (result.data.success) {
              _this.$message.success(result.data.msg);
              _this.$message.success('立案成功');
              _this.showPartDetail = false;
              _this.showProcess = false;
            }

          } catch (error) {
            _this.$message.error('发起失败')

          }
        }

      },

      /**
       * 部件详情关闭
       */
      closePage() {
        let _this = this;
        _this.showPartInfo = true;
        _this.showPartDetail = false;
        _this.showBack = false
      },

      /**
       * 选项卡切换事件
       * @param {Number} index  选项卡选中序号
       */

      tabsClick(index) {
        this.tabsIndex = index;
      },

      /**
       * 设置地图选择工具
       * @param {Number} index 工具序号
       */
      setTool(index) {
        if (index === 1) {
          this.oneActive = !this.oneActive;
          if (this.oneActive) {
            this.toolAreaInfo.toolPartName = "显示区域";
            let areaLayer = this.$store.getters.getMapLayers.area || [];
            for (const item of areaLayer) {
              this.map.removeOverlay(item);
            }

          } else {
            if(this.twoActive === false){
              let cellLayer = this.$store.getters.getMapLayers.cell || [];
              for (const itemCell of cellLayer) {
                this.map.removeOverlay(itemCell);
              }
              if(this.chooseArea.length>0){           // 判断左上角有没有选了区域，选了后按照区域条件来隐藏和显示区域
                let info = this.chooseArea[this.chooseArea.length - 1];
                let arr = JSON.parse(info.scope_path);

                if (arr != null) {
                  this.addPolygon(info);
                  for (const itemAr of this.cellData) {
                    if(info.id === itemAr.area_id){
                      this.addPolygon(itemAr,1, itemAr.BGID);
                    }

                  }
                  let point = arr.map(item => {
                    return new BMap.Point(item.lng, item.lat);
                  });


                  let pot = new BMap.Point(arr[0].lng, arr[0].lat);
                  this.map.centerAndZoom(pot, 16);
                  const style = this.setStyleOptions1();
                  let polygonLayer = new BMap.Polygon(point, style); //建立多边形覆盖物
                  polygonLayer.data = this.chooseArea;
                  //判断事件是否在某个区域内
                  let mark = [];
                  this.eventData.forEach(item => {
                    let pt = new BMap.Point(item.baidu_x, item.baidu_y);
                    let flag = BMapLib.GeoUtils.isPointInPolygon(pt, polygonLayer);
                    if (flag) {
                      for (let eventItem of this.parentEventData) {
                        if (item.parent_name === eventItem.group_name) {
                          let icon = new BMap.Icon(`http://${this.$webconfig.serverIp}/${eventItem.group_pic_path}`, new BMap.Size(40, 40))
                          let Options = {
                            icon: icon,
                            title: item.ObjPosition
                          };
                          let marker = new BMap.Marker(pt, Options);
                          marker.data = item;
                          this.markerEventListener(marker);
                          mark.push(marker);
                          this.conditionMarks.push(marker)
                        }
                      }
                    }
                  });

                  let marks = [];
                  this.partsData.forEach(item => {
                    let pt = new BMap.Point(item.baidu_x, item.baidu_y);
                    let flag = BMapLib.GeoUtils.isPointInPolygon(pt, polygonLayer);
                    if (flag) {

                      let icon = new BMap.Icon(
                        `http://${this.$webconfig.serverIp}/${
                          item.cms_parts_group.group_pic_path
                          }`,
                        new BMap.Size(30, 30)
                      );
                      let Options = {
                        icon: icon,
                        title: item.ObjPosition
                      };
                      let marker = new BMap.Marker(pt, Options);
                      marker.data = item;

                      this.markerEventListener(marker);
                      marks.push(marker)
                      this.partsConditionMarks.push(marker);
                    }
                  });
                  this.conditionMarkerClusterer.addMarkers(mark);
                  this.partsConditionMarkerClusterer.addMarkers(marks);
                } else {
                  this.$message({
                    message: '该地未划分区域单元格',
                    type: 'warning'
                  });
                }

              }else {                                 //没有选中区域的情况，显示所有区域
                for (const itemAr of this.areaData) {
                  this.addPolygon(itemAr);
                }

                for (const itemCe of this.cellData) {
                  this.addPolygon(itemCe, 1, itemCe.BGID);
                }
              }

            }else {
              for (const itemArea of this.areaData) {
                this.addPolygon(itemArea);
              }

            }

            this.toolAreaInfo.toolPartName = "隐藏区域"
          }
        }

        if (index === 2) {
          this.twoActive = !this.twoActive;
          if (this.twoActive) {
            this.toolCellInfo.toolPartName = "显示单元";
            let cellLayer = this.$store.getters.getMapLayers.cell || [];
            for (const item of cellLayer) {
              this.map.removeOverlay(item);
            }

          } else {

            if(this.chooseArea.length>0){ //判断左上角有没有选中区域
              let info = this.chooseArea[this.chooseArea.length - 1];
              let arr = JSON.parse(info.scope_path);

              if (arr != null) {
                this.addPolygon(info);
                for (const itemAr of this.cellData) {
                  if(info.id === itemAr.area_id){
                    this.addPolygon(itemAr,1, itemAr.BGID);
                  }

                }

              } else {
                this.$message({
                  message: '该地未划分区域单元格',
                  type: 'warning'
                });
              }

            }else {
              for (const item of this.cellData) {
                this.addPolygon(item, 1, item.BGID);
              }
            }
            this.toolCellInfo.toolPartName = "隐藏单元"
          }
        }

        if (index === 3) {
          this.threeActive = !this.threeActive;
          if (!this.threeActive) {
            this.toolInfo.toolPartName = "隐藏部件";
            if(this.chooseArea.length > 0){
              this.caseMarkerClusterer.addMarkers(this.partsConditionMarks)

            }else {
              this.caseMarkerClusterer.addMarkers(this.partsMarks);
            }

          } else {
            this.toolInfo.toolPartName = "显示部件";
            this.caseMarkerClusterer.clearMarkers();
            this.partsConditionMarkerClusterer.clearMarkers();

          }
        }
        if (index === 4) {
          this.fourActive = !this.fourActive;
          if (!this.fourActive) {
            this.toolEventInfo.toolPartName = "隐藏事件";
            if(this.chooseArea.length>0){
              this.eventMarkerClusterer.addMarkers(this.conditionMarks)
            }else {

              this.eventMarkerClusterer.addMarkers(this.eventMarks);
            }

          } else {
            this.toolEventInfo.toolPartName = "显示事件";
            this.eventMarkerClusterer.clearMarkers();
            this.conditionMarkerClusterer.clearMarkers();

          }
        }
      },

      /**
       * 显示/隐藏部件图层信息
       * @param mark 点坐标集合    默认 所有部件坐标信息
       * @param isToogle    是否进行动态切换想 默认1 自动切换 2 不切换
       * @param way 操作来源，控制在不切换环境下是否渲染图层 默认 1
       */
      togleLayer(mark, isToogle, Way) {
        const marks = mark || this.marks;
        const istoogle = isToogle == 1 ? true : false;
        const way = Way || 1;

        this.caseMarkerClusterer.clearMarkers();

      },

      /**
       * 设置多边形随机颜色配置
       */

      setStyleOptions() {
        const color =
          "#" +
          Math.random()
            .toString(16)
            .substring(2)
            .substr(0, 6);
        return {
          strokeColor: this.$webconfig.PolygonStyle.strokeColor, //边线颜色。
          fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 1, //边线的宽度，以像素为单位。
          strokeOpacity: 1, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "dashed" //边线的样式，solid或dashed。
        };
      },

      setStyleOptions1() {
        const color =
          "#" +
          Math.random()
            .toString(16)
            .substring(2)
            .substr(0, 6);
        return {
          strokeColor: "blue", //边线颜色。
          fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 2, //边线的宽度，以像素为单位。
          strokeOpacity: 1, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "dashed" //边线的样式，solid或dashed。
        };
      },

      /**i
       * 添加地图图层
       * @param {Object} data 数据源
       * @param {Number} type 数据类型，默认为0 （区域类型） 1：单元格类型
       */
      async addPolygon(data, type, show) {
        let _this = this;
        const Type = type || 0;
        const arr =
          Type == 0
            ? JSON.parse(data.scope_path)
            : JSON.parse(data.scope_path);

        if (arr != null) {
          let point = arr.map(item => {
            return new BMap.Point(item.lng, item.lat);
          });
          var label = new BMap.Label(data.area_name, {
            // offset: new BMap.Size(20, -10)
          });
          const style = Type == 0 ? this.defaultStyle : this.setStyleOptions();
          let polygonLayer = new BMap.Polygon(point, style); //建立多边形覆盖物

          polygonLayer.data = data;

          label.setPosition(polygonLayer.getBounds().getCenter());
          polygonLayer.label = label;
          // this.addMenu(polygonLayer);
          // this.mapAreaInfo.calculate = BMapLib.GeoUtils
          //   .getPolygonArea(polygonLayer)
          //   .toFixed(2);

          this.map.addOverlay(polygonLayer);
          if (Type == 0) {
            this.map.addOverlay(label);
            addMapLayer(this, polygonLayer, "area");

          } else {
            addMapLayer(this, polygonLayer, "cell");
            polygonLayer.addEventListener("click", function (e) {
              console.log('1326',e.target);

              let layer = e.target;
              this.map.panTo(getCenterPoint(layer.getPath())); //设置地图中心点
              // this.map.setZoom(19);

              let label = layer.label;
              let content = `<div class="map-windInfo" style="font-size: 12px;">
            <div>面积：${layer.data.BGSQua}㎡</div>
            <div>BGID：${layer.data.BGID}</div>
            <div>所属区域：${layer.data.area_id !== null ?_this.IDareaCode_name(layer.data.area_id): '无'}</div>
            </div>
            `;
              label.setContent(content);
              label.setPosition(getCenterPoint(e.target.getPath()));
              this.map.addOverlay(label);

              let data = _this.partsData.filter(item => {
                const point = new BMap.Point(item.baidu_x, item.baidu_y);
                return BMapLib.GeoUtils.isPointInPolygon(item.point, layer);
              });

            });
            polygonLayer.addEventListener("mouseover", function (e) {
              e.target.setStrokeColor("blue");
              e.target.setStrokeStyle("solid");
              e.target.setStrokeWeight(2);
            });
            polygonLayer.addEventListener("mouseout", function (e) {
              this.map.removeOverlay(e.target.label);
              e.target.setStrokeColor("red");
              e.target.setStrokeStyle("dashed");
              e.target.setStrokeWeight(1);
            });
          }
        }
      },

      /**
       * 获取区域信息
       */
      async getAreaData() {
        try {
          const res = await this.$http.get(
            "/cms/AreaController/queryAllAreaData"
          );
          if (res.data.success) {
            this.areaData = res.data.result;
            for (const item of this.areaData) {
              this.addPolygon(item);
            }
            let data = this.areaData.map(item => {
              item.value = {
                id: item.id,
                area_code: item.area_code,
                area_name: item.area_name,
                scope_path: item.scope_path
              };
              let parentIds = item.parent_ids.split(",");
              let path = JSON.parse(item.scope_path);
              return item;
            });
            this.areaOptions = transData(data, "id", "parent_id", "children");


          }
        } catch (error) {
          console.log(error);
        }
      },

      /**
       * 获取单元格信息
       */
      async getCellData() {
        try {
          const Res = await this.$http.post(
            "/cms/PartsController/queryBadPartsAndGroupInfo"
          );

          // this.allPartsData = Res.data.result;
          // console.log('全部部件',this.allPartsData)
          // for(let item of Res.data.result){
          //   if(item.ObjState !== '完好'){
          //     this.partsData.push(item)
          //   }
          // }
          this.partsData = Res.data.result
          let result = await this.$http.post('/cms/EventController/queryEvent');
          if (result.data.success) {
            this.eventData = result.data.result
          } else {
            this.$message.error(result.data.msg)
          }
          const res = await this.$http.get("/cms/CellController/querCellAllList");
          if (res.data.success) {
            this.cellData = res.data.result;
            console.log('1835',this.cellData)
            for (const item of this.cellData) {
              this.addPolygon(item, 1, item.BGID);
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      /**
       * 地图初始化
       */
      ready({BMap, map}) {

        this.map = map;

        console.log('1979',this.map);

        // 百度地图API功能
        function G(id) {
          return document.getElementById(id);
        }



        this.init();
        this.getEvent({BMap, map})

      },

      init(){
        this.getAreaData();
        this.getCellData();
        this.getPartGroupData();
        this.parent_event();
      },
      /**
       * 添加所有事件与地图中
       */
      setMapLayer(eventData) {
        let data = eventData;

        let marks = [];
        this.eventMarkerClusterer = new BMapLib.MarkerClusterer(this.map);
        this.conditionMarkerClusterer = new BMapLib.MarkerClusterer(this.map);

        data.forEach(item => {
          let pt = new BMap.Point(item.baidu_x, item.baidu_y);
          let icon;
          if(item.parent_name){
            for (let eventItem of this.parentEventData) {
              if (item.parent_name === eventItem.group_name) {
                icon = new BMap.Icon(`http://${this.$webconfig.serverIp}/${eventItem.group_pic_path}`, new BMap.Size(40, 40))
              }

            }
          } else {
            icon = new BMap.Icon(`http://${this.$webconfig.serverIp}/static/upload/eventIcons/其他事件.svg`, new BMap.Size(40, 40))
          }

          let Options = {
            icon: icon,
            title: item.ObjPosition
          };
          let marker = new BMap.Marker(pt,Options);
          marker.data = item;
          this.markerEventListener(marker);
          marks.push(marker)
          this.eventMarks.push(marker)
        });
        this.eventMarkerClusterer.addMarkers(marks);
      },

      setPartsMapLayer(partsData) {
        let data = partsData;
        let marks = [];
        this.caseMarkerClusterer = new BMapLib.MarkerClusterer(this.map);
        this.partsConditionMarkerClusterer = new BMapLib.MarkerClusterer(this.map);

        data.forEach(item => {
          let pt = new BMap.Point(item.baidu_x, item.baidu_y);
          let icon = new BMap.Icon(
            `http://${this.$webconfig.serverIp}/${
              item.cms_parts_group.group_pic_path
              }`,
            new BMap.Size(30, 30)
          );
          let Options = {
            icon: icon,
            title: item.ObjPosition
          };
          let marker = new BMap.Marker(pt, Options);
          marker.data = item;

          this.markerEventListener(marker);
          marks.push(marker);
        });
        this.partsMarks = marks;
        this.caseMarkerClusterer.addMarkers(marks);
      },

      /**
       * 点坐标事件集合
       * @param {Object} 地图marker对象
       */
      markerEventListener(marker) {
        let _this = this
        var opts = {
          width: 250, // 信息窗口宽度
          // height: 80, // 信息窗口高度
          // title: "部件信息", // 信息窗口标题
          enableMessage: true //设置允许信息窗发送短息
        };
        //点移入事件
        marker.addEventListener("mouseover", ({type, target, point, pixe}) => {
          target.setZIndex(20);
          var p = target;
          var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);


          let content = '';
          console.log('2104',target);
          if(target.data.type){
            content =   `<div class="map-windInfo" style="font-size: 12px;">
            <div>事件标识码：${this.setText(target.data.ObjCode)}</div>

             <div>事件类型：${this.setText(target.data.parent_name)}</div>
             <div>事件状态：${this.setText(this.stateChangeName(target.data.status))}</div>
             <div>事件位置：${this.setText(target.data.ObjPosition !== '' ? target.data.ObjPosition : '无')}</div>
            <div>小类名称：${this.setText(target.data.sub_name)}</div>
            <div>上报时间:${this.setText(dateFormat(new Date(target.data.create_date),'yyyy-MM-dd hh:mm:ss'))}</div>
            </div>
            `;

          }else if(Object.is(target.data.type, null)){
            content =   `<div class="map-windInfo" style="font-size: 12px;">
            <div>事件标识码：${this.setText(target.data.ObjCode)}</div>
             <div>事件类型：${this.setText(target.data.parent_name !== '' ? target.data.parent_name : '无')}</div>
             <div>事件状态：${this.setText(this.stateChangeName(target.data.status))}</div>
             <div>事件位置：${this.setText(target.data.ObjPosition !== '' ? target.data.ObjPosition : '无')}</div>
            <div>小类名称：${this.setText(target.data.sub_name!== '' ? target.data.sub_name : '无')}</div>
            <div>上报时间:${this.setText(dateFormat(new Date(target.data.create_date),'yyyy-MM-dd hh:mm:ss'))}</div>
            </div>
            `;

          } else {
            content = `<div class="map-windInfo" style="font-size: 12px;">
            <div>部件标识码：${this.setText(target.data.ObjID)}</div>
             <div>部件类型：${this.setText(target.data.cms_parts_group.group_name)}</div>
            <div>部件状态：${this.setText(target.data.ObjState)}</div>
            <div>BGID：${target.data.BGID!== '' ? this.setText(target.data.BGID) : '无'}</div>
            <div>所属区域：${target.data.area_code !== '' ? this.setText(_this.areaCode_name(target.data.area_code)) : '无'}</div>
             <div>上报时间:${this.setText(dateFormat(new Date(target.data.create_date),'yyyy-MM-dd hh:mm:ss'))}</div>

            </div>
            `;
          }



          var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
          p.openInfoWindow(infoWindow);
          // map.openInfoWindow(infoWindow, point); //开启信息窗口
        });
        //点移除事件
        marker.addEventListener("mouseout", ({type, target, point, pixe}) => {
          // target.closeInfoWindow();
        });

        marker.addEventListener("click", ({type, target, point, pixe}) => {
          var p = target;
          let _this = this;
          _this.showPartDetail = false;
          _this.showBack = false;
          _this.showPartInfo = false;
          _this.show_event_report = false;

          let content = ''
          if(target.data.type){
            content =   `<div class="map-windInfo" style="font-size: 12px;">
            <div>事件标识码：${this.setText(target.data.ObjCode)}</div>

             <div>事件类型：${this.setText(target.data.parent_name)}</div>
             <div>事件状态：${this.setText(this.stateChangeName(target.data.status))}</div>
             <div>事件位置：${this.setText(target.data.ObjPosition !== '' ? target.data.ObjPosition : '无')}</div>
            <div>小类名称：${this.setText(target.data.sub_name)}</div>
             <div>上报时间:${this.setText(dateFormat(new Date(target.data.create_date),'yyyy-MM-dd hh:mm:ss'))}</div>
            </div>
            `;
            _this.parentInfo = target.data;
            console.log('1618',_this.parentInfo)

          }else if(Object.is(target.data.type,null)){
            content =   `<div class="map-windInfo" style="font-size: 12px;">
            <div>事件标识码：${this.setText(target.data.ObjCode)}</div>
             <div>事件类型：${this.setText(target.data.parent_name !== '' ? target.data.parent_name : '无')}</div>
              <div>事件状态：${this.setText(this.stateChangeName(target.data.status))}</div>
             <div>事件位置：${this.setText(target.data.ObjPosition !== '' ? target.data.ObjPosition : '无')}</div>
            <div>小类名称：${this.setText(target.data.sub_name!== '' ? target.data.sub_name : '无')}</div>
            <div>上报时间:${this.setText(dateFormat(new Date(target.data.create_date),'yyyy-MM-dd hh:mm:ss'))}</div>
            </div>
            `;
            _this.parentInfo = target.data;
          } else {
            content = `<div class="map-windInfo" style="font-size: 12px;">
            <div>部件标识码：${this.setText(target.data.ObjID)}</div>
             <div>部件类型：${this.setText(target.data.cms_parts_group.group_name)}</div>
            <div>部件状态：${this.setText(target.data.ObjState)}</div>
            <div>BGID：${target.data.BGID!== '' ? this.setText(target.data.BGID) : '无'}</div>
            <div>所属区域：${target.data.area_code !== '' ? this.setText(_this.areaCode_name(target.data.area_code)) : '无'}</div>
             <div>上报时间:${this.setText(dateFormat(new Date(target.data.create_date),'yyyy-MM-dd hh:mm:ss'))}</div>
            </div>
            `;
            this.closeChild = true;
            target.data.cms_parts_group.parent_id = _this.name_id(target.data.cms_parts_group.parent_id);
            if (target.data.create_date) {

              target.data.create_date = dateFormat(new Date(target.data.create_date), 'yyyy-MM-dd hh:mm:ss');

            }
            if (target.data.update_date) {
              target.data.update_date = dateFormat(new Date(target.data.update_date), 'yyyy-MM-dd hh:mm:ss');
            }
            _this.partInfo = target.data;


            if (!_this.partInfo.type) {
              var myGeo = new BMap.Geocoder(); // 根据坐标得到地址描述
              myGeo.getLocation(new BMap.Point(target.data.baidu_x, target.data.baidu_y), function (result) {

                if (result) {
                  _this.partInfo.address_name = result.address
                }
              });
              this.map.panTo(point);
              this.map.setZoom(18);
              for (let item of _this.partTypeStyle) {
                if (item.key === _this.partInfo.ObjState) {
                  _this.icon_color.color = item.value;
                  _this.icon_text = item.icon

                }
              }
              this.showPartInfo = true;
            }
          }
          var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
          p.openInfoWindow(infoWindow);

          // this.getPartsCaseInfo(target.data.id);

        });
        this.allLoading = false
      },
      //设置点Lable文本显示
      setText(data) {
        return data != null && data != undefined ? data : "";
      },
      //部件模块获取案件信息
      getPartsCaseInfo(businesskey) {
        // businesskey = 22;
        let data = this.caseData.filter(item => {
          return item.businesskey == businesskey;
        });
        this.partCaseInfo = data;
      },
      /**
       * 获取事件大类
       */
      async parent_event() {
        let _this = this;
        try {
          let result = await _this.$http.get('/cms/EventController/queryParentEvent')
          if (result.data.success) {
            _this.parentEventData = result.data.result

          } else {
            _this.$message.warn('查询失败')
          }

        } catch (error) {
          _this.$message.error('查询失败1')
        }
      },

      /**
       * 获取事件数据
       */
      async getEvent({BMap, map}) {
        let _this = this;
        try {
          const Res = await _this.$http.post(
            "/cms/PartsController/queryBadPartsAndGroupInfo"
          );
          // this.allPartsData = Res.data.result;
          // for(let item of Res.data.result){
          //   if(item.ObjState !== '完好'){
          //     this.partsData.push(item)
          //   }
          // }
          this.partsData = Res.data.result;
          let result = await _this.$http.post('/cms/EventController/queryEvent');
          if (result.data.success) {
            this.eventData = result.data.result

          } else {
            this.$message.error(result.data.msg)
          }

          this.setMapLayer(this.eventData)
          this.setPartsMapLayer(this.partsData)

        } catch (error) {
          console.log(error)
        }
      },
      displayShow() {
        this.showScreen = true
      },
      event_report(){
        this.showPartInfo = false;
        this.showPartDetail = false;
        this.show_event_report = true;


      },

      ok_report(){
       this.show_event_report = false;
      }


    }
  };
</script>

<style scoped type="text/css">

  .map-view {
    z-index: 1;
  }

  .text-input {
    position: absolute;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 0;
    top: 10px;
    width: 43px;
    height: 36px;
    margin-left: 10px;
    background: #409EFF;

  }
  .text-add {
    position: absolute;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 0;
    top: 48px;
    margin-left: 10px;
    background: #409EFF;

  }

  .text-input input {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 24px;
    margin-left: 4px;

  }

  .text-close {
    font-size: 18px;
    height: 26px;
    width: 26px;
    text-align: center;
    background: #ffffff;
    color: #CCCCCC;
    padding: 2px;
    border-left: 1px solid #F7F9FF;
    cursor: pointer;
  }

  .text-search {
    font-size: 18px;
    height: 26px;
    width: 40px;
    text-align: center;
    background: #ffc713;
    padding: 2px;
    border-left: 1px solid #F7F9FF;
    cursor: pointer;
  }

  .area-search {
    position: absolute;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    z-index: 99;
    top: 10px;
    margin-left: 54px;
  }
  .area-search1 {
    position: absolute;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    top: 10px;
    margin-left: 250px;
  }

  .center-accept-layer {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    /*z-index: 0;*/
    top: 0px;

  }

  .control-map-tool {
    position: absolute;
    top: 0px;

    /*z-index: 12;*/
    transition: all 0.4s;
  }

  .control-content-tool {
    font-size: 12px;
    float: left;
    width: 43px;
    color: #fff;
  }

  .control-content-tool-item {
    background-color: #409EFF;
    text-align: center;
    height: 24px;
    padding: 5px 0;
    border: 1px solid rgba(255, 255, 255, 0.59);
    margin-bottom: 1px;
    -moz-box-shadow: 0px 3px 10px #787878;
    -webkit-box-shadow: 0px 3px 10px #787878;
    box-shadow: 0px 3px 10px #787878;
    cursor: pointer;
  }

  .control-icon {
    font-size: 25px;
    margin-bottom: 3px;
  }

  .control-content-tool-color {
    background-color: #135c7d;
  }

  .data-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: absolute;
    /*z-index: 0;*/
    top: 100px;
    height: 500px;
    width: 280px;
    margin-left: 10px;
    background: #ffffff;
    border-radius: 5px;
  }

  .data-detail {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: absolute;
    /*z-index: 0;*/
    top: 100px;
    height: 500px;
    width: 280px;
    margin-left: 10px;
    background: #ffffff;
    border-radius: 5px;
  }

  .data-tab {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    flex: 1;
    position: absolute;
    /*z-index: 0;*/
    top: 60px;
    height: 30px;
    min-width: 348px;
    margin-left: 10px;
    background: #ffffff;
    border-radius: 0px;
    box-shadow: 0px 1px 1px #666666;
    font-size: 14px;
    padding-left: 5px;
  }

  .back-icon {
    color: #00a0e9;
    cursor: pointer;
  }

  .back-text {
    color: #00a0e9;
    cursor: pointer;
  }

  .back-address {
    padding: 0 5px;

  }

  .back-result {
    color: #00a0e9
  }

  .data-head {
    background: #ffc713;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .data-head-title {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    padding: 10px;
  }

  .data-head-title-one {
    display: flex;
    flex: 2;
    justify-content: flex-start;
  }

  .title-one {
    font-size: 14px;
    padding: 2px;
  }

  .title-two {
    width: auto;
    height: 21px;
    background: #f93e54;
    margin-left: 5px;
    border-radius: 2px;

  }

  .title-two span {
    float: left;
    font-size: 12px;
    padding: 2px;
    color: #ffffff;

  }

  .title-three {
    flex: 1;
    justify-content: center;
    width: 56px;
    height: 27px;
    font-size: 14px;
    background: #00a0e9;
    border-radius: 5px;
    cursor: pointer
  }

  .title-three span {
    display: flex;
    justify-content: center;
    padding: 3px;
    color: #ffffff;

  }

  .data-head-address {
    display: flex;
    flex-direction: row;
    padding: 0 10px 20px 10px;
  }

  .icon {
    font-size: 14px;
    color: #f86476;
    cursor: pointer;
  }

  .address {
    font-size: 12px;
  }

  .data-status {
    display: flex;
    border-bottom: 1px solid #cccccc;
    padding: 10px;
  }

  .data-status-one {
    font-size: 12px;
  }

  .data-status-two {
    display: flex;
    font-size: 12px;
  }

  .data-describe {
    height: 200px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #cccccc;
    padding: 10px;
  }

  .data-describe-title {
    font-size: 12px;
  }

  .data-describe-address {
    font-size: 12px;
    color: #999999;
    margin-top: 5px;
  }

  .data-describe-image {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    width: 130px;
    height:130px;
  }

  .image-one {
    background-image: url("../../../assets/images/jinggai.jpg");
    height: 108px;
    width: 132px;

  }

  .data-event {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 5px;

  }

  .data-event-title {
    font-size: 12px;
    padding: 10px 10px 0 10px;

  }

  .data-event-list {
    overflow-y: auto;
  }

  .data-event-list-item {
    display: flex;
    flex-direction: column;
    padding-top: 10px;
  }

  .data-event-list-item:hover {
    background: #f6f6f6;
  }

  .event-describe {
    display: flex;
    justify-content: space-around;
    font-size: 12px;
  }

  .event-icon {
    color: #f86476;
  }

  .event-address {
    color: #2b81ff;
  }

  .event-date {
    color: #999999;
  }

  .event-reason {
    font-size: 12px;
    padding-left: 35px;
    color: #666666;
  }

  .event-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    position: absolute;
    /*z-index: -1;*/
    top: 0px;
    /*width: 560px;*/
    right: 0px;
    /*background: #ffffff;*/
    border-radius: 5px;
    -moz-box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
    -webkit-box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
    box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
  }

  .eyes {
    font-size: 18px;
    color: #2b81ff;
    right: 50px;
    position: fixed;
  }

  .detail-head .btn-close {
    padding: 5px 5px 5px 5px;
    margin-left: 155px;
    font-size: 14px;
    /*color: #ffffff;*/
  }
  .btn-close{
    cursor: pointer;
  }

  .eyes {
    font-size: 18px;
    position: fixed;
    right: 0px;
    top: 50px;
    z-index: 9;
    overflow: hidden;
    display: flex;
    justify-content: space-between
  }

  .event-head {
    display: flex;
    height: 28px;
    background: #ffc713;
  }

  .event-head .event-icon img {
    width: 18px;
    height: 18px;
    font-size: 18px;
    padding: 0px 0px 5px 5px;
    text-align: center;
  }

  .event-icon {
    font-size: 12px;
    /*padding: 5px;*/
  }

  .event-title {
    font-size: 12px;
    padding: 5px 5px 5px 0px;
    margin-left: 5px;
  }

  .event-head .btn-close {
    padding: 5px 5px 5px 5px;
    margin-left: 160px;
    font-size: 14px;
    color: #333333;
  }

  .detail-head .btn-close {
    padding: 5px 5px 5px 5px;
    margin-left: 160px;
    font-size: 14px;
    /*color: #ffffff;*/
  }

  .event-form {
    padding: 5px;
  }

  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }

  .data-event {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-right: 5px;

  }

  .data-event-list {
    overflow-y: auto;
  }

  .data-event-list-item {
    display: flex;
    flex-direction: column;
    padding: 5px 5px 10px 5px;
    border-bottom: 1px solid #cccccc;
  }

  .data-event-list-item:hover {
    background: #f6f6f6;
  }

  .data-event-list-item a:hover {
    background: #f86476;
  }

  .event-describe {
    display: flex;
    font-size: 12px;
    justify-content: flex-start;
  }

  .event-icon {
    color: #f86476;
  }

  .event-address {
    color: #666666;
  }

  .event-date {
    color: #999999;
    font-size: 12px;
  }

  .event-status {
    color: #999999;
    font-size: 12px;
    margin-left: 50px;
  }

  .event {
    display: flex;
    justify-content: space-between;
    padding-top: 2px;
  }

  .event-reason {
    font-size: 12px;
    margin-left: 24px;
    color: #999999;
  }

  .detail-head {
    display: flex;
    height: 28px;
    background: #ffc713;
  }

  .detail-head .detail-icon {
    font-size: 18px;
    padding: 0px 0px 5px 5px;
  }

  .detail-icon {
    font-size: 12px;
    /*color: #ffffff;*/
    /*padding: 5px;*/
  }

  .detail-title {
    font-size: 12px;
    /*color: #ffffff;*/
    padding: 5px 5px 5px 5px;
    margin-left: 5px;
  }

  .case-scroll {
    overflow: hidden;
    overflow-y: auto;
    bottom: 20px;
  }

  .detail-content {
    display: flex;
    padding: 5px;
    flex-direction: column;
  }

  .el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .case-id {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #CCCCCC;
    padding-top: 5px;
  }

  .case-title {
    font-size: 12px;
    color: #666666;
    padding: 8px 10px;
  }

  .case-value {
    font-size: 12px;
    color: #666666;
    padding: 8px 10px;
  }

  .case-desc {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #cccccc;
  }

  .case-desc-title {
    font-size: 12px;
    color: #666666;
    padding: 8px 10px 5px 10px;
  }

  .case-desc-value {
    font-size: 12px;
    color: #666666;
    padding: 0px 10px 5px 10px;
  }

  .case-desc-image {
    height: 130px;
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    padding: 10px;
  }

  .case-image {
    /*margin-right: 10px;*/
    /*margin-top: 5px;*/
    /*height: 100px;*/
    /*width: 116px;*/

  }

  .case-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 28px;
    bottom: 10px;
  }

  .el-button + .el-button {
    margin-left: 0px;
  }

  .el-button--mini, .el-button--mini.is-round {
    /*padding: 0px 16px;*/
  }

  .el-button--mini, .el-button--small {
    font-size: 12px;
    border-radius: 0px;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all 1s ease;
  }

  .slide-fade-leave-active {
    transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateX(200px);
    opacity: 0;
  }


  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-showArea-enter-active {
    transition: all 0.6s ease;
  }

  .slide-showArea-leave-active {
    transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-showArea-enter,
  .slide-showArea-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }
  .map-windInfo {
    font-size: 12px;
  }
  .map-windInfo p{
    margin: 2px;
  }
  .userTagClass {
    min-height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 5px;
    line-height: 28px;
    overflow: auto;
    /*min-width: 210px;*/
    box-sizing: border-box;
  }

</style>
