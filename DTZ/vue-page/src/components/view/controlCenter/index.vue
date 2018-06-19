<template>
  <div v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="control-center">
    <base-map :center="center" :height="height" @ready="ready" :zoom="15"></base-map>

    <div :class="['control-content',rightShow?'':'hideright']">
      <div>

        <!-- 部件详情部件详情 -->
        <transition name="spacepartinfo">
          <div class="control-content-no1" style="width:300px;" v-show="isShowPartInfo">
            <div class="control-tabs" :style="themeBg">
              <div class="control-tabs-menu">
                <base-icon style="font-size:25px;" icon="newcarid" />

              </div>
              <div class="control-tabs-title">
                <span style="font-size:16px;">部件信息</span>
              </div>
              <div class="control-tabs-close">
                <base-icon style="font-size:16px;" icon="close" @click.native="hidePartInfo" />
              </div>
            </div>
            <div v-loading="partsLoading">
              <!-- 部件信息 -->
              <div class="control-info">
                <div class="control-info-title">
                  <div class="control-info-title-name">
                    <span style="font-size:16px;font-weight:500">{{partInfo.cms_parts_group.group_name}}</span>
                    <span class="control-info-title-type">{{setPartType(partInfo.cms_parts_group.parent_id)}}</span>
                  </div>
                  <!-- <div class="control-info-title-type">123</div> -->
                  <!-- <div class="control-info-title-buttom"> -->
                  <!-- <el-button type="primary">上报事件</el-button> -->
                  <!-- </div> -->
                </div>
                <div style="margin-top:5px;">
                  <base-icon style="font-size:16px;color:#f93f54" icon="map2" />
                  <span style="font-size:12px;">{{partInfo.address_name}}</span>
                </div>
                <div style="margin-top:5px;">
                  <span>部件状态：</span>
                  <span :style="partTypeColor">
                    <base-icon style="font-size: 18px;" :icon="setPartTypeIcon(partInfo.ObjState)" />
                    <span>{{partInfo.ObjState}}</span>
                  </span>

                </div>
              </div>
              <!-- 描述 -->
              <div class="control-note">
                <div>描述</div>
                <div style="font-size: 12px;color:#989898;margin-top: 5px;">{{setPartNote(partInfo.Note)}}</div>
                <div class="control-note-img">
                  <!-- <div class="control-note-img-con" v-for="(item,index) in showImg" :key="index">
                    <base-img :src="item" />
                  </div> -->
                  <base-img :src="showImg" />
                </div>
                <div style="margin-top:5px;">
                  <div>
                    <span> 部件标识码：</span>
                    <span style="font-size:12px;">{{setText(partInfo.ObjID)}}</span>
                  </div>
                  <div>
                    主管部门：{{setText(partInfo.DeptName1)}}
                  </div>
                  <div>
                    权属单位：{{setText(partInfo.DeptName2)}}
                  </div>
                  <div>
                    权属单位：{{setText(partInfo.DeptName3)}}
                  </div>
                  <div>
                    数据来源：{{setText(partInfo.DataSource)}}
                  </div>

                </div>
              </div>
              <!-- 案件记录 -->
              <div>
                <div class="control-tabs" :style="themeBg">
                  <div class="control-tabs-menu">
                    <base-icon style="font-size:25px;" icon="shijian" />

                  </div>
                  <div class="control-tabs-title">
                    <span style="font-size:16px;">案件记录</span>
                  </div>
                </div>
                <div class="control-case-info">
                  <div v-if="partCaseInfo.length>0" class="control-case-info-content" v-for="item in partCaseInfo" :key="item.id">
                    <div>{{item.remarks}}</div>
                    <div style="margin-top:3px;color:#989898">{{formatTime(item.create_date)}}</div>
                  </div>
                  <div v-if="partCaseInfo.length==0" style="width:100%;text-align:center;font-size:200px;">
                    <base-icon icon="zanwu" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <!-- 案件详情 -->
        <transition name="spacepartinfo">
          <div class="control-content-no1" style="width: 300px" v-show="isShowCaseInfo">
            <div class="control-tabs" :style="themeBg">
              <div class="control-tabs-menu">
                <base-icon style="font-size:25px;" icon="newcarid" />

              </div>
              <div class="control-tabs-title">
                <span style="font-size:16px;">案件详情</span>
              </div>
              <div class="control-tabs-close">
                <base-icon style="font-size:16px;" icon="close" @click.native="hideCaseInfo" />
              </div>
            </div>
            <div v-loading="caseLoading">
              <!-- 案件信息 -->
              <div class="control-info info-height">
                <div class="info-height-status">
                  <base-icon v-if='caseInfo.bpmn_hi_procinst.status==2' icon="shenhe" />
                  <base-icon v-if='caseInfo.bpmn_hi_procinst.status==0' icon="bohui" />
                  <base-icon v-if='caseInfo.bpmn_hi_procinst.status==1' icon="tongyi" />

                </div>
                <div class="control-info-title" style="margin-top:3px;">
                  <div class="control-info-title-case-title">案卷编号:</div>
                  <div class="control-info-title-case-content">{{caseInfo.case_code}}</div>
                </div>
                <div class="control-info-title" style="margin-top:5px;">
                  <div class="control-info-title-case-title">案件发起人:</div>
                  <div class="control-info-title-case-content">
                    <span>{{caseInfo.sys_user?caseInfo.sys_user.realname :'未知'}}</span>
                  </div>
                </div>
                <div class="control-info-title" style="margin-top:5px;">
                  <div class="control-info-title-case-title">案件类型:</div>
                  <div class="control-info-title-case-content">
                    <span>{{caseInfo.sub_name}}</span>
                    <span class="control-info-title-type">{{caseInfo.parent_name}}</span>
                  </div>
                </div>
                <div class="control-info-title" style="margin-top:5px;">
                  <div class="control-info-title-case-title">发生地点:</div>
                  <div class="control-info-title-case-content">{{caseInfo.ObjPosition}}</div>
                </div>
                <div class="control-info-title" style="margin-top:5px;">
                  <div class="control-info-title-case-title">案件描述:</div>
                  <div class="control-info-title-case-content">{{caseInfo.remarks}}</div>
                </div>
                <div class="control-info-title" style="margin-top:5px;">
                  <div class="control-info-title-case-title">案件图片:</div>
                  <div class="control-info-title-case-content"></div>
                </div>
                <div class="control-note" style="padding:5px 0px">
                  <div class="control-note-img">
                    <!-- <div class="control-note-img-con" v-for="(item,index) in caseInfoshowImg" :key="index">
                      <base-img :src="item" />
                    </div> -->
                    <base-img v-if="caseInfoshowImg.length!=0" :src="caseInfoshowImg" />
                    <div v-if="caseInfo.case_type==1&&caseInfo.img.length==0" style="width:100%;margin-top: 40px;color: #989898; text-align:center;font-size:30px;">
                      暂无图片
                    </div>
                    <!-- <div class="control-note-img-con" v-for="(item,index) in showImg" :key="index">
                  <base-img :src="item" />
                </div> -->
                  </div>

                </div>
              </div>
              <!-- 描述 -->

              <!-- 案件记录 -->
              <div>
                <div class="control-tabs" :style="themeBg">
                  <div class="control-tabs-menu">
                    <base-icon style="font-size:25px;" icon="shijian" />

                  </div>
                  <div class="control-tabs-title">
                    <span style="font-size:16px;">案件流程</span>
                  </div>
                </div>
                <div class="control-case-info" v-loading="caseInfoLoading" style="height:350px;margin-top:10px; overflow: auto;">
                  <base-time-line v-if="caseInfoLine.length>0" style="padding-left:10px">
                    <base-time-line-item v-for='(item,index) in caseInfoLine' :key="item.id">

                      <div style="overflow:hidden;cursor: pointer;height:21px;line-height:21px;" @click="setCaseLineShow(index)">
                        <div style="float:left;">
                          <span style="color: #00a0ea;font-size: 16px">{{item.name}}</span>
                          <span style="color: #989898;font-size: 12px">{{item.task_status==1?'[结束]':'[未结束]'}}</span>
                        </div>
                        <div style="float:right;font-size:12px;margin-right:10px;color:#989898">{{formatTime(item.start_time)}}</div>
                      </div>
                      <div v-show="item.show" style="padding: 10px;color:rgb(100, 103, 105); background-color: rgba(152, 152, 152, 0.29)">
                        <div style="overflow: hidden;" v-show="item.act_type=='UserTask'">
                          <div style="float: left">处理人：</div>
                          <div style="float: right">{{item.sys_user?item.sys_user.realname:'未知' }}</div>
                        </div>
                        <div style="overflow: hidden;">
                          <div style="float: left">处理时长：</div>
                          <div style="float: right">{{setDuration(item.duration)}}</div>
                        </div>
                        <div style="overflow: hidden;">
                          <div style="float: left">说明：</div>
                          <div style="float: right">{{item.description||'无'}}</div>
                        </div>
                        <div style="overflow: hidden;">
                          <div style="float: left">附件:</div>
                          <div style="float: right">
                          </div>
                        </div>
                        <div v-show='item.uploadImgs!=null&&item.uploadImgs!=""' style="overflow: hidden;height:110px;">
                          <base-img :src="setAttachment(item.uploadImgs)" />
                        </div>

                      </div>
                    </base-time-line-item>
                  </base-time-line>
                  <div v-if="caseInfoLine.length==0" style="width:100%;text-align:center;font-size:200px;">
                    <base-icon icon="zanwu" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <!-- 部件、案件分类 -->
        <div class="control-content-no1">
          <div class="control-tabs" :style="themeBg">
            <div @click="tabsClick(1)" :style="themeBg" :class="['control-pane',tabsIndex==1?'is_active':'']">
              <base-icon style="font-size:20px;" icon="shijianwarn" />
              <span style="margin-left:6px;">案卷展示</span>
            </div>
            <div @click="tabsClick(2)" :style="themeBg" :class="['control-pane',tabsIndex==2?'is_active':'',isgetPart?'partDisable':'']">
              <base-icon style="font-size:20px;" icon="bujian" />
              <span style="margin-left:6px;">{{isgetPart?'部件获取中...':'部件管理'}}</span>
            </div>
          </div>
          <!-- 案件 -->
          <div ref='caseDiv1' class="control-tabs-content" v-show="tabsIndex==1">
            <div ref='caseDiv2' style="padding:10px 10px 20px 10px;  border-bottom: 1px solid rgba(204, 204, 204, 0.49);">
              <!-- 查询条件 -->
              <div>
                <el-select class="caseSelect" v-model="caseSelect.typeSelectMode" placeholder="案件类型">
                  <el-option v-for="item in eventGroupOptions" :key="item.id" :label="item.group_name" :value="item.id"></el-option>
                </el-select>
                <el-date-picker style="margin-top:10px;" v-model="caseSelect.caseTime" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                </el-date-picker>
                <div class="caseButton">
                  <el-input clearable v-model="caseSelect.searchKey" placeholder="关键字搜索">
                    <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
                  </el-input>
                </div>

              </div>

            </div>
            <div>
              <!-- 案件列表 -->
              <div :style="caseHeight">
                <div v-if="compCaseData.length>0" v-for="item in compCaseData" :class="['control-tabs-content-case',item.click?'control-tabs-content-case-click':'']" @click="clickCaseInfo(item)">
                  <div class="control-tabs-content-case-icon">
                    <span> </span>
                  </div>
                  <div class="control-tabs-content-case-content">
                    <!-- <div>{{item.remarks}}</div> -->
                    <div style="overflow:hidden">
                      <div style="float:left;width:150px">
                        <base-text-overflow :text="item.remarks"></base-text-overflow>
                      </div>
                      <div style="float:right">
                        <span :style="setCaseTypeText(item.bpmn_hi_procinst.status).style">{{setCaseTypeText(item.bpmn_hi_procinst.status).text}}</span>
                      </div>
                    </div>

                    <div style="color:#989898;font-size:12px;margin-top:3px">
                      <div style="float:left;width:90px">
                        <base-text-overflow :text="item.case_type==1?item.sub_name:item.parent_name"></base-text-overflow>
                      </div>
                      <div style="float:right;text-align:right;font-size:12px;">{{formatTime(item.create_date)}}</div>
                    </div>
                  </div>
                </div>
                <div style="width:100%;text-align:center;font-size:200px;" v-if="compCaseData.length==0">
                  <base-icon icon="zanwu" />
                </div>
              </div>
              <div ref='caseDiv3' class="control-content-paging" v-show="compCaseData.length!=0">
                <el-pagination small @size-change="handleCurrentChange" @current-change="caseHandleCurrentChange" :currentPage="caseTabPage.currentPage" :pageSizes="caseTabPage.pageSizes" :pageSize="caseTabPage.pageSize" :total="caseTabPage.totalNum" layout="prev, pager, next">
                </el-pagination>
              </div>
            </div>
          </div>
          <!-- 部件 -->
          <div ref="partsDiv1" class="control-tabs-content" v-show="tabsIndex==2">
            <div style="padding:10px;" ref="partsDiv2">
              <div style="display:flex">
                <div class="control-tabs-content-select">
                  <el-select style="width:100%" v-model="selectList.areaSelectMode" @change='areaselectChange' placeholder="区域">
                    <el-option v-for="item in areaSelectOptions" :key="item.area_code" :label="item.area_name" :value="item.id"></el-option>
                  </el-select>
                </div>
                <div class="control-tabs-content-select">
                  <el-select v-model="selectList.cellSelectMode" @change='cellselectChange' :disabled="toolMode!=2" placeholder="单元格">
                    <el-option v-for="item in cellSelectOptions" :key="item.id" :label="item.BGID" :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
              <!-- <div class="control-tabs-content-search">
              <el-input v-model="searchPartsMode" placeholder="部件名称">
                <el-button type="primary" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div> -->

              <div class="control-tabs-content-checkbox">
                <div style="margin-bottom:3px;">部件分类</div>
                <el-checkbox-group v-model="partsGroupMode">
                  <el-checkbox v-for="item in partGroupData" :key="item.id" :label="item.id">{{item.group_name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="control-tabs-content-change">
                <div>部件状态</div>
                <div style="margin-top:5px;padding:3px;" class="partSelect">
                  <el-select v-model="selectList.stateMode" @change='stateSelectChange' placeholder="状态">
                    <el-option v-for="(item,index) in partTypeStyle" :key="index" :label="item.key" :value="item.key"></el-option>
                  </el-select>
                </div>
              </div>
            </div>

            <div :style="partsHeight">
              <div v-if="compPartsData.length>0" class="control-table" v-for="item in compPartsData" :key="item.id" @click='clickPartInfo(item)'>
                <div class="control-table-index">

                  <img :src="imgUrl(item.cms_parts_group.group_pic_path)">
                </div>
                <div class="control-table-list">
                  <div class="control-table-list-title">{{item.cms_parts_group.group_name}}</div>
                  <div class="control-table-list-content">{{item.address_name}}</div>

                </div>

              </div>
              <div style="width:100%;text-align:center;font-size:200px;" v-if="compPartsData.length==0">
                <!-- 123 -->
                <base-icon icon="zanwu" />
              </div>
            </div>
            <div ref="partsDiv3" class="control-content-paging" v-show="compPartsData.length!=0">
              <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum" layout="prev, pager, next">
              </el-pagination>
            </div>
          </div>

        </div>

      </div>
    </div>
    <!-- 图表统计 -->
    <div :class="['control-chart',leftShow?'':'hideleft']">
      <!-- 图表1 -->
      <div class="control-chart-content">
        <div class="control-chart-content-head" :style="themeBg">
          <div class="control-chart-menu">
            <base-icon icon="tongji" />
          </div>
          <div class="control-chart-title">
            {{tabsIndex==1?'案件数量统计':'部件统计'}}
          </div>
          <div class="control-chart-close">

            <!-- <base-icon  @click.native="setShow('show_1')" :icon="countShow.show_1?'jiahao':'jianhao'" /> -->
          </div>
        </div>
        <div class="control-chart-content-txt" v-show="countShow.show_1">
          <chart :options="chartTypeOptions" auto-resize></chart>
        </div>
      </div>

      <!-- 案件发生地 -->
      <div v-if="chartShow">
        <div class="control-chart-content">
          <div class="control-chart-content-head" :style="themeBg">
            <div class="control-chart-menu">
              <base-icon icon="tongji" />
            </div>
            <div class="control-chart-title">
              案件发生地排行
            </div>
            <div class="control-chart-close">
              <!-- <base-icon @click.native="setShow('show_3')" :icon="countShow.show_3?'jiahao':'jianhao'" /> -->
            </div>
          </div>
          <div class="control-chart-content-txt" v-show="countShow.show_3">
            <div class="control-chart-content-txt-local">
              <div class="local" v-for="(item,index) in caseChartLocal" :key="index">
                <div class="local-title">NO.{{index+1}}</div>
                <div class="local-content">
                  <span style="color:#3e3e3e">{{item.name}}</span>
                  <span style="float:right">{{item.count+'件'}}</span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 部门统计 -->
      <div v-if="chartShow" class="control-chart-content">
        <div class="control-chart-content-head" :style="themeBg">
          <div class="control-chart-menu">
            <base-icon icon="tongji" />
          </div>
          <div class="control-chart-title">
            部门案件统计
          </div>
          <div class="control-chart-close">
            <!-- <base-icon @click.native="setShow('show_3')" :icon="countShow.show_3?'jiahao':'jianhao'" /> -->
          </div>
        </div>
        <div class="control-chart-content-txt" v-show="countShow.show_3">
          <div style=" overflow: hidden; margin-top:5px;padding:0 5px">
            <span style="float:left;height:28px;line-height:28px;">部门选择</span>
            <!-- <el-cascader  @change="selectGroupChange" :options="orgOptions"  change-on-select :props="cascaderProps"></el-cascader> -->
            <div class="tagClass" @click="chooseDepart">
              <el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type" v-for="(item,index) in attendanceClerk" :key="item.id">
                {{item.org_name}}
              </el-tag>
            </div>
          </div>
          <div class="chartOrg">
            <chart :options="chartOrgOptions" auto-resize></chart>
          </div>
        </div>
      </div>

      <!-- 图表2 -->
      <div class="control-chart-content">
        <div class="control-chart-content-head" :style="themeBg">
          <div class="control-chart-menu">
            <base-icon icon="tongji" />
          </div>
          <div class="control-chart-title">
            <div style="float: left"> {{tabsIndex==1?'案件类别统计':'部件类型统计'}} </div>
          </div>
          <div class="control-chart-close">
            <!-- <base-icon @click.native="setShow('show_2')" :icon="countShow.show_2?'jiahao':'jianhao'" /> -->
          </div>
        </div>
        <div class="control-chart-content-txt" v-show="countShow.show_2">
          <chart :options="chartPieOptions" auto-resize></chart>
        </div>
      </div>
      <!-- 图表3 -->
      <div v-if="!chartShow" class="control-chart-content">
        <div class="control-chart-content-head" :style="themeBg">
          <div class="control-chart-menu">
            <base-icon icon="tongji" />
          </div>
          <div class="control-chart-title">
            部件分类统计
          </div>
          <div class="control-chart-close">
            <!-- <base-icon @click.native="setShow('show_3')" :icon="countShow.show_3?'jiahao':'jianhao'" /> -->
          </div>
        </div>
        <div class="control-chart-content-txt" v-show="countShow.show_3">
          <chart :options="damagePieOptions" auto-resize></chart>
        </div>
      </div>

    </div>
    <!-- 公告信息 -->
    <div v-if="chartShow" :class="['control-notic',leftShow?'':'leftnotic']" :style="noticBg">
      <div class="control-notic-content">
        <div class="contro-notic-content-item" v-for="(item,index) in caseTotalWindow" :key="index">
          <div class="contro-notic-content-item-title">
            <base-icon style="font-size:14px" :icon='item.icon' />
            <span>{{item.name}}</span>
          </div>
          <div class="contro-notic-content-item-num" :style="numColor">
            {{item.value}}
          </div>
        </div>

      </div>

    </div>
    <!-- 地图工具 -->
    <div :class="['control-map-tool',rightShow?'':'toolright',isShowPartInfo||isShowCaseInfo?'toolleft':'']">
      <!-- 地图工具选择 -->
      <div class="control-content-tool">
        <div title="区域选择" :class="['control-content-tool-item',toolMode==1?'contlor-content-tool-color':'']" @click="setTool(1)">
          <div>
            <base-icon class="control-icon" icon="quyu" />
          </div>
          <!-- <span>区域选择</span> -->
        </div>
        <div title="单元选择" :class="['control-content-tool-item',toolMode==2?'contlor-content-tool-color':'']" @click="setTool(2)">
          <div>
            <base-icon class="control-icon" icon="danyuange" />
          </div>
          <!-- <span>单元选择</span> -->
        </div>
        <!-- 案件、部件显示隐藏 -->
        <div :title="toolInfo.toolPartName" style="margin-top:20px" :class="['control-content-tool-item',showMark?'contlor-content-tool-color':'']" @click="setTool(3)">
          <div>
            <base-icon class="control-icon" :icon="toolInfo.toolPartIcon" />
          </div>
          <!-- <span>{{toolInfo.toolPartName}}</span> -->
        </div>
        <!-- <div v-if="tabsIndex==1" :class="['control-content-tool-item',showreli?'contlor-content-tool-color':'']" @click="showReLiLayer()">
          <div>
            <base-icon class="control-icon" :icon="showreli?'reli':'reliyincan'" />
          </div>
          <span style="font-size:12px">{{toolInfo.toolCaseRLi}}</span>

        </div> -->
        <div title="重置" :class="['control-content-tool-item',showall?'contlor-content-tool-color':'']" @click="showAllClick()">
          <div>
            <i class="el-icon-refresh" style="font-size:25px;margin-bottom:3px;" />
            <!-- <base-icon class="control-icon" :icon="showreli?'reli':'reliyincan'" /> -->
          </div>
          <!-- <span style="font-size:12px">重置</span> -->

        </div>
      </div>
    </div>
    <!-- 左手右手 -->
    <div :class="['control-left',leftShow?'':'hideleftIcon']" :title="leftShow?'隐藏图表统计':'展开图表统计'" @click='leftControl'>
      <!-- <base-icon  :icon="leftShow?'left':'right'" /> -->
      <base-icon icon="left" />
    </div>
    <div :class="['control-right',rightShow?'':'hiderightIcon']" :title="rightShow?'隐藏列表':'展开列表'" @click='rightControl'>
      <!-- <base-icon :icon="rightShow?'right':'left'" /> -->
      <base-icon icon="right" />

    </div>
    <el-dialog ref="test" title="部门选择" :visible.sync="dialogVisible" class="groupclass" :close-on-click-modal="false" width="35%">
      <Org style="height: 335px;overflow-y: scroll" :dialog-visible="dialogVisible" type="attendanceClerk" ref="attendanceClerk" :setSelect='setSelectList' @selectdNode='selectdNode' title="部门选择" :strictly="true"></Org>
      <div style="text-align: right;margin-top: 10px;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog(0)">取 消</el-button>
          <el-button type="primary" @click="closeDialog(1)">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import BaseMap from 'common/BaseMap';
import paging from 'common/BasePaging.vue';
import BaseImg from 'common/BaseImg';
import { graphic } from 'echarts/lib/export';
import {
  getDicData,
  addMapLayer,
  getCenterPoint,
  formatSeconds,
  toThousands,
  transData
} from 'assets/js/commonManage.js';
import moment from 'moment';
import BaseTextOverflow from 'common/BaseTextOverflow';
import BaseTimeLine from 'common/BaseTimeLine/BaseTimeLine.vue';
import BaseTimeLineItem from 'common/BaseTimeLine/BaseTimeLineItem.vue';
import Org from 'common/departTree';
export default {
  components: {
    BaseMap,
    paging,
    BaseImg,
    BaseTextOverflow,
    BaseTimeLine,
    BaseTimeLineItem,
    Org
  },
  data() {
    let data = [];

    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI;
      let r = Math.sin(2 * t) * Math.cos(2 * t);
      data.push([r, i]);
    }
    return {
      height: document.body.clientHeight - 50,
      numColor: {
        color: '#ffc614'
      },
      noticBg: {
        borderColor: '#ffc614'
      },
      caseHeight: {
        marginTop: '10px',
        height: '0px',
        overflow: 'auto'
      },
      partsHeight: {
        padding: '0px',
        height: '0px',
        overflow: 'auto'
      },
      dialogVisible: false,
      setSelectList: [],
      attendanceClerk: [],
      leftShow: true,
      rightShow: true,
      ChartStyle: {
        left: 0
      },
      approveStatusStyle: {
        float: 'left',
        color: '#ccc'
      },
      shzt: [],
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      orgOptions: [],
      departTreeChangeArr: [],
      chartOrgOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },

        grid: {
          top: '5%',
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            // alignWithLabel: true
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        series: []
      },
      cascaderProps: {
        value: 'id',
        label: 'org_name',
        children: 'children'
      },
      isgetPart: true,
      chartShow: true,
      isFirst: true,
      caseInfoLoading: false,
      countShow: {
        show_1: true,
        show_2: true,
        show_3: true
      },
      damagePieOptions: {
        tooltip: {
          trigger: 'item',
          position: ['40%', '10%'],
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                // lineStyle: {
                //   color: "rgba(255, 255, 255, 0.3)"
                // },
                smooth: 0.2,
                length: 15,
                length2: 10
              }
            },
            //  roseType : 'radius',
            data: [
              {
                name: '完好',
                value: 0
              },
              {
                name: '损坏',
                value: 0
              },
              {
                name: '废弃',
                value: 0
              },
              {
                name: '丢失',
                value: 0
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      chartPieOptions: {
        tooltip: {
          trigger: 'item',
          position: ['40%', '10%'],
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '部件数',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            labelLine: {
              normal: {
                // lineStyle: {
                //   color: "rgba(255, 255, 255, 0.3)"
                // },
                smooth: 0.2,
                length: 15,
                length2: 10
              }
            },
            //  roseType : 'radius',
            data: [
              {
                name: '公用设施',
                value: 0
              },
              {
                name: '交通设施',
                value: 0
              },
              {
                name: '市容环境设施',
                value: 0
              },
              {
                name: '园林绿化设施',
                value: 0
              },
              {
                name: '其他部件',
                value: 0
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      heatmapOverlay: '', //热力图图层
      showreli: true,
      chartTypeOptions: {
        // color: ['#00a0ea'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          feature: {
            // dataView: {
            //   show: true,
            //   readOnly: false
            // },
            magicType: {
              show: true,
              type: ['line', 'bar', 'pie']
            }
            // restore: {
            //   show: true
            // },
            // saveAsImage: {
            //   show: true
            // }
          }
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '公用设施',
              '交通设施',
              '市容环境设施',
              '园林绿化设施',
              '其他部件'
            ],
            axisTick: {
              // alignWithLabel: true
              show: false
            },
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          }
        ],
        series: [
          {
            name: '部件数',
            type: 'bar',
            // barWidth: '60%',
            itemStyle: {
              normal: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0, 160, 234, 0.3)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(0, 160, 234, 0.5)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 160, 234, 1)'
                  }
                ])
              }
            },
            data: [0, 0, 0, 0, 0]
          }
        ]
      },
      caseListClick: {},
      labelText: '',
      caseLoading: false,
      isShowPartInfo: false, //是否显示部件信息
      isShowCaseInfo: false,
      showall: false,
      showMark: false, //显示聚合图层
      toolInfo: {
        toolPartName: '隐藏部件',
        toolPartIcon: 'yincan',
        toolCaseRLi: '热力图'
      },
      partTypeStyle: [
        {
          key: '全部',
          damage: false //统计标识
        },
        {
          key: '完好',
          value: '#2cc26b',
          icon: 'wanhao',
          damage: true
        },
        {
          key: '损坏',
          value: '#e6a23c',
          icon: 'sunhuai',
          damage: true
        },
        {
          key: '废弃',
          value: '#f56c6c',
          icon: 'feiqi',
          damage: true
        },
        {
          key: '丢失',
          value: '#909399',
          icon: 'diushi',
          damage: true
        }
      ],
      partTypeColor: {
        color: '#606266'
      },
      space: 50,
      partsLoading: false,
      partInfo: {
        DataSource: '实测',
        DeptName1: '',
        DeptName2: '',
        DeptName3: '',
        Note: '',
        ObjID: '',
        ObjName: '',
        ObjState: '完好',
        address_name: '昆明市穿金路中段162号',
        baidu_x: '',
        baidu_y: '',
        cms_parts_group: {
          id: 8,
          parent_id: 2,
          group_name: '雨水井盖',
          group_pic_path: 'static/upload/partIcons/雨水井盖.svg'
        },
        id: '',
        pic_path: '1512634538727fbab2195.jpg'
      },
      caseInfo: {
        BGID: '',
        DeptCode1: '',
        DeptName1: '',
        ObjPosition: '',
        baidu_x: '',
        baidu_y: '',
        businesskey: '',
        case_code: '',
        case_type: '',
        create_by: '',
        create_date: '',
        del_flag: '',
        group_code: '',
        bpmn_hi_procinst: {
          status: 0
        },
        group_parent: {
          group_code: '',
          group_level: '',
          group_name: '',
          group_pic_path: '',
          id: '',
          parent_id: '',
          remark: ''
        },
        img: '',
        id: '',
        parent_name: '',
        remarks: '',
        sub_name: '',
        update_by: '',
        update_date: ''
      },
      caseInfoLine: [], //案件流转信息
      toolMode: 2, //地图工具模式 (1:区域选择 2：单元格选择 3：热力图)
      partGroupData: [], //部件分类数据
      partsGroupMode: [], // 部件类型复选框
      searchPartsMode: '', //部件搜索
      selectList: {
        //区域，单元格下拉选择
        areaSelectMode: '', //区域select选择
        cellSelectMode: '', // 单元格select选择
        stateMode: '全部'
      },

      tabsIndex: 1, //选项卡切换初始值
      loading: false, //遮罩
      partsData: [], //部件数据
      map: '', //地图

      center: {
        //地图中心点
        lng: 103.671826,
        lat: 25.037481
      },
      areaData: [], //区域数据
      cellData: [], //单元格数据
      defaultStyle: {
        //多边形Stype默认样式
        strokeColor: this.$webconfig.PolygonStyle.strokeColor, //边线颜色。
        fillColor: this.$webconfig.PolygonStyle.fillColor, //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2, //边线的宽度，以像素为单位。
        strokeOpacity: 0.3, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      },
      markerClusterer: '', //部件聚合图层
      marks: [], //部件聚合所有点坐标信息
      caseMarkerClusterer: '', //部件聚合图层
      caseMarks: [], //部件聚合所有点坐标信息
      tabPage: {
        //分页
        totalNum: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 30, 50]
      },
      caseTabPage: {
        //分页
        totalNum: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 30, 50]
      },
      selectPartsData: [], //用户点击地图区域或者单元格获取到范围类的部件列表(原始数据)
      selectCaseData: [],
      selectMapLayer: '', //当前地图选中图层（区域或者单元格）
      showMarks: [], //部件watch监听后过滤出需要显示的mark坐标集合
      showCaseMarks: [], //案件watch监听后过滤出需要显示的mark坐标集合
      caseData: [], //事件数据总和
      partCaseInfo: [], //部件中案件信息
      caseSelect: {
        //案件查询
        caseTime: '',
        searchKey: '',
        typeSelectMode: 0
      },
      eventGroupData: [], //事件分类
      eventGroupOptions: [], //时间分类大类
      caseChartLocal: [], //案件街道排行榜
      caseTotalWindow: [
        {
          name: '案件数量',
          icon: 'anjiancont',
          value: '0'
        },
        {
          name: '已完成',
          icon: 'success',
          value: '0'
        },
        {
          name: '未完成',
          icon: 'warn',
          value: '0'
        },
        {
          name: '处理速度',
          icon: 'shandian',
          value: '0'
        }
      ]
    };
  },
  watch: {
    socketCase(val) {
      //监听实时推送信息
      if (val != null) {
        console.log('案件实时同步');
        // if (val.moduleName === "jdzh") {
        this.getCaseData();
        // }
      }
    },
    fifterCaseData(val) {
      this.setCaseChart(val);
      let ids = val.map(item => {
        return item.id;
      });
      let showCaseMarks = this.caseMarks.filter(item => {
        return ids.includes(item.data.id);
      });
      this.showCaseMarks = showCaseMarks;
      this.togleLayer(showCaseMarks, 2);
    },
    fifterPartsData(val) {
      this.setPartChart(val);
      let ids = val.map(item => {
        return item.id;
      });
      let showMarks = this.marks.filter(item => {
        return ids.includes(item.data.id);
      });
      this.showMarks = showMarks;
      this.togleLayer(showMarks, 2);
    }
  },
  computed: {
    themeBg() {
      let color = '#ffc614';
      let color2 = '#0e0e10';
      let value = JSON.parse(JSON.stringify(this.$store.getters.getTheme));
      if (value != '#0e0e10') {
        color = value;
        color2 = '#fff';
      }
      this.noticBg.borderColor = color;
      this.numColor.color = color;
      return {
        backgroundColor: color,
        color: color2
      };
    },
    socketCase() {
      return this.$store.getters.getSocketControlCenter;
    },
    fifterCaseData() {
      // let data = this.caseData;
      let data = this.selectCaseData;
      if (this.caseSelect.typeSelectMode != 0) {
        data = this.selectCaseData.filter(item => {
          return item.group_parent.id == this.caseSelect.typeSelectMode;
        });
      }
      if (Array.isArray(this.caseSelect.caseTime)) {
        data = data.filter(item => {
          return moment(item.create_date).isBetween(
            this.caseSelect.caseTime[0],
            this.caseSelect.caseTime[1]
          );
        });
      }
      if (this.caseSelect.searchKey.length > 0) {
        data = this.searchByRegExp(this.caseSelect.searchKey, data);
      }

      return data;
    },
    fifterPartsData() {
      //通过复选款选择后过滤出的部件部件列表信息
      let data = this.selectPartsData.filter(item => {
        return this.partsGroupMode.includes(item.cms_parts_group.parent_id);
      });
      if (this.selectList.stateMode != '全部') {
        data = data.filter(item => {
          return item.ObjState == this.selectList.stateMode;
        });
      }
      return data;
    },
    showImg() {
      let imgList = this.partInfo.pic_path.split(',');
      let data = imgList.map(item => {
        item =
          'http://' +
          this.$webconfig.serverIp +
          // this.$webconfig.imgPath +
          '/' +
          item;
        return item;
      });
      return data;
    },
    caseInfoshowImg() {
      let data = [];
      switch (this.caseInfo.case_type) {
        case 1:
          if (Array.isArray(this.caseInfo.img)) {
            this.caseInfo.img.forEach(item => {
              data.push(item);
            });
          }
          break;
        case 2:
          let imgList = this.caseInfo.img.split(',');
          data = imgList.map(item => {
            item =
              'http://' +
              this.$webconfig.serverIp +
              // this.$webconfig.imgPath +
              '/' +
              item;
            return item;
          });
          break;
        default:
          break;
      }

      return data;
    },
    compCaseData() {
      let start =
        (this.caseTabPage.currentPage - 1) * this.caseTabPage.pageSize;
      let end = start + this.caseTabPage.pageSize;
      let data = this.selectCaseData;
      if (this.caseSelect.typeSelectMode != 0) {
        data = this.selectCaseData.filter(item => {
          return item.group_parent.id == this.caseSelect.typeSelectMode;
        });
      }
      if (Array.isArray(this.caseSelect.caseTime)) {
        data = data.filter(item => {
          return moment(item.create_date).isBetween(
            this.caseSelect.caseTime[0],
            this.caseSelect.caseTime[1]
          );
        });
      }
      if (this.caseSelect.searchKey.length > 0) {
        data = this.searchByRegExp(this.caseSelect.searchKey, data);
      }
      this.caseTabPage.totalNum = data.length;
      return data.slice(start, end);
    },
    compPartsData() {
      //当前页部件列表显示数据
      let start = (this.tabPage.currentPage - 1) * this.tabPage.pageSize;
      let end = start + this.tabPage.pageSize;

      let data = [];
      data = this.selectPartsData.filter(item => {
        return this.partsGroupMode.includes(item.cms_parts_group.parent_id);
      });
      if (this.selectList.stateMode != '全部') {
        data = data.filter(item => {
          return item.ObjState == this.selectList.stateMode;
        });
      }
      this.tabPage.totalNum = data.length;
      return data.slice(start, end);
    },
    // height() {
    //   return document.body.clientHeight - 50;
    // },
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
    }
  },
  created() {
    this.$store.dispatch('setMapLayers', {});
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
    setAttachment(data) {
      if (data != null && data != undefined) {
        let newData = data.split(',');
        return newData.map(item => {
          return `http://${this.$webconfig.serverIp}/${item}`;
        });
      } else {
        return [];
      }
    },
    /**
     * @param {Object} data 组织树回调
     */
    selectdNode(data) {
      this.departTreeChangeArr = data;
    },
    /**
     * 关闭dialog
     * @value 关闭状态 0 取消 1 确定
     */
    closeDialog(value) {
      var _self = this;
      if (value === 1) {
        // let departArr = Org.methods.transData(this.departTreeChangeArr, 'id', 'parentid', 'children');
        if (this.departTreeChangeArr.length > 0) {
          this.attendanceClerk = this.departTreeChangeArr;
          this.getOrgEval();
          this.dialogVisible = false;
        } else {
          this.$message({
            message: '请至少选择一个部门',
            type: 'warning'
          });
        }
      } else {
        this.dialogVisible = false;
      }
    },
    async getOrgEval() {
      let orgList = JSON.stringify(
        this.attendanceClerk.map(item => {
          return item.id;
        })
      );
      let Res = await this.$http.get('/oa/CaseController/getOrgEval', {
        params: {
          orgList: orgList
        }
      });
      if (Res.data.success) {
        this.setOrgOptions(Res.data.result);
      } else {
        this.$message({
          message: Res.data.msg,
          type: 'warning'
        });
      }
    },
    setOrgOptions(data) {
      this.chartOrgOptions.series = [];
      this.chartOrgOptions.xAxis.data = data.map(item => {
        return item.org_name;
      });

      this.chartOrgOptions.series.push({
        name: '案件数',
        type: 'bar',
        stack: '总数',
        data: data.map(item => {
          return item.totalCount;
        })
      });
      this.chartOrgOptions.series.push({
        name: '结案数',
        type: 'bar',
        stack: '总数',
        data: data.map(item => {
          return item.closeCount;
        })
      });
      this.chartOrgOptions.series.push({
        name: '未结案数',
        type: 'bar',
        stack: '总数',
        data: data.map(item => {
          return item.openCount;
        })
      });
      this.chartOrgOptions.series.push({
        name: '驳回案件数',
        type: 'bar',
        stack: '总数',
        data: data.map(item => {
          return item.rejectCount;
        })
      });
    },
    selectGroupChange(data) {},
    async getOrgData() {
      const Res = await this.$http.get('/sys/DepartController/getDepartList');
      if (Res.data.success) {
        this.attendanceClerk = Res.data.result;
        if (this.attendanceClerk.length > 0) {
          this.getOrgEval();
        }

        let data = transData(Res.data.result, 'id', 'parent_id', 'children');
        // this.orgOptions = data;
      }
    },
    showAllClick() {
      let point = new BMap.Point(103.671826, 25.037481);
      this.map.centerAndZoom(point, 15);
      switch (this.tabsIndex) {
        case 1:
          this.caseSelect.typeSelectMode = 0;
          this.caseSelect.caseTime = '';
          this.caseSelect.searchKey = '';
          this.selectCaseData = Object.assign([], this.caseData);
          break;
        case 2:
          this.selectList.stateMode = '全部';
          this.partsGroupMode = this.partGroupData.map(item => {
            return item.id;
          });
          break;
        default:
          break;
      }
    },
    leftControl() {
      if (this.leftShow) {
        this.leftShow = false;
      } else {
        this.leftShow = true;
      }
    },
    rightControl() {
      if (this.rightShow) {
        this.rightShow = false;
      } else {
        this.rightShow = true;
      }
    },
    searchByRegExp(keyWord, list) {
      if (!(list instanceof Array)) {
        return;
      }
      var len = list.length;
      var arr = [];
      var reg = new RegExp(keyWord);
      for (var i = 0; i < len; i++) {
        //如果字符串中不包含目标字符会返回-1
        if (list[i].remarks && list[i].remarks.match(reg)) {
          arr.push(list[i]);
        }
      }
      return arr;
    },
    setCaseTypeText(value) {
      let text = '未知';
      let color = '#ccc';
      let textValue = value;
      switch (textValue) {
        case 1:
          color = '#33c400';
          break;
        case 0:
          color = '#fa3f54';
          break;
        case 2:
          color = '#ff9d42';
          break;
        default:
          color = '#ccc';
          break;
      }
      this.shzt.forEach(item => {
        if (item.value == textValue) {
          text = item.label;
        }
      });
      return {
        text: text,
        style: {
          color: color
        }
      };
    },
    showReLiLayer() {
      // this.heatmapOverlay.toggle();
      if (this.showreli) {
        this.showreli = false;
        this.toolInfo.toolCaseRLi = '隐藏热力';
        this.heatmapOverlay.hide();
      } else {
        this.showreli = true;
        this.heatmapOverlay.show();
        this.toolInfo.toolCaseRLi = '热力图';
      }
    },
    /**
     * 设置热力图
     * @param {Number} value 热力类型 1 区域热力 2单元格热力
     */
    setReLi(value) {
      let newdata = [];
      let layers = [];
      switch (value) {
        case 1: //区域
          let areaLayer = this.$store.getters.getMapLayers.area || [];
          layers = areaLayer;
          break;
        case 2: //单元格
          let cellLayer = this.$store.getters.getMapLayers.cell || [];
          layers = cellLayer;
          break;
        default:
          break;
      }
      for (const item of layers) {
        let centerPoint = getCenterPoint(item.getPath());
        let data = this.caseData.filter(item2 => {
          const point = new BMap.Point(item2.baidu_x, item2.baidu_y);

          return BMapLib.GeoUtils.isPointInPolygon(point, item);
        });
        newdata.push({
          lat: centerPoint.lat,
          lng: centerPoint.lng,
          count: data.length
        });
      }
      this.map.removeOverlay(this.heatmapOverlay);
      let heatmapOverlay = new BMapLib.HeatmapOverlay({
        radius: 20
      });
      this.map.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({
        data: newdata,
        max: 8
      });
      this.heatmapOverlay = heatmapOverlay;
    },
    /**
     * 获取事件分类
     */
    async getCaseGroupData() {
      const res = await this.$http.get(
        '/cms/EventGroupController/eventGroupAll'
      );
      if (res.data.success) {
        this.eventGroupData = res.data.result;
        let groupData = this.eventGroupData.filter(item => {
          return item.group_level == 1;
        });
        this.eventGroupOptions = [
          {
            id: 0,
            group_name: '全部'
          },
          ...groupData
        ];
        this.getCaseData();
      }
    },
    //左侧统计隐藏显示
    setShow(key) {
      this.countShow[key] = this.countShow[key] ? false : true;
    },
    //格式化时间
    formatTime(date) {
      let newDate = date || new Date();
      return moment(newDate).format('YYYY-MM-DD HH:mm:ss');
    },
    /**
     * 获取案件信息
     */
    async getCaseData() {
      const Res = await this.$http.get('/oa/CaseController/queryCaseAll');
      let data = Res.data;
      if (data.success) {
        // this.caseData = data.result.map(item => {
        //   let code = [];
        //   this.eventGroupData.forEach(item2 => {

        //     if (item2.group_code == item.group_code) {
        //       code = this.eventGroupData.filter(item3 => {
        //         return item2.parent_id == item3.id
        //       })
        //     }
        //   })
        //   item.grou_code_parent = code[0]
        //   return item
        // });
        this.caseData = data.result.map(item => {
          let code = this.eventGroupData.filter(item2 => {
            return item.parent_name == item2.group_name;
          });
          item.group_parent = code[0];
          item.click = false;
          return item;
        });
        this.selectCaseData = Object.assign([], this.caseData);
        this.setToalWindow(); //设置统计小窗口
        this.setCaseMapLayer(this.selectCaseData);
        // this.setReLi(2);
      } else {
        this.$message({
          message: data.msg,
          type: 'warning'
        });
      }
    },

    /**
     * 设置案件统计小窗口信息
     */
    setToalWindow() {
      this.caseTotalWindow = [];
      let finish = 0;
      let cancel = 0;
      let wit = 0;
      let caseLength = this.caseData.length;
      this.caseTotalWindow.push({
        name: '案件数量',
        icon: 'anjiancont',
        value: caseLength
      });
      this.shzt.forEach(item => {
        let value = this.caseData.filter(item2 => {
          return item2.bpmn_hi_procinst.status == item.value;
        });
        if (item.value == 2) {
          wit = value.length;
        }
        this.caseTotalWindow.push({
          name: item.label,
          icon: item.otherAttr,
          value: toThousands(value.length)
        });
      });
      this.caseTotalWindow.push({
        name: '结案率',
        icon: 'shijian',
        value:
          caseLength == 0
            ? 0
            : (
                (1 - parseFloat(parseInt(wit) / parseInt(caseLength))) *
                100
              ).toFixed(2) + '%'
      });
    },
    //部件模块获取案件信息
    getPartsCaseInfo(businesskey) {
      // businesskey = 22;
      let data = this.caseData.filter(item => {
        return item.businesskey == businesskey;
      });
      this.partCaseInfo = data;
    },
    // 设置部件图表
    setPartChart(data) {
      switch (this.tabsIndex) {
        case 1:
          break;
        case 2:
          let gourpData = this.partGroupData.filter(item => {
            return this.partsGroupMode.includes(item.id);
          });
          let xAxisData = [];
          let seriesData = [];
          let pieSeriesData = [];
          let damageData = [];
          gourpData.forEach(item => {
            xAxisData.push(item.group_name);
            let typeData = data.filter(item2 => {
              return item2.cms_parts_group.parent_id == item.id;
            });
            seriesData.push(typeData.length);
            pieSeriesData.push({
              value: typeData.length,
              name: item.group_name
            });
          });

          this.partTypeStyle.forEach(item => {
            if (item.damage) {
              //损坏部件
              let damageType = data.filter(item2 => {
                return item2.ObjState == item.key;
              });
              damageData.push({
                value: damageType.length,
                name: item.key
              });
            }
          });

          this.chartTypeOptions.xAxis[0].data = xAxisData;
          this.chartTypeOptions.series[0].data = seriesData;
          this.chartPieOptions.series[0].data = pieSeriesData;
          this.damagePieOptions.series[0].data = damageData;
          break;
        default:
          break;
      }
    },

    /**
     * 设置案件图表
     * @param {Object} data 过滤出的案件数据
     */
    setCaseChart(data) {
      let xAxisData = [];
      let seriesData = [];
      let pieSeriesData = [];
      let [first, ...newGroupOptions] = this.eventGroupOptions;
      newGroupOptions.forEach(item => {
        xAxisData.push(item.group_name);
        let typeData = data.filter(item2 => {
          return item2.group_parent.id == item.id;
        });
        seriesData.push(typeData.length);
        pieSeriesData.push({
          value: typeData.length,
          name: item.group_name
        });
      });
      // console.log(xAxisData);
      // console.log(seriesData);

      this.chartTypeOptions.xAxis[0].data = xAxisData;
      this.chartTypeOptions.series[0].data = seriesData;
      this.chartPieOptions.series[0].data = pieSeriesData;
      let newObj = [];
      let areaLayer = this.$store.getters.getMapLayers.area || [];
      // console.log("ares", areaLayer);
      for (const item of areaLayer) {
        let centerPoint = getCenterPoint(item.getPath());
        let newData = this.caseData.filter(item2 => {
          const point = new BMap.Point(item2.baidu_x, item2.baidu_y);

          return BMapLib.GeoUtils.isPointInPolygon(point, item);
        });
        newObj.push({
          name: item.data.area_name,
          count: newData.length
        });
      }
      // console.log(newObj);
      newObj.sort((a, b) => {
        return b.count - a.count;
      });
      this.caseChartLocal = newObj;
    },
    searchBGID(lng, lat) {
      let point = new BMap.Point(item.lng, item.lat);
    },
    /**
     * 隐藏部件详细信息窗口
     */
    hidePartInfo() {
      this.isShowPartInfo = false;
    },
    /**
     * 隐藏案件详细信息窗口
     */
    hideCaseInfo() {
      this.isShowCaseInfo = false;
    },
    /**
     * 过滤区域显示效果
     * @param {Number} value index
     */
    areaselectChange(value) {
      const layers = this.$store.getters.getMapLayers.area;
      const lay = layers.filter(item => {
        return item.data.id == value;
      });
      if (lay.length > 0) {
        this.layerClick(lay[0], 0);
      }
    },
    stateSelectChange(value) {},
    /**
     * 过滤单元格显示效果
     * @param {Number} value index
     */
    cellselectChange(value) {
      const layers = this.$store.getters.getMapLayers.cell;
      const lay = layers.filter(item => {
        return item.data.id == value;
      });
      if (lay.length > 0) {
        this.layerClick(lay[0], 1);
      }
    },
    /**
     * 设置部件详细信息 描述信息
     */
    setPartNote(data) {
      let text = '暂无描述';
      if (data != null && data != undefined && data != '') {
        text = data;
      }
      return text;
    },
    /**
     * 设置部件详细信息 部件类型图标显示
     */
    setPartTypeIcon(state) {
      let icon = 'weizhi';

      this.partTypeStyle.map(item => {
        if (item.key == state) {
          icon = item.icon;
          this.partTypeColor.color = item.value;
        }
      });
      return icon;
    },

    /**
     * 设置部件详细信息部件类型
     */
    setPartType(id) {
      let type = this.partGroupData.filter(item => {
        return item.id == id;
      });
      if (type.length > 0) {
        return type[0].group_name || '未知';
      } else {
        return '未知';
      }
    },
    clickPartInfo(data) {
      this.togleLayer(this.showMarks, 2, 2);
      const point = new BMap.Point(data.baidu_x, data.baidu_y);
      this.map.panTo(point);
      let content = `<div class="map-windInfo">
            <p>部件标识码：${this.setText(data.ObjID)}</p>
            <p>部件名称：${this.setText(data.ObjName)}</p>
             <p>部件类型：${this.setText(data.cms_parts_group.group_name)}</p>
            <p>部件状态：${this.setText(data.ObjState)}</p>
            </div>
            `;
      var infoWindow = new BMap.InfoWindow(content, {
        width: 250
      }); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point);
      this.map.setZoom(19);
      this.isShowPartInfo = true;
      this.partsLoading = true;
      setTimeout(() => {
        this.partsLoading = false;
      }, 800);
      this.partInfo = Object.assign({}, data);
      this.getPartsCaseInfo(data.id);
    },

    /**
     * 案件列表Click事件
     */
    async clickCaseInfo(data) {
      this.caseListClick.click = false;
      data.click = true;
      this.caseListClick = data;
      this.togleLayer(this.showCaseMarks, 2, 2);
      const point = new BMap.Point(data.baidu_x, data.baidu_y);
      this.map.panTo(point);
      let content = `<div class="map-windInfo">
            <p>案卷编号：${this.setText(data.case_code)}</p>
             <p>案件类型：${this.setText(data.parent_name)}</p>
            <p>案件位置：${this.setText(data.ObjPosition)}</p>
            </div>
            `;
      var infoWindow = new BMap.InfoWindow(content, {
        width: 250
      }); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point);
      this.map.setZoom(19);

      switch (data.case_type) {
        case 1: //事件问题
          data.img = '';
          this.getAttachmentData(data.id);
          break;
        case 2: //部件问题
          // console.log("businesskey", data.businesskey, this.partsData);
          // let filterData = this.partsData.filter(item => {
          //   return item.id == data.businesskey;
          // });
          let filterData = await this.getPartOneInfo(data.businesskey);
          // console.log("filterData", filterData);

          // if (filterData.length > 0) {
          data.img = filterData.pic_path;
          // }
          break;

        default:
          break;
      }
      // console.log(data);
      if (data.proc_inst_id) {
        //查询案件流程
        this.getCaseLine(data.proc_inst_id);
      } else {
        this.caseInfoLine = [];
      }
      this.isShowCaseInfo = true;
      this.caseLoading = true;
      setTimeout(() => {
        this.caseLoading = false;
      }, 800);
      this.caseInfo = Object.assign({}, data);
    },
    /**
     * 通过部件id查询部件信息
     */
    async getPartOneInfo(id) {
      // this.caseLoading = true;
      const Res = await this.$http.post(
        'cms/PartsController/queryPartOneInfo',
        {
          id: id
        }
      );
      if (Res.data.success) {
        // this.caseLoading = false;
        return Res.data.result;
      }
      // this.caseLoading = false;
      return [];
    },
    /**
     * 获取附件信息
     */
    async getAttachmentData(id) {
      this.loading = true;
      const Res = await this.$http.get(
        '/sys/AttachmentController/queryAttByKey',
        {
          params: {
            businesskey: id
          }
        }
      );
      // console.log(2222, Res);
      let data = Res.data;
      if (data.success) {
        // console.log("attachment", data);
        const reg = /\.png/;
        let newValue = data.result.filter(item => {
          return reg.test(item.realpath);
        });
        let value = newValue.map(item => {
          item.realpath =
            'http://' + this.$webconfig.serverIp + '/' + item.realpath;
          return item.realpath;
        });

        this.caseInfo.img = value;
        this.isShowCaseInfo = true;
        this.rightShow = true;
        this.caseLoading = true;
        setTimeout(() => {
          this.caseLoading = false;
        }, 800);
      }
      this.loading = false;
    },
    /**
     * 获取案件流转信息
     */
    async getCaseLine(id) {
      this.caseInfoLoading = true;
      const Res = await this.$http.get(
        '/bpmn/TaskController/queryTaskByProcId',
        {
          params: {
            id: id
          }
        }
      );

      let data = Res.data;
      if (data.success) {
        this.caseInfoLine = data.result.map(item => {
          item.show = false;
          return item;
        });
        // console.log("caseInfoLine", this.caseInfoLine);
      }
      this.caseInfoLoading = false;
    },
    //时间转换，转换为分钟
    setDuration(date) {
      let value = formatSeconds(date);
      return value;
    },
    //处理案件流程中详细信息展示
    setCaseLineShow(index) {
      // console.log("show");
      this.caseInfoLine.forEach((item, ind) => {
        if (index === ind) {
          this.caseInfoLine[index].show =
            this.caseInfoLine[index].show == true ? false : true;
        } else {
          item.show = false;
        }
      });
      // this.caseInfoLine[index].show =
      //   this.caseInfoLine[index].show == true ? false : true;
      // console.log(this.caseInfoLine);
    },

    /**
     * 列表图片地址
     */
    imgUrl(url) {
      return `http://${this.$webconfig.serverIp}/${url}`;
    },
    /**
     * 设置地图选择工具
     * @param {Number} index 工具序号
     */
    setTool(index) {
      if (index == 3) {
        //聚合图层显示隐藏切换
        if (this.tabsIndex == 1) {
          this.togleLayer(this.caseMarks, 1);
        } else {
          this.togleLayer(this.marks, 1);
        }
      }
      this.map.closeInfoWindow();
      if (this.toolMode != index) {
        if (index !== 3) this.toolMode = index;
        this.restData(); //重置部件历时操作数据
        switch (index) {
          case 1:
            this.map.removeOverlay(this.labelText);
            let cellLayer = this.$store.getters.getMapLayers.cell || [];
            let areaLayer = this.$store.getters.getMapLayers.area || [];
            for (const item of cellLayer) {
              this.map.removeOverlay(item);
            }
            for (const item of areaLayer) {
              this.map.removeOverlay(item);
            }
            this.$store.dispatch('setMapLayers', {});
            // for (const item of this.areaData) {
            //   this.addPolygon(item, 0, true);
            // }
            this.recLayer(this.areaData.length - 1, this.areaData, 0, true);
            // this.setReLi(1);
            break;
          case 2:
            let cellLayer2 = this.$store.getters.getMapLayers.cell || [];
            let areaLayer2 = this.$store.getters.getMapLayers.area || [];
            for (const item of cellLayer2) {
              this.map.removeOverlay(item);
            }
            for (const item of areaLayer2) {
              this.map.removeOverlay(item);
            }
            this.$store.dispatch('setMapLayers', {});
            // for (const item of this.areaData) {
            //   this.addPolygon(item);
            // }
            this.recLayer(this.areaData.length - 1, this.areaData);
            // for (const item of this.cellData) {
            //   this.addPolygon(item, 1);
            // }
            this.recLayer(this.cellData.length - 1, this.cellData, 1);
            // this.setReLi(2);
            break;
          case 3:
          // this.togleLayer();
          default:
            break;
        }
        // if (this.showreli) {
        //   this.heatmapOverlay.show();
        // } else {
        //   this.heatmapOverlay.hide();
        // }
      }
    },
    restData() {
      this.selectList.areaSelectMode = '';
      this.selectList.cellSelectMode = '';
    },
    /**
     * 切换每页条数
     * @params {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
    },
    caseHandleSizeChange(val) {
      this.caseTabPage.pageSize = val;
    },
    /**
     * 切换页码
     * @params {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
    },
    caseHandleCurrentChange(val) {
      this.caseTabPage.currentPage = val;
    },
    /**
     * 获取部件大类分类信息
     */
    async getPartGroupData() {
      const res = await this.$http.get(
        '/cms/PartsGroupController/queryPartsGroupForParent',
        {
          params: {
            parentId: 0
          }
        }
      );
      if (res.data.success) {
        this.partGroupData = res.data.result;
        this.partsGroupMode = this.partGroupData.map(item => {
          return item.id;
        });
      }
    },
    /**
     * 选项卡切换事件
     * @param {Number} index  选项卡选中序号
     */

    tabsClick(index) {
      switch (index) {
        case 1:
          this.tabsIndex = index;
          this.showMark = false;

          this.toolInfo.toolPartIcon = 'yincan';
          this.map.closeInfoWindow();
          this.chartShow = true;
          if (!this.isFirst) {
            this.markerClusterer.clearMarkers();
          }
          // this.markerClusterer.clearMarkers();
          this.toolInfo.toolPartName = '隐藏案件';
          this.isShowPartInfo = false;
          break;
        case 2:
          if (!this.isgetPart) {
            this.tabsIndex = index;
            this.showMark = false;

            this.toolInfo.toolPartIcon = 'yincan';
            this.map.closeInfoWindow();
            this.chartShow = false;
            this.caseMarkerClusterer.clearMarkers();
            this.toolInfo.toolPartName = '隐藏部件';
            this.isShowCaseInfo = false;
            this.map.removeOverlay(this.labelText);
            // this.heatmapOverlay.hide();
            this.showreli = false;
            if (this.isFirst) {
              this.setMapLayer();

              this.isFirst = false;
            }
          }
          this.$nextTick(() => {
            this.partsHeight.height =
              this.$refs.partsDiv1.offsetHeight -
              this.$refs.partsDiv2.offsetHeight -
              this.$refs.partsDiv3.offsetHeight -
              30 +
              'px';
          });
        default:
          break;
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
      switch (this.tabsIndex) {
        case 1: //案件
          let caseLength = this.caseMarkerClusterer.getMarkers().length;
          if (istoogle) {
            if (caseLength > 0) {
              this.showMark = false;
              this.toolInfo.toolPartName = '隐藏案件';
              this.toolInfo.toolPartIcon = 'yincan';
              this.caseMarkerClusterer.clearMarkers();
            } else {
              this.showMark = true;
              this.toolInfo.toolPartName = '显示案件';
              this.toolInfo.toolPartIcon = 'xianshi';
              this.caseMarkerClusterer.addMarkers(mark);
            }
          } else {
            if (way == 1) {
              this.showMark = true;
              this.toolInfo.toolPartName = '显示案件';
              this.toolInfo.toolPartIcon = 'xianshi';
              this.caseMarkerClusterer.clearMarkers();
              this.caseMarkerClusterer.addMarkers(mark);
            } else {
              if (caseLength > 0) {
                this.showMark = true;
                this.toolInfo.toolPartName = '显示案件';
                this.toolInfo.toolPartIcon = 'xianshi';
              } else {
                this.showMark = true;
                this.toolInfo.toolPartName = '显示案件';
                this.toolInfo.toolPartIcon = 'xianshi';
                this.caseMarkerClusterer.clearMarkers();
                this.caseMarkerClusterer.addMarkers(mark);
              }
            }
          }
          break;
        case 2: //部件
          let length = this.markerClusterer.getMarkers().length;
          if (istoogle) {
            if (length > 0) {
              this.showMark = false;
              this.toolInfo.toolPartName = '隐藏部件';
              this.toolInfo.toolPartIcon = 'yincan';
              this.markerClusterer.clearMarkers();
            } else {
              this.showMark = true;
              this.toolInfo.toolPartName = '显示部件';
              this.toolInfo.toolPartIcon = 'xianshi';
              this.markerClusterer.addMarkers(marks);
            }
          } else {
            if (way == 1) {
              this.showMark = true;
              this.toolInfo.toolPartName = '显示部件';
              this.toolInfo.toolPartIcon = 'xianshi';
              this.markerClusterer.clearMarkers();
              this.markerClusterer.addMarkers(marks);
            } else {
              if (length > 0) {
                this.showMark = true;
                this.toolInfo.toolPartName = '显示部件';
                this.toolInfo.toolPartIcon = 'xianshi';
              } else {
                this.showMark = true;
                this.toolInfo.toolPartName = '显示部件';
                this.toolInfo.toolPartIcon = 'xianshi';
                this.markerClusterer.clearMarkers();
                this.markerClusterer.addMarkers(marks);
              }
            }
          }
          break;
        default:
          break;
      }
    },

    /**
     * 设置多边形随机颜色配置
     */

    setStyleOptions() {
      // const color =
      //   "#" +
      //   Math.random()
      //     .toString(16)
      //     .substring(2)
      //     .substr(0, 6);
      const color = this.$webconfig.color[
        Math.floor(Math.random() * this.$webconfig.color.length + 0)
      ];
      return {
        strokeColor: this.$webconfig.PolygonStyle.strokeColor, //边线颜色。
        fillColor: color, //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 1, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed' //边线的样式，solid或dashed。
      };
    },
    /**
     * 添加地图图层
     * @param {Object} data 数据源
     * @param {Number} type 数据类型，默认为0 （区域类型） 1：单元格类型
     * @param {Boolea}  show 点击事件是否注册
     */
    addPolygon(data, type, show) {
      const _self = this;
      const Type = type || 0;
      const Show = show || false;
      const arr =
        Type == 0 ? JSON.parse(data.scope_path) : JSON.parse(data.scope_path);
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
        // label.setPosition(polygonLayer.getBounds().getCenter());
        label.setPosition(getCenterPoint(polygonLayer.getPath()));
        polygonLayer.label = label;
        // this.addMenu(polygonLayer);
        // this.mapAreaInfo.calculate = BMapLib.GeoUtils
        //   .getPolygonArea(polygonLayer)
        //   .toFixed(2);

        this.map.addOverlay(polygonLayer);
        if (Type == 0) {
          this.map.addOverlay(label);
          addMapLayer(this, polygonLayer, 'area');

          if (Show) {
            polygonLayer.addEventListener('click', function(e) {
              _self.layerClick(e.target, Type);
            });
            polygonLayer.addEventListener('mouseover', function(e) {
              // e.target.setStrokeColor("blue");
              // e.target.setStrokeStyle("solid");
              // e.target.setStrokeWeight(8);
            });
            polygonLayer.addEventListener('mouseout', function(e) {
              // e.target.setStrokeColor("red");
              // e.target.setStrokeStyle("solid");
              // e.target.setStrokeWeight(5);
            });
          }
        } else {
          addMapLayer(this, polygonLayer, 'cell');
          polygonLayer.addEventListener('click', function(e) {
            _self.map.removeOverlay(_self.labelText);
            _self.labelText = new BMap.Label('', {
              // offset: new BMap.Size(20, -10)
            });
            _self.setCellLabelInfo(e, 'click');
            _self.layerClick(e.target, Type);
          });
          polygonLayer.addEventListener('mouseover', function(e) {
            _self.setCellLabelInfo(e);

            // e.target.setStrokeColor("blue");
            // e.target.setStrokeStyle("solid");
            // e.target.setStrokeWeight(5);
          });
          polygonLayer.addEventListener('mouseout', function(e) {
            _self.map.removeOverlay(e.target.label);

            // e.target.setStrokeColor("red");
            // e.target.setStrokeStyle("dashed");
            // e.target.setStrokeWeight(1);
          });
        }
      }
    },
    setCellLabelInfo(e, type) {
      let layer = e.target;
      let _self = this;
      let label = layer.label;
      if (type == 'click') {
        label = _self.labelText;
      }
      let areaInfo = [];
      let areaName = '未知';
      areaInfo = _self.areaData.filter(item => {
        return item.id == layer.data.area_id;
      });
      if (areaInfo.length > 0) {
        areaName = areaInfo[0].area_name;
      }
      let text = '';
      text = `<div>所属区域：${areaName}</div>
        <div>编号：${layer.data.BGID}</div>
        <div>面积：${layer.data.BGSQua} ㎡</div>
        `;

      label.setStyle({
        backgroundColor: '#ffc614'
        // border:'0px';
      });
      label.setContent(text);
      label.setOffset(new BMap.Size(-20, -20));
      label.setPosition(getCenterPoint(e.target.getPath()));
      _self.map.addOverlay(label);
    },
    /**
     * @description 递归生成地图图层
     * @param {Number} n 结束序号
     * @param {Object} data 数据原形
     * @param {Number} type 数据类型，默认为0 （区域类型） 1：单元格类型
     * @param {Boolea}  show 点击事件是否注册
     */
    recLayer(n, data, type, show) {
      const Type = type || 0;
      const Show = show || false;
      if (n < 0) return true;
      // setTimeout(() => {
      this.addPolygon(data[n], type, show);
      return this.recLayer(n - 1, data, type, show);
      // }, 10);
    },
    recMarker(n) {
      // let pt = new BMap.Point(data[n].baidu_x, data[n].baidu_y);
      // let icon = new BMap.Icon(
      //   `http://${this.$webconfig.serverIp}/${
      //     data[n].cms_parts_group.group_pic_path
      //   }`,
      //   new BMap.Size(40, 40)
      // );
      // let Options = {
      //   icon: icon,
      //   title: data[n].address_name
      // };
      // let marker = new BMap.Marker(pt, Options);
      // marker.data = data[n];

      // this.markerEventListener(marker);
      // res.push(marker);
      if (n === 0) return false;
      return this.recMarker(n - 1);
    },
    /**
     * 图层点击事件，获取区域或单元格内部件所有信息
     * @param {Object} e  图层对象
     * @param {Number} type 事件类型 0区域事件  1单元格事件
     */
    layerClick(e, type) {
      const _self = this;
      let layer = e;
      _self.clearSelectOptions(layer, type); //清除上一次地图选中图层
      _self.map.panTo(getCenterPoint(layer.getPath())); //设置地图中心点
      if (this.tabsIndex == 1) {
        let data = _self.caseData.filter(item => {
          const point = new BMap.Point(item.baidu_x, item.baidu_y);
          return BMapLib.GeoUtils.isPointInPolygon(point, layer);
        });
        _self.selectCaseData = data;
        _self.caseTabPage.currentPage = 1;
      } else {
        let data = _self.partsData.filter(item => {
          const point = new BMap.Point(item.baidu_x, item.baidu_y);
          return BMapLib.GeoUtils.isPointInPolygon(point, layer);
        });
        _self.selectPartsData = data; //选中区域或者单元格内过滤出的全部部件
        _self.selectList.areaSelectMode = layer.data.area_id
          ? layer.data.area_id
          : layer.data.id;
        if (type == 1) {
          _self.selectList.cellSelectMode = layer.data.id;
        }
        _self.tabPage.currentPage = 1;
      }
    },

    /**
     * 清除上一次地图选中图层
     * @param {Object} layer 地图图层
     * @param {Number} type 图层类型 0区域图层 1单元格图层
     */
    clearSelectOptions(layer, type) {
      if (this.selectMapLayer != '') {
        this.selectMapLayer.setStrokeColor(
          this.$webconfig.PolygonStyle.strokeColor
        );

        if (type == 0) {
          this.selectMapLayer.setStrokeWeight(3);
          this.selectMapLayer.setStrokeStyle('solid');
          layer.setStrokeWeight(2);
        } else {
          this.selectMapLayer.setStrokeWeight(1);
          this.selectMapLayer.setStrokeStyle('dashed');
          layer.setStrokeWeight(2);
        }
      }
      if (type == 0) {
        layer.setStrokeWeight(3);
      } else {
        layer.setStrokeWeight(3);
      }
      layer.setStrokeColor(this.$webconfig.PolygonStyle.clickStrikeColor);
      layer.setStrokeStyle('solid');
      this.selectMapLayer = layer;
    },
    /**
     * 获取区域信息
     */
    async getAreaData() {
      try {
        this.loading = true;
        const res = await this.$http.get(
          '/cms/AreaController/queryAllAreaData'
        );
        if (res.data.success) {
          this.areaData = res.data.result;
          // for (const item of this.areaData) {
          //   // this.addPolygon(item);

          // }
          this.recLayer(this.areaData.length - 1, this.areaData);
          this.getCellData();
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },

    /**
     * 获取单元格信息
     */
    async getCellData() {
      try {
        const res = await this.$http.get('/cms/CellController/querCellAllList');
        if (res.data.success) {
          this.cellData = res.data.result;
          // for (const item of this.cellData) {
          //   this.addPolygon(item, 1);
          // }
          this.recLayer(this.cellData.length - 1, this.cellData, 1);
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 地图初始化
     */
    ready({ BMap, map }) {
      // map.setMapStyle({
      //   style: "midnight"
      // });
      this.map = map;

      let vuexdata = this.$store.getters.getPartsdata;

      if (vuexdata.length > 0) {
        this.partsData = vuexdata;
        this.isgetPart = false;
        // this.setMapLayer();
      } else {
        this.getPartsdata();
        // this.getData();
      }
      this.init();
    },
    init() {
      this.shzt = getDicData('shzt');
      this.getOrgData();
      this.getAreaData();

      this.getCaseGroupData();

      this.getPartGroupData();
      this.caseHeight.height =
        this.$refs.caseDiv1.offsetHeight -
        this.$refs.caseDiv2.offsetHeight -
        this.$refs.caseDiv3.offsetHeight -
        30 +
        'px';
    },
    async getPartsdata() {
      const res = await this.$http.get('/cms/PartsController/queryPartCount');
      let count = 0;
      if (res.data.success) {
        count = Math.ceil(res.data.result / 1000);
        let countdata = [];
        console.time();
        for (let i = 1; i <= count; i++) {
          let cc = await this.getData(i);
          countdata = [...countdata, ...cc];
        }
        console.log('countdata:', countdata);
        console.timeEnd();
        this.partsData = countdata;
        this.$store.dispatch('setPartsdata', this.partsData);
        this.isgetPart = false;
      }
    },
    setCaseMapLayer(data) {
      // var data = this.caseData;
      var datalist = [];
      let marks = [];
      var markerClusterer = new BMapLib.MarkerClusterer(this.map);
      this.caseMarkerClusterer = markerClusterer;
      data.forEach(item => {
        this.$log('group报错', item.group_parent, item);
        let pt = new BMap.Point(item.baidu_x, item.baidu_y);
        let icon = new BMap.Icon(
          // item.group_parent.group_pic_path,
          // `http://${this.$webconfig.serverIp}/${
          item.group_parent.group_pic_path,
          // }`,
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
      this.caseMarks = marks;

      // markerClusterer.addMarkers(marks);

      // this.caseMarkerClusterer.addMarkers(marks);
    },
    /**
     * 添加所有部件与地图中
     */
    setMapLayer() {
      var data = this.partsData;
      var datalist = [];
      let marks = [];
      this.loading = true;
      data.map(item => {
        let pt = new BMap.Point(item.baidu_x, item.baidu_y);
        let icon = new BMap.Icon(
          `http://${this.$webconfig.serverIp}/${
            item.cms_parts_group.group_pic_path
          }`,
          new BMap.Size(40, 40)
        );
        let Options = {
          icon: icon,
          title: item.address_name
        };
        let marker = new BMap.Marker(pt, Options);
        marker.data = item;

        this.markerEventListener(marker);
        marks.push(marker);
      });

      // this.recMarker(data.length - 1);

      //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
      this.marks = marks;
      var markerClusterer = new BMapLib.MarkerClusterer(this.map);
      // markerClusterer.addMarkers(marks);
      this.markerClusterer = markerClusterer;

      this.loading = false;
      // for (var i = 0; i < data.length; i++) {
      //   datalist.push({
      //     geometry: {
      //       type: "Point",
      //       coordinates: [data[i]["baidu_x"], data[i]["baidu_y"]]
      //     },
      //     // fillStyle: "red",
      //     size: 2
      //   });
      // }
    },

    /**
     * 点坐标事件集合
     * @param {Object} 地图marker对象
     */
    markerEventListener(marker) {
      var opts = {
        width: 250, // 信息窗口宽度
        // height: 80, // 信息窗口高度
        // title: "部件信息", // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
      };
      //点移入事件
      marker.addEventListener('mouseover', ({ type, target, point, pixe }) => {
        // console.log(target.getIcon());
        // let icon=target.getIcon();
        // icon.setSize(new BMap.Size(80, 80))
        target.setZIndex(20);
        target.setTop();
        var p = target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        // let content = `<div class="map-windInfo">
        //     <p>部件标识码：${this.setText(target.data.ObjID)}</p>
        //     <p>部件名称：${this.setText(target.data.ObjName)}</p>
        //      <p>部件类型：${this.setText(target.data.cms_parts_group.group_name)}</p>
        //     <p>主管部门：${this.setText(target.data.DeptName1)}</p>
        //     <p>权属单位：${this.setText(target.data.DeptName2)}</p>
        //     <p>养护单位：${this.setText(target.data.DeptName3)}</p>
        //     <p>部件状态：${this.setText(target.data.ObjState)}</p>
        //     <p>数据来源：${this.setText(target.data.DataSource)}</p>
        //     <p>备注:${this.setText(target.data.Note)}</p>
        //     </div>
        //     `;
        let content = '';
        if (this.tabsIndex == 2) {
          content = `<div class="map-windInfo">
            <p>部件标识码：${this.setText(target.data.ObjID)}</p>
            <p>部件名称：${this.setText(target.data.ObjName)}</p>
             <p>部件类型：${this.setText(
               target.data.cms_parts_group.group_name
             )}</p>
            <p>部件状态：${this.setText(target.data.ObjState)}</p>
            </div>
            `;
        } else {
          content = `<div class="map-windInfo">
            <p>案卷编号：${this.setText(target.data.case_code)}</p>
             <p>案件类型：${this.setText(target.data.parent_name)}</p>
            <p>案件位置：${this.setText(target.data.ObjPosition)}</p>
            </div>
            `;
        }

        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
        p.openInfoWindow(infoWindow);
        // map.openInfoWindow(infoWindow, point); //开启信息窗口
      });

      marker.addEventListener(
        'click',
        async ({ type, target, point, pixe }) => {
          this.rightShow = true;
          if (this.tabsIndex == 2) {
            this.partInfo = Object.assign({}, target.data);
            this.getPartsCaseInfo(target.data.id);
            this.isShowPartInfo = true;
            this.partsLoading = true;
            setTimeout(() => {
              this.partsLoading = false;
            }, 800);
          } else {
            let data = target.data;
            switch (data.case_type) {
              case 1: //事件问题
                data.img = '';
                this.getAttachmentData(data.id);
                break;
              case 2: //部件问题
                // let filterData = this.partsData.filter(item => {
                //   return item.id == data.businesskey;
                // });
                // console.log("filterData", filterData);
                let filterData = await this.getPartOneInfo(data.businesskey);
                // if (filterData.length > 0) {
                data.img = filterData.pic_path;
                // }
                break;

              default:
                break;
            }
            if (data.proc_inst_id) {
              //查询案件流程
              this.getCaseLine(data.proc_inst_id);
            } else {
              this.caseInfoLine = [];
            }
            this.isShowCaseInfo = true;
            this.caseLoading = true;
            setTimeout(() => {
              this.caseLoading = false;
            }, 800);
            this.caseInfo = Object.assign({}, target.data);
          }

          this.map.panTo(point);
        }
      );
    },
    //设置点Lable文本显示
    setText(data) {
      return data != null && data != undefined && data != '' ? data : '暂无';
    },
    /**
     * 获取部件数据
     */
    async getData(num) {
      const _self = this;
      //this.loading = true;
      try {
        const Res = await this.$http.get(
          '/cms/PartsController/queryPartsAndGroupInfo',
          {
            params: {
              page: num,
              pageSize: 1000
            }
          }
        );
        const data = Res.data;
        if (data.success) {
          // _self.partsData = data.result;/
          return data.result;
          // _self.$store.dispatch("setPartsdata", _self.partsData);
          // _self.$setStore("cacheParts", this.partsData);
        } else {
          _self.$message.error(data.msg);
          return [];
        }
        // this.loading = false;
      } catch (error) {
        console.log(error); // _self.$notify.error({
        //   title: "接口请求失败",
        //   message: error
        // });
        // this.loading = false;
      }
    },
    chooseDepart() {
      this.dialogVisible = true;
      if (this.attendanceClerk.length > 0) {
        this.setSelectList = this.attendanceClerk.map(item => {
          return item.id;
        });
        this.departTreeChangeArr = Object.assign([], this.attendanceClerk);
      } else {
        this.setSelectList = [];
      }
    }
  }
};
</script>

<style lang="scss">
// html,
// body {
//   width: 100%;
//   height: 100%;
//   margin: 0;
//   padding: 0;
//   overflow: hidden;
// }
// #map {
//   width: 100%;
//   height: 800px;
// }
.control-center {
  position: relative;
  overflow: hidden;
  .control-content {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 12;
    transition: all 0.4s;

    .control-content-no1 {
      font-size: 14px;
      float: left;
      width: 270px;
      -moz-box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
      -webkit-box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
      box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
      background: #fff;
      .control-tabs {
        display: flex;
        background-color: #00a0ea;
        opacity: 0.85;
        .control-tabs-title {
          // color: #fff;
          padding: 9px 5px;

          flex: 1;
        }
        .control-tabs-menu {
          // color: #fff;
          padding: 8px 5px;
          // background-color: #00a0ea;
          flex: 0.1;
        }
        .control-tabs-close {
          flex: 0.1;
          // color: #fff;
          // background-color: #00a0ea;
          padding: 10px 5px;
          cursor: pointer;
        }
        .control-pane {
          padding: 10px 5px;
          text-align: center;
          // color: #fff;
          // background: #ffc614;
          flex: 1;
          cursor: pointer;
        }
        .is_active {
          color: #00a0ea !important;
          background: #fff !important;
        }
        .partDisable {
          cursor: not-allowed;
          background: #acacab;
        }
      }

      .control-case-info {
        width: 100%;
        /* padding: 10px; */
        height: calc(100vh - 525px);
        overflow: auto;
        .base-timeline-item {
          padding: 0 0 15px 0;
        }
        .control-case-info-content {
          padding: 5px 10px;
          overflow: hidden;
          font-size: 12px;
          border-bottom: 1px dashed #ccc;
        }

        .el-step__icon {
          // width: 12px;
          // height: 12px;
          // border: 0px;
          // margin-left: 6px;
          // background-color: #00a0ea;
        }
      }
      .control-tabs-content {
        position: relative;
        height: calc(100vh - 91px);
        overflow: hidden;

        .control-tabs-content-case {
          padding: 5px 10px;
          display: flex;
          height: 42px;
          border-bottom: 1px solid rgba(204, 204, 204, 0.49);
          &:hover {
            // background-color: #f2f2f2;
            background-color: #cccccc;
            cursor: default;
          }

          .control-tabs-content-case-icon {
            flex: 0.12;
            span {
              float: left;
              margin-top: 5px;
              width: 12px;
              font-size: 12px;
              color: #fa3f54;
              height: 12px;
              background-color: #fa3f54;
            }
          }
          .control-tabs-content-case-content {
            flex: 1;
          }
        }
        .control-tabs-content-case-click {
          // background-color: #ffc713;
          background-color: #cccccc;
        }
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 250px !important;
          position: relative;
          .el-range__close-icon {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
        .caseSelect > .el-input {
          display: block;
          width: 250px !important;
        }
        .caseButton {
          margin-top: 10px;
          .el-input-group__append,
          .el-input-group__prepend {
            background-color: #00a0ea !important;
            color: #fff !important;
            border: 0px !important;
          }
        }
        .control-table {
          display: flex;
          padding: 3px 10px;
          cursor: pointer;
          border-bottom: 1px solid rgba(204, 204, 204, 0.49);
          .control-table-index {
            height: 30px; // background-color: red;
            // border-top-left-radius: 2em;
            // border-top-right-radius: 2em;
            // border-bottom-right-radius: 2em;
            // border-bottom-left-radius: 2em;
            flex: 0.2;
          }
          .control-table-list {
            flex: 1;
            padding-left: 5px;
            .control-table-list-title {
              font-size: 16px;
              font-weight: 500;
            }
            .control-table-list-content {
              margin-top: 3px;
              font-size: 12px;
              color: #989898;
            }
          }
        }
        /* display: flex; */
        .control-content-paging {
          position: absolute;
          bottom: 5px;
          width: 100%;
          text-align: center;
        }
        .control-tabs-content-select {
          flex: 0.5;
          padding: 0 3px;
        }
        .control-tabs-content-search {
          margin-top: 10px;
          padding: 0 3px;
          .el-input-group__append,
          .el-input-group__prepend {
            background-color: #00a0ea;
            color: #ffffff;
            vertical-align: middle;
            display: table-cell;
            position: relative;
            border: 1px solid #00a0ea;
            /* border-radius: 4px; */
            padding: 0 20px;
            width: 1px;
            white-space: nowrap;
          }
        }
        .control-tabs-content-checkbox {
          margin-top: 10px;
          font-size: 12px !important;
          padding: 0 3px;
          .el-checkbox + .el-checkbox {
            margin-left: 0px;
          }

          .el-checkbox {
            margin-right: 8px;
          }
          .el-checkbox__label {
            font-size: 12px;
            padding-left: 10px;
            width: 75px;
          }
        }
        .control-tabs-content-change {
          font-size: 12px;
          margin: 3px 0;
          .partSelect {
            .el-select > .el-input {
              width: 250px !important;
            }
          }
        }
      }
      .control-note {
        padding: 10px;
        .control-note-img {
          margin-top: 5px;

          height: 130px;
          display: flex; // overflow-x: auto;
          .control-note-img-con {
            flex: 1;
            padding-right: 2px; // img {
            //   width: 100%;
            //   height: 100%;
            // } //  padding: 0 5px;
          }
        }
      }
      .info-height {
        overflow: auto;
        position: relative;
        height: calc((100vh - 50px - 42px - 402px - 20px));
        .info-height-status {
          position: absolute;
          top: -15px;
          color: #f93f54;
          z-index: 10;
          right: 5px;
          font-size: 64px;
          transform: rotate(-45deg);
        }
      }
      .control-info {
        padding: 10px 10px;
        border-bottom: 1px solid rgba(204, 204, 204, 0.45);
        .control-info-title {
          display: flex;
          font-size: 14px;

          .control-info-title-name {
            height: 28px;
            line-height: 28px;
            flex: 1;
          }
          .control-info-title-case-title {
            flex: 0.4;
            color: #7e7e7e;
          }
          .control-info-title-case-content {
            flex: 1;
          }
          .control-info-title-type {
            background: #f93f54;
            color: #fff;
            padding: 1px 3px;
            margin-left: 5px;
            font-size: 12px;
            border-radius: 3px;
          }
          .control-info-title-buttom {
            flex: 0.3;
          }
        }
      }
    }
  }
  .control-chart {
    position: absolute;
    top: 0px;
    left: 0px;
    transition: all 0.4s;
    height: calc(100vh - 50px);
    overflow: auto; // background: #fff;
    -moz-box-shadow: 5px 0px 10px rgba(6, 6, 6, 0.17);
    -webkit-box-shadow: 5px 0px 10px rgba(6, 6, 6, 0.17);
    box-shadow: 5px 0px 10px rgba(6, 6, 6, 0.17);
    .control-chart-content {
      font-size: 14px; // float: left;
      width: 270px;

      background: #fff;

      .control-chart-content-head {
        display: flex;
        height: 30px;
        opacity: 0.85;
        color: #fff;
        line-height: 30px;
        // background-color: #ffc614;
        padding: 0 5px;
        .control-chart-title {
          // color: #fff;
          padding: 0 5px; // padding: 9px 5px;
          flex: 1;
        }
        .control-chart-menu {
          // color: #fff;
          font-size: 20px; // padding: 8px 5px;
          flex: 0.1;
        }
        .control-chart-close {
          flex: 0.1;
          font-size: 20px; // color: #fff;
          // padding: 10px 5px;
          cursor: pointer;
        }
      }
      .control-chart-content-txt {
        background: #fff;
        width: 270px;
        overflow: auto;
        height: calc((100vh - 140px) / 3);
        .chartOrg {
          .echarts {
            width: 270px !important;
            height: 185px;
            /* height: calc((100vh - 140px)/3); */
          }
        }
        .tagClass {
          float: left;
          margin-left: 5px; // min-height: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          padding: 0 5px;
          width: 190px;
          overflow: auto;
          line-height: 28px; // max-width: 500px;
          // min-width: 180px;
          box-sizing: border-box;
          .el-tag--depart {
            background-color: #20a0ff;
            border-color: rgba(18, 206, 102, 0.2);
            color: #fbfdff;
          }
          .el-tag {
            padding: 0 5px;
            height: 18px;
            line-height: 18px;
            font-size: 12px;
          }
        }
        .control-chart-content-txt-local {
          padding: 10px;
          .local {
            display: flex;
            .local-title {
              background-color: #eeeeee;
              padding: 5px;
              border: 1px solid rgba(117, 117, 117, 0.15);
              flex: 0.2;
            }
            .local-content {
              padding: 5px; // border-bottom: 1px solid rgba(117, 117, 117, 0.15);
              border: 1px solid rgba(117, 117, 117, 0.15);

              flex: 1;
            }
          }
        }
      }
    }
  }
  .hideleft {
    left: -300px !important;
  }
  .hideright {
    right: -300px !important;
  }
  .hideleftIcon {
    transform: rotate(-180deg);
    left: 0px !important;
  }
  .hiderightIcon {
    transform: rotate(180deg);
    right: 0px !important;
  }
  .control-notic {
    position: absolute;
    top: 10px;
    transition: all 0.4s;
    left: 280px;
    width: 240px; // height: 80px;
    border: 4px solid #ffc614;
    border-radius: 8px;
    background-color: #fff;
    -moz-box-shadow: 0px 0px 10px #333333;
    -webkit-box-shadow: 0px 0px 10px #333333;
    box-shadow: 0px 0px 10px #333333;
    .control-notic-content {
      padding: 5px;
      overflow: hidden;
      text-align: center;
      .contro-notic-content-item {
        float: left;
        width: 76px;
        font-size: 12px;
        padding: 5px 0;
        .contro-notic-content-item-title {
          color: #7e7e7e;
        }
        .contro-notic-content-item-num {
          // color: #ffc614;
          font-size: 20px;
          padding: 5px;
        }
      }
    }
  }
  .leftnotic {
    left: 10px !important;
  }
  .control-left {
    position: absolute;
    font-size: 35px;
    top: 50%;
    z-index: 11;
    cursor: pointer;
    transition: all 0.4s;
    left: 272px;
  }
  .control-right {
    position: absolute;
    top: 50%;
    z-index: 11;
    cursor: pointer;
    font-size: 35px;
    transition: all 0.4s;
    right: 265px;
  }

  .control-map-tool {
    position: absolute;
    top: 0px;
    right: 280px;
    z-index: 12px;
    transition: all 0.4s;
    .control-content-tool {
      font-size: 12px;
      float: left;
      width: 43px;
      color: #fff;

      .control-content-tool-item {
        background-color: #00a0ea;
        text-align: center;
        height: 25px;
        padding: 5px 0;
        border: 1px solid rgba(255, 255, 255, 0.59);
        margin-bottom: 1px;
        -moz-box-shadow: 0px 3px 10px #787878;
        -webkit-box-shadow: 0px 3px 10px #787878;
        box-shadow: 0px 3px 10px #787878;
        cursor: pointer;
        .control-icon {
          font-size: 25px;
          // margin-top: 3px;
          margin-bottom: 3px;
        }
      }
      .contlor-content-tool-color {
        background-color: #135c7d !important;
      }
    }
  }
  .toolright {
    right: 0px !important;
  }
  .toolleft {
    right: 580px !important;
  }
  .echarts {
    width: 270px;
    /* height: 300px; */
    height: calc((100vh - 140px) / 3);
  }
  .map-windInfo {
    font-size: 12px;
    p {
      margin: 2px;
    }
  }
  .ts-enter-active,
  .ts-leave-active {
    transition: all 0.5s;
  }

  .ts-enter,
  .ts-leave-active {
    transform: translate(100%, 0);
  }
  .spacepartinfo-enter-active {
    animation: bounceInRight 0.4s 0s 1 both;
  }
  .spacepartinfo-leave-active {
    animation: bounceOutRight 0.4s 0s 1 both;
  }
  @keyframes bounceInRight {
    from,
    60%,
    75%,
    90%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    from {
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }

    60% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    75% {
      transform: translate3d(0, 0, 0);
    }

    90% {
      transform: translate3d(0, 0, 0);
    }

    to {
      transform: none;
    }
  }
  @keyframes bounceOutRight {
    20% {
      opacity: 1;
      transform: translate3d(0px, 0, 0);
    }

    to {
      opacity: 0;
      transform: translate3d(200px, 0, 0);
    }
  }
}
</style>
