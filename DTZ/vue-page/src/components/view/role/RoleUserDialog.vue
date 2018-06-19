<template>
    <div>
       
        <!--dialog-->
        <el-dialog  title="绑定已有用户" :visible.sync="userDialog" :modal-append-to-body="false" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" :ref="formInline">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="formInline.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model="formInline.realname" placeholder="真实姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
                    <el-button type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>

                </el-form-item>
            </el-form>
            <!--表单-->
           <el-table
                :data="sysUserTableData"
                border 
                highlight-current-row
                :height="300"
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
            >
            </el-table-column>
            <el-table-column 
                min-width="120"
                prop="realname"
                label="真实姓名">
            </el-table-column>
            <el-table-column 
                min-width="120"
                prop="phone"
                label="电话号码">
            </el-table-column>
            <el-table-column 
                prop="login_flag" 
                :formatter="statusFormatFun"
                label="状态">
            </el-table-column>
        </el-table>
        <paging @emitsizechange="handleSizeChange"
                @emitcurrentchange="handleCurrentChange"
                :currentPage="tabPage.currentPage"
                :pageSizes="tabPage.pageSizes"
                :pageSize="tabPage.pageSize"
                :total="tabPage.totalNum">
        </paging>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close()">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
        </el-dialog>
      

        <router-view></router-view>
    </div>
</template>

<script>
    import paging from '../../common/BasePaging.vue'
    export default {
        data(){
            return {
                sysUserTableData: [],//用户列表数组
                sels:[],//列表选中项
                tabPage: {
                    currentPage: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 50]
                },//分页信息
                loading: true,
                ruleForm: {},//新增表单数据
                options: [],//部门数组
                formInline:{
                    username:'',
                    realname:''
                }
            }
        },
        props: ['roleid','userDialog'],
        created: function () {

        },
        mounted: function () {
            this.openScreen();
        },
        components: {
            paging
        },
        computed: {},
        watch:{
            roleid:function(){
                this.getUserListNotRole();
            },
            userDialog:function(){
                this.openScreen();
                this.getUserListNotRole();
            }
        },
        methods: {
            /**
             * 加载动画
             */
            openScreen() {//加载...
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
            }, 400);
            },
            statusFormatFun(row, colum){//用户状态格式化
                if (row[colum.property] != null) {
                    const d = row[colum.property];
                    return d == '1' ? "激活" : d == '0' ? "锁定"  : "未知";
                }
            },
            async getUserListNotRole(params){
                let data = {
                    page: this.tabPage.currentPage,
                    pageSize: this.tabPage.pageSize,
                    options:this.formInline,
                    roleid:this.roleid
                };
                if (params) {
                    data = params;
                }
                const res = await this.$http.get('/sys/RoleController/getUsersNotBind', {params: data});
                if (res.data && res.data.success) {
                    const d = res.data.result;
                    this.sysUserTableData = d.rows;
                    this.tabPage.totalNum = d.count;
                }else{
                    this.$message.error('获取未绑定角色的用户列表失败');
                }
                
            },
            /**
             * 查询 根据用户名模糊查询
             * @params {String} formName 进行验证
             */
            onSearch(){
                let params = {options:this.formInline};
                params.roleid = this.roleid;
                params.page = 1;
                params.pageSize = this.tabPage.pageSize;
                this.tabPage.currentPage =1;//每次查询默认第一页
                this.openScreen();
                this.getUserListNotRole(params);
                   
            },
            /**
             * 保存用户角色关联信息
             * @params {String} formName 用于验证
             */
            async submitForm(){
                if(this.sels.length>0){
                    const arr = this.sels.map((item)=>{
                        return item.id;
                    });
                    const params = {
                        roleid:this.roleid,
                        userList:arr
                    };
                    const res = await this.$http.post('/sys/RoleController/saveUserRole', params);
                    if (res.data && res.data.success) {
                        this.getUserListNotRole();
                        this.$emit('close',{dialog:false,status:'change'});
                        this.$message.success('操作成功');
                    } else {
                        this.$message('保存用户角色关联失败');
                    }
                   
                }else{
                    this.$message.warning('请选择用户');
                }
            },
            /**
             * 切换每页条数
             * @params {Number} val 每页条数
             */
            handleSizeChange(val) {
                this.tabPage.pageSize = val;
                this.getUserListNotRole();
            },
            /**
             * 切换页码
             * @params {Number} val 页码
             */
            handleCurrentChange(val) {
                this.tabPage.currentPage = val;
                this.getUserListNotRole();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.sels = val;
            },
            close(){
                this.sels = [],
                this.formInline = {username:'',realname:''};
                this.$emit('close',{dialog:false});
            },
            /**
             * 表单重置
             * @params {Object} formName 表单名称
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
                this.openScreen();
                this.getUserListNotRole();

            },
        }
    }
</script>

<style scoped>

</style>
