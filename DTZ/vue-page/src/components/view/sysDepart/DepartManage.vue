<template>
  <div>
    <div class="tabPosition" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form>
            <el-form-item>
              <el-button type="success" icon="el-icon-plus" :disabled="controller" @click="handleAdd">新增</el-button>
              <el-button type="danger" icon="el-icon-delete" :disabled="!pitchData.id" @click="handleDelete">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-input v-model="filterText" placeholder="检索组织机构" clearable></el-input>
            </el-form-item>
          </el-form>
          <div class="left-tree" v-bind:style="{height:screenHeight-110+'px'}">
            <el-tree :data="orgTreeData" default-expand-all :expand-on-click-node="false" node-key="id" ref="orgTree" :highlight-current="highlightCurrent" :filter-node-method="filterNode" :props="defaultProps" :render-content="renderContent" @node-click="treeChoose">

            </el-tree>
          </div>
        </el-col>
        <el-col :span="18">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织机构信息" name="orgInfo">
              <el-form :model="ruleForm" :rules="this.$validateRule" ref="ruleForm" label-width="110px" style="width: 50%">
                <el-form-item label="机构名称" prop="org_name">
                  <el-input v-model="ruleForm.org_name"></el-input>
                </el-form-item>
                <el-form-item label="组织机构编码" prop="org_code">
                  <el-input v-model="ruleForm.org_code"></el-input>
                </el-form-item>
                <el-form-item label="机构主负责人" prop="primary_person">
                  <base-person-select :orgId='orgId' v-model="ruleForm.primary_person" title='机构主负责人' :disabledOptions='deputyPersonDisabled'> </base-person-select>
                </el-form-item>
                <el-form-item label="机构副负责人" prop="deputy_person">
                  <base-person-select  :orgId='orgId' v-model="ruleForm.deputy_person" title='机构副负责人' :disabledOptions='primaryPersonDisabled'></base-person-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                  <el-input type="textarea" v-model="ruleForm.description"></el-input>
                </el-form-item>
              </el-form>
              <div style="width: 50%;text-align: center">
                <el-button icon="el-icon-edit" type="primary" @click="submitForm('ruleForm')" :disabled="!pitchData.id">修改</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户信息" name="userInfo" scope="props">
              <el-form :inline="true" :model="userformInline" class="demo-form-inline" ref="userformInline">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="userformInline.username" placeholder="用户名" clearable></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                  <el-input v-model="userformInline.realname" placeholder="真实姓名" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="userOnSearch('userformInline')">
                    查询
                  </el-button>
                  <el-button type="info" icon="el-icon-refresh" @click="resetForm('userformInline')">
                    重置
                  </el-button>
                  <el-button type="success" icon="el-icon-plus" @click="onAdd">新增</el-button>
                  <el-button type="warning" icon="el-icon-check" @click="handleBindUser">添加已有用户</el-button>
                  <el-button type="danger" icon="el-icon-edit" @click="checkPassWord">重置密码</el-button>
                </el-form-item>
              </el-form>
              <el-table @selection-change="handleSelectionChange" :data="userTableData" ref=userTable :key="key" highlight-current-row border :height="screenHeight-110">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column prop="username" label="用户名">
                </el-table-column>
                <el-table-column prop="realname" label="真实姓名">
                </el-table-column>
                <el-table-column label="所属部门">
                  <template slot-scope="scope">
                    <span>{{scope.row.sys_org.org_name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="gender" label="性别">
                </el-table-column>
                <el-table-column prop="phone" label="手机号码">
                </el-table-column>
                <el-table-column min-width="100" prop="last_login_time" :formatter="dateFormatFun" label="最近登录时间">
                </el-table-column>
                <el-table-column label="操作" min-width="50">
                  <template slot-scope="scope">
                    <el-button type="warning" @click="handleUnbundling(scope.$index, scope.row)">解绑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页 -->
              <paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes" :pageSize="tabPage.pageSize" :total="tabPage.totalNum">
              </paging>

            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

    </div>
    <!--组织机构新增-->
    <el-dialog width="30%" class="childDialog" v-bind:title="formTitle" :modal-append-to-body="false" :visible.sync="dialogInfo" :close-on-click-modal="false" v-on:close="resetForm('newRuleForm')">
      <el-form :model="newRuleForm" :rules="this.$validateRule" ref="newRuleForm" label-width="110px">
        <el-form-item label="机构名称" prop="org_name">
          <el-input v-model="newRuleForm.org_name"></el-input>
        </el-form-item>
        <el-form-item label="组织机构编码" prop="org_code">
          <el-input v-model="newRuleForm.org_code"></el-input>
        </el-form-item>
        <el-form-item label="父级机构" v-if="newRuleForm.parent_id!=0">
          <el-input v-model="newRuleForm.parentorg_name" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <!-- <el-form-item label="机构主负责人" prop="primary_person">
          <base-person-select v-model="newRuleForm.primary_person" title='机构主负责人' :disabledOptions='newDeputyPersonDisabled'> </base-person-select>
        </el-form-item>
        <el-form-item label="机构副负责人" prop="deputy_person">
          <base-person-select  v-model="newRuleForm.deputy_person" title='机构副负责人' :disabledOptions='newPrimaryPersonDisabled'></base-person-select>
        </el-form-item> -->
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="newRuleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo=false">取 消</el-button>
        <el-button type="primary" @click="submitForm('newRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增用户 -->
    <el-dialog class="myuserManage" width="45%" title="新增用户" :visible.sync="userDialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('userRuleForm')">
      <el-form inline :model="userRuleForm" :rules="rules" ref="userRuleForm" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userRuleForm.username" :disabled="statusInfo===true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="statusInfo===false">
          <el-input v-model="userRuleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" v-if="statusInfo===false">
          <el-input v-model="userRuleForm.checkPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="userRuleForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="组织机构">
          <el-input v-model="userRuleForm.org_name" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userRuleForm.gender" placeholder="请选择">
            <el-option v-for="(item ,index) in sex" :label="item.label" :value="item.label" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务" prop="duties">
          <el-select v-model="userRuleForm.duties" clearable placeholder="请选择">
            <el-option v-for="(item ,index) in zw" :label="item.label" :value="item.value" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="userRuleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="job_no">
          <el-input v-model="userRuleForm.job_no"></el-input>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="userRuleForm.status" placeholder="请选择">
            <el-option v-for="(item ,index) in yhzt" :label="item.label" :value="item.value" :key="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userRuleForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="user_type">
          <el-select v-model="userRuleForm.user_type" placeholder="请选择">
            <el-option v-for="(item ,index) in yhlx" :label="item.label" :value="item.value" :key="index">
            </el-option>
          </el-select>
          <!-- <el-input  v-model="userRuleForm.user_type"></el-input> -->
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="userRuleForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="头像" style="width:49%" prop="">
          <div @click='chooseImg' style="width:110px;height:110px;" title="点击选择图片">
            <img v-if="image.src" :src="image.src" class="avatar">
            <img v-else class="avatar img_src">
            <input id="upload_img" type="file" name="file" @change="onFileChange" class="input_file" accept="image/gif,image/jpeg,image/jpg,image/png" />
          </div>
          <div @click="removeImg" class="removebtn" v-if="image.src">
            <i class="el-icon-delete"></i>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogInfo=false">取 消</el-button>
        <el-button type="primary" @click="userSubmitForm('userRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog title="重置密码" width="30%" :visible.sync="dialogPass" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('checkPassForm')">
      <el-form :model="checkPassForm" :rules="rules" ref="checkPassForm" label-width="90px">
        <!-- <el-form-item label="旧密码" prop="old_password">
          <el-input v-model="checkPassForm.old_password" type="password"></el-input>
        </el-form-item> -->
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="checkPassForm.new_password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="check_password">
          <el-input v-model="checkPassForm.check_password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPass=false">取 消</el-button>
        <el-button type="primary" @click="submitPassForm('checkPassForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加已有用户 -->
    <depart-user-manage :departId="pitchData.id" :userDialog="nowUserDialog" @close="closeDialog"></depart-user-manage>
  </div>
</template>

<script>
import paging from "common/BasePaging.vue";
import DepartUserManage from "view/sysDepart/DepartUserManage.vue";
import BasePersonSelect from "common/BasePersonSelect.vue";
import { getDicData } from "assets/js/commonManage.js";

// import { dateFormat } from 'assets/js/date.js'
import moment from "moment";

export default {
  data() {
    const validatePass2 = (rule, value, callback) => {
      //新增重复密码验证
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userRuleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    const validateOldPass = (rule, value, callback) => {
      //旧密码验证
      const data = {
        id: this.sels[0].id,
        username: this.sels[0].username,
        password: value
      };
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        this.$http
          .get("/sys/UserController/checkPsd", { params: data })
          .then(res => {
            if (res.data && res.data.success) {
              callback();
            } else {
              callback(new Error("旧密码输入错误!"));
            }
          })
          .catch(err => {
            if (err) {
              callback(new Error("旧密码查询错误!"));
            }
          });
      }
    };
    const validateNewPass = (rule, value, callback) => {
      //修改密码验证
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.checkPassForm.new_password) {
        callback(new Error("两次输入新密码不一致!"));
      } else {
        callback();
      }
    };

    const isMobilePhone = (rule, value, callback) => {
      const reg = /^1[34578]\d{9}$/; //手机号码
      if (!value) {
        callback(new Error("请输入手机号码"));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error("请输入正确格式，如：18723346175"));
        } else {
          callback();
        }
      }, 300);
    };
    const validUser = (rule, value, callback) => {
      // const reg = /^[\^\\%&\*~'\?\/\<\>\|\"`]+$/;//中文和特殊字符
      const reg = /^[a-zA-Z0-9_]{0,}$/;
      if (!value) {
        callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error("不能输入汉字或者特殊字符"));
        } else {
          callback();
        }
      }, 300);
    };
    return {
      orgId:null,
      highlightCurrent: true,
      dialogPass: false, //修改密码模态显示标识
      sex: [], //性别下拉
      statusInfo: false,
      userDialogInfo: false,
      userRuleForm: {},
      checkPassForm: {
        old_password: "",
        new_password: "",
        check_password: ""
      }, //修改密码表单
      rules: {
        username: [{ required: true, validator: validUser, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        realname: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, validator: isMobilePhone, trigger: "change" }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        job_no: [{ required: true, message: "请输入工号", trigger: "change" }],
        status: [
          { required: true, message: "请选择用户状态", trigger: "change" }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入邮箱地址",
            trigger: "change"
          }
        ],
        old_password: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        new_password: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        check_password: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: validateNewPass, trigger: "blur" }
        ]
      },
      key: Date.now(),
      checkOrgList: [], //选中部门含子集数值
      multipleSelection: [], //Tree table 复选后集合
      orgs: [],
      nowUserDialog: false, //已有警员信息Dialog
      pitchData: {}, //当前选中的唯一一条数据
      userformInline: {
        username: "",
        realname: ""
      },
      userTableData: [], //警员table
      activeName: "orgInfo",
      filterText: "",
      orgTreeData: [],
      isShow: false, //是否显示警员table
      isChooseid: "",
      tablewidth: 24, //默认组织机构表格宽度
      parentItem: false,
      parentOptions: [],
      value: "",
      PlOrgTableData: [], //部门列表数组
      sels: [], //表格选中列
      cache: "",
      tabPage: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
      }, //分页信息
      loading: false,
      formInline: {
        //查询表单对象
        org_name: ""
      },
      dialogInfo: false, //模态框是否显示标识
      ruleForm: {
        deputy_person: [],
        primary_person: []
      }, //新增表单数据
      newRuleForm: {
        deputy_person: [],
        primary_person: []
      },
      formTitle: "", //新增编辑模态框title
      tunnelList: [], //隧道下拉
      dataTree: [], //角色树
      defaultKey: [], //选中项
      defaultProps: {
        children: "children",
        label: "org_name"
      },
      org_id: "", //选中部门id
      loginUser: "",
      screenHeight: document.body.clientHeight - 200,
      defaultParentIds: "",
      yhzt: [], //用户状态下拉
      yhlx: [],
      zw: [],
      image: {}, //图片流预览图片
      loginUserId: "" //登录用户id
    };
  },
  created: function() {},
  mounted: function() {
    this.getDepartToTree();
    this.yhzt = getDicData("yhzt");
    this.yhlx = getDicData("yhlx");
    this.loginUserId = JSON.parse(this.$getStore("userData")).id;
    this.sex = [{ key: 0, label: "男" }, { ket: 1, label: "女" }];
    this.zw = getDicData("zw");
    this.loginUser = document.cookie.split("username=")[1]; //获取当前用户名
    const VM = this;
    VM.screenHeight = document.body.clientHeight - 200;
    window.addEventListener("resize", function() {
      VM.screenHeight = document.body.clientHeight - 200;
    });
  },
  components: {
    paging,
    DepartUserManage,
    BasePersonSelect
  },
  // computed: {
  //   addDis() {
  //     let type = true;
  //     if (this.orgTreeData.length > 0) {
  //       if (!this.pitchData.id) {
  //         type = false;
  //       } else {
  //         type = true;
  //       }
  //     }
  //     return type;
  //   }
  // },
  methods: {
    /**
     * tree 渲染
     */
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1;  display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <base-icon style="color: #409EFF;" icon="bumen" />
            <span style="margin-left:5px;">{node.label}</span>
          </span>
          <span>
            <el-button
              v-show={data.show}
              style="font-size: 12px;"
              type="text"
              on-click={() => this.cancleClick(node, data, store)}
            >
              取消选中
            </el-button>
          </span>
        </span>
      );
    },
    /**
     * @desc 取消选择
     * @param {Object} node node节点
     * @param {Object} data 节点数据
     * @param {Object} store  所有节点数据
     * @returns *
     */
    cancleClick(node, data, store) {
      console.log("冒泡");
      console.log(node, data, store);
      console.log(event);
      this.highlightCurrent = false;
      data.show = false;
      event.cancelBubble = true; //阻止事件冒泡
      this.setRest();
    },
    chooseImg() {
      $("input[type=file]").trigger("click");
      return false;
    },
    /**
     * 图片选择change事件
     *
     */
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (files[0]) {
        const isImg = files[0].type.substr(0, 5);
        const isLt2M = files[0].size / 1024 / 1024 < 2;
        if (isImg !== "image") {
          this.$message.error("只能上传图片！");
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过2M！");
        }
        if (isImg === "image" && isLt2M) {
          if (!files.length) return;
          this.createImage(files);
        }
        if (this.userRuleForm.CatelogPic) {
          this.delImgInfo = true;
        }
        return isImg === "image" && isLt2M;
      }
    },
    //读取图片操作
    createImage(files) {
      let VM = this;
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = function(e) {
          VM.image = { src: e.target.result };
        };
        reader.readAsDataURL(file);
      }
    },
    removeImg() {
      $("#upload_img").val("");
      this.image = {};
      if (this.userRuleForm.CatelogPic) {
        this.delImgInfo = true;
      }
    },
    /**
     * 添加已有人员
     */
    handleBindUser() {
      if (this.pitchData && this.pitchData.id) {
        this.nowUserDialog = true;
      } else {
        this.$message.warning("请先在左侧选中部门！");
      }
    },
    //添加已有人员Close
    closeDialog(d) {
      this.nowUserDialog = d.dialog;
      if (d.status) {
        this.userOnSearch();
      }
    },
    /**
     * 修改密码按钮点击事件
     *
     */
    checkPassWord() {
      if (this.sels.length > 1) {
        this.$message({
          message: "只能选择一个用户",
          type: "warning"
        });
      } else if (this.sels.length === 1) {
        this.dialogPass = true;
        this.checkPassForm.id = this.sels[0].id;
        this.checkPassForm.username = this.sels[0].username;
      } else {
        this.$message.warning("请选择一个用户");
      }
    },
    /**
     * 修改密码
     */
    submitPassForm(formName) {
      const params = {
        id: this.checkPassForm.id,
        password: this.checkPassForm.new_password,
        username: this.checkPassForm.username,
        update_by: this.loginUserId,
        flag: 3
      };
      const _vm = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const res = await _vm.$http.post(
              "/sys/UserController/saveUserInfo",
              params
            );
            if (res.data && res.data.success) {
              _vm.dialogPass = false;
              if (_vm.checkPassForm.username === _vm.loginUser) {
                //判断是否为当前用户
                const date = new Date();
                date.setTime(date.getTime() - 10000);
                document.cookie = "islogin=true; expires=" + date.toGMTString();
                _vm.$router.push("/login"); //返回登录页
              } else {
                _vm.$message.success("操作成功");
                _vm.userOnSearch();
              }
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error("请求错误");
          }
        }
      });
    },
    /**
     * 新增用户
     */
    userSubmitForm(formName) {
      const _vm = this;
      const params = _vm.userRuleForm;
      console.log(params);
      params.update_by = this.loginUserId;
      if (this.delImgInfo) {
        params.delImgInfo = this.delImgInfo;
      }
      let formData = new FormData();
      let file = document.getElementById("upload_img").files[0];
      formData.append("image", file); //file就是图片或者文件
      $.each(params, function(i, val) {
        if (val !== null) {
          formData.append(i, val);
        }
      });
      formData.append("flag", 1);
      this.$refs[formName].validate(async function(valid) {
        if (valid) {
          try {
            let res = await _vm.$http.post(
              "/sys/UserController/saveUserInfo",
              formData
            );
            if (res.data && res.data.success) {
              _vm.userDialogInfo = false;
              _vm.$message.success("操作成功");
              _vm.userOnSearch();
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error("请求错误");
          }
        } else {
          console.log("提交错误");
          return false;
        }
      });
    },
    handleClick(tab, event) {
      this.key = Date.now();
    },
    /**
     * 解除组织机构绑定
     *@param {String} index  当前行index
     *@row {Object} index 选中行数据
     */
    handleUnbundling(index, row) {
      const params = {
        userid: row.id
      };
      const _vm = this;
      this.$confirm("此操作将解除该用户与组织绑定,是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const res = await _vm.$http.post(
              "/sys/DepartController/unBindUser",
              params
            );
            if (res.data && res.data.success) {
              _vm.$message.success("操作成功");
              _vm.userOnSearch();
            } else {
              _vm.$message.error(res.data.msg);
            }
          } catch (err) {
            _vm.$message.error("请求错误");
          }
        })
        .catch(e => {});
    },
    onAdd() {
      if (this.pitchData && this.pitchData.id) {
        this.userDialogInfo = true;
        this.userRuleForm = Object.assign(
          {},
          {
            username: "",
            password: "",
            checkPass: "",
            realname: "",
            phone: "",
            job_no: "",
            gender: "",
            duties: "",
            org_id: this.pitchData.id,
            org_name: this.pitchData.org_name
          }
        );
        this.statusInfo = false;
      } else {
        this.$message.warning("请先在左侧选中部门！");
      }
    },

    /**
     *警员搜索信息
     */
    userOnSearch() {
      if (this.pitchData && this.pitchData.id) {
        let orgList = [];
        orgList = this.setOrgIdList(orgList, this.pitchData); //获取选中节点父子节点id集合
        this.getUserListByOrgId(orgList); //默认查询第一条组织机构警员信息
      } else {
        this.$message.warning("请先在左侧选中部门！");
      }
    },
    /**
     *获取当前节点及其下子节点的所有id集合
     *@param {Arry} list 保存于数组对象中的id集合
     *@param {Object} data    选中的数据原形
     */
    setOrgIdList(list, data) {
      list.push(data.id);
      if (data.children) {
        if (data.children.length > 0) {
          for (let item of data.children) {
            this.setOrgIdList(list, item);
          }
        }
      }
      return list;
    },

    /**
     * 通过orgTd查询警员信息
     *@param {String} orgId
     */
    async getUserListByOrgId(idList) {
      const data = {
        page: this.tabPage.currentPage,
        pageSize: this.tabPage.pageSize,
        options: {
          username: this.userformInline.username,
          org_id: idList,
          realname: this.userformInline.realname
        }
      };
      try {
        this.loading = true;
        const res = await this.$http.get(
          "/sys/DepartController/getUserListByDid",
          {
            params: data
          }
        );
        if (res.data && res.data.success) {
          //查询成功
          const result = res.data.result;
          this.tabPage.totalNum = result.count;
          this.userTableData = result.rows;
        } else {
          this.$message.error(callBackData.data.msg);
        }
        this.loading = false;
      } catch (err) {
        this.$message.error("请求错误");
        this.loading = false;
      }
    },

    /**
     * 编辑模式绑定数据
     *@param {Object} row 选中编辑行数据
     */
    bindEditInfo(row) {
      console.log(2222);
      this.ruleForm = Object.assign({}, row);
      if (
        this.ruleForm.primary_person &&
        this.ruleForm.primary_person.length > 0
      )
        this.ruleForm.primary_person = this.ruleForm.primary_person.split(",");
      if (this.ruleForm.deputy_person && this.ruleForm.deputy_person.length > 0)
        this.ruleForm.deputy_person = this.ruleForm.deputy_person.split(",");
    },
    /**
     *树信息过滤
     *@param {String} value 当前输入值
     *@param {Objcet} data 树数据原形
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.org_name.indexOf(value) !== -1;
    },

    /**
     *树节点点击事件
     *@param {Object} element  传递给 data 属性的数组中该节点所对应的对象
     *@param {Objcet} node   节点对应的 Node
     *@param {Objcet} vm    节点组件本身
     */
    async treeChoose(element, node, vm) {
      this.highlightCurrent = true;
      if (this.cache.id) {
        this.cache.show = false;
      }
      node.data.show = true;
      this.cache = node.data;
      console.log(node);
      var arr = [];
      this.test(node, arr);
      console.log(arr);
      this.checkOrgList = [];
      this.pitchData = element;
      this.defaultParentIds = arr.join(",");
      console.log(this.pitchData);
      this.userformInline.username = "";
      this.userformInline.realname = "";
      this.bindEditInfo(element);
      this.orgId=node.data.id;
      this.checkOrgList = this.setOrgIdList(this.checkOrgList, element); //获取选中节点父子节点id集合
      this.getUserListByOrgId(this.checkOrgList);
    },
    /**
     *  重置所有
     */
    setRest() {
      this.checkOrgList = [];
      this.pitchData = {};
      this.ruleForm = {};
      this.orgId=null;
      this.defaultParentIds = "";
      this.userformInline.username = "";
      this.userformInline.realname = "";
      this.userTableData = [];
    },
    test(node, array) {
      array.push(node.data.id);
      if (node.level != 1) {
        this.test(node.parent, array);
      } else {
        return array;
      }
    },

    /**
     * 格式转树状结构
     * @param   {Array}      原数据
     * @param   {String}    id的字符串
     * @param   {String}    父id的字符串
     * @param   {String}    children的字符串
     * @return  {Array}     数组
     */
    transData(a, idStr, pidStr, chindrenStr) {
      let r = [],
        hash = {},
        id = idStr,
        pid = pidStr,
        children = chindrenStr,
        i = 0,
        j = 0,
        len = a.length;
      for (; i < len; i++) {
        hash[a[i][id]] = a[i];
      }
      for (; j < len; j++) {
        const aVal = a[j],
          hashVP = hash[aVal[pid]];
        if (hashVP) {
          !hashVP[children] && (hashVP[children] = []);
          hashVP[children].push(aVal);
        } else {
          r.push(aVal);
        }
      }
      return r;
    },
    /**
     *查询组织结构信息(树)
     */
    async getDepartToTree(data) {
      let parm = {};
      let policeList = [];
      try {
        if (data) {
          parm = {
            id: data.id
          };
        }
        const res = await this.$http.get(
          "/sys/DepartController/getDepartList",
          {
            params: parm
          }
        );
        if (res.data && res.data.success) {
          //
          const result = res.data.result;

          console.log("808", result);
          let data = result.map(item => {
            item.show = false;
            return item;
          });
          if (result.length > 0) {
            this.orgTreeData = this.transData(
              data,
              "id",
              "parent_id",
              "children"
            );
            this.$refs["ruleForm"].resetFields();
            this.tabPage.totalNum = 0;
            this.userTableData = [];
            this.pitchData = {};
            // if (!this.pitchData.id) {//默认选中第一条
            //     this.pitchData = this.orgTreeData[0];
            //     this.bindEditInfo(data);//编辑默认选中第一条数据
            //     policeList = this.setOrgIdList(policeList, this.pitchData);//获取选中节点父子节点id集合
            //     if (policeList.length > 0) {
            //         this.getUserListByOrgId(policeList)   //默认查询第一条组织机构警员信息
            //     }
            // }
          }
        } else {
          this.$message.error(res.data.msg);
        }
      } catch (err) {
        this.$message.error("请求错误");
      }
    },
    choosePolice(index, row) {
      if (this.isChooseid == "") {
        this.isChooseid = row.id;
        this.tablewidth = 12;
        this.isShow = true;
      } else {
        if (this.isChooseid == row.id) {
          if (this.tablewidth == 12) {
            this.tablewidth = 24;
            this.isShow = false;
          } else {
            this.tablewidth = 12;
            this.isShow = true;
          }
        } else {
          this.isChooseid = row.id;
          this.tablewidth = 12;
          this.isShow = true;
        }
      }
    },
    /**
     * 查询 根据机构名称模糊查询
     * @params {String} formName 进行验证
     */
    onSearch(formName) {
      const params = {
        org_name: this.filterText
      };
      this.getDepartToTree(params);
    },
    /**
     * 点击新增按钮
     */
    handleAdd() {
      this.dialogInfo = true;
      this.formTitle = "新增部门信息";
      this.newRuleForm = Object.assign(
        {},
        {
          org_name: "",
          org_code: "",
          parent_id: this.ruleForm.id || 0,
          parentorg_name: this.ruleForm.org_name,
          deputy_person: [],
          primary_person: [],
          // parent_ids: this.defaultParentIds,
          parent: this.ruleForm,
          org_type: undefined,
          description: ""
        }
      ); //初始化
    },
    /**
     * 保存部门信息
     * @params {String} formName 用于验证
     */
    async submitForm(formName) {
      const _vm = this;
      let params = "";
      if (formName === "ruleForm") {
        params = Object.assign({}, _vm.ruleForm);

        if (!_vm.ruleForm.id) {
          return _vm.$message.warning("请先在左侧选择部门");
        }
      } else {
        params = _vm.newRuleForm;
      }
      if (
        params.primary_person instanceof Array &&
        params.primary_person.length > 0
      ) {
        params.primary_person = params.primary_person.join(",");
      } else {
        params.primary_person = null;
      }

      if (
        params.deputy_person instanceof Array &&
        params.deputy_person.length > 0
      ) {
        params.deputy_person = params.deputy_person.join(",");
      } else {
        params.deputy_person = null;
      }
      console.log(params);
      _vm.$refs[formName].validate(valid => {
        if (valid) {
          _vm.subDepart(params);
        } else {
          console.log("提交错误");
          return false;
        }
      });
    },
    /**
     * 新增/修改部门信息
     * @param {Object} params 表单数据
     */
    async subDepart(params) {
      try {
        const res = await this.$http.post(
          "/sys/DepartController/saveDepartInfo",
          params
        );
        if (res.data && res.data.success) {
          this.$message.success("操作成功");
          this.getDepartToTree(params);
          this.dialogInfo = false;
          this.loading = true;
        } else {
          this.$message.error(res.data.msg);
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$message.error("请求错误");
      }
    },
    /**
     * 表单重置
     * @params {Object} formName 表单名称
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (formName == "userformInline") {
        if (this.pitchData && this.pitchData.id) {
          this.userOnSearch();
        }
      }
    },
    /*******绑定角色end******/
    /**
     * 删除按钮点击事件
     * @params {Number} index   行号
     * @params {Object} row     行对象
     */
    handleDelete() {
      if (this.pitchData.children && this.pitchData.children.length > 0) {
        this.$message.warning("当前选中部门存在下级,请先删除下级");
      } else {
        this.deleteOrgInfo({ id: this.pitchData.id });
      }
    },
    /**
     * 删除部门信息
     * @params {Object} row|rows     行对象
     */
    deleteOrgInfo(data) {
      const _vm = this;
      this.$confirm("此操作将永久删除选择部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          _vm.delOrgAction(data);
        })
        .catch(err => {});
    },
    /**
     * 部门信息删除请求
     */
    async delOrgAction(data) {
      try {
        const res = await this.$http.post(
          "/sys/DepartController/delDepartInfo",
          data
        );
        if (res.data && res.data.success) {
          this.loading = true;
          this.$message.success("操作成功");
          this.getDepartToTree();
        } else {
          this.$message.error(res.data.msg);
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.$message.error("请求错误");
      }
    },
    /**
     * 切换每页条数
     * @params {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
      this.getUserListByOrgId(this.checkOrgList);
    },
    /**
     * 切换页码
     * @params {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
      this.getUserListByOrgId(this.checkOrgList);
    },
    /**
     * 多选框改变选中事件
     * @params {Array} val 当前所有选中行对象数组
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.sels = val;
    },
    dateFormatFun(row, colum) {
      //时间格式化
      if (row[colum.property] != null) {
        const d = row[colum.property];
        return moment(d).format("YYYY-MM-DD hh:mm:ss");
        // return dateFormat(new Date(d), "yyyy-MM-dd hh:mm:ss")
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    }
  },
  computed: {
    controller() {
      if (this.orgTreeData.length > 0) {
        if (this.ruleForm.id) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    primaryPersonDisabled() {
      return {
        name: "主负责人",
        list: this.ruleForm.primary_person || []
      };
    },
    deputyPersonDisabled() {
      return {
        name: "副负责人",
        list: this.ruleForm.deputy_person || []
      };
    },
    newPrimaryPersonDisabled() {
      return {
        name: "主负责人",
        list: this.newRuleForm.primary_person || []
      };
    },
    newDeputyPersonDisabled() {
      return {
        name: "副负责人",
        list: this.newRuleForm.deputy_person || []
      };
    }
  }
};
</script>

<style >
.showpolice {
  animation: slideInRight 1s 0.7s 1 both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.hidepolice {
  animation: slideOutRight 1s 0s 1 both;
}

@keyframes slideOutRight {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}

.chwidth {
  transition: width 0.7s;
  -moz-transition: width 0.7s;
  /* Firefox 4 */
  -webkit-transition: width 0.7s;
  /* Safari and Chrome */
  -o-transition: width 0.7s;
  /* Opera */
}

.tabPosition .left-tree {
  border: 1px solid d1dbe5 !important;
  box-sizing: border-box;
}
.tabPosition .left-tree .el-tree {
  height: 100%;
  overflow-y: auto;
}

.personDialog .el-dialog__body {
  padding: 0 20px 35px 20px;
}

.tabPosition .el-tag--person {
  background-color: #20a0ff;
  border-color: rgba(18, 206, 102, 0.2);
  color: #fbfdff;
  margin: 0 2px;
}

.tabPosition .tagclass {
  min-height: 30px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #bfcbd9;
  padding: 0 5px;
  /* width: 200px; */
  margin-top: 5px;
  max-height: 30px;
  overflow: auto;
}
/*.depart .el-form-item {
    width: 90%
}*/
.left-tree {
  /*height:750px;*/
  /*position:absolute;*/
  overflow: auto;
}
.left-tree .el-tree {
  height: 100%;
  overflow-y: auto;
}
.left-tree
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #e6a23c;
}
.myuserManage .el-input,
.myuserManage .el-textarea {
  min-width: 200px;
}
.myuserManage .el-select {
  width: 100%;
}
.myuserManage .input_file {
  display: none;
}
.myuserManage .avatar {
  width: 109px;
  height: 109px;
  display: block;
  cursor: pointer;
}

.myuserManage .img_src {
  background-image: url("../../../assets/images/default.jpg");
  background-size: 109px 109px;
}
</style>
