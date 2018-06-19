export default class extends think.Controller {
    
        /**
         * 按部门时间统计立案相关
         * 
         * @returns 
         */
        async OrgStatisAction() {
            let aj = think.ajaxJson();            
            const data = {
                orgid:Number(this.post('orgid')),
                startTime:this.post('startTime'),//2018-02-10
                endTime:this.post('endTime')//2018-02-13
            };
            const OrgService = this.service('api/statistics/OrgService');
            const res = await OrgService.OrgStatis(data);
            if(!res.error){
                aj.result = res;
            }else{
                aj.success = false;
                aj.msg = '区域案卷信息统计失败';
            }
            return this.json(aj)
           
        }
       
    }