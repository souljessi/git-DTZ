export default class  extends think.BaseSocket {

    /**
     * 自定义表单首页列表
     * @returns
     */
    async getHomeFormListAction() {
        let aj = think.ajaxJson();
        let user=this.getUser();
        const BpmnService = this.service('api/bpmn/BpmnService');
        const res = await BpmnService.getHomeFormList(user);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 自定义表单首页列表
     * @returns
     */
    async getFormInfoAction() {
        let aj = think.ajaxJson();
        let id =  this.post('id');
        const BpmnService = this.service('api/bpmn/BpmnService');
        const res = await BpmnService.getFormInfo(id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 查询待我审批和我已审批列表
     * @returns
     */
    async getMyApproveAction() {
        let aj = think.ajaxJson();
        let sourceUserId =  this.post('sourceUserId');
        let targetUserId =  this.post('targetUserId');
        let label =  this.post('label');
        let page =  this.post('page');
        let type =  this.post('type');
        let applyStatus =  this.post('applyStatus');
        let keywords =  this.post('keywords');
        let pageSize =  this.post('pageSize');
        const BpmnService = this.service('api/bpmn/BpmnService');
        const res = await BpmnService.getMyApprove(sourceUserId,targetUserId,keywords,label,type,applyStatus,page,pageSize);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     *表单提交
     * @returns
     */
    async submitFormAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('api/bpmn/BpmnService');
        let formId =  this.post('formId');
        let userId =  this.post('userId');
        let data=this.post('data');

        const res = await BpmnService.submitForm(userId,formId,data);
        if (!res.error) {
        this.sendMsgByUserAction(res.socketBody, res.userIds, 'control_center');

        } else {
            aj.success = false;
            aj.msg = '提交失败';
        }
    }
    /**
     *查询审批人
     * @returns
     */
    async getApproverAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('api/bpmn/BpmnService');
        let formId =  this.post('formId');
        const res = await BpmnService.getApprover(formId);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    /**
     * 通过porcid查询审批信息
     * @returns
     */
    async approveInfoAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('api/bpmn/BpmnService');
        let proc_inst_id =  this.post('id');
        const res = await BpmnService.approveInfo(proc_inst_id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }


    /**
     * 通过porcid查询案件流程信息
     * @param {any} data  data.id
     * @returns
     */
    async taskMsgListAction() {
        let aj = think.ajaxJson();
        let   proc_inst_id= this.post('id');
        const BpmnService = this.service('api/bpmn/BpmnService');
        const res = await BpmnService.getTaskByProcId(proc_inst_id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 通过porcid查询案件流程flow信息
     * @param {any} data  data.id
     * @returns
     */
    async flowMsgListAction() {
        let aj = think.ajaxJson();
        let   proc_inst_id= this.post('id');
        let   userId= this.post('userId');
        const BpmnService = this.service('api/bpmn/BpmnService');
        const res = await BpmnService.flowMsgList(proc_inst_id,userId);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }


    /**
     *流程表单提交
     * @returns
     */
    async submitFlowFormAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('api/bpmn/BpmnService');
        let flowId = this.post('flowId');
        let userId = this.post('userId');
        let procInstId = this.post('procInstId');
        let option = this.post('option');
        let uploadImgs = this.post('uploadImgs');
        let approveType =this.post('approveType')
        try {
            const res = await BpmnService.submitFlowForm(flowId, option, userId, procInstId,uploadImgs,approveType);
            if (!res.error) {
                if(res.state==1){
                    aj.success=false;
                    aj.msg='该审批已被其他人审批！';
                    aj.state=res.state;
                    return this.json(aj);
                }
                aj.state=res.state;
                let backUser = [];
                let createUser = [];
                if (Array.isArray(res.backObj.userIds)) {
                    backUser = res.backObj.userIds
                } else {
                    backUser.push(res.backObj.userIds)
                }
                if (Array.isArray(res.createObj.userIds)) {
                    createUser = res.createObj.userIds
                } else {
                    createUser.push(res.createObj.userIds)
                }
                if (backUser.length > 0) {
                    let socketBody=this.getSocketMsgBody();
                    socketBody.result=res.backObj.socketBody.result;
                    socketBody.title=res.backObj.socketBody.title;
                    socketBody.menuUrl='controlCenter'
                    this.sendMsgByUserAction(socketBody, backUser, 'control_center');
                    socketBody.menuUrl='xtbg'
                    this.sendMsgByUserAction(socketBody, backUser, 'msg_box');

                }
                // let socketBody1=this.getSocketMsgBody();
                // socketBody1.result=res.createObj.socketBody.result;
                // socketBody1.title=res.createObj.socketBody.title;
                // socketBody1.menuUrl='approve'
                // this.sendMsgByUserAction(socketBody1, createUser, 'msg_box');
                if(res.nextActinstIds.length>0){
                    aj.result.selectPerson=true;
                    aj.result.id=res.nextActinstIds[0]
                }else{
                    aj.result.selectPerson=false;
                    aj.result.id=''
                }
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
        } catch (e) {
        }
    }

        /**
         *事件id查询流程详情列表
         * @returns
         */
        async queryUserTaskByEventIDAction() {
            let aj = think.ajaxJson();
            const BpmnService = this.service('api/bpmn/BpmnService');
            let id =  this.post('id');
            try{
                const res = await BpmnService.queryUserTaskByEventID(id);
                if (!res.error) {
                    aj.msg = '查询成功';
                    aj.result = res;
                } else {
                    aj.success = false;
                    aj.msg = '查询失败';
                }
                return this.json(aj);
            }catch(e){
            }
    }

    /**
     *修改流程审批人
     * @returns
     */
    async setApprovePersonAction() {
        let aj = think.ajaxJson();
        let _this=this;
        const BpmnService = this.service('api/bpmn/BpmnService');
        let id =  this.post('id');
        let userid=this.post('userId')
        let createId=this.getUser().userId;
        try{
            const res = await BpmnService.updateApprovePerson(id,userid,createId);
            if (!res.error) {
                let socketBody=this.getSocketMsgBody();
                socketBody.result=res.socketBody.result;
                socketBody.title=res.socketBody.title;
                socketBody.menuUrl='myTask'
                this.sendMsgByUserAction(socketBody, res.userIds, 'msg_box');
                this.sendMsgByUserAction(socketBody, res.userIds, 'control_center');
                aj.msg = '修改成功';

            } else {
                aj.success = false;
                aj.msg = '修改失败';
            }
            return this.json(aj)
        }catch(e){
        }
    }

    // //获取所有组织机构和人员
    // async orgAndUserAction() {
    //     let aj = think.ajaxJson();
    //     let data = this.get();
    //     const BpmnService = this.service('api/bpmn/BpmnService');
    //     const result = await BpmnService.getOrgAndUser(data);
    //     if (!result.error) {
    //         aj.result = result
    //
    //     } else {
    //         aj.success = false;
    //         aj.msg = '查询失败'
    //     }
    //     return this.json(aj)
    // }
}