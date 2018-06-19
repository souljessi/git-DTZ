<template>
    <div v-loading="isloading">
       <!--查询-->
        <span class="rightTitle">角色权限配置</span>
        <el-form :inline="true"  class="demo-form-inline el-form-small" ref="formInline">
            <el-form-item label="角色">
                <el-select v-model="role" placeholder="请选择" @change="changeRole" >
                    <el-option
                        v-for="(item,index) in roles"
                        :label="item.rolename"
                        :value="item.id"
                    :key="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="handleSave"  :disabled="show===false">保存</el-button>
                <el-button @click="resetChecked"  :disabled="show===false">清空</el-button>
                <el-button  type="primary" icon="el-icon-d-arrow-right" @click="handleHide()">收起</el-button>
            </el-form-item>
        </el-form>
        <el-tree 
            v-bind:style="{height:heightSet-110+'px'}" 
            :data="dataTree" 
            show-checkbox=""  
            default-expand-all="" 
            node-key="id" 
            ref="tree" 
            highlight-current 
            :props="defaultProps" 
            class="treePos">
            	<span slot-scope="{node,data}">
                    <div>
                        <base-icon :style="{color:$webconfig.TreeIconColor}" :icon='data.menu_icon'/>
                        <span> {{node.label}}</span>
                    </div>
                </span>
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
                    label: 'menu_name'
                },
                //dataTree:[],
                role:'',
                show:true,
                roleNames:[],
                adminRoleId:''//系统角色id
            }
        },
        props: ['dataTree','defaultKey','roleid','roles','isloading','heightSet'],

        created: function () {
            this.getAdminRole();
        },
        mounted: function () {
          
        },
        components: {

        },

        computed: {
        },
        watch:{
            defaultKey: function(){
                const checkedData = this.setChecked();
                this.$refs.tree.setCheckedKeys(checkedData);
            },
            roleid:function(){
                this.role = this.roleid;
                if(this.role===this.adminRoleId){
                    this.show = false;
                }else{
                    this.show = true;
                }
            },
            isloading:function(){
                if(this.isloading){
                    setTimeout(() => {
                        this.$emit('changeList',false);
                    }, 500);
                }
              
            }
        },
        methods: {
            treeToPath(tree, path) {//获取含有子节点的id数组
                var path = path || [];
                for(let i = 0; i < tree.length; i++) {
                    if(tree[i].children){
                        path.push(tree[i].id)
                        this.treeToPath(tree[i].children,path);
                    }
                }
                return path;
            },
            setChecked(){//设置树节点选中项
                let arr = [];
                var checkedArr = (data,id)=>{
                    for(var item of data) {
                        if(item.id == id) {
                            if(!item.children) {
                            arr.push(item.id);
                            }
                        } else {
                            if(item.children) {
                                checkedArr(item.children, id);
                            }
                        }
                    }
                }
                for(var i=0;i<this.defaultKey.length;i++){
                   checkedArr(this.dataTree,this.defaultKey[i].id);
                }
                return arr;
            },
            fiterArray(arr){
                let filterArr = arr.filter(function(element,index,self){
                    return self.indexOf(element) === index&&element!=0;
                });
                return filterArr;
            },
            async handleSave(){
                const newData = this.$refs.tree.getCheckedNodes();
                const oldArr = this.defaultKey.map((item)=>{
                    return Number(item.id);
                });//原始绑定角色数组
                // console.log('old',oldArr,'new',newData);
                // const newArr = this.$refs.tree.getCheckedKeys();
                let newArr = [];
                for(var n=0;n<newData.length;n++){
                    let arr = newData[n].parent_ids.split(',');
                    let dataIntArr=[];//保存转换后的整型字符串  
  
                    arr.forEach(function(data,index,arr){ //字符串转数字
                        if(data!=""){
                            dataIntArr.push(+data);  
                        } 
                    });  

                    arr = dataIntArr.concat([newData[n].id]);
                    newArr = newArr.concat(arr);
                }
                newArr = this.fiterArray(newArr);
                let addList = [];
                let delList = [];
                if(oldArr.length===0){
                    delList = [];
                    addList = newArr;
                }else{
                    const ar = oldArr.filter(function(n) {
                        return newArr.indexOf(n) != -1
                    });
                    addList = newArr.filter(function(n) {
                        return ar.indexOf(n) === -1
                    });
                    delList = oldArr.filter(function(n) {
                        return ar.indexOf(n) === -1
                    });
                };
                // console.log('del',delList,'add',addList);
                const params = {roleid:this.roleid,delList:delList,addList:addList};
                const res = await this.$http.post('/sys/RoleController/saveRoleMenu',params)
                if(res.data&&res.data.success){
                    this.changeRole();//重新获取角色权限
                    this.$message.success('操作成功');
                }else{
                    this.$message.error('角色权限绑定失败');
                }
                
            },
            changeRole(){
                this.$emit('changeRole',this.role);
            },
            resetChecked() {
                this.$refs.tree.setCheckedKeys([]);
            },
            getAdminRole(){
                this.adminRoleId = '000000';//先写成默认的
            },
            handleHide(){
                this.$emit('hideRight',24);
            },
        }
    }
</script>

<style scoped>
    .treePos{
        margin:0 5px 10px 5px;
        overflow-y: auto;
        border:1px solid #ebeef5;
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
</style>
