export default class extends think.Service {


    /**
     * 查询所有分机号
     * 
     * @returns 
     */
    findAllExten() {
        return this.db["call_exten"].findAll({
            group: 'exten',
            attributes: ["exten"]
        });
    }

    /**
     * 通过用户id查询我的分机号
     * @param {*} userId 
     */
    findExtenByUser(userId) {
        return this.db["call_exten"].findOne({
            attributes: ['exten'],
            where: {
                commissioner: userId
            }
        });
    }

    /**
     * 查询我的分机号通过分机号
     * 
     * @param {Number} exten 
     * @returns 
     */
    findUserByExten(exten) {
        return this.db["call_exten"].findOne({
            attributes: ['commissioner'],
            where: {
                exten: exten
            }
        });
    }


    /**
     * 客户资料保存
     * @param {Object} values 
     */
    saveCustomer(values) {
        if (values.id) {
            return this.db["call_customer"].update(values, {
                where: {
                    id: values.id
                }
            });
        } else {
            values.id = think.uuid("v1");
            return this.db["call_customer"].create(values);
        }
    }


    /**
     * 工地保存编辑
     * 
     * @param {any} values 
     * @returns 
     */
    saveWorkOrder(values) {
        values.id = think.uuid("v1");
        return this.db["cms_event"].create(values);
    }

}