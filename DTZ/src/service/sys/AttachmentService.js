import assert from 'assert';

export default class extends think.Service {
    constructor() {
        super();
        this.attachmentModel = this.db['sys_attachment'];

    }

    /**
     * 保存多个文件
     * @param fileArray {Array}　 文件信息
     * @param businesskey {String} 业务主键　
     * @returns {*}
     */
    saveFile(fileArray, businesskey) {
        let arr = [];
        for (let value of fileArray) {
            value.id = think.uuid('v1');
            value.businesskey = businesskey;
            arr.push(value);
        }
        return this.attachmentModel.bulkCreate(arr);
    }
    /**
     * 自定义where查询附件表文件路径
     */
    getFilePath(whereObj) {
        return this.attachmentModel.findAll({
            where: whereObj,
            attributes: ['realpath']
        });
    }

    /**
     * 自定义where删除附件
     * @param whereObj 自定义条件
     * @returns {*}
     */
    delFile(whereObj) {
        assert(ObjectUtils.isObject(whereObj), 'object must be a object');
        return this.attachmentModel.destroy({where: whereObj});
    }
    /**
     * 通过porcid查询案件流程信息
     *
     * @param {any} data  data.id
     * @returns
     */
    async getAttByKey(data) {
        let where = {
            businesskey: data.businesskey
        };
        try {
            const Res = await this.attachmentModel.findAll({
                where: where,
                attributes: ['realpath']
            });
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

}