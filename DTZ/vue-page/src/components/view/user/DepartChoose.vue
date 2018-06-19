<template>
    <div class="tree-choose">
        <el-tree 
            :style="style" 
            :key="key" 
            show-checkbox
            :check-strictly="strictly"
            :default-expand-all='expand' 
            ref="depTree" 
            node-key="id" 
            :data="treeData" 
            :props="defaultProps" 
            @check-change="handleClick">
            <span slot-scope="{node,data}">
                <base-icon :style="{color: $webconfig.TreeIconColor}" icon='bumen'/>
                <span> {{node.label}}</span>
            </span>
        </el-tree>
    </div>
</template>

<script>
export default {
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'org_name',
                disabled: 'disabled'
            },
            style: {
                minHeight: this.minHeight + 'px'
            },
            treeData: [],
            key:Date.now()

        }
    },
    mounted() {
        this.getOrgListToTree();
        this.$refs.depTree.setCheckedKeys(this.setSelect);
    },
    props: {
        multiple: {
            type: Boolean,
            default: true    //默认复选 check  单选 radio
        },
        setSelect: {
            type: Array,
            default: () => []         //初始化选中值 默认为id集合
        },
        expand: {
            type: Boolean,
            default: true    //Tree 默认展开
        },
        minHeight: {
            type: Number,
            default: 300            //默认Tree高度 300
        },
        strictly: {
            type: Boolean,
            default: true    //父子集是否联动
        },
        index: {
            type: Number,
            default: 0            //默认Tree高度 300
        },
    },
    watch:{
        setSelect:function(){
            this.$refs.depTree.setCheckedKeys(this.setSelect);
        }
    },
    methods: {
        handleClick(data,checked, node) {
            if(this.index%2==1){//值未更新
                if(checked){
                    this.$refs.depTree.setCheckedNodes([]);
                    this.$refs.depTree.setCheckedNodes([data]);
                    //交叉点击节点
                }else{
                     this.$refs.depTree.setCheckedNodes([]);
                    //点击已经选中的节点，置空
                }
            }
            const deepData = this.$refs.depTree.getCheckedNodes();
            this.$emit('selectdNode', deepData);
            this.$emit('addIndex',this.index+1);
        },

        /**
         *查询组织结构信息(树)
        */
        async getOrgListToTree() {
            try {
                const callBackData = await this.$http.get('/sys/DepartController/getDepartName');
                if (callBackData.data.success) {   //查询成功
                    const result = callBackData.data.result;
                    if (result.length > 0) {
                        this.treeData = this.transData(result, 'id', 'parent_id', 'children');
                    }
                } else {
                    this.$message.warning(callBackData.data.msg);
                }
            } catch (err) {
                console.log('choose', err)
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
            for (; i < len; i++) {
                hash[a[i][id]] = a[i];
            }
            for (; j < len; j++) {
                var aVal = a[j], hashVP = hash[aVal[pid]];
                if (hashVP) {
                    !hashVP[children] && (hashVP[children] = []);
                    hashVP[children].push(aVal);
                } else {
                    r.push(aVal);
                }
            }
            return r;
        }

    }
}
</script>
<style>

</style>
