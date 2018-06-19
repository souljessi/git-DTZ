export default class extends think.Service {
    constructor() {
        super()
        this.caseModel = this.db['oa_case']
        this.approveModel = this.db['approve']
    }

    async getCaseList(data) {
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
        let where = {
            type: data.type
        }

        try {
            return await this.caseModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start)
            })


        } catch (error) {
            return this.exceptionService.handleError(error)

        }


    }

    async getApproveRecord(data){
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
        let where = {
            id: data.id
        }
        try{
            return await this.approveModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start)
            })

        }catch(error){
            return this.exceptionService.handleError(error)

        }
    }
}