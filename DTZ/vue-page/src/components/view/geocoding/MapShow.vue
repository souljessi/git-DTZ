<template>
    <div class="map-show">
        <base-map :height='height' :key="date"></base-map>
    </div>
</template>


<script>
import BaseMap from "common/BaseMap.vue";
export default {
  data() {
    return {
      height: 640,
      date: Date.now()
    };
  },
  components: {
    BaseMap
  }
};
</script>


<style lang="scss">
.map-show {
}
</style>
