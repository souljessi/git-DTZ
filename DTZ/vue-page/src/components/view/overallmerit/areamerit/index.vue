<template>
    <div v-loading="loading">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="区域评价" name="first">
                <area-cell></area-cell>
            </el-tab-pane>
            <el-tab-pane label="单元网格质量管理" name="second">
               <b-g-i-d></b-g-i-d>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>


<script>
import BGID from './BGID.vue';
import AreaCell from './Area.vue';
export default {
    components: {
        AreaCell,BGID
    },
    data() {
        return {
            loading: false, //遮罩
            activeName:'second',

        };
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        handleClick(){

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
    

    }
};
</script>

<style lang="scss">

</style>
