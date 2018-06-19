<template>
  <div class="call-customer">
    <!--查询-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="formInline.real_name" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="formInline.phone" placeholder="电话号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
        <el-button type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item style="margin-left: 30px">
        <!-- <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button> -->
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" class="zone-table" :height="screenHeight-110" border :data="customerList" style="width: 100%">

      <el-table-column prop="real_name" label="真实姓名" sortable></el-table-column>
      <el-table-column prop="phone" label="电话号码">
      </el-table-column>
      <el-table-column prop="source" :formatter="sourceFormat" label="来源">
      </el-table-column>
      <el-table-column prop="age" label="年龄">
      </el-table-column>
      <el-table-column prop="gender" :formatter="genderFormat" label="性别">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <base-text-overflow :text='scope.row.remark' />
        </template>
      </el-table-column>
      <el-table-column prop="customer_type" :formatter="customerTypeFormat" label="客户类型">
      </el-table-column>
      <el-table-column :formatter='userFormat' prop="operator_id" label="接线员">
      </el-table-column>
      <el-table-column prop="call_date" width="200" :formatter="timeFormat" label="来电时间" sortable>
      </el-table-column>
      <el-table-column width="150" fixed="right" label="操作">
        <template slot-scope="scope">
          <span class="view" @click="view(scope.row)">
            <base-icon icon='duban' />查看
          </span>
          <!-- <el-button type="primary" @click='Edit(scope.row)'>编辑</el-button> -->
          <!-- <el-button type="danger" @click="Delete(scope.row)">删除</el-button> -->
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
import { getDicData } from "assets/js/commonManage.js";
import moment from "moment";
export default {
  data() {
    return {
      loading: false,
      customerList: [],
      screenHeight: document.body.clientHeight - 100,
      formInline: {
        real_name: "",
        phone: ""
      },
      dhly: [],
      khlx: [],
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
    this.getCustomerData();
    this.dhly = getDicData("dhly");
    this.khlx = getDicData("khlx");
  },
  methods: {
    view(data) {
      this.$router.push({ path: "/customerAdd", query: { id: data.id } });
    },
    timeFormat(row, column, cellValue) {
      if (row.last_call_date) {
        return moment(row.last_call_date).format("YYYY-MM-DD HH:mm:ss");
      }
      return "未知";
    },
    genderFormat(row, column, cellValue) {
      switch (row.gender) {
        case 1:
          return "男";
          break;
        case 2:
          return "女";
          break;
        default:
          return "未知";
          break;
      }
    },
    sourceFormat(row, column, cellValue) {
      for (let item of this.dhly) {
        if (item.value === row.source) return item.label;
      }
      return "未知";
    },
    customerTypeFormat(row, column, cellValue) {
      for (let item of this.khlx) {
        if (item.value === row.customer_type) return item.label;
      }
      return "未知";
    },
    userFormat(row, column, cellValue) {
      if (row.sys_user) return row.sys_user.username || "未知";
      return "未知";
    },
    onSearch() {
      this.getCustomerData();
    },
    /**
     * @description 重置表单
     * @param {String} 表单ref
     */
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields();
      this.getCustomerData();
    },
    /**
     * @description 切换每页条数
     * @param {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
      this.getCustomerData();
    },
    /**
     * @description 切换页码
     * @param {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
      this.getCustomerData();
    },

    /**
     * 查询分机数据 分页
     */
    async getCustomerData() {
      let data = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize
      };
      data.real_name = this.formInline.real_name;
      data.phone = this.formInline.phone;

      const Res = await this.$http.get(
        "/call/CallCustomerController/doGetCustomerListForPage",
        {
          params: data
        }
      );
      if (Res.data && Res.data.success) {
        this.loading = true;
        setTimeout(() => {
          this.customerList = Res.data.result.rows;
          this.tabPage.totalNum = Res.data.result.count;
          this.loading = false;
        }, 400);
      } else {
        this.$message.warning(Res.data.msg);
      }
    }
  }
};
</script>


<style lang="scss">
.call-customer {
  .view {
    font-size: 14px;
    color: #409eff;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
