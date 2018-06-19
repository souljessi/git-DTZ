export default class extends think.Controller {
    
        /**
         * 部门评价
         */
        async getOrgEvalAction() {
            let aj = think.ajaxJson();
            const OrgService = this.service('overallmerit/OrgService');
            const data = {
                cycle:Number(this.get('cycle')),
                rangeDate:this.get('rangeDate'),
                orgList:this.get('orgList')
            };
            const res = await OrgService.getOrgEval(data);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
    
        }
         /**
         * 按部门查询超期|驳回案卷列表
         */
        async getCaseListByAction() {
            let aj = think.ajaxJson();
            const OrgService = this.service('overallmerit/OrgService');
            const data = {
                cycle:Number(this.get('cycle')),
                rangeDate:this.get('rangeDate'),
                orgid:Number(this.get('orgid')),
                type:Number(this.get('type'))
            };
            const res = await OrgService.getCaseListBy(data);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
    
        }
        
    }