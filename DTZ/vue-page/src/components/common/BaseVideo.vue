<template>
  <div class="base-video">
    <div v-if="showCheckBox" class="video-event">
      <video-event @closeUnlawReport="closeUnlawReport" :eventData="formData" @showMessage="showEventMsg"></video-event>
    </div>


    <el-dialog @close='dialogClose' class="base-video-dialog" :title="title" :visible.sync="videoVisable" :close-on-click-modal='false' :close-on-press-escape='false' width="600px">
      <div class="video-main" v-if="hasPlugin">
        <object :ref="'plugDiv'" type="application/NPAPIPlayerPlug-plugin" style="width:100%;height:100%;text-align:center">
          当前浏览器版本不支持播放，请升级浏览器或选择其他浏览器进行播放
          <!-- <param name="wmode" value="transparent"> -->
        </object>

      </div>
      <div style="width: 560px; height: 400px;line-height: 400px;text-align: center;font-size: 24px" v-else>
        <a href="static/plug/KmlcPlayerPlug.exe">请下载视频插件...</a>
      </div>
      <div class="video-tool">
        <div class="tool-item" :title='play?"停止":"播放"' @click="togglePlay">
          <base-icon :class="play?'item-red':'' " :icon="play?'yuan':'bofang2'" />
        </div>
        <div class="tool-item" title="截图" @click="snap">
          <base-icon icon='img' />
        </div>
        <div class="tool-item" title="下载" @click="dowmload(0)">
          <base-icon :class="isDownload?'item-red':'' " icon='xiazai' />
        </div>
        <div class="tool-item" @click='volumeNo'>
          <base-icon :icon='volume!=0?"shengyin":"jinying"' />
        </div>
        <div class="tool-item" @click='saveUnlawfulPic' title="违法抓拍">
          <base-icon icon="unlawvideo" />
        </div>

        <div class="tool-item" style="width:80px;">
          <el-slider @change='volumChange' v-model="volume" :show-tooltip="false"></el-slider>
        </div>
        <div v-show="isDownload" class="tool-down" style="float:right">
          视频下载中...
        </div>
      </div>

      <!-- <span slot="footer">
        <el-button @click="videoVisable = false">取 消</el-button>
        <el-button type="primary" @click="videoVisable = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { isPlug } from 'assets/js/commonManage';
import moment from 'moment';
import VideoEvent from 'view/video/VideoEvent.vue';
export default {
  name: 'base-video',
  props: {
    title: {
      type: String,
      default: '测试'
    },
    url: {
      type: String,
      default: ''
      // "rtsp://172.17.204.180:11554/000200000601.34e2b9016a5742169eb8d3fdeacce4f8.0"
    },
    visable: {
      type: Boolean,
      default: false
    },
    selectData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showall: false,
      toolMode: 1,
      // videoVisable: this.visable,
      volume: 100,
      hasPlugin: false, //是否安装了插件
      isDownload: false,
      play: false,
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
      }
    };
  },
  components: {
    VideoEvent
  },
  computed: {
    videoVisable: {
      get() {
        return this.visable;
      },
      set(val) {
        // console.log('set',val);
        this.$emit('close', val);
      }
    }
  },
  watch: {
    videoVisable(val) {
      if (val) {
        this.$nextTick(() => {
          if (this.url !== '') {
            this.play = true;
            this.$refs.plugDiv.getPluginVersion();
            this.$refs.plugDiv.play(1, this.url);
          }
        });
      } else {
        this.play = false;
        this.isDownload = false;
        this.$refs.plugDiv.stopRecord(1);
        this.$refs.plugDiv.stop(1);
      }
    },
    url: {
      handler: function(val) {
        console.log('watch:', val);
        if (val !== '') {
          this.videoVisable = true;
          this.play = true;
          this.$nextTick(() => {
            this.$refs.plugDiv.getPluginVersion();
            this.$refs.plugDiv.play(1, this.url);
          });
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.hasPlugin = isPlug();
    console.log('isPlug:', this.hasPlugin);
    if (this.hasPlugin) {
      this.$nextTick(function() {
        if (this.url !== '') {
          this.play = true;
          this.$refs.plugDiv.getPluginVersion();
          this.$refs.plugDiv.play(1, this.url);
        }
      });
    }
  },
  methods: {
    showEventMsg(data){
      this.$message({
         message: `上报成功！`,
          type: "success"
      })
    },

    /**
     * 关闭上报违法弹窗
     */
    closeUnlawReport() {
      this.formData = Object.assign({}, this.defFormData);
      this.showCheckBox = false;
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
    volumeNo() {
      this.volume = 0;
    },
    dialogClose() {
      this.$emit('close', false);
      this.showCheckBox = false;
      // this.$refs.plugDiv.stop(1);
    },
    volumChange(val) {
      console.log(val);
      this.$refs.plugDiv.setVolume(1, val);
    },
    /**
     * 播放
     */
    togglePlay() {
      if (this.play) {
        this.$refs.plugDiv.stop(1);
        console.log('停止');
        this.play = false;
      } else {
        this.play = true;
        console.log('播放');

        this.$refs.plugDiv.play(1, this.url);
      }
    },
    /**截图 */
    snap() {
      let path = `c:\\照片抓拍\\${this.title}${moment().format(
        'YYYYMMDDHHmm'
      )}.jpg`;
      this.$refs.plugDiv.snap(1, path);
      this.$message({
        message: `抓拍照片已保存为${path}`,
        type: 'success'
      });
    },
    /**
     *视频下载
     * @param Number type  类型
     */
    dowmload(type) {
      let path = `c:\\视频下载\\${this.title}${moment().format(
        'YYYYMMDDHHmm'
      )}.ts`;
      //全局关闭
      if (type === 1) {
        this.$refs.plugDiv.stopRecord(1);
      } else {
        //取消下载
        if (this.isDownload) {
          this.isDownload = false;
          this.$refs.plugDiv.stopRecord(1);
          this.$message({
            message: `视频已保存为${path}`,
            type: 'success'
          });
        } else {
          //下载
          this.isDownload = true;
          this.$refs.plugDiv.record(1, path);
        }
      }
    }
  }
};
</script>
 
<style lang="scss" >
.base-video {
  // position: relative;
  .video-event {
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    z-index: 9999;
  }
  .base-video-dialog {
    .el-dialog__body {
      padding: 5px 20px;
    }
    .video-main {
      width: 100%;
      height: 400px;
      box-sizing: border-box;
      background: url(../../assets/images/logo-LC.png) no-repeat center center;
    }
    .video-tool {
      font-size: 20px;
      display: flex;
      text-align: center;
      padding-left: 30%;
      // height: 50px;
      .tool-item {
        padding: 5px;
        // flex: 1;
        .el-slider__runway {
          margin: 9px 0;
        }
        &:hover {
          cursor: pointer;
        }

        .item-red {
          color: red;
        }
      }

      .tool-down {
        margin-left: 100px;
        font-size: 14px;
        color: red;
      }
    }
  }


}
</style>