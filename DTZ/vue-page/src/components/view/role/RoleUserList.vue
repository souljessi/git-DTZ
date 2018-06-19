<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
            <el-form-item label="用户名" prop="username">
                <el-input  v-model="formInline.username" placeholder="用户名"></el-input>
            </el-form-item>
            <!-- <el-form-item label="真实姓名" prop="realname">
                <el-input  v-model="formInline.realname" placeholder="真实姓名"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button  type="primary" icon="el-icon-search" @click="onSearch('formInline')">查询</el-button>
                <el-button  type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
            </el-form-item>
            <el-form-item style="margin-left:10px;">
                <el-button  type="warning" icon="el-icon-plus" @click="handleBindUser">已有用户</el-button>
                <el-button  type="primary" icon="el-icon-d-arrow-right" @click="handleHide()">收起</el-button>
            </el-form-item>

        </el-form>
        <!--表单-->
        <el-table
            :data="sysUserTableData"
            border
            :height="heightSet-110" 
            v-loading="isloading"
            style="width: 100%">
            </el-table-column>
            <el-table-column
                prop="username"
                label="用户名"
            >
            </el-table-column>
            <el-table-column 
                min-width="115"
                prop="realname"
                label="真实姓名"
                sortable>
            </el-table-column>
            <el-table-column 
                width="70"
                prop="login_flag" 
                :formatter="statusFormatFun"
                label="状态">
            </el-table-column>
            <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                    <el-button
                        type="warning"
                        @click="handleUnbund(scope.$index, scope.row)">解绑
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
             
        <role-user-dialog :userDialog="userDialog" :roleid="roleid" @close="closUserDialog"></role-user-dialog>
        <router-view></router-view>
    </div>
</template>

<script>
    import paging from '../../common/BasePaging.vue'
    import RoleUserDialog from './RoleUserDialog.vue'
    export default {
        data(){
            return {
                sysUserTableData: [],//用户列表数组
                tabPage: {
                    currentPage: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 50]
                },//分页信息
                formInline: {//查询表单对象
                    username: '',
                    realname:''
                },
                userDialog:false,//绑定已有用户弹窗
            }
        },
        props: ['roleid','isloading','heightSet'],
        created: function () {

        },
        mounted: function () {
            this.getUserListByRole();
        },
        components: {
            paging,RoleUserDialog
        },
        computed: {},
        watch:{
            roleid:function(){
                this.formInline = {username:'',realname:''};
                this.getUserListByRole();
            },
            isloading:function(){
                if(this.isloading){
                    setTimeout(() => {
                        this.$emit('changeList',false);
                    }, 400);
                }
            }
        },
        methods: {
            statusFormatFun(row, colum){//用户状态格式化
                if (row[colum.property] != null) {
                    var d = row[colum.property];
                    return d == '1' ? "激活" : "锁定"; 
                }
            },
            async getUserListByRole(params){
                let data = {
                    page: this.tabPage.currentPage,
                    pageSize: this.tabPage.pageSize,
                    options:this.formInline,
                    roleid:this.roleid
                };
                if (params) {
                    data = params;
                }
                const res = await this.$http.get('/sys/RoleController/getUsersByRole', {params: data});
                if (res.data && res.data.success) {
                    var d = res.data.result;
                    this.sysUserTableData = d.rows;
                    this.tabPage.totalNum = d.count;
                }else{
                    this.$message.error('按角色获取用户列表失败');
                }
                              
            },
            /**
             * 查询 根据用户名模糊查询
             * @params {String} formName 进行验证
             */
            onSearch(formName){
                var params = {options:this.formInline};
                params.roleid = this.roleid;
                params.page = 1;
                params.pageSize = this.tabPage.pageSize;
                this.tabPage.currentPage =1;//每次查询默认第一页
                this.$emit('changeList',true);
                this.getUserListByRole(params);
                  
            },
            /**
             * 表单重置
             * @params {Object} formName 表单名称
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
                if(formName=='formInline'){
                    this.$emit('changeList',true);
                    this.getUserListByRole()
                }
               
            },
            /**
             * 删除按钮点击事件
             * @params {Number} index   行号
             * @params {Object} row     行对象
             */
            // handleDelete(index, row) {
            //     this.deleteSysUserInfo({id:row.id});
            // },
            /**
             * 删除用户信息
             * @params {Object} row|rows     行对象
             */
            // deleteSysUserInfo(data){
            //     const _vm = this;
            //     this.$confirm('此操作将永久删除选择用户信息, 是否继续?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(async () => {
            //         const res = await _vm.$http.post('/sys/RoleController/delUserInfo', data);
            //         if (res.data && res.data.success) {
            //             _vm.getUserListByRole();
            //             _vm.$message.success('操作成功');
            //         }else{
            //             _vm.$message.error('删除用户失败');
            //         }                
            //     }).catch(() => {

            //     });
            // },
            /**
             * 切换每页条数
             * @params {Number} val 每页条数
             */
            handleSizeChange(val) {
                this.tabPage.pageSize = val;
                this.getUserListByRole();
            },
            /**
             * 切换页码
             * @params {Number} val 页码
             */
            handleCurrentChange(val) {
                this.tabPage.currentPage = val;
                this.getUserListByRole();
            },
            handleBindUser(){
                this.userDialog = true;
            },
            closUserDialog(d){
                this.userDialog = d.dialog;
                if(d.status){
                    this.getUserListByRole();
                }
            },
            async handleUnbund(index,row){
                const params = {roleid:this.roleid,userid:row.id};
                const res = await this.$http.post('/sys/RoleController/delUserRole',params);
                if(res.data&&res.data.success){
                    this.getUserListByRole();
                    this.$message.success('操作成功');
                }else{
                    this.$message.error('解除用户角色绑定失败');
                }            
            },
            handleHide(){
                this.$emit('hideUser',24);
            },

        }
    }
</script>

<style scoped>
    /*@media (min-width: 1200px){
        .el-input--mini{
            width:100%;
        }
    }
    @media (min-width: 992px) and (max-width:1200px){
        .el-input--mini{
            width:120px;
        }
        .el-form-item__label{
            font-size:12px
        }
    }
    @media (max-width: 992px){
        .el-input {
            width: 100%;
        }
        .el-form-item__label{
            font-size:14px
        }
        .rightTitle{
            position: relative;
            top:2px;
            font-size: 14px
        }
    }*/

</style>
