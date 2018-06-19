<template>
  <el-form ref="form" :inline="true" :model="form" label-width="120px">
    <el-form-item :label="miData.label">
      <el-input style="width:370px;" type="textarea" :rows="miData.rows" v-model="miData.value" :placeholder="miData.placeholder"></el-input>
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
  }
};
</script>