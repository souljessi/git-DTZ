<template>
  <div :title="text" :class="type=='one'?'text-oneline':'text-multiLine'"
  :style="type=='one'?oneLineStyle:multiLineStyle">
      {{text}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      oneLineStyle: {
        //单行
      },
      multiLineStyle: {
        //多行
        height: this.height + "px",
        lineHeight: this.height / this.hcloumn + "px",
        "-webkit-line-clamp": this.hcloumn
      }
    };
  },
  props: {
    type: {
      type: String,
      default: "one" //类型 默认’one‘ 单行 ， ’multi‘ 多行
    },
    text: {
      type: String,
      default: ""
    },
    // width: {
    //   type: Number,
    //   default: 200
    // },
    height: {
      type: Number,
      default: 50
    },
    hcloumn: {
      type: Number,
      default: 2
    }
  }
};
</script>

<style lang="scss" scoped>
.text-oneline {
  //   border: 1px solid #000000;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.text-multiLine {
  margin: 0 auto;
  overflow: hidden;
  //   border: 1px solid #ccc;
  text-overflow: ellipsis;
  //   padding: 0 10px;
  display: -webkit-box;
  //   -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
