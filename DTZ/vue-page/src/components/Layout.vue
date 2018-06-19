<template>
  <el-container>
    <el-header height="50px" v-show="!fullScreen">
      <base-head></base-head>
    </el-header>
    <el-container style="height:100%;">
      <base-sidebar class="main-sidear" v-show="!fullScreen"></base-sidebar>
      <el-main :class="['main',menuList.length>0?'showpad':'hidpad']">
        <!-- <base-notic class="main-notic"></base-notic> -->
        <base-breadcrumb></base-breadcrumb>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import BaseHead from "common/BaseHead.vue";
import BaseSidebar from "common/BaseSidebar.vue";
import BaseBreadcrumb from "common/BaseBreadcrumb.vue";
import BaseNotic from "common/BaseNotic.vue";
import { delAllCookie } from "assets/js/commonManage";
export default {
  components: {
    BaseHead,
    BaseSidebar,
    BaseBreadcrumb,
    BaseNotic
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    menuList() {
      return this.$store.getters.getVerMenuMap;
    },
    fullScreen() {
      return this.$store.getters.getFullScreen;
    }
  },
  beforeDestroy() {
    // window.localStorage.clear();
    // delAllCookie();
    // this.$store.dispatch("restVuexStore");
  },
  created() {
    this._socketJoin();
  },
  methods: {
    _socketJoin() {
      //在登录成功以后发送socket请求到服务端，用于后续的握手认证
      this.$socket.emit("join", {
        userId: JSON.parse(this.$getStore("userData")).id
      });
    }
  }
};
</script>


<style lang="scss">
.el-header {
  padding: 0px !important;
}
.main-sidear {
  min-height: calc(100vh - 50px);
}
.main {
  position: relative;
  transition: all 0.4s;
background: #fff;
  .main-notic {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
.showpad {
  padding: 5px 20px !important;
}
.hidpad {
  padding: 0px !important;
}
.sidebar {
  display: block;
  background-color: #545c64;
  // min-height: calc(100vh - 50px);
}
.baiduWinfo {
  background: #fff;
  cursor:default;
  margin: 0px;
  padding: 0px;
  text-align: center;
  color: #4c4c4c;
  font-size: 14px;
  font-weight: 700;
  white-space: normal;
  box-sizing: border-box;
  box-shadow: 1px 2px 1px rgba(0,0,0,.15);
  &:after {
    content: " ";
    height: 0;
    width: 0;
    left: 47.5%;
    bottom: -4px;
    position: absolute;
    border: solid transparent;
    border-width: 6px;
    border-top-color: #fff;
    border-color: #fff #fff transparent transparent;
    transform: rotate(135deg);
    box-shadow: 2px -2px 2px #ccc;
  }
}
</style>
