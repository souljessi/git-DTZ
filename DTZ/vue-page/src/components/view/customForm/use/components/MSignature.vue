<template>
  <el-form class="form-singnature" ref="form" :inline="true" :model="form" label-width="120px">
    <el-form-item :label="miData.label">
      <div class="s-ss">
        <div class="s-head">
          <div class="item1">{{miData.placeholder}}</div>
          <div class="item2">清除</div>
        </div>
        <el-input type="textarea" :autosize="auto" placeholder="请输入签名" v-model="miData.value"> </el-input>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: ["miData"],
  data() {
    return {
      form: {},
      auto: { minRows: 4, maxRows: 4 }
    };
  },
  created() {
    console.log(this.miData);
  }
};
</script>

<style lang="scss">
.form-singnature {
  .s-ss {
    width: 370px;
    border: 1px solid #dcdfe6;
    // height: 150px;
    margin-top: 5px;
    padding: 0px;
    border-radius: 4px;
    color: #606266;
    .s-head {
      display: flex;
      padding: 0 5px;
      font-size: 13px;
      background-color: #e4e4e4;
      border-bottom: 1px dotted #ccc;
      .item1 {
        flex: 1;
        text-align: left;
      }
      .item2 {
        flex: 1;
        // margin-right: 5px;
        color: rgb(64, 158, 255);
        text-align: right;
      }
    }
  }
}
</style>
