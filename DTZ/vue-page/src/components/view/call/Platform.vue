<template>
  <div class="call-main">
    <div :class="['pace',searchShow?'pace-active':'']">
      <div class="pace-progress">
        <div class="pace-progress-inner"></div>
      </div>
      <div class="pace-activity"></div>
    </div>
    <!--我的分机号 begin-->
    <div class="top-exten">
      <span class="top-title">
        <span>
          坐席号：{{this.exten}}
        </span>
        <span title="坐席状态" class="title-type">{{callType?callType:'空闲'}}</span>
      </span>
      <!--<a class="top-change" href="javascript:void(0)" @click='changeExten'>切换</a>-->
    </div>
    <!--我的分机号 end-->
    <div class="top">
      <!--点击拨号 begin-->
      <div class="top-dial">
        <el-input class="top-input" v-model="inputCallNumber" placeholder="点击拨号">
          <div slot="suffix">
            <div class="input-phone" @click="callPhone">
              <base-icon icon="phone"/>
            </div>
          </div>
        </el-input>
      </div>
      <!--点击拨号 end-->
      <!--计时器 begin-->
      <div class="top-timer">
        <span class="player-item">
          <!--<base-icon icon="jinzhi" style="color:#f0ad4e;font-size:18px"/>-->
          <!--<base-icon icon="yuan" style="color:#5cb85c;font-size:18px"/>-->
          <base-icon :icon="player.playerIconType===1 ?'yuan':'jinzhi'"
                     :style="player.playerIconType===1 ?'color:#5cb85c;font-size:18px':'color:#f0ad4e;font-size:18px'"/>
          <span style="font-size:14px;color:#777777">
            <span>{{player.playerText}}</span>
            <span>{{player.timeString}}</span>
          </span>
        </span>
      </div>
      <!--计时器 end-->
      <!--播放器 begin-->
      <div class="top-player">
        <span class="player-item" title='暂停' @click='pause'>
          <base-icon icon="zanting"/>
        </span>
        <span class="player-item" title='播放' @click='playing'>
          <base-icon icon="bofang"/>
        </span>
        <!--<span class="player-item" style="font-size:18px" title='消息提醒'>-->
        <!--<base-icon icon="duihua"/>-->
        <!--</span>-->
      </div>

      <!--播放器 end-->
    </div>
    <div class="content">
      <CallScreen @isBomb="onIsBomb"></CallScreen>
      <div class="left">
        <div class="call-type">
          <div class="typeitem">
            <div :class="['item', dirActive==1?'active':'']" @click="setDir(1)">
              <span>
                <base-icon icon="phone"/>
                <span> 全部电话</span>
              </span>
              <el-badge :value="cdrDataLength"></el-badge>
            </div>
            <div :class="['item', dirActive==2?'active':'']" @click="setDir(2)">
              <span>
                <base-icon icon="close"/>
                <span> 漏接电话</span>
              </span>
              <el-badge :value="cdrOut.length"></el-badge>
            </div>

          </div>
        </div>
        <!-- <div class="call-eval">
          <div class="eval-head">
            便捷操作
          </div>
          <div class="eval-content">
            <div>
              <el-button type='primary' size="small">
                <base-icon icon="pingjia" style="font-size:16px;" /> 服务评价
              </el-button>
            </div>

            <div>
              <el-button @click="showCallDia" type='warning' size="small" style="margin-top:10px;">
                <base-icon icon="phone" style="font-size:18px;"/>
                呼叫转移
              </el-button>
            </div>
            <div>
              <el-button type='success' @click="callIn" size="small" style="margin-top:10px;">
                <base-icon icon="phone" style="font-size:18px;"/>
                模拟电话呼入
              </el-button>
            </div>
          </div>
          <el-button type="primary" @click='setBomb'>弹屏</el-button>
        </div> -->
      </div>
      <div class="right">
        <div class="right-head">
          <div class="search">
            <div :class="['bar',searchShow?'barShow':'']">
              <div class="bar-group">
                <input v-focus='searchFocus' v-model="phone_num" @keyup.enter="showSearch" @blur="blur"
                       class="form-input" placeholder="请输入手机号..." type="text"/>
                <div class="icon" @click="blur">
                  <base-icon icon='search'/>
                </div>
              </div>
            </div>
          </div>
          <div class="tip">
            <div class="tip-main">
              <div class="tip-item">
                <a class="type type-green">
                  <base-icon icon='jiantou'/>
                </a>
                <span>呼入电话</span>
              </div>
              <div class="tip-item">
                <a class="type type-blue">
                  <base-icon icon='jiantou'/>
                </a>
                <span>呼出电话</span>
              </div>
              <div class="tip-item">
                <a class="type type-red">
                  <base-icon icon='jiantou'/>
                </a>
                <span>呼入漏接</span>
              </div>
              <div class="tip-item">
                <a class="type type-red2">
                  <base-icon icon='jiantou'/>
                </a>
                <span>呼出未接</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div style="width:100%">
            <el-table :data="cdrData" :height="screenHeight-110" v-loading="loading">
              <el-table-column label="" fixed width="40px">
                <template slot-scope="scope">
                  <div class="tip-item">
                    <a :class="['type',iconFormate(scope.row)]">
                      <base-icon icon='jiantou'/>
                    </a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="日期" width="130px" :formatter='dataFormate'></el-table-column>
              <el-table-column label="类型" :formatter='callTypeFormate' sortable></el-table-column>
              <el-table-column label="主叫号码" width="110px" prop="src"></el-table-column>
              <!-- <el-table-column label="省份" prop="call_province"></el-table-column> -->
              <!-- <el-table-column label="城市" prop="call_city"></el-table-column> -->
              <!-- <el-table-column label="运营商" prop='call_corp'></el-table-column> -->
              <el-table-column label="被叫" width="110px" prop='dst'></el-table-column>
              <el-table-column label="接通状态" :formatter="callStatusFormate" prop='call_status'></el-table-column>
              <el-table-column label="等待时长(秒)" prop='wait_time'></el-table-column>
              <el-table-column label="接通时长(秒)" prop='billsec'></el-table-column>
              <el-table-column label="录音" prop='recordingfile'>
                <template slot-scope="scope">
                  <el-button type="text" @click="recordingShow(scope.row)">播放</el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column label="技能组" prop='queue_id'></el-table-column> -->
            </el-table>
          </div>

        </div>
      </div>

    </div>
    <!-- 呼叫转移 start-->
    <!--<el-dialog title="设置呼叫转移" :visible.sync='callTranVisible' :close-on-press-escape="false"-->
    <!--:close-on-click-modal="false">-->
    <!--<el-radio v-for="(item,index) in toExtenItems" v-model="toExten" :label="item.exten" :key="index"-->
    <!--border></el-radio>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="setCallTransfer()">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <!-- 呼叫转移 end-->

    <el-dialog title="录音播放" width='30%' @close="wavClose" :visible.sync='recordVisible' :close-on-press-escape="false"
               :close-on-click-modal="false">
      <base-wavesurfer :src='wavSrc' :uniqueid='wavUniqueid' :phone='wavPhone' ref="wave"></base-wavesurfer>
    </el-dialog>
  </div>

</template>
<script>
  import CallScreen from "view/call/CallScreen";
  import config from "view/call/config";
  import {dateFormat} from "assets/js/date";
  import BaseWavesurfer from "common/BaseWavesurfer";

  export default {
    data() {
      return {
        wavSrc: "", //音频路径
        wavUniqueid: "",
        wavPhone: "", //音频电话
        recordVisible: false,
        screenHeight: document.body.clientHeight - 110,
        dirActive: 1, //流水查询状态 默认1 全部  2漏接
        phone_num: "",
        callTranVisible: false,
        toExten: 0, //呼叫转移号
        loading: false, //表格加载
        cdrData: [], //通话流水
        cdrDataLength:0,
        exten: 0, //我的分机号
        player: {
          //播放器
          playerText: "就绪", //播放器文字
          playerIconType: 1, //图标样式
          interval: null, //interval循环函数
          status: 1,
          timeString: "00:00:00" //显示在页面计时器
        },
        // isBomb: false,
        inputCallNumber: null, //点击拨号，呼出电话
        dialgo: false,
        searchShow: false,
        searchFocus: false //input获取焦点
      };
    },
    components: {CallScreen, BaseWavesurfer},
    directives: {
      focus: {
        update: function (el, {value}) {
          if (value) {
            el.focus();
          }
        }
      }
    },
    computed: {
      callType() {
        //通话转台
        const ary = this.$store.getters.getCallType;
        if (ary.length > 0) {
          let obj = ary[0];
          return obj.label;
        }
      },
      cdrOut() {
        return this.cdrData.filter(item => {
          return item.call_type == 331 && item.call_status == 334;
        });
      }
    },

    watch: {
      searchFocus(val) {
        if (val) {
          this.searchShow = true;
        } else {
          this.searchShow = false;
        }
      }
    },
    methods: {
      wavClose() {
        this.$refs.wave.pause();
        this.$refs.wave.rest();
        this.$refs.wave.wavesurfer.seekTo(0);
      },
      recordingShow(data) {
        this.wavSrc = config.callCenterPath + data.recordingfile;
        this.wavUniqueid = Number(data.uniqueid);
        if (data.call_type == 331) {
          this.wavPhone = Number(data.src);
        } else {
          this.wavPhone = Number(data.dst);
        }

        this.recordVisible = true;
      },
      phoneMainFormate(row, column, cellValue, index) {
        switch (parseInt(row.call_type)) {
          case 331: //呼入
            return row.src;
            break;
          case 332: //呼出
            return row.src;
            break;
          default:
            break;
        }
      },
      phoneOutFormate(row, column, cellValue, index) {
        switch (parseInt(row.call_type)) {
          case 331: //呼入
            return row.dst;
            break;
          case 332: //呼出
            console.log(row);
            return row.dst;
            break;
          default:
            break;
        }
      },
      iconFormate(row, column, cellValue, index) {
        let str = "type-green";
        switch (parseInt(row.call_type)) {
          case 331: //呼入
            if (row.call_status == 334) {
              str = "type-red";
            } else {
              str = "type-green";
            }
            break;
          case 332: //呼出
            if (row.call_status == 341) {
              str = "type-red2";
            } else {
              str = "type-blue";
            }
            break;

          default:
            break;
        }
        return str;
      },
      callStatusFormate(row, column, cellValue, index) {
        let str = "未知";
        for (const item of config.callStatus) {
          if (item.value == row.call_status) str = item.label;
        }
        return str;
      },
      callTypeFormate(row, column, cellValue, index) {
        let str = "未知";
        for (const item of config.callType) {
          if (item.value == row.call_type) str = item.label;
        }
        return str;
      },

      /**
       * 设置表格数据默认值，在不存在值的情况下 默认为--
       */
      setDefaultInfo(row, column, cellValue, index) {
      },
      showCallDia() {
        this.callTranVisible = true;
      },
      /**
       * 设置呼叫转移
       */
      // async setCallTransfer() {
      //   const Res = await this.$http.post(
      //     "/call/CallController/callTransfer",
      //     {
      //       type: "exten",
      //       exten: this.exten.toString(),
      //       to_num: this.toExten.toString()
      //     },
      //     {isOut: true}
      //   );
      //   if (Res.data.error == 0) {
      //     console.log(Res);
      //     this.callTranVisible = false;
      //   } else {
      //     this.$message.error(Res.data.msg);
      //   }
      // },
      /**
       * 表格日期格式化
       */
      dataFormate(row, column, cellValue, index) {
        var date = new Date(parseInt(row.call_time) * 1000);
        var fm = dateFormat(date, "yyyy-MM-dd hh:mm");
        return fm;
      },

      /**
       * 过滤查询通话流水
       */
      setDir(val) {
        let data = {};
        this.dirActive = 1;
        if (val === 2) {

          this.dirActive = 2;
          this.cdrData=this.cdrOut;
        }else{
        this.findCdr();
        }

      },
      /**
       * 查询通话流水
       */
      async findCdr(data = {}) {
        data.exten = this.exten.toString();
        if (this.phone_num.length > 0) data.phone_num = this.phone_num.toString();
        this.loading = true;
        this.cdrData = [];
        const Res = await this.$http.post("/call/CallController/cdrData", data, {
          isOut: true
        });

        console.log(Res);
        if (Res.data.error == 0) {
          this.cdrData = Res.data.data;
          this.cdrDataLength=this.cdrData.length;
        } else {
          this.$message.error(Res.data.msg);
        }
        this.loading = false;
      },
      //模拟弹屏
      async callIn() {
        await this.$http.post("/call/CallController/callScreen", {
          exten: this.exten,
          phone_num: "13759118182",
          uniqueid: "901",
          call_province: "5LqR5Y2X",
          call_city: "5piG5piO",
          call_corp: "5Lit5Zu956e75Yqo"
        });
      },
      //横幅点击拨号
      async callPhone() {
        const val = this.validatePhone(this.inputCallNumber);
        if (val) {
          const Res = await this.$http.post(
            "/call/CallController/clickCall",
            {
              exten: this.exten.toString(),
              phone: this.inputCallNumber.toString()
            },
            {isOut: true}
          );
          console.log(Res);
          if (Res.data.error == 0) {
            this.$message.success("接口调用成功");
          } else {
            this.$message.error(Res.data.msg);
          }
        } else {
          this.$message.error("请输入正确的手机号码或座机电话");
        }
      },
      validatePhone(val) {
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/; //手机号码
        var isMob = /^0?1[3|4|5|8][0-9]\d{8}$/; // 座机格式
        if (isMob.test(val) || isPhone.test(val)) {
          return true;
        } else {
          return false;
        }
      },
      //监听子组件的弹屏情况动态设置分机状态
      onIsBomb(isBomb) {
        isBomb ? this.pause() : this.playing();
      },
      //组件初始化设置分机状态为true
      async initRunPlaying() {
        const result = await this.$http.post(
          "/call/CallController/queuePauseDo",
          {
            exten: this.exten.toString(),
            type: "unpause",
            queue_id: "901"
          },
          {isOut: true}
        );
        if (result.data && result.data.error) {
          this.$message.error("状态变更失败");
          return;
        }
      },
      //播放
      async playing() {
        const vm = this;
        // http://127.0.0.1/smartcrm/index.php?m=api&a=queuePauseDo

        if (this.player.status === 0) {
          const result = await vm.$http.post(
            "/call/CallController/queuePauseDo",
            {
              exten: vm.exten.toString(),
              type: "unpause",
              queue_id: "901"
            },
            {isOut: true}
          );
          if (result.data && result.data.error) {
            this.$message.error("状态变更失败");
            return;
          }
          this.player.playerText = "就绪";
          this.player.playerIconType = 1; //播放图标
          this.player.timeString = "00:00:00";
          this.player.status = 1;
          this.timeRun();
        }
      },
      //暂停
      async pause() {
        const vm = this;

        if (this.player.status === 1) {
          const result = await vm.$http.post(
            "/call/CallController/queuePauseDo",
            {
              exten: vm.exten.toString(),
              type: "pause",
              queue_id: "901"
            },
            {isOut: true}
          );
          if (result.data && result.data.error) {
            this.$message.error("状态变更失败");
            return;
          }
          this.player.playerText = "暂停";
          this.player.playerIconType = 0; //暂停图标
          this.player.timeString = "00:00:00";
          this.player.status = 0;
          this.timeRun();
        }
      },

      //计时器
      timeRun() {
        const vm = this;
        const player = vm.player;
        clearInterval(player.interval);
        let sec = 0;
        player.interval = setInterval(function () {
          sec++;
          let date = new Date(0, 0);
          date.setSeconds(sec);
          let h = date.getHours();
          let m = date.getMinutes();
          let s = date.getSeconds();
          player.timeString =
            vm.two_char(h) + ":" + vm.two_char(m) + ":" + vm.two_char(s);
        }, 1000);
      },
      two_char(n) {
        return n >= 10 ? n : "0" + n;
      },

      // setBomb() {
      //   this.isBomb = this.isBomb ? false : true;
      // },
      blur() {
        if (this.searchShow) {
          this.searchFocus = false;
          // this.findCdr();
        } else {
          this.searchFocus = true;
        }
      },
      showSearch() {
        // this.searchFocus = false;
        this.findCdr();
      },
      /**
       * 查找我的分机号
       */
      async findOneExten() {
        const ret = await this.$http.post("/call/CallController/findOneExten");
        if (ret.data.success) {
          console.log(ret, 1231256);
          this.exten = ret.data.result.exten;
          this.initRunPlaying();
          this.timeRun();
          this.findCdr();
        } else {
          return this.$message.error(ret.data.msg);

        }
      }
    },
    mounted() {
      this.findOneExten();
    },
    created() {
    },
    beforeDestroy() {
    }
  };
</script>

<style lang="scss">
  $backer: #f0f2f5;
  $callColor: #00c1de;
  .call-main {
    background-color: $backer;
    font-size: 14px;
    color: #777777;
    .top-exten {
      position: absolute;
      height: 45px;
      line-height: 45px;
      width: 300px;
      .top-title {
        font-size: 22px;
        .title-type {
          font-size: 14px;
          background: #2196f3;
          color: #fff;
          padding: 1px 8px;
          border-radius: 10px;
        }
      }
      .top-change {
        text-decoration: none;
        margin-left: 5px;
        color: #00c1de;
      }
    }
    .top-type {
      position: absolute;
      height: 45px;
      line-height: 45px;
      top: 0;
      right: 50px;
    }
    .top {
      background-color: #ffffff;
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      // width: 100%;
      // border: 1px solid blue;/
      border-bottom: 1px solid #d8e3ef;
      .top-dial {
        // border: 1px solid red;
        width: 200px;
        .top-input {
          .el-input__inner {
            height: 32px;
            border-radius: 15px;
          }
        }
        .input-phone {
          height: 32px;
          line-height: 32px;
          font-size: 26px;
          // color:#ccc;
          &:hover {
            cursor: pointer;
            color: #8a8888;
          }
        }
      }
      .top-timer {
        margin: 0 10px 0 60px;
      }
      .top-player {
        width: 200px;
        .player-item {
          color: $callColor;
          padding: 10px 15px;
          &:hover {
            cursor: pointer;
            color: #fff;
            background: #33485c;
          }
        }
      }
    }
    .content {
      position: relative;
      height: calc(100vh - 160px);
      display: flex;
      padding: 25px;
      overflow: hidden;
      .left {
        flex: 0.2;
        width: 190px;
        .call-type {
          background: #fff;
          margin-bottom: 20px;
          .typeitem {
            .item {
              display: flex;
              justify-content: space-between;
              padding: 10px 15px;
              &:hover {
                cursor: pointer;
                background: #eee;
                color: $callColor;
              }
            }
            .active {
              color: #fff;
              background: $callColor;
              .el-badge__content {
                background-color: #fff;
                color: $callColor;
              }
              &:hover {
                color: #fff;
                background: $callColor;
              }
            }
          }
        }
        .call-eval {
          background: #fff;
          margin-bottom: 20px;
          .eval-head {
            padding: 7px 15px;
            font-size: 18px;
            border-bottom: 1px solid #e5e5e5;
          }
          .eval-content {
            padding: 15px;
            .el-button {
              // border-radius: 0px;
            }
          }
        }
      }
      .right {
        // margin-left: 40px;
        flex: 1;
        .right-head {
          padding-left: 40px;
          height: 50px;
          line-height: 50px;
          display: flex;
          .search {
            width: 300px;
            .bar {
              width: 50px;
              text-align: center;
              background: #fff;
              transition: all 0.4s;
              .bar-group {
                position: relative;
                .form-input {
                  width: 100%;
                  display: table-cell;
                  height: 50px;
                  outline: none;
                  border: 0;
                  background: transparent !important;
                  padding-left: 0;
                  margin-left: 12px;
                  text-indent: -999999px;
                  // padding: 6px 12px;
                  font-size: 14px;
                  line-height: 1.42857143;
                  color: #555;
                  transition: border-color ease-in-out 0.15s,
                  box-shadow ease-in-out 0.15s;
                }
                .icon {
                  cursor: pointer;
                  position: absolute;
                  right: 0px;
                  width: 50px;
                  height: 50px;
                  font-size: 20px;
                  line-height: 50px;
                  color: $callColor;
                  top: 0px;
                }
              }
            }
            .barShow {
              width: 240px;
              background: rgba(0, 0, 0, 0.08);
              color: #777777;
              .form-input {
                text-indent: 10px !important;
              }
            }
          }
          .tip {
            flex: 1;
            .tip-main {
              display: flex;
              .tip-item {
                margin-left: 15px;
              }
            }
          }
        }
        .right-content {
          margin-left: 40px;
          margin-top: 15px;
          padding: 20px 15px;
          background: #fff;
          border: 1px solid;
          border-color: #e5e5e5 !important;
          border-top: 0;
        }
      }
    }
    .tip-item {
      .type {
        font-size: 14px;
        color: #fff;
        height: 50px;
        padding: 2px 6px;
      }
      .type-green {
        background: #5cb85c;
      }
      .type-blue {
        background: #5bc0de;
        .svg-icon {
          transform: rotate(180deg);
        }
      }
      .type-red {
        background: #d9534f;
      }
      .type-red2 {
        background: #d9534f;
        .svg-icon {
          transform: rotate(180deg);
        }
      }
    }

    .pace {
      width: 140px;
      height: 300px;
      position: fixed;
      top: 0px;
      right: 20px;
      z-index: 2000;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
      opacity: 0;
      -webkit-transition: all 2s linear 0s;
      -moz-transition: all 2s linear 0s;
      transition: all 2s linear 0s;
      .pace-activity {
        width: 140px;
        height: 140px;
        border-radius: 70px;
        background: #29d;
        position: absolute;
        top: 0;
        z-index: 1911;
        -webkit-animation: pace-bounce 1s infinite;
        -moz-animation: pace-bounce 1s infinite;
        -o-animation: pace-bounce 1s infinite;
        -ms-animation: pace-bounce 1s infinite;
        animation: pace-bounce 1s infinite;
      }
      .pace-progress {
        position: absolute;
        display: block;
        left: 50%;
        bottom: 0;
        z-index: 1910;
        margin-left: -30px;
        width: 60px;
        height: 75px;
        background: rgba(20, 20, 20, 0.1);
        box-shadow: 0 0 20px 35px rgba(20, 20, 20, 0.1);
        border-radius: 30px / 40px;
        -webkit-transform: scaleY(0.3);
        -moz-transform: scaleY(0.3);
        -ms-transform: scaleY(0.3);
        -o-transform: scaleY(0.3);
        transform: scaleY(0.3);
        -webkit-animation: pace-compress 0.5s infinite alternate;
        -moz-animation: pace-compress 0.5s infinite alternate;
        -o-animation: pace-compress 0.5s infinite alternate;
        -ms-animation: pace-compress 0.5s infinite alternate;
        animation: pace-compress 0.5s infinite alternate;
      }
    }
    .pace-active {
      -webkit-transform: scale(0.25);
      -moz-transform: scale(0.25);
      -ms-transform: scale(0.25);
      -o-transform: scale(0.25);
      transform: scale(0.25);
      opacity: 1;
    }

    @-webkit-keyframes pace-bounce {
      0% {
        top: 0;
        -webkit-animation-timing-function: ease-in;
      }
      40% {
      }
      50% {
        top: 140px;
        height: 140px;
        -webkit-animation-timing-function: ease-out;
      }
      55% {
        top: 160px;
        height: 120px;
        border-radius: 70px / 60px;
        -webkit-animation-timing-function: ease-in;
      }
      65% {
        top: 120px;
        height: 140px;
        border-radius: 70px;
        -webkit-animation-timing-function: ease-out;
      }
      95% {
        top: 0;
        -webkit-animation-timing-function: ease-in;
      }
      100% {
        top: 0;
        -webkit-animation-timing-function: ease-in;
      }
    }

    @-moz-keyframes pace-bounce {
      0% {
        top: 0;
        -moz-animation-timing-function: ease-in;
      }
      40% {
      }
      50% {
        top: 140px;
        height: 140px;
        -moz-animation-timing-function: ease-out;
      }
      55% {
        top: 160px;
        height: 120px;
        border-radius: 70px / 60px;
        -moz-animation-timing-function: ease-in;
      }
      65% {
        top: 120px;
        height: 140px;
        border-radius: 70px;
        -moz-animation-timing-function: ease-out;
      }
      95% {
        top: 0;
        -moz-animation-timing-function: ease-in;
      }
      100% {
        top: 0;
        -moz-animation-timing-function: ease-in;
      }
    }

    @keyframes pace-bounce {
      0% {
        top: 0;
        animation-timing-function: ease-in;
      }
      50% {
        top: 140px;
        height: 140px;
        animation-timing-function: ease-out;
      }
      55% {
        top: 160px;
        height: 120px;
        border-radius: 70px / 60px;
        animation-timing-function: ease-in;
      }
      65% {
        top: 120px;
        height: 140px;
        border-radius: 70px;
        animation-timing-function: ease-out;
      }
      95% {
        top: 0;
        animation-timing-function: ease-in;
      }
      100% {
        top: 0;
        animation-timing-function: ease-in;
      }
    }

    @-webkit-keyframes pace-compress {
      0% {
        bottom: 0;
        margin-left: -30px;
        width: 60px;
        height: 75px;
        background: rgba(20, 20, 20, 0.1);
        box-shadow: 0 0 20px 35px rgba(20, 20, 20, 0.1);
        border-radius: 30px / 40px;
        -webkit-animation-timing-function: ease-in;
      }
      100% {
        bottom: 30px;
        margin-left: -10px;
        width: 20px;
        height: 5px;
        background: rgba(20, 20, 20, 0.3);
        box-shadow: 0 0 20px 35px rgba(20, 20, 20, 0.3);
        border-radius: 20px / 20px;
        -webkit-animation-timing-function: ease-out;
      }
    }

    @-moz-keyframes pace-compress {
      0% {
        bottom: 0;
        margin-left: -30px;
        width: 60px;
        height: 75px;
        background: rgba(20, 20, 20, 0.1);
        box-shadow: 0 0 20px 35px rgba(20, 20, 20, 0.1);
        border-radius: 30px / 40px;
        -moz-animation-timing-function: ease-in;
      }
      100% {
        bottom: 30px;
        margin-left: -10px;
        width: 20px;
        height: 5px;
        background: rgba(20, 20, 20, 0.3);
        box-shadow: 0 0 20px 35px rgba(20, 20, 20, 0.3);
        border-radius: 20px / 20px;
        -moz-animation-timing-function: ease-out;
      }
    }

    @keyframes pace-compress {
      0% {
        bottom: 0;
        margin-left: -30px;
        width: 60px;
        height: 75px;
        background: rgba(20, 20, 20, 0.1);
        box-shadow: 0 0 20px 35px rgba(20, 20, 20, 0.1);
        border-radius: 30px / 40px;
        animation-timing-function: ease-in;
      }
      100% {
        bottom: 30px;
        margin-left: -10px;
        width: 20px;
        height: 5px;
        background: rgba(20, 20, 20, 0.3);
        box-shadow: 0 0 20px 35px rgba(20, 20, 20, 0.3);
        border-radius: 20px / 20px;
        animation-timing-function: ease-out;
      }
    }
  }
</style>
