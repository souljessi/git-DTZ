<template>
  <div>

    <!--dialog-->
    <el-dialog class="childDialog" title="绑定已有用户" :visible.sync="userDialog" :close-on-press-escape='false' :modal-append-to-body="false" :close-on-click-modal="false" :show-close="false">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="formInline.username" placeholder="用户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="resetForm('formInline')">重置</el-button>

        </el-form-item>
      </el-form>
      <!--表单-->
      <el-table :data="userTableData" highlight-current-row border v-loading="loading" :height="300" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column min-width="100" prop="realname" label="真实姓名">
        </el-table-column>
        <el-table-column min-width="70" prop="gender" label="性别">
        </el-table-column>
        <el-table-column min-width="130" prop="phone" label="手机号码">
        </el-table-column>
        <el-table-column min-width="160" prop="last_login_time" :formatter="dateFormatFun" label="最近登录时间">
        </el-table-column>
      </el-table>
      <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum">
      </paging>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import paging from "common/BasePaging.vue";
// import { dateFormat } from "assets/js/date.js";
import moment from "moment";
export default {
  data() {
    return {
      userTableData: [], //用户列表数组
      sels: [], //列表选中项
      tabPage: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
      }, //分页信息
      loading: true,
      ruleForm: {}, //新增表单数据
      options: [], //部门数组
      formInline: {
        username: ""
      }
    };
  },
  props: ["departId", "userDialog"],
  created: function() {},
  mounted: function() {
    this.openScreen();
  },
  components: {
    paging
  },
  computed: {},
  watch: {
    userDialog: function() {
      this.getUserListNotBindOrg();
    }
  },
  methods: {
    dateFormatFun(row, colum) {
      //时间格式化
      if (row[colum.property] != null) {
        var d = row[colum.property];
        return moment(d).format("YYYY-MM-DD hh:mm:ss");
        // return dateFormat(new Date(d), "yyyy-MM-dd hh:mm:ss");
      }
    },
    /**
     * 加载动画
     */
    openScreen() {
      //加载...
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 200);
    },
    async getUserListNotBindOrg(params) {
      let data = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize,
        options: this.formInline
      };
      if (params) {
        data = params;
      }
      try {
        const res = await this.$http.get(
          "/sys/DepartController/getUserNotBindOrg",
          {
            params: data
          }
        );
        if (res.data && res.data.success) {
          const d = res.data.result;
          this.userTableData = d.rows;
          this.tabPage.totalNum = d.count;
        } else {
          this.$message.error(res.data.msg);
        }
      } catch (err) {
        this.$message.error("请求错误");
      }
    },
    /**
     * 查询 根据用户名模糊查询
     */
    onSearch() {
      var params = { options: this.formInline };
      params.page = 1;
      params.pageSize = this.tabPage.pageSize;
      this.tabPage.currentPage = 1; //每次查询默认第一页
      this.getUserListNotBindOrg(params);
    },
    /**
     * 保存用户角色关联信息
     * @params {String} formName 用于验证
     */
    async submitForm() {
      let arr = [];
      for (let i = 0; i < this.sels.length; i++) {
        arr.push(this.sels[i].id);
      }
      const params = {
        userlist: arr,
        org_id: this.departId
      };
      if (this.sels.length > 0) {
        try {
          const res = await this.$http.post(
            "/sys/DepartController/saveUsersDepart",
            params
          );
          if (res.data && res.data.success) {
            this.$message.success("操作成功");
            this.$emit("close", { dialog: false, status: "change" });
          } else {
            this.$message.error(res.data.msg);
          }
        } catch (err) {
          this.$message.error("请求错误");
        }
      } else {
        this.$message.error("请选择用户");
      }
    },
    /**
     * 切换每页条数
     * @params {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
      this.getUserListNotBindOrg();
    },
    /**
     * 切换页码
     * @params {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
      this.getUserListNotBindOrg();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.sels = val;
    },
    close() {
      (this.sels = []), (this.formInline = { police_name: "" });
      this.$emit("close", { dialog: false });
    },
    /**
     * 表单重置
     * @params {Object} formName 表单名称
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.formInline.username = "";
      this.onSearch();
    }
  }
};
</script>

<style scoped>

</style>
