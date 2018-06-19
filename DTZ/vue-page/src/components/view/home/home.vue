<template>
	<div class="homepage">
		<div style="margin-top:5px;" >
			<el-row :gutter="0">
				<el-col :xs="24" :sm="12" :md="8" :lg="6" class="col-span">
					<div class="col-div">
						<div class="div-title" :style="themeBg">
							<div class="title-icon"><base-icon icon="tongzhi"/></div>
							<div class="title-text">通知公告</div>
							<div class="title-liebiao"><a class="total-a" title="点击查看全部" @click="goMyRoute('myOffice')"><base-icon icon="liebiao"/></a></div>
						</div>
						<div class="div-list">
							<div v-if="notifyList.length>0"> 							
								<el-table
									:data="notifyList"
									row-key="id"
									class="tab-detail"
									style="width: 100%;"
									:header-cell-class-name="getCellClass"
									:row-class-name="rowClass">
									<el-table-column
									label="时间"
									prop="create_date"
									:formatter="dateFormatFun">
									</el-table-column>
									<el-table-column
									label="通知内容"
									prop="content"
									show-overflow-tooltip>
									</el-table-column>
									<el-table-column width=60>
										<template slot-scope="scope">
											<el-popover
											ref="popover4"
											width='300'
											placement="right"
											trigger="click">
												<div class="detail-text detail-text-border"><span>通知标题:</span><span>{{scope.row.title}}</span></div>
												<div class="detail-text detail-text-border" show-overflow-tooltip><span>通知内容:</span><span>{{scope.row.content}}</span></div>
												<div class="detail-text detail-text-border"><span>通知时间:</span><span v-text="timeFormat(scope.row.create_date)"></span></div>
												<div class="detail-text detail-text-border"><span>发送人:</span><span>{{scope.row.realname}}</span></div>
												<div class="detail-text"><span>备注:</span><span>{{scope.row.remark||'无'}}</span></div>
											</el-popover>
											<a v-popover:popover4 class="btn-action">详情</a>
										</template>
									</el-table-column>
								</el-table>
							</div>
							<div v-if="notifyList.length===0" class="div-nolist">
								<base-icon icon="zanwu"/>
							</div>
						</div>
					</div>

				</el-col>
				
				<el-col :xs="24" :sm="12" :md="8" :lg="9" class="col-span">
					<div class="col-div">
						<div class="div-title" :style="themeBg">
							<div class="title-icon"><base-icon icon="jinxingzhong" /></div>
							<div class="title-text">进行中案卷</div>
							<!-- <div class="title-liebiao"><a class="total-a" title="点击查看全部" @click="goMyRoute('approve')"><base-icon icon="liebiao"/></a></div> -->
						</div>
						<div class="div-list">
							<div v-if="caseList.length>0">
								<el-table
									:data="caseList"
									class="tab-detail"
									row-key="id"
									highlight-current-row
									:key="detailTabKey"
									:expand-row-keys="expands"
									:header-cell-class-name="getCellClass"
									@row-click="rowClick"
									@expand-change="expandChange"
									style="width: 100%;">
									<el-table-column type="expand">
									<template slot-scope="props">
										<el-table
											:data="props.row.proList"
											style="width:99%"
											:row-class-name="tableRowClassName">
											<el-table-column
											label="流程名称"
											prop="name"
											show-overflow-tooltip>
											</el-table-column>
											<el-table-column
											label="处理人"
											prop="realname">
											</el-table-column>
											<el-table-column
											label="开始时间"
											prop="start_time"
											:formatter="dateFormatFun2"
											width="130">
											</el-table-column>
											<el-table-column
											label="处理时长"
											prop="duration"
											:formatter="returnTaskDuring">
											</el-table-column>
											<el-table-column
											label="说明"
											prop="description">
											</el-table-column>
											<el-table-column
											label="状态"
											prop="task_status"
											width="60"
											fixed="right">
												<template slot-scope="scope">
													<span v-bind:style="{'color':scope.row.task_status==1?'green':'red'}">
														{{returnTaskStatus(scope.row.task_status)}}
													</span>
												</template>
											</el-table-column>
										</el-table>
									</template>
									</el-table-column>
									<el-table-column
									label="案卷编号"
									prop="case_code"
									show-overflow-tooltip>
									</el-table-column>
									<el-table-column
									label="案卷类型"
									prop="case_type"
									width="80"
									:formatter="returnCaseType">
									</el-table-column>
									<el-table-column
									label="发生地点"
									prop="ObjPosition"
									show-overflow-tooltip>
									</el-table-column>
									<el-table-column
									label="案卷描述"
									prop="remarks"
									show-overflow-tooltip>
									</el-table-column>
									<el-table-column
									label="立案人"
									prop="realname"
									width="100">
									</el-table-column>
								</el-table>
							</div>
							<div v-if="caseList.length===0" class="div-nolist">
								<base-icon icon="zanwu"/>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="12" :md="8" :lg="9" class="col-span">
					<div class="col-div">
						<div class="div-title" :style="themeBg">
							<div class="title-icon"><base-icon icon="jinxingzhong" /></div>
							<div class="title-text">进行中审批</div>
							<!-- <div class="title-liebiao"><a class="total-a" title="点击查看全部" @click="goMyRoute('approve')"><base-icon icon="liebiao"/></a></div> -->
						</div>
						<div class="div-list">
							<div v-if="custFormList.length>0">
								<el-table
									:data="custFormList"
									class="tab-detail"
									row-key="id"
									highlight-current-row
									:key="detailTabKey2"
									:expand-row-keys="expandRow"
									:header-cell-class-name="getCellClass"
									@row-click="rowCFClick"
									@expand-change="expandRowChange"
									style="width: 100%;">
									<el-table-column type="expand">
									<template slot-scope="props">
										<el-table
											:data="props.row.proList"
											style="width:99%"
											:row-class-name="tableRowClassName">
											<el-table-column
											label="流程名称"
											prop="name"
											show-overflow-tooltip>
											</el-table-column>
											<el-table-column
											label="处理人"
											prop="realname">
											</el-table-column>
											<el-table-column
											label="开始时间"
											prop="start_time"
											:formatter="dateFormatFun2"
											width="130">
											</el-table-column>
											<el-table-column
											label="处理时长"
											prop="duration"
											:formatter="returnTaskDuring"
											show-overflow-tooltip>
											</el-table-column>
											<el-table-column
											label="说明"
											prop="description">
											</el-table-column>
											<el-table-column
											label="状态"
											prop="task_status"
											width="60"
											fixed="right">
												<template slot-scope="scope">
													<span v-bind:style="{'color':scope.row.task_status==1?'green':'red'}">
														{{returnTaskStatus(scope.row.task_status)}}
													</span>
												</template>
											</el-table-column>
										</el-table>
									</template>
									</el-table-column>
									<el-table-column
									label="审批名称"
									prop="review_name"
									show-overflow-tooltip>
									</el-table-column>
									<el-table-column
									label="发起时间"
									prop="start_time">
									</el-table-column>
									<el-table-column
									label="发起人"
									prop="realname">
									</el-table-column>
								</el-table>
							</div>
							<div v-if="custFormList.length===0" class="div-nolist">
								<base-icon icon="zanwu" />
							</div>
						</div>
					</div>
				</el-col>

				<el-col :xs="24" :sm="12" :md="12" :lg="6" class="col-span">
					<div class="col-div">
						<div class="div-title" :style="themeBg">
							<div class="title-icon"><base-icon icon="daibantwo" /></div>
							<div class="title-text">我的待办</div>
							<div class="title-liebiao"><a class="total-a" title="点击查看全部" @click="goMyRoute('myTask')"><base-icon icon="liebiao"/></a></div>
						</div>
						<div class="div-list">
							<div v-if="taskList.length>0">
								<el-table
									:data="taskList"
									class="tab-detail"
									row-key="id"
									style="width: 100%;"
									:header-cell-class-name="getCellClass"
									:row-class-name="rowClass">
									<el-table-column
									label="时间"
									prop="start_time">
									</el-table-column>
									<el-table-column
									label="待办工作"
									prop="name"
									show-overflow-tooltip>
									</el-table-column>
									<!-- <el-table-column width=60>
										<template slot-scope="scope">
											<a @click="dealTask(scope.$index, scope.row)" class="btn-action">处理</a>
										</template>
									</el-table-column> -->
								</el-table>
							</div>
							<div v-if="taskList.length===0" class="div-nolist">
								<base-icon icon="zanwu" />
							</div>
						</div>
					</div>
				</el-col>

				<el-col :xs="24" :sm="12" :md="12" :lg="6" class="col-span">
					<div class="col-div">

						<div class="div-title" :style="themeBg">
							<div class="title-icon"><base-icon icon="bar" /></div>
							<div class="title-text">事件分类统计</div>
						</div>
						<div class="div-echarts">
							<chart :key="echartsKey" :options="chartTypeOptions" auto-resize></chart>
						</div>
					</div>
					
				</el-col>

				<el-col :xs="24" :sm="12" :md="12" :lg="6" class="col-span">
					<div class="col-div">
						<div class="div-title" :style="themeBg">
							<div class="title-icon"><base-icon icon="pie" /></div>
							<div class="title-text">问题部件统计</div>
						</div>
						<div class="div-echarts">
							<chart :key="echartsKey" :options="partPieOptions" auto-resize></chart>
						</div>
						
					</div>
				</el-col>
				
				<el-col :xs="24" :sm="12" :md="12" :lg="6" class="col-span">
					<div class="col-div">
						<div class="div-title" :style="themeBg">
							<div class="title-icon"><base-icon icon="bar" /></div>
							<div class="title-text">区域案卷统计</div>
						</div>
						<div class="div-echarts">
							<chart :key="echartsKey" :options="caseRingOptions2" auto-resize></chart>
						</div>
					</div>
				</el-col>
				
			</el-row>
			
		</div>
	</div>

</template>

<script>
    import {dateFormat} from 'assets/js/date.js'
	import {graphic} from "echarts/lib/export"
	// import MyTask from "view/bpmn/myTask"
	import {
	formatSeconds,
	toThousands
	} from "assets/js/commonManage.js";
    export default {
        data(){
            return {
				detailTabKey:Date.now(),
				detailTabKey2:Date.now(),
				expands:[],
				expandRow:[],
				notifyList:[],
				taskList:[],
				caseList:[],
				custFormList:[],
				echartsKey:new Date().getTime(),
				chartTypeOptions: {
					legend:{
						show:true,
						orient: 'vertical',
						left:30,
						top:30,
						data:['事件分类统计']
					},
					color:['#d48265'],
					tooltip: {
						trigger: "axis",
						axisPointer: {
						// 坐标轴指示器，坐标轴触发有效
						type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter: "{a} <br/>{b} : {c}件"
					},
					
					toolbox: {
						show: true,
						feature: {
							saveAsImage: {
								show: true
							}
						}                    
					},
					grid: {
						top: "20%",
						left: "5%",
						right: "5%",
						bottom: "3%",
						containLabel: true
					},
					xAxis: [{
						type: "category",
						data: ["市容环境", "宣传广告", "施工管理", "街面秩序", "突发事件", "其他事件", "部件问题"],
						axisTick: {
						show: false
						},
						axisLine: {
						show: false
						},
						axisLabel:{
							rotate: 60,
							textStyle: {
                                color: '#000'
                            }
						}
					}],
					yAxis: [{
						type: "value",
						axisLine: {
						show: false
						},
						axisTick: {
						show: false
						},
						axisLabel: {
						textStyle: {
							color: "#999"
						}
						}
					}],
					series: [
						{
							name: "事件分类",
							type: "bar",
							label: {
								normal: {
									show: true,
									position: 'top',
									color:'#000'
								}
							},
							data:  [16, 7, 7, 4, 5, 1, 6]
						}
					]
				},
				partPieOptions: {
					legend:{
						show:true,
						bottom: 10,
						left: 'center',
						data:["移除", "丢失", "废弃", "损坏"],
						icon:'circle'
					},
					color:['#91c7ae','#749f83',  '#ca8622', '#bda29a'],
					tooltip: {
						trigger: "item",
						position: ["50%", "10%"],
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					toolbox:{
						show: true,
						feature: {
							saveAsImage: {
								show: true
							}
						}
					},
					series: [
						{
							name: "问题部件统计",
							type: "pie",
							radius: "50%",
							center: ["50%", "50%"],
							labelLine: {
								normal: {
									smooth: 0.2,
									length: 15,
									length2: 10
								}
							},
							label: {
								normal: {
									formatter: '{b}:{c}',
									position:'inner'
								}
							},
							data: [{name:"移除",value:2},{name:"丢失",value:5},{name:"废弃",value:5},{name:"损坏",value:3}],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: "rgba(0, 0, 0, 0.5)"
								}
							}
						}
					]
				},			
				
				caseRingOptions2: {
					title : {
						subtext: '最近30天案卷统计情况',
						x: 'center'
					},
					legend:{
						show:true,
						orient: 'vertical',
						left:30,
						top:30,
						data:['区域案卷统计']
					},
					color:['#ff7400'],
					tooltip: {
						trigger: "axis",
						axisPointer: {
						// 坐标轴指示器，坐标轴触发有效
						type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter: "{a} <br/>{b} : {c}件"
					},
					
					toolbox: {
						show: true,
						feature: {
							saveAsImage: {
								show: true
							}
						}                    
					},
					grid: {
						top: "20%",
						left: "5%",
						right: "5%",
						bottom: "3%",
						containLabel: true
					},
					xAxis: [{
						type: "category",
						data: ["中枢街道", "同乐街道"],
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisLabel:{
							rotate: 60,
							textStyle: {
                                color: '#000'
                            }
						}
					}],
					yAxis: [{
						type: "value",
						axisLine: {
						show: false
						},
						axisTick: {
						show: false
						},
						axisLabel: {
						textStyle: {
							color: "#999"
						}
						}
					}],
					series: [
						{
							name: "案卷数",
							type: "bar",
							label: {
								normal: {
									show: true,
									position: 'top',
									color:'#000'
								}
							},
							data:  [16, 7]
						}
					]
				},


            }
        },
        created: function () {},
        mounted: function () {
			this.getNotifyList();
			this.getTaskList();
			this.getQuePartsCount();
			this.getEventGroupCount();
			this.getCaseStateCount();
			this.getUnfinishedList();
			this.getCustFormTask();
		},
        components: {},
        computed: {
			themeBg() {
				let color = {backgroundColor:"#ffc614"};
				let value = JSON.parse(JSON.stringify(this.$store.getters.getTheme));
				if (value !=="#0e0e10") {
					color.backgroundColor = value;
					color.color = '#fff';
				}
				return color;
			},
			menuList() {
				return this.$store.getters.getVerMenuMap;
			},
			isCollapse() {
				return this.$store.getters.getisCollapse;
			},
		},
		watch: {
			menuList(val) {
				this.echartsKey = Date.now();
			},
			isCollapse(val){
				setTimeout((item)=>{//由于侧边栏折叠带有动画效果
					this.echartsKey = Date.now();
				},400)
			}
		},
        methods: {
			rowClick(row, event, column) {//行点击只能展开一行
				this.expendChangeCom(row);
			},
			async expendChangeCom(row){
				Array.prototype.remove = function (val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                if (this.expands.indexOf(row.id) < 0) {
					this.expands = [];
					this.expands.push(row.id);
					if(!row.proList){//获取详细信息
						row.proList = await this.getWorkDetail(row.proc_inst_id);
						this.detailTabKey = Date.now();
					}
                } else {
                    this.expands.remove(row.id);
                }
			},
			async getNotifyList(){//我的通知列表
				const res = await this.$http.get('/home/HomeController/getNotifyList');
				if(res.data&&res.data.success){
					this.notifyList = res.data.result;
				}else{
					this.$message.error(res.data.msg);
				}
			},
			async getTaskList(){//我的待办列表
				const res = await this.$http.get('/home/HomeController/getTaskList');
				if(res.data&&res.data.success){
					if(res.data.result.length>0){
						this.taskList = res.data.result;
					}
				}else{
					this.$message.error(res.data.msg);
				}
			},
			async getQuePartsCount(){//问题部件统计

				const res = await this.$http.post('/home/HomeController/getQuePartsCount');
				if(res.data&&res.data.success){
					const data = res.data.result
					this.partPieOptions.series[0].data = data.map((item1)=>{
						return {name:item1.ObjState,value:item1.count};
					})
					this.partPieOptions.legend.data = data.map((item2)=>{
						return item2.ObjState;
					})

				}
			},
			async getEventGroupCount(){//事件分类统计
				const res = await this.$http.post('/home/HomeController/getEventGroupCount');
				if(res.data&&res.data.success){
					const data = res.data.result
					this.chartTypeOptions.series[0].data = data.map((item1)=>{
						return item1.count
					})
					this.chartTypeOptions.xAxis[0].data = data.map((item1)=>{
						return item1.group_name
					})	
				}
			},
			async getCaseStateCount(){//近30天案卷统计
				const res = await this.$http.post('/home/HomeController/getCaseStateCount');
				if(res.data&&res.data.success){
					const data = res.data.result;
					if(res.data.result.length>0){
						const data = res.data.result;
						this.caseRingOptions2.series[0].data = data.map((item1)=>{
							return item1.totalCount
						})
						this.caseRingOptions2.xAxis[0].data = data.map((item1)=>{
							return item1.area_name
						})
						
					}	
				}
			},
			// async getCaseStateCount(){//近30天案卷统计
			// 	const res = await this.$http.post('/home/HomeController/getCaseStateCount');
			// 	if(res.data&&res.data.success){
			// 		const data = res.data.result;
			// 		if(res.data.result.length>0){
			// 			const data = res.data.result[0];
			// 			this.caseRingOptions.series[0].data[0].value = data.totalCount;
			// 			this.caseRingOptions.series[1].data = [
			// 				{name:'超期结案数', value:data.overCloseCount},
			// 				{name:'按期结案数', value:data.onCloseCount},
			// 				{name:'未结案数', value:data.openCount},
			// 				{name:'驳回案卷数', value:data.rejectCount}
			// 			]
			// 		}	
			// 	}
			// },
			async getUnfinishedList(){//进行中案卷列表
				const userData = JSON.parse(this.$getStore('userData'));
				const data = {
					userId: userData.id,
					orgId: userData.org_id,
					roleAuth:userData.roleList
				};
				const res = await this.$http.post('/home/HomeController/getUnfinishedList',data);
				if(res.data&&res.data.success){
					if(res.data.result.length>0){
						this.caseList = res.data.result;
					}
				}else{
					this.$message.error(res.data.msg);
				}
			},
			async getWorkDetail(proc_inst_id){
				const data = {
					proc_inst_id:proc_inst_id
				};
				const res = await this.$http.get('/home/HomeController/getWorkDetail',{params:data});
				if(res.data&&res.data.success){
					return res.data.result;
				}else{
					return [];
					this.$message.error(res.data.msg);
				}
			},
			async getCustFormTask(){//进行中审批列表
				const userData = JSON.parse(this.$getStore('userData'));
				const data = {
					userId: userData.id,
					orgId: userData.org_id,
					roleAuth:userData.roleList
				};
				const res = await this.$http.post('/home/HomeController/getCustFormTask',data);
				if(res.data&&res.data.success){
					if(res.data.result.length>0){
						this.custFormList = res.data.result;
					}
				}else{
					this.$message.error(res.data.msg);
				}
			},

			goMyRoute(route){//路由跳转我的通知页面
				this.$router.push(route);
			},
			dateFormatFun(row, colum){//时间格式化
				return dateFormat(new Date(row.create_date), 'yyyy-MM-dd');
			},
			dateFormatFun2(row, colum){//时间格式化
                if (row[colum.property] != null) {
                    const d = row[colum.property];
                    return dateFormat(new Date(d),"yyyy-MM-dd hh:mm");
                }
			},
			returnTaskStatus(status){//流程状态1结束|0未结束
                return status===0?'未结束':'结束';
			},
			returnTaskDuring(row,colum){//流程处理时长由秒转为--分--秒
				if (row[colum.property] != null) {
                    const d = row[colum.property];
                    return  formatSeconds(d);
                }
			},
			returnCaseType(row,colum){//返回案卷类型中文描述
				if (row[colum.property] != null) {
                    const d = row[colum.property];
                    return d===1?'事件':'部件';
                }
			},
			timeFormat(time){
				return dateFormat(new Date(time), 'yyyy-MM-dd hh:ss');
			},
			async expandChange(row,expandedRows){
				expandedRows = [];
				this.expendChangeCom(row);
			},
			rowCFClick(row, event, column) {//行点击只能展开一行
				this.expendChangeCF(row);
			},
			async expandRowChange(row,expandedRows){
				expandedRows = [];
				this.expendChangeCF(row);
			},
			async expendChangeCF(row){
				Array.prototype.remove = function (val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                if (this.expandRow.indexOf(row.id) < 0) {
					this.expandRow = [];
					this.expandRow.push(row.id);
					if(!row.proList){//获取详细信息
						row.proList = await this.getWorkDetail(row.proc_inst_id);
						this.detailTabKey2 = Date.now();
					}
                } else {
                    this.expandRow.remove(row.id);
                }
			},
			getCellClass({ row, column, columnIndex }) {//设置表头class
				return 'tab-header-ownstyle'
			},
			rowClass({row, rowIndex}){//设置table row class
				return 'tab-row-ownstyle'
			},
			// dealTask(index,row){//任务办理窗口
			// 	this.$refs.myTask.handleTaskView(row);
			// },
			tableRowClassName({row, rowIndex}) {
				//return 'warning-row';
			}
				
        }
    }

</script>


<style lang="scss">
	.homepage{
		.col-span{
			height: calc((100vh - 64px)/2);
			.col-div{
				height:100%;
				margin:3px;
				box-sizing: border-box;
				.div-title{
					height:30px;
					line-height:30px;
					font-size: 14px;
					padding-left:10px;
					background:#ffc614;
					opacity: 0.85;
					.title-icon{
						font-size:20px;
						float: left;
					}
					.title-text{
						font-size:14px;
						float: left;
						margin-left:2px;
					}
					.title-liebiao{
						float:right;
						cursor: pointer;
						width:40px;
						font-size:20px;
						text-align: center;
					}
					.title-liebiao:hover{
						background-color: #000;
						color:#ffc614;
					}
				}
				.div-list{
					font-size:14px;
					line-height:24px;
					border-style: solid;
  					border-color:#ccc;
					border-width:1px;
					border-top:1px;
					box-sizing: border-box;
					box-shadow: 2px 2px 3px rgba(204,204,204,0.7);
					.div-nolist{
						text-align:center;
						font-size:200px;
						height: calc((100vh - 140px)/2);
						line-height: calc((100vh - 140px)/2);
					}
					.tab-header-ownstyle{
						font-weight: bold;
						font-size:14px;
						color:#000;
					}
					.tab-row-ownstyle:hover{
						.btn-action{
							color:#409EFF;
							text-decoration:underline;
							cursor: pointer;
						}
					}
					.btn-action{
						width:50px;
					}
					.tab-detail{
						padding:0 5px;
						height: calc((100vh - 140px)/2);
						overflow-y: auto;
						.el-table .warning-row {
							background: oldlace;
						}
						.expanded{
							background-color:#ecf5ff!important;
						}
						.cell {
							line-height: 20px!important;
						}
						.el-table__fixed-right::before, .el-table__fixed::before {
							background-color: rgba(98, 114, 150, 0)!important;
						}
					}
					.el-table::before{
						background-color:transparent!important;
					}
					.el-table{
						color:#000!important;
						th.is-leaf {
							border-bottom: 1px solid #a3a7b1!important;
						}
						.el-table{
							color:#606266!important;
							th.is-leaf {
								border-bottom: 1px solid #ebeef5!important;
							}
							td{
								border-bottom:none!important; 
							}
						}
					}
						
				}

				.div-echarts{
					background:#fff;
					border-style: solid;
					border-color:#ccc;
					border-width:1px;
					border-top:1px;
					box-sizing: border-box;
					box-shadow: 2px 2px 3px rgba(204,204,204,0.7);
					.echarts{
						height: calc((100vh - 140px)/2);
						width:calc(100% - 20px);
						text-align: center;
					} 
				}
				
			}
		}
		

	}

	.detail-text{
		font-size:12px;
		line-height: 26px;
		padding-bottom:5px;
		:first-child {
			font-size:14px;
			margin-right:5px;
			width:60px;
			text-align: left;
			display: inline-block;
			color:rgba(255,198,20,0.8);
		}
		:last-child{
			
			color:rgba(255,255,255,0.8);
		}

	}
	.detail-text-border{
		border-bottom: 1px solid rgba(204,204,204,0.3);
	}
	
	.el-popover__title {
		padding-bottom: 12px;
		border-bottom: 1px solid #ddd;
	}
	.el-popover {
		background:#2c2c2e!important;
		border: 1px solid #2c2c2e!important;
	}	
	.el-popper[x-placement^=right] .popper__arrow {
		border-right-color: #2c2c2e!important;
	}	
	.el-popper[x-placement^=right] .popper__arrow::after {
		border-right-color: #2c2c2e!important;
	}
</style>
