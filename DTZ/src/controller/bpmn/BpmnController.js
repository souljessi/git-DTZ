import moment from 'moment';
export default class extends think.BaseSocket {
    /**
     * 查询工作流
     */
    async queryBpmnListAction() {
        var _this = this;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        const res = await BpmnService.getBpmnList(_this.get('page,pageSize'));
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return _this.json(aj);
    }
    /**
     * 查询工作流
     */
    async queryModelListAction() {
        var _this = this;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        const res = await BpmnService.getModelList(_this.get('page,pageSize'));
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return _this.json(aj);
    }
    /**
     * 保存上传的bpmn工作流
     */
    async saveUploadBpmnAction() {
        var _this = this;
        const file = this.file('bpmn');
        const name = this.post('name');
        const overtime = this.post('overtime');
        let aj = think.ajaxJson();
        let path;
        if (file) {
            path = await this.renameFile(file);
        }
        const BpmnService = _this.service('bpmn/BpmnService');
        const res = await BpmnService.saveUplaodBpmn(name, path.filePathStatic, overtime);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '保存失败';
        }
        return this.json(aj);
    }
    /**
     * 删除最高版本的流程信息
     */
    async deleteBpmnByIdAction() {
        var _this = this;
        const id = this.post('id');
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        const res = await BpmnService.deleteBpmnById(id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '删除失败';
        }
        return this.json(aj);
    }
    /**
     * 删除最高版本的流程信息
     */
    async deleteModelByIdAction() {
        var _this = this;
        const id = this.post('id');
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        const res = await BpmnService.deleteModelById(id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '删除失败';
        }
        return this.json(aj);
    }
    /**
     * 修改流程状态
     */
    async uploadBpmnStatusAction() {
        var _this = this;
        const id = this.post('id');
        const is_hang = this.post('is_hang');
        const procDefId = this.post('procDefId');
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        const res = await BpmnService.uploadBpmnStatus(id, is_hang, procDefId);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '修改失败';
        }
        return this.json(aj);
    }

    /**
     * 部署模型
     */
    async deploymentModelAction() {
        var _this = this;
        const data = this.post('data');
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        const res = await BpmnService.deploymentModel(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '部署失败';
        }
        return this.json(aj);
    }

    /**
     * 修改模型
     */
    async updateModelAction() {
        var _this = this;
        const id = this.post('params').id;
        const xml = this.post('params').xml;
        const overtime = this.post('params').overtime;
        const deployment_id = this.post('params').deployment_id;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.updateModel(id, xml, overtime, deployment_id);
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '修改失败';
        }

        return this.json(aj);
    }
    /**
     * 添加模型
     */
    async addModelAction() {
        var _this = this;
        const xml = this.post('params').xml;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.addModel(xml);
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '添加失败';
        }

        return this.json(aj);
    }
    /**
     * 查询代办任务
     */
    async queryAgencyAction() {
        var _this = this;
        const page = this.post('params').page;
        const pageSize = this.post('params').pageSize;
        const assignee = this.post('params').assignee;
        const group = this.post('params').group;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.queryAgency(assignee, page, pageSize, group);
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '查询失败';
        }

        return this.json(aj);
    }
    /**
     * 查询代办任务的流程图
     */
    async queryAgencyViewAction() {
        var _this = this;
        const proc_id = this.post('proc_id');
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.queryAgencyView(proc_id);
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '查询失败';
        }

        return this.json(aj);
    }
    /**
     * 通过porcid查询案件流程信息
     *
     * @param {any} data  data.id
     * @returns
     */
    async queryTaskByProcIdAction() {
        let aj = think.ajaxJson();
        let proc_inst_id = this.post('id');
        const TaskService = this.service('bpmn/BpmnService');
        const res = await TaskService.getTaskByProcId(proc_inst_id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 通过porcid查询UserTask流程信息
     *
     * @param {any} data  data.id
     * @returns
     */
    async queryUserTaskByProcIdAction() {
        let aj = think.ajaxJson();
        let getData = {
            proc_inst_id: this.post('id')
        };
        const TaskService = this.service('bpmn/BpmnService');
        const res = await TaskService.getUserTaskByProcId(getData);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 通过porcid查询等待UserTask流程信息
     *
     * @param {any} data  data.id
     * @returns
     */
    async queryWaitUserTaskByProcIdAction() {
        let aj = think.ajaxJson();
        let getData = {
            proc_inst_id: this.post('id'),
            assignee: this.post('assignee'),
            group: this.post('group')
        };
        const TaskService = this.service('bpmn/BpmnService');
        const res = await TaskService.getWaitUserTaskByProcId(getData);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 通过porcid查询flow流程信息
     *
     * @param {any} data  data.id
     * @returns
     */
    async queryFlowMsgByElementIdAction() {
        let aj = think.ajaxJson();
        let getData = {
            proc_element_id: this.post('proc_element_id'),
            proc_def_id: this.post('proc_def_id')

        };
        const TaskService = this.service('bpmn/BpmnService');
        const res = await TaskService.queryFlowMsgByElementId(getData);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }


    /**
     * 查询已办任务
     */
    async queryProcinstEndAction() {
        var _this = this;
        const page = this.post('params').page;
        const pageSize = this.post('params').pageSize;
        const assignee = this.post('params').assignee;
        let deployment_id = this.post('params').deployment_id;
        let key = this.post('params').key;
        let startTime = this.post('params').startTime;
        let endTime = this.post('params').endTime;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.getProcinstEnd(assignee, page, pageSize,deployment_id,key,startTime,endTime);
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '查询失败';
        }

        return this.json(aj);
    }
    /**
     * 查询我发起的审批
     */
    async queryApproveAction() {
        var _this = this;
        const page = this.post('params').page;
        const pageSize = this.post('params').pageSize;
        const assignee = this.post('params').assignee;
        let deployment_id = this.post('params').deployment_id;
        let key = this.post('params').key;
        let startTime = this.post('params').startTime;
        let endTime = this.post('params').endTime;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.getApprove(assignee, page, pageSize,deployment_id,key,startTime,endTime);
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '查询失败';
        }

        return this.json(aj);
    }
    /**
     * 查询用户
     */
    async queryUserListAction() {
        var _this = this;
        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.getUserList();
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '查询失败';
        }

        return this.json(aj);
    }
    /**
     * 查询角色
     */
    async queryRoleListAction() {
        var _this = this;

        let aj = think.ajaxJson();
        const BpmnService = _this.service('bpmn/BpmnService');
        try {
            const res = await BpmnService.queryRoleList();
            aj.result = res;
        } catch (e) {
            aj.success = false;
            aj.msg = '查询失败';
        }

        return this.json(aj);
    }
    /**
     * 开始流程
     */
    async startProcessInstanceAction() {
        var _this = this;
        let aj = think.ajaxJson();
        const key = this.post('key');
        const id = this.post('id');
        const userID = this.post('userid');
        let data = this.post('data');
        const BpmnService = _this.service('bpmn/BpmnService');
        const apiBpmnService = _this.service('api/bpmn/BpmnService');
        try {
            let result = await BpmnService.startProcessInstance(key, id, userID, data);
            if (!result.error) {
                const userIds = result.backLogsUserIds;
                let socketBody=this.getSocketMsgBody();
                let result={

                    id: result.procInstId,
                    date: moment().format("YYYY-MM-DD HH:mm:ss")
                }
                socketBody.title=result.review_name + ',待您审批';
                socketBody.result=result
                socketBody.menuUrl='myTask'
                _this.sendMsgByUserAction(socketBody, userIds, 'msg_box');
                apiBpmnService.pushDataToBacklogPeople(result.backLogsUserIds, result.form_type, result.data, result.review_name, result.procInstId)

            } else {

            }
        } catch (e) {
            aj.success = false;
            aj.msg = '查询失败';
        }

        return this.json(aj);
    }

    /**
     * 执行流程
     */
    async executeFlowAction() {
        var _this = this;
        let aj = think.ajaxJson();
        const flowid = this.post('flowid');
        const act_name = this.post('act_name');
        const userid = this.post('userid');
        const taskDescription = this.post('taskDescription');
        const proc_element_id = this.post('proc_element_id');
        const proc_inst_id = this.post('proc_inst_id');
        const fileList = this.post('file');
        const approveType = this.post('approveType');

        let filePath = await this.uploadOwnFilesAction(fileList);
        let picPath = '';
        filePath.forEach(file => {
            picPath += file.realpath + ','
        })
        picPath = picPath.substr(0, picPath.length - 1)
        const BpmnService = _this.service('bpmn/BpmnService');
        const apiBpmnService = _this.service('api/bpmn/BpmnService');
        try {
            let res = await BpmnService.executeFlow(flowid, taskDescription, act_name, userid, proc_inst_id, proc_element_id, picPath, approveType);
            if (!res.error) {

                if(res.state==1){
                    aj.success=false;
                    aj.msg='该审批已被其他人审批！';
                    aj.state=res.state;
                    return this.json(aj);
                }
                aj.state=res.state;
                let result = res.SendMsgObj;
                const userIds = result.userId;
                const backLogsUserIds = result.backLogsUserIds;
                const nextActinstIds = res.nextActinstIds;
                const createUser = res.userId;
                // let socketBody = {
                //     result: {
                //         title: result.review_name + ',待您审批',
                //         id: result.procInstId,
                //         date:moment().format("YYYY-MM-DD HH:mm:ss")
                //     },
                //     moduleName: 'xtbg',
                //     userIds: userid,
                //     menuUrl: 'myTask'
                // };
                let socketBody=this.getSocketMsgBody();
                socketBody.result={
                            id: result.procInstId,
                            date:moment().format("YYYY-MM-DD HH:mm:ss")
                }
                socketBody.menuUrl='myTask'
                socketBody.title=result.review_name + ',待您审批';
                if (backLogsUserIds.length > 0) {
                    _this.sendMsgByUserAction(socketBody, backLogsUserIds, 'msg_box');
                    apiBpmnService.pushDataToBacklogPeople(result.nextActinstIds, result.form_type, result.form, result.review_name, result.procInstId);
                }

                socketBody.menuUrl='approve'
                socketBody.title=result.review_name +'审批申请已'+result.result
                _this.sendMsgByUserAction(socketBody, userIds, 'msg_box');
                apiBpmnService.pushDataToUserPeople(userIds, result.form_type, result.form, result.review_name, result.procInstId,result.result);
                const onlineUser = await this.getOnlineModuleByUser('jdzh');
                // let socketBody1 = {
                //     result: {
                //         id: proc_inst_id,
                //         formModuleName: 'xtbg'
                //     },
                //     moduleName: 'jdzh',
                //     menuUrl: 'controlCenter'
                // };
                let socketBody1=this.getSocketMsgBody();
                socketBody1.result={
                            id: proc_inst_id,
                            formModuleName: 'xtbg'
                    }
                    socketBody1.menuUrl='controlCenter'
                if (onlineUser.length > 0) {
                    _this.sendMsgByUserAction(socketBody1, onlineUser, 'control_center');
                }
            } else {

            }
            if (res.nextActinstIds.length > 0) {
                aj.result.selectPerson = true;
                aj.result.id = res.nextActinstIds[0]
            } else {
                aj.result.selectPerson = false;
                aj.result.id = ''
            }
        } catch (e) {
            aj.success = false;
            aj.msg = '提交失败';
        }

        return this.json(aj);
    }
    /**
     *web端表单提交
     * @returns
     */
    async submitFormAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('bpmn/BpmnService');
        let formId = this.post('formId');
        let userId = this.post('userId');
        let data = this.post('data');

        const res = await BpmnService.submitForm(userId, formId, data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     *表单存储接口
     * @returns
     */
    async saveFormTemplateAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('bpmn/BpmnService');
        let template_code = this.post('templateCode');
        let formId = this.post('formId');
        let formName = this.post('formName');
        let userId = this.post('userId');
        let icon = this.post('icon');
        let template_group = this.post('templateGroup');
        let formType = this.post('formType');
        let remarks = this.post('remarks');
        let data = this.post('data');
        const res = await BpmnService.saveFormTemplate(userId, formId, formName, template_code, template_group, data, icon, formType,remarks);
        if (!res.error) {
            if (res) {
                aj.msg = '保存成功'
            } else {
                aj.msg = '修改成功'
            }
        } else {
            aj.success = false;
            aj.msg = '保存失败';
        }
        return this.json(aj);
    }
    /**
     *流程列表
     * @returns
     */
    async processListAction() {
        let aj = think.ajaxJson();
        let formType = this.post('formType');
        const BpmnService = this.service('bpmn/BpmnService');
        const res = await BpmnService.processList(formType);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     *编辑流程图
     * @returns
     */
    async editBpmnAction() {
        let aj = think.ajaxJson();
        let id = this.post('id');
        let xml = this.post('xml');
        let overtime = this.post('overtime');
        let deployment_id = this.post('deployment_id');
        const BpmnService = this.service('bpmn/BpmnService');
        let user = this.getUser();
        const res = await BpmnService.editBpmn(id, xml, overtime, deployment_id, user);
        if (!res.error) {
            aj.result = res;
            aj.msg = '保存成功';

        } else {
            aj.success = false;
            aj.msg = '保存失败';
        }
        return this.json(aj);
    }

    /**
     *案件流程查询
     * @returns
     */
    async cassProcessListAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('bpmn/BpmnService');
        const org_id=this.post('org_id')
        const res = await BpmnService.cassProcessList(org_id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '保存失败';
        }
        return this.json(aj);
    }
    /**
     *系统内置表单添加
     * @returns
     */
    async addSysFormAction() {
        let aj = think.ajaxJson();
        let key = this.post('key');
        let name = this.post('name');
        let icon_path = this.post('icon_path');
        let formId = this.post('formId');
        let template_group = this.post('template_group');
        let userId = this.post('userId');
        let remarks = this.post('remarks');
        const BpmnService = this.service('bpmn/BpmnService');
        const res = await BpmnService.addSysForm(key, name, icon_path, template_group, userId, formId,remarks);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '保存失败';
        }
        return this.json(aj);
    }
    /**
     *删除流程
     * @returns
     */
    async deleteBpmnDefAction() {
        let aj = think.ajaxJson();
        let id = this.post('id');
        const BpmnService = this.service('bpmn/BpmnService');
        const res = await BpmnService.deleteBpmnDef(id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '保存失败';
        }
        return this.json(aj);
    }

    /**
     *查询流程信息
     * @returns
     */
    async queryProcinstMsgAction() {
        let aj = think.ajaxJson();
        let id = this.post('id');
        const BpmnService = this.service('bpmn/BpmnService');
        const res = await BpmnService.queryProcinstMsg(id);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    /**
     *  直接调用该接口，无需传入file对象，无需关心前端传来的file name
     * 1.支持单文件上传
     * 2.支持不同名多文件上传
     * 3.支持同名多文件上传
     * @param businesskey
     * @param files
     * @returns {successJson}
     */
    async uploadOwnFilesAction(businesskey = '', files = this.file()) {
        let fileArray = [];
        try {
            for (let i in files) {
                //同名多文件上传
                if (Array.isArray(files[i])) {
                    let fileArr = files[i];
                    for (let j of fileArr) {
                        let file = j;
                        //避免用户上传空文件
                        if (file.size === 0) {
                            continue;
                        }
                        let result = await this.renameFile(file);
                        fileArray.push(result);
                    }
                    //不同名多文件上传
                } else {
                    let file = files[i];
                    //避免用户上传空文件
                    if (file.size === 0) {
                        continue;
                    }

                    let result = await this.renameFile(file);
                    fileArray.push(result);
                }
            }
            return fileArray
        } catch (err) {
            return this.errorJson('上传失败');
        }

    }

    //获取所有组织机构和人员
    async orgAndUserAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        let user = this.getUser();

        const BpmnService = this.service('bpmn/BpmnService');
        const result = await BpmnService.getOrgAndUser(user);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }
    //获取所有审批类型
    async queryBpmnTypeListAction() {
        let aj = think.ajaxJson();
        const BpmnService = this.service('bpmn/BpmnService');
        const result = await BpmnService.queryBpmnTypeList();
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }
       //设置流程可见部门
    async setBpmnOrgAction() {
        let aj = think.ajaxJson();
        let orgIdList = this.post('orgIdList');
        let proc_def_id = this.post('proc_def_id');
        const BpmnService = this.service('bpmn/BpmnService');
        const result = await BpmnService.setBpmnOrg(orgIdList,proc_def_id);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }
};
//# sourceMappingURL=BpmnController.js.map