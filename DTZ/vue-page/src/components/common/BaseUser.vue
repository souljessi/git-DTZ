<template>
    <div class="baseuser">
        <!--dialog-->
        <el-dialog width="41%" title="个人资料" :visible.sync="dialogInfo" :modal-append-to-body="false" v-on:close="resetForm('ruleForm')">
            <el-form inline :model="ruleForm"  ref="ruleForm" label-width="85px" class="base-user-form">
                <el-form-item label="用户名:" prop="username">
                    <el-input  v-model="ruleForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名:" prop="realname">
                    <el-input  v-model="ruleForm.realname" disabled></el-input>
                </el-form-item>
                <el-form-item label="组织机构:" prop="org_id">
                    <el-input v-model="ruleForm.org_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号码:" prop="phone">
                    <el-input  v-model="ruleForm.phone" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户状态:" prop="status">
                    <el-input  v-model="ruleForm.status" disabled></el-input>
                </el-form-item>
                 <el-form-item label="用户类型:" prop="user_type">
                    <el-input  v-model="ruleForm.user_type" disabled></el-input>
                </el-form-item>
                 <el-form-item label="性别:" prop="gender">
                    <el-input  v-model="ruleForm.gender" disabled></el-input>
                </el-form-item>
                <el-form-item label="职务:" prop="duties">
                    <el-input  v-model="ruleForm.duties" disabled></el-input>
                </el-form-item>
                  <el-form-item label="工号:" prop="job_no">
                    <el-input  v-model="ruleForm.job_no" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                    <el-input  v-model="ruleForm.email" disabled></el-input>
                </el-form-item>
               <el-form-item label="创建人:" prop="create_name">
                    <el-input v-if="ruleForm.create_name" v-model="ruleForm.create_name" disabled></el-input>
                    <el-input v-else value="未知" disabled></el-input>
                </el-form-item>
                <el-form-item label="创建时间:" prop="createdate">
                    <el-input v-if="ruleForm.createdate"  v-model="ruleForm.createdate" disabled></el-input>
                    <el-input v-else value="未知" disabled></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remarks">
                    <el-input type="textarea" v-if="ruleForm.remarks"  v-model="ruleForm.remarks" disabled></el-input>
                    <el-input v-else value="无" disabled></el-input>
                </el-form-item>
                <el-form-item label="头像:" style="width:48%" v-if="ruleForm.pic_path">
                    <div style="width:110px;height:110px;">
                        <img  :src="ruleForm.pic_path" class="img-avatar">
                    </div>
                </el-form-item>
                <el-form-item label="头像:" v-else>
                    <el-input value="暂无头像" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogInfo=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--dialog changePsd-->
        <el-dialog width="25%" title="修改密码" :visible.sync="dialogPass" :modal-append-to-body="false" :close-on-click-modal="false"
                   v-on:close="resetForm('checkPassForm')">
            <el-form :model="checkPassForm" :rules="rules" ref="checkPassForm" label-width="90px">
                <el-form-item label="旧密码" prop="old_password">
                    <el-input  v-model="checkPassForm.old_password" type="password" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_password">
                    <el-input  v-model="checkPassForm.new_password" type="password" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="check_password">
                    <el-input  v-model="checkPassForm.check_password" type="password" placeholder="请再次输入新密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogPass=false">取 消</el-button>
                <el-button type="primary" @click="submitPassForm('checkPassForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {dateFormat} from 'assets/js/date.js'
    import { getDicData } from "assets/js/commonManage.js"
    export default {
        data(){
            const validateOldPass = (rule, value, callback) => {//旧密码验证
                const data = {
                    id:this.loginUserId,
                    username:this.loginUserName,
                    password:value
                };
                if(value===""){
                    callback(new Error('请输入旧密码'));
                }else{
                    this.$http.get('/sys/UserController/checkPsd',{params:data}).then(res =>{
                        if(res.data&&res.data.success){
                            callback();
                        }else{
                            callback(new Error('旧密码输入错误!'));
                        }
                    }).catch(err =>{
                        if(err){
                            callback(new Error('旧密码查询错误!'));
                        }
                    })
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

            return {
                dialogInfo: false,//模态框是否显示标识
                dialogPass: false,//修改密码模态显示标识
                ruleForm: {},//新增表单数据
                checkPassForm: {
                    old_password:'',
                    new_password:'',
                    check_password:''
                },//修改密码表单
                rules: {
                    old_password: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                        {validator: validateOldPass, trigger: 'blur'}
                    ],
                    new_password: [
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    check_password: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: validateNewPass, trigger: 'blur'}
                    ]
                },
                loginUserId:'',//登录用户id
                loginUserName:'',//登录用户名

            }
        },
        created: function () {},
        mounted: function () {
            this.loginUserId = JSON.parse(this.$getStore('userData')).id;
            this.loginUserName = JSON.parse(this.$getStore('userData')).username;
        },
        components: {},
        computed: {},
        methods: {
            dateFormatFun(value){//时间格式化
                return dateFormat(new Date(value),"yyyy-MM-dd hh:mm")
            },
            /**
             * 修改密码按钮点击事件
             *
             */
            checkPassWord(){
                this.dialogPass = true;
            },
            /**
             * 修改密码
             */
            submitPassForm(formName){
                const params = {
                    id: this.loginUserId,
                    password: this.checkPassForm.new_password,
                    username:this.loginUserName,
                    update_by:this.loginUserId,
                    flag:3
                };
                const VM = this;
                VM.$refs[formName].validate(async (valid)=> {
                    if (valid) {
                        const res = await VM.$http.post('/sys/UserController/saveUserInfo', params);
                        if (res.data && res.data.success) {
                            VM.dialogPass = false;
                            VM.$parent.logout();
                        }else{
                            VM.$message.error(res.data.msg);
                        }
                       
                    }
                })
            },
            /**
             * 表单重置
             * @params {Object} formName 表单名称
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 查看个人资料
             * @params {userid} string 
             */
            async handleInfo() {
                const data = {
                    userid:this.loginUserId
                };
                const res = await this.$http.get('/sys/UserController/getUserInfo',{params:data});
                if(res.data&&res.data.success){
                    this.dialogInfo = true;
                    this.ruleForm = res.data.result[0];
                    this.ruleForm.duties = this.getDataView(this.ruleForm.duties,'zw');
                    this.ruleForm.status = this.getDataView(this.ruleForm.status,'yhzt');
                    this.ruleForm.user_type = this.getDataView(this.ruleForm.user_type,'yhlx');

                    if(this.ruleForm.pic_path){
                        this.ruleForm.pic_path = 'http://'+this.$webconfig.serverIp+'/'+this.ruleForm.pic_path+'.100X100.png';
                    }
                    if(!this.ruleForm.org_name){
                        this.ruleForm.org_name = "暂无";
                    }
                }else{
                    this.$message.error('获取个人资料失败');
                }
               
            },   
            getDataView(value,key){
                const list = getDicData(key);
                const dateArr = list.filter((item)=>{
                    return item.value == value;
                })
                if(dateArr.length>0){
                    return dateArr[0].label;
                }else{
                    return '暂无';
                }
            }      

        }
    }
</script>

<style>
.baseuser .base-user-form .el-input--mini {
    font-size: 14px!important;
}
.baseuser .base-user-form .el-textarea.is-disabled {
    width:202px!important;
}

.baseuser .base-user-form .img-avatar {
    width: 109px;
    height: 109px;
    display: block;
    cursor: pointer;
}
.baseuser .base-user-form .el-input.is-disabled .el-input__inner {
    background-color: #fff!important;
    border-color: #fff!important;
    color: #000!important;
    cursor: default!important;
}
.baseuser .base-user-form .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff!important;
    border-color: #fff!important;
    color: #000!important;
    cursor:default!important;
}
</style>
