<template>
  <div class="base-wavesurfer">
    <div ref="waveform"></div>
    <div class="wave-info">
      总时长：
      <span class="wave-blue">{{Duration |TimeFormatToAudio}}</span> 进度:
      <span class="wave-blue">{{CurrentTime |TimeFormatToAudio}}</span> 号码：
      <span class="wave-blue">{{phone}}</span>
    </div>
    <div class="wave-info" style="margin-top:10px">
      <el-button type="primary" @click="playPause">
        <base-icon style="font-size:18px" :icon="isPlay?'zanting':'bofang2'" />
      </el-button>
      <el-button type="primary" @click='setSkip(-5)'>
        <base-icon style="font-size:18px" icon='kuaitui' />
      </el-button>

      <el-button type="primary" @click='setSkip(5)'>
        <base-icon style="font-size:18px" icon='kuaijin' />
      </el-button>
      <el-button type="primary" @click="isVlon">
        <base-icon style="font-size:18px" icon='shengyin' />

      </el-button>
      <span class="wav-wiino" v-show="vlonShow">
        <div class="wav-vlon">
          <span>
            <el-slider height="100px" vertical @change="setVolume" :min="0" :step='0.1' :max="1" v-model='Volume'></el-slider>
          </span>
        </div>
      </span>
      <el-button type="primary" @click="dow">
        <!-- <a style="color:#fff " title='下载' :href="src " download> -->
        <base-icon style="font-size:18px " icon='xiazai' />
        <!-- </a> -->
      </el-button>

    </div>
  </div>
</template>


<script>
import WaveSurfer from "wavesurfer.js";
export default {
  name: "baseWavesurfer",
  props: {
    src: {
      type: String,
      default:
        "http://39.129.35.72:4015/smartcrm_2018/App/recording.php?str=http://localhost:8088/home/2018/05/02/20180502-152852-18387420128-901-1525246132.666.mp3_file_name_20180502-152852-18387420128-901-1525246132.666.mp3"
    },
    phone: {
      type: Number,
      default: 0
    },
    uniqueid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      callServer:
        process.env.NODE_ENV === "production"
          ? "http://172.16.11.23:8088"
          : "http://39.129.35.72:4015",
      vlonShow: false,
      wavesurfer: null,
      Duration: "00:00", //总时间
      CurrentTime: "00:00", //当前播放进度
      Volume: 0.6 //音量
    };
  },
  mounted() {
    const wavesurfer = WaveSurfer.create({
      container: this.$refs.waveform,
      waveColor: "purple",
      height: 50,
      progressColor: "#ccc"
    });
    this.wavesurfer = wavesurfer;
    wavesurfer.load(this.src);
    console.log("mount");
    // wavesurfer.init();
    wavesurfer.setVolume(0.6);
    wavesurfer.on("ready", () => {
      wavesurfer.play();
    });
    wavesurfer.on("audioprocess", () => {
      console.log("audioprocess");
      this.getDurOrCurrent();
    });
  },
  watch: {
    src: {
      handler: function(val) {
        console.log("watch");
        if (this.wavesurfer) {
          this.wavesurfer.unAll();
          this.wavesurfer.load(this.src);
          console.log(222);
          this.wavesurfer.on("ready", () => {
            this.wavesurfer.play();
            // wavesurfer.play();
          });
          this.wavesurfer.on("audioprocess", () => {
            console.log("audioprocess");
            this.getDurOrCurrent();
          });
          // this.getDurOrCurrent();
        }
      },
      immediate: true
    }
  },
  methods: {
    download() {
      window.location.href =
        "http://blueface.org:8080/smartcrm_2018/Public/mp3/demo-recording1.mp3";
    },
    getDurOrCurrent() {
      if (this.wavesurfer) {
        this.Duration = this.wavesurfer.getDuration();
        this.CurrentTime = this.wavesurfer.getCurrentTime();
      }
    },
    rest() {
      this.Duration = "00:00"; //总时间
      this.CurrentTime = "00:00"; //当前播放进度
    },
    isVlon() {
      this.vlonShow = this.vlonShow ? false : true;
    },
    setVolume(val) {
      this.wavesurfer.setVolume(val);
    },
    async dow() {
      window.location.href = `${
        this.callServer
      }/smartcrm_2018/index.php?m=api&a=downloadRecording&uniqueid=${
        this.uniqueid
      }`;
    },
    async dowland() {
      window.open(
        "http://39.129.35.72:4015/smartcrm_2018/App/recording.php?str=http://localhost:8088/home/2018/05/02/20180502-152852-18387420128-901-1525246132.666.mp3_file_name_20180502-152852-18387420128-901-1525246132.666.mp3"
      );
      // return await this.$http.get(
      //   "http://blueface.org:8080/smartcrm_2018/Public/mp3/demo-recording1.mp3",
      //   {
      //     isInternet: true
      //   }
      // );
    },
    playPause() {
      if (this.wavesurfer) {
        this.wavesurfer.playPause();
      }
    },
    pause() {
      if (this.wavesurfer) {
        this.wavesurfer.pause();
      }
    },
    setSkip(value) {
      if (this.wavesurfer) {
        this.wavesurfer.skip(value);
      }
    }
  },
  computed: {
    isPlay() {
      if (this.wavesurfer) {
        return this.wavesurfer.isPlaying();
      }
      return false;
    }
  },
  filters: {
    TimeFormatToAudio: function(input) {
      if (!input) {
        return "00:00";
      }

      var minutes = Math.floor(input / 60) | 0;
      var seconds = (Math.ceil(input) % 60) | 0;

      return (
        (minutes < 10 ? "0" : "") +
        minutes +
        ":" +
        (seconds < 10 ? "0" : "") +
        seconds
      );
    }
  }
};
</script>

<style lang="scss">
.base-wavesurfer {
  .wave-info {
    text-align: center;

    .wave-blue {
      color: #4476a7;
    }
    .wav-wiino {
      position: relative;
      .wav-vlon {
        position: absolute;
        bottom: 29px;
        height: 100px;
        z-index: 100;
        left: -45px;
      }
    }
  }
}
</style>
