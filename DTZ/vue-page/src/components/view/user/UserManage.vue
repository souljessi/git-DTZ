<template>
    <div class="userManage">
        <el-row :gutter="3">
            <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]">
                <el-form :inline="true" :model="formInline" class="user-search-form" ref="formInline">
                    <el-form-item label="组织机构" prop="org_id">
                       
                        <div class="userTagClass" @click="chooseDeparts">
                            <el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type"  v-for="item in departList1" :key="item.id">
                                {{item.org_name}}
                            </el-tag>
                        </div>

                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input  v-model="formInline.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="realname">
                        <el-input  v-model="formInline.realname" placeholder="真实姓名"></el-input>
                    </el-form-item>
                     <el-form-item label="手机号码" prop="phone">
                        <el-input  v-model="formInline.phone" placeholder="手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="用户状态" prop="status">
                        <el-select  v-model="formInline.status" placeholder="用户状态" clearable>
                            <el-option
                                v-for="(item ,index) in yhzt"
                                :label="item.label"
                                :value="item.value"
                                :key="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button  type="primary" icon="el-icon-search" @click="onSearch('formInline')">查询</el-button>
                        <el-button  type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
                        <el-button  type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                        <el-button  type="warning" icon="el-icon-edit" @click="checkPassWord">重置密码</el-button>
                        <el-button  type="danger"  icon="el-icon-delete" @click="deleteSome">批量删除</el-button>
                    </el-form-item>
                </el-form>
                <!--表单-->
                <el-table
                    :data="sysUserTableData"
                    border
                    :height="screenHeight-120"
                    :highlight-current-row="true"
                    @selection-change="handleSelectionChange"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        label="用户名"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                        prop="realname"
                        label="真实姓名"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="org_name"
                        label="组织机构"
                        show-overflow-tooltip>
                    </el-table-column>
                     <el-table-column
                        prop="gender"
                        label="性别">
                    </el-table-column>
                     <el-table-column
                        width="130"
                        prop="phone"
                        label="手机号码">
                    </el-table-column>
                    <el-table-column
                        width="160"
                        prop="last_login_time"
                        :formatter="dateFormatFun"
                        label="最后登录时间">
                    </el-table-column>
                    <el-table-column
                        label="登录状态"
                        width="80"
                        >
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.login_flag? '激活' : '锁定'" placement="top">
                                <el-switch
                                    style="display: block"
                                    v-model="scope.row.login_flag"
                                    :disabled="scope.row.username==='admin'"
                                    @change="changeStatus(scope.$index, scope.row)">
                                </el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="290">
                        <template slot-scope="scope">
                            <el-button
                                type="info"
                                @click="handleInfo(scope.row.id)"
                                :disabled="scope.row.id===defUser">详情
                            </el-button>
                            <el-button
                                type="primary"
                                @click="handleEdit(scope.$index, scope.row)"
                                :disabled="scope.row.id===defUser">编辑
                            </el-button>
                            <el-button
                                type="warning"
                                :disabled="scope.row.id===defUser"
                                @click="handleRole(scope.$index, scope.row)">角色
                            </el-button>
                            <el-button
                                type="danger" 
                                :disabled="scope.row.id===defUser"
                                @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <paging @emitsizechange="handleSizeChange"
                        @emitcurrentchange="handleCurrentChange"
                        :currentPage="tabPage.currentPage"
                        :pageSizes="tabPage.pageSizes"
                        :pageSize="tabPage.pageSize"
                        :total="tabPage.totalNum">
                </paging>
            </el-col>
            <el-col :xs="24" :sm="24" :md="5" :lg="5" v-show="tabSize[3]===19" v-loading="roleLoading">
                <user-role-list @updateRight="updateRole" :heightSet="screenHeight" :users="usersList" :dataTree="dataTree" :defaultKey="defaultKey" :userid="userid" @changeUser="getRoleByUser" @hideRight="hideRight"></user-role-list>
            </el-col>
        </el-row>
        <!--dialog-->
        <el-dialog width="42%" class="userDialog" v-bind:title="formTitle" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('ruleForm')">
            <el-form inline :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px" class="userFormStle">
                <el-form-item label="用户名" prop="username">
                    <el-input  v-model="ruleForm.username" :disabled="statusInfo===true"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="statusInfo===false">
                    <el-input  v-model="ruleForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass" v-if="statusInfo===false">
                    <el-input  v-model="ruleForm.checkPass" type="password"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input  v-model="ruleForm.realname"></el-input>
                </el-form-item>
                <el-form-item label="组织机构" prop="org_id">
                    <div class="userTagClass" @click="chooseDepart">
                        <el-tag placeholder="请选择" class="el-tag--depart" style="margin: 0 3px;" :type="item.type"  v-for="item in departList0" :key="item.id">
                            {{item.org_name}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select  v-model="ruleForm.gender" placeholder="请选择">
                        <el-option
                            v-for="(item ,index) in sex"
                            :label="item.label"
                            :value="item.label"
                            :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职务" prop="duties">
                    <el-select  v-model="ruleForm.duties" clearable placeholder="请选择">
                        <el-option
                            v-for="(item ,index) in zw"
                            :label="item.label"
                            :value="item.value"
                            :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input  v-model="ruleForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="工号" prop="job_no">
                    <el-input  v-model="ruleForm.job_no"></el-input>
                </el-form-item>
                <el-form-item label="用户状态" prop="status">
                    <el-select  v-model="ruleForm.status" placeholder="请选择">
                        <el-option
                            v-for="(item ,index) in yhzt"
                            :label="item.label"
                            :value="item.value"
                            :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input  v-model="ruleForm.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" prop="user_type">
                    <el-select  v-model="ruleForm.user_type" placeholder="请选择">
                        <el-option
                            v-for="(item ,index) in yhlx"
                            :label="item.label"
                            :value="item.value"
                            :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea"  v-model="ruleForm.remarks"></el-input>
                </el-form-item>
                <el-form-item label="头像" style="width:48%" prop="">
                    <div @click='chooseImg' style="width:110px;height:110px;" title="点击选择图片">
                        <img v-if="image.src" :src="image.src" class="img-avatar">
                        <img v-else
                            class="img-avatar img_src">
                        <input id="upload_img" type="file" name="file" @change="onFileChange" class="input_file"
                            accept="image/gif,image/jpeg,image/jpg,image/png"/>
                    </div>
                    <div @click="removeImg" class="removebtn" v-if="image.src">
                        <el-button  type="danger" icon="el-icon-delete"></el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogInfo=false">取 消</el-button>
                <el-button  type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--dialog changePsd-->
        <el-dialog width="25%" class="userDialog" title="重置密码" :visible.sync="dialogPass" :modal-append-to-body="false" :close-on-click-modal="false"
                   v-on:close="resetForm('checkPassForm')">
            <el-form :model="checkPassForm" :rules="rules" ref="checkPassForm" label-width="90px">
                <el-form-item label="新密码" prop="new_password">
                    <el-input  v-model="checkPassForm.new_password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="check_password">
                    <el-input  v-model="checkPassForm.check_password" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogPass=false">取 消</el-button>
                <el-button type="primary" @click="submitPassForm('checkPassForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!--查询部门选择器-->
        <el-dialog title="部门选择" :visible.sync="dialogVisible" class="groupclass" :close-on-click-modal="false">
            <Org style="height: 335px;overflow-y: auto"
                :dialog-visible="dialogVisible"
                :setSelect='setSelectList1'
                @selectdNode='selectedNodes'
                title="部门选择"
                :strictly="true"
                :multiple="true">
            </Org>
            <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeDialog(1)">确 定</el-button>
                </span>
            </div>
        </el-dialog>

        <!--新增编辑用户部门选择器-->
        <el-dialog title="部门选择" :visible.sync="editDialog" class="groupclass" :close-on-click-modal="false">
            <dept-choose style="height: 335px;overflow-y: auto"
                :dialog-visible="editDialog"
                :setSelect='setSelectList0'
                @selectdNode='selectedNode'
                title="部门选择"
                :strictly="true"
                :multiple="false"
                :index="index"
                @addIndex="addIndex">
            </dept-choose>
            <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeEditDialog(1)">确 定</el-button>
                </span>
            </div>
        </el-dialog>
        <el-dialog width="41%" title="用户详情" :visible.sync="dialogDetail" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('detailForm')">
            <el-form inline :model="detailForm"  ref="detailForm" label-width="85px" class="user-detail-form">
                <el-form-item label="用户名:" prop="username">
                    <el-input  v-model="detailForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名:" prop="realname">
                    <el-input  v-model="detailForm.realname" disabled></el-input>
                </el-form-item>
                <el-form-item label="组织机构:" prop="org_id">
                    <el-input v-model="detailForm.org_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号码:" prop="phone">
                    <el-input  v-model="detailForm.phone" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户状态:" prop="status">
                    <el-input  v-model="detailForm.status" disabled></el-input>
                </el-form-item>
                 <el-form-item label="用户类型:" prop="user_type">
                    <el-input  v-model="detailForm.user_type" disabled></el-input>
                </el-form-item>
                 <el-form-item label="性别:" prop="gender">
                    <el-input  v-model="detailForm.gender" disabled></el-input>
                </el-form-item>
                <el-form-item label="职务:" prop="duties">
                    <el-input  v-model="detailForm.duties" disabled></el-input>
                </el-form-item>
                  <el-form-item label="工号:" prop="job_no">
                    <el-input  v-model="detailForm.job_no" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                    <el-input  v-model="detailForm.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="创建人:" prop="create_name">
                    <el-input v-if="detailForm.create_name" v-model="detailForm.create_name" disabled></el-input>
                    <el-input v-else value="未知" disabled></el-input>
                </el-form-item>
                <el-form-item label="创建时间:" prop="createdate">
                    <el-input v-if="detailForm.createdate"  v-model="detailForm.createdate" disabled></el-input>
                    <el-input v-else value="未知" disabled></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remarks">
                    <el-input type="textarea" v-if="detailForm.remarks" v-model="detailForm.remarks" disabled></el-input>
                    <el-input v-else  value="无" disabled></el-input>
                </el-form-item>
                <el-form-item label="头像:" style="width:48%" v-if="detailForm.pic_path">
                    <div style="width:110px;height:110px;">
                        <img  :src="detailForm.pic_path" class="img-avatar">
                    </div>
                </el-form-item>
                <el-form-item label="头像:" v-else>
                    <el-input value="暂无头像" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogDetail=false">取 消</el-button>
            </div>
        </el-dialog>

        <router-view></router-view>
    </div>
</template>

<script>
    import paging from 'common/BasePaging.vue'
    import UserRoleList from './UserRoleList.vue'
    import {dateFormat} from 'assets/js/date.js'
    import { getDicData } from "assets/js/commonManage.js"
    import Org from 'common/departTree'
    import DeptChoose from './DepartChoose'
    export default {
        data(){
            const validatePass2 = (rule, value, callback) => {//新增重复密码验证
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const validateNewPass = (rule, value, callback) => {//修改密码验证
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.checkPassForm.new_password) {
                    callback(new Error('两次输入新密码不一致!'));
                } else {
                    callback();
                }
            };
            const isMobilePhone = (rule, value, callback) => {
                const reg =  /^1[34578]\d{9}$/;//手机号码
                if(!value){
                    callback(new Error('请输入手机号码'));
                }
                setTimeout(() => {
                    if (!reg.test(value)) {
                    callback(new Error('请输入正确格式，如：18723346175'));
                    } else {
                        callback();
                    }
                }, 300);
            };
            const userVaidli = (rule, value, callback) => {
                const reg = /^[a-zA-Z0-9_]{0,}$/;
                if (!value) {
                    callback(new Error('请输入用户名'));
                }
                setTimeout(() => {
                    if (!reg.test(value)) {
                    callback(new Error('不能输入汉字或者特殊字符'));
                    } else {
                    callback();

                    }
                }, 300);
            };
            return {
                defUser:'000000',
                sysUserTableData: [],//用户列表数组
                sels: [],//表格选中列
                tabPage: {
                    currentPage: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 50]
                },//分页信息
                loading: false,
                formInline: {//查询表单对象
                    org_id:undefined,
                    username: '',
                    realname:'',
                    phone:'',
                    status:''
                },
                dialogInfo: false,//模态框是否显示标识
                dialogPass: false,//重置密码模态显示标识
                dialogDetail:false,//详情弹窗
                ruleForm: {},//新增表单数据
                checkPassForm: {
                    new_password:'',
                    check_password:''
                },//重置密码表单
                detailForm:{},//用户详情
                options: [],//部门数组
                rules: {
                    username: [
                        {required: true, validator:userVaidli, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    realname: [
                        {required: true, message: '请输入真实姓名', trigger: 'blur'}
                    ],
                    phone:[
                        {required: true, validator:isMobilePhone, trigger: 'blur'}
                    ],
                    gender:[
                        {required: true, message:'请选择性别', trigger: 'change'}
                    ],
                    job_no:[
                        {required: true, message:'请输入工号', trigger: 'blur'}
                    ],
                    // user_type:[
                    //     {required: true, message:'请选择用户类型', trigger: 'change'}
                    // ],
                    // status:[
                    //     {required: true, message:'请选择用户状态', trigger: 'change'}
                    // ],
                    email:[
                        {required: true,type:'email', message:'请输入邮箱地址', trigger: 'bur'}
                    ],
                    checkPass: [
                        {required: true,validator: validatePass2, trigger: 'blur'}
                    ],
                    new_password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    check_password: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: validateNewPass, trigger: 'blur'}
                    ]
                },
                yhlx: [],//用户类型数组
                sex:[],//性别下拉
                yhzt:[],//用户状态下拉
                zw:[],//职务
                loginUser:'',//记录登录用户
                formTitle: '',//新增编辑模态框title
                isUser:false,//判断是否为当前用户
                userPsd:'',//获取当前用户密码
                dataTree: [],//用户角色树
                defaultKey:[],//选中项
                defaultProps: {
                    children: 'children',
                    label: 'rolename'
                },
                userid:'',//选中用户id
                usersList:[],//所有用户下拉
                tabSize:[24,24,24,24],//栅格用户列表
                statusInfo:false,//用户名输入框是否可编辑
                screenHeight: document.body.clientHeight-125,
                image: {},//图片流预览图片
                delImgInfo:false,
                loginUserId:'',//登录用户id
                roleLoading:false,
                departList0: [],//部门选择单个
                setSelectList0: [],//部门选中项单个
                dialogVisible: false,//组织机构树弹窗:
                departList1: [],//部门选择多个
                setSelectList1: [],//部门选中项多个
                editDialog:false,
                index:0

            }
        },
        created: function () {

        },
        mounted: function () {
            this.getSysUserList();
            this.getOrgName();
            this.loginUser = document.cookie.split('username=')[1];//获取当前用户名
            this.getSysRoles();
            this.loginUserId = JSON.parse(this.$getStore('userData')).id;
            this.getSysUserName();
            this.sex = [
                {label:"男"},
                {label:"女"}
            ];
            this.yhlx = getDicData('yhlx');
            this.yhzt = getDicData('yhzt');
            this.zw = getDicData('zw');
            const VM = this;
            VM.screenHeight = document.body.clientHeight-125;
            window.addEventListener("resize", function(){ 
                VM.screenHeight = document.body.clientHeight-125;
            });
        },
        components: {
            paging,UserRoleList,Org,DeptChoose
        },
        computed: {},
        methods: {
            /**
             * 加载动画
             */
            openScreen(key) {//加载...
                this[key] = true;
                setTimeout(() => {
                    this[key] = false;
                }, 400);
            },

            /**********绑定角色start************/
            handleRole(index,row){
                this.tabSize = [24,24,19,19];
                this.userid = row.id;
                this.getRoleListByUid({userid:row.id});
            },
            updateRole(userid){//保存用户角色管理重新获取用户角色列表
                this.getRoleListByUid({userid:userid});
            },
            async getRoleListByUid(params){
                this.openScreen('roleLoading');
                const res = await this.$http.get('/sys/RoleController/getRoleByUser',{params:params});
                if(res.data&&res.data.success){
                    this.defaultKey = res.data.result;
                }else{
                    this.$message.error('获取用户角色列表失败')
                }                
            },
            /**
             * 获取所有角色列表
             */
            async getSysRoles(){
                const res = await this.$http.get('/sys/RoleController/getRoleNames');
                if(res.data&&res.data.success){
                    this.dataTree = res.data.result;
                }else{
                    this.$message.error('获取系统角色列表失败');
                }                
            },
            getRoleByUser(data){
                this.userid = data;
                const params = {userid:data};
                this.getRoleListByUid(params);
            },
            dateFormatFun(row, colum){//时间格式化
                if (row[colum.property] != null) {
                    const d = row[colum.property];
                    return dateFormat(new Date(d),"yyyy-MM-dd hh:mm:ss")
                }
            },
            async getSysUserList(params){
                let data = {
                    page: this.tabPage.currentPage,
                    pageSize: this.tabPage.pageSize,
                    options:this.formInline,
                };
                if (params) {
                    data = params;
                }
                const res = await this.$http.get('/sys/UserController/getUserList', {params: data});
                if (res.data && res.data.success) {
                    const result = res.data.result;
                    for(var i=0;i<result.rows.length;i++){
                        result.rows[i].login_flag =  result.rows[i].login_flag? true : false;
                        if(result.rows[i].sys_org){
                            result.rows[i].org_name=result.rows[i].sys_org.org_name;
                        }else{
                             result.rows[i].org_name = '无';
                        }
                    }
                    this.openScreen('loading');
                    this.sysUserTableData = result.rows;
                    this.tabPage.totalNum = result.count;
                }else{
                    this.$message.error('获取用户列表失败');
                }
            },
            /**
             * 重置密码按钮点击事件
             *
             */
            checkPassWord(){
                if (this.sels.length > 1) {
                    this.$message.warning('只能选择一个用户');
                } else if (this.sels.length === 1) {
                    this.dialogPass = true;
                    this.checkPassForm.id = this.sels[0].id;
                    this.checkPassForm.username = this.sels[0].username;
                } else {
                    this.$message.warning('请选择一个用户');
                }
            },
            /**
             * 重置密码
             */
            submitPassForm(formName){
                const params = {
                    id: this.checkPassForm.id,
                    password: this.checkPassForm.new_password,
                    username:this.checkPassForm.username,
                    update_by:this.loginUserId,
                    flag:3
                };
                const VM = this;
                VM.$refs[formName].validate(async (valid)=> {
                    if (valid) {
                        const res = await VM.$http.post('/sys/UserController/saveUserInfo', params);
                        if (res.data && res.data.success) {
                            VM.dialogPass = false;
                            console.log(VM.checkPassForm.username);
                            if(VM.checkPassForm.username===VM.loginUser){//判断是否为当前用户
                             VM.$parent.logout();
                                // const date = new Date();
                                // date.setTime(date.getTime() - 10000);
                                // document.cookie = "islogin=true; expires=" + date.toGMTString();
                                // VM.$router.push('/Login');//返回登录页
                            }else{
                                VM.$message.success('操作成功');
                                VM.getSysUserList();
                            }
                        }else{
                            VM.$message.error(res.data.msg);
                        }
                       
                    }
                })
            },
            /**
             * 查询部门列表
             */
            async getOrgName(){
                const res = await this.$http.get('/sys/DepartController/getDepartName');
                if (res.data && res.data.success) {
                    const arr = res.data.result;
                    this.options = arr;
                }else{
                    this.$message.error('获取部门信息失败'); 
                }
            },
            /**
             * 查询 根据用户名模糊查询
             * @params {String} formName 进行验证
             */
            onSearch(formName){
                const params = {options:this.formInline};
                params.options.org_id = this.departList1.map((item)=>{
                    return item.id
                });
                params.page = 1;
                params.pageSize = this.tabPage.pageSize;
                this.tabPage.currentPage =1;//每次查询默认第一页
                this.getSysUserList(params);
            },
            /**
             * 点击新增按钮
             */
            handleAdd(){
                $('#upload_img').val('');
                this.image = {};
                this.dialogInfo = true;
                this.formTitle = "新增用户信息";
                this.ruleForm = Object.assign({}, {
                    username:'',
                    password:'',
                    checkPass:'',
                    realname:'',
                    phone:'',
                    gender:'',
                    org_id:undefined
                });
                this.statusInfo = false;
            },
            /**
             * 保存用户信息
             * @params {String} formName 用于验证
             */
            submitForm(formName){
                const VM = this;
                let params = VM.ruleForm;
                if(this.departList0.length>0){
                    params.org_id = this.departList0[0].id
                }else{
                    params.org_id = null;
                }
                params.update_by = this.loginUserId;
              
                let formData = new FormData();
                let file = document.getElementById("upload_img").files[0];
                if(this.delImgInfo){
                    params.delImgInfo = this.delImgInfo;
                };
                formData.append('image', file); //file就是图片或者文件
                $.each(params, function (i, val) {
                    formData.append(i, val);
                });
                formData.append('flag', 1);
                VM.$refs[formName].validate(async function (valid) {
                    if (valid) {
                        let res = await VM.$http.post('/sys/UserController/saveUserInfo', formData);
                        if (res.data && res.data.success) {
                            VM.dialogInfo = false;
                            VM.getSysUserList();
                            VM.getSysUserName();
                            VM.$message.success("操作成功");
                        } else {
                            VM.$message.error(res.data.msg);
                        }
                        
                    }
                });
            },
            /**
             * 表单重置
             * @params {Object} formName 表单名称
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
                this.departList1 = [];
                this.departList0 = [];
                this.setSelectList0 = [];
                this.setSelectList1 = [];
                if(formName=='formInline'){
                    this.getSysUserList();
                }
            },
            /**
             * 编辑按钮点击事件
             * @params {Number} index  行号
             * @params {Object} row 行对象
             */
            handleEdit(index, row) {
                $('#upload_img').val('');
                this.image = {};
                this.delImgInfo = false;
                this.statusInfo = true;
                this.dialogInfo = true;
                this.formTitle = "编辑用户信息";
                this.ruleForm = Object.assign({}, row);
                this.departList0 = [];
                this.setSelectList0 = [];
                if(this.ruleForm.pic_path){
                    // this.delImgInfo = true;
                    this.image.src = 'http://'+this.$webconfig.serverIp+'/'+row.pic_path+'.100X100.png';
                }
                if (row.org_id) {//存在部门
                    this.departList0 = [{id:row.org_id,org_name:row.org_name}];
                    this.setSelectList0 = [row.org_id];
                }
                if(row.username ===this.loginUser){
                    this.isUser = true;
                    this.userPsd = row.password;
                }else{
                    this.isUser = false;
                }
            },
            /**
             * 删除按钮点击事件
             * @params {Number} index   行号
             * @params {Object} row     行对象
             */
            handleDelete(index, row) {
                if(row.id===this.loginUserId){
                    this.$message.warning('用户不能删除自己');
                }else{
                    this.deleteSysUserInfo({id:row.id});
                }
            },
            /**
             * 删除用户信息
             * @params {Object} row|rows     行对象
             */
            deleteSysUserInfo(data){
                const VM = this;
                VM.$confirm('此操作将永久删除选择用户信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await VM.$http.post('/sys/UserController/delUserInfo', data);
                    if (res.data && res.data.success) {
                        VM.getSysUserList();
                        VM.getSysUserName();
                        VM.$message.success('操作成功');
                        VM.tabSize = [24,24,24,24];

                    }else{
                        VM.$message.error('删除用户信息失败');
                    }
                    
                })
            },
            /**
             * 切换每页条数
             * @params {Number} val 每页条数
             */
            handleSizeChange(val) {
                this.tabPage.pageSize = val;
                this.getSysUserList();
            },
            /**
             * 切换页码
             * @params {Number} val 页码
             */
            handleCurrentChange(val) {
                this.tabPage.currentPage = val;
                this.getSysUserList();
            },
            /**
             * 多选框改变选中事件
             * @params {Array} val 当前所有选中行对象数组
             */
            handleSelectionChange(val) {
                this.sels = val;
            },
            /**
             * 更改状态
             * @param index
             * @param row
             */
            async changeStatus(index, row){
                const VM = this;
                const login_flag = row.login_flag===true? 1 : 0;
                const params = {
                    id: row.id,
                    login_flag: row.login_flag,
                    update_by:this.loginUserId,
                    flag:2
                };
                const res = await VM.$http.post('/sys/UserController/saveUserInfo', params);
                if (res.data && res.data.success) {
                    VM.$message.success('状态更新成功');
                    VM.getSysUserList();
                }else{
                    VM.$message.error('用户状态更改失败');
                }
            },
            /**
             * 获取用户名下拉
             */
            async getSysUserName(){
                const res = await this.$http.get('/sys/UserController/getUserName');
                if(res.data&&res.data.success){
                    this.usersList = res.data.result;
                }else {
                    this.$message.error('获取用户列表失败');
                }
                
            },
            hideRight(d){
                this.tabSize=[24,24,24,24];
            },
            chooseImg(){
                $('input[type=file]').trigger('click');
                return false
            },
            /**
             * 图片选择change事件
             *
             */
            onFileChange(e){
                let files = e.target.files || e.dataTransfer.files;
                if(files[0]){
                    const isImg = files[0].type.substr(0, 5);
                    const isLt2M = files[0].size / 1024 / 1024 < 2;
                    if (isImg !== 'image') {
                        this.$message.error('只能上传图片！')
                    }
                    if (!isLt2M) {
                        this.$message.error('上传图片大小不能超过2M！')
                    }
                    if (isImg === 'image' && isLt2M) {
                        if (!files.length) return;
                        this.createImage(files)
                    }
                    if(this.ruleForm.pic_path){
                        this.delImgInfo = true;
                    }
                    return isImg === 'image' && isLt2M
                }

            },
            //读取图片操作
            createImage(files){
                let VM = this
                for (let file of files) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        VM.image = {src: e.target.result}
                    };
                    reader.readAsDataURL(file);
                }
            },
            removeImg(){
                $('#upload_img').val('');
                this.image = {};
                if(this.ruleForm.pic_path){
                    this.delImgInfo = true;
                }
            },
            /**
             * 部门选择
             */
            chooseDeparts() {
                this.dialogVisible = true;
                if(this.departList1.length>0){
                    this.setSelectList1 = this.departList1.map((item)=>{
                        return item.id;
                    })
                }else{
                    this.setSelectList1 = [];
                }
            },
            
             /**
            * 关闭dialog
            * @value 关闭状态 0 取消 1 确定
            */
            closeDialog(value) {
                if (value === 1) {
                    this.departList1 = this.departTreeChangeArr1;
                }
                this.dialogVisible = false;
            },
            /**
            * @param {Object} data 组织树回调
            */
            selectedNodes(data) {
                this.departTreeChangeArr1 = data;
            },

             /**
             * 单个部门选择
             */
            chooseDepart() {
                this.editDialog = true;
                if(this.departList0.length>0){
                    this.setSelectList0 = this.departList0.map((item)=>{
                        return item.id;
                    })
                    this.index = 1;
                }else{
                    this.setSelectList0 = [];
                    this.index = 0;
                }
            },
            
             /**
            * 关闭dialog
            * @value 关闭状态 0 取消 1 确定
            */
            closeEditDialog(value) {
                if (value === 1) {
                    this.departList0 = this.departTreeChangeArr0;
                }
                this.editDialog = false;
            },
            /**
            * @param {Object} data 组织树回调
            */
            selectedNode(data) {
                this.departTreeChangeArr0 = data;
            },
            addIndex(val){
                this.index = val;
            },
            /**
             * 查看用户资料
             * @params {userid} string 
             */
            async handleInfo(userid) {
                const data = {
                    userid:userid
                };
                const res = await this.$http.get('/sys/UserController/getUserInfo',{params:data});
                if(res.data&&res.data.success){
                    this.dialogDetail = true;
                    this.detailForm = res.data.result[0];
                    this.detailForm.duties = this.getDataView(this.detailForm.duties,'zw');
                    this.detailForm.status = this.getDataView(this.detailForm.status,'yhzt');
                    this.detailForm.user_type = this.getDataView(this.detailForm.user_type,'yhlx');

                    if(this.detailForm.pic_path){
                        this.detailForm.pic_path = 'http://'+this.$webconfig.serverIp+'/'+this.detailForm.pic_path+'.100X100.png';
                    }
                    if(!this.detailForm.org_name){
                        this.detailForm.org_name = "暂无";
                    }
                }else{
                    this.$message.error('用户详情获取失败');
                }
               
            },   
            getDataView(value,key){
                if(value){
                    const list = getDicData(key);
                    const dateArr = list.filter((item)=>{
                        return item.value == value;
                    })
                    if(dateArr.length>0){
                        return dateArr[0].label;
                    }else{
                        return '无';
                    }
                }else{
                    return '无';
                }
                
            },
            /**
             *批量删除按钮点击事件
             *
             */
            deleteSome(){
               if (this.sels.length === 0) {
                    this.$message.warning('请选择用户');
                } else {
                    const  dataArr = this.sels.map((item)=>{
                        return item.id
                    })
                    if(dataArr.indexOf(this.loginUserId)!==-1){
                        this.$message.warning('包含用户自己，请先取消选择');
                    }else{
                        this.deleteSysUserInfo({id:dataArr});
                    }
                } 
            }    

        }
    }
</script>

<style>
.user-search-form .userTagClass {
  height: 28px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 5px;
  line-height: 28px;
  overflow-y: auto;
  width: 150px;
  box-sizing: border-box;
}
.user-search-form .el-input,.user-search-form .el-select{
    width:150px!important;
}

.userFormStle .el-input,.userFormStle .el-textarea,.userFormStle .el-select{
    min-width:210px;
}
.userFormStle .el-select{
    width:100%;
}

.userManage .input_file {
    display: none;
}
.userManage .img-avatar {
    width: 109px;
    height: 109px;
    display: block;
    cursor: pointer;
}

.userManage .img_src {
    background-image: url('../../../assets/images/default.jpg');
    background-size: 109px 109px;
}
.removebtn{
    margin-left:95px;
    margin-top:-10px;
}

.userDialog .userTagClass {
  min-height: 28px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 5px;
  line-height: 28px;
  overflow: auto;
  min-width: 210px;
  box-sizing: border-box;
}

.userManage .el-tag {
  padding: 0 5px;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
}

.userManage .el-tag--depart {
  background-color: #20a0ff;
  border-color: rgba(18, 206, 102, .2);
  color: #fbfdff;
}

.user-detail-form .el-input--mini {
    font-size: 14px!important;
}
.user-detail-form .el-textarea {
    min-width:202px!important;
}
.user-detail-form .img-avatar {
    width: 109px;
    height: 109px;
    display: block;
    cursor: pointer;
}
.user-detail-form .el-input.is-disabled .el-input__inner {
    background-color: #fff!important;
    border-color: #fff!important;
    color: #000!important;
    cursor: default!important;
}
.user-detail-form .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff!important;
    border-color: #fff!important;
    color: #000!important;
    cursor:default!important;
}
</style>
