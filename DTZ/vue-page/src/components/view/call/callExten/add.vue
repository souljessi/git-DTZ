<template>
  <div class="exten-add">
    <div style="color:#409EFF;font-size:14px;padding-bottom:20px;">
      <span @click='back' class="back">
        <base-icon icon='back' />返回

      </span>
    </div>
    <el-form class="exten-form" :model="form" :rules="this.$validateRule" ref='form' label-width="120px">
      <el-form-item label="分机号码" prop="exten">
        <el-input v-model="form.exten" placeholder="分机号码"></el-input>
      </el-form-item>
      <el-form-item label="坐席人员" prop="commissioner">
        <base-person-select v-model="form.commissioner" title="坐席人员选择" max='1'></base-person-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.note" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number :min='0' v-model="form.sort" placeholder="排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button style="width:100px;" @click="saveExten('form')" type="primary">提交</el-button>
    </div>
  </div>
</template>


<script>
import BasePersonSelect from "common/BasePersonSelect";
export default {
  data() {
    return {
      form: {
        exten: "",
        note: "",
        sort: 0,
        commissioner: []
      }
    };
  },
  components: {
    BasePersonSelect
  },
  created() {
    console.log(this.$route);
    if (this.$route.query.id) this.getExtenById(this.$route.query.id);
  },
  methods: {
    async saveExten(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let data = Object.assign({}, this.form);
          if (data.commissioner.length > 0) {
            data.commissioner = data.commissioner[0];
          } else {
            data.commissioner = null;
          }

          const Res = await this.$http.post(
            "/call/CallExtenController/doAddOrUpdate",
            data
          );
          console.log(Res);
          if (Res.data.success) {
            this.$message.success("保存成功");
            this.back();
          } else {
            this.$message.error(Res.data.msg);
          }
        } else {
          return false;
        }
      });
    },
    async getExtenById(id) {
      const Res = await this.$http.get(
        "/call/CallExtenController/doGetExtenListById",
        {
          params: {
            id: id
          }
        }
      );
      if (Res.data && Res.data.success) {
        let data = Res.data.result;
        data.commissioner = data.commissioner ? [data.commissioner] : [];
        this.form = data;
      } else {
        this.$message.waring(Res.data.msg);
      }
    },
    back() {
      this.$router.push("/exten");
    }
  }
};
</script>

<style lang="scss">
.exten-add {
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

