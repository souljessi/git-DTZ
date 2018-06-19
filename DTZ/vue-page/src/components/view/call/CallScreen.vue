<template>
  <div ref="callScreen" :class="['screenForm',isBomb?'screenActive':'']" v-show="screenStatus">
    <div class="form-left">
      <div class="form-user">
        <div>
          <!-- <span class="usdown" @click="setuseForm">
            <base-icon class="usdo-icon" icon='rightarrow' />
          </span>
          <span class="usname">{{callScreenData.real_name}}</span> -->

        </div>
        <div style="margin:20px 0;">
          <span style="font-size:18px">{{callScreenData.phone_num}}</span>
          <!-- <el-tooltip content="点击拨打电话" placement="top"> -->
          <span class="usphone" style="background:rgb(92, 184, 92)">
            <base-icon icon='phone' />
          </span>
          <!-- </el-tooltip> -->
          <!--<el-tooltip content="点击发送短信" placement="top">-->
          <!--<span class="usphone" style="background:rgb(137, 60, 160)">-->
          <!--<base-icon icon='duihua'/>-->
          <!--</span>-->
          <!--</el-tooltip>-->
          <!--<span class="ustag ustag-black">江苏</span>-->
          <span class="ustag ustag-red">{{callScreenData.call_province+callScreenData.call_city}}</span>
          <span class="ustag ustag-blue">{{callScreenData.call_corp}}</span>
        </div>
        <transition name="ustran">
          <div class="us-content" v-show="showuseForm">
            <div class="content-main">
              1231232
            </div>
          </div>
        </transition>

      </div>
      <el-tabs class="us-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first">
          <span slot="label">
            <base-icon icon='bangong' />客户资料</span>
          <div class="use-content">
            <div class="use-main">
              <div class="use-title">
                <div class="us1">
                  <span class="us-icon">
                    <base-icon icon='mingpian' />
                  </span>
                  基本信息
                </div>
                <div class="us2" @click="showMore">
                  <el-button plain>
                    <base-icon icon='tianxie' /> 填写更多信息
                  </el-button>
                </div>
              </div>
              <!--基本表单信息start-->
              <div class="customer-form">
                <el-form :model="customerForm" :rules="rules" ref="customerForm" size='mini' label-width="100px" class="demo-customerForm">
                  <el-form-item label="来电号码" prop="phone">
                    <el-input v-model="customerForm.phone = callScreenData.phone_num" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="客户姓名" prop="real_name">
                    <el-input v-model="customerForm.real_name"></el-input>
                  </el-form-item>
                  <el-form-item label="客户类型" prop="customer_type">
                    <el-select v-model="customerForm.customer_type" placeholder="请选择客户类型">
                      <el-option v-for="(item ,index) in khlx" :label="item.label" :value="Number(item.value)" :key="index">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="性别" v-show="isShowMore">
                    <el-select v-model="customerForm.gender" placeholder="请选择性别">
                      <el-option label="男" :value="1"></el-option>
                      <el-option label="女" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="年龄" v-show="isShowMore">
                    <el-input-number placeholder="" :min="0" :max="120" v-model="customerForm.age"></el-input-number>
                  </el-form-item>
                  <el-form-item label="地址" v-show="isShowMore">
                    <el-input v-model="customerForm.address"></el-input>
                  </el-form-item>
                  <el-form-item label="备注" v-show="isShowMore">
                    <el-input v-model="customerForm.remark" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitCustomerForm('customerForm')">保存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label">
            <base-icon icon='daibantwo' /> 工单
          </span>
          <div class="use-content">
            <div class="use-main">
              <div class="use-title">
                <div class="us1">
                  <span class="us-icon">
                    <base-icon icon='mingpian' />
                  </span>
                  基本信息
                </div>
              </div>
            </div>

            <!-- <div>
              <div>
                <el-input v-model="workerSearch" placeholder="搜索自信内容中的关键字...">
                  <div slot="append">
                    <div style="padding:5px 15px;">
                      <base-icon icon='search' />
                    </div>
                  </div>
                </el-input>
              </div>
            </div> -->
            <!-- <div style="margin-top:10px;display:flex;justify-content:flex-end">
              <div style="margin-bottom: 10px">
                <el-button size="mini" round @click="addWork">添加</el-button>
              </div>
            </div> -->
            <transition name="work">
              <div class="work-form">
                <el-form :model="workForm" :rules="rules" ref="workForm" size='mini' label-width="100px" class="demo-customerForm">
                  <el-form-item label="问题类型" prop="type">
                    <el-select v-model="workForm.type" placeholder="问题类型">
                      <el-option label="事件" :value="1"></el-option>
                      <el-option label="部件" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="大类" prop="parent_name">
                    <el-select @change="groupChange" v-model="workForm.parent_name" placeholder="大类">
                      <el-option v-for="item of bigGroup" :key="item.group_code" :label="item.group_name" :value="item.group_name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="小类" prop="sub_name">
                    <el-select @change="samllChange" v-model="workForm.sub_name" placeholder="大类">
                      <el-option v-for="item of smallGroup" :key="item.group_code" :label="item.group_name" :value="item.group_name"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="事发地点" prop="ObjPosition">
                    <base-baidu-search v-model="workForm.ObjPosition" @getPoint='getPosition'></base-baidu-search>
                    <!-- <el-input v-model="workForm.remark" type="textarea" :rows="2"></el-input> -->
                  </el-form-item>
                  <el-form-item label="问题描述" prop="remarks">
                    <el-input v-model="workForm.remarks" type="textarea" :rows="2"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitEvent('workForm')">流转</el-button>
                    <el-button type="primary" @click="resetFields('workForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </transition>

            <!-- <div class="use-main" style="margin-top:20px;">
            </div> -->
          </div>
        </el-tab-pane>
        <el-tab-pane name="fourth">
          <span slot="label">
            <base-icon icon='tonghua' />录音
          </span>

          <div class="use-content">
            <el-table :data="cdrData" :height="screenHeight-160" v-loading="Phoneloading">
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
              <!-- <el-table-column label="主叫号码" width="110px" prop="src"></el-table-column> -->
              <!-- <el-table-column label="省份" prop="call_province"></el-table-column> -->
              <!-- <el-table-column label="城市" prop="call_city"></el-table-column> -->
              <!-- <el-table-column label="运营商" prop='call_corp'></el-table-column> -->
              <!-- <el-table-column label="被叫" width="110px" prop='dst'></el-table-column> -->
              <el-table-column label="接通状态" :formatter="callStatusFormate" prop='call_status'></el-table-column>
              <!-- <el-table-column label="等待时长(秒)" prop='wait_time'></el-table-column> -->
              <!-- <el-table-column label="接通时长(秒)" prop='billsec'></el-table-column> -->
              <el-table-column label="录音" prop='recordingfile'>
                <template slot-scope="scope">
                  <el-button type="text" @click="recordingShow(scope.row)">播放</el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column label="技能组" prop='queue_id'></el-table-column> -->
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="form-right">
      <div>
        <div class="right-tool" style="color: #fff;background: #00c1de;">
          <div class="tool-item">
            <div class="tool-name">操作</div>
            <div class="tool-icon">

            </div>
          </div>
          <div>

          </div>
        </div>

        <div class="right-tool" @click="setBlock(blickType)">
          <div class="tool-item">
            <div class="tool-name">{{blickType==1?'加入黑名单':'删除黑名单'}}</div>
            <div class="tool-icon">
              <span class="tool-icon-for" style="background: #303133;">
                <base-icon icon='heimingd' />
              </span>
            </div>
          </div>
          <div>

          </div>
        </div>
        <!--<div class="right-tool">-->
        <!--<div class="tool-item">-->
        <!--<div class="tool-name">修改预约时间</div>-->
        <!--<div class="tool-icon">-->
        <!--<span class="tool-icon-for" style="background:#5cb85c">-->
        <!--<base-icon icon='tianxie'/>-->
        <!--</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div>-->

        <!--</div>-->
        <!--</div>-->
        <div class="right-tool">
          <div class="tool-item" v-show="customerForm.id" @click="deletCustomer(customerForm.id)">
            <div class="tool-name">删除</div>
            <div class="tool-icon">
              <span class="tool-icon-for" style="background:#f56c6c">
                <base-icon icon='lajit' />
              </span>
            </div>
          </div>
          <div>

          </div>
        </div>
      </div>

      <div class="right-info">
        <div class="right-info-item">
          <div class="tool-item">
            <div class="tool-item-name">上次打入时间:</div>
          </div>
          <div>
          </div>
        </div>
        <div class="right-info-item">
          <div class="tool-item">
            <div class="tool-item-name">{{ setData(customerForm.last_call_date) }} </div>
          </div>
          <div>
          </div>
        </div>
        <div>
          <el-button @click="closeScreen" type="success">关闭弹屏</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="录音播放" append-to-body width='30%' @close="wavClose" :visible.sync='recordVisible' :close-on-press-escape="false" :close-on-click-modal="false">
      <base-wavesurfer :src='wavSrc' :uniqueid='wavUniqueid' :phone='wavPhone' ref="wave"></base-wavesurfer>
    </el-dialog>
  </div>
</template>

<script>
import { getDicData, transData } from 'assets/js/commonManage.js';
import * as validateFun from 'assets/js/validateFun';
import BaseBaiduSearch from 'common/BaseBaiduSearch';
import moment from 'moment';
import config from 'view/call/config';
import { dateFormat } from 'assets/js/date';
import BaseWavesurfer from 'common/BaseWavesurfer';
export default {
  data() {
    return {
      blickType: 1, //黑名单状态  ，1 添加 2删除
      departData: [], //主管部门数据
      eventGroup: [], //事件分类
      callScreenData: {},
      isWork: false, //工单是否显示
      workForm: {
        type: 1, //默认事件
        parent_name: '', //大类
        sub_name: '', //小类
        ObjPosition: '',
        remarks: ''
      }, //工单
      customerForm: {
        phone: '',
        real_name: '',
        customer_type: 1,
        gender: 1,
        age: 0,
        address: '',
        remark: ''
      }, //客户资料表单
      khlx: [],
      isShowMore: false,
      isBomb: false, //弹屏动画
      screenStatus: true, //弹屏显示与隐藏
      activeName: 'first',
      callSearch: '',
      input: '',
      showuseForm: false,
      workerSearch: '',
      userInfoList: [
        { label: '号码', field: 'phone', value: '18500020068', isedit: false },
        { label: '客户类型', value: '短期无需求客户', isedit: false }
      ],
      userOtherList: [
        { label: '来源', value: '热线呼入', isedit: false },
        { label: '线索状态', value: '一般线索', isedit: false },
        { label: '线索状态', value: '一般线索', isedit: false },
        { label: '线索状态', value: '一般线索', isedit: false },
        { label: '线索状态', value: '一般线索', isedit: false }
      ],
      selectmodel: 1,
      select1: [
        { value: 1, label: '选项一' },
        { value: 2, label: '选项二' },
        { value: 3, label: '选项三' }
      ],
      formInfo: [
        // { label: "归属人", value: "管理员" },
        // { label: "归属部门", value: "办公室" },
        { label: '上次打进时间', value: '2016-11-11' }
        // { label: "上次接线员", value: "2016-11-20" },
        // { label: "预约日期", value: "2016-10-01" }
      ],
      rules: {
        age: [{ validator: validateFun.Number, trigger: 'blur' }],
        ObjPosition: [
          { required: true, message: '事发地点不能为空', trigger: 'blur' }
        ]
      },
      cdrData: [], //通话流水
      Phoneloading: false,
      screenHeight: document.body.clientHeight - 160,
      wavSrc: '', //音频路径
      wavUniqueid: '',
      wavPhone: '', //音频电话
      recordVisible: false
    };
  },
  components: {
    BaseBaiduSearch,
    BaseWavesurfer
  },
  // props: {
  //   bomb: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  directives: {
    focus: {
      update: function(el, { value }) {
        console.log('focus');
        if (value) {
          el.focus();
        }
      }
    }
  },
  computed: {
    bigGroup() {
      return this.eventGroup.filter(item => {
        return item.group_level == 1;
      });
    },
    smallGroup() {
      let parent = this.eventGroup.filter(item => {
        return item.group_name == this.workForm.parent_name;
      });
      if (parent.length > 0) {
        const data = this.eventGroup.filter(item => {
          return item.parent_id == parent[0].id;
        });
        return data;
      } else {
        return [];
      }
    },
    /**
     * 弹屏用户数据
     */
    callScreenMsg() {
      let arr = this.$store.getters.getCallScreen;
      if (Array.isArray(arr) && arr.length > 0) {
        //判断是否存在数据，不存在则初始化为空对象
        return arr[0];
      } else {
        return {};
      }
    }
  },
  watch: {
    //弹屏消息
    callScreenMsg() {
      this.opnScreen();
    }
  },

  methods: {
    opnScreen() {
      this.isBomb = true; //弹屏
      this.callScreenData = Object.assign({}, this.callScreenMsg);
      this.getCustomer(this.callScreenData.phone_num);
      this.$emit('isBomb', this.isBomb);
      this.resetFields('workForm');
      this.resetFields('customerForm');
      this.findCdr();
      this.getBlackData();
    },
    //查询黑名单
    async getBlackData() {
      let params = {};
      params.phone = this.callScreenData.phone_num;
      const Res = await this.$http.post(
        '/call/CallController/getBlockPhone',
        params,
        {
          isOut: true
        }
      );
      console.log(Res);
      if (Res.data.error == 0) {
        this.blickType = 2;
        Res.data.data != null ? (this.blickType = 2) : (this.blickType = 1);
        // this.blackList = Res.data.data;
        // this.$message.success("查询成功");
        // this.cdrData = Res.data.data;
      } else {
        this.$message.error(Res.data.msg);
      }
    },
    /**
     * 黑名单设置
     * @param {Number} type 1添加黑名单  2去除黑名单
     */
    async setBlock(type) {
      const tip =
        type == 1
          ? '此操作将加入黑名单, 是否继续？'
          : '此操作将删除黑名单, 是否继续?';
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.saveBlocl(type);
        })
        .catch(() => {});
    },
    async saveBlocl(type) {
      const params = {
        phone: this.callScreenData.phone_num,
        user_name: this.customerForm.real_name,
        type: type
      };

      const Res = await this.$http.post(
        '/call/CallController/saveBlockPhone',
        params,
        {
          isOut: true
        }
      );
      console.log(Res.data);
      if (Res.data.error == 0) {
        let str = type == 1 ? '添加成功' : '删除成功';
        this.$message.success(str);
        this.blickType = type == 1 ? 2 : 1;
        // this.cdrData = Res.data.data;
      } else {
        this.$message.error(Res.data.msg);
      }
    },
    wavClose() {
      this.$refs.wave.pause();
      this.$refs.wave.rest();
      this.$refs.wave.wavesurfer.seekTo(0);
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
    /**
     * 表格日期格式化
     */
    dataFormate(row, column, cellValue, index) {
      var date = new Date(parseInt(row.call_time) * 1000);
      var fm = dateFormat(date, 'yyyy-MM-dd hh:mm');
      return fm;
    },
    iconFormate(row, column, cellValue, index) {
      let str = 'type-green';
      switch (parseInt(row.call_type)) {
        case 331: //呼入
          if (row.call_status == 334) {
            str = 'type-red';
          } else {
            str = 'type-green';
          }
          break;
        case 332: //呼出
          if (row.call_status == 341) {
            str = 'type-red2';
          } else {
            str = 'type-blue';
          }
          break;

        default:
          break;
      }
      return str;
    },
    callStatusFormate(row, column, cellValue, index) {
      let str = '未知';
      for (const item of config.callStatus) {
        if (item.value == row.call_status) str = item.label;
      }
      return str;
    },
    callTypeFormate(row, column, cellValue, index) {
      let str = '未知';
      for (const item of config.callType) {
        if (item.value == row.call_type) str = item.label;
      }
      return str;
    },
    //查询通话流水
    async findCdr() {
      const params = {
        // exten:this.callScreenData.exten,
        phone_num: this.callScreenData.phone_num
      };
      this.Phoneloading = true;
      const Res = await this.$http.post(
        '/call/CallController/cdrData',
        params,
        {
          isOut: true
        }
      );
      if (Res.data.error == 0) {
        this.cdrData = Res.data.data;
      } else {
        this.$message.error(Res.data.msg);
      }
      this.Phoneloading = false;
    },

    setData(data) {
      if (data) {
        return moment(data).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return '暂无';
      }
      return data || '暂无';
    },
    /**
     * 删除客户
     */
    async deletCustomer(id) {
      const VM = this;
      VM.$confirm('此操作将永久删除当前客户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const Res = await VM.$http.post(
          'call/CallCustomerController/doDeleteCustomerById',
          {
            id: id
          }
        );
        if (Res.data.success) {
          VM.$message.success('删除成功');
          VM.closeScreen();
          VM.customerForm = {
            phone: '',
            real_name: '',
            customer_type: 1,
            gender: 1,
            age: 0,
            address: '',
            remark: ''
          };
        } else {
          VM.$message.error('操作失败，请重试');
        }
      });
    },
    /**
     * 关闭弹屏
     */
    closeScreen() {
      this.$emit('isBomb', false);
      this.isBomb = false; //弹屏
    },
    groupChange(val) {
      console.log(val);
      for (const item of this.bigGroup) {
        if (item.group_name == val) this.workForm.group_code = item.group_code;
      }
      this.workForm.sub_name = '';
    },
    samllChange(val) {
      for (const item of this.smallGroup) {
        if (item.group_name == val) this.workForm.group_code = item.group_code;
      }
    },
    getPosition(opint) {
      console.log(opint);
      this.workForm.baidu_x = opint.lng;
      this.workForm.baidu_y = opint.lat;
      const Opt = {
        lng: opint.lng,
        lat: opint.lat
      };
      this.getareaAndBGID(Opt);
    },
    async getareaAndBGID(point) {
      const Res = await this.$http.post(
        '/cms/CellController/queryAreaAndBGIDByCoordinate',
        {
          point: point
        }
      );
      console.log(Res);
      if (Res && Res.data.success) {
        const data = Res.data.result;
        if (data.area.length > 0) {
          this.workForm.area_code = data.area[0].area_code;
          if (data.cell.length > 0) {
            this.workForm.BGID = data.cell[0].BGID;
          } else {
            this.workForm.BGID = undefined;
          }
        } else {
          this.workForm.area_code = undefined;
          this.workForm.BGID = undefined;
        }
      } else {
        this.$message.warn('查询失败');
      }
    },
    /**
     * 获取事件分类
     */
    async getEventGroup() {
      let result = await this.$http.get(
        '/cms/EventGroupController/eventGroupAll'
      );

      if (result.data.success) {
        this.eventGroup = result.data.result;
      } else {
        this.$message.warn('查询失败');
      }
    },
    async getCustomer(phone) {
      const Res = await this.$http.get(
        'call/CallCustomerController/doGetCustomerListByPhone',
        {
          params: {
            phone: phone
          }
        }
      );
      if (Res && Res.data.success) {
        if (Res.data.result) {
          this.customerForm = Object.assign(this.customerForm, Res.data.result);
        }
      } else {
        this.$message.error('操作失败，请重试');
      }
      console.log(Res);
    },
    addWork() {
      this.isWork = this.isWork ? false : true;
    },
    //填写更多
    showMore() {
      this.isShowMore = this.isShowMore ? false : true;
    },
    //客户资料提交
    async submitCustomerForm() {
      const data = this.customerForm;
      data.operator_id = this.$getUserData('id');
      data.last_call_date = new Date();
      if (!data.id) data.source = 1;
      try {
        const res = await this.$http.post(
          '/call/CallController/saveCustomer',
          data
        );
        if (res.data.success) {
          this.dialogInfo = false;
          this.$message.success(res.data.msg);
          if (!data.id) this.customerForm = Object.assign({}, res.data.result);
        } else {
          this.$message.warning(res.data.msg);
        }
      } catch (err) {
        this.$message.error('保存失败');
      }
    },

    async submitEvent(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(2222);
          const data = this.workForm;
          data.create_by = this.$getUserData('id');
          data.create_date = new Date();
          data.source = 3;
          console.log(data);
          const Res = await this.$http.post(
            '/cms/EventController/allEventReport',
            data
          );
          console.log(Res);
          if (Res && Res.data.success) {
            this.$message.success('保存成功');
            this.$refs[formName].resetFields();
          } else {
            this.$message.error('保存失败');
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetFields(formName) {
      this.$refs[formName].resetFields();
    },
    setEdit(data) {
      data.isedit = data.isedit ? false : true;
      console.log(data.isedit);
    },
    setuseForm() {
      this.showuseForm = this.showuseForm ? false : true;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    delFs() {
      this.$http.post('http://172.16.187.83:8888/index/delFile', {
        realpath: 'static/upload/images/20180330115443e17eb459.png'
      });
    }
  },
  mounted() {
    const vm=this;
    vm.khlx = getDicData('khlx');
    vm.getEventGroup();
    if (vm.$route.query.id) {
      vm.$nextTick(function() {
        setTimeout(() => {
          vm.opnScreen();
        }, 1000);
      });
    }
  }
};
</script>

<style lang="scss">
$workHeight: 358px;
.screenForm {
  position: absolute;
  top: 0px;
  right: -890px;
  // width: 50%;
  min-width: 860px;
  background: #fff;
  z-index: 100;
  display: flex;
  padding: 10px 10px 10px 20px;
  transition: all 0.4s;
  // border: 1px solid red;
  box-shadow: -5px 0px 10px rgba(6, 6, 6, 0.17);
  overflow: auto;
  height: calc(100vh - 125px);
  .form-left {
    flex: 1;
    padding-right: 40px;
    .form-user {
      .usdown {
        color: #fff;
        padding: 0 3px;
        font-size: 20px;
        border-radius: 50%;
        background: #66b1ff;
        .usdo-icon {
          transform: rotate(90deg);
        }
        &:hover {
          cursor: pointer;
        }
      }
      .us-content {
        // margin-top: 10px;

        // padding: 10px;
        transition: all 0.4s;
        border: 1px solid #e0dddd;
        height: 200px;
        .content-main {
          // height: 100%;
          padding: 10px;
          // border: 1px solid #e0dddd;
        }
      }

      .work-enter-active {
        animation: workent 0.4s 0s 1 both;
      }
      .work-leave-active {
        animation: workout 0.4s 0s 1 both;
      }
      @keyframes workent {
        from {
          opacity: 0;
          transform: scaleY(0);
        }
        to {
          opacity: 1;
          transform: scaleY(1);
        }
      }

      .ustran-enter-active {
        animation: ustranEnt 0.3s 0s 1 both;
      }
      .ustran-leave-active {
        animation: ustranOut 0.3s 0s 1 both;
      }
      @keyframes ustranEnt {
        from {
          opacity: 0;
          height: 0px;
        }
        to {
          opacity: 1;
          height: 200px;
        }
      }
      @keyframes ustranOut {
        from {
          opacity: 1;
          height: 200px;
        }
        to {
          opacity: 0;
          height: 0px;
        }
      }
      .usname {
        color: #777777;
        font-size: 20px;
      }

      .usphone {
        font-size: 16px;
        padding: 3px 6px;
        color: #fff;
        border-radius: 50%;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .us-tabs {
      color: #777777;
      margin-top: 20px;
      margin-left: 10px;
      .el-tabs__content {
        overflow: visible;
      }
      .callContent {
        margin-top: 10px;
        .call {
          display: flex;
          margin-bottom: 20px;
          .call-left {
            width: 50px;
            height: 50px;

            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }
          .call-right {
            flex: 1;
            margin-left: 15px;
            .user {
              font-size: 18px;
              font-weight: bold;
              color: #606266;
            }
          }
        }
      }
      .el-input-group__append,
      .el-input-group__prepend {
        padding: 0px;
      }
      .el-select {
        width: 130px;
      }
      .el-tabs__nav-wrap::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 5px;
        background-color: #409eff;
        z-index: 1;
      }
      .el-tabs__item {
        padding: 0 20px;
      }
      .el-tabs__item.is-active {
        color: #ecf5ff;
        background: #409eff;
      }
      .use-content {
        padding: 10px 0;
        .use-title {
          display: flex;
          justify-content: space-between;
          .us1 {
            flex: 1;
            font-size: 18px;
            color: #303133;
          }
          .us2 {
            text-align: right;
            flex: 1;
          }
          .us-icon {
            color: #fff;
            padding: 2px 5px;
            border-radius: 50%;
            background: #66b1ff;
          }
        }
        .use-main {
          border-top: 1px solid #ccc;
          padding: 20px 10px;
          .customer-form {
            margin-top: 20px;
          }

          .form {
            display: flex;
            margin: 15px 0;
            height: 28px;
            line-height: 28px;
            .form-label {
              width: 130px;
            }
            .form-input {
              flex: 1;
              .input-border {
                padding: 4px 20px 4px 0;
                // border-style: dashed;
                border-bottom: 1px dashed #00c1de;
              }
              input {
                color: #777777;
                padding-left: 10px;
                height: 25px;
                line-height: 25px;
                outline: none;
              }
            }
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
    }
    .ustag {
      color: #fff;
      padding: 2px 13px;
      border-radius: 10px;
    }
    .ustag-blue {
      background: #66b1ff;
    }
    .ustag-red {
      background: #f56c6c;
    }
    .ustag-black {
      background: #cccc;
    }
  }
  .form-right {
    width: 200px;
    .right-tool {
      border: 1px solid #ccc;
      border-bottom: 0px;
      &:last-child {
        border-bottom: 1px solid #ccc;
      }
      .tool-item {
        display: flex;
        height: 40px;
        line-height: 40px;
        .tool-name {
          flex: 1;
          padding-left: 10px;
        }
        .tool-icon {
          text-align: center;
          width: 40px;
          .tool-icon-for {
            color: #fff;
            height: 30px;
            padding: 3px 5px;
            border-radius: 50%;
          }
        }
        &:hover {
          cursor: pointer;
          color: #1d1d1d;
          background: #e8e8e8;
        }
      }
    }
    .right-info {
      margin-top: 20px;
      .right-info-item {
        border: 1px solid rgba(204, 204, 204, 0.36);
        border-bottom: 0px;
        &:last-child {
          border-bottom: 1px solid rgba(204, 204, 204, 0.36);
        }
        &:nth-child(2n) {
          border: 1px solid rgba(204, 204, 204, 0.36);
          background: #eaeaea;
        }
      }
      .tool-item {
        display: flex;
        height: 40px;
        line-height: 40px;

        .tool-item-name {
          flex: 1;
          padding-left: 10px;
        }
      }
    }
  }
}

.work-enter-active {
  animation: workent 0.4s 0s 1 both;
  transform-origin: 100% 0;
}
.work-leave-active {
  animation: workout 0.4s 0s 1 both;
  transform-origin: 100% 0;
}
@keyframes workent {
  from {
    opacity: 0;
    height: 0;
    // transform: scaleY(0);
  }
  to {
    opacity: 1;
    height: $workHeight;
    // transform: scaleY(1);
  }
}
@keyframes workout {
  from {
    opacity: 1;
    // transform: scaleY(1);
    height: $workHeight;
  }
  to {
    opacity: 0;
    // transform: scaleY(0);
    height: 0;
  }
}
.screenActive {
  right: 0px;
}
</style>
