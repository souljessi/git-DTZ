<template>
  <div class="deploy" style="overflow: hidden" >
    <el-tabs v-model="activeTabs" type="border-card" @tab-click="handleClick" class="t-card" >
      <el-tab-pane label="APP端" name='app' >
       <processList processType='app端' ref="app" type="app" style="height: 100%;overflow-y: scroll"></processList>
      </el-tab-pane>
      <el-tab-pane label="WEB端" name='web'>
        <processList processType='web端' ref="web" type="web"></processList>
      </el-tab-pane>
      <el-tab-pane label="系统内置" name='xt'>
        <processList processType='系统内置' ref="xt" type="xt"></processList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {dateFormat} from 'assets/js/date.js'
  import processList from './processList.vue'
  export default {
    data(){
      return {
        activeTabs: "app",
      }
    },
    created: function () {

    },
    mounted: function () {
     this.openScreen();
      this.$refs.app.processList(1);
    },
    components: {
      processList
    },
    computed: {},
    methods: {
      /**
       * 加载动画
       */
      openScreen() {//加载...
        this.loading = true;
        let self=this;
        setTimeout(() => {
          self.loading = false;
        }, 400);
      },
      /**
       *时间格式化
       */
      dateFormatFun(row, colum){
        if (row[colum.property] != null) {
          const d = row[colum.property];
          return dateFormat(new Date(d),"yyyy-MM-dd hh:mm:ss")
        }
      },
      handleClick(tab, event) {
        let tabs=this.activeTabs;
        if(tabs=='app'){
          this.$refs.app.processList(1);
        }else if(tabs=='web'){
          this.$refs.web.processList(2);
        }else{
          this.$refs.xt.processList(3);
        }
      }

    }
  }
</script>

<style lang="scss" >
  .deploy {
    .t-card {
      height: calc(100vh - 100px);
      .el-tabs--border-card  {
        overflow-y: visible


      }
    }
  }
  .deploy .el-tab-pane {
    height: calc(100vh - 150px);
  }

  .proclist .el-dialog__header {
    background: #0e0e0f;
    padding: 0;
    line-height: 40px
  }

  .proclist .el-dialog_header[data-v-aa43be52] {
    padding: 0;
    border-bottom: 1px dashed #ccc;
  }
</style>
