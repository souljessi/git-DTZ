<template>
    <div class="call-black">
        <!--查询-->
        <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
            <el-form-item label="电话号码" prop="phone">
                <el-input v-model="formInline.phone" placeholder="电话号码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
                <el-button type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" class="zone-table" :height="screenHeight-110" border :data="blackList" style="width: 100%">
            <el-table-column label="" prop="phone" label="黑名单号码" sortable></el-table-column>
            <el-table-column label="" prop="user_name" label="姓名"></el-table-column>
            <el-table-column label="" prop="time_add" label="添加时间" :formatter='dataFormate'>
            </el-table-column>
            <el-table-column width="150" fixed="right" label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" @click='Edit(scope.row)'>编辑</el-button> -->
                    <el-button type="danger" @click="Delete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import BaseTextOverflow from "common/BaseTextOverflow.vue";

import { dateFormat } from "assets/js/date";
export default {
  name: "call-black",
  data() {
    return {
      loading: false,
      blackList: [],
      screenHeight: document.body.clientHeight - 100,
      formInline: {
        phone: ""
      }
    };
  },
  components: {
    BaseTextOverflow
  },
  created() {
    this.getBlackData();
  },
  mounted() {},
  methods: {
    /**
     * 表格日期格式化
     */
    dataFormate(row, column, cellValue, index) {
      if (row.time_add != "") {
        var date = new Date(parseInt(row.time_add) * 1000);
        var fm = dateFormat(date, "yyyy-MM-dd hh:mm");
        return fm;
      } else {
        return "";
      }
    },
    onSearch() {
      this.getBlackData();
    },
    /**
     * @description 重置表单
     * @param {String} 表单ref
     */
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields();
      this.getBlackData();
    },
    Delete(data) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delBlackByPhone(data);
        })
        .catch(() => {});
    },
    /**
     * 查询黑名单列表
     */
    async getBlackData() {
      let params = {};
      params.phone = this.formInline.phone;
      const Res = await this.$http.post(
        "/call/CallController/getBlockPhone",
        params,
        {
          isOut: true
        }
      );
      console.log(Res);
      if (Res.data.error == 0) {
        this.blackList = Res.data.data;
        // this.$message.success("查询成功");
        // this.cdrData = Res.data.data;
      } else {
        this.$message.error(Res.data.msg);
      }
    },

    async delBlackByPhone({ phone, user_name }) {
      let params = {
        phone,
        user_name,
        type: 2
      };
      const Res = await this.$http.post(
        "/call/CallController/saveBlockPhone",
        params,
        {
          isOut: true
        }
      );
      console.log(Res.data);
      if (Res.data.error == 0) {
        this.$message.success("删除成功");
        this.getBlackData();
        // this.cdrData = Res.data.data;
      } else {
        this.$message.error(Res.data.msg);
      }
    }
  }
};
</script>
 
<style lang="scss" scoped>
.call-black {
}
</style>