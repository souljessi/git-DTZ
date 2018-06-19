<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
      <el-form-item label="菜单名称">
        <el-input v-model="formInline.menu_name" placeholder="菜单名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="resetForm('formInline')">
          重置</el-button>
        <el-button :disabled="setDis" type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="childDialog" v-bind:title="formTitle" :visible.sync="dialogEdit" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('ruleForm')">
      <el-form :model="ruleForm" :inline="true" :rules="this.$validateRule" ref="ruleForm" label-width="110px">
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="ruleForm.menu_name"></el-input>
        </el-form-item>
        <el-form-item label="菜单级别" prop="menu_level">
          <el-select v-model="ruleForm.menu_level" placeholder="菜单级别" @change="subChange" :disabled="levelShow">
            <el-option v-for="(item,index) in cdjb" :label="item.label" :value="parseInt(item.value)" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单" prop="selectedOptions" v-if="topShow">
          <el-cascader :options="topList" v-model="ruleForm.selectedOptions" @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parent_name" v-if="parentShow">
          <el-input v-model="parent_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单序号" prop="menu_order">
          <el-input v-model="ruleForm.menu_order"></el-input>
        </el-form-item>
        <el-form-item label="路由名称" prop="menu_url">
          <el-input v-model="ruleForm.menu_url"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="comp_path">
          <el-input v-model="ruleForm.comp_path"></el-input>
        </el-form-item>

        <el-form-item label="功能类型" prop="menu_type">
          <el-select v-model="ruleForm.menu_type" placeholder="功能类型">
            <el-option v-for="(item,index) in gnlx" :label="item.label" :value="parseInt(item.value)" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menu_source">
          <el-select v-model="ruleForm.menu_source" placeholder="菜单类型">
            <el-option v-for="(item,index) in cdlx" :label="item.label" :value="parseInt(item.value)" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-select v-model="ruleForm.is_show" placeholder="是否显示">
            <el-option label="是" :value="1">
            </el-option>
            <el-option label="否" :value="0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否是按钮">
          <el-select v-model="ruleForm.is_button" placeholder="是否是按钮">
            <el-option label="是" :value="1">
            </el-option>
            <el-option label="否" :value="0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示面包屑">
          <el-select v-model="ruleForm.is_crumb" placeholder="是否显示面包屑">
            <el-option label="是" :value="1">
            </el-option>
            <el-option label="否" :value="0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访问链接">
          <el-input v-model="ruleForm.href"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" v-if='ruleForm.is_button'>
          <el-input v-model="ruleForm.permission"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="menu_icon">
          <base-selct-icon v-model="ruleForm.menu_icon"></base-selct-icon>
          <!-- <el-input v-model="ruleForm.menu_icon"></el-input> -->
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit=false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <menu-table :myDetail="childinfo" @showType="showType" ref="menuData"></menu-table>

  </div>
</template>
<script>
import paging from "common/BasePaging.vue";
import MenuTable from "view/sysMenu/MenuTable.vue";
import BaseSelctIcon from "common/BaseSelctIcon.vue";
import { getDicData } from "assets/js/commonManage.js";

export default {
  data() {
    return {
      gnlx: [],
      cdjb: [],
      cdlx: [],
      setDis: true,
      parentShow: false,
      levelShow: false,
      dialogVisible: false,
      topShow: false,
      topList: [],
      parent_name: null,
      childinfo: [3],
      dialogEdit: false,
      formTitle: "",
      ruleForm: {
        //新增表单数据
        menu_icon: "",
        menu_name: null,
        menu_url: null,
        comp_path: null,
        menu_order: null,
        menu_level: undefined,
        menu_type: 1,
        menu_source: 1,
        is_show: 1,
        is_button: 0,
        is_crumb: 1,
        href: "",
        permission: "",
        parent_id: null,
        selectedOptions: []
      },
      formInline: {
        menu_name: ""
      }
    };
  },
  created() {
    // this.gnlx = menuFunType;
    // this.cdjb = menuLevel;
    // this.cdlx = menuSource;
    this.gnlx = getDicData("gnlx");
    this.cdjb = getDicData("cdjb");
    this.cdlx = getDicData("cdlx");
  },
  mounted() {},

  methods: {
    showType(msg) {
      this.setDis = msg;
    },
    // async getSub(data,field) {
    //     try{
    //         const res = await this.$http.get('/sys/MenuController/doQueryMenuLevel',{params:data});
    //         if (res.data && res.data.success) {
    //             this[field] = res.data.result;
    //         } else {
    //             this.$message.error(res.data.msg);
    //         }
    //     }catch(err){
    //         this.$message.error('请求错误');
    //     }
    // },
    onSearch() {
      this.$refs.menuData.getSysMenuList(this.formInline);
    },
    /**
     * 点击新增按钮
     */
    handleAdd() {
      const clmenu = this.$refs["menuData"].clickMenu;
      this.ruleForm = {
        //新增表单数据
        menu_icon: "",
        menu_name: null,
        menu_url: null,
        comp_path: null,
        menu_order: null,
        menu_level: undefined,
        menu_type: 1,
        menu_source: 1,
        is_show: 1,
        is_button: 0,
        is_crumb: 1,
        href: "",
        permission: "",
        parent_id: null,
        href: "",
        selectedOptions: []
      };
      if (clmenu.id) {
        console.log("clmenu", clmenu);
        this.ruleForm.parent_id = clmenu.id;
        this.ruleForm.parent = clmenu;
        this.parent_name = clmenu.menu_name;
        this.ruleForm.menu_level = clmenu.menu_level + 1;
        this.levelShow = true;
        this.parentShow = true;
        this.topShow = false;
      } else {
        this.levelShow = false;
        this.parentShow = false;
      }
      this.dialogEdit = true;
      this.formTitle = "新增菜单";
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formInline = { menu_name: "" };
      this.$refs.menuData.getSysMenuList();
    },
    subChange() {
      //切换父级菜单显示隐藏，设置menu_level和parent_id
      const level = this.ruleForm.menu_level;
      if (Number(level) === 0) {
        this.topShow = false;
        this.ruleForm.parent_id = null;
      } else {
        if (
          this.ruleForm.selectedOptions &&
          !this.$refs["menuData"].clickMenu.id
        ) {
          if (Number(level) === 1) {
            this.ruleForm.parent_id = this.ruleForm.selectedOptions[0] || null;
          } else {
            if (this.ruleForm.selectedOptions.length < 2) {
              this.ruleForm.selectedOptions = [];
              this.ruleForm.parent_id = null;
            } else {
              this.ruleForm.parent_id = this.ruleForm.selectedOptions[1];
            }
          }
          this.topShow = true;
          this.getMenuByLevel(level);
        }
      }
    },
    handleChange(value) {
      if (value.length === 2) {
        this.ruleForm.parent_id = value[1];
      } else {
        this.ruleForm.parent_id = value[0];
        this.ruleForm.menu_level = 1;
      }
    },
    async getMenuByLevel(level) {
      let treeData = this.$refs["menuData"].treeData;
      if (level === 2) {
        this.topList = treeData.map(i => {
          let p1 = {
            label: i.menu_name,
            value: i.id
          };
          if (i.children.length > 0) {
            p1.children = i.children.map(j => {
              const p2 = {
                label: j.menu_name,
                value: j.id
              };
              return p2;
            });
          }
          return p1;
        });
      } else {
        this.topList = treeData.map(i => {
          const p1 = {
            label: i.menu_name,
            value: i.id
          };
          return p1;
        });
      }
    },
    /**
     * 保存菜单信息
     * @params {String} formName 用于验证
     */
    async submitForm(formName) {
      var _vm = this;
      var params = _vm.ruleForm;
      console.log(params);
      // const res = await _vm.$http.post(
      //   "/sys/MenuController/doAddOrUpdate",
      //   _vm.ruleForm
      // );
      // console.log(res);
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const res = await _vm.$http.post(
              "/sys/MenuController/doAddOrUpdate",
              params
            );
            // const res = await _vm.$http.post(
            //   "/sys/MenuController/doAddOrUpdate",
            //   params
            // );
            if (res.data && res.data.success) {
              _vm.dialogEdit = false;
              _vm.$refs.menuData.getSysMenuList();
              _vm.$refs.menuData.getMenuAllList();
              _vm.$message.success("操作成功");
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error("请求错误");
          }
        } else {
          return false;
        }
      });
    },
    changeDialog(parms) {
      this.topShow = false;
      this.parentShow = false;
      this.levelShow = true;
      this.dialogEdit = true;
      this.formTitle = "编辑菜单";
      this.ruleForm = Object.assign({}, parms);
    }
  },
  components: {
    paging,
    MenuTable,
    BaseSelctIcon
  },
  computed: {}
};
</script>
<style lang="scss">
.childDialog {
  .el-input {
    width: 200px;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>

<style scoped>

</style>
