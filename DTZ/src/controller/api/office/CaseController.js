export default class extends think.Controller{
    //案件列表获取接口（案件ID，已立案，未立案）
    async caseListAction(){
        let aj  = think.ajaxJson();
        const data = this.get('page','pageSize','id','type');
        const caseService = this.service('api/case/CaseService');
        const RESULT = await caseService.getCaseList(data);
        if(!RESULT.error){
            aj.result = RESULT

        }else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //审批记录查询接口(用户id)

    async approveRecordAction(){
        let aj = think.ajaxJson();
        const data = this.get('page','pageSize','id');
        const approveRecordService = this.service('api/case/CaseService');
        const RESULT = await approveRecordService.getApproveRecord(data);

        if(!RESULT.error){
            aj.result = RESULT

        }else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }
    //审批详情接口（审批记录id）
    async approveDetailsAction(){
        let aj = think.ajaxJson();
        const data = this.get('id')

    }
}