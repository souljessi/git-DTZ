export default class extends think.Controller {
    
        /**
         * 按区域进行部件统计
         * 
         * @returns 
         */
        async PartsStatisAction() {
            let aj = think.ajaxJson();            
            const data = {
                area_code:this.post('area_code')
            };
            const PartsService = this.service('api/statistics/PartsService');
            const res = await PartsService.PartsStatis(data);
            if(!res.error){
                aj.result = res;
            }else{
                aj.success = false;
                aj.msg = '区域案卷信息统计失败';
            }
            return this.json(aj)
           
        }
       
    }