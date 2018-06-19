<template>
    <div class="baseSelectIcon">
        <el-select :value="value" :name='name' :clearable='clearable' :placeholder="placeholder" :disabled='disabled' popper-class='select-icon' @change='selectChange'>
            <el-option v-for="(item,index) in iconsMap" :key="index" :value="item">
                <base-icon class="base-icon" :icon='item' />
            </el-option>
        </el-select>
        <span>
            <base-icon :icon='value'/>
        </span>
    </div>
</template>

<script>
import icons from "view/iconDemo/createIconMap";
export default {
  props: {
    value: {
      require: true,
      default: ""
    },
    placeholder: {
      default: ""
    },
    disabled: {
      default: false
    },
    clearable: {
      default: false
    },
    name: {
      default: ""
    }
  },
  data() {
    return {
      iconsMap: []
    };
  },
  mounted() {
    console.log(icons.state.iconsMap);
    const iconsMap = icons.state.iconsMap.map(i => {
      return i.default.id.split("-")[1];
    });
    this.iconsMap = iconsMap;
  },
  methods: {
    selectChange(val) {
      console.log(val);
      this.$emit("input", val);
    }
  }
};
</script>


<style lang="scss">
.baseSelectIcon {
    font-size: 20px;
}
.select-icon {
  width: 300px !important;
  .el-select-dropdown__item {
    float: left;
    font-size: 25px;
    padding: 0 12px;
  }

  .selected {
    background: #409eff;
    font-size: 22px;
    color: #fff;
  }
}
</style>
