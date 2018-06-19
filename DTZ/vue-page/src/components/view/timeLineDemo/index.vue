<template>
  <div style="padding:20px 40px">
    <el-row>
      <el-col :span="12">
        <div>
          <h3>时间轴组件使用案列</h3>
          <div>
            导入：{{imp}}
          </div>
          <div>
            使用：
            <div style="margin-left: 10px">
              <p>{{n1}}</p>
              <p style="margin-left: 15px">{{n2}}</p>
              <p style="margin-left: 15px">{{n3}}</p>
              <p>{{n4}}</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">

        <div>
          <base-time-line>
            <base-time-line-item color='green'>
              <div @click="click">时间1</div>
              <div v-show="show">
                文本显示内容
              </div>
            </base-time-line-item>
            <base-time-line-item>
              <div @click="click">时间1</div>
              <div v-show="show">
                文本显示内容
              </div>
            </base-time-line-item>
            <base-time-line-item color="red">
              <base-icon icon="menu" slot="dot" /> 时间2
            </base-time-line-item>
            <base-time-line-item >
              时间3
            </base-time-line-item>
            <base-time-line-item color="red">
              <base-icon icon="map" slot="dot" /> 时间4
            </base-time-line-item>
          </base-time-line>
        </div>
      </el-col>
    </el-row>
    <div>
      <h3>api</h3>
      <p>color:自定义颜色值</p>
      <h3>slot</h3>
      <p>dot:左侧时间轴连接节点内容自定义</p>
    </div>

  </div>
</template>

<script>
  import BaseTimeLine from "common/BaseTimeLine/BaseTimeLine.vue";
  import BaseTimeLineItem from "common/BaseTimeLine/BaseTimeLineItem.vue";
  export default {
    data() {
      return {
        show: true,
        imp: `components: {
      BaseTimeLine,
      BaseTimeLineItem
    }`,
        n1: '<base-time-line>',
        n2: ' <base-time-line-item>',
        n3: ' </base-time-line-item>',
        n4: '</base-time-line>'
      };
    },
    methods: {


      click() {
        this.show = this.show == true ? false : true;
      }
    },
    components: {
      BaseTimeLine,
      BaseTimeLineItem
    }
  };

</script>


<style lang="scss">


</style>
