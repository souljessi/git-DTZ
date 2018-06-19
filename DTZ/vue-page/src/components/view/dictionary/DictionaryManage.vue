<template>
    <div>
         <el-row :gutter="3" v-loading="loading">
            <el-col :xs="tabSize[0]" :sm="tabSize[1]" :md="tabSize[2]" :lg="tabSize[3]" v-loading="leftLoading">
                <!--查询-->
                <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="formInline">
                    <el-form-item label="字典名称" prop="typegroupname">
                        <el-input v-model="formInline.typegroupname" placeholder="字典名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSearch('formInline')">查询</el-button>
                        <el-button type="info" icon="el-icon-refresh" @click="resetForm('formInline')">重置</el-button>
                        <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                      <el-button type="warning" icon="el-icon-loading" @click="syncStore">同步数据</el-button>
                    </el-form-item>
                </el-form>

                <!--左侧table-->
                <el-table :data="leftTableData" border style="width: 100%" tooltip-effect="dark" :height="screenHeight-110">
                    <el-table-column prop="typegroupname" label="名称">
                    </el-table-column>
                    <el-table-column prop="typegroupcode" label="编码">
                    </el-table-column>
                    <el-table-column label="操作" width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button @click="toViewType(scope.$index, scope.row)">查看类型
                            </el-button>
                          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                          </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--  分页  -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tabPage.currentPage" :page-sizes="tabPage.pageSizes" :page-size="tabPage.pageSize" layout='sizes,prev, pager, next, jumper, ->, total,slot' :total="tabPage.totalNum">
                </el-pagination>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" v-show="tabSize[3]===12" v-loading="rightLoading">
                <RightTable ref="rightChild"></RightTable>
            </el-col>
        </el-row>

        <!--左侧form-->
        <el-dialog title="字典录入" :visible.sync="dialogInfo" width="30%">
            <el-form :model="ruleForm" :rules="this.$validateRule" ref="ruleForm" label-width="100px">

                <el-form-item label="字典编码" prop="typegroupcode">
                    <el-input v-model="ruleForm.typegroupcode"></el-input>
                </el-form-item>
                <el-form-item label="字典名称" prop="typegroupname">
                    <el-input v-model="ruleForm.typegroupname"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInfo=false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import RightTable from './DictionaryRightTable.vue'
import paging from 'common/BasePaging.vue'
export default {
    data() {
        return {
            leftTableData: [], //左侧table
            tabPage: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50]
            },//分页信息
            tabSize:[24,24,24,24],
            formData: [],    //表单数据
            dialogInfo: false, //模态框是否显示标识
            ruleForm: {//新增表单数据
            },
            formInline: {//查询输入框的对象
                typegroupname: ''
            },
            loading:false,
            leftLoading:false,
            rightLoading:false,
            screenHeight: document.body.clientHeight-125,
        }
    },
    created: function () {},
    mounted:function(){
        this.getListData();
        this.openScreen('loading');
        const VM = this;
        VM.screenHeight = document.body.clientHeight-125;
      window.addEventListener("resize", function () {
            VM.screenHeight = document.body.clientHeight-125;
        });
    },
    components: {RightTable, paging},
    computed: {},
    methods: {
        /**
         * 加载动画
         */
        openScreen(key) {//加载...
            this[key] = true;
            setTimeout(() => {
                this[key] = false;
            }, 500);
        },
        /**
         * 获取字典列表
         * params
         * --page Number页码
         * --pageSize Number单页条数
         * --typegroupname  String 字典名称
         */
        async getListData(params) {
            this.openScreen('leftLoading');
            var data = {
                page: this.tabPage.currentPage,
                pageSize: this.tabPage.pageSize,
                typegroupname: this.formInline.typegroupname
            };
            if (params) {
                data = params;
            }
            try{
                const res = await this.$http.get('/sys/DictionaryController/finddictionarylist',{params: data });
                if(res.data&&res.data.success){
                    const result = res.data.result;
                    this.leftTableData = result.rows;
                    this.tabPage.totalNum = result.count;
                }else{
                    this.$message.warning(res.data.msg);
                }
            }catch(err){
                this.$message.error('获取字典列表失败');
            }
        },
        /**
         * 新增按钮点击事件
         */
        handleAdd() {
            this.dialogInfo = true;
            this.ruleForm = Object.assign({}, {});
        },
        /**
         * 编辑按钮点击事件
         */
        handleEdit(index, row) {
            this.dialogInfo = true;
            this.tabSize = [24,24,24,24];
            this.ruleForm = Object.assign({}, row);
        },
        /**
         * 查询按钮点击事件
         */
        onSearch(formName) {
            var params = this.formInline;
            params.page = 1;
            params.pageSize = this.tabPage.pageSize;
            this.tabPage.currentPage = 1;//每次查询默认第一页
            var _self = this;
            _self.$refs[formName].validate((valid) => {
                if (valid) {
                    _self.getListData(params);
                } else {
                    console.log('提交错误');
                }
            });
        },
        /**
         * 保存字典信息
         * formName --表单ref 验证表单
         */
        submitForm(formName) {
            var _self = this;
            var data = _self.ruleForm;
            this.$refs[formName].validate(async (valid)=> {
                if (valid) {
                   try{
                        const res = await _self.$http.post('/sys/DictionaryController/addorupdatedictionary', data);
                        if(res.data&&res.data.success){
                            _self.dialogInfo = false;
                            _self.$message.success('操作成功');
                            _self.getListData();
                        }else{
                            _self.$message.warning(res.data.msg);
                        }
                    }catch(err){
                        _self.$message.error('保存字典信息失败')
                    }
                } else {
                    console.log('提交错误');
                    return false;
                }
            });
        },
        /**
         * 删除按钮点击事件
         * @params {Number} index   行号
         * @params {Object} row     行对象
         */
        async handleDelete(index, row) {
            this.tabSize = [24,24,24,24];
            const data = { id: row.id };
            this.$confirm('此操作将永久删除选择字典信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                try{
                    const res = await this.$http.post('/sys/DictionaryController/deletedic',data);
                    if(res.data&&res.data.success){
                        this.$message.success('删除成功');
                        this.getListData();
                        var rightChild = this.$refs.rightChild;
                        // rightChild.getListData();
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                }catch(err){
                    this.$message.error('删除字典信息失败');
                }
            })

        },
        /**
         * 表单重置
         * formName --表单ref String
         */
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getListData();
        },
        /**
         * 查看类型按钮点击事件
         */
        toViewType(index, row) {
            this.changeStyle();//移动动画
            var rightChild = this.$refs.rightChild;//获取子组件实例
            rightChild.groupId = row.id;
            rightChild.getListData();//调用子组件的方法
            this.openScreen('rightLoading');
        },
        /**
         * 切换每页条数
         * @params {Number} val 每页条数
         */
        handleSizeChange(val) {
            this.tabPage.pageSize = val;
            this.getListData();
        },
        /**
         * 切换页码
         * @params {Number} val 页码
         */
        handleCurrentChange(val) {
            this.tabPage.currentPage = val;
            this.getListData();
        },
        /**
         * 显示类型列表
         */
        changeStyle() {
            this.tabSize = [24,24,12,12];
        },
        /**
         * 同步字典数据到localStroge
         */
        async syncStore() {
            try{
              const res = await this.$http.get('/sys/DictionaryController/initdictionary');
                if(res.data&&res.data.success){
                    this.$message.success('同步成功');
                    this.$setStore('gDictionaryList', res.data.result);
                }else{
                  this.$message.warning(res.data.msg);
                }
            }catch(err){
              this.$message.error('同步失败');
            }
        }
    }
}
</script>

<style scoped>


</style>

