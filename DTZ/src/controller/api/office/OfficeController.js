export default class extends think.Controller {
    //新建任务接口

    async newTaskAction() {
        let aj = think.ajaxJson()
        const data = this.post() //新建任务参数
        const taskService = this.service('api/office/OfficeService')

        const DATA = taskService.newTask(data)
        if (!DATA.error) {
            aj.result = DATA

        } else {
            aj.success = false
            aj.msg = '新建任务失败'
        }
        return this.json(aj)


    }

    //待办任务查询接口

    async pendingTaskAction() {
        let aj = think.ajaxJson();
        const data = this.get('page', 'pageSize', 'type');
        const pendingTaskService = this.service('api/office/OfficeService');
        const DATA = pendingTaskService.pendingTaskList(data)
    }
}