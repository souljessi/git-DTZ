<template>
  <el-form ref="form" :inline="true" :model="form" label-width="120px">
    <el-form-item :label="miData.label" :required='miData.required'>
      <el-input :readonly='miData.readonly' v-model="miData.value" :placeholder="miData.placeholder"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "m-search",
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

