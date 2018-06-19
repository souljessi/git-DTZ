<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="ws-tree" v-bind:style="{height:screenHeight-110+'px'}">
          <el-tree :data="treeData" node-key="id" ref="tree2" :default-expand-all="defaultExpandedKeys" :props="defaultProps" :highlight-current="highlightCurrent" :render-content="renderContent" @node-click="treeNodeClick">
          </el-tree>
        </div>
      </el-col>

      <el-col :span="18">
        <el-table :data="sysMenuTableData" border :height="screenHeight-110" @selection-change="handleSelectionChange" v-loading="loading" style="width: 100%">
          <el-table-column prop="menu_name" label="菜单名称">
          </el-table-column>
          <el-table-column prop="menu_level" label="菜单级别" :formatter="formatFun">
          </el-table-column>
          <el-table-column prop="menu_type" label="功能类型" :formatter="menuTypeformatter">
          </el-table-column>
          <el-table-column prop="menu_order" label="菜单序号">
          </el-table-column>
          <el-table-column prop="menu_icon" label="菜单图标">
          </el-table-column>
          <el-table-column prop="menu_url" label="菜单路由">
            <template slot-scope="scope">
              <base-text-overflow :text='scope.row.menu_url' />
            </template>
          </el-table-column>
          <el-table-column prop="comp_path" label="菜单路径">
            <template slot-scope="scope">
              <base-text-overflow :text='scope.row.comp_path' />
            </template>
          </el-table-column>
          <el-table-column prop="is_show" label="是否显示">
            <template slot-scope="scope">
              <div>{{scope.row.is_show==1?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="is_button" label="是否是按钮">
            <template slot-scope="scope">
              <div>{{scope.row.is_button==1?'是':scope.row.is_button==0?'否':'未知'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="菜单类型" prop="menu_source" :formatter="menuSourceformatter">
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum">

        </paging>
      </el-col>
    </el-row>

  </div>

</template>

<script>
import paging from "common/BasePaging.vue";
import BaseTextOverflow from "common/BaseTextOverflow.vue";
import { transData, getDicData } from "assets/js/commonManage.js";
// import { getDicData } from "assets/js/commonManage.js";
export default {
  data() {
    return {
      cache: "",
      highlightCurrent: false,
      clickMenu: {}, //点击菜单对象
      gnlx: [],
      defaultExpandedKeys: true,
      loading: false,
      sysMenuTableData: [],
      tabPage: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
      }, //分页信息
      treeData: [],
      treesysData: [],
      defaultProps: {
        children: "children",
        label: "menu_name"
      },
      sels: [], //表格选中列
      cdlx: [],
      cdjb: [],
      screenHeight: document.body.clientHeight - 125
    };
  },
  created() {
    this.gnlx = getDicData("gnlx");
    this.cdlx = getDicData("cdlx");
    this.cdjb = getDicData("cdjb");
    this.getSysMenuList();
    this.getMenuAllList();
  },
  mounted() {
    const VM = this;
    VM.screenHeight = document.body.clientHeight - 125;
    window.addEventListener("resize", function() {
      VM.screenHeight = document.body.clientHeight - 125;
    });
  },
  props: ["myDetail"],
  components: {
    paging,
    BaseTextOverflow
  },
  watch: {
    myDetail: function(older) {
      this.$refs.tree2.setCheckedKeys(myDetail);
    },
    isShow(val) {
      this.$emit("showType", val);
    }
  },
  methods: {
    /**
     * tree 渲染
     */
    renderContent(h, { node, data, store }) {
      console.log(data);
      return (
        <span style="flex: 1;  display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>
              <base-icon style='color:#409EFF' icon={data.menu_icon} />
              <span style='margin-left:10px'>{node.label}</span>
            </span>
          </span> 
          <span>
            <el-button
              v-show={data.show}
              style="font-size: 12px;"
              type="text"
              on-click={() => this.cancleClick(node, data, store)}
            >
              取消选中
            </el-button>
          </span>
        </span>
      );
    },

    menuSourceformatter(row, colum) {
      let value = row.menu_type;
      let text = "未知";
      this.cdlx.forEach(item => {
        let val = parseInt(item.value);
        if (val === value) {
          text = item.label;
        }
      });
      return text;
    },
    menuTypeformatter(row, colum) {
      let value = row.menu_type;
      let text = "未知";
      this.gnlx.forEach(item => {
        let val = parseInt(item.value);
        if (val === value) {
          text = item.label;
        }
      });
      return text;
    },
    formatFun(row, colum) {
      //菜单级别格式化
      // if (row[colum.property] != null) {
      //   const d = row[colum.property];
      //   console.log(row);
      //   // return level[d];
      //   return 123;
      // }
      let value = row.menu_level;
      let text = "未知";
      this.cdjb.forEach(item => {
        let val = parseInt(item.value);
        if (val === value) {
          text = item.label;
        }
      });
      return text;
    },
    /**
     * 编辑按钮点击事件
     * @params {Number} index  行号
     * @params {Object} row 行对象
     */
    handleEdit(index, row) {
      this.$parent.changeDialog(row);
    },
    /**
     * 删除按钮点击事件
     * @params {Number} index   行号
     * @params {Object} row     行对象
     */
    handleDelete(index, row) {
      let data = {
        id: row.id
      };
      this.deleteSysUserInfo(data);
    },
    /**
     * 删除部门信息
     * @params {Object} row|rows     行对象
     */
    deleteSysUserInfo(data) {
      const _vm = this;
      this.$confirm("此操作将永久删除此菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await _vm.$http.post(
              "/sys/MenuController/delSysMenuInfo",
              data
            );
            if (res.data && res.data.success) {
              _vm.getSysMenuList();
              _vm.getMenuAllList();
              _vm.$message.success("操作成功");
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error("请求错误");
          }
        })
        .catch(() => {});
    },
    /**
     * 切换每页条数
     * @params {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
      this.getSysMenuList();
    },
    /**
     * 切换页码
     * @params {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
      this.getSysMenuList();
    },
    /**
     * 多选框改变选中事件
     * @params {Array} val 当前所有选中行对象数组
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.sels = val;
    },
    async getSysMenuList(params) {
      let data = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize
      };
      if (params) {
        data = Object.assign(data, params);
      }
      this.loading = true;
      try {
        const res = await this.$http.get(
          "/sys/MenuController/doQueryMenuList",
          { params: data }
        );
        if (res.data && res.data.success) {
          this.sysMenuTableData = res.data.result.rows;
          this.tabPage.totalNum = res.data.result.count;
        } else {
          this.$message.waring(res.data.data);
        }
        this.loading = false;
      } catch (err) {
        this.$message.error("请求错误");
      }
    },
    async getMenuAllList() {
      this.treeData = [];
      const res = await this.$http.get("/sys/MenuController/doQueryMenuAll");
      if (res.data && res.data.success) {
        let data = res.data.result.map(item => {
          item.show = false;
          return item;
        });
        this.treeData = transData(data, "id", "parent_id", "children");
      } else {
        this.$message.error(res.data.msg);
      }
    },
    /**
     * 菜单树节点点击事件
     *@param {Object} element  传递给 data 属性的数组中该节点所对应的对象
     *@param {Objcet} node   节点对应的 Node
     *@param {Objcet} vm    节点组件本身
     */
    treeNodeClick(el, node, vm) {
      this.clickMenu = el;
      this.highlightCurrent = true;
      console.log(node);
      console.log(this);
      this.$parent.formInline.menu_name = node.data.menu_name;
      this.$parent.onSearch();
      this.$emit("showType", false);
      if (this.cache.id) {
        this.cache.show = false;
      }
      node.data.show = true;
      this.cache = node.data;
    },
    /**
     * @desc 取消选择
     * @param {Object} node node节点
     * @param {Object} data 节点数据
     * @param {Object} store  所有节点数据
     * @returns *
     */
    cancleClick(node, data, store) {
      console.log("冒泡");
      console.log(node, data, store);
      console.log(event);
      this.highlightCurrent = false;
      data.show = false;
      // this.isEdit = false;
      event.cancelBubble = true; //阻止事件冒泡
      // this.mapAreaInfo = {
      //   area_code: "",
      //   area_name: "",
      //   city_type: "",
      //   id: "",
      //   parent_id: "",
      //   scope_path: null,
      //   calculate: 0 //区域面积
      // };
    }
  },
  computed: {
    isShow() {
      let type = true;
      if (this.treeData.length > 0) {
        if (!this.highlightCurrent) {
          type = true;
        } else {
          type = false;
        }
      } else {
        type = true;
      }

      return type;
    }
  }
};
</script>

<style>
.ws-tree {
  /*height:750px;*/
  /*position:absolute;*/
  overflow: auto;
}
.ws-tree .el-tree {
  height: 100%;
  overflow-y: auto;
}
.ws-tree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e6a23c;
}
</style>
