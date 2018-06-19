export default class extends think.Service {
    constructor() {
        super()
        this.notifyModel = this.db['oa_notify']
        this.notifyRecordModel = this.db['oa_notify_record']
        this.typeModel = this.db['sys_type']
        this.type_group_model = this.db['sys_type_group']
        this.attachmentModel = this.db['sys_attachment']

        this.notifyRecordModel.belongsTo(this.notifyModel, {
            foreignKey: 'oa_notify_id',
            targetKey: 'id'
        })
    }

    //移动端获取通知列表
    async notifyList(data) {
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
        let where = {
            user_id: data.user_id
        }
        let result = {
            count: 0,
            rows: []
        }
        try {
            const notify_id = await this.notifyRecordModel.findAndCountAll({
                where: where,
                include:[
                    {model:this.notifyModel},

                ],
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    [{model: this.notifyModel}, 'create_date', 'DESC']
                ],

            });

            if (notify_id.rows.length > 0) {
                const IDS = notify_id.rows;

                for (let item of IDS) {

                    let notifyList = {
                        id: item.oa_notify.id,
                        type: item.oa_notify.type,
                        title: item.oa_notify.title,
                        files: item.oa_notify.files,
                        status: item.oa_notify.status,
                        create_by: item.oa_notify.create_by,
                        create_date: item.oa_notify.create_date,
                        update_by: item.oa_notify.update_by,
                        update_date: item.oa_notify.update_date,
                        remarks: item.oa_notify.remarks,
                        del_flag: item.oa_notify.del_flag,
                        read_flag: item.read_flag
                    };


                    result.rows.push(notifyList)

                }
                result.count = notify_id.count;

            }

            // result.rows = result.rows.sort(this.compare('create_date')).reverse()//按事件降序排列
            return result

        } catch (error) {
            return this.exceptionService.handleError(error);

        }
    }

    //获取通知详情
    async notifyDetails(data) {
        let where = {
            id: data.id
        };
        let query = {
            businesskey: data.id
        };
        let param = {
            read_flag: 1,
            read_date: new Date()

        };
        let notify_id = {
            oa_notify_id: data.id,
            user_id: data.userId
        };
        try {
            let readed = await this.notifyRecordModel.update(param,{where: notify_id});
            let res =  await this.notifyModel.findOne({where: where});
            let result = await this.attachmentModel.findAll({where: query});
            if(readed){
                console.log('成功')
            }
            let data = {
                res: res,
                result: result
            };
            return data
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
    //获取字典表里的通知类型
    async getNotifyType() {
        let where = {
            typegroupcode: 'tzlx'
        };
        try {
            const type_id = await this.type_group_model.findOne({where: where})
            if (type_id) {
                let query = {
                    typegroupid: type_id.id
                };
                return await this.typeModel.findAll({where: query})
            }
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

}