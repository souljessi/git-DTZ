<template>
    <div>
        <el-tree 
            :style="style" 
            :key="key" 
            :show-checkbox='multiple' 
            :check-strictly="strictly"
            :default-expand-all='expand' 
            :highlight-current='!multiple' 
            ref="depTree" 
            node-key="id" 
            :data="treeData" 
            :props="defaultProps" 
            @current-change="currentChange" 
            @check-change="checkChange">
            <span slot-scope="{node,data}">
                <base-icon :style="{color:$webconfig.TreeIconColor}" icon='bumen'/>
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
    },
    watch:{
        setSelect:function(){
            this.$refs.depTree.setCheckedKeys(this.setSelect);
        }
    },
    methods: {
        /**
         * Tree多选操作
         * @param {Object} data Tree选中数据
         * @param {Bolean} isCheck 当前节点选中状态
         * @param {Bolean} childerCheck  选中节点下子节点的选中状态
         */
        checkChange(data, isCheck, childerCheck) {
            if (this.multiple) {
                //    const deepData= Object.assign({}, this.$refs.depTree.getCheckedNodes());
                const deepData = this.$refs.depTree.getCheckedNodes();
                this.$emit('selectdNode', deepData);
            }
        },
        /**
         * Tree单选事件
         * @param {Object} data Tree选中数据
         * @param {Object} nodes Tree选中数据Nodes对象
         */
        currentChange(data, nodes) {
            if (!this.multiple) {
                this.$refs.depTree.setCheckedKeys([]);
                this.$refs.depTree.setCheckedKeys([data.id]);
                let deepData = Object.assign([], [data]);
                this.$emit('selectdNode', deepData);

            }

        },
        /**
         * Teee重置选中
         */
        resetChecked() {
            this.$refs.depTree.setCheckedKeys([]);
        },
        /**
         *查询组织结构信息(树)
        */
        async getOrgListToTree() {
            try {
                const _self = this;
                const callBackData = await _self.$http.get('/sys/DepartController/getDepartName');
                if (callBackData.data.success) {   //查询成功
                    const result = callBackData.data.result;
                    if (result.length > 0) {
                        _self.treeData = _self.transData(result, 'id', 'parent_id', 'children');
                    }
                } else {
                    _self.$message({
                        message: callBackData.data.msg,
                        type: 'warning'
                    });
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
        },
    }
}
</script>
<style scoped>

</style>
