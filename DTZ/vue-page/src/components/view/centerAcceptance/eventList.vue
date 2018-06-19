<template>
  <div v-show="isShow" :style="childrenHeight"
       style="top: 50px;bottom: 2px;overflow: hidden;display: flex;justify-content: space-between">


    <transition name="slide-show">
      <div v-show="showInfo" :style="childrenHeight"
           style="flex:1;width: 280px;;background: #ffffff;box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);">
        <div class="detail-head">
          <div class="detail-icon">
            <base-icon icon="newcarid"></base-icon>
          </div>
          <div class="detail-title">事件详情</div>
          <div class="btn-close" @click="showLeft()">
            <base-icon icon="close"></base-icon>
          </div>

        </div>
        <div class="case-scroll" :style="detailHeight">
          <el-form ref="form" :model="form" label-width="80px" v-loading="loadDetail">
            <el-form-item label="事件代码">
              <el-input v-show="form.ObjCode !== ''" v-model="form.ObjCode" :readonly=true></el-input>
              <el-input v-show="form.ObjCode === ''" v-model="unknown" :readonly=true></el-input>
            </el-form-item>

            <el-form-item v-show="form.status == 1 || form.status == 3" label="主管部门" v-model="form.DeptName1">
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




            <el-form-item label="主管部门" v-show="form.status==5 || form.status==6">

              <el-input v-model="form.DeptName1" :readonly=read_only></el-input>

            </el-form-item>


            <el-form-item label="所属区域">

              <el-input v-show="form.areaCode !== ''" v-model="form.areaCode" :readonly=true></el-input>

              <el-input v-show="form.areaCode === ''" v-model="unknown" :readonly=true></el-input>

            </el-form-item>

            <!--<el-form-item label="事件名称">-->
            <!--<el-input v-model="form.ObjName" :readonly=read_only></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="来源" v-show="form.status == 1 || form.status == 3">
              <el-select v-model="form.source" placeholder="来源" style="width: 100%;">
                <el-option v-for="item of eventSourceType" :key="item.typecode" :label="item.typename"
                           :value="item.typecode"></el-option>
              </el-select>

            </el-form-item>

            <el-form-item label="来源" v-show="form.status==5 || form.status==6">

              <el-input v-model="form.source" :readonly=true></el-input>

            </el-form-item>

            <el-form-item label="事件分类" v-show="form.status == 1 || form.status == 3">
              <el-select v-model="form.EventType" placeholder="事件分类" style="width: 100%;">
                <el-option label="事件" value="事件"></el-option>
                <el-option label="部件" value="部件"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="事件分类" v-show="form.status==5 || form.status==6">

              <el-input v-model="form.EventType" :readonly=true ></el-input>

            </el-form-item>


            <el-form-item label="事件大类">
              <el-select v-model="form.parent_name" placeholder="大类" @change="getChildren" filterable style="width: 100%;">
              <el-option v-for="item of parentEventData" :key="item.group_code" :label="item.group_name"
              :value="item.group_code"></el-option>

              <!--<el-input :readonly=true v-model="form.parent_name"></el-input>-->
              </el-select>

            </el-form-item>

            <el-form-item label="事件小类">
              <!--<el-select v-model="form.parent_name" placeholder="大类">-->
              <!--<el-option v-for="item of parentEventData" :key="item.group_code" :label="item.group_name"-->
              <!--:value="item.group_name"></el-option>-->
              <!--</el-select>-->
              <el-select v-model="form.sub_name" placeholder="小类" filterable style="width: 100%;">
              <el-option v-for="item of childrenEventData" :key="item.group_code" :label="item.group_name"
              :value="item.group_code"></el-option>
              </el-select>

              <!--<el-input :readonly=true v-model="form.sub_name"></el-input>-->

            </el-form-item>


            <!--<el-form-item label="小类">-->


            <!--</el-form-item>-->

            <el-form-item label="发生地点" v-show="IS_FLAG">
              <input type="text"  v-model="form.ObjPosition" id="suggest" style="width: 98%">


            </el-form-item>

            <el-form-item label="发生地点" v-show="!IS_FLAG">


              <el-input type="textarea"  v-model="form.ObjPosition" :readonly=true ></el-input>


            </el-form-item>
            <el-form-item label="上报人">
              <el-input :readonly=true v-model="form.create_by"></el-input>
            </el-form-item>

            <el-form-item label="单位网格" v-show="form.BGID!== ''">
              <el-input :readonly=true v-model="form.BGID"></el-input>
            </el-form-item>

            <el-form-item label="单位网格" v-show="form.BGID=== ''">
              <el-input :readonly=true v-model="nothing"></el-input>
            </el-form-item>
            <el-form-item label="问题描述" v-show="form.status == 1 || form.status == 3">
              <el-input type="textarea" v-model="form.remarks" style="min-height: 66px;font-size: 14px"
                        :readonly=false></el-input>
              <!--<span v-text="form.remarks" contentEditable="true"></span>-->
              <!--<div v-text="form.remarks" contenteditable="plaintext-only" style="border: 1px;"></div>-->

            </el-form-item>
            <el-form-item label="问题描述" v-show="form.status == 5 || form.status == 6">
              <el-input type="textarea" v-model="form.remarks" style="min-height: 66px;font-size: 14px"
                        :readonly=true></el-input>
              <!--<span v-text="form.remarks" contentEditable="true"></span>-->
              <!--<div v-text="form.remarks" contenteditable="plaintext-only" style="border: 1px;"></div>-->

            </el-form-item>

              <div class="case-desc">
                <div class="case-desc-title">事件图片</div>
                <!--<div class="case-desc-image" style="width: 95%" v-for="(item,index) of showImg" :key="index">-->
                <!--<base-img :src="item" class="case-image"/>-->
                <!--</div>-->
                <div class="case-desc-image">
                  <base-img :src="showImg"></base-img>
                </div>

              </div>


            <el-form-item label="附件" prop="check_file" v-show="form.status == 3 ||form.status == 1">
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
            <!--<el-form-item label="语音">-->
            <!--<audio controls="controls"></audio>-->
            <!--</el-form-item>-->

          </el-form>


          <div v-if="form.is_check === 1">
            <div class="detail-head">
              <div class="detail-icon">
                <base-icon icon="duban"></base-icon>
              </div>
              <div class="detail-title">核实信息</div>
            </div>
            <div class="detail-content">

              <div class="info-height-status" style="position:relative;font-size: 64px;z-index: 10">

                <base-icon  icon="tongyi" style="float: right"/>

              </div>

              <el-form ref="form" :model="form" label-width="80px" style="margin-top: -50px">
                <el-form-item label="核实人">
                  <el-input :readonly=true v-model="form.verify_by"></el-input>
                </el-form-item>
                <el-form-item label="核实时间">
                  <el-input :readonly=true v-model="form.verify_date"></el-input>
                </el-form-item>

                <!--<el-form-item label="核实说明">-->
                <!--<el-input :readonly=true type="textarea" v-model="form.verify_remark"></el-input>-->
                <!--</el-form-item>-->
              </el-form>
            </div>
          </div>
        </div>


        <div class="case-footer">

          <el-button v-show="form.status == 3" type="success" style="height: 28px;width: 100%;" @click="isOrg_process()">
            发起立案申请
          </el-button>
          <el-button v-show="form.status == 1" type="danger" style="height: 28px;flex: 1;border-radius: 0px"
                     @click="sendVerify()">派 遣 核 实
          </el-button>
          <el-button v-show="form.status == 1 " type="success" style="height: 28px;flex: 1;border-radius: 0px"
                     @click="sendCase()">直 接 立 案
          </el-button>

          <el-button v-show="form.status == 1 " type="info" style="height: 28px;flex: 1;border-radius: 0px"
                     @click="isEventDone()">事 件 作 废
          </el-button>

        </div>

      </div>
    </transition>


    <el-dialog  :visible.sync="dialogShow"
               :model-append-to-body="false"
               :close-on-click-modal="false" width="35%">
      <div>
        <el-row :gutter="20" class="selectDepart">
          <el-col :span="24">
            <p class="departTitle">选择一个核实人员</p>
            <div class="surround">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree ref="treeChoose" :default-expand-all="expand" style="height: 300px;overflow: auto;"
                       show-checkbox
                       class="filter-tree" :data="TreeData" node-key="id" :render-content="renderContent"
                       :props="defaultProps" @check-change="treeChange" :filter-node-method="filterNode">
              </el-tree>
            </div>
          </el-col>

        </el-row>

        <div style="text-align: right;margin-top: 10px;">
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(0)" style="height: 28px;border-radius: 5px;padding: 0px 10px">取 消</el-button>
        <el-button type="primary" @click="closeDialog(1)"
                   style="height: 28px;border-radius: 5px;padding: 0px 10px">确 定</el-button>
      </span>
        </div>

      </div>


    </el-dialog>


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



    <div v-show="showEventList" class="wait-deal"
         style="">
      <div class="event-head">
        <!--<div class="event-icon">-->
        <!--<base-icon icon="shijianwarn"></base-icon>-->
        <!--</div>-->
        <!--<div class="event-title">事件列表</div>-->
        <!--<div class="btn-close" @click="_isShow()">-->
        <!--<base-icon icon="close"></base-icon>-->
        <!--</div>-->
        <el-tabs type="border-card" style="width: 100%;padding: 0px">

          <el-tab-pane>
            <span  slot="label" @click="eventList"><base-icon v-show="addEventList.length > 0" icon="tongzhi"
                                                               style="color:#ed3f14"/>待处理</span>

            <div class="data-event wait-data-event" :style="conHeight">
              <div class="data-event-list" v-loading="loading">
                <div class="data-event-list-item" v-for="(item,index) of addEventList"
                     :class="{yellowGround: changeYellow === index}"
                     @click="showDetails(index,item)">

                  <div :class="{notify_circle: item.read_flag === 0}"
                       style="width: 10px;height:10px;visibility: visible"></div>

                  <!--<base-icon v-show="index === 0 && tongzhiShow" icon="tongzhi"-->
                  <!--style="color:#ed3f14"/>-->
                  <div class="data-event-icon">
                    <div class="event-icon"><img :src="imgUrl(item.parent_name)"
                                                 style="width:28px;height: 28px;padding-right: 5px;text-align: center;margin-top: 10px">
                    </div>
                  </div>
                  <div class="data-event-content">
                    <div class="event-describe">
                      <!--<div class="event-address">{{item.remarks}}</div>-->
                      <base-text-overflow class="event-address"
                                          :text="!Object.is(item.remarks,null) ? item.remarks.slice(0,10): ''">

                      </base-text-overflow>
                      <!--<base-text-overflow class="event-address"-->
                                          <!--:text="item.remarks">-->

                      <!--</base-text-overflow>-->
                      <div class="event-status" :style="item.color">
                        {{stateChangeName(item.status)}}
                      </div>
                    </div>

                    <div class="event">
                      <div class="event-reason">{{item.parent_name}}</div>
                      <div class="event-date" v-text="timeChange(item.create_date)"></div>
                    </div>
                  </div>

                </div>


                <div style="width:100%;text-align:center;font-size:200px;" v-if="addEventList.length==0">
                  <!-- 123 -->
                  <base-icon icon="zanwu"/>
                </div>

                <!--<div v-show="newEventList.length>0"-->
                     <!--style=" position: absolute;bottom: 5px;width: 100%;text-align: center;">-->
                  <!--<el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
                                 <!--:currentPage="tabPage.currentPage"-->
                                 <!--:pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum"-->
                                 <!--layout="prev, pager, next">-->
                  <!--</el-pagination>-->

                <!--</div>-->

              </div>

            </div>

          </el-tab-pane>

          <el-tab-pane>

            <span @click="eventOldList()" slot="label"> 历史事件</span>
            <div class="event-form history-data-event">
              <el-form>
                <!--<el-form-item>-->
                <!--<el-select v-model="eventParams.parent_name" placeholder="全部事件" @change="queryChildren" style="width: 265px;">-->
                <!--<el-option v-for="item in parentEventData" :key="item.group_code" :label="item.group_name" :value="item.id"></el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item style="margin-bottom: 5px;">
                  <el-select v-model="eventParams.parent_name" placeholder="事件类型" style="width: 130px;">
                    <el-option v-for="item in parentEventData" :key="item.group_code" :label="item.group_name"
                               :value="item.group_name"></el-option>

                  </el-select>

                  <el-select v-model="eventParams.source" placeholder="事件来源" style="width: 130px;">
                    <el-option v-for="item of eventSourceType" :key="item.typecode" :label="item.typename"
                               :value="item.typecode"></el-option>
                  </el-select>

                </el-form-item>

                <el-form-item required style="margin-bottom: 5px;">
                  <el-col :span="12">
                    <el-form-item prop="eventParams.start_date" style="margin-bottom: 5px;">
                      <el-date-picker v-model="eventParams.start_date" value-format="yyyy-MM-dd" size="mini" type="date"
                                      placeholder="开始日期" style="width: 130px"></el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item prop="eventParams.end_date" style="margin-bottom: 5px;">
                      <el-date-picker v-model="eventParams.end_date" value-format="yyyy-MM-dd" size="mini" type="date"
                                      placeholder="结束日期" style="width: 130px"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>

                <el-form-item prop="eventParams.ObjName" style="margin-bottom: 5px;">
                  <el-input v-model="eventParams.remarks" clearable placeholder="关键字搜索" style="width:120px"></el-input>
                  <el-button type="primary" icon="el-icon-search" @click="onEventSearch()"
                             style="height: 28px;border-radius: 5px;padding: 0px 10px">查询
                  </el-button>
                  <el-button type="success" icon="el-icon-refresh" @click="refresh()"
                             style="height: 28px;border-radius: 5px;padding: 0px 10px">刷新
                  </el-button>
                </el-form-item>

              </el-form>
            </div>


            <div class="data-event history-data-event" :style="contentHeight">

              <div class="data-event-list" v-loading="loading">
                <div class="data-event-list-item" v-for="(item, index) of oldEventList"
                     :class="{yellowGround: changeYellow === index}" @click="showDetails(index, item)">

                  <div class="data-event-icon">
                    <div class="event-icon"><img :src="imgUrl(item.parent_name)"
                                                 style="width:28px;height: 28px;padding-right: 5px;text-align: center;margin-top: 10px;">
                    </div>

                  </div>

                  <div class="data-event-content">
                    <div class="event-describe">


                      <!--<div class="event-address">{{item.remarks}}</div>-->
                      <base-text-overflow class="event-address"
                                          :text="!Object.is(item.remarks,null) ? item.remarks.slice(0,10): ''">

                      </base-text-overflow>

                      <!--<base-text-overflow class="event-address"-->
                                          <!--:text="item.remarks">-->

                      <!--</base-text-overflow>-->
                      <div v-if="!(item.verify_by && item.is_check === 0)" class="event-status" :style="item.color">
                        {{stateChangeName(item.status)}}
                      </div>
                    </div>
                    <div class="event">
                      <div class="event-reason">{{item.parent_name}}</div>
                      <div class="event-date" v-text="timeChange(item.create_date)"></div>
                    </div>
                  </div>
                </div>

                <div style="width:100%;text-align:center;font-size:200px;" v-if="oldEventList.length==0">
                  <!-- 123 -->
                  <base-icon icon="zanwu"/>
                </div>

              </div>

            </div>

            <div v-show="oldEventList.length>0" style=" position: absolute;bottom: 0px;width: 100%;text-align: center;">
              <el-pagination small @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
                             :currentPage="tabPage1.currentPage"
                             :pageSizes="tabPage1.pageSizes" :pageSize="tabPage1.pageSize"
                             :total="tabPage1.totalNum"
                             layout="prev, pager, next">
              </el-pagination>

            </div>
          </el-tab-pane>

        </el-tabs>

      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {transData} from "assets/js/commonManage.js";
  import paging from 'common/BasePaging.vue'
  import BaseTextOverflow from 'common/BaseTextOverflow.vue'
  import BaseImg from "common/BaseImg";
  import {dateFormat} from "../../../assets/js/date";
  import DeptChoose from '../user/DepartChoose'
  import BpmnView from '../bpmn/bpmnView'

  export default {
    components: {
      paging,
      BaseTextOverflow,
      BaseImg,
      DeptChoose,
      BpmnView
    },
    data() {
      return {
        resultArr: [],
        nothing: '无',
        unknown: '未知',
        weChat_user: '微信用户',
        screenHeight: document.body.clientHeight-125,
        height: document.body.clientHeight - 50,

        contentHeight: {
          height: (document.body.clientHeight - 215) + 'px'
        },
        conHeight: {
          height: (document.body.clientHeight - 90) + 'px'
        },
        detailHeight: {
          height: (document.body.clientHeight - 116) + 'px'
        }
        ,
        read_only: false,
        tongzhiShow: false,
        changeYellow: null,
        showNotifyCircle: false,
        hideNotifyCircle: '',
        showEventList: true,
        dialogShow: false,
        filterText: '',
        loading: true,
        loadDetail: true,
        showInfo: false,
        disFlag: true,
        disFlag1: true,
        disFlag2: false,
        isShow: true,
        userList: [],
        areaCodeList: [], //区域表
        eventListData: [], //事件列表数据
        oldEventList: [], //历史事件
        newEventList: [], //最新事件,
        addEventList: [], //添加事件
        eventGroupData: [],//事件大类数据
        parentEventData: [],
        childrenEventData: [],
        eventSourceType: [], //事件来源类型
        eventStateType: [],//事件状态类型
        eventDetails: {},
        eventParams: {
          parent_name: '',
          sub_name: '',
          source: '',
          start_date: '',
          end_date: '',
          ObjName: '',
          remarks: '',
        },
        tabPage: { //分页信息
          currentPage: 1,
          pageSize: 10,
          pageSizes: [10, 20, 30, 50]
        },
        tabPage1: { //分页信息
          currentPage: 1,
          pageSize: 8,
          pageSizes: [8, 16, 32, 64]
        },

        createCaseData: {}, //发起立案申请的数据
        form: {
          id: '',
          ObjCode: '',//事件代码
          ObjName: '',
          DeptCode1: '',
          DeptName1: '',
          ObjPosition: '',
          BGID: '',
          source: '',
          EventType: '',
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
          businesskey:''
        },
        newEventData: [],
        userLists: [],
        eventColor: [
          {
            key: 0,
            color: '#999999'
          },
          {
            key: 1,
            color: '#ff9d42'
          },
          {
            key: 2,
            color: '#53d7eb'

          },
          {
            key: 3,
            color: '#33c400'
          },
          {
            key: 4,

            color: '#fa3f54'
          },
          {
            key: 5,
            color: '#53d7eb'
          },
          {
            key: 6,

            color: '#fa3f54'
          },
        ],
        event_color: {
          color: ''
        },
        eventPic: [],


        TreeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          disabled: 'disabled'
        },
        cascaderProps: {
          value: "id",
          label: "org_name",
          children: "children",
          disabled: "disabled"
        },
        areaProps: {
          value: "area_code",
          label: "area_name",
          children: "children",
          disabled: "disabled"
        },
        departOptions: [],
        areaOptions: [],
        depart_org: [], //部门
        fileList: [],
        areaList: [],
        CascaderArray: [],
        departList0: [],//部门选择单个
        editDialog:false,
        setSelectList0: [],//部门选中项单个
        index: 0,
        showProcess: false,
        process_data:[],
        dialogBpmnViewVisible: false,//流程图模态框是否显示
        event_group_data:[],
        all_user:[],
        WeChatUser:[],
        newaddress:{},
        cellData:[],
        IS_FLAG:true


      }
    },
    props: {
      showList: {
        type: Boolean,
        default: true
      },
      messageInfo: {},

      showClose: {
        type: Boolean,
        default: false
      },

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
      },

    },
    created() {
      this.users();
      this.parent_event();
      this.eventSource();
      this.eventState();

      // let vuexEventList = this.$store.getters.getEventList
      // if(vuexEventList.length > 0){
      //   this.addEventList = vuexEventList
      // }else {
        this.eventList();
      // }
      this.eventOldList();
      this.areaCode();
      this.getCellData();
      this.dept_org();
      // this.GetProcessList()
    },
    mounted() {
      this.getPlOrgListToTree(this.param);
      this.showList = this.isShow;
      const vm = this;
      window.addEventListener('resize', function() {
        vm.$nextTick(function() {
          vm.height = document.body.clientHeight - 50;
          vm.$log('Height:',vm.height);
          vm.eventList();
          vm.eventOldList()
        });
      });

    },
    computed: {
      childrenHeight(){
        return {
          height: (document.body.clientHeight - 50) + 'px'
        }
      },
      showImg() {
        let imgList = this.eventPic;
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
      msgInfo() {
        let item = this.messageInfo;
        // console.log('635',item)
        // this.showDetails(0,msg);
        return item
      },
      showClos() {
        return this.showClose;
      },
      addEvent() {
        return this.$store.getters.getSocketAcceptScreen;
      },
      showLayer() {
        return this.showInfo
      },
      // newAddressInfo(){
      //
      //   return this.$store.state.gNewAddress
      // },
    },
    watch: {
      msgInfo() {
        this.Msg_Info()
      },
      showClos() {
        this.show_Clos()
      },

      // newAddressInfo: {
      //   handler: function (val) {
      //     this.AddressInfo(val)
      //     },
      //   deep: true
      // },

      addEvent(val) {

        // if(val != null){
        //
        //   let item = val[0].result || val[0].result.data || val[0].result.data.result;
        //   for (let eventColorItem of this.eventColor) {
        //     item.read_flag = 0;
        //     if (item.status == eventColorItem.key) {
        //       item.color = {
        //         color: eventColorItem.color
        //       }
        //
        //     }
        //   }
        //   this.addEventList.unshift(item)
        //
        // }
        this.eventList();
        this.MsgTips();
      },
      showLayer() {
        this.$emit('layerShow', this.showInfo)
      },
      filterText(val) {
        this.$refs.treeChoose.filter(val);
      }
    },

    methods: {
      Msg_Info() {
        let item = this.messageInfo;
        this.showDetails(-1, item, 1)
      },
      AddressInfo(data){
        let item = data;
        if(item.area_info){
          this.form.areaCode = item.area_info.area_name;
        }else {
          this.form.areaCode = '无'
        }
        if(item.cell_info){
          this.form.BGID =item.cell_info.BGID
        }else {
          this.form.BGID = '无'
        }

        this.form.baidu_x = item.baidu_x;
        this.form.baidu_y = item.baidu_y;

        this.form.ObjPosition = item.address_name;

      },
      show_Clos() {
        this.showInfo = false
      },
      MsgTips() {
        let _this = this;
        _this.tongzhiShow = true;
        this.$notify({
          title: '提示',
          message: '有一条新的事件需要处理',
          duration: 4500,
          position: 'bottom-right',
          onClick() {
            _this.goEvent()
          }
        });
      },


      /**
       * 用户名与id转换
       */

      idChangeName(ID) {
        if (ID) {
          for (let item of this.all_user) {

            if (ID === item.id) {

              return item.realname || item.name
            } else if (ID === item.realname || ID === item.name) {

              return ID
            }

          }
        } else {
          return '无'
        }
      },
      nameChangeId(ID) {
        if (ID) {
          for (let item of this.all_user) {
            if (item.realname === ID) {
              return item.id
            }

          }
        } else {
          return ''
        }
      },
      /**
       * area_code转name
       */
      area_codeChangeName(AREA_CODE) {
        if (AREA_CODE) {
          for (let item of this.areaCodeList) {
            if (item.area_code === AREA_CODE) {
              return item.area_name

            }

          }

        } else {
          return null
        }


      },
      /**
       * value转name
       */
      valueChangeName(VAL) {
        if (VAL === 1) {
          return '事件'
        } else if (VAL === 2) {
          return '部件'

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

        for (let item of this.depart_org) {

          if (id === item.id) {

            return item.org_name
          } else if (id === '') {
            return ''

          }
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
       * StateType转name
       */
      stateChangeName(state) {
        for (let item of this.eventStateType) {
          if (state == parseInt(item.typecode)) {
            return item.typename
          }
        }
      },
      /**
       * 时间格式的转换
       */
      timeChange(time) {
        return dateFormat(new Date(time), 'yyyy-MM-dd hh:mm:ss')
      },

      /**
       * 获取所有用户
       */
      async users() {
        try {
          let result = await this.$http.get('/oa/OaNotifyController/userList');
          let we_chat_result = await this.$http.get('/oa/OaNotifyController/weChatUserList');
          if(we_chat_result.data.success){
            this.WeChatUser = we_chat_result.data.result
          }
          if (result.data.success) {
            this.userLists = result.data.result

          }
          this.all_user = this.WeChatUser.concat(this.userLists)
        } catch (error) {
          this.$message.error('查询失败')

        }
      },

      /**
       * 查询 根据机构名称模糊查询
       * @params {String} formName 进行验证
       */
      onSearch(formName) {
        const params = {
          name: this.filterText
        };
        this.getPlOrgListToTree(params);
      },

      selectDept(data) {
        if (data) {
          let info = data[data.length - 1];
          // this.form.area_id = info.id;
          this.form.DeptCode1 = info;
          // this.selectArea = info;
          for (let item of this.depart_org) {
            if (this.form.DeptCode1 === item.id) {
              this.form.DeptName1 = item.org_name
            }
          }

        } else {
          this.CascaderArray.push(this.form.DeptName1)
        }

      },
      selectChange(data) {
        let info = data[data.length - 1];
        // this.partsForm.area_id = info.id;
        this.form.area_code = info;
        this.selectArea = info;

      },

      //事件大类转换

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
        console.log('1120',data);

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
       * 列表图片地址
       */
      imgUrl(parent_name) {
        for (let item of this.parentEventData) {
          if(parent_name === item.group_name ) {
            return `http://${this.$webconfig.serverIp}/${item.group_pic_path}`;
          } else if(!parent_name){
            return `http://${this.$webconfig.serverIp}/static/upload/eventIcons/其他事件.svg`
          }
        }
        this.loading = false
      },
      async queryChildren(value) {
        let param = {
          parent_id: value
        };
        let _this = this;
        try {
          let result = await _this.$http.post('/cms/EventController/queryChildrenEvent', param)

        } catch (error) {
          _this.$message.error('查询失败')
        }

      },

      //获取区域全部信息
      async areaCode() {
        try {
          let res = await this.$http.get('/cms/AreaController/queryAllAreaData');
          if (res.data.success) {
            this.areaCodeList = res.data.result;

            this.areaOptions = transData(this.areaCodeList, "id", "parent_id", "children");

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
      //获取附件表


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

      goEvent() {
        let _this = this;
        _this.$router.push('/accept');
      },

      //获取最新事件列表
      async eventList() {
        let _this = this;
        let param = {};


        _this.showInfo = false;
        _this.loading = true;
        _this.changeYellow = null;

        // param.page = _this.tabPage.currentPage;
        // param.pageSize = _this.tabPage.pageSize;
        param.ObjName = _this.eventParams.ObjName;
        param.update_by = _this.$getUserData('id');
        param.process_person = _this.$getUserData('id');
        try {
            let result = await _this.$http.post('/cms/EventController/queryEventList', param);

            if (result.data.success) {
              // _this.tabPage.totalNum = result.data.result.count;
              for (let item of result.data.result) {
                for (let eventColorItem of _this.eventColor) {
                  if (item.status == eventColorItem.key) {
                    item.color = {
                      color: eventColorItem.color
                    }

                  }
                }
              }

              let arr = result.data.result;

              _this.newEventList = arr;
              _this.addEventList = _this.newEventList;
              // _this.$store.dispatch("setEventList", _this.addEventList);


              setTimeout(function () {
                _this.loading = false

              }, 500);

            }

        } catch (error) {
          this.$message.error('查询失败');
          setTimeout(function () {
            _this.loading = false

          }, 500);
        }
      },

      //获取新插入的数据




      //获取历史事件列表
      async eventOldList() {

        let _this = this;
        _this.showInfo = false;
        this.$emit('layerShow', _this.showInfo);


        let param = {};
        param.page = _this.tabPage1.currentPage;
        param.pageSize = _this.tabPage1.pageSize;
        try {
          let result = await _this.$http.post('/cms/EventController/queryOldEventList', param);

          if (result.data.success) {
            _this.tabPage1.totalNum = result.data.result.count;
            for (let item of result.data.result.rows) {
              for (let eventColorItem of _this.eventColor) {
                if (item.status == eventColorItem.key) {
                  item.color = {
                    color: eventColorItem.color
                  }
                }
              }
            }

            _this.oldEventList  = result.data.result.rows;



            this.loading = false
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

      compare(property) {
        return function (a, b) {
          let value1 = a[property];
          let value2 = b[property];
          return new Date(value1) - new Date(value2);
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

      setAutoComplete(data) {



        if(this.IS_FLAG){
          var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {"input" : "suggest"
              ,"location" : this.$parent.map
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
            this.setPlace(myValue,data);
          });
        }


      },
      setPlace(value,data) {
        // this.$parent.map.clearOverlays(); //清除地图上所有覆盖物
        const vm = this;
        const myFun = () => {
          var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
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
                    var label = new BMap.Label(data.area_name, {
                      // offset: new BMap.Size(20, -10)
                    });
                    const style = vm.setStyleOptions();
                    let polygonLayer = new BMap.Polygon(pot, style);
                    polygonLayer.data = data;
                    polygonLayer.label = label;

                    let flag = BMapLib.GeoUtils.isPointInPolygon(point, polygonLayer);
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
                    var label = new BMap.Label(data.area_id, {
                      // offset: new BMap.Size(20, -10)
                    });
                    const style = vm.setStyleOptions();
                    let polygonLayer = new BMap.Polygon(pot, style);
                    polygonLayer.data = data;
                    polygonLayer.label = label;

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
      showDetails(index, item, value) {

        if(Object.is(item.baidu_x,0) && Object.is(item.baidu_y,0)){


           this.IS_FLAG = true;

          this.$message.error('该事件无坐标，请输入发生地点确定位置');


          this.setAutoComplete(item);
        } else {
          this.IS_FLAG = false
        }

        this.departList0 = [];


        if (index === 0) {
          this.tongzhiShow = false
        }
        this.selectDept();

        if (value !== 1) {
          this.$emit('ievent', item);
          this.changeYellow = index;
        }

        item.read_flag = 1;


        this.fileList = [];
        this.showInfo = true;
        this.loadDetail = true;
        if(Object.is(item.source,2)){
          this.form.create_by = this.weChat_user;
        }else{
          this.form.create_by = this.idChangeName(item.create_by);
        }
        this.form.verify_by = this.idChangeName(item.verify_by);

        this.form.create_date = dateFormat(new Date(item.create_date), 'yyyy-MM-dd hh:mm:ss');
        this.form.verify_date = dateFormat(new Date(item.verify_date), 'yyyy-MM-dd hh:mm:ss');
        this.form.EventType = this.valueChangeName(item.type);
        this.form.id = item.id;
        this.form.ObjCode = item.ObjCode;
        this.form.ObjName = item.ObjName;
        this.form.DeptCode1 = item.DeptCode1;
        this.form.DeptName1 = item.DeptName1;
        this.form.ObjPosition = item.ObjPosition;
        this.form.BGID = item.BGID;
        this.form.source = this.typeChangeName(item.source);
        this.form.parent_name = item.parent_name;
        this.form.group_code = item.group_code;
        this.form.update_by = item.update_by;
        this.form.update_date = dateFormat(new Date(item.update_date), 'yyyy-MM-dd hh:mm:ss');
        this.form.sub_name = item.sub_name !== '' ? item.sub_name : '无';
        this.form.is_check = item.is_check;
        this.form.status = item.status;
        this.form.remarks = item.remarks;
        this.form.sys_id = this.$getUserData('id');
        this.form.area_code = item.area_code;
        this.form.areaCode = this.area_codeChangeName(item.area_code);
        this.form.baidu_x = item.baidu_x;
        this.form.baidu_y = item.baidu_y;
        this.form.businesskey = item.businesskey;

        let param = {
          id: item.id
        };

        if (this.form.status == 5 || this.form.status == 6) {
          this.read_only = true
        }
        let p_am = {
          id: item.id,
        };

        this.$http.post('/cms/EventController/update_read_flag',p_am).then(function(res){
          console.log(res.data.success);

        }).catch(function(error){
          console.log(error)
        });
        let _this = this;
        _this.$http.post('/cms/EventController/eventPic', param).then(function (res) {
          if (res.data.success) {
            _this.eventPic = res.data.result

          }

        });

        setTimeout(function () {
          _this.loadDetail = false;
        }, 1000);

        this.createCaseData = item;
        this.showInfo = true;
      },
      _isShow() {
        this.isShow = !this.isShow;
        this.showItem = !this.showItem
      },
      showLeft() {
        this.showInfo = false;
        this.changeYellow = null;
        this.showEventList = true;
        this.$emit('layerShow', this.showInfo)
      },
      async onEventSearch() {
        this.loading = true;
        this.changeYellow = null;
        this.showInfo = false;
        let _this = this;
        let params = this.eventParams;
        params.page = this.tabPage1.currentPage;
        params.pageSize = this.tabPage1.pageSize;
        if (params.start_date && params.end_date) {
          if (new Date(params.start_date) > new Date(params.end_date)) {
            this.$message.error('结束时间不能小于开始时间');
            return
          }
        }
        try {
          this.oldEventList = [];
          let result = await this.$http.post('/cms/EventController/querySpecific', params);
          if (result.data.success) {
            this.tabPage1.totalNum = result.data.result.count;
            for (let item of result.data.result.rows) {
              for (let eventColorItem of this.eventColor) {
                if (item.status == eventColorItem.key) {
                  item.color = {
                    color: eventColorItem.color
                  }
                }
              }
            }
            let arr = result.data.result.rows;
            this.oldEventList = arr.sort(this.compare('create_date')).reverse()//按事件降序排列

          }
          setTimeout(function () {
            _this.loading = false
          }, 500);
        } catch (error) {
          this.$message.error('查询失败')

        }

      },
      refresh() {
        let _this = this
        this.loading = true;
        this.changeYellow = null;
        this.eventParams.parent_name = '';
        this.eventParams.source = '';
        this.eventParams.start_date = '';
        this.eventParams.end_date = '';
        this.eventParams.ObjName = '';
        this.eventParams.sub_name = '';
        this.eventParams.remarks = '';
        this.eventOldList();
        setTimeout(function () {
          _this.loading = false

        }, 1500);
      },
      handleChange(file, fileList) {
        this.fileList = fileList

      },
      removeHandleChange(file, fileList) {
        this.fileList = fileList

      },

      isOrg_process(){

        let _this = this;
        if ((_this.form.DeptName1 === '' && _this.form.DeptCode1 === '') || this.departList0.length === 0) {
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

      /**
       * 发起立案申请
       */

      async createCase(data) {
        let _this = this;

        let params = {
          case_code: '',
          case_type: _this.createCaseData.type,
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
          let resource = await _this.$http.get('/cms/EventController/queryEventGroup')
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
          // let resu = await _this.$http.post('/oa/OaCaseController/caseById', query);

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
            for(let i = 0;i<_this.addEventList.length;i++){
              if(query.id === _this.addEventList[i].id){
                _this.addEventList.splice(i,1)

              }

            }
            _this.showInfo = false;
            _this.changeYellow = null;
            _this.showEventList = true;
            _this.showProcess = false;

            // _this.IS_FLAG = true

            _this.$message({
              message: '立案成功',
              type: 'success'
            });

          }



        }catch(error){
          _this.$message.error('发起失败')
        }


      },
      /**
       *派遣核实
       */

      async sendVerify() {

        let _this = this;
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
        }
        else {
          _this.dialogShow = true
        }



      },

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
          _this.$confirm('确定不先派遣核实，直接立案?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            try {
              _this.GetProcessList();
              _this.showProcess = true
            } catch (error) {
              _this.$message.warn('操作失败')
            }

          }).catch((error) => {
            console.log(error)

          })
        }

      },

      /**
       * 事件作废
       */
      async isEventDone() {
        let _this = this;

        _this.$confirm('确定将事件作废?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let param = {
            id: _this.form.id
          };
          try {
            let res = await _this.$http.post('/cms/EventController/eventDone', param);
            if (res.data.success) {
              _this.$message.success('操作成功');
              _this.showInfo = false;
              _this.showEventList = true;
              for(let i = 0;i<_this.addEventList.length;i++){
                if(param.id === _this.addEventList[i].id){
                  _this.addEventList.splice(i,1)

                }

              }

            }
          } catch (error) {
            _this.$message.warn('操作失败')
          }
        }).catch((error) => {
          console.log(error)
        })
      },


      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange(val) {
        this.tabPage.pageSize = val;
        this.eventList();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange(val) {
        this.tabPage.currentPage = val;
        this.eventList();
      },
      /**
       * 切换每页条数
       * @params {Number} val 每页条数
       */
      handleSizeChange1(val) {
        this.tabPage1.pageSize = val;
        this.eventOldList();
      },
      /**
       * 切换页码
       * @params {Number} val 页码
       */
      handleCurrentChange1(val) {
        this.tabPage1.currentPage = val;
        this.eventOldList();
      },

      async closeDialog(value) {

        if (value === 0) {
          this.userList = [];
          this.getPlOrgListToTree(this.param);
          this.dialogShow = false

        } else if (value === 1) {
          let _this = this;
          _this.form.verify_date = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
          for (let item of _this.depart_org) {
            if (_this.form.DeptName1 === item.org_name) {
              _this.form.DeptCode1 = item.id
            }
          }
          let OBJ = {
            msg: _this.form,
            user_id: ''
          }



          if (_this.userList.length > 1) {
            // for (let item of _this.userList) {
            //   OBJ.user_id.push(item.id)
            // }
            _this.$message.error('只能选择一个核实人');
            return
          } else if (_this.userList.length === 0) {
            _this.$message.error('请选择一个核实人');
            return
          } else if (_this.userList.length === 1) {
            OBJ.user_id = _this.userList[0].id;


            try {
              let res = await  this.$http.post('/oa/OaNotifyController/sendMsgNotify', OBJ);
              if (res.data.success) {
                _this.dialogShow = false;
                this.showInfo = false;
                this.changeYellow = null;
                this.showEventList = true;
                for(let i = 0;i<_this.addEventList.length;i++){
                  if(OBJ.msg.id === _this.addEventList[i].id){
                    _this.addEventList.splice(i,1)

                  }

                }

                _this.$message({
                  message: '发送成功',
                  type: 'success'
                });
              }

            } catch (error) {
              _this.dialogShow = false;
              _this.$message.error('请求错误', error);

            }
          }
        }

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

      // renderContent(h, { node, data, store }) {
      //   if (node.data.parentid) {
      //     return (
      //       <span>
      //       <base-icon icon="bumen" style='color:rgba(32, 160, 255, 0.52)'/>
      //       <span class="el-tree-node__label" style='margin-left:5px;'>{node.data.tree_name}</span>
      //     </span>
      //   )
      //   } else {
      //     return (<span>
      //       <span style={{
      //       fontSize: '12px',
      //         width: '24px',
      //         height: '24px',
      //         'line-height': '24px',
      //         'text-align': 'center',
      //         display: 'inline-block',
      //         background: '#20a0ff',
      //         borderRadius: '15px',
      //         color: 'rgb(255, 255, 255)',
      //         margin: ' 0px 5px 0px 0px'
      //     }} >{node.data.tree_name.substring(0, 1)}</span>
      //     <span class="el-tree-node__label">{node.data.tree_name}</span>
      //     </span>)
      //
      //   }
      // },

      /**
       *查询组织结构信息(树)
       */
      async getPlOrgListToTree(parms) {

        const _self = this;
        // let ARR = [];
        try {
          let parm = {};
          if (parms) {
            parm = parms
          }

          const callBackData = await _self.$http.get('/oa/OaNotifyController/orgAndUser', {params: parm});

          if (callBackData.data.success) {   //查询成功
            let result = callBackData.data.result;

            // let orgId = _self.$getUserData('org_id');
            // for(let item of result){
            //     if (item.id === orgId || item.parent_id === orgId) {
            //       ARR.push(item);
            //     }
            // }
            //
            //
            // setTimeout(function () {
            //
            //   _self.TreeData = _self.toTreeData(ARR);
            // }, 1000);

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
          }


          else {
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
      selectedNode(data) {
        this.departTreeChangeArr0 = data;
      },
      addIndex(val){
        this.index = val;
      },

      closeEditDialog(value) {
        if (value === 1) {
          this.departList0 = this.departTreeChangeArr0;
          this.form.DeptName1 = this.departList0[0].id;

        }
        this.editDialog = false;
      },

      async GetProcessList(){
        let _this = this;
        console.log('2407',_this.form);
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
      }


    },

  }
</script>

<style type="text/css">
  .newRadius {
    width: 10px;
    height: 10px;
    background: #ed3f14;
    border-radius: 10px;
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

  .notify_circle {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    background: red;
  }

  .event-head {
    display: flex;
    height: 28px;
    background: #ffc713;
  }

  .event-head .event-icon {
    font-size: 18px;
    padding: 0px 0px 2px 0px;
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
    padding: 5px;
    margin-left: 5px;
  }

  .wait-deal {
    flex: 1;
    background: #ffffff;
    width: 280px;
    float: right;
    -moz-box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
    -webkit-box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
    box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
  }

  .event-head .btn-close {
    padding: 5px 0px 5px 5px;
    /*margin-left: 160px;*/
    font-size: 14px;

  }

  .detail-head .btn-close {
    padding: 5px 0px 5px 5px;
    /*margin-left: 160px;*/
    font-size: 14px;
    cursor: pointer;
    flex: 1
  }

  .event-form {
    padding: 5px;
  }

  .data-event {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-right: 0px;

  }

  .data-event-list {
    overflow-y: auto;
  }

  .data-event-list-item {
    display: flex;
    flex-direction: row;
    padding: 5px 5px 2px 5px;
    border-bottom: 1px solid #cccccc;
    cursor: pointer;
  }

  .data-event-list-item:hover {
    background: #cccccc;
  }

  .data-event-icon {
  }

  .data-event-content {
    flex: auto;
  }
  .wait-data-event{animation:fadeInLeft 0.5s 0s 1 both}
  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translate3d(-100%, 0, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .history-data-event {animation: fadeInRight 0.5s 0s 1 both}
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translate3d(100%, 0, 0);
    }

    to {
      opacity: 1;
      transform: none;
    }
  }

  .yellowGround {
    background: #ffc713;
  }

  .data-event-list-item a:hover {
    background: #cccccc;
  }

  .dataEventListItem {
    animation: BounceSlideDown 1s 0s infinite both
  }

  @keyframes BounceSlideDown {
    0% {
      transform: translateY(-100%);
    }
    50% {
      transform: translateY(8%);
    }
    65% {
      transform: translateY(-4%);
    }
    80% {
      transform: translateY(4%);
    }
    95% {
      transform: translateY(-2%);
    }
    100% {
      transform: translateY(0%);
    }
  }

  .event-describe {
    display: flex;
    font-size: 12px;
    justify-content: space-between;
  }

  .event-icon {
    color: #f86476;
  }

  .event-address {
    color: #666666;
    width: 70%;
  }

  .event-date {
    color: #999999;
    font-size: 12px;
  }

  .event-status {
    font-size: 12px;
    /*margin-left: 10px;*/
  }

  .event {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
  }

  .event-reason {
    font-size: 12px;
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
    flex: 1;
  }

  .detail-icon {
    font-size: 12px;

    /*padding: 5px;*/
  }

  .detail-title {
    font-size: 12px;
    padding: 5px 5px 5px 5px;
    margin-left: 5px;
    flex: 8;
  }

  .case-scroll {
    overflow: hidden;
    overflow-y: auto;
    bottom: 20px;
    padding: 5px;
  }

  .detail-content {
    display: flex;
    flex-direction: column;
    padding: 5px;
  }

  .case-id {
    display: flex;
    justify-content: space-between;
    /*border-bottom: 1px solid #CCCCCC;*/
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
    /*border-bottom: 1px solid #cccccc;*/
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
    /*background-image: url("../../../assets/images/jinggai.jpg");*/
    /*height: 100px;*/
    /*width: 116px;*/

  }

  .case-footer {
    display: flex;
    flex-direction: row;
    height: 28px;
    /*width: 280px;*/
    /*padding-bottom: 5px;*/
    justify-content: space-around;
  }

  .event-head .el-tabs--border-card > .el-tabs__content {
    padding: 0px;
  }

  .event-head .el-tabs__nav {
    position: relative;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    float: left;
    /*z-index: 2;*/
    width: 100%;
  }

  .event-head .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #409EFF;
    background-color: #fff;
    border-right-color: #dcdfe6;
    border-left-color: #dcdfe6;
    width: 50%;
  }

  .event-head .el-tabs--border-card > .el-tabs__header .el-tabs__item {
    -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    border: 1px solid transparent;
    margin: -1px -1px 0;
    color: #909399;
    width: 52%;
  }

  .case-footer .el-button + .el-button {
    margin-left: 0px;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-show-enter-active {
    transition: all 0.6s ease;
  }

  .slide-show-leave-active {
    transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-show-enter,
  .slide-show-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }

  .case-apply {
    flex: 1;
    font-size: 12px;
    text-align: center;
    padding: 5px;
    color: #ffffff;
    background: #33c400;
    cursor: pointer;
  }

  .case-check {
    flex: 1;
    font-size: 12px;
    text-align: center;
    padding: 5px;
    color: #ffffff;
    background: #ff3c00;
    cursor: pointer;

  }

  .case-close {
    flex: 1;
    font-size: 12px;
    text-align: center;
    padding: 5px;
    color: #ffffff;
    background: #999999;
    cursor: pointer;
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
  .class_process .el-dialog {
    position: relative;
    margin: 50px auto 50px;
    background: #fff;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 80%;
    height: 90%;
  }
  .class_process .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
    height: 90%;
  }
</style>
