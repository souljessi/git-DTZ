<template>
    <transition name="move" mode="out-in">
        <div class="middle-box">
            <h1>404</h1>
            <h3>页面未找到！</h3>
            <p>抱歉，页面好像去火星了-</p>
          <el-button type="success" @click="goBack">返回首页</el-button>
        </div>
    </transition>
</template>
<script>
export default {
  methods: {
      goBack(){
          this.$router.push('/')
      }
  }
}
</script>


<style  scoped>
.middle-box {
    max-width: 400px;
    z-index: 100;
    margin: 0 auto;
    padding-top: 40px;
    text-align: center;
    color: #676a6c;
}

.middle-box h1 {
    font-size: 170px;
}
</style>
