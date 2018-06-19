<template>
  <div class="call-water">
    <div class="call-head">
      <div v-for="item in titleData" :key="item.id" :class="['call-head-button',titleActive==item.id?'active':'']" @click="setActiveTitle(item)">{{item.name}}</div>
    </div>
    <div class="h"></div>
    <div class="all-water" v-show="titleActive==6">
      <div class="all-time">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="pickTIme" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
        </el-date-picker>
      </div>
      <div class="all-input">
        <el-input placeholder="请输入内容" v-model="waterPhone">
          <template slot="prepend">电话号码</template>
        </el-input>
      </div>
      <div>
        <el-button type="primary" @click="queryCdr">超级查询</el-button>
        <el-button type="success" @click="excelOut">导出Excel</el-button>
      </div>
    </div>
    <el-table :data="cdrData" id="cdrRef" :height="screenHeight-110" v-loading="loading">
      <el-table-column label="" fixed width="40px">
        <template slot-scope="scope">
          <div class="tip-item">
            <a :class="['type',iconFormate(scope.row)]">
              <base-icon icon='jiantou' />
            </a>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="130px" :formatter='dataFormate'></el-table-column>
      <el-table-column label="类型" :formatter='callTypeFormate' sortable></el-table-column>
      <el-table-column label="主叫号码" width="110px" prop="src"></el-table-column>
      <!-- <el-table-column label="省份" prop="call_province"></el-table-column> -->
      <!-- <el-table-column label="城市" prop="call_city"></el-table-column> -->
      <!-- <el-table-column label="运营商" prop='call_corp'></el-table-column> -->
      <el-table-column label="被叫号码" width="110px" prop='dst'></el-table-column>
      <el-table-column label="接通状态" :formatter="callStatusFormate" prop='call_status'></el-table-column>
      <el-table-column label="等待时长(秒)" prop='wait_time'></el-table-column>
      <el-table-column label="接通时长(秒)" prop='billsec'></el-table-column>
      <el-table-column label="录音" prop='recordingfile'>
        <template slot-scope="scope">
          <el-button type="text" @click="recordingShow(scope.row)">播放</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="技能组" prop='queue_id'></el-table-column> -->
    </el-table>
    <el-dialog title="录音播放" width='30%' @close="wavClose" :visible.sync='recordVisible' :close-on-press-escape="false" :close-on-click-modal="false">
      <base-wavesurfer :src='wavSrc' :uniqueid='wavUniqueid' :phone='wavPhone' ref="wave"></base-wavesurfer>
    </el-dialog>
  </div>
</template>

<script>
import paging from "common/BasePaging.vue";
import config from "view/call/config";
import {
  dateFormat,
  getDaysBefore,
  getPreMonth,
  getWeekStartDate,
  getCurrentMonthFirst
} from "assets/js/date";

import { cutValue } from "assets/js/commonManage";
import BaseWavesurfer from "common/BaseWavesurfer";
// import FileSaver from "file-saver";
// import XLSX from "xlsx";

require("script-loader!file-saver");
require("script-loader!assets/js/Blob");
require("script-loader!xlsx/dist/xlsx.core.min");

//今天
const nowDate = {
  startTime: dateFormat(new Date(), "yyyy-MM-dd") + " 00:00:00",
  endTime: dateFormat(new Date(), "yyyy-MM-dd") + " 23:59:59"
};

const threeDate = {
  startTime: getDaysBefore(3, new Date()) + " 00:00:00",
  endTime: dateFormat(new Date(), "yyyy-MM-dd") + " 23:59:59"
};

const weekData = {
  startTime: getWeekStartDate() + " 00:00:00",
  endTime: dateFormat(new Date(), "yyyy-MM-dd") + " 23:59:59"
};
const monData = {
  startTime: dateFormat(getCurrentMonthFirst(), "yyyy-MM-dd") + " 00:00:00",
  endTime: dateFormat(new Date(), "yyyy-MM-dd") + " 23:59:59"
};
const threeMonData = {
  startTime: getPreMonth(2, new Date()) + " 00:00:00",
  endTime: dateFormat(new Date(), "yyyy-MM-dd") + " 23:59:59"
};
export default {
  data() {
    return {
      wavUniqueid: "",
      allSelectTime: {},
      pickTIme: "",
      loading: false,
      cdrData: [],
      recordVisible: false,
      wavSrc: "",
      wavPhone: 0, //音频中电话
      waterPhone: "", //查询电话
      screenHeight: document.body.clientHeight - 50,
      titleActive: 1,
      titleData: [
        {
          id: 1,
          name: "今日流水"
        },
        {
          id: 2,
          name: "近三日流水"
        },
        {
          id: 3,
          name: "本周流水"
        },
        {
          id: 4,
          name: "本月流水"
        },
        {
          id: 5,
          name: "近三月流水"
        },
        {
          id: 6,
          name: "全部流水"
        }
      ],
      tabPage: {
        //分页
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
      }, //分页信息
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  components: {
    paging,
    BaseWavesurfer
  },
  created() {
    this.findCdr(nowDate);
  },
  watch: {
    pickTIme(neval) {
      if (neval instanceof Array) {
        this.allSelectTime.startTime = neval[0];
        this.allSelectTime.endTime = neval[1];
      } else {
        this.allSelectTime = {};
      }
    }
  },
  methods: {
    queryCdr() {
      let data = Object.assign({}, this.allSelectTime);
      if (this.waterPhone != "") data.phone_num = this.waterPhone;
      this.findCdr(data);
    },
    excelOut() {
      require.ensure([], () => {
        let colList = [
          { lable: "日期", key: "callTime" },
          { lable: "类型", key: "callType" },
          { lable: "主叫号码", key: "src" },
          { lable: "被叫号码", key: "dst" },
          { lable: "接通状态", key: "callStatus" },
          { lable: "等待时长(秒)", key: "wait_time" },
          { lable: "接通时长(秒)", key: "billsec" }
        ];
        let List = Object.assign([], this.cdrData).map(item => {
          item.callTime = dateFormat(
            new Date(parseInt(item.call_time) * 1000),
            "yyyy-MM-dd hh:mm"
          );
          for (const item2 of config.callType) {
            if (item2.value == item.call_type) item.callType = item2.label;
          }
          for (const item3 of config.callStatus) {
            if (item3.value == item.call_status) item.callStatus = item3.label;
          }
          return item;
        });

        const { export_json_to_excel } = require("assets/js/Export2Excel");
        const tHeader = cutValue(colList, "lable");
        const filterVal = cutValue(colList, "key");
        const data = this.formatJson(filterVal, List);
        export_json_to_excel(tHeader, data, "通话流水");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    /**
     * 查询通话流水
     */
    async findCdr(data = {}) {
      if (this.waterPhone.length > 0) {
        console.log(this.waterPhone);
        data.phone_num = this.waterPhone.toString();
      }
      this.loading = true;
      this.cdrData = [];
      const Res = await this.$http.post("/call/CallController/cdrData", data, {
        isOut: true
      });

      console.log(Res);
      if (Res.data.error == 0) {
        this.cdrData = Res.data.data;
      } else {
        this.$message.error(Res.data.msg);
      }
      this.loading = false;
    },
    recordingShow(data) {
      this.wavSrc = config.callCenterPath + data.recordingfile;
      this.wavUniqueid = Number(data.uniqueid);
      if (data.call_type == 331) {
        this.wavPhone = Number(data.src);
      } else {
        this.wavPhone = Number(data.dst);
      }
      this.recordVisible = true;
    },
    wavClose() {
      this.$refs.wave.pause();
      this.$refs.wave.rest();
      this.$refs.wave.wavesurfer.seekTo(0);
    },
    setActiveTitle(data) {
      this.titleActive = data.id;
      this.screenHeight = document.body.clientHeight - 50;
      let params = {};
      this.pickTIme = "";
      this.waterPhone = "";
      switch (Number(data.id)) {
        case 1:
          params = nowDate;
          break;
        case 2:
          params = threeDate;
          break;
        case 3:
          params = weekData;
          break;
        case 4:
          params = monData;
          break;
        case 5:
          params = threeMonData;
          break;
        case 6:
          this.screenHeight = document.body.clientHeight - 100;
          this.params = {};
          break;
        default:
          params = {};
          break;
      }
      this.findCdr(params);
    },
    /**
     * 表格日期格式化
     */
    dataFormate(row, column, cellValue, index) {
      var date = new Date(parseInt(row.call_time) * 1000);
      var fm = dateFormat(date, "yyyy-MM-dd hh:mm");
      return fm;
    },
    callStatusFormate(row, column, cellValue, index) {
      let str = "未知";
      for (const item of config.callStatus) {
        if (item.value == row.call_status) str = item.label;
      }
      return str;
    },
    callTypeFormate(row, column, cellValue, index) {
      let str = "未知";
      for (const item of config.callType) {
        if (item.value == row.call_type) str = item.label;
      }
      return str;
    },
    iconFormate(row, column, cellValue, index) {
      let str = "type-green";
      switch (parseInt(row.call_type)) {
        case 331: //呼入
          if (row.call_status == 334) {
            str = "type-red";
          } else {
            str = "type-green";
          }
          break;
        case 332: //呼出
          if (row.call_status == 341) {
            str = "type-red2";
          } else {
            str = "type-blue";
          }
          break;

        default:
          break;
      }
      return str;
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
    }
  }
};
</script>


<style lang="scss">
$title-color: #409eff;
.call-water {
  font-size: 14px;
  .call-head {
    display: flex;
    .call-head-button {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      &:hover {
        cursor: pointer;
        color: $title-color;
      }
    }
    .active {
      background: $title-color;
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
  }
  .h {
    height: 4px;
    background: $title-color;
  }
  .all-water {
    display: flex;
    padding: 10px 5px;
    .all-time {
      width: 420px;
    }
    .all-input {
      width: 300px;
    }
  }

  .tip-item {
    .type {
      font-size: 14px;
      color: #fff;
      height: 50px;
      padding: 2px 6px;
    }
    .type-green {
      background: #5cb85c;
    }
    .type-blue {
      background: #5bc0de;
      .svg-icon {
        transform: rotate(180deg);
      }
    }
    .type-red {
      background: #d9534f;
    }
    .type-red2 {
      background: #d9534f;
      .svg-icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
