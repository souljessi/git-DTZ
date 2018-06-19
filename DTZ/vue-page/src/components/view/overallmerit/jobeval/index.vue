<template>
    <!-- 图表统计 -->
    <div>
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="信息采集员岗位评价" name="first">
				<collector></collector>
			</el-tab-pane>
			<el-tab-pane label="受理人员岗位统计" name="second">
				<center-personnel></center-personnel>
			</el-tab-pane>
		</el-tabs>
    </div>
</template>


<script>
import Collector from './Collector.vue';
import CenterPersonnel from './CenterPersonnel.vue';
export default {
	components: {Collector,CenterPersonnel},
	data() {
		return {
			tabData:[],
			activeName:'first'		
		};
	},
	watch: {},
	computed: {},
	created() {},
	mounted() {
		
	},
	methods: {}
};
</script>

<style lang="scss">

</style>
