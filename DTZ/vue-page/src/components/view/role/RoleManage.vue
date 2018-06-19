<template>
    <div>
        <el-row :gutter="3">
            <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]">
            <!--查询-->
            <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
                <el-form-item label="角色名称" prop="rolename">
                    <el-input  v-model="formInline.rolename" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" icon="el-icon-search" @click="onSearch('formInline')">查询</el-button>
                    <el-button  type="info" @click="resetForm('formInline')" icon="el-icon-refresh">重置</el-button>
                </el-form-item>
                 <el-form-item style="margin-left: 30px">
                    <el-button  type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>

            <!--表单-->
            <el-table
                :data="sysRoleTableData"
                highlight-current-row
                border
                v-loading="loading"
                :height="screenHeight-110"
                style="width: 100%">
                <el-table-column
                    prop="rolename"
                    label="角色名称"
                    show-overflow-tooltip
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="rolecode"
                    min-width="100"
                    label="角色编码"
                    show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column
                    prop="is_sys"
                    label="是否系统数据"
                    :formatter="boolFormatFun">
                </el-table-column>
                <el-table-column
                    prop="useable"
                    label="是否可用"
                    :formatter="boolFormatFun">
                </el-table-column> -->
                <el-table-column
                    prop="data_scope"
                    label="数据范围"
                    min-width="110"
                    :formatter="rangeFormatFun"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button
                            :disabled="scope.row.id===defRole"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button  @click="handleUsersTab(scope.$index, scope.row)" type="info">用户</el-button>
                        <el-button
                          @click="handleRights(scope.$index, scope.row)" type="warning">授权
                        </el-button>
                        <el-button
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            :disabled="scope.row.id===defRole">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--  分页  -->
            <paging @emitsizechange="handleSizeChange"
                    @emitcurrentchange="handleCurrentChange"
                    :currentPage="tabPage.currentPage"
                    :pageSizes="tabPage.pageSizes"
                    :pageSize="tabPage.pageSize"
                    :total="tabPage.totalNum">
            </paging>
            </el-col>
            <el-col :xs="24" :sm="24" :md="9" :lg="9" v-show="tabSize[3]===15&&isMenuList===true">
                <role-menu-tree
                    :roles="rolesList"
                    :dataTree="dataTree"
                    :defaultKey="defaultKey"
                    :roleid="roleid"
                    @changeRole="getMenuByRole"
                    :isloading="rightLoading"
                    @changeList="loadingStatus"
                    @hideRight="hideRight"
                    :heightSet="screenHeight">
                </role-menu-tree >
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" v-show="tabSize[3]===12&&isUserList===true">
                <role-user-list
                    :roleid="userRoleid"
                    :isloading="userLoading"
                    @changeList="loadingStatus"
                    @hideUser="hideRight"
                    :heightSet="screenHeight">
                </role-user-list>
            </el-col>
        </el-row>

        <!--dialog-->
        <el-dialog v-bind:title="formTitle" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" v-on:close="resetForm('ruleForm')" width="35%">
            <el-form :model="ruleForm" :rules="this.$validateRule" ref="ruleForm" label-width="110px">
                <el-form-item label="角色名称" prop="rolename">
                    <el-input  v-model="ruleForm.rolename"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" prop="rolecode">
                    <el-input  v-model="ruleForm.rolecode" :disabled="this.editRole===true"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="enname">
                    <el-input  v-model="ruleForm.enname"></el-input>
                </el-form-item>
                <el-form-item label="数据范围" prop="data_scope">
                     <el-select  v-model="ruleForm.data_scope" placeholder="请选择">
                        <el-option
                            v-for="item in sjfw"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构授权" v-show="ruleForm.data_scope==5"> 
                    <div class="roleTagClass" @click="chooseDepart">
                        <el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type"  v-for="item in departList" :key="item.id">
                            {{item.org_name}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input  type="textarea" v-model="ruleForm.description"></el-input>
                </el-form-item>
                <el-form-item label="是否系统数据" prop="is_sys">
                    <el-radio v-model="ruleForm.is_sys" label='1'>是</el-radio>
                    <el-radio v-model="ruleForm.is_sys" label='0'>否</el-radio>
                </el-form-item>
                <el-form-item label="是否可用" prop="useable">
                    <el-radio v-model="ruleForm.useable" label='1'>是</el-radio>
                    <el-radio v-model="ruleForm.useable" label='0'>否</el-radio>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input  type="textarea" v-model="ruleForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogInfo=false">取 消</el-button>
                <el-button  type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="机构授权" :visible.sync="dialogVisible" class="groupclass" :close-on-click-modal="false">
            <Org style="height: 335px;overflow-y: scroll"
                :dialog-visible="dialogVisible"
                type="attendanceClerk"
                ref="attendanceClerk"
                :setSelect='setSelectList'
                @selectdNode='selectdNode'
                title="机构授权"
                :strictly="true"
            ></Org>
            <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeDialog(1)">确 定</el-button>
                </span>
            </div>
        </el-dialog>
        <router-view></router-view>
    </div>
</template>

<script>
    import paging from 'common/BasePaging.vue';
    import RoleMenuTree from './RoleMenuTree.vue';
    import RoleUserList from './RoleUserList.vue';
    import { getDicData } from "assets/js/commonManage.js";
    import Org from 'common/departTree'

    export default {
        data(){
            return {
                /*****************/
                defRole:"000000",
                dataTree: [],
                defaultKey:[],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                /**************/
                sysRoleTableData: [],//角色列表数组
                sels: [],//表格选中列
                tabPage: {
                    currentPage: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 30, 50]
                },//分页信息
                loading: true,
                formInline: {//查询表单对象
                    rolename: ''
                },
                dialogInfo: false,//模态框是否显示标识
                ruleForm: {//新增表单数据
                },
                formTitle: '',//新增编辑模态框title
                roleid:'',//角色id
                userRoleid:'',//角色id查询用户
                userData:[],//用户列表
                rolesList:[],//获取角色下拉
                tabSize:[24,24,24,24],//栅格用户列表
                rightSize:8,//栅格用户角色列表
                isUserList:false,//显示用户列表
                isMenuList:false,//显示权限列表
                userLoading:false,//右侧用户列表加载效果
                rightLoading:false,//右侧权限列表
                treeDisabledInfo:false,//菜单数默认可勾选
                screenHeight: document.body.clientHeight-125,
                sjfw:[],//数据范围
                options:[],//部门数据
                loginUser:'',//登录用户id
                dialogVisible: false,//组织机构树弹窗
                setSelectList: [],
                departList: [],//部门数据
                editRole:false//是否编辑
            }
        },
        created: function () {
            // this.getPlOrgName()

        },
        mounted: function () {
            this.sjfw = getDicData('sjfw')||[];
            this.openScreen();
            this.getSysRoleList();
            this.getSysMenu();
            this.getRoleName();
            this.loginUser = JSON.parse(this.$getStore('userData')).id;
            const VM = this;
            VM.screenHeight = document.body.clientHeight-125;
            window.addEventListener("resize", function(){
                VM.screenHeight = document.body.clientHeight-125;
            });
        },
        components: {
            paging,RoleMenuTree,RoleUserList,Org
        },
        computed: {},
        methods: {
            /**
            * @param {Object} data 组织树回调
            */
            selectdNode(data) {
                this.departTreeChangeArr = data;
            },
            /**
             * 部门选择
             */
            chooseDepart() {
                this.dialogVisible = true;
                if(this.departList.length>0){
                    this.setSelectList = this.departList.map((item)=>{
                        return item.id;
                    })
                }else{
                    this.setSelectList = [];
                }

            },
            /**
            * 关闭dialog
            * @value 关闭状态 0 取消 1 确定
            */
            closeDialog(value) {
                var _self = this;
                if (value === 1) {
                    this.departList = this.departTreeChangeArr;
                }
                this.dialogVisible = false;
            },
            openScreen() {//加载...
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                }, 400);
            },
            rangeFormatFun(row, colum){//时间格式化
                let res = '未知';
                if (row[colum.property] != null) {
                    const d = row[colum.property];
                    for(var i in this.sjfw){
                        if(this.sjfw[i].value==d){
                            res = this.sjfw[i].label
                        }
                    }
                    return res;
                }
            },
            boolFormatFun(row, colum){//格式化
                if (row[colum.property] != null) {
                    const d = row[colum.property];
                    return d===0?'否':d===1?'是':'未知';
                }
            },
            handleRights(index,row){
                this.tabSize = [24,24,15,15];
                this.isUserList = false;
                this.isMenuList = true;
                this.roleid =row.id;
                this.getMenuByRole(this.roleid);
            },
            setDisabledTree(status){
                if(this.dataTree.length>0){
                    this.dataTree = this.dataTree.map((i)=>{
                        i.disabled = status;
                        if(i.children){
                            i.children = this.setChild(i.children,status);
                        }
                        return i;
                    })
                }
            },
            setChild(children,status){//递归
                for(var i in children){
                    children[i].disabled = status;
                    if(children[i].children){
                        this.setChild(children[i].children,status);
                    }
                }
                return children;
            },
            async getRoleMenu(params){
                const res = await this.$http.get('/sys/RoleController/getRoleMenu',{params:params})
                if(res.data&&res.data.success){
                    this.defaultKey = res.data.result;
                }else{
                    this.$message.warning(res.data.msg)
                }
                
            },
            /******/
            async getSysMenu(){
                const res = await this.$http.get('/sys/RoleController/getAllMenu');
                if(res.data&&res.data.success){
                    const result = res.data.result;
                    this.dataTree = this.transData(result, 'id', 'parent_id', 'children');
                }else{
                    this.$message.error(res.data.msg)
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
                var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
                for(; i < len; i++){
                    hash[a[i][id]] = a[i];
                }
                for(; j < len; j++){
                    var aVal = a[j], hashVP = hash[aVal[pid]];
                    if(hashVP){
                        !hashVP[children] && (hashVP[children] = []);
                        hashVP[children].push(aVal);
                    }else{
                        r.push(aVal);
                    }
                }
                return r;
            },

            /**
             * 获取角色列表
            */
            async getSysRoleList(params){
                if (!params) {
                    const data = {
                        page: this.tabPage.currentPage,
                        pageSize: this.tabPage.pageSize,
                        rolename: this.formInline.rolename
                    };
                    params = data;
                }
                const res = await this.$http.get('/sys/RoleController/getRoleList', {params: params});
                if (res.data && res.data.success) {
                    const d = res.data.result;
                    this.sysRoleTableData = d.rows;
                    this.tabPage.totalNum = d.count;
                }else{
                    this.$message.waring(res.data.msg);
                }
                
            },
            async getRoleName(){
                const res = await this.$http.get('/sys/RoleController/getRoleNames');
                if(res.data&&res.data.success){
                    this.rolesList = res.data.result;
                }else {
                    this.$message.warning(res.data.msg);
                }
                
            },
            getMenuByRole(data){
                this.roleid = data
                const params = {roleid:data};
                this.rightLoading = true;
                this.getRoleMenu(params);
                if(this.roleid===this.defRole){
                    if(this.treeDisabledInfo===false){
                        this.setDisabledTree(true);
                        this.treeDisabledInfo=true;
                    }
                }else{
                    if(this.treeDisabledInfo===true){
                        this.setDisabledTree(false);
                        this.treeDisabledInfo=false;
                    }
                }
            },
            /**
             * 查询 根据角色名称模糊查询
             * @params {String} formName 进行验证
             */
            onSearch(formName){
                let params = this.formInline;
                params.page = 1;
                params.pageSize = this.tabPage.pageSize;
                this.tabPage.currentPage =1;//每次查询默认第一页
                this.openScreen();
                this.getSysRoleList(params);
            },
            /**
             * 点击新增按钮
             */
            handleAdd(){
                this.dialogInfo = true;
                this.editRole = false;//角色编码可编辑
                this.formTitle = "新增角色信息";
                this.ruleForm = Object.assign({},{
                    rolename:'',
                    rolecode:'',
                    description:'',
                    useable:'1',
                    is_sys:'1',
                    data_scope:undefined,
                    remarks:''
                });
                this.departList = [];
                this.setSelectList = [];
            },
            /**
             * 保存角色信息
             * @params {String} formName 用于验证
             */
            submitForm(formName){
                const _vm = this;
                const params = Object.assign({},_vm.ruleForm);
                if(params.data_scope===5){
                    if(this.departList.length>0){
                        const orgList = this.departList.map((item)=>{
                            return item.id;
                        });
                        params.auth_org_ids = orgList.join(',');
                    }else{
                        return this.$message.warning('按明细设置，请至少选择一个部门');
                    }
                }else{
                    if(params.id){//编辑 数据权限非5 
                         params.auth_org_ids = null;
                    }
                }
               
                params.is_sys = Number(params.is_sys);
                params.useable = Number(params.useable);
                params.update_by = this.loginUser;
                this.$refs[formName].validate(async (valid)=>{
                    if (valid) {
                        const res = await _vm.$http.post('/sys/RoleController/saveRoleInfo', params);
                        if(res.data&&res.data.success){
                            _vm.dialogInfo = false;
                            _vm.$message.success('操作成功');
                            _vm.getSysRoleList();
                            _vm.getRoleName();
                        }else{
                            _vm.$message.warning(res.data.msg);
                        }
                        
                    } else {
                        console.log('提交错误');
                        return false;
                    }
                });
            },
            /**
             * 表单重置
             * @params {Object} formName 表单名称
             */
            resetForm(formName){
                this.departList = [];
                this.$refs[formName].resetFields();
                if(formName=='formInline'){
                    this.openScreen()
                    this.getSysRoleList();
                }
            },
            /**
             * 编辑按钮点击事件
             * @params {Number} index  行号
             * @params {Object} row 行对象
             */
            async handleEdit(index, row) {
                this.dialogInfo = true;
                this.formTitle = "编辑角色信息";
                this.editRole = true;//角色编码不可编辑
                let data = Object.assign({}, row);
                data.useable = row.useable.toString();
                data.is_sys = row.is_sys.toString();
                this.ruleForm = data;
                if(row.data_scope===5){
                    const orgStr = {auth_org_ids:row.auth_org_ids};
                    const res = await this.$http.get('/sys/RoleController/getOrgByRole',{params:orgStr});
                    if(res.data&&res.data.success){
                        this.departList = res.data.result;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }
            },
            /**
             * 删除按钮点击事件
             * @params {Number} index   行号
             * @params {Object} row     行对象
             */
            handleDelete(index, row) {
                this.deleteSysRoleInfo({id:row.id,update_by:this.loginUser});
            },
            /**
             * 删除角色信息
             * @params {Object} row|rows     行对象
             */
            deleteSysRoleInfo(data){
                const _vm = this;
                this.$confirm('此操作将永久删除选择角色信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async function(){
                    const res = await _vm.$http.post('/sys/RoleController/delRoleInfo', data)
                    if (res.data && res.data.success) {
                        _vm.$message.success('操作成功');
                        _vm.getSysRoleList();
                        _vm.getRoleName();
                        _vm.tabSize = [24,24,24,24];
                        _vm.isUserList = false;
                        _vm.isMenuList = false;

                    }else{
                        _vm.$message.warning(res.data.msg);
                    }
                    
                }).catch(function(err){
                    console.log(err);
                });
            },
            /**
             * 切换每页条数
             * @params {Number} val 每页条数
             */
            handleSizeChange(val) {
                this.tabPage.pageSize = val;
                this.getSysRoleList();
            },
            /**
             * 切换页码
             * @params {Number} val 页码
             */
            handleCurrentChange(val) {
                this.tabPage.currentPage = val;
                this.getSysRoleList();
            },
            handleUsersTab(index,row){
                this.tabSize = [24,24,24,12];
                this.isUserList = true;
                this.isMenuList = false;
                this.userRoleid = row.id;
                this.userLoading = true;
            },
            loadingStatus(d){
                if(this.isMenuList){
                    this.rightLoading = d;
                }else{
                    this.userLoading = d;
                }

            },
            hideRight(d){
                this.tabSize=[24,24,24,d];
            }
        }
    }
</script>

<style scoped>
.class-a{
    width:100%;
}
.class-b{
    width:350px;
}
.el-select{
    width:100%;
}
.roleTagClass {
  min-height: 28px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 5px;
  line-height: 28px;
  overflow: auto;
  min-width: 180px;
  box-sizing: border-box;
}

.roleTagClass .el-tag {
  padding: 0 5px;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
}
.roleTagClass .el-tag--depart {
  background-color: #20a0ff;
  border-color: rgba(18, 206, 102, .2);
  color: #fbfdff;
}
</style>
