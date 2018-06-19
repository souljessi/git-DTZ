<template>
  <div class="test">
    <div>
      <button @click='queuePauseDo()'>queuePauseDo</button>
    </div>
    <div>
      <button @click='clickCall()'>clickCall</button>
    </div>
    <div>
      <button @click='pbxAMIFeedBackJson()'>pbxAMIFeedBackJson</button>
    </div>
    <div>
      <button @click='setHuzhuanInfo()'>setHuzhuanInfo</button>
    </div>
    <div>
      <button @click='callTransfer()'>callTransfer</button>
    </div>
    <div>
      <button @click='login()'>login</button>
    </div>
    <div>
      <button @click='cdrData()'>cdrData</button>
    </div>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        ip: 'http://39.129.35.72:4015'
      }
    },
    methods: {
      async queuePauseDo() {
        console.log(this);
        const result = await this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=queuePauseDo`, {
          exten: 8001,
          type: 'unpause',
          queue_id: 1
        }, {isInternet: true});
        console.log(result, 'queuePauseDo');
      },
      clickCall() {
        this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=clickCall`, {params: data})
      },
      pbxAMIFeedBackJson() {
        this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=pbxAMIFeedBackJson`, {params: data})
      },
      setHuzhuanInfo() {
        this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=setHuzhuanInfo`, {params: data})
      },
      callTransfer() {
        this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=callTransfer`, {params: data})
      },
      login() {
        this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=login`, {params: data})
      },
      cdrData() {
        this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=cdrData`, {params: data})
      }

    }
  }
</script>
<style lang="scss" scoped>
</style>
