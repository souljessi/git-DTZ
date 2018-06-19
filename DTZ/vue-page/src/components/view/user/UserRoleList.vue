<template>
    <div>


        <!--查询-->
        <span class="rightTitle">用户角色配置</span>
        <el-form :inline="true"  class="demo-form-inline el-form-small" ref="formInline">
            <el-form-item label="用户">
                <el-select v-model="user" placeholder="请选择" @change="changeUser">
                    <el-option
                        v-for="(item,index) in users"
                        :label="item.realname"
                        :value="item.id"
                    :key="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="handleSave" :disabled="show===false">保存</el-button>
                <el-button @click="resetChecked" :disabled="show===false">清空</el-button>
                <el-button type="primary" icon="el-icon-d-arrow-right" @click="handleHide()">收起</el-button>
            </el-form-item>
            
        </el-form>
        <el-tree 
            v-bind:style="{height:heightSet-120+'px'}"
            :data="dataTree" 
            show-checkbox=""  
            default-expand-all="" 
            node-key="id" 
            ref="tree" 
            highlight-current 
            :props="defaultProps"
            class="treePos">
        </el-tree>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                defaultProps: {
                    children: 'children',
                    label: 'rolename'
                },
                //dataTree:[],
                loading: true,
                user:'',
                show:true,
                adminName:'',//系统用户名admin
            }
        },
        props: ['dataTree','defaultKey','userid','users','heightSet'],

        created: function () {
            this.getAdminUser();
        },
        mounted: function () {},
        components: {},
        computed: {},
        watch:{
            defaultKey:function(){
                this.$refs.tree.setCheckedNodes(this.defaultKey);
            },
            userid:function(){
                this.user = this.userid;
                if(this.user===this.adminId){
                    this.show = false;
                }else{
                    this.show = true;
                }
            }
        },
        methods: {
            async handleSave(){
                const oldArr = this.defaultKey.map((item)=>{
                    return item.id;
                });//原始绑定角色数组
               
                const newArr = this.$refs.tree.getCheckedKeys();
                let addList = [];
                let delList = [];
                if(oldArr.length===0){
                    delList = [];
                    addList = newArr;
                }else{
                    const ar =oldArr.filter(function(n) {
                        return newArr.indexOf(n) != -1
                    });
                    addList =newArr.filter(function(n) {
                        return ar.indexOf(n) === -1
                    });
                    delList =oldArr.filter(function(n) {
                        return ar.indexOf(n) === -1
                    });
                }
                const params = {userid:this.userid,delList:delList,addList:addList};
                const res = await this.$http.post('/sys/UserController/saveRoleUser',params);
                if(res.data&&res.data.success){
                    this.$message.success('操作成功');
                    this.$emit('updateRight',this.userid);
                }else{
                    this.$message.error('用户角色绑定失败');
                }
                
            },

            changeUser(d){
                this.$emit('changeUser',this.user);
            },
            resetChecked() {
                this.$refs.tree.setCheckedKeys([]);
            },
            getAdminUser(){
                this.adminName = 'admin';//先写成默认的
            },
            handleHide(){
                this.$emit('hideRight',24);
            },
        }
    }
</script>

<style scoped>
    .treePos{
        overflow-y: auto;
        border:1px solid #ebeef5;
        /* margin-top:-6px; */
        box-sizing: border-box;
    }
    .el-form-small .el-form-item{
        margin-right:1px;
    }
    .rightTitle{
        position: absolute;
        top:-24px;
        font-size:13px;
    }
    .el-select {
        width: 155px;
    }

    .btn_group_inline{
        margin-bottom: 10px;
    }
</style>
