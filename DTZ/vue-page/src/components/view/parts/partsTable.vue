<template>
  	<div>
		<span>区域：</span>
		<el-cascader
			@change="selectChange"
			v-model="cansader"
			placeholder="试试搜索：东门"
			:props="cascaderProps"
			:options="options"
			clearable
			filterable
			change-on-select>
			</el-cascader>
		<el-button size="mini" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
		<el-button size="mini" type="info" icon="el-icon-refresh" @click="restCansader">重置</el-button>
		<el-button type="success" icon="el-icon-plus" @click="addPart">新增</el-button>
		<el-table :height="screenHeight-110" v-loading="loading" :data="partsData" highlight-current-row border style="margin-top:10px;">
			<el-table-column label="所属区域" prop="cms_area.area_name"></el-table-column>
			<el-table-column label="部件分类" prop="cms_parts_group.group_name"></el-table-column>
			<el-table-column label="主管部门" prop="DeptName1"></el-table-column>
			<el-table-column label="地址" prop="address_name"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
				<el-button type="text" @click='viewPart(scope.row)'>
					<base-icon style="font-size:16px;margin-right:5px;" icon="map" />查看</el-button>
					<el-button type="text" @click='delPartClick(scope.row)'>
					<i class="el-icon-delete"></i>
					删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<paging @emitsizechange="handleSizeChange" @emitcurrentchange="handleCurrentChange" :currentPage="tabPage.currentPage" :pageSizes="tabPage.pageSizes"
		:pageSize="tabPage.pageSize" :total="tabPage.totalNum">
		</paging>
		<el-dialog  title="部件信息弹窗" :visible.sync="dialogInfo" :modal-append-to-body="false" :close-on-click-modal="false" width="75%">
			<edit-part :rowData="rowData"   @closeDig="closeEditDig"></edit-part>
        </el-dialog>

	</div>
</template>


<script>
import { transData } from "assets/js/commonManage.js";

import paging from "common/BasePaging.vue";
import BaseTextOverflow from 'common/BaseTextOverflow.vue';
import EditPart from './editPart.vue';

export default {
  data() {
    return {
		rowData:{},//选中行数据
		dialogInfo:false,
		cansader: [],
		searchArea: "",
		partsData: [],
		areaData: [],
		loading: false,
		tabPage: {
			currentPage: 1,
			pageSize: 15,
			pageSizes: [15, 30, 50]
		}, //分页信息
		screenHeight: document.body.clientHeight - 100,
		cascaderProps: {
			value: "value",
			label: "area_name",
			children: "children"
		},
		options: []
    };
  },
  components: {
    paging,BaseTextOverflow,EditPart
  },
  mounted() {
    const VM = this;
    VM.screenHeight = document.body.clientHeight - 100;
    window.addEventListener("resize", function() {
      VM.screenHeight = document.body.clientHeight - 100;
    });
    this.getAreaData();
	this.getPartsData();
  },
  methods: {
	openScreen(key) {//加载...
		this[key]= true;
		setTimeout(() => {
			this[key] = false;
		}, 400);
	},
	closeEditDig(){
		this.dialogInfo = false;
	},
    delPartClick(data) {
      this.$confirm("此操作将永久删除该部件信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delPart(data);
        })
        .catch(() => {});
    },

    async delPart(data) {
      console.log(data);
      let param = {
        id:data.id,
        pic_path:data.pic_path
      };
      console.log();
      let Res = await this.$http.post("/basesource/PartsController/delPart", param);
      console.log('115',Res);
      if (Res.data.success) {
        this.$message.success("删除成功");
        this.restCansader();
      } else {
        this.$message.warning(Res.data.msg);
      }
    },
    viewPart(data) {
		console.log(data);
		this.rowData = data;
		// this.dialogInfo = true;
      this.$router.push({
        path: "/addPart",
        query: {
          areaId: data.cms_area.id,
          BGID:data.BGID,
          data: data
          // cellName: text
        }
      });
    },
    formatter(row, column) {
      let text = "未知";
      this.areaData.map(item => {
        if (item.id === row.area_id) {
          text = item.area_name;
        }
      });
      return text;
    },
    restCansader() {
      this.cansader = [];
      this.searchArea = -1;
      this.getPartsData();
    },
    onSearch() {
        this.getPartsData();
    },
    /**
     * 获取区域信息
     */
    async getAreaData() {
		const res = await this.$http.get(
		"/basesource/PartsController/getAreaData"
		);
		if (res.data&&res.data.success) {
			this.areaData = res.data.result;
			let data = this.areaData.map(item => {
				item.value = {
				id: item.id,
				parent_ids:item.parent_ids,
				area_code: item.area_code,
				area_name: item.area_name,
				scope_path: item.scope_path
				};
				return item;
			});
			this.options = transData(data, "id", "parent_id", "children");
		}
	},
    selectChange(data) {
		if (data.length > 0) {
			let info = data[data.length - 1];
			this.searchArea = {parent_ids:info.parent_ids,area_id:info.id};
		}
    },
    async getPartsData() {
		let data = {
			page: this.tabPage.currentPage,
			pageSize: this.tabPage.pageSize
		};
		if (this.searchArea !== -1) {
			data = Object.assign(data,this.searchArea);
		}
		this.openScreen('loading');
		const res = await this.$http.get(
			"/basesource/PartsController/getPartsList",
			{
			params: data
			}
		);
		if (res.data && res.data.success) {
			this.partsData = res.data.result.rows;
			this.tabPage.totalNum = res.data.result.count;
		} else {
			this.$message.waring(res.data.msg);
		}
    },
    /**
     * 切换每页条数
     * @params {Number} val 每页条数
     */
    handleSizeChange(val) {
      this.tabPage.pageSize = val;
      this.getPartsData();
    },
    /**
     * 切换页码
     * @params {Number} val 页码
     */
    handleCurrentChange(val) {
      this.tabPage.currentPage = val;
      this.getPartsData();
    },
    addPart() {
      this.$router.push("/addPart");
    }
  }
};
</script>


<style lang="scss" scoped>

</style>
