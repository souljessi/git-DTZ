<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" label-width="120px">
      <el-form-item :label="miData.label">
        <el-date-picker v-if="miData.dateType==='datepick'" v-model="miData.value" :placeholder="miData.placeholder"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
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