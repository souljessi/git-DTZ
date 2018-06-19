<template>
	<div class="video-system" :style="{height:videoSysHeight}">
		<div class="top-row" :style="{height:topRowHeight}">
			<div class="container" :style="{width:flexBoxWidth}" :key="screenKey">
				<div v-for="item in screen" 
          :key="item.screenIndex" 
          @click="divClick(item.screenIndex)" 
          :class="[clickItem===item.screenIndex ? 'active' : 'unactive', 'screen-com']" 
          :ref="'screen'+item.screenIndex"
          :style="{height:flexItemHeight,width:flexItemWidth}">
					<div class="screen-title" @click="setClickTitle(item.screenIndex)" :id="'screenAct'+item.screenIndex" @drop='drop($event)' @dragover='allowDrop($event)'>
            <div style="float:left;">
              <base-icon :icon="item.deviceIcon" style="font-size:20px;"/> <span :ref="'screenTitle'+item.screenIndex">视频{{item.screenIndex}}</span>
            </div>
            <div style="float:right;">
              <span  @click="saveDownload(item.screenIndex)" v-show="item.downloadIconShow" class="download-span" title="完成下载">
                  <base-icon icon="saveDownload" />
              </span>
            </div>
          </div>
          <div class="screen-item" :ref="'screenItem'+item.screenIndex" v-if="hasPlugin">
						<object v-show="hasPlugin&&item.objShow" :ref="'plugDiv'+item.screenIndex" type="application/NPAPIPlayerPlug-plugin" :style="{height:videoHeight,width:videoWidth,top:videoTop,left:videoLeft}">
							当前浏览器版本不支持播放，请升级浏览器或选择其他浏览器进行播放
							<param name="wmode" value="transparent">
						</object>
					</div>
          <div class="screen-item" style="background:none!important;" v-else>
            <a href="static/plug/KmlcPlayerPlug.exe">请下载视频插件...</a>
          </div>
				</div>
			</div>
			<div :class="[fullScreenShow===true ? 'absoluteClass' : 'relativeClass', 'device-tree']" v-show="deviceTreeShow&&!showCheckBox">
				<el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tab-pane-device">
					<el-tab-pane label="设备" name="first" class="tab-class">
						<el-form style="margin:0 5px;">
							<el-form-item>
								<el-radio-group v-model="radioVal" @change="radioValChange" size="small">
									<el-radio :label="1">组织</el-radio>
									<!-- <el-radio :label="2">巡检</el-radio>
									<el-radio :label="3">收藏</el-radio> -->
									<el-radio :label="4">历史</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item v-show="radioVal==1">
								<el-input size="small" v-model="filterText" placeholder="请输入检索内容" clearable  suffix-icon="el-icon-search"></el-input>
							</el-form-item>
						</el-form>
						<el-tree 
              v-show="radioVal==1" 
              :data="dataTree" 
              default-expand-all="" 
              node-key="id" 
              ref="deviceTree" 
              highlight-current 
              :props="defaultProps" 
              :filter-node-method="filterNode" 
              class="tree-style">
							<span slot-scope="{node,data}" v-on:dblclick="treeNodeDblclick(data)">
								<div v-show="data.type==2">
									<base-icon :style="{color:treeIconColor}" :icon='data.icon' />
									<span>{{data.name}}</span>
								</div>
								<div v-show="data.type!=2&&data.status==1" draggable=true @dragstart='drag($event,data)'>
									<base-icon :style="{color:treeIconColor}" :icon='data.icon' />
									<span>{{data.name}}</span>
								</div>
								<div v-show="data.type!=2&&data.status==0" title="离线设备无法查看">
									<base-icon  :icon='data.icon' class="video-off-line"/>
									<span class="video-off-line"> {{data.name}}[离线]</span>
								</div>
							</span>
						</el-tree>
						<div v-show="radioVal==4" class="history-list">
              <template v-if="historyVideoList.length>0">
                <span v-for="(item,index) in historyVideoList" :key="index"  v-on:dblclick="treeNodeDblclick(item)">
                  <div class="history-list-item" draggable='true' @dragstart='drag($event,item)'>
                    <base-icon :style="{color:treeIconColor}" :icon='item.icon' />
                    <span> {{item.name}}</span>
                  </div>
                </span>
              </template>
              <template v-else>
                <div class="history-list-no">暂无历史数据</div>
                <!-- <el-tree 
                  :data="historyVideoList" 
                  default-expand-all="" 
                  node-key="id" 
                  highlight-current 
                  :props="defaultProps" 
                  class="tree-style">
                </el-tree> -->
              </template>
						</div>
					</el-tab-pane>
					<el-tab-pane label="云台" name="second">
            <video-cloud-terrace></video-cloud-terrace>
					</el-tab-pane>
				</el-tabs>
        <iframe src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="position:absolute;visibility:inherit; top:0px;left:0px;height:100%;width:100%;  background: rgba(0,0,0,0);z-index:-1;filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'"></iframe>
      </div>
      <div class="device-tree" v-show="showCheckBox">
        <video-event @closeUnlawReport="closeUnlawReport" :eventData="formData" @showMessage="showEventMsg"></video-event>
			</div>

			<div class="clear-float"></div>
		</div>
		<div class="bottom-row" v-show="tooltipShow">
			<el-form inline class="tooltip-form">
				<el-form-item>
					<el-select size="small" v-model="deviceVal" placeholder="请选择监控画面" @change="choosePlayDiv" style="display:none;">
						<el-option v-for="(item,index) in playVideoArr" :key="index" :label="item.name" :value="JSON.stringify(item)">
							<span>{{item.name}}</span>
							<iframe src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="position:absolute;visibility:inherit; top:0px;left:0px;height:100%;width:100%;  background: rgba(0,0,0,0);z-index:-1;filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'"></iframe>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="playVideo()" :disabled="!startBtnShow">	
            <base-icon icon="kaishi" />开始</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="suspendVideo()" :disabled="!stopBtnShow">	
            <base-icon icon="zanting" />暂停</el-button>
				</el-form-item>
        <el-form-item>
					<div style="width:2px;height:32px;border-left:2px solid #ddd;box-sizing:border-box;margin:0 20px"></div>
				</el-form-item>
				<el-form-item>
					<div v-clickoutside="handleNavClose">
						<div class="choose-screen" v-show="chooseDivShow">
              <div class="choose-screen-flex">
                <div @click="changeFlex(1)" class="screen-choose-div" title="1路"><img src="../../../assets/images/1.png"/></div>
                <div @click="changeFlex(2)" class="screen-choose-div" title="2路"><img src="../../../assets/images/2.png"/></div>
                <div @click="changeFlex(4)" class="screen-choose-div" title="4路"><img src="../../../assets/images/4.png"/></div>
                <div @click="changeFlex(6)" class="screen-choose-div" title="6路"><img src="../../../assets/images/6.png"/></div>
                <div @click="changeFlex(8)" class="screen-choose-div" title="8路"><img src="../../../assets/images/8.png"/></div>
                <div @click="changeFlex(9)" class="screen-choose-div" title="9路"><img src="../../../assets/images/9.png"/></div>
                <div @click="changeFlex(12)" class="screen-choose-div" title="12路"><img src="../../../assets/images/12.png"/></div>
                <div @click="changeFlex(15)" class="screen-choose-div" title="15路"><img src="../../../assets/images/15.png"/></div>
                <div @click="changeFlex(16)" class="screen-choose-div" title="16路"><img src="../../../assets/images/16.png"/></div>
                <div @click="changeFlex(20)" class="screen-choose-div" title="20路"><img src="../../../assets/images/20.png"/></div>
                <div @click="changeFlex(24)" class="screen-choose-div" title="24路"><img src="../../../assets/images/24.png"/></div>
                <div @click="changeFlex(25)" class="screen-choose-div" title="25路"><img src="../../../assets/images/25.png"/></div>
                <div @click="changeFlex(30)" class="screen-choose-div" title="30路"><img src="../../../assets/images/30.png"/></div>
                <div @click="changeFlex(36)" class="screen-choose-div" title="36路"><img src="../../../assets/images/36.png"/></div>
                <div @click="changeFlex(4)" class="screen-choose-div" title="4路">默认</div>
                <iframe src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="position:absolute;visibility:inherit; top:0px;left:0px;height:100%;width:100%;  background: rgba(0,0,0,0);z-index:-1;filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'"></iframe>
						  </div>
            </div>
						<div>
							<el-button size="small" @click="showChooseDiv()" title="多路视频选择" class="icon-btn">
								<base-icon icon="grid" /></el-button>
						</div>
					</div>
				</el-form-item>
        <el-form-item>
					<el-slider v-model="screeSlider" :step=4 :min=4 :max=24 :show-tooltip="false" :format-tooltip="formatTooltip" style="width:150px;" @change="changeFlex(screeSlider)"></el-slider>
				</el-form-item>
				<el-form-item>
					<el-select size="small" v-model="ratioVal" placeholder="请选择屏占比" @change="chooseRatio" style="width:100px;">
						<el-option v-for="item in ratio" :key="item.value" :label="item.label" :value="item.value">
							<span>
								{{item.label}}
							</span>
							<iframe src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="position:absolute;visibility:inherit; top:0px;left:0px;height:100%;width:100%;  background: rgba(0,0,0,0);z-index:-1;filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'"></iframe>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="downloadVideo()" :disabled="!downloadBtnShow" title="视频下载" class="icon-btn">
						<base-icon icon="xiazai" /></el-button>
				</el-form-item>
        
        <el-form-item>
					<el-button size="small" @click="savePic()" :disabled="!stopBtnShow" title="照片抓拍" class="icon-btn">
						<base-icon icon="zhuapai" /></el-button>
				</el-form-item>
        <el-form-item>
					<el-button size="small" @click="saveUnlawfulPic()" :disabled="!stopBtnShow" title="违法抓拍" class="icon-btn">
						<base-icon icon="unlawvideo" /></el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" @click="fullScreen()" title="点击全屏" class="icon-btn">
						<base-icon icon="fullscreen" /></el-button>
				</el-form-item>
				<!-- <el-form-item>
					<el-button size="small" title="分享" class="icon-btn">
						<base-icon icon="share" /></el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" title="投影大屏" class="icon-btn">
						<base-icon icon="xianshi" /></el-button>
				</el-form-item> -->
        <el-form-item>
					<el-button size="small" title="地图展示" @click="routeToVideoMap" class="icon-btn">
						<base-icon icon="ditu" /></el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="full-screen-tip" v-show="fullScreenShow" @mouseover="showFullTip()" @mouseout="hideFullTip()">
			<span class="tip-span" @mouseover="showFullTip()" v-show="tipBtnShow===false">
				<base-icon v-show="tipBtnShow===false" icon="openleft" />
			</span>
      <span @click="exitFullScreen()" v-show="tipBtnShow" class="tip-span" title="退出全屏">
				<base-icon icon="exitfullscreen" />
			</span>
			<span @click="showDeviceTree()" v-show="tipBtnShow&&!deviceTreeShow" class="tip-span" title="显示设备树">
        <base-icon icon="xianshi"/>
			</span>
      <span @click="showDeviceTree()" v-show="tipBtnShow&&deviceTreeShow" class="tip-span" title="隐藏设备树">
        <base-icon icon="yincan"/>
			</span>
			<iframe src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="position:absolute;visibility:inherit; top:0px;left:0px;height:100%;width:100%;  background: rgba(0,0,0,0);z-index:-1;filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'"></iframe>

		</div>
     <div :class="successMsg?'success-msg-div':'error-msg-div'" v-show="showMsgBox">
      <span v-if="successMsg">
				<i class="el-icon-success"></i>
			</span>
      <span v-else>
				<i class="el-icon-success"></i>
			</span>
      <span>
				{{msg}}
			</span>
      
      <iframe src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="position:absolute;visibility:inherit; top:0px;left:0px;height:100%;width:100%;  background: rgba(0,0,0,0);z-index:-1;filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'"></iframe>
    </div>
	</div>
  
</template>

<script>
import { transData } from "assets/js/commonManage.js";
import moment from "moment";
import VideoCloudTerrace from "view/video/VideoCloudTerrace";
import { isPlug } from "assets/js/commonManage";
// import deviceData from "./data.json";
import VideoEvent from "./VideoEvent.vue";
export default {
  data() {
    return {
      successMsg:true,//成功信息提示框
      formData:{
        ObjPosition:'2',
        baidu_x:0,
        baidu_y:0,
        source:4,
        remarks:''
      },
      defFormData:{
        ObjPosition:'1',
        baidu_x:0,
        baidu_y:0,
        source:4,
        remarks:''
      },
      showCheckBox:false,//上报确认提示框
      msg:'',
      showMsgBox:false,
      hasPlugin: false, //是否安装了插件
      treeIconColor:'#00a0e9',
      tipBtnShow: false,
      deviceVal: "",
      screeSlider: 4,
      ratio: [
        {
          value: 1,
          label: "满 屏"
        },
        {
          value: 2,
          label: "1:1"
        },
        {
          value: 3,
          label: "4:3"
        },
        {
          value: 4,
          label: "16:9"
        }
      ],
      ratioVal: 1,
      radioVal: 1,
      tooltipShow: true,
      deviceTreeShow: true,
      fullScreenShow: false,
      activeName: "first",
      clickItem: 1,
      dataTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      filterText: "",
      topRowHeight:`calc(100% - 50px)`,
      flexItemHeight:`50%`,
      flexItemWidth:`calc(50%)`,
      flexBoxWidth: `calc(100% - 300px)`,
      videoHeight: `calc(100%)`,
      videoWidth: `100%`,
      videoTop: "36px",
      videoLeft: "0",
      screenKey: new Date().getTime(),
      chooseDivShow: false,
      playDivArr: [],
      playVideoArr: [],
      historyVideoList: [],
      startBtnShow:false,//开始
      stopBtnShow:false,//暂停按钮是否可点击
      downloadBtnShow:false,//下载是否可点击
      screen:[
        {
          screenIndex:1,
          deviceIcon:'qiangji',
          downloadIconShow:false,
          objShow:false
        },
        {
          screenIndex:2,
          deviceIcon:'qiangji',
          downloadIconShow:false,
          objShow:false
        },
        {
          screenIndex:3,
          deviceIcon:'qiangji',
          downloadIconShow:false,
          objShow:false
        },
        {
          screenIndex:4,
          deviceIcon:'qiangji',
          downloadIconShow:false,
          objShow:false
        }
      ]
    };
  },
  props: {
    videoSysHeight:{
      type:String,
      default:`100vh`
    }
  },

  created: function() {},
  mounted: function() {
    this.hasPlugin = isPlug();
    if (this.hasPlugin) {
      this.getCatelogDevice();
    }
    const VM = this;
    window.addEventListener("resize", function() {
      VM.$nextTick(function() {
        if(VM.$route.path === '/video'){//在当前路由
          if (VM.hasPlugin) {
            VM.chooseRatio(VM.ratioVal);
          }
        }
      });
    });
    //注册浏览器关闭事件
    window.onbeforeunload = function() {
      VM.stopAll();
    };
  },
  components: {
    VideoCloudTerrace,VideoEvent
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.deviceTree.filter(val);
    }
  },
  methods: {
    /**
     * 全部停止播放
     */
    stopAll(){
      if(this.playVideoArr.length>0){
        for(var i in this.playVideoArr){
          const item = this.playVideoArr[i].divItem;
          this.$refs[`plugDiv${item}`][0].stopRecord(1);//停止下载
          this.$refs[`plugDiv${item}`][0].stop(1);//停止播放
        }
      }
    },
    /**
     * 切换分屏模式
     *
     */
    changeFlex(screenNum) {
      this.stopAll();
      this.showCheckBox = false;
      this.ratioVal = 1;
      const rows = parseInt(Math.sqrt(screenNum));
      const cols = screenNum / rows;
      this.flexItemHeight = `calc(100% / ${rows})`;
      this.flexItemWidth = `calc(100% / ${cols})`;
      this.screen = [];
      this.videoHeight = `calc(100%)`,
      this.videoWidth = "100%";
      this.videoTop = "36px";
      this.videoLeft = "0";
      for(var i=1;i<=screenNum;i++){
        const data = {
          screenIndex:i,
          deviceIcon:'qiangji',
          downloadIconShow:false,
          objShow:false
        }
        this.screen.push(data);
      }
      this.clickItem = 1;
      this.playDivArr = [];
      this.playVideoArr = [];
      this.screenKey = new Date().getTime();
      this.startBtnShow = false;
      this.stopBtnShow = false;
      this.downloadBtnShow = false;
      this.deviceVal = null;
      if(this.chooseDivShow){//隐藏屏幕选择弹窗
        this.chooseDivShow = false;
      }
    },
    divClick(n) {
      this.clickItem = n;
      if(this.fullScreenShow){
        this.deviceTreeShow = false;
      }
    },

    async getCatelogDevice() {
      const res = await this.$http.get("/video/index/getCatalog");
      if (res.data && res.data.success) {
        const result = res.data.result;
        if(result.list.length>0){
          const list = result.list
          const data = list.map(item => {
            item.disabled = true;
            item.icon = "bumen";
            if (item.type === 0) {
              item.icon = "qiuji";
            }
            if (item.type === 1) {
              item.icon = "qiangji";
            }
            return item;
          });
          this.dataTree = transData(data, "device_id", "parent_id", "children");
        }
        
      } else {
        this.$message.error(res.data.msg);
      } 
      
    },
    /**
     * 全屏显示切换
     */
    fullScreen() {
      this.$emit('changeFullScreen',{setFullScreen:true});
      this.tooltipShow = false;
      this.deviceTreeShow = false;
      this.fullScreenShow = true;
      this.showCheckBox = false;
      this.topRowHeight = `100%`;
      this.flexBoxWidth = `100%`;
      this.$nextTick(function() {
        this.chooseRatio(this.ratioVal);
      });
    },
    /**
     * 退出全屏
     */
    exitFullScreen() {
      this.$emit('changeFullScreen',{setFullScreen:false});
      this.tooltipShow = true;
      this.deviceTreeShow = true;
      this.fullScreenShow = false;
      this.topRowHeight = `calc(100% - 50px)`;
      this.flexBoxWidth = `calc(100% - 300px)`;
      this.$nextTick(function() {
        this.chooseRatio(this.ratioVal);
      });
      this.tipBtnShow = false;
    },
    /**
     * 选项卡切换
     */
    handleClick() {
      // console.log("选择卡切换");
    },
    /**
     *树信息过滤
     *@param {String} value 当前输入值
     *@param {Objcet} data 树数据原形
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    deviceNodeClick(data) {
      // console.log('单击');
      // if(data.status==1&&data.type!==2){
      //   this.clickPlayVideo(data);
      // }
   
    },
    /**
     * 双击树节点播放
     */
    treeNodeDblclick(data){
      // console.log('双击');
      if(data.status==1&&data.type!==2){
        this.clickPlayVideo(data);
      }
    },
    /**
     * 视频播放
     */
    clickPlayVideo(deivceData){
      const oldItem = this.clickItem; //当前选中div项；
      let videoData =JSON.parse(JSON.stringify(deivceData));
      videoData = Object.assign(videoData, { divid: `screenItem${oldItem}`,divItem:oldItem});
      this.$refs[`screenItem${oldItem}`][0].playKey = true;
      if (this.playDivArr.indexOf(oldItem) === -1) {
        //播放数组不包含当前选中div
        this.screen[`${oldItem}`-1].objShow = true;//显示Object元素
        this.playDivArr.push(oldItem);
      } else {
        //选中div正在播放其他内容或下载
        if(this.$refs[`plugDiv${oldItem}`][0].downloadPath){//正在下载
          delete this.$refs[`plugDiv${oldItem}`][0].downloadPath;
          this.screen[oldItem-1].downloadIconShow = false;//完成下载按钮不可见
          this.$refs[`plugDiv${oldItem}`][0].stopRecord(1);//停止下载
        }
        this.$refs[`plugDiv${oldItem}`][0].stop(1);//停止播放
        this.playVideoArr = this.playVideoArr.filter((item)=>{
          return item.divItem!==oldItem;
        })
        
      }
      this.deviceVal = null;
      this.playVideoArr.push(videoData);
      this.$refs[`screenTitle${oldItem}`][0].innerText = `${deivceData.name}`;
      this.screen[`${oldItem}`-1].deviceIcon = videoData.icon;
      this.setCheckDiv(oldItem); //设置选中div
      this.historyVideoList.push(deivceData);
      let playUrl = deivceData.Url;//默认主码流
      if(this.screen.length>4){
        playUrl = deivceData.SubUrl;//子码流
      }
      this.$nextTick(function(){
        this.$refs[`plugDiv${oldItem}`][0].play(1,playUrl);
      })
      
    },
    /**
     * 设置下一个选中div
     */
    setCheckDiv(oldItem) {
      if (oldItem === this.screen.length) {
        this.forDivGetItem(1, this.screen.length);
      } else {
        for (var i = oldItem + 1; i <= this.screen.length; i++) {
          if (this.playDivArr.indexOf(i) === -1) {
            this.clickItem = i;
            this.startBtnShow = false;
            this.stopBtnShow = false;
            this.downloadBtnShow = false;
            break;
          }
          if (
            i === this.screen.length &&
            this.playDivArr.indexOf(i) !== -1
          ) {
            //当前div及之后的都已经在播放内容
            this.forDivGetItem(1, this.screen.length);
          }
        }
      }
      if(this.clickItem===oldItem){
        this.setClickTitle(oldItem);//下拉选中值为当前选中div
      }
      
    },

    /**
     * 循环设置clickItem 选中div
     */
    forDivGetItem(val, total) {
      for (var j = val; j <= total; j++) {
        if (this.playDivArr.indexOf(j) === -1) {
          this.clickItem = j;
          this.startBtnShow = false;
          this.stopBtnShow = false;
          this.downloadBtnShow = false;
          break;
        }
      }
    },
    /**
     * 点击显示多屏选择窗口
     */
    showChooseDiv() {
      // this.chooseDivShow = !this.chooseDivShow;
      this.chooseDivShow = true;
    },
    /**
     * 点击div之外任意处隐藏多屏选择窗口
     */
    handleNavClose() {
      this.chooseDivShow = false;
    },
    /**
     *音量调节格式化
     */
    formatTooltip(val) {
      return val + "路";
    },
    /**
     *单选按钮组切换事件
     *
     */
    radioValChange(label) {

    },
    /**
     *屏占比切换事件
     */
    chooseRatio(value) {
      this.videoHeight = `calc(100%)`,
      this.videoWidth = "100%";
      this.videoTop = "36px";
      this.videoLeft = "0";
      this.$nextTick(function(){
        const itemWidth = this.$refs.screenItem1[0].clientWidth;
        const itemHeight = this.$refs.screenItem1[0].clientHeight;
        switch (value) {
          case 1:
            this.videoHeight = `calc(100%)`,
            this.videoWidth = "100%";
            this.videoTop = "36px";
            this.videoLeft = "0";
            break;
          case 2:
            if (itemWidth >= itemHeight) {
              this.videoHeight = `calc(100%)`,
              this.videoWidth = `${itemHeight}px`;
              this.videoTop = "36px";
              this.videoLeft = `${(itemWidth - itemHeight) / 2}px`;
            } else {
              this.videoWidth = "100%";
              this.videoHeight = `${itemWidth}px`;
              this.videoTop = "36px";
              this.videoLeft = `${(itemHeight - itemWidth) / 2}px`;
            }
            break;
          case 3:
            if (itemWidth * 3 / 4 > itemHeight) {
              this.videoHeight = `calc(100%)`,
              this.videoWidth = `${itemHeight * 4 / 3}px`;
              this.videoTop = "36px";
              this.videoLeft = `${(itemWidth - itemHeight * 4 / 3) / 2}px`;
            } else {
              this.videoWidth = "100%";
              this.videoHeight = `${itemWidth * 3 / 4}px`;
              this.videoTop = `${(itemHeight - itemWidth * 3 / 4) / 2}px`;
              this.videoLeft = "0";
            }
            break;
          case 4:
            if (itemWidth * 9 / 16 > itemHeight) {
              this.videoHeight = `calc(100%)`,
              this.videoWidth = `${itemHeight * 16 / 9}px`;
              this.videoTop = "36px";
              this.videoLeft = `${(itemWidth - itemHeight * 16 / 9) / 2}px`;
            } else {
              this.videoWidth = "100%";
              this.videoHeight = `${itemWidth * 9 / 16}px`;
              this.videoTop = `${(itemHeight - itemWidth * 9 / 16) / 2}px`;
              this.videoLeft = "0";
            }
            break;
          default:
            this.videoHeight = `calc(100%)`,
            this.videoWidth = "100%";
            this.videoTop = "36px";
            this.videoLeft = "0";
            break;
        }

      })
    },
    /**
     * 显示设备树
     */
    showDeviceTree() {
      this.deviceTreeShow = !this.deviceTreeShow;
      // this.tipBtnShow = false;
    },
    drag: function(event, data) {
      event.dataTransfer.setData("Text", JSON.stringify(data));
    },
    drop: function(event) {
      event.preventDefault();
      let data = JSON.parse(event.dataTransfer.getData("Text"));
      const _item = event.target.id.replace("screenAct", "");
      const oldItem = Number(_item); //当前选中项；
      this.clickItem = oldItem;
      this.$refs[`screenItem${oldItem}`][0].playKey = true;
      if(data.type!==2&&data.status==1){
        this.clickPlayVideo(data);
      }
    },
    allowDrop: function(event) {
      event.preventDefault();
    },
    /**
     * 开始播放
     */
    playVideo() {
      if(this.deviceVal){
        this.startBtnShow = false;
        this.stopBtnShow = true;
        this.downloadBtnShow = true;
        const Data = JSON.parse(this.deviceVal);
        this.$refs[`screenItem${Data.divItem}`][0].playKey = true;
        let playUrl = Data.Url;//默认主码流
        if(this.screen.length>4){
          playUrl = Data.SubUrl;//子码流
        }
        this.$refs[`plugDiv${this.clickItem}`][0].play(1,playUrl);
      }else{
        console.log('请先选择监控画面');
      }
    },
    /**
     * 暂停播放
     */
    suspendVideo() {
      if(this.deviceVal){
        const Data = JSON.parse(this.deviceVal);
        this.startBtnShow = true;
        this.stopBtnShow = false;
        this.$refs[`plugDiv${Data.divItem}`][0].stop(1);
        this.$refs[`screenItem${Data.divItem}`][0].playKey = false;
        if(!this.downloadBtnShow){//正在下载->停止
          this.saveDownload(Data.divItem);
        }
        this.downloadBtnShow = false;
      }else{
        // console.log('请先选择监控画面');
      }
    },
    /**
     * 视频下载
     */
    downloadVideo(){
      if(this.deviceVal){
        const Data =  JSON.parse(this.deviceVal);
        let path = `c:\\视频下载\\${Data.name}${moment().format("YYYYMMDDHHmm")}.ts`;
        this.$refs[`plugDiv${Data.divItem}`][0].record(1,path);//开始下载
        this.$refs[`plugDiv${Data.divItem}`][0].downloadPath = path;
        this.screen[Data.divItem-1].downloadIconShow = true;
        this.downloadBtnShow = false;
        // this.$message.success('当前视频下载中...');
        this.msg = `当前视频正在下载中...`;
        this.successMsg = true;
        this.openMsgBox('showMsgBox');


      }
      
    },
    /**
     * 消息提示
     */
    openMsgBox(key) {//加载...
        this[key] = true;
        setTimeout(() => {
            this[key] = false;
        }, 3000);
    },
    /**
     * 保存视频下载
     */
    saveDownload(divItem){
      const path = this.$refs[`plugDiv${divItem}`][0].downloadPath;
      this.$refs[`plugDiv${divItem}`][0].stopRecord(1);//停止下载
      delete this.$refs[`plugDiv${divItem}`][0].downloadPath;
      this.screen[divItem-1].downloadIconShow = false;
      this.downloadBtnShow = true;
      this.msg = `视频下载成功，已保存到${path}`;
      this.successMsg = true;
      this.openMsgBox('showMsgBox');
    },
    /**
     * 照片抓拍
     */
    savePic(){
      if(this.deviceVal){
        const Data =  JSON.parse(this.deviceVal);
        let path = `c:\\照片抓拍\\${Data.name}${moment().format("YYYYMMDDHHmm")}.jpg`;
        this.$refs[`plugDiv${Data.divItem}`][0].snap(1, path);
        this.msg = `抓拍照片成功，已保存到${path}`;
        this.successMsg = true;
        this.openMsgBox('showMsgBox');
      }
    },
    /**
     * 违法抓拍
     */
    saveUnlawfulPic(){
      if(this.deviceVal){
        const Data =  JSON.parse(this.deviceVal);
        let picName = `${Data.name}${moment().format("YYYYMMDDHHmm")}.jpg`;
        let path = `c:\\照片抓拍\\${picName}`;
        this.$refs[`plugDiv${Data.divItem}`][0].snap(1, path);
        this.formData.picPath = path;
        this.formData.baidu_x = Data.Lng;//经度
        this.formData.baidu_y = Data.Lat;//纬度
        this.formData.ObjPosition = Data.name;
        this.showCheckBox = true;
      }
    },
    /**
     * 关闭上报违法弹窗
     */
    closeUnlawReport(){
      this.formData = Object.assign({},this.defFormData);
      this.showCheckBox = false;
    },
    /**
     * 事件上报信息提示
     */
    showEventMsg(data){
      this.msg = data.msg;
      this.successMsg = data.msgFlag;
      this.openMsgBox('showMsgBox');
    },
    showFullTip(val) {
      this.tipBtnShow = true;
    },
    hideFullTip() {
      this.tipBtnShow = false;
    },
    choosePlayDiv(val) {
      if(val){
        const data = JSON.parse(val);
        this.clickItem = data.divItem;
      }
    },
    setClickTitle(val){
      this.startBtnShow = false;
      this.stopBtnShow = false;
      this.downloadBtnShow = false;
      this.clickItem = val;
      const Arr = this.playVideoArr;
      this.deviceVal = null;
      const d = this.$refs[`plugDiv${val}`][0].downloadPath;
      for(var i=0;i<Arr.length;i++){
        if(Arr[i].divItem === val){
          this.deviceVal = JSON.stringify(Arr[i]);
          const status = this.$refs[`screenItem${val}`][0].playKey;
          if(status){
            this.startBtnShow = false;
            this.stopBtnShow = true;
            if(!d){
              this.downloadBtnShow = true;
            }
          }else{
            this.startBtnShow = true;
            this.stopBtnShow = false;
          }
          break;
        }
      }
    },
    routeToVideoMap(){
      this.$router.push("/videoMap");
    }
  },
  beforeDestroy() {
    this.stopAll();
  }

};
</script>


<style lang="scss">
.video-system {
  position: relative;
  overflow:hidden;
  .top-row {
    font-size: 14px;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    .container {
      height: 100%;
      display: flex;
      float: left;
      flex-wrap: wrap;
      align-content: space-between;
      .screen-com {
        height: 100%;
        box-sizing: border-box;
        position: relative;
        background: #fff;
        .screen-title{
          position: absolute;
          width:100%;
          height:36px;
          line-height:36px;
          background:#17335d;
          z-index:100;
          color:#fff;
          font-size:14px;
          cursor: pointer;
          .download-span{
            font-size:20px;
            width:30px;
            height:30px;   
            margin-right:10px; 
            cursor: pointer;        
          }
          .download-span:hover,.download-span:focus{
            color:#00a0e9;
          }
        }
        .screen-item {
          display:flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          z-index: 1;
          height:calc(100% - 36px);
          width:calc(100%);
          top:36px;
          box-sizing: border-box;
          background: #0e0e0e url(../../../assets/images/video_LOGO_LC.png) no-repeat center center;
        }
      }
      .active {
        border: 2px solid blueviolet;
        .screen-title{
          background:blueviolet;
        }
      }
      .unactive {
        border: 2px solid #ddd;
      }
    }
    .device-tree {
      float: right;
      width: 297px;
      height: 100%;
      box-sizing: border-box;
      border-left: 2px solid #ddd;
      background: #fff;
      .tab-pane-device {
        height: 100%;
        .el-tabs__header{
          .el-tabs__nav{
            width:100%!important;
            box-sizing:border-box!important;
            .el-tabs__item{
              width:50%!important;
              text-align:center!important;
            }
            .el-tabs__item:hover {
                color: #00a0e9!important;
            }
            .el-tabs__item.is-active {
                color: #fff!important;
                background:#17335d!important;
            }
          }
        }
        .el-tabs__content{
          height:calc(100% - 55px)!important;
          .tab-class{
            height:100%;
            .el-radio-group {
              padding: 0 5px !important;
              .el-radio + .el-radio {
                margin-left: 20px !important;
              }
              .el-radio__inner {
                border-color: #00a0e9!important;
                border-radius: 0%;
                    background: #fff!important;
              }
              .el-radio__inner:hover {
                border-color: #00a0e9!important;
              }
              .el-radio__inner::after {
                  border-radius: 0%!important;
                  width: 6px!important;
                  height:6px!important;
                  background-color: #00a0e9!important;

              }
            }
            .tree-style {
              width:100%;
              height: calc(100% - 100px);
              overflow-y: auto;
              .video-off-line{
                color: rgb(221, 221, 221);
              }
            }
            .history-list {
              width:100%;
              height: calc(100% - 50px);
              overflow-y: auto;
              .history-list-item{
                margin-left: 20px;
                margin-top: 10px;
              }
              .history-list-no{
                display: flex;
                height:100%;
                width:100%;
                justify-content: center;
                align-items: center;
              }
            }
          }
          
        }
      }
    }
    .absoluteClass {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 105;
    }
    .relativeClass {
      position: relative;
    }
    .clear-float {
      clear: both;
    }
  }
  .bottom-row {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    box-shadow:0 -3px 0 #ddd; //顶部阴影
    height: 44px;
    .tooltip-form {
      height: 30px;
      padding: 7px;
      .choose-screen {
        z-index: 101;
        position: absolute;
        top: -180px;
        width: 230px;
        height: 150px;
        box-shadow: 0 0 5px 5px #ddd;
        background:#fff;
        padding: 10px;
        .choose-screen-flex{
          display: flex;
          flex-wrap: wrap;
          width:230px;
          height:100%;
          .screen-choose-div {
            box-sizing:border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width:36px;
            height:36px;
            border:1px solid #ddd;
            border-radius: 3px;
            margin:5px;
            img{
              width:30px;
              height:30px;
            }
          }
          .screen-choose-div:hover{
            border:1px solid #00a0e9;
          }
          .screen-choose-div:click,
          .screen-choose-div:active,
          .screen-choose-div:visited, {
            border:2px solid #00a0e9;
          }

        }
        
      }
      .icon-btn{
        padding:5px 7px!important;
        font-size:20px!important;
        color:black;
      }
      .icon-btn.is-disabled{
        color: #c0c4cc;
      }
    }
  }
  .full-screen-tip {
    position: absolute;
    right: 5px;
    bottom: 25px;
    z-index: 106;
    background: blueviolet;
    border-radius: 5px;
    .tip-span {
      font-size: 24px;
      line-height: 40px;
      margin: 8px;
      color: white;
      cursor: pointer;
    }
    .tip-span:hover,
    .tip-span:active {
      color: #00a0e9;
    }
  }
  .success-msg-div{
    position: absolute;
    z-index: 106;
    background-color: #e1f3d8;
    border-radius: 5px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    min-width: 380px;
    left: 50%;
    top: 20px;
    color:#67b23a;
    overflow: hidden;
    padding: 15px 15px 15px 20px;
    font-size:12px;
    margin-left:-190px;
  }
  .error-msg-div{
    position: absolute;
    z-index: 106;
    background-color: #fef0f0;
    border-color: #fde2e2;
    border-radius: 5px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    min-width: 380px;
    left: 50%;
    top: 20px;
    color: #f56c6c;
    overflow: hidden;
    padding: 15px 15px 15px 20px;
    font-size:12px;
    margin-left:-190px;
  }

}

</style>
