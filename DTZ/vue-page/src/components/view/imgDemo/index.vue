<template>
  <div style="padding:20px;">
      <h3>基础图片组件使用:</h3>
      <p>1:import BaseImg from "common/BaseImg";</p>
       <p>2:components:{BaseImg}</p>
      <p>3:{{text}}</p>
      <div style="margin-top:50px; ">
          <div style="float:left;width:200px;height:200px;">
              <base-img  :src='url'/>
          </div>
      </div>
  </div>
</template>

<script>
import BaseImg from "common/BaseImg";
export default {
  data() {
    return {
      text: '<base-img :src="xxx"/>',
      url:'http://120.77.64.189:8088/static/upload/images/1512634538727fbab2195.jpg'
    };
  },
  components: {
     BaseImg 
  }
};
</script>

