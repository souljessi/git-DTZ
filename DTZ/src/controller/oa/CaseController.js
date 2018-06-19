export default class extends think.BaseController {

    /**
     * 通过businesskey查询所有案件信息
     * @param {String} businesskey          部件id
     * @returns 
     */
    async queryCaseByKeyAction() {
        let aj = think.ajaxJson();
        let getData = {
            businesskey: this.get('businesskey')
        };
        const CaseService = this.service('oa/CaseService');
        const res = await CaseService.getCaseByKey(getData);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 查询案件信息
     * 
     * @returns 
     */
    async queryCaseAllAction() {
        let aj = think.ajaxJson();
        const CaseService = this.service('oa/CaseService');
        const res = await CaseService.getCaseAll(this.getUser());
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 通过porcid查询案件信息
     * @returns
     */
    async queryCaseByProcIdAction() {
        let aj = think.ajaxJson();
        const CaseService = this.service('oa/CaseService');
        let proc_inst_id = this.post('proc_inst_id');
        const res = await CaseService.getCaseByProcId(proc_inst_id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    /**
     * 部门评价
     */
    async getOrgEvalAction() {
        let aj = think.ajaxJson();
        const CaseService = this.service('oa/CaseService');
        const data = {
            orgList: this.get('orgList'),
        };
        const res = await CaseService.getOrgEval(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);

    }
}