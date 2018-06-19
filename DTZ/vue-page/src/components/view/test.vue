<template>
  <div>
    <div><button @click="click">测试按钮</button></div>
  </div>


</template>

<script>
  export default {
    methods: {
      click() {

        // in my case I change the header
        // this.$socket.io.opts.transportOptions.polling.extraHeaders.Authorization = 'token';
        this.$socket.open()
      }
    }
  }
</script>

<style scoped>

</style>
