<template>
    <div class="buffer">
        <div class="buffer-main" v-show="visable" :style="mainStyle">
            <div class="buffer-title">
                <div class="buffer-page">共{{totalPage}}页 当前第{{nowPage}}页 ({{buffer.length}})</div>
                <div class="buffer-close">
                    <img @click="setPopup" v-show="popupShow" class="buffer-close-img" src="../../assets/images/arrow-down.png" width="16" height="16">
                    <img @click="setPopup" v-show="!popupShow" class="buffer-close-img" src="../../assets/images/arrow-up.png" width="16" height="16">
                    <span @click="close" class="buffer-close-hover" style="line-height:27px;">
                        <base-icon icon='close' />
                    </span>

                </div>

            </div>
            <div v-show="popupShow" class="buffer-content">
                <el-row type="flex" justify="center">
                    <el-col :span="2" class="buffer-chevron">
                        <base-icon icon='back' @click.native="lastClick" style="font-size:30px;" />
                    </el-col>
                    <div class="buffer-content-div" v-for="(item2,index2) in buffer" :key="index2">
                        <div>
                            <div class="buffer-content-title">
                                <img src="../../assets/images/video_logo.png" width="17" height="17" style="float:left; margin-left:7px;margin-top:3px;">
                                <div style="float:left;width:210px; line-height:25px;font-size:14px;margin-left:10px;">
                                    <base-text-overflow :text='item2.name'></base-text-overflow>
                                    <!-- {{item2.name}} -->
                                </div>
                                <div style="float:right">
                                    <span title="事件上报" @click="eventUp(item2)">
                                        <base-icon icon='unlawvideo' class="video-wraing" />
                                    </span>
                                    <base-icon icon='close' class="buffer-close-hover" @click.native="deleteArr(item2.index)" style="line-height:25px;" />
                                </div>
                            </div>

                            <div v-if="hasPlugin" class="buffer-content-content">
                                <object :id="'plug'+nowPage+item2.index" :ref="'plugDiv'+nowPage+item2.index" type="application/NPAPIPlayerPlug-plugin" style="width: 300px; height: 195px;"></object>
                            </div>
                            <div v-else style="width: 300px; font-size:18px; height:  195px;line-height:195px;text-align:center">
                                <a href="static/plug/KmlcPlayerPlug.exe">请下载视频插件...</a>
                            </div>
                        </div>
                    </div>
                    <el-col :span="2" class="buffer-chevron">
                        <base-icon icon='rightarrow' style="font-size:30px" @click.native="nextClick" />
                    </el-col>
                </el-row>
            </div>

        </div>
        <div v-if="showCheckBox" class="buffer-video-event">
            <video-event @closeUnlawReport="closeUnlawReport" :eventData="formData" @showMessage="showEventMsg"></video-event>
        </div>
    </div>

</template>

<script>
import webconfig from '@/webconfig';
import moment from 'moment';
import { getHtmlType } from 'assets/js/commonManage.js';
import BaseTextOverflow from 'common/BaseTextOverflow.vue';
import VideoEvent from 'view/video/VideoEvent.vue';

export default {
  data() {
    return {
      mainStyle: {
        width: `100%`
      },
      showCheckBox: false,
      formData: {
        ObjPosition: '2',
        baidu_x: 0,
        baidu_y: 0,
        source: 4,
        remarks: ''
      },
      defFormData: {
        ObjPosition: '1',
        baidu_x: 0,
        baidu_y: 0,
        source: 4,
        remarks: ''
      },
      hasPlugin: false,
      nowPage: 1,
      popupShow: true,
      value1: 0,
      detector: [],
      buffer: []
    };
  },
  components: {
    BaseTextOverflow,
    VideoEvent
  },
  props: {
    visable: {
      type: Boolean,
      default: false
    },
    videoData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // buffer: {
    //     get: function() {
    //       const obj = Object.assign([], this.videoData);
    //       return obj;
    //     },
    //     set: function(newValue) {
    //     this.buffer=newValue
    //     }
    // },
    /**
     * 总页数
     */
    totalPage() {
      // return 1;
      let obj = Object.assign([], this.videoData);
      const page =
        obj.length % 4 == 0 ? obj.length / 4 : Math.ceil(obj.length / 4);
      if (page === 0) {
        // this.$store.dispatch('setBufferPopup', false);
      }
      return page;
    },
    /**
     * 当前页数据
     */
    pageList() {
      let obj = Object.assign([], this.videoData);
      let list = [];
      for (let i = 0; i < 4; i++) {
        let arr = obj[parseInt((this.nowPage - 1) * 4) + parseInt(i)];
        if (arr) {
          arr.index = parseInt((this.nowPage - 1) * 4) + parseInt(i);
          list.push(arr);
        }
      }
      return list;
    },
    detectorList() {
      this.detector = this.videoData;
      return this.videoData;
    }
  },
  watch: {
    pageList: function(value) {
      if (this.buffer.length > 0) {
        this.stopAll();
      }
      this.buffer = Object.assign([], this.videoData);
      this.playAll();
    },
    detectorList() {}
  },
  mounted() {
    const htmlType = getHtmlType();
    if (htmlType == 'IE') {
      if (document.all.plug0.object != null) {
        this.hasPlugin = true;
      }
    } else {
      for (var i = 0; i < navigator.plugins.length; i++) {
        if (navigator.plugins[i].name == '联诚播放器插件') {
          this.hasPlugin = true;
        }
      }
    }
    // this.hasPlugin = false;
    if (this.hasPlugin) {
      this.playAll();
    }
  },
  methods: {
    showEventMsg(data) {
      this.$message({
        message: `上报成功！`,
        type: 'success'
      });
    },

    /**
     * 关闭上报违法弹窗
     */
    closeUnlawReport() {
      this.formData = Object.assign({}, this.defFormData);
      this.showCheckBox = false;
      this.mainStyle.width = `100%`;
    },
    /**
     * 违法抓拍
     */
    saveUnlawfulPic() {
      let path = `c:\\照片抓拍\\${this.title}${moment().format(
        'YYYYMMDDHHmm'
      )}.jpg`;
      this.$refs.plugDiv.snap(1, path);
      this.$message({
        message: `抓拍照片已保存为${path}`,
        type: 'success'
      });

      this.formData.picPath = path;
      this.formData.baidu_x = this.selectData.Lng;
      this.formData.baidu_y = this.selectData.Lat;
      this.formData.ObjPosition = this.title;
      this.showCheckBox = true;
    },
    eventUp(data) {
      let path = `c:\\照片抓拍\\${data.name}${moment().format(
        'YYYYMMDDHHmm'
      )}.jpg`;
      //   this.$refs.plugDiv.snap(1, path);
      this.$refs['plugDiv' + this.nowPage + data.index][0].snap(1, path);
      this.$message({
        message: `抓拍照片已保存为${path}`,
        type: 'success'
      });

      this.formData.picPath = path;
      this.formData.baidu_x = data.Lng;
      this.formData.baidu_y = data.Lat;
      this.formData.ObjPosition = data.name;
      this.showCheckBox = true;
      this.mainStyle.width = `calc(100vw - 280px)`;
    },
    /**
     *@name 上一页
     */
    lastClick() {
      const value = parseInt(this.nowPage) - 1;

      if (value != 0) {
        this.stopAll();
        this.nowPage = value;
      } else {
        this.$message({
          message: '当前已经是第一页！',
          type: 'warning'
        });
      }
    },
    /**
     *@name 下一页
     */
    nextClick() {
      const value = parseInt(this.nowPage) + 1;

      if (value <= this.totalPage) {
        this.nowPage = value;
        this.stopAll();
      } else {
        this.$message({
          message: '当前已经是最后一页！',
          type: 'warning'
        });
      }
    },
    /**
     *@name  播放所有视频
     */
    playAll() {
      this.$nextTick(() => {
        for (let item of this.buffer) {
          //   this.getObjectStream(item);
          this.$refs['plugDiv' + this.nowPage + item.index][0].play(
            1,
            item.SubUrl
          );
        }
      });
    },
    /**
     *@name  关闭所有视频
     */
    stopAll() {
      for (let item of this.buffer) {
        this.$refs['plugDiv' + this.nowPage + item.index][0].stop(1);
      }
    },
    /**
     * @name 获取走马灯当前页数
     * @param index 页数
     */
    carouselChange(index) {
      console.log(this.pageList);
      this.nowPage = index + 1;
    },
    /**
     * @name 清除不想要的设备
     * @param index 当前跑马灯页码
     */
    deleteArr(index) {
      this.buffer.splice(index, 1);
      this.stopAll();
      this.buffer = this.buffer;
    },
    /**
     *@name 关闭弹出层
     */
    close() {
      if (this.popupShow) this.stopAll();
      this.popupShow=true;
      this.$emit('close', false);
    },
    /**
     * @name  折叠设备列表详情（最小化）
     */
    setPopup() {
      if (this.popupShow) {
        this.popupShow = false;
        this.stopAll();
      } else {
        this.popupShow = true;
        this.playAll();
      }
    },
    /**
     *@name  获取视频设备rtsp流
     */
    async getObjectStream(value) {
      const url = `${webconfig.cameraServer}/${value.DeviceId}?DeviceType=311`;
      try {
        const Res = await this.$http.get(url, {
          isInternet: true
        });
        if (Res) {
          const ResData = Res.data;
          if (ResData.Result === 1) {
            const Data = ResData.Data;

            // Data.Url =
            // "rtsp://172.17.204.180:11554/000200000601.34e2b9016a5742169eb8d3fdeacce4f8.0";
            this.$nextTick(function() {
              this.$refs['plugDiv' + this.nowPage + value.index][0].play(
                1,
                Data.Url
              );

              // $("#plug" + value.index)[0].play(1, Data.Url);
              console.log(`视频${value.index}启动播放`);
            });
          } else {
            this.isNoneVoide = true;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss">
.buffer {
  //   position: relative;
  .buffer-main {
    position: absolute;
    z-index: 100;
    bottom: 0px;
    // height: 270px;
    width: 100%;
    margin: auto;
    background-color: rgba(69, 69, 69, 0.7);

    .buffer-title {
      height: 27px;
      overflow: hidden;
      color: white;
      background-color: #212332;
      .buffer-page {
        float: left;
        margin-left: 10px;
        line-height: 27px;
      }
      .buffer-close {
        float: right;
        margin-right: 10px;
        line-height: 27px;
        .buffer-close-img {
          &:hover {
            cursor: pointer;
          }
        }
        .buffer-close-hover {
          margin-left: 10px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .buffer-content {
      padding: 10px 0;
      // height: 220px;
      .el-carousel__container {
        height: 220px;
      }

      .buffer-chevron {
        text-align: center;
        color: #fff;
        margin-top: 100px;
        &:hover {
          cursor: pointer;
        }
      }
      .buffer-content-div {
        width: 300px;
        height: 220px;
        margin-left: 5px;
        //   background-color: #303858;
        background: #0e0e0e url(../../assets/images/video_LOGO_LC.png) no-repeat
          center center;

        .buffer-content-title {
          height: 25px;
          color: #fff;
          overflow: hidden;
          background-color: #131623;
          .buffer-close-hover {
            margin-right: 10px;
            &:hover {
              cursor: pointer;
            }
          }
          .video-wraing {
            font-size: 16px;
            margin-right: 5px;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .buffer-video-event {
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    z-index: 9999;
    width: 280px;
    height: calc(100vh - 50px);
  }
}
</style>

