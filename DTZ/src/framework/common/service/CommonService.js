class CommonService {
    constructor(db, ...arg) {
        this.db = db;
        this.arg = arg;
    }

    /**
     * 保存记录
     * @param model
     * @param values
     * @returns {*}
     */
    async save(model, values) {
        if (values instanceof Object && !Array.isArray(values)) {
            return model.create(values);
        } else {
            return false;
        }
    }

    /**
     * 根据id更新记录
     * @param model
     * @param values
     * @param id
     * @returns {*}
     */
    async updateById(model, values, id) {
        if (values instanceof Object && !Array.isArray(values)) {
            return model.update(values, {where: {id: id}});
        }
    }

    /**
     * 自定义where条件更新记录
     * @param model
     * @param values
     * @param where
     * @returns {*}
     */
    async updateByWhere(model, values, where) {
        if (values instanceof Object && !Array.isArray(values)) {
            return model.update(values, {where: where});
        }

    }


    /**
     * 自定义where条件查询
     * @param model
     * @param where
     */
    async findAll(model, attributes, where) {
        return model.findAll({
            attributes: attributes,
            where: where
        });

    }

    /**
     * 原生sql查询
     * @param sql
     * @returns {*}
     */
    async querySql(sql) {
        return this.db.sequelize.query(sql, {type: this.db.sequelize.QueryTypes.SELECT});
    }

    /**
     *保存多条数据
     * @param model  模型
     * @param array 数组
     * @returns {*}
     */
    async saveMany(model, array) {
        if (!Array.isArray(array)) {
            return false;
        }
        return model.bulkCreate(array);
    }

    /**
     * 根据id删除数据
     * @param model
     * @param id
     * @returns {*}
     */
    async deleteById(model, id) {
        return model.destroy({where: {id: id}});
    }

    /**
     * 删除所有数据
     * @param model
     * @returns {*}
     */
    async deleteAll(model) {
        return model.destroy();

    }


    // /**
    //  * 根据用户名和密码加密sha1
    //  * @param username
    //  * @param password
    //  * @returns {*}
    //  */
    // irreversibleEncrypt(username, password) {
    //     let key = 'KMLC';
    //     const encryptCode = crypto.createHash('sha1').update(password + '{' + username + '}' + key).digest('hex');
    //     return encryptCode;
    // }

}

module.exports = CommonService;