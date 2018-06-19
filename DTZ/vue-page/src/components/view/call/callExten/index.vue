<template>
  <div class="call-exten">
    <!--查询-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
      <el-form-item label="分机号" prop="exten">
        <el-input v-model="formInline.exten" placeholder="分机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
        <el-button type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item style="margin-left: 30px">
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" class="zone-table" :height="screenHeight-110" border :data="extenList" style="width: 100%">

      <el-table-column label="" prop="exten" label="分机号" sortable></el-table-column>
      <el-table-column label="" prop="customer" label="坐席人员" ></el-table-column>
      <el-table-column label="" prop="note" label="备注">
      </el-table-column>
      <el-table-column label="" prop="sort" label="排序" sortable>
      </el-table-column>
      <el-table-column width="150" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click='Edit(scope.row)'>编辑</el-button>
          <el-button type="danger" @click="Delete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum">
    </paging>
  </div>
</template>

<script>
import BaseTextOverflow from "common/BaseTextOverflow.vue";
import paging from "common/BasePaging.vue";

export default {
  data() {
    return {
      loading: false,
      extenList: [],
      screenHeight: document.body.clientHeight - 100,
      formInline: {
        exten: ""
      },
      tabPage: {
        //分页
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
      } //分页信息
    };
  },
  components: {
    paging,
    BaseTextOverflow
  },
  created() {
    this.getExtenData();
  },
  methods: {
    onSearch() {
      this.getExtenData();
    },
    /**
     * @description 重置表单
     * @param {String} 表单ref
     */
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields();
      this.getExtenData();
    },
    Edit(data) {
      console.log(data);
      this.$router.push({ path: "/extenAdd", query: { id: data.id } });
    },
    Delete(data) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delExtenById(data.id);
        })
        .catch(() => {});
    },
    handleAdd() {
      this.$router.push("/extenAdd");
    },
    /**
     * @description 切换每页条数
     * @param {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
    },
    /**
     * @description 切换页码
     * @param {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
    },

    /**
     * 查询分机数据 分页
     */
    async getExtenData() {
      let data = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize
      };
      data.exten = this.formInline.exten;
      const Res = await this.$http.get(
        "/call/CallExtenController/doGetExtenListForPage",
        {
          params: data
        }
      );
      if (Res.data && Res.data.success) {
        this.loading = true;
        setTimeout(() => {
          this.extenList = Res.data.result.rows.map(item=>{
            if(item.commissioner) item.customer=item.sys_user.realname
            return item
          });
          this.tabPage.totalNum = Res.data.result.count;
          this.loading = false;
        }, 400);
      } else {
        this.$message.waring(Res.data.msg);
      }
    },

    async delExtenById(id) {
      console.log(id);
      const Res = await this.$http.post(
        "/call/CallExtenController/doDelExtenById",
        { id: id }
      );
      if (Res.data && Res.data.success) {
        this.$message.success("删除成功");
        this.getExtenData();
      } else {
        this.$message.waring(Res.data.msg);
      }
    }
  }
};
</script>


<style lang="scss">
.call-exten {
}
</style>
