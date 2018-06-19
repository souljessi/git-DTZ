<template>
  <div class="geo-house">
    <!--查询-->
    <el-form :inline="true" :model="formInline" class="form-inline" ref="formInline">
      <el-form-item label="门(楼)牌名称" prop="AddName">
        <el-input v-model="formInline.AddName" placeholder="门(楼)牌名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-genre="'read'" icon="el-icon-search" @click="onSearch()">查询</el-button>
        <el-button type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
      <el-form-item style="margin-left: 30px">
        <el-button type="success" v-genre="'create'" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" class="house-table" :height="screenHeight-110" border :data="houseList" style="width: 100%">
      <el-table-column label="" prop="AddName" width="110" label="门(楼)牌名称"></el-table-column>
      <!-- <el-table-column label="" prop="ZoneID" width="110" label="标识码" sortable></el-table-column> -->
      <!-- <el-table-column label="" prop="Alias" label="别名"></el-table-column> -->
      <!-- <el-table-column label="" prop="OldName" label="曾用名"></el-table-column> -->
      <el-table-column label="" prop="SubDisName" label="所在街道名称">
      </el-table-column>
      <!-- <el-table-column label="" prop="SubDisCode" label="所在街道代码" sortable></el-table-column> -->
      <el-table-column label="" prop="CommuName" label="所在社区名称"></el-table-column>
      <!-- <el-table-column label="" prop="CommuCode" label="社区编号" sortable></el-table-column> -->
      <el-table-column label="" prop="RoadName" label="所在街巷"></el-table-column>
      <el-table-column label="" prop="ZoneName" label="所在地片区片"></el-table-column>
      <el-table-column label="" prop="HouseNum" label="门(楼)牌号"></el-table-column>
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
          <el-button type="primary" v-genre="'update'" @click='HouseEdit(scope.row)'>编辑</el-button>
          <el-button type="danger" v-genre="'delete'" @click="deleteHouse(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum">
    </paging>
    <el-dialog class="childDialog" v-bind:title="formTitle" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('DialogForm')" width="50%">
      <el-form :model="DialogForm" :inline="true" :rules="this.$validateRule" ref="DialogForm" label-width="120px" class="formStyle">
        <el-form-item label="门(楼)牌名称" prop="AddName">
          <el-input v-model="DialogForm.AddName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="别名" prop="Alias">
          <el-input v-model="DialogForm.Alias"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="曾用名" prop="OldName">
          <el-input v-model="DialogForm.OldName"></el-input>
        </el-form-item> -->

        <el-form-item label="所在街道名称" prop="SubDisName">
          <el-select v-model="DialogForm.SubDisName" placeholder="请选择街道" @change='AreaSelectChange'>
            <el-option v-for="(item,index) in areData" :key="index" :label="item.area_name" :value="item.area_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在社区名称" prop="CommuName">
          <el-select :disabled="DialogForm.SubDisName==''" v-model="DialogForm.CommuName" placeholder="请选择社区" @change='CommuNameSelectChange'>
            <el-option v-for="(item,index) in CommuData" :key="index" :label="item.area_name" :value="item.area_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在街巷" prop="RoadName">
          <el-select :disabled="DialogForm.SubDisName==''" v-model="DialogForm.RoadName" placeholder="请选择街巷">
            <el-option v-for="(item,index) in roadList" :key="index" :label="item.StrName" :value="item.StrName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在区片地片" prop="ZoneName">
          <el-select no-data-text='当前社区下暂无地片数据，请从新选择社区' :disabled="DialogForm.SubDisName==''||DialogForm.CommuName==''" v-model="DialogForm.ZoneName" @change='ZoneSelectChange' placeholder="请选择区片地片">
            <el-option v-for="(item,index) in zoneList" :key="index" :label="item.ZoneName" :value="item.ZoneName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门(楼)牌号" prop="HouseNum">
          <el-input v-model="DialogForm.HouseNum" placeholder="请输入(门)楼牌号"></el-input>
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
      screenHeight: document.body.clientHeight - 100,
      formInline: {
        AddName: ""
      },
      DialogForm: {
        AddName: "",
        SubDisName: "",
        SubDisCode: "",
        CommuName: "",
        CommuCode: "",
        RoadName: "",
        Coordinate: "",
        ZoneName: "",
        HouseNum: "",
        DataSource: "",
        Note: ""
      },
      formTitle: "门(楼)牌新增",
      dialogInfo: false,
      tabPage: {
        //分页
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
      }, //分页信息
      roadList: [],
      houseList: [],
      zoneList: [],
      areData: [], //区域数据
      CommuData: [], //社区数据
      jcsjly: [] //基础数据来源
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
    this.getHouseForPage();
    console.log(this.jcsjly);
  },
  methods: {
    setTag(val) {},
    /**
     * @description 搜索
     */
    onSearch() {
      this.getHouseForPage();
    },
    /**
     * @description 重置表单
     * @param {String} 表单ref
     */
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields();

      if (formName == "formInline") {
        this.getHouseForPage();
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
    HouseEdit(data) {
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
          this.saveHouseClick("DialogForm");
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
        AddName: "",
        SubDisName: "",
        SubDisCode: "",
        CommuName: "",
        CommuCode: "",
        Coordinate: "",
        RoadName: "",
        ZoneName: "",
        HouseNum: "",
        DataSource: "",
        Note: ""
      };
    },
    /**
     * @description 删除操作
     * @param {Object} row|rows     行对象
     */
    deleteHouse(data) {
      const _vm = this;
      this.$confirm("此操作将永久删除选择街道, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          _vm.delHouseById(data);
        })
        .catch(err => {});
    },

    /**
     * @description 通过id删除片区数据
     * @param {Object} data 区片数据
     */
    async delHouseById(data) {
      let vm = this;
      let param = {
        id: data.id
      };
      const Res = await this.$http.post(
        "/geo/HouseController/delHouseById",
        param
      );
      if (Res && Res.data.success) {
        vm.dialogInfo = false;
        vm.$message.success("删除成功");
        vm.getHouseForPage();
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
      this.DialogForm.ZoneName = "";
      this.DialogForm.CommuName = "";
      this.DialogForm.CommuCode = "";
      this.DialogForm.RoadName = "";
      this.getZoneInfo();
      this.getRoadInfo();
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
      this.getZoneInfo();
      this.DialogForm.ZoneName = "";
    },
    ZoneSelectChange(value) {
      // let checkData = this.zoneList.filter(item => {
      //   return item.ZoneName === value;
      // });
      //  if (checkData instanceof Array && checkData.length > 0) {
      //   this.DialogForm.CommuCode = checkData[0].area_code;
      // }
    },
    /**
     * @description 通过SubDisCode和CommuCode查询区片数据
     */
    async getZoneInfo() {
      let Res = await this.$http.get(
        "/geo/ZoneController/getZoneBySubComCode",
        {
          params: {
            SubDisCode: this.DialogForm.SubDisCode,
            CommuCode: this.DialogForm.CommuCode
          }
        }
      );
      if (Res && Res.data.success) {
        this.zoneList = Res.data.result;
      } else {
        vm.$message.error(Res.data.msg);
      }
    },

    /**
     * @description 通过SubDisCode查询街巷数据
     */
    async getRoadInfo() {
      let Res = await this.$http.get("/geo/RoadController/getRoadBySubCode", {
        params: {
          SubDisCode: this.DialogForm.SubDisCode
        }
      });
      if (Res && Res.data.success) {
        this.roadList = Res.data.result;
      } else {
        vm.$message.error(Res.data.msg);
      }
    },
    /**
     * @description 保存、编辑片区
     */
    saveHouseClick(formName) {
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
            "/geo/HouseController/doAddOrUpdate",
            vm.DialogForm
          );
          console.log(Res);
          if (Res && Res.data.success) {
            vm.dialogInfo = false;
            vm.$message.success("操作成功");
            vm.getHouseForPage();
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
    async getHouseForPage() {
      let vm = this;
      let pas = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize,
        AddName: this.formInline.AddName
      };
      const Res = await vm.$http.get(
        "/geo/HouseController/doGetHouseListForPage",
        {
          params: pas
        }
      );
      if (Res && Res.data.success) {
        this.loading = true;
        // vm.$message.success("操作成功");
        setTimeout(() => {
          let result = Res.data.result;
          vm.tabPage.totalNum = result.count;
          vm.houseList = result.rows;
          this.loading=false;
        }, 400);
      } else {
        vm.$message.error(Res.data.msg);
      }
    }
  }
};
</script>


<style lang="scss">
.geo-house {
  .house-table {
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

