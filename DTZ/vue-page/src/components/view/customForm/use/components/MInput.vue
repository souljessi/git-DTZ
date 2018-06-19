<template>
  <el-form ref="form" :rules='rules' :inline="true" :model="form" label-width="120px">
    <el-form-item :label="miData.label" :required='miData.required' prop='input'>
      <el-input :readonly='miData.readonly' :maxlength='miData.maxlength' :minLength='miData.minLength' v-model="miData.value" :placeholder="miData.placeholder"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "m-input",
  props: ["miData"],
  data() {
    return {
      form: {},
      rules: {
        input: [{ required: true, message: "请输入信息", trigger: "blur" }]
      }
    };
  },
  created() {
    console.log(this.miData);
  }
};
</script>

