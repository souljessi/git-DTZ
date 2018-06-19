/**
 * 事件立案
 */
export default class extends think.BaseSocket {

    /**
     * 事件立案申请，添加案件
     */

    async applyCreateCaseAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const key = data.process_id;
        const id = data.org_id;
        const userid = data.userid;
        let applyCaseService = this.service('oa/CaseService');
        const apiBpmnService = this.service('api/bpmn/BpmnService');
        const BpmnService = this.service('bpmn/BpmnService');
        const res = await BpmnService.startProcessInstance(key, id, userid);
        if (!res.error) {
            data.proc_inst_id = res.procInstId;
            let result = await applyCaseService.createCase(data);
            if (!result.error) {

                // let toUser = this.getOnlineModuleByUser('jdsl');
                // let obj = this.getSocketMsgBody(res);
                // this.sendMsgByUserAction(obj,toUser,'acceptScreen');
                const userIds = res.backLogsUserIds;
                // let socketBody = {
                //     result: {
                //         title: res.review_name + ',待您审批',
                //         id: res.procInstId,
                //         date: res.date
                //     },
                //     moduleName: 'xtbg',
                //     userIds: userid,
                //     menuUrl: 'myTask'
                // };
                let socketBody=this.getSocketMsgBody();
                socketBody.result={
                            id: res.procInstId,
                            date: res.date
                }
                socketBody.menuUrl='myTask'
                socketBody.title= res.review_name + ',待您审批';
                if(userIds.length>0){
                    this.sendMsgByUserAction(socketBody, userIds, 'msg_box');
                    apiBpmnService.pushDataToBacklogPeople(userIds, res.form_type, res.data, res.review_name, res.procInstId)
                }
                aj.result = res
            } else {
                aj.success = false;
                aj.msg = '申请立案失败'
            }

        } else {
            aj.success = false;
            aj.msg = '申请立案失败'
        }

        //立案成功推送到web端
        const userIds = await this.getOnlineModuleByUser('jdzh');

        // let obj = this.getSocketMsgBody(result);
        // let socketBody = {
        //     result: {
        //         id: data.id,
        //         formModuleName: 'jdsl'
        //     },
        //     moduleName: 'jdzh',
        //     menuUrl: 'controlCenter'
        // };
        let socketBody=this.getSocketMsgBody();
        socketBody.result={
            id: data.id,
           formModuleName: 'jdsl'
        };
        socketBody.title = '事件立案';
        socketBody.menuUrl='controlCenter';
        this.sendMsgByUserAction(socketBody, userIds, 'control_center');

        return this.successJson()
    }
    async caseByIdAction(){
        let aj = think.ajaxJson();
        let data = this.post();
        let applyCaseService = this.service('oa/CaseService');
        let result = await applyCaseService.caseById(data);
        if(!result.error){
            aj.result = result

        }else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    /**
     * 部件立案申请
     */
    async applyPartCaseAction() {
        let aj = think.ajaxJson();
        let data = this.post();

        if (!data.case_id) {
            data.case_id = think.uuid('v1')

        }
        const key = data.process_id;
        const id = data.org_id;
        const userid = data.userid;
        const BpmnService = this.service('bpmn/BpmnService');
        let applyCaseService = this.service('oa/CaseService');
        const apiBpmnService = this.service('api/bpmn/BpmnService');

        const res = await BpmnService.startProcessInstance(key, id, userid);

        if (!res.error) {
            data.proc_inst_id = res.procInstId;
            let result = await applyCaseService.createPartCase(data);
            if (!result.error) {
                // let socketBody = {
                //     result: {
                //         id: data.case_id,
                //         formModuleName: 'jdsl'
                //     },
                //     moduleName: 'jdzh',
                //     menuUrl: 'controlCenter'
                // };
                //
                // this.sendMsgByModuleAction(socketBody);
                const userIds = res.backLogsUserIds;
                // let socketBody = {
                //     result: {
                //         id: res.procInstId,
                //         date: res.date
                //     },
                //     moduleName: 'xtbg',
                //     userIds: userid,
                //     menuUrl: 'myTask'
                // };
                let socketBody=this.getSocketMsgBody();
                socketBody.result={
                    id: res.procInstId,
                    date: res.date
                }
                socketBody.menuUrl='myTask'
                socketBody.title= res.review_name + ',待您审批';
                if(userIds.length>0){
                    this.sendMsgByUserAction(socketBody, userIds, 'msg_box');
                    apiBpmnService.pushDataToBacklogPeople(userIds, res.form_type, res.data, res.review_name, res.procInstId)
                }
                aj.result = res
            } else {
                aj.success = false;
                aj.msg = '申请立案失败'
            }

        } else {
            aj.success = false;
            aj.msg = '申请立案失败'
        }
        //立案成功推送到web端
        const userIds = await this.getOnlineModuleByUser('jdzh');
        //就事件随机推送给某个用户
        // const randomId = userIds[Math.floor(Math.random() * userIds.length)];

        // console.log(randomId, 'randomId');
        // let obj = this.getSocketMsgBody(result);
        let socketBody=this.getSocketMsgBody();
        socketBody.result={
            id: data.id,
            formModuleName: 'jdsl'
        };
        socketBody.title = '事件立案';
        socketBody.menuUrl='controlCenter';
        this.sendMsgByUserAction(socketBody, userIds, 'control_center');

        return this.successJson()
    }

    /**
     * 更新部件表BGID: updateBGID
     */

    async updateCaseBGIDAction(){
        let aj = think.ajaxJson();
        let data = this.post();
        let updateCaseBGIDService = this.service('oa/CaseService');
        let res = await updateCaseBGIDService.updateCaseBGID(data);

        if(!res.error){
            aj.result = res

        }else {
            aj.success = false;
            aj.msg = '更新失败'
        }

        return this.json(aj)

    }

    /**
     * 查询案件表列表
     */

    async get_all_case_listAction(){
        let data = this.post();
        try {
            let res = await this.service('oa/CaseService').all_case_list(data);
            return this.successJson(res)
        }catch(error){
            return this.errorJson('查询失败')

        }

    }

    /**
     * 条件查询案件列表
     */

    async get_specific_case_listAction() {
        let data = this.post();
        try {
            let res = await this.service('oa/CaseService').specific_case_list(data);
            return this.successJson(res)
        } catch (error) {
            return this.errorJson('查询失败')
        }
    }

    /**
     * 删除案件
     */
    async delete_caseAction(){
        let data = this.post();
        try {
            let res = await this.service('oa/CaseService').delete_case(data);
            return this.successJson(res)
        } catch (error) {
            return this.errorJson('删除失败')
        }
    }

}