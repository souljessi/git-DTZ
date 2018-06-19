<template>
  <div class="cus-use">
    <div class="cus-main">
      <div class="cus-main-title">
        <div class="title-img">
          <img :src="templateData.icon_path" />
        </div>
        <div class="title-name">
          {{templateData.template_name}}
        </div>
      </div>
      <div class="cus-main-form">
        <div v-for="(item,index) in formItems" :key="index">
          <component :is="item.type" :miData='item'></component>
        </div>
      </div>
      <div>
        <div class="cus-main-button">
          <el-button style="width:150px;" type="primary">提交</el-button>
        </div>
      </div>

    </div>
    <div></div>

  </div>
</template>


<script>
import mixin from "./mixin";
export default {
  mixins: [mixin],
  data() {
    return {
      templateId: "",
      templateData: [],
      formItems: []
    };
  },
  created() {
    console.log(222);
    const _vm = this;
    _vm.templateId =
      _vm.$route.query && _vm.$route.temId ? _vm.$route.temId : 13;
    _vm.getTemplateInfo();
  },
  mounted() {},
  methods: {
    async getTemplateInfo() {
      const _vm = this;
      const Res = await this.$http.post(
        "/oa/CustFormController/getCusFormInfoById",
        {
          id: _vm.templateId
        }
      );
      if (Res && Res.data.success) {
        _vm.templateData = Res.data.result;
        _vm.formItems = JSON.parse(Res.data.result.form_items);
      }
    }
  }
};
</script>

<style lang="scss">
.cus-use {
  position: relative;
  .cus-main {
    position: absolute;
    left: 15%;
    top: 50px;
    border: 1px solid rgb(234, 232, 232);
    // border-radius: 10px;
    // padding: 20px;
    width: 600px;
    background-color: rgba(208, 208, 208, 0.22);
    .cus-main-title {
      height: 70px;
      line-height: 70px;
      // background-color: rgb(255, 208, 75);
      background-color: rgb(228, 228, 228);

      // padding: 20px;
      font-size: 35px;
      color: #606266;
      // font-weight: 600;
      .title-img {
        float: left;
        height: 70px;
        // padding: 6px;
        img {
          // float: left;
          height: 70px;
          width: 70px;
        }
      }
      .title-name {
        margin-left: 5px;
        float: left;
      }
    }
    .cus-main-form {
      height: 500px;
      overflow-y: auto;
      margin: 20px;
    }
    .cus-main-button {
      width: 150px;
      padding: 15px 0;
      margin: 0 auto;
    }
  }
}
</style>

