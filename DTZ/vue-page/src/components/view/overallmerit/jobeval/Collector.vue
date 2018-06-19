<template>
    <div class="job-cjy">
		<el-form :inline="true" :model="searchForm" ref="searchForm">
			<el-form-item label="人员选择" prop="org_id">
				<div class="userTagClass" @click="chooseDeparts">
					<el-tag class="el-tag--depart" style="margin: 0 3px;" :type="item.type"  v-for="item in departList" :key="item.id">
						{{item.name}}
					</el-tag>
				</div>
			</el-form-item>
			<el-form-item label="时间选择" prop="cycle">
				 <el-select
					v-model="searchForm.cycle"
					placeholder="请选择">
						<el-option
							v-for="item in cycle"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="rangeDate" v-if='searchForm.cycle==1'>
				<el-date-picker
					v-model="searchForm.rangeDate"
					align="right"
					type="year"
					placeholder="选择年"
					:clearable="false"
					:picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item> 
			<el-form-item prop="rangeDate" v-if='searchForm.cycle==2'>
				<el-date-picker
					v-model="searchForm.rangeDate"
					type="month"
					placeholder="选择月"
					:clearable="false"
					:picker-options="pickerOptions"
					>
				</el-date-picker>
			</el-form-item>
			<el-form-item prop="rangeDate" v-if='searchForm.cycle==3'>
				<el-date-picker
					v-model="searchForm.rangeDate"
					type="week"
					placeholder="选择周"
					format="yyyy 第 WW 周"
					:clearable="false"
					:picker-options="pickerOptions"
					>
				</el-date-picker>
			</el-form-item>
			<el-form-item prop="rangeDate" v-if='searchForm.cycle==4'>
				<el-date-picker
					v-model="searchForm.rangeDate"
					type="date"
					placeholder="选择日期"
					:clearable="false"
					:picker-options="pickerOptions"
					>
				</el-date-picker>
			</el-form-item>
			<el-form-item prop="rangeDate" v-if='searchForm.cycle==5'>
				<div>
					<el-date-picker
						v-model="searchForm.rangeDate2"
						type="daterange"
						align="right"
						unlink-panels
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						default-value="2010-10-01"
						:clearable="false"
						:picker-options="pickerOptions2">
					</el-date-picker>
				</div>
			</el-form-item>
			<el-form-item>
				<el-button  type="primary" @click="getCollectEvalList">评价</el-button>
			</el-form-item> 
			<el-form-item>
				<el-button type="success" @click="exportExcel">导出excel</el-button>
				<a id='a_id'   download="download" style="display:none;">下载</a>
			</el-form-item> 
		</el-form>

		<el-table
			:data="tabData"
			v-loading="loading"
			border
			:height="screenHeight-150"
			style="width: 100%">
			<el-table-column
				prop="realname"
				label="真实姓名"
				width="100">
			</el-table-column>
			<el-table-column
				prop="phone"
				label="手机号码"
				width="100">
			</el-table-column>
			<el-table-column label="及时率">
				<el-table-column label="及时核实率">
					<el-table-column
						prop="onVerifyCount"
						label="及时核实次数">
					</el-table-column>
					<el-table-column
						prop="verifyCount"
						label="核实次数">
					</el-table-column>
					<el-table-column
						label="及时核实率">
						<template slot-scope="scope">
							<div v-if="scope.row.onVerifyRate!==null"> {{scope.row.onVerifyRate+'%'}}</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column
						label="级别">
						<template slot-scope="scope">
							<el-tag :disable-transitions='true' :color="gradeColor(scope.row.onVerifyRate)" class="el-tag-grade">
								{{gradeLevel(scope.row.onVerifyRate)}}
							</el-tag>
						</template>
					</el-table-column>
				</el-table-column>
				<el-table-column label="主动上报信息率">
					<el-table-column
						prop="userCount"
						label="上报立案次数">
					</el-table-column>
					<el-table-column
						prop="orgCount"
						label="部门立案次数">
					</el-table-column>
					<el-table-column
						label="主动上报信息率">
						<template slot-scope="scope">
							<div v-if="scope.row.activeRate!=null">{{scope.row.activeRate}}</div>
							<div v-else>--</div>
						</template>
					</el-table-column>
					<el-table-column
						label="级别">
						<template slot-scope="scope">
							<el-tag :disable-transitions='true' :color="gradeColor(scope.row.activeRate)" class="el-tag-grade">
								{{gradeLevel(scope.row.activeRate)}}
							</el-tag>
						</template>
					</el-table-column>
				</el-table-column>
			</el-table-column>
			<el-table-column label="准确率">
				<el-table-column
					prop="ownECCount"
					label="主动上报立案次数">
				</el-table-column>
				<el-table-column
					prop="ownECount"
					label="主动上报次数">
				</el-table-column>
				<el-table-column
					label="准确率评价">
					<template slot-scope="scope">
						<div v-if="scope.row.onECRate!=null">{{scope.row.onECRate}}</div>
						<div v-else>--</div>
					</template>
				</el-table-column>
				<el-table-column
					label="级别">
					<template slot-scope="scope">
						<el-tag :disable-transitions='true' :color="gradeColor(scope.row.onECRate)" class="el-tag-grade">
							{{gradeLevel(scope.row.onECRate)}}
						</el-tag>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column
				prop="rangeDate"
				label="评价时间">
			</el-table-column>
		</el-table>		
		<paging @emitsizechange="handleSizeChange"
			@emitcurrentchange="handleCurrentChange"
			:currentPage="tabPage.currentPage"
			:pageSizes="tabPage.pageSizes"
			:pageSize="tabPage.pageSize"
			:total="tabPage.totalNum">
		</paging>	
		<!--查询部门选择器-->
        <el-dialog title="人员选择" :visible.sync="dialogVisible" class="groupclass" :close-on-click-modal="false" width="35%">
            <user-choose style="height: 335px;overflow-y: auto"
                :dialog-visible="dialogVisible"
                :setSelect='setSelectList'
                @selectdNode='selectedNodes'
                title="人员选择"
                :strictly="false"
                :multiple="true"
				:userRole="userRole">
            </user-choose>
            <div style="text-align: right;margin-top: 10px;">
                <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog(0)">取 消</el-button>
                <el-button type="primary" @click="closeDialog(1)">确 定</el-button>
                </span>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import { graphic } from "echarts/lib/export";
import UserChoose from './userChoose'
import {dateFormat} from 'assets/js/date.js'
import paging from 'common/BasePaging.vue'

export default {
	components: {
		UserChoose,paging
	},
	data() {
		return {
			href:`http://${this.$webconfig.serverIp}/static/upload/GW.xlsx`,
			userRole:'cjy',
			dialogVisible: false,//组织机构树弹窗:
			departList: [],//部门选择多个
			setSelectList: [],//部门选中项多个

			cycle:[
				{label:'年统计',value:1},
				{label:'月统计',value:2},
				{label:'周统计',value:3},
				{label:'日统计',value:4},
				{label:'自定义时间统计',value:5}
			],
			searchForm:{
				cycle:1,
				rangeDate:new Date(),
                rangeDate2:[new Date()- 3600 * 1000 * 24 * 6,new Date()]
			},
			screenHeight: document.body.clientHeight-125,
			loading:false,
			tabData:[],
			collectData:[],
			tabPage: {
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50]
            },//分页信息
			pickerOptions: {//设置可选范围
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
				firstDayOfWeek:1
			},
			pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() >= Date.now();
                },
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },

		};
	},
	watch: {},
	computed: {},
	created() {},
	mounted() {
		const VM = this;
		VM.screenHeight = document.body.clientHeight-125;
		window.addEventListener("resize", function(){ 
			VM.screenHeight = document.body.clientHeight-125;
		});
		this.getAllcollector();

	},
	methods: {
		async getAllcollector(){//获取所有信息采集员
			const data = {
				userRole:this.userRole
			};
			const res = await this.$http.get('/overallmerit/JobController/getAllUserByRoleCode',{params:data});
			if(res.data&&res.data.success){
				const list = res.data.result;
				if(list.length>0){
					this.departList = list.map((item)=>{
						const data = {
							type:'user',
							id:item.id,
							name:item.realname,
							parent_id:item.org_id,
							disabled:false
						};
						return data;
					})
					this.setSelectList = list.map((item)=>{
						return item.id;
					})
					this.departTreeChangeArr = Object.assign(this.departList);
					await this.getCollectEvalList();
				}
				
			}else{
				this.$message.error(res.data.msg);
			}
		},
		async exportExcel(){
			const date1 = dateFormat(new Date(this.searchForm.rangeDate),"yyyy-MM-dd");
			const date2 = dateFormat(new Date(this.searchForm.rangeDate2[0]),"yyyy-MM-dd");
			const date3 = dateFormat(new Date(this.searchForm.rangeDate2[1]),"yyyy-MM-dd");
            const data = {
				userRole:this.userRole,
				flag:3,
                cycle:this.searchForm.cycle,
				rangeDate:date1,
				rangeDate2:[date2,date3],
				userList:this.setSelectList
            };
            if(this.setSelectList.length>0){
                const a = document.getElementById('a_id');
				const res =await this.$http.post("/overallmerit/ExportController/exportExcel",data);
                if(res.data&&res.data.success){
                    a.href = `http://${this.$webconfig.serverIp}/${res.data.result.filePath}`;
                    a.download = '信息采集员岗位评价';
                    a.click();
                }else{
                    this.$message.error('信息采集员岗位评价导出错误');
                }
            }else{
                this.$message.warning('请选择至少一个人员');
            }
        },
		async getCollectEvalList(){
			const date1 = dateFormat(new Date(this.searchForm.rangeDate),"yyyy-MM-dd");
			const date2 = dateFormat(new Date(this.searchForm.rangeDate2[0]),"yyyy-MM-dd");
			const date3 = dateFormat(new Date(this.searchForm.rangeDate2[1]),"yyyy-MM-dd");
			const data = {
				cycle:this.searchForm.cycle,
				rangeDate:date1,
				rangeDate2:[date2,date3],
				userList:this.setSelectList
			}
			const res = await this.$http.post('/overallmerit/JobController/getCollectEvalList',data);
			if(res.data&&res.data.success){
				this.collectData = res.data.result;
				this.changeTabData();
			}
		},
		/**
         * 加载动画
         */
        openScreen(key) {//加载...
            this[key] = true;
            setTimeout(() => {
                this[key] = false;
            }, 400);
        },
		/**
		 * 信息采集员选择
		 */
		chooseDeparts() {
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
			if (value === 1) {
				if(this.departTreeChangeArr.length===0){
					this.$message.warning('请至少选择一个人员');
				}else{
					this.departList = this.departTreeChangeArr.filter((item)=>{
						return item.type==='user';
					});
					this.setSelectList = this.departList.map((item)=>{
						return item.id;
					})
					this.dialogVisible = false;
				}
			}else{//取消选择
				this.dialogVisible = false;
			}
		},
		/**
		* @param {Object} data 组织树回调
		*/
		selectedNodes(data) {
			this.departTreeChangeArr = data;
		},
		
		 /**
         * 获取当前页数据
         */
        changeTabData(){
            this.openScreen('loading');
            this.tabPage.totalNum = this.collectData.length;
            const start = this.tabPage.pageSize*(this.tabPage.currentPage-1);
            const end = start +this.tabPage.pageSize;
            this.tabData = this.collectData.slice(start, end);
		},
		/**
         * 切换每页条数
         * @params {Number} val 每页条数
         */
        handleSizeChange(val) {
            this.tabPage.pageSize = val;
            this.changeTabData();
        },
        /**
         * 切换页码
         * @params {Number} val 页码
         */
        handleCurrentChange(val) {
            this.tabPage.currentPage = val;
            this.changeTabData();
		},
		 /**
		 * @description 格式化分数等级颜色
		 */
		gradeColor(value) {
			let color = 'black';
			if(value==null){
				color = '#ccc';
			}else{
				const val = parseFloat(value);
				switch (true){
					case val>=0&&val<=80:
					color ='black';
					break;
					case val>80&&val<=85:
					color ='red';
					break;
					case val>85&&val<90:
					color ='yellow';
					break;
					case val>90&&val<=95:
					color ='blue';
					break;
					case val>95&&val<=100:
					color ='green';
					break;
					default:
					color="#ccc"
					break;
				}
			}			
			return color;
		},
		gradeLevel(value){
			let level = 'A';
			if(value==null){
				level = '-';
			}else{
				const val = parseFloat(value);
				switch (true){
					case val>=0&&val<=80:
					level ='E';
					break;
					case val>80&&val<=85:
					level ='D';
					break;
					case val>85&&val<90:
					level ='C';
					break;
					case val>90&&val<=95:
					level ='B';
					break;
					case val>95&&val<=100:
					level ='A';
					break;
					default:
					level='-'
					break;
				}
			}
			return level;
		}
	}
};
</script>

<style lang="scss">
.job-cjy{
	.userTagClass {
		height: 28px;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		padding: 0 5px;
		line-height: 28px;
		overflow-y: auto;
		min-width: 180px;
		max-width:300px;
		box-sizing: border-box;
		.el-tag {
			padding: 0 5px;
			height: 18px;
			line-height: 18px;
			font-size: 12px;
		}

		.el-tag--depart {
			background-color: #20a0ff;
			border-color: rgba(18, 206, 102, .2);
			color: #fbfdff;
		}
		
	}
	.el-tag-grade{
		color:#fff!important;
	}
	
}
</style>
