<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    console.log("app");
  }
};
</script>

<style lang="scss">
@import "assets/css/main.scss";
@import "assets/css/timeline.scss";
.el-notification__group {
  width: 100%;
}
.testNotif {
  width: 425px;
}

.tangram-suggestion-main {
  z-index: 9999;
}
</style>
