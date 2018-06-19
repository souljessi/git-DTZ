export default class extends think.Service{
    constructor(){
        super()
        this.officeModel = this.db['office']
    }

    async newTask(data){
        data.id = think.uuid('v1')
        try{
            return await this.officeModel.create(data)


        }catch(error){
            return this.exceptionService.handleError(error)

        }
    }

    async pendingTaskList(data){
        data.start = (parseInt(data.page) - 1)* parseInt(data.pageSize)
        let where = {
            type: data.type
        }

        try{
            return await this.officeModel.findAndCountAll({
                where: where,
                limit:parseInt(data.pageSize),
                offset: parseInt(data.start)
            })

        }catch(error){
            return this.exceptionService.handleError(error)

        }

    }
}