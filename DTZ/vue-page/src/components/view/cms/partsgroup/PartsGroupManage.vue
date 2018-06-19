<template>
    <div> 
        <el-row>
            <el-col :span="6">
                <el-form>
                    <el-form-item>
                        <el-button type="success" icon="el-icon-plus" @click="handleAdd" :disabled="addShow===false">新增</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="treeNodeDel">删除</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filterText" placeholder="检索部件分类" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div  class="ws-tree" v-bind:style="{height:screenHeight-110+'px'}">
                    <el-tree
                        :data="treeData"
                        node-key="id"
                        ref="tree2"
                        :default-expand-all="defaultExpandedKeys"
                        :props="defaultProps"
                        :highlight-current="highlightCurrent"
						:filter-node-method="filterNode"
                        @node-click="treeNodeClick">
                        <span slot-scope="{node,data}" style="flex: 1;  display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                            <span>
                                <img :src ="data.group_pic_path" style="width:20px;height:20px;vertical-align:middle;"/>
                                <span style="vertical-align:middle;">{{data.group_name}}</span>
                            </span>
                            <span>
                                <el-button
                                v-show="data.show"
                                style="font-size: 12px;"
                                type="text"
                                @click="cancleClick('test', data, 'test')"
                                >
                                取消选中
                                </el-button>
                            </span>
                        </span>
                    </el-tree>
                </div>
            </el-col>

            <el-col :span="18" style="padding-left:10px;">
				 <el-form inline ref="searchForm" :model="searchForm">
					<el-form-item label="部件分类名称" prop="group_name">
						<el-input v-model="searchForm.group_name"></el-input>
					</el-form-item>
					<el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                        <el-button  type="info" @click="resetForm('searchForm')" icon="el-icon-refresh">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    :data="TableData"
                    border
                    :height="screenHeight-110"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="group_name"
                        label="部件分类名称">
                    </el-table-column>
                    <el-table-column
                        prop="group_level"
                        label="分类层级"
                        :formatter="levelFormat">
                    </el-table-column>
                    <el-table-column
                        prop="group_code"
                        label="部件分类代码">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="备注">
                    </el-table-column>
                    <el-table-column label="操作" width="150">
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
                <paging @emitsizechange="handleSizeChange"
                        @emitcurrentchange="handleCurrentChange"
                        :currentPage="tabPage.currentPage"
                        :pageSizes="tabPage.pageSizes"
                        :pageSize="tabPage.pageSize"
                        :total="tabPage.totalNum">
                </paging>
            </el-col>
        </el-row>
		<!-- 部件分类编辑 -->
        <el-dialog title="部件分类" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" width="35%">
            <el-form :model="ruleForm" :rules="this.$validateRule" ref="ruleForm" label-width="110px" class="event_group_from">
                <el-form-item label="部件分类名称" prop="group_name">
                    <el-input v-model="ruleForm.group_name"></el-input>
                </el-form-item>
				<el-form-item label="部件分类层级" prop="group_level">
					<el-select disabled v-model="ruleForm.group_level" placeholder="请选择" >
                        <el-option v-for="(item ,index) in groupLevel" :label="item.value" :value="item.key" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类代码" prop="group_code">
                    <el-input :disabled="itemshow===false" v-model="ruleForm.group_code"></el-input>
				</el-form-item>
				<el-form-item label="父级分类" prop="parent_id" v-if="ruleForm.group_level===2">
					<el-select :disabled="itemshow===false" v-model="ruleForm.parent_id" placeholder="请选择" >
                        <el-option v-for="(item ,index) in parentGroup" :label="item.value" :value="item.key" :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="ruleForm.remark" type="textarea"></el-input>
                </el-form-item>
				<el-form-item label="图标" prop="eg_pic_path">
                    <div @click='chooseImg' style="width:110px;height:110px;" title="点击选择图片">
                        <img v-if="image.src" :src="image.src" class="avatar">
                        <img v-else
                            class="avatar img_src">
                        <input id="upload_img" type="file" name="file" @change="onFileChange" class="input_file"
                            accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"/>
                    </div>
                    <div @click="removeImg" class="removebtn" v-if="image.src">
                        <el-button  type="danger" icon="el-icon-delete"></el-button>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogInfo=false">取 消</el-button>
                <el-button type="primary" @click="savePGInfo('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
import paging from "common/BasePaging.vue";
import {transData} from 'assets/js/commonManage.js';
export default {
  data() {
    return {
		clickItem: {}, //树节点选中项
		defaultExpandedKeys: true,
		loading: false,
		TableData: [],
		tabPage: {
			currentPage: 1,
			pageSize: 10,
			pageSizes: [10, 20, 30, 50]
		}, //分页信息
		treeData: [],
		defaultProps: {
			children: "children",
			label: "group_name"
		},
		screenHeight: document.body.clientHeight - 125,
		filterText: "",
		dialogInfo:false,
		ruleForm:{},//新增表单
		searchForm:{},//查询表单
		addShow:true,
		parentGroup:[],//父级分类
		itemshow:true,//字段是否可编辑
		groupLevel:[
			{key:1,value:'大类'},
			{key:2,value:'小类'}
		],
		dialogStatus:{//表单信息
			title:'新增部件分类',
			flag:'add'
		},
        image:{},//图片流
        highlightCurrent:true,//高亮
        cache:"",//缓存树点击
    };
  },
  created() {
    this.getPartsGroupList();
    this.getPratsGroupAll();
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    const VM = this;
    VM.screenHeight = document.body.clientHeight - 125;
    window.addEventListener("resize", function() {
      VM.screenHeight = document.body.clientHeight - 125;
    });
  },
  components: {
    paging
  },
  methods: {
    /**
     * 表单重置
     * @params {Object} formName 表单名称
     */
    resetForm(formName){
        this.$refs[formName].resetFields();
        this.getPartsGroupList();
    },
    /**
     * 分类层级格式化
     */
    levelFormat(row, colum){//时间格式化
        if (row[colum.property] != null) {
            const d = row[colum.property];
            for(var i in this.groupLevel){
                if(this.groupLevel[i].key===d){
                    return this.groupLevel[i].value;
                }
            }
        }
    },

	/**
	 * 新增按钮点击事件
	 */
	handleAdd(){
        $('#upload_img').val('');
		this.image = {};//清空图片
		this.ruleForm = {
			group_name:'',
			group_level:'',
            eg_pic_path:'',
            group_code:'',
			remark:''
		};
		this.dialogInfo = true;
		this.dialogStatus.title = '新增部件分类';
		this.dialogStatus.flag = 'add';
		if(this.clickItem&&this.clickItem.id){
			this.parentGroup = [{
				key:this.clickItem.id,
				value:this.clickItem.group_name
			}];
			this.ruleForm.parent_id = this.clickItem.id;
			this.ruleForm.group_level = 2;
            this.itemshow = false;
            if(this.clickItem.children){
                const number = this.clickItem.children.length;
                if(number>9){
                    this.ruleForm.group_code = this.clickItem.group_code+(number+1);	
                }else{
                    this.ruleForm.group_code = this.clickItem.group_code+'0'+(number+1);
                }
            }else{
                this.ruleForm.group_code = this.clickItem.group_code+'01';
            }
		}else{
			this.ruleForm.group_level = 1;
			this.itemshow = true;
		}
	},
    /**
     * 编辑按钮点击事件
     * @params {Number} index  行号
     * @params {Object} row 行对象
     */
    handleEdit(index, row) {
        $('#upload_img').val('');
        this.image = {};
		this.ruleForm = Object.assign({},row);
		this.itemshow = false;
		this.dialogInfo = true;
	  	this.dialogStatus.title = '编辑部件分类';
        this.dialogStatus.flag = 'edit';
        if(this.ruleForm.group_pic_path){
            this.ruleForm.eg_pic_path = 'img';
            this.image.src = 'http://'+this.$webconfig.serverIp+'/'+this.ruleForm.group_pic_path;
        }
    },
    /**
     * 删除按钮点击事件
     * @params {Number} index   行号
     * @params {Object} row     行对象
     */
    handleDelete(index, row) {
      let data = {
        id: row.id
      };
      this.delPGInfo(data);
    },
    /**
     * 删除部件分类信息
     * @params {Object} row|rows     行对象
     */
    delPGInfo(data) {
      const _vm = this;
      this.$confirm("此操作将永久删除此部件分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
            const res = await _vm.$http.post(
              "/cms/PartsGroupController/delPGInfo",
              data
            );
            if (res.data && res.data.success) {
                this.clickItem = {};
                _vm.getPartsGroupList();
                _vm.getPratsGroupAll();
                _vm.$message.success("操作成功");
            } else {
                _vm.$message.error(res.data.msg);
            }
          
        })
        .catch(() => {});
    },
    /**
     * 切换每页条数
     * @params {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
      this.getPartsGroupList();
	},
	
    /**
     * 切换页码
     * @params {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
      this.getPartsGroupList();
	},
	
	/**
	 * 分页条件获取部件分类列表
	 */
    async getPartsGroupList() {
        let data = {
            page: this.tabPage.currentPage,
            pageSize: this.tabPage.pageSize
        };
        if(this.searchForm.group_name!=''){
            data.group_name = this.searchForm.group_name;
        }
        if(this.clickItem&&this.clickItem.id){
            data.id = this.clickItem.id;
        }
        this.loading = true;
        const res = await this.$http.get(
          "/cms/PartsGroupController/partsGroupList",
          { params: data }
        );
        if (res.data && res.data.success) {
          this.TableData = res.data.result.rows;
          this.tabPage.totalNum = res.data.result.count;
        } else {
          this.$message.waring(res.data.data);
        }
        this.loading = false;
      
	},
	/**
	 * 获取全部部件分类列表组装树结构
	 */
    async getPratsGroupAll() {
        this.treeData = [];
        const res = await this.$http.get("/cms/PartsGroupController/queryPartsGroupList");
        if (res.data && res.data.success) {
            const data = res.data.result.map((item)=>{
                item.show = false;
                return item;
            })
            this.treeData = transData(data,'id','parent_id','children') ;
        } else {
            this.$message.error(res.data.msg);
        }

    },
    /**
     * 菜单树节点点击事件
     *@param {Object} element  传递给 data 属性的数组中该节点所对应的对象
     *@param {Objcet} node   节点对应的 Node
     *@param {Objcet} vm    节点组件本身
     */
    treeNodeClick(el, node, vm) {
        this.clickItem = Object.assign({},el);
        this.highlightCurrent = true;
		if(this.clickItem.children||this.clickItem.group_level===1){
			this.addShow = true;
		}else{
			this.addShow = false;
        }

        if (this.cache.id) {
            this.cache.show = false;
        }
        this.cache = node.data;
        node.data.show = true;
        this.getPartsGroupList();
	},
	/**
	 *树信息过滤
	 *@param {String} value 当前输入值
	 *@param {Objcet} data 树数据原形
	*/
    filterNode(value, data) {
      if (!value) return true;
      return data.group_name.indexOf(value) !== -1;
    },
    /**
     * 选中树节点点击删除按钮
     */
    treeNodeDel(){
        if(this.clickItem&&this.clickItem.id){
            if(this.clickItem.children){
                this.$message.warning('当前部件分类包含小类，请先删除小类');
            }else{
                this.delPGInfo({id:this.clickItem.id});
            }
        }else{
            this.$message.warning('请先选中部件分类节点');
        }
        
    },
	/**
	 * 查询按钮点击事件
	 */
	onSearch(){
		this.getPartsGroupList();
	},
	/**
	 * 保存部件分类信息
	 */
	savePGInfo(formName){
		const _vm = this;
        const params = Object.assign({},this.ruleForm);
		let formData = new FormData();
        let file = document.getElementById("upload_img").files[0];
        formData.append('image', file); //file就是图片或者文件
		$.each(params, function (i, val) {
			if (val !== null&&val !== undefined&&val !=='') {
				formData.append(i, val);
			}
		});
		this.$refs[formName].validate(async valid => {
			if (valid) {
                const res = await _vm.$http.post(
                "/cms/PartsGroupController/savePGInfo",
                formData
                );
                if (res.data && res.data.success) {
                    this.clickItem = {};
                    _vm.dialogInfo = false;
                    _vm.$message.success("操作成功");
                    _vm.getPartsGroupList();
                    _vm.getPratsGroupAll();
                } else {
                    _vm.$message.error(res.data.msg);
                }
				
			} else {
			return false;
			}
      });
	},
	chooseImg(){
		$('input[type=file]').trigger('click');
		return false
	},
	/**
	 * 图片选择change事件
	 *
	 */
	onFileChange(e){
		let files = e.target.files || e.dataTransfer.files;
		if(files[0]){
			const isImg = files[0].type.substr(0, 5);
			const isLt2M = files[0].size / 1024 / 1024 < 2;
			if (isImg !== 'image') {
				this.$message.error('只能上传图片！')
			}
			if (!isLt2M) {
				this.$message.error('上传图片大小不能超过2M！')
			}
			if (isImg === 'image' && isLt2M) {
				if (!files.length) return;
				this.createImage(files)
			}
			return isImg === 'image' && isLt2M
		}

	},
	//读取图片操作
	createImage(files){
		this.ruleForm.eg_pic_path = 'img';
		let VM = this
		for (let file of files) {
			let reader = new FileReader();
			reader.onload = function (e) {
				VM.image = {src: e.target.result}
			};
			reader.readAsDataURL(file);
		}
	},
	removeImg(){
		$('#upload_img').val('');
		this.image = {};
		if(this.ruleForm.group_pic_path){
            this.image.src = 'http://'+this.$webconfig.serverIp+'/'+this.ruleForm.group_pic_path;
		}else{
			this.ruleForm.eg_pic_path = '';
		}
    },
    cancleClick(node, data, store) {
        this.highlightCurrent = false;
        this.addShow = true;
        this.clickItem = {};
        this.getPartsGroupList();
        data.show = false;
        event.cancelBubble = true; //阻止事件冒泡
    },
  }
};
</script>

<style>
.ws-tree {
  overflow: auto;
}
.ws-tree .el-tree {
  height: 100%;
  overflow-y: auto;
}

.ws-tree .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #e6a23c;
}


.event_group_from .el-select{
	width:100%;
}
.input_file {
    display: none;
}
.avatar {
    width: 109px;
    height: 109px;
    display: block;
    cursor: pointer;
}

.img_src {
    background-image: url('../../../../assets/images/img.png');
    background-size: 109px 109px;
}
.removebtn{
    margin-left:95px;
    margin-top:-10px;
}
</style>
