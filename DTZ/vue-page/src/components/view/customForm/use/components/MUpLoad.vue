<template>
  <div>
    <el-form ref="form" :inline="true" :model="form" label-width="120px">
      <el-form-item :label="miData.label">
        <el-upload class="upload-demo" ref="upload" action="" :multiple="true" :file-list="fileList" :on-change="handleChange" :on-remove="reomoveChange" id="file_upload" :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">{{miData.placeholder}}</el-button>
        </el-upload>
        <el-button type="success" 　@click='uploadClick'>提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ["miData"],
  data() {
    return {
      form: {},
      fileList: []
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    reomoveChange(file, fileList){
      this.fileList = fileList;
      
    },
    uploadClick() {
      for (var item of this.fileList) {
        let formData = new FormData();
        formData.append("file", item.raw);
        this.saveFile(formData);
      }

      // console.log(formData);
    },
    async saveFile(formData) {
      const Res = await this.$http.post(
        "/sys/templateController/saveFile",
        formData
      );
      console.log("结果：", Res);
    }
  }
};
</script>