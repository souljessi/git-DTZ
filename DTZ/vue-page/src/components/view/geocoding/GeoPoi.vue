<template>
  <div class="geo-poi">
    <!--查询-->
    <el-form :inline="true" :model="formInline" class="form-inline" ref="formInline">
      <el-form-item label="兴趣点名称" prop="POIName">
        <el-input v-model="formInline.POIName" placeholder="兴趣点名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-genre="'read'" icon="el-icon-search" @click="onSearch()">查询</el-button>
        <el-button type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item style="margin-left: 30px">
        <el-button type="success" v-genre="'create'" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" class="poi-table" :height="screenHeight-110" border :data="poiList" style="width: 100%">
      <el-table-column label="" prop="POIName" width="110" label="兴趣点名称"></el-table-column>
      <!-- <el-table-column label="" prop="ZoneID" width="110" label="标识码" sortable></el-table-column> -->
      <!-- <el-table-column label="" prop="Alias" label="别名"></el-table-column> -->
      <el-table-column label="" prop="OldName" label="曾用名"></el-table-column>
      <el-table-column label="" prop="SubDisName" label="所在街道名称">
      </el-table-column>
      <!-- <el-table-column label="" prop="SubDisCode" label="所在街道代码" sortable></el-table-column> -->
      <!-- <el-table-column label="" prop="CommuName" label="所在社区名称"></el-table-column> -->
      <!-- <el-table-column label="" prop="CommuCode" label="社区编号" sortable></el-table-column> -->
      <el-table-column label="" prop="Floor" label="所在楼层"></el-table-column>
      <el-table-column label="" prop="DataSource" width="110" label="数据来源">
        <template slot-scope="scope">
          <el-tag :disable-transitions='true' :color="sourceColor(scope.row.DataSource)">
            {{sourceInfo(scope.row.DataSource)}}
          </el-tag>

        </template>
      </el-table-column>
      <el-table-column label="" prop="ORDate" label="创建日期" sortable></el-table-column>
      <el-table-column label="" prop="CHDate" label="更新日期" sortable></el-table-column>
      <el-table-column label="" prop="Note" label="备注">
        <template slot-scope="scope">
          <base-text-overflow :text='scope.row.Note'></base-text-overflow>
        </template>
      </el-table-column>
      <el-table-column width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" v-genre="'update'" @click='PoiEdit(scope.row)'>编辑</el-button>
          <el-button type="danger" v-genre="'delete'" @click="deletePoi(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum">
    </paging>
    </el-tab-pane>

    <el-dialog class="childDialog" v-bind:title="formTitle" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('DialogForm')" width="50%">
      <el-form :model="DialogForm" :inline="true" :rules="this.$validateRule" ref="DialogForm" label-width="120px" class="formStyle">
        <el-form-item label="兴趣点名称" prop="POIName">
          <el-input v-model="DialogForm.POIName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="别名" prop="Alias">
          <el-input v-model="DialogForm.Alias"></el-input>
        </el-form-item> -->
        <el-form-item label="曾用名" prop="OldName">
          <el-input v-model="DialogForm.OldName"></el-input>
        </el-form-item>

        <el-form-item label="所在街道名称" prop="SubDisName">
          <el-select v-model="DialogForm.SubDisName" placeholder="请选择街道" @change='AreaSelectChange'>
            <el-option v-for="(item,index) in areData" :key="index" :label="item.area_name" :value="item.area_name"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所在社区名称" prop="CommuName">
          <el-select :disabled="DialogForm.SubDisName==''" v-model="DialogForm.CommuName" placeholder="请选择街道" @change='CommuNameSelectChange'>
            <el-option v-for="(item,index) in CommuData" :key="index" :label="item.area_name" :value="item.area_name"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="所在楼层" prop="Floor">
          <el-input v-model="DialogForm.Floor" placeholder="请输入最小(门)楼牌号"></el-input>
        </el-form-item>
        <el-form-item label="数据来源" prop="DataSource">
          <el-select v-model="DialogForm.DataSource" placeholder="请选择来源">
            <el-option v-for="(item,index) in jcsjly" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="坐标位置" prop="Coordinate">
          <base-coordinate v-model="DialogForm.Coordinate"></base-coordinate>
        </el-form-item>
        <el-form-item label="备注" prop="Note">
          <el-input type="textarea" :rows="2" v-model="DialogForm.Note"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;margin-top: 10px;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogClick(0)">取 消</el-button>
          <el-button type="primary" @click="dialogClick(1)">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import paging from "common/BasePaging.vue";
import BaseTextOverflow from "common/BaseTextOverflow.vue";
import { getDicData } from "assets/js/commonManage.js";
import BaseCoordinate from "common/BaseCoordinate.vue";
export default {
  data() {
    return {
      loading: false,
      screenHeight: document.body.clientHeight - 110,
      formInline: {
        POIName: ""
      },
      DialogForm: {
        POIName: "",
        // Alias: "",
        OldName: "",
        SubDisName: "",
        SubDisCode: "",
        Floor: "",
        Coordinate: "",
        // CommuName: "",
        // SHousenum: "",
        // LHousenum: "",
        // Beginning: "",
        // Ending: "",
        // Direction: "",
        // RouteName: "",
        DataSource: "",
        CommuCode: "",
        Note: ""
      },
      formTitle: "所在楼层新增",
      dialogInfo: false,
      tabPage: {
        //分页
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
      }, //分页信息
      poiList: [],
      areData: [], //区域数据
      CommuData: [], //社区数据
      jcsjly: [], //基础数据来源
      tabsActive: "table"
    };
  },
  components: {
    paging,
    BaseTextOverflow,
    BaseCoordinate
  },
  async created() {
    this.areData = await this.getArea(2);
    this.jcsjly = getDicData("jcsjly");
    this.getPoiForPage();
    console.log(this.jcsjly);
  },
  methods: {
    setTag(val) {},
    /**
     * @description 搜索
     */
    onSearch() {
      this.getPoiForPage();
    },
    /**
     * @description 重置表单
     * @param {String} 表单ref
     */
    resetForm(formName) {
      console.log(this.$refs[formName]);
      if (this.$refs[formName]) this.$refs[formName].resetFields();
      if (formName == "formInline") {
        this.getPoiForPage();
      }
    },
    /**
     * @description 格式化数据来源
     * @param {String} 字典id
     */
    sourceInfo(value) {
      let str = "未知";
      this.jcsjly.forEach(item => {
        if (item.value === value) {
          str = item.label;
        }
      });
      return str;
    },
    /**
     * @description 格式化数据来源颜色
     * @param {String} 字典id
     */
    sourceColor(value) {
      let str = "#fff";
      this.jcsjly.forEach(item => {
        if (item.value === value) {
          str = item.otherAttr;
        }
      });
      return str;
    },
    /**
     * @description 片区编辑
     * @param {Object} 片区数据
     */
    PoiEdit(data) {
      this.DialogForm = Object.assign(this.DialogForm, data);
      // this.DialogForm.SubDisName = this.setSubName(data);
      this.DialogForm.Coordinate = `${this.DialogForm.Baidu_lng},${
        this.DialogForm.Baidu_lat
      }`;
      this.dialogInfo = true;
    },
    /**
     * @description 设置街道名称
     * @param {Object} 片区数据
     */
    setSubName(data) {
      // let code = data.StrID.slice(0, 12);
      // console.log(code);
      let name = "";
      this.areData.map(item => {
        if (item.area_code === data.SubDisName) {
          name = item.area_name;
        }
      });
      return name;
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
     * @description Dialog弹窗事件
     * @param {Number} val 事件类型 1 取消 2同意
     */
    dialogClick(val) {
      switch (val) {
        case 0: //取消
          this.dialogInfo = false;
          this.resetForm("DialogForm");
          break;
        case 1: //确定
          this.savePoiClick("DialogForm");
          break;
        default:
          break;
      }
    },

    /**
     * @description 新增数据
     */
    handleAdd() {
      this.dialogInfo = true;
      this.resetForm("DialogForm");
      this.DialogForm = {
        POIName: "",
        // Alias: "",
        OldName: "",
        SubDisName: "",
        SubDisCode: "",
        Floor: "",
        Coordinate: "",
        // CommuName: "",
        // SHousenum: "",
        // LHousenum: "",
        // Beginning: "",
        // Ending: "",
        // Direction: "",
        // RouteName: "",
        DataSource: "",
        CommuCode: "",
        Note: ""
      };
    },
    /**
     * @description 删除操作
     * @param {Object} row|rows     行对象
     */
    deletePoi(data) {
      const _vm = this;
      this.$confirm("此操作将永久删除选择街道, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          _vm.delPoiById(data);
        })
        .catch(err => {});
    },

    /**
     * @description 通过id删除片区数据
     * @param {Object} data 区片数据
     */
    async delPoiById(data) {
      let vm = this;
      let param = {
        id: data.id
      };
      const Res = await this.$http.post("/geo/PoiController/delPoiById", param);
      if (Res && Res.data.success) {
        vm.dialogInfo = false;
        vm.$message.success("删除成功");
        vm.getPoiForPage();
      } else {
        vm.$message.error(Res.data.msg);
      }
    },
    /**
     * @description 通过区域分类信息
     * @param {Number} value 父id
     * @returns {Array} 区域数据
     */
    async getArea(value) {
      const Res = await this.$http.get(
        "/cms/AreaController/queryAreaByParentId",
        {
          params: {
            parent_id: value
          }
        }
      );
      console.log(Res);
      if (Res && Res.data.success) {
        return Res.data.result;
      } else {
        return [];
      }
    },
    /**
     * @description 区域选择change事件
     * @param {String} value 目前选中的值
     */
    async AreaSelectChange(value) {
      let checkData = this.areData.filter(item => {
        return item.area_name === value;
      });
      console.log(checkData);
      if (checkData instanceof Array && checkData.length > 0) {
        this.CommuData = await this.getArea(checkData[0].id);
        console.log(this.CommuData);
        // this.DialogForm.CommuName = "";
        this.DialogForm.SubDisCode = checkData[0].area_code;
      }
    },
    /**
     * @description 社区选择Change事件
     * @param {Number} value 目前选中的值
     */
    CommuNameSelectChange(value) {
      let checkData = this.CommuData.filter(item => {
        return item.area_name === value;
      });
      console.log(checkData);
      if (checkData instanceof Array && checkData.length > 0) {
        this.DialogForm.CommuCode = checkData[0].area_code;
      }
    },
    /**
     * @description 保存、编辑片区
     */
    savePoiClick(formName) {
      const vm = this;
      this.$refs[formName].validate(async function(valid) {
        if (valid) {
          console.log(vm.DialogForm);
          let arr = vm.DialogForm.Coordinate.split(",");
          vm.DialogForm.Baidu_lng = arr[0];
          vm.DialogForm.Baidu_lat = arr[1];
          if (vm.DialogForm.id) {
            //编辑
            vm.DialogForm.CHDate = new Date();
          } else {
            //新增
            vm.DialogForm.ORDate = new Date();
          }
          const Res = await vm.$http.post(
            "/geo/PoiController/doAddOrUpdate",
            vm.DialogForm
          );
          console.log(Res);
          if (Res && Res.data.success) {
            vm.dialogInfo = false;
            vm.$message.success("操作成功");
            vm.getPoiForPage();
          } else {
            vm.$message.error(Res.data.msg);
          }
        } else {
          console.log("提交错误");
          return false;
        }
      });
    },

    /**
     * @description 获取区片数据
     */
    async getPoiForPage() {
      let vm = this;
      let pas = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize,
        POIName: this.formInline.POIName
      };
      console.log(111, pas);
      const Res = await vm.$http.get("/geo/PoiController/doGetPoiListForPage", {
        params: pas
      });
      if (Res && Res.data.success) {
        // vm.$message.success("操作成功");
        this.loading = true;
        setTimeout(() => {
          let result = Res.data.result;
          vm.tabPage.totalNum = result.count;
          vm.poiList = result.rows;
          this.loading = false;
        }, 400);
      } else {
        vm.$message.error(Res.data.msg);
      }
    }
  }
};
</script>


<style lang="scss">
.geo-poi {
  .poi-table {
    .el-tag {
      color: #fff;
    }
  }
  .formStyle {
    .el-input,
    .el-textarea,
    .el-select {
      min-width: 210px;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>

