<template>
  <el-breadcrumb v-show="isBreadcrumb"  class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" :to="item.redirect||item.path">
       {{item.name}}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb();
    this.isBreadcrumb = this.$route.meta.isBreadcrumb;
  },
  data() {
    return {
      isBreadcrumb: true,
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
      this.isBreadcrumb = this.$route.meta.isBreadcrumb;
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched;
      let list = [];
      matched.map((item, index) => {
        list[index] = {
          path: item.path,
          name: index == 0 ? "首页" : item.name
        };
      });

      this.levelList = list;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
.app-breadcrumb {
  margin: 10px 0px;
  .el-breadcrumb__separator {
    margin: 0 6px !important;
  }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
