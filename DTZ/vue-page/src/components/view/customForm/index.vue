<template>
  <div class="t-main">
    <!-- <el-button type="primary" @click="creatForm(1)">创建web端表单</el-button>
    <el-button type="primary" @click="creatForm(2)">创建app端表单</el-button> -->
    <el-tabs v-model="activeTabs" type="border-card" class="t-card">
      <el-tab-pane label="APP端" name='app'>
        <form-list type="app"></form-list>
      </el-tab-pane>
      <el-tab-pane label="WEB端" name='web'>
        <form-list type="web"></form-list>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
import FormList from "./list/FormList.vue";
export default {
  data() {
    return {
      activeTabs: "app"
    };
  },
  components: {
    FormList
  }
};
</script>



<style lang="scss" >
.t-main {
  .t-card {
    height: calc(100vh - 100px);
  }
}
</style>

