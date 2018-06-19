export default class extends think.Controller {
    
        /**
         * 条件统计查询区域立案数
         * 
         * @returns 
         */
        async AreaStatisAction() {
            let aj = think.ajaxJson();            
            const data = {
                area_code:this.post('area_code'),
                startTime:this.post('startTime'),//2018-02-10
                endTime:this.post('endTime')//2018-02-13
            };
            const AreaService = this.service('api/statistics/AreaService');
            const res = await AreaService.AreaStatis(data);
            if(!res.error){
                aj.result = res;
            }else{
                aj.success = false;
                aj.msg = '区域案卷信息统计失败';
            }
            return this.json(aj)
           
        }
       
    }