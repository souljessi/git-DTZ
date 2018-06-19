<template>
  <el-form ref="form" :inline="true" :model="form" label-width="120px">
    <el-form-item :label="miData.label">
      <el-radio v-model="miData.value" v-for="(item,index) in miData.options" :key="index" :label="item.value"></el-radio>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "m-radio",
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

