<template>
  <div class="base-baidusearch">
    <transition name="zoom-top">
      <div v-show="isDrop" class="select-drop drop-width">
        <BaseMap :zoom='zoom' :height='mapHeight' @ready='mapReady'></BaseMap>
      </div>
    </transition>
    <input :class="['input-neer','input-mini',disabled?'is-disabled':''] " :disabled='disabled' :value="value" @blur='setBlur' @focus='setDrop' id="suggestId" :placeholder="placeholder" />

  </div>
</template>


<script>
import BaseMap from "common/BaseMap";
export default {
  name: "base-baidusearch",
  props: {
    value: {
      default: ""
    },
    zoom: {
      //地图缩放比例
      type: Number,
      default: 15
    },
    mapHeight: {
      //地图组件高度
      type: Number,
      default: 300
    },
    placeholder: {
      //描述说明
      type: String,
      default: "请输入地址"
    },
    disabled: {
      //是否禁用
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: "",
      isDrop: false
    };
  },
  components: {
    BaseMap
  },
  methods: {
    setDrop() {
      this.isDrop = true;
    },
    setBlur() {
      this.isDrop = false;
    },
    mapReady({ BMap, map }) {
      this.map = map;
      this.setAutoComplete();
      map.addEventListener("click", e => {
        const point = e.point;
        var geo = new BMap.Geocoder();
        geo.getLocation(point, rs => {
          const add = rs.addressComponents;
          console.log(add);
          this.$emit(
            "input",
            add.city + add.district + add.street + add.streetNumber
          );
          this.$emit("getPoint", point);
          this.map.clearOverlays(); //清除地图上所有覆盖物
          this.map.centerAndZoom(point, 18);
          this.map.addOverlay(new BMap.Marker(point)); //添加标注
        });
      });
    },
    setAutoComplete() {
      const ac = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: this.map
      });
      ac.addEventListener("onconfirm", e => {
        //鼠标放在下拉列表上的事件
        const _value = e.item.value;
        const myValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        this.setPlace(myValue);
      });
    },
    setPlace(value) {
      this.map.clearOverlays(); //清除地图上所有覆盖物
      const vm = this;
      const myFun = () => {
        var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        vm.$emit("getPoint", pp);
        vm.$emit("input", value);
        vm.map.centerAndZoom(pp, 18);
        vm.map.addOverlay(new BMap.Marker(pp)); //添加标注
      };
      var local = new BMap.LocalSearch(this.map, {
        //智能搜索
        onSearchComplete: myFun
      });
      local.search(value);
    }
  },
  directives: {
    focus: {
      update: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  }
};
</script>


<style lang="scss">
.base-baidusearch {
  // position: relative;

  .input-neer {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 1;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }

  .input-mini {
    height: 28px;
    // width: 200px;
    font-size: 12px;
  }
  .is-disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  .select-drop {
    position: absolute;
    z-index: 999999;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    margin: 5px 0;
    &:after {
      content: " ";
      height: 0;
      width: 0;
      left: 9%;
      bottom: -19px;
      position: absolute;
      border: solid transparent;
      border-width: 8px;
      border-top-color: #fff;
    }
  }
  .drop-width {
    min-width: 550px;
    height: 300px;
    top: -316px;
    left: 0px;
  }

  .zoom-top-enter-active,
  .zoom-top-leave-active {
    opacity: 1;
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1),
      -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    -webkit-transform-origin: center bottom 0px;
    // transform-origin: center top;
    transform-origin: center bottom 0px;
  }

  .zoom-top-enter,
  .zoom-top-leave-active {
    opacity: 0;
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}
</style>
