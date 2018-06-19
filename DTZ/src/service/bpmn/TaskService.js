export default class extends think.Service {
    constructor() {
        super()
        this.taskModel = this.db['bpmn_hi_taskinst'];
        this.attachmentModel = this.db['sys_attachment'];
        this.userModel = this.db['sys_user'];
        this.taskModel.hasMany(this.attachmentModel, {
            foreignKey: 'businesskey',
            targetKey: 'id'
        })
        this.taskModel.belongsTo(this.userModel, {
            foreignKey: 'assignee',
            targetKey: 'username'
        });

    }
    /**
     * 通过porcid查询案件流程信息
     * 
     * @param {any} data  data.id
     * @returns 
     */
    async getTaskByProcId(data) {
        let where = {
            proc_inst_id: data.proc_inst_id
        }
        try {
            const Res = await this.taskModel.findAll({
                where: where,
                order: [
                    ['start_time', 'ASC']
                ],
                include: [
                    //     {
                    //     model: this.attachmentModel,
                    //     // as: 'Attachment',
                    //     attributes: ['file_name', 'realpath']
                    // }, 
                    {
                        model: this.userModel,
                        attributes: ['id', 'realname'],
                    }
                ]
            })
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

}