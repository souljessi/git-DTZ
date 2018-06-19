<template>
  <div class="customer-add">
    <div style="color:#409EFF;font-size:14px;padding-bottom:20px;">
      <span @click='back' class="back">
        <base-icon icon='back' />返回

      </span>
    </div>
    <el-form class="exten-form" :model="form" :rules="this.$validateRule" ref='form' label-width="120px">
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="form.real_name" readonly placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input readonly v-model="form.phone" placeholder="请输入电话号码"></el-input>
      </el-form-item>
      <el-form-item label="来源" prop='source'>
        <el-select v-model="form.source" disabled placeholder="请输入来源">
          <el-option v-for="(item,index) in dhly" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop='age'>
        <el-input v-model="form.age" readonly placeholder="请输入年龄"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop='gender'>
        <el-select v-model="form.gender" disabled placeholder="请输入性别">
          <el-option v-for="(item,index) in gen" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" readonly v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="客户类型">
        <el-input v-model="form.customer_type" readonly placeholder="请输入客户类型"></el-input>
      </el-form-item>
      <el-form-item label="接线员">
        <el-input v-model="form.user" readonly placeholder="接线员"></el-input>
      </el-form-item>
      <el-form-item label="来电时间">
        <el-input v-model="form.last_call_date" readonly placeholder="最后来电时间"></el-input>
      </el-form-item>
    </el-form>
    <!-- <div class="btn" >
            <el-button style="width:100px;" @click="saveExten('form')" type="primary">提交</el-button>
        </div> -->
  </div>
</template>


<script>
import { getDicData } from "assets/js/commonManage.js";
import moment from "moment";
export default {
  data() {
    return {
      form: {
        user: "",
        real_name: null,
        phone: null,
        source: null,
        age: 0,
        gender: null,
        remark: null,
        customer_type: null,
        operator_id: null,
        last_call_date: null
      },
      gen: [{ label: "男", value: 1 }, { label: "女", value: 2 }],
      dhly: []
    };
  },
  created() {
    console.log(this.$route);
    this.dhly = getDicData("dhly");

    if (this.$route.query.id) this.getExtenById(this.$route.query.id);
  },
  methods: {
    async saveExten(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const Res = await this.$http.post(
            "/call/CallExtenController/doAddOrUpdate",
            this.form
          );
          console.log(Res);
          if (Res.data.success) {
            this.$message.success("保存成功");
            this.back();
          } else {
            this.$message.error("保存失败");
          }
        } else {
          return false;
        }
      });
    },
    async getExtenById(id) {
      const Res = await this.$http.get(
        "/call/CallCustomerController/doGetCustomerListById",
        {
          params: {
            id: id
          }
        }
      );
      if (Res.data && Res.data.success) {
        this.form = Res.data.result;
        this.form.user = Res.data.result.sys_user.username;
        this.form.last_call_date = moment(
          Res.data.result.last_call_date
        ).format("YYYY-MM-DD HH:mm:ss");
      } else {
        this.$message({
          message: Res.data.msg,
          type: "warning"
        });
      }
    },
    back() {
      this.$router.push("/extenCustomer");
    }
  }
};
</script>

<style lang="scss">
.customer-add {
  width: 460px;
  margin: 50px 0 0 50px;

  .back {
    &:hover {
      cursor: pointer;
    }
  }
  .btn {
    display: flex;
    justify-content: center;
  }
}
</style>

