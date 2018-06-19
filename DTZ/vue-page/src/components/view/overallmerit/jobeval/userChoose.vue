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
				<div v-if="data.type==='org'">
					<base-icon :style="{color:$webconfig.TreeIconColor}" icon='bumen'/>
					<span> {{node.label}}</span>
				</div>
				<div v-if="data.type==='user'">
					<span class="userCycle" :style="{background:$webconfig.TreeIconColor}">{{data.realname.substring(0, 1)}}</span>
					<span>{{node.label}}</span>
				</div>
            </span>
        </el-tree>
    </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
        disabled: "disabled"
      },
      style: {
        minHeight: this.minHeight + "px"
      },
      treeData: [],
      key: Date.now()
    };
  },
  mounted() {
	this.getOrgListToTree();
    this.$refs.depTree.setCheckedKeys(this.setSelect);
  },
  props: {
    multiple: {
      type: Boolean,
      default: true //默认复选 check  单选 radio
    },
    setSelect: {
      type: Array,
      default: () => [] //初始化选中值 默认为id集合
    },
    expand: {
      type: Boolean,
      default: true //Tree 默认展开
    },
    minHeight: {
      type: Number,
      default: 300 //默认Tree高度 300
    },
    strictly: {
      type: Boolean,
      default: true //父子集是否联动
    },
    userRole: {
      type: String,
      default: "cjy" //信息采集员
    }
  },
  watch: {
    setSelect: function() {
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
        const deepData = this.$refs.depTree.getCheckedNodes();
        this.$emit("selectdNode", deepData);
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
        this.$emit("selectdNode", deepData);
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
      const data = {
        userRole: this.userRole
      };
      const res = await this.$http.get(
        "/overallmerit/JobController/getDepartAndUser",
        { params: data }
      );
      if (res.data.success) {
        //查询成功
        const result = res.data.result;
        const userList = result.userList.map(item => {
          const data = {
            type: "user",
            id: item.id,
			name: item.realname,
			realname:item.realname,
            parent_id: item.org_id
          };
          return data;
        });
        const orgList = result.orgList.map(item => {
          const data = {
            type: "org",
            id: item.id,
            name: item.org_name,
            parent_id: item.parent_id
          };
          return data;
        });
        const list = orgList.concat(userList);
        if (list.length > 0) {
          const filterList = this.arrayUnique2(this.filterOrg(list),'id');

          this.treeData = this.transData(filterList, "id", "parent_id", "children");
        }
      } else {
        this.$message.warning(res.data.msg);
      }
    },
    filterOrg(list){//部门数据过滤没有用户的
      let userData = [];
      list.forEach((item)=>{
        if(item.type==='user'){
          const parentData = this.getParents(list,item,[]);
          userData = userData.concat(parentData);
        }
      })
      return userData;
    },
    getParents(list,item,arr){//获取所有父部门
      let dataArr = arr;
      for(var i in list){
        if(list[i].id===item.parent_id){
          dataArr.push(item);
          dataArr.push(list[i]);
          this.getParents(list,list[i],dataArr);
        }
      }
      return dataArr;
    },
    arrayUnique2(arr, name) {//数组根据传入key去重
      var hash = {};
      return arr.reduce(function (item, next) {
        hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
        return item;
      }, []);
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
      var r = [],
        hash = {},
        id = idStr,
        pid = pidStr,
        children = chindrenStr,
        i = 0,
        j = 0,
        len = a.length;
      for (; i < len; i++) {
        hash[a[i][id]] = a[i];
      }
      let userData = [];
      a.forEach(item => {
        if (item.type == "user") {
          userData.push(item.parent_id);//过滤所有人员数据的parentid
        }
      });
      for (; j < len; j++) {
        var aVal = a[j],
          hashVP = hash[aVal[pid]];
        if (hashVP) {               
          if (!hashVP[children]) hashVP[children] = [];     
          //进行人员数据与部门数据过滤
        //   if (userData.includes(hashVP[id])) {
        //   }
          hashVP[children].push(aVal);

        } else {
          r.push(aVal);
        }
      }
      return r;
    }
  }
};
</script>
<style scoped>
.userCycle{
	font-size: 10px;
	width: 20px;
	height: 20px;
	line-height: 20px;
	text-align: center;
	display: inline-block;
	border-radius: 10px;
	color: #fff;
	margin-right:5px;
}
</style>
