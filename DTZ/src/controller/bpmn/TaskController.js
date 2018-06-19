export default class extends think.Controller {

    async queryTaskByProcIdAction() {
        let aj = think.ajaxJson();
        let getData = {
            proc_inst_id: this.get('id')
        }
        const TaskService = this.service('bpmn/TaskService');
        const res = await TaskService.getTaskByProcId(getData);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
}