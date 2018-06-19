<template>
  <el-form ref="form" :inline="true" :model="form" label-width="120px">
    <el-form-item :label="miData.label">
      <el-checkbox-group v-model="miData.value">
        <el-checkbox :disabled='miData.readonly' v-for="(item,index) in miData.options" :key="index" :label="item.key">{{item.value}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: ["miData"],
  data() {
    return {
      form: {}
    };
  },
  created() {
    console.log(this.miData);
  }
};
</script>

