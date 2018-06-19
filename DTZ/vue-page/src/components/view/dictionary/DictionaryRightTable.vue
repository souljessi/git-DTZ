<template>
    <div v-loading="loading">
        <div class="addBtn" style="text-align:right;">
            <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <!--table-->
        <el-table :data="tableData"
            highlight-current-row
            border
            style="width: 100%"
            :height="screenHeight-110">
            <el-table-column
                prop="typename"
                label="类型名称">
            </el-table-column>
            <el-table-column
                prop="typecode"
                label="类型编码">
            </el-table-column>
          <el-table-column
            prop="other_attr"
            label="自定义属性">
          </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--form-->
        <el-dialog title="类型录入" :visible.sync="dialogInfo" width="30%">
            <el-form :model="ruleForm" :rules="this.$validateRule" ref="ruleForm" label-width="100px">
                <el-form-item label="类型编码" prop="typecode">
                    <el-input v-model="ruleForm.typecode"></el-input>
                </el-form-item>
                <el-form-item label="类型名称" prop="typename">
                    <el-input v-model="ruleForm.typename"></el-input>
                </el-form-item>
              <el-form-item label="自定义属性" prop="other_attr">
                <el-input v-model="ruleForm.other_attr"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInfo=false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                tableData: [],
                dialogInfo: false, //模态框是否显示标识
                ruleForm: {//新增表单数据
                },
                groupId: '',
                loading:false,
                screenHeight: document.body.clientHeight-125,
            }
        },
        mounted:function(){
            const VM = this;
            VM.screenHeight = document.body.clientHeight-125;
            window.addEventListener("resize", function(){ 
                VM.screenHeight = document.body.clientHeight-125;
            });
        },
        components: {},
        computed: {},
        methods: {
            /**
             * 根据当前字典获取所有字典类型列表
             */
            async getListData(){
                const data =  {groupId: this.groupId};
                try{
                    const res = await this.$http.get('/sys/DictionaryController/finddictypelist',{params:data});
                    if(res.data&&res.data.success){
                        this.tableData = res.data.result;
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                }catch(err){
                    this.$message.error('获取字典类型数据失败');
                }
            },
            /**
             * 新增按钮点击事件
             */
            handleAdd(){
                this.dialogInfo = true;
                this.ruleForm = Object.assign({}, {});
            },
            /**
             * 编辑按钮点击事件
             */
            handleEdit(index, row){
                this.dialogInfo = true;
                this.ruleForm = Object.assign({}, row);
            },
            /**
             * 删除字典类型
             * 
             */
            async handleDelete(index, row) {
                const data = {id:row.id};
                this.$confirm('此操作将永久删除选择字典类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    try{
                        const res = await this.$http.post('/sys/DictionaryController/deletedictype',data);
                        if(res.data&&res.data.success){
                            this.$message.success('删除成功');
                            this.getListData();
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    }catch(err){
                        this.$message.error('删除错误');
                    }
                })
            },
            /**
             * 保存字典类型信息
             * formName --表单名称 String
             */
            submitForm(formName){
                var _self = this;
                var data = _self.ruleForm;
                var groupId = _self.groupId;
                data.typegroupid = groupId;
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                         try{
                            const res = await this.$http.post('/sys/DictionaryController/addorupdatedictype',data);
                            if(res.data&&res.data.success){
                                this.$message.success('操作成功');
                                this.dialogInfo = false;
                                this.getListData();
                            }else{
                                this.$message.warning(res.data.msg);
                            }
                        }catch(err){
                            this.$message.error('保存字典类型信息失败');
                        }
                    } else {
                        console.log('提交错误');
                        return false;
                    }
                });
            },
            /**
             * 表单重置
             * formName --表单名称ref String
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
<style scoped>
    .addBtn {
        margin-bottom: 20px;
    }

</style>
