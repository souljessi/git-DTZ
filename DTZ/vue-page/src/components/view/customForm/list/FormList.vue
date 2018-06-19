<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="formInline">
      <el-form-item label="模板名称">
        <el-input v-model="searchForm.template_name" placeholder="请输入模板名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="resetForm()">
          重置</el-button>

      </el-form-item>
    </el-form>
    <div class="t-main-table">
      <div class="t-main-table-item t-main-table-dashboard-item" @click='creatForm()' @mouseenter='firstMouseover' @mouseleave='firstMouseleave'>
        <base-icon v-show="!firstShow" style="font-size:40px;color:rgb(154, 154, 154)" icon="count" />
        <div v-show="firstShow" style="color:#409EFF">
          <base-icon icon="jilu" />
          <span>创建表单</span>
        </div>
      </div>
      <div class="t-main-table-item" v-for="(item,index) in cusFormData" :key="index" @click="editForm(item)" @mouseenter='ohterMouseover(item)' @mouseleave='otherMouseleave(item)'>
        <div class="name">
          <base-text-overflow :text="item.template_name" />
        </div>
        <div :class="['img',item.show?'img-top':'']">
          <img v-lazy="'http://'+ServerimageUrl+item.icon_path">
        </div>
        <transition name="toole">
          <div class="buttom" v-show="item.show">
            <div class="buttom-item item1" @click.stop="editForm(item)">编辑</div>
            <div class="buttom-item item2" @click.stop="deletForm(item)">删除</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTextOverflow from "common/BaseTextOverflow";
export default {
  data() {
    return {
      firstShow: false,
      ServerimageUrl: "", //后台地址 ,
      cusFormData: [],
      searchForm: {
        template_name: ""
      },
      formType: 1
    };
  },
  props: {
    type: {
      // 表单类型
      type: String,
      required: true
    }
  },
  components: {
    BaseTextOverflow
  },
  created() {
    this.ServerimageUrl = this.$webconfig.serverIp;
    this.getCusFormInfo();
  },
  methods: {
    /**
     * 重置查询条件
     */
    resetForm() {
      this.searchForm.template_name = "";
      this.getCusFormInfo();
    },

    /**
     * 查询表单信息
     */
    onSearch() {
      this.getCusFormInfo(this.searchForm.template_name);
    },
    /**
     * 查询表单信息
     */
    deletForm(data) {
      const _vm = this;
      let params = {
        id: data.id
      };
      this.$confirm("此操作将删除模板,是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await _vm.$http.post(
              "/oa/CustFormController/delCusFormById",
              params
            );
            if (res.data && res.data.success) {
              _vm.$message.success("操作成功");
              _vm.getCusFormInfo();
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error("请求错误");
          }
        })
        .catch(e => {});
    },
    /**
     *@description 列表中数据视图的鼠标移入事件
     */
    ohterMouseover(data) {
      data.show = true;
    },
    /**
     *@description 列表中数据视图的鼠标移出事件
     */
    otherMouseleave(data) {
      data.show = false;
    },
    /**
     *@description 新增表单视图的鼠标移入事件
     */
    firstMouseover() {
      this.firstShow = true;
    },
    /**
     *@description 新增表单视图的鼠标移出事件
     */
    firstMouseleave() {
      this.firstShow = false;
    },
    /**
     * @description 获取自定义表单数据
     * @param {String} name 表单名称
     */
    async getCusFormInfo(name) {
      let template_name = name || "";
      const Res = await this.$http.get(
        "/oa/CustFormController/getCusFormInfoByAll",
        {
          params: { form_type: this.setChange(), template_name: template_name }
        }
      );
      console.log(Res);
      if (Res && Res.data && Res.data.success) {
        this.cusFormData = Res.data.result.map(item => {
          item.show = false;
          return item;
        });
      }
    },

    /**
     * @description 判断当前是app模式还是web模式
     */
    setChange() {
      return this.type == "app" ? 1 : 2;
    },
    /**
     *@description 创建表单
     */
    creatForm() {
      let value = this.setChange();
      switch (value) {
        case 1:
          this.$router.push("addapp");
          break;
        case 2:
          this.$router.push("addweb");
          break;

        default:
          break;
      }
    },
    /**
     * @description 编辑表单
     */
    editForm(data) {
      let value = this.setChange();
      switch (value) {
        case 1:
          this.$router.push({ path: "addapp", query: data });
          break;
        case 2:
          this.$router.push({ path: "addweb", query: data });
          break;

        default:
          break;
      }
    }
  }
};
</script>



<style lang="scss">
.t-main-table {
  overflow: hidden;
  position: relative;
  padding-top: 10px;
  // background-color: black;
  .t-main-table-item {
    width: 140px;
    background: rgba(208, 208, 208, 0.21);
    height: 180px;
    border: 1px solid #c3c9d0;
    border-radius: 10px;
    float: left;
    position: relative;
    margin: 0 15px 40px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    -moz-box-shadow: 2px 2px 20px rgba(76, 76, 76, 0.41);
    -webkit-box-shadow: 2px 2px 20px rgba(76, 76, 76, 0.41);
    box-shadow: 2px 2px 20px rgba(76, 76, 76, 0.41);
    .name {
      font-size: 20px;
      color: #6f6f6f;
      margin: 13px 10px 10px;
      text-align: center;
      font-weight: 600;
    }
    .img {
      position: absolute;
      top: 60px;
      left: 28px;
      text-align: center;
      transition: all 0.4s;
      font-size: 38px;
      // border-radius: 50px;
      img {
        border-radius: 10px;
        width: 85px;
        height: 85px;
      }
    }
    .img-top {
      top: 50px;
    }
    .buttom {
      // height: 30px;
      // background: cadetblue;
      // padding: 10px;
      color: #fff;
      position: absolute;
      // right: 0px;
      bottom: 0px;
      text-align: center;
      justify-content: center;
      align-items: center;
      display: flex;
      width: 100%;

      // &:hover {
      //   color: #409eff;
      // }
      .buttom-item {
        height: 35px;
        line-height: 35px;
        flex: 1;
      }
      .item1 {
        background: #409eff;
        // border-bottom-left-radius: 10px;
        &:hover {
          background: #66b1ff;
        }
      }
      .item2 {
        // border-bottom-right-radius: 10px;
        background: #f56c6c;
        &:hover {
          background: #f78989;
        }
      }
    }

    // &:hover {
    //   transform: scale(1.04);
    // }
  }
  .t-main-table-dashboard-item {
    background: #fff;
    border: 2px solid #c3c9d0;
    margin: 0 12px 30px;
    cursor: pointer;
    border-style: dashed;
    display: inline-block;
    padding: 0;
    width: 140px;
    height: 180px;
    line-height: 180px;
    text-align: center;
    vertical-align: middle;
  }
}
.toole-enter-active {
  transform-origin: 0 100%;
  animation: noticScaleIn 0.4s 0s 1 both;
}
.toole-leave-active {
  transform-origin: 0 100%;
  animation: noticScaleOut 0.3s 0s 1 both;
}
@keyframes noticScaleIn {
  0% {
    opacity: 0;
    width: 0px;
    // -webkit-transform: scale(0.2);
    // transform: scale(0.2);
  }
  100% {
    opacity: 1;
    width: 100%;
    // -webkit-transform: scale(1);
    // transform: scale(1);
  }
}
@keyframes noticScaleOut {
  from {
    opacity: 1;
    width: 100%;
    // -webkit-transform: scale(1);
    // transform: scale(1);
  }
  to {
    opacity: 0;
    width: 0px;
    // -webkit-transform: scale(0);
    // transform: scale(0);
  }
}
</style>

