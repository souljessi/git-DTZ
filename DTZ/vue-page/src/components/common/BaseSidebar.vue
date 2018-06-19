<template>
  <!-- <div v-show="menuList.length>0" :class="['sidebar-content',menuList.length>0?'':'']"> -->
  <div :class="['sidebar-content',menuList.length>0?'':'sidebar-content-hide']" :style="themeBg">
    <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :default-active="defaultIndex" @select="selectIndex" router unique-opened :backgroundColor="theme" text-color="#FFF" active-text-color="#ffd04b">
      <!-- <div v-for="(item,index) in menuList" :key="item.id"> -->
      <el-submenu v-for="(item,index) in menuList" :key="item.id" v-if="setChildren(item)" :index="setIndex(index)">
        <template slot="title">
          <base-icon :class="['sidebar-icon',isCollapse?'sidebar-icon-chang':'']" :icon="item.menu_icon" />
          <span>{{item.menu_name}}</span>
        </template>
        <el-menu-item v-for="(item2,index2) in setsetChildrenInfo(item.children)" :key="item2.id" :index="item2.menu_url">
          {{item2.menu_name}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :index="item.menu_url">
        <base-icon :class="['sidebar-icon',isCollapse?'sidebar-icon-chang':'']" :icon="item.menu_icon" />
        <span slot="title">{{item.menu_name}}</span>
      </el-menu-item>
      <!-- </div> -->

    </el-menu>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
export default {
  data: function() {
    return {
      // isCollapse: false,
      defaultIndex: "",
      menuData: []
    };
  },
  mounted() {
    let verIndex = this.$getStore("verIndex");
    if (verIndex != null) {
      this.$nextTick(function() {
        console.log("设置index选中", verIndex);
        this.defaultIndex = verIndex;
      });
    }
  },
  methods: {
    /**
     * 设置菜单显示状态 （过滤案件权限菜单数据）
     */
    setChildren(data) {
      if (data.children) {
        let newdata = data.children.filter(item => {
          return item.is_button == 0;
        });
        if (newdata.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    /**
     * 设置子菜单显示信息，过滤按钮菜单数据
     */
    setsetChildrenInfo(data) {
      return data.filter(item => {
        return item.is_button == 0;
      });
    },
    /**
     * 设置激活状态
     */
    setIndex(index) {
      return index.toString();
    },
    selectIndex(index, indexPath) {
      // let obj={
      //   horIndex:this.$getStore('horIndex'),
      //   verIndex:index
      // }
      // console.log(obj);
      this.$setStore("verIndex", index); // 保存横向导航选择菜单项
    }
  },
  watch: {
    compIndex(val) {
      this.defaultIndex = val;
    },
    menuList(val) {
      let verIndex = this.$getStore("verIndex");
      console.log("设置indexwatch", verIndex);      //设置选中按钮
      this.defaultIndex = verIndex;
    }
  },
  computed: {
    compIndex() {
      return this.$store.getters.getVerDefaultIndex;
    },
    isCollapse() {
      return this.$store.getters.getisCollapse;
    },
    menuList() {
      return this.$store.getters.getVerMenuMap;
    },
    theme() {
      return this.$store.getters.getTheme;
    },
    themeBg() {
      return {
        backgroundColor: this.theme
      };
    },
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    navMenuList() {
      return this.$store.getters.getnavList;
    },
    navType() {
      return this.$store.getters.getNavType;
    }
  }
};
</script>



<style lang="scss">
.sidebar-content {
  border-right: solid 1px #e6e6e6;
  transition: all 0.3s;
  opacity: 0.86;
  /* height: 100vh; */
  // background-color: #0e0e10;
  .sidebar-icon {
    font-size: 18px;
    margin: 0 10px 0 10px;
    transition: all 0.4s;
  }
  .sidebar-icon-chang {
    font-size: 23px;
    margin: 0 10px 0 0px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
  .el-menu {
    border-right: 0px !important;
  }
  .el-menu-item {
    &:hover {
      // background: #2c2c2e !important
    }
  }
}
.sidebar-content-hide {
  width: 0px;
}
</style>
