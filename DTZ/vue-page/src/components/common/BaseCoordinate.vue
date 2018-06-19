<template>
  <div class="base-coordinate">
    <el-input :value="value" readonly placeholder="坐标">
      <div slot="append" @click=showMap>
        <base-icon class="icon" icon="map2" />
      </div>
    </el-input>

    <el-dialog top='6vh' append-to-body class="corrdinate-map" v-bind:title="formTitle" :visible.sync="dialog" :close-on-click-modal="false" v-on:close="closeDialog" width="80%">
      <base-map @ready="ready" :key="date"></base-map>
    </el-dialog>
  </div>
</template>


<script>
import BaseMap from "common/BaseMap.vue";
export default {
  props: {
    value: {
      default: ""
    }
  },
  components: {
    BaseMap
  },
  data() {
    return {
      map: "",
      date: Date.now(),
      dialog: false,
      formTitle: "坐标选择"
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.$nextTick(function() {
          let arr = this.value.split(",");
          console.log(arr);
          if (arr.length > 1) {
            let point = new BMap.Point(arr[0], arr[1]);
            console.log(222, point);
            this.map.clearOverlays();
            setTimeout(item => {
              this.map.addOverlay(new BMap.Marker(point));
              this.map.panTo(point, {
                noAnimation: false
              });
            }, 100);
          }
        });
      }
    }
  },
  methods: {
    showMap() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    ready({ BMap, map }) {
      this.map = map;
      console.log(1111);
      map.addEventListener("click", this.mapClick);
    },
    mapClick(elemtn) {
      //   console.log(elemtn);
      //   this.value = `${elemtn.point.lat},${elemtn.point.lng}`;
      this.dialog = false;
      this.map.clearOverlays();
      this.map.addOverlay(new BMap.Marker(elemtn.point));
      console.log(`${elemtn.point.lng},${elemtn.point.lat}`);
      this.$emit("input", `${elemtn.point.lng},${elemtn.point.lat}`);
    }
  }
};
</script>


<style lang="scss">
.base-coordinate {
  .el-input-group__append {
    // background-color: #3a8ee6;
    padding: 0 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .icon {
    color: #f56c6c;
    font-size: 20px;
  }
}
.corrdinate-map {
  .el-dialog__body {
    padding: 0 20px 30px 20px;
  }
}
</style>
