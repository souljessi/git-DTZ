<template>
	<div class="video-index" :style="{height:videoHeight}">
    <video-system :videoSysHeight="videoHeight" @changeFullScreen="changeFullScreen"></video-system>
    <router-view></router-view>
	</div>

</template>

<script>
import VideoSystem from './VideoSystem';
export default {
  data() {
    return {
      videoHeight:`calc(100vh - 50px)`
    };
  },
  created: function() {},
  mounted: function() {
    
  },
  components: {VideoSystem},
  computed: {},
  watch: {
    
  },
  methods: {
    changeFullScreen(data){//子组件切换全屏显示
      if(data.setFullScreen){//全屏
        this.$store.dispatch("setFullScreen", true);
        this.videoHeight = `100vh`;
      }else{//退出全屏
        this.$store.dispatch("setFullScreen", false);
        this.videoHeight = `calc(100vh - 50px)`;
      }
    }
  }
};
</script>


<style lang="scss">
.video-index {
  position: relative;
  overflow:hidden;
}
</style>
