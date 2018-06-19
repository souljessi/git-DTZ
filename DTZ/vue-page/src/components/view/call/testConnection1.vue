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
    	async clickCall() {
        	// this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=clickCall`, {params: data})
			const res = await this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=clickCall`, {
				exten:8001,
				phone:18920121218
			},{isInternet: true});
			console.log(res, 'clickCall');
			

		},
		async pbxAMIFeedBackJson() {
			// this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=pbxAMIFeedBackJson`, {params: data})
			const res = await this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=pbxAMIFeedBackJson`, 
			{exten:8001},{isInternet: true});
			console.log(res,'pbxAMIFeedBackJson');
		},
		async setHuzhuanInfo() {
			// this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=setHuzhuanInfo`, {params: data})
			const res = await this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=setHuzhuanInfo`, 
			{exten:8001,type:'CF'},{isInternet: true});
			console.log(res,'setHuzhuanInfo');

		},
		async callTransfer() {
			// this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=callTransfer`, {params: data})
			const res = await this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=callTransfer`, 
			{exten:'8001',type:'exten',to_num:'8008'},{isInternet: true});
			console.log(res,'callTransfer');

		},
		async login() {
			// this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=login`, {params: data})
			const res = await this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=login`, 
			{account:'0102',name:'name',exten:8001},{isInternet: true});
			console.log(res,'login');

		},
		async cdrData() {//不传参查所有
			// this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=cdrData`, {params: data})
			const res = await this.$http.post(`${this.ip}/smartcrm_2018/index.php?m=api&a=cdrData`, 
			{
				// startTime:'2018-02-01 08:00:00',
				// endTime:'2018-02-01 23:00:00',
				// phone_num:8001,
				// billsec:30//秒
			},{isInternet: true});
			console.log(res,'cdrData');

		}

    }
}
</script>
<style lang="scss" scoped>
</style>
