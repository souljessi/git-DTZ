<template>
  <div>
<div>{{msg}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "hello world Vue!"
    };
  },
  created() {
    this.msg = "hello created";
  },
  mounted() {
    // this.getPartsdata();
    let arr = [];
    for (let index = 1; index <= 15; index++) {
      arr.push(index);
    }
    console.log(arr);
    console.time();
    let promes = arr.map(async item => {
     let p=await this.getData(item);
     return p
    });
     Promise.all(promes).then((result)=>{
        console.timeEnd();
      console.log(result);})
  },

     
  methods: {
    async getPartsdata() {
      const res = await this.$http.get("/cms/PartsController/queryPartCount");
      let count = 0;
      if (res.data.success) {
        count = Math.ceil(res.data.result / 1000);
        let countdata = [];
        for (let i = 1; i <= count; i++) {
          let cc = await this.getData(i);
          countdata = [...countdata, ...cc];
        }
        console.log("countdata:", countdata);
      }
    },
    /**
     * 获取部件数据
     */
    async getData(num) {
      const _self = this;
      //this.loading = true;
      try {
        const Res = await this.$http.get(
          "/cms/PartsController/queryPartsAndGroupInfo",
          {
            params: {
              page: num,
              pageSize: 1000
            }
          }
        );
        const data = Res.data;
        if (data.success) {
          // _self.partsData = data.result;/
          return data.result;
          // _self.$store.dispatch("setPartsdata", _self.partsData);
          // _self.$setStore("cacheParts", this.partsData);
        } else {
          _self.$message.error(data.msg);
          return [];
        }
        // this.loading = false;
      } catch (error) {
        console.log(error); // _self.$notify.error({
        //   title: "接口请求失败",
        //   message: error
        // });
        // this.loading = false;
      }
    }
  }
};
</script>



<style lang="scss">

</style>

