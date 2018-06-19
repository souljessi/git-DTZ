export default class extends think.Controller {
    
        /**
         * 单元网格立案数
         */
        async getBGIDCaseAction() {
            let aj = think.ajaxJson();
            const AreaService = this.service('overallmerit/AreaService');
            const data = {
                cycle:Number(this.get('cycle')),
                rangeDate:this.get('rangeDate')
            };
            const res = await AreaService.getBGIDCase(data);
            if (res&&res.error) {
                aj.success = false;
                aj.msg = '查询失败';
            } else {
                aj.result = res;
            }
            return this.json(aj);
    
        }
        /**
         * 条件统计查询区域立案数
         * 
         * @returns 
         */
        async queryAllAreaDataAction() {
            let aj = think.ajaxJson();
            const data = {
                level:Number(this.get('level')),
                cycle:Number(this.get('cycle')),
                rangeDate:this.get('rangeDate')
            }
            const AreaService = this.service('overallmerit/AreaService');
            const res = await AreaService.getAreaData(data);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
        }

    }