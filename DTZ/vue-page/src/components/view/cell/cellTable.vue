<template>
  <div>
    <span>区域：</span>
    <el-cascader @change="selectChange" v-model="cansader" placeholder="试试搜索：东门" :props="cascaderProps" :options="options" clearable filterable></el-cascader>
    <el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
    <el-button size="mini" type="info" icon="el-icon-refresh" @click="restCansader">
      重置</el-button>
    <el-button type="success" icon="el-icon-plus" @click="addCell">新增</el-button>
    <el-table :height="screenHeight-110" v-loading="loading" :data="cellData">
      <el-table-column label="单元网格编号" prop="BGID">
      </el-table-column>
      <el-table-column label="面积(㎡)" prop="BGSQua"></el-table-column>
      <el-table-column label="所属区域" :formatter="formatter">
      </el-table-column>
      <el-table-column label="备注" prop="Note">
        <template slot-scope="scope">
          <base-text-overflow :text="scope.row.Note"></base-text-overflow>
        </template>
      </el-table-column>
      <el-table-column label="范围坐标">
        <template slot-scope="scope">
          <el-button type="text" @click='viewCell(scope.row)'>
            <base-icon style="font-size:16px;margin-right:5px;" icon="map" />查看</el-button>
          <el-button type="text" @click='delCellClick(scope.row)'>
            <i class="el-icon-delete"></i>
            删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum">

    </paging>
  </div>
</template>


<script>
import { transData } from "assets/js/commonManage.js";

import paging from "common/BasePaging.vue";
import BaseTextOverflow from "common/BaseTextOverflow.vue";
export default {
  data() {
    return {
      loading: false,
      cansader: [],
      searchArea: "",
      cellData: [],
      areaData: [],
      tabPage: {
        currentPage: 1,
        pageSize: 15,
        pageSizes: [15, 30, 50]
      }, //分页信息
      screenHeight: document.body.clientHeight - 100,
      cascaderProps: {
        value: "value",
        label: "area_name",
        children: "children"
      },
      options: []
    };
  },
  components: {
    paging,
    BaseTextOverflow
  },
  mounted() {
    const VM = this;
    VM.screenHeight = document.body.clientHeight - 100;
    window.addEventListener("resize", function() {
      VM.screenHeight = document.body.clientHeight - 100;
    });
    this.getAreaData();
    this.getCellData();
  },
  methods: {
    delCellClick(data) {
      this.$confirm("此操作将永久删除该单元格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delCell(data);
        })
        .catch(() => {});
    },

    async delCell(data) {
      let id = data.id;
      let Res = await this.$http.post("/cms/CellController/deltCell", {
        id: id
      });
      if (Res.data.success) {
        this.$message.success("删除成功");
        this.restCansader();
      } else {
        this.$message.waring("删除失败,请重试");
      }
    },
    viewCell(data) {
      console.log("105", data);
      let text = "";
      this.areaData.map(item => {
        if (item.id === data.area_id) {
          text = item.area_name;
        }
      });
      this.$router.push({
        path: "/addCell",
        query: {
          areaId: data.area_id,
          BGID: data.BGID
          // cellName: text
        }
      });
    },
    formatter(row, column) {
      let text = "未知";
      this.areaData.map(item => {
        if (item.id === row.area_id) {
          text = item.area_name;
        }
      });
      return text;
    },
    restCansader() {
      this.cansader = [];
      this.searchArea = -1;
      this.getCellData();
    },
    onSearch() {
      if (this.searchArea !== -1) {
        this.getCellData(this.searchArea);
      } else {
        this.getCellData();
      }
    },
    /**
     * 获取区域信息
     */
    async getAreaData() {
      try {
        const res = await this.$http.get(
          "/cms/AreaController/queryAllAreaData"
        );
        console.log("333", res);
        if (res.data.success) {
          this.areaData = res.data.result;
          let data = this.areaData.map(item => {
            item.value = {
              id: item.id,
              area_code: item.area_code,
              area_name: item.area_name,
              scope_path: item.scope_path
            };
            return item;
          });
          this.options = transData(data, "id", "parent_id", "children");
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectChange(data) {
      if (data.length > 0) {
        let info = data[data.length - 1];
        this.searchArea = info.id;
      }
    },
    async getCellData(params) {
      let data = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize
      };
      if (params != "") {
        data.area_id = params;
      }
      // this.loading = true;
      try {
        const res = await this.$http.get(
          "/cms/CellController/queryAllCellPageList",
          {
            params: data
          }
        );
        if (res.data && res.data.success) {
          this.loading = true;
          setTimeout(() => {
            this.cellData = res.data.result.rows;
            this.tabPage.totalNum = res.data.result.count;
            this.loading = false;
          }, 400);
        } else {
          this.$message.waring(res.data.msg);
        }
        // this.loading = false;
      } catch (err) {
        this.$message.error("网络不稳的，请重试");
        // this.loading = false;
      }
    },
    /**
     * 切换每页条数
     * @params {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
      this.getCellData();
    },
    /**
     * 切换页码
     * @params {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
      this.getCellData();
    },
    addCell() {
      this.$router.push("/addCell");
    }
  }
};
</script>


<style lang="scss" scoped>

</style>
