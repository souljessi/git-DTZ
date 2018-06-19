export default class extends think.Service {
    constructor() {
        super();
        const db = this.db;
        this.typeGroupModel = db['sys_type_group'];
        this.typeModel = db['sys_type'];
        this.typeGroupModel.hasMany(this.typeModel, {foreignKey: 'typegroupid'});
    }

    /**
     * 缓存字典数据
     */
    async initDictionaryCache() {
        try {
            const attr = [['typecode', 'value'], ['typename', 'label'], ['other_attr', 'otherAttr']];
            const dataList = await this.typeGroupModel.findAll({
                attributes: ['typegroupcode'],
                include: [
                    {model: this.typeModel, attributes: attr}
                ]
            });
            const dictObj = {};
            for (var i = 0; i < dataList.length; i++) {
                const key = dataList[i].typegroupcode;
                const arr = dataList[i].sys_types;
                dictObj[key] = arr;
            }


            if (think.redis.isReady()) {
                const redisCli = think.redis.client;

                //获取字典keys
                let keys = await redisCli.keys('dict:*');
                //如果字典表有keys,则先清除缓存
                if (keys.length !== 0) {
                    redisCli.del(keys);
                }
                //缓存字典表
                for (let key in dictObj) {
                    redisCli.set(`dict:${key}`, JSON.stringify(dictObj[key]));
                }
            } else {
                throw new Error('连接redis失败,数据字典加载失败')
            }
            return dictObj;

        } catch (e) {
            return this.exceptionService.handleError(e);

        }
    }

    /**
     * 构建字典数据结构
     * @returns {boolean}
     */
    async buildDictData() {
        try {
            const attr = [['typecode', 'value'], ['typename', 'label'], ['other_attr', 'otherAttr']];
            const dataList = await this.typeGroupModel.findAll({
                attributes: ['typegroupcode'],
                include: [
                    {model: this.typeModel, attributes: attr}
                ]
            });
            const Obj = {};
            for (var i = 0; i < dataList.length; i++) {
                const key = dataList[i].typegroupcode;
                const arr = dataList[i].sys_types;
                Obj[key] = arr;
            }
            return Obj;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    async findDictionaryList(data) {
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        const Op = this.db.Sequelize.Op;
        let where = {};
        if (data.typegroupname && data.typegroupname !== undefined) {
            where.typegroupname = {
                [Op.like]: '%' + data.typegroupname + '%'
            };
        }
        try {
            return await  this.typeGroupModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start)
            })
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 保存字典分组信息
     * data --{}
     */
    async saveDicInfo(data) {
        if (!data.id) {
            data.id = think.uuid('v1');
        }
        try {
            const old = await this.typeGroupModel.findOne({
                where: {
                    typegroupcode: data.typegroupcode
                }
            });
            if (old && old.id !== data.id) {
                return false;
            }
            await this.typeGroupModel.upsert(data);
            return true;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 删除字典信息
     * data --Object
     * data.id --字典id String
     */
    async delDicInfo(data) {
        try {
            await this.typeGroupModel.destroy({where: data});
            await this.typeModel.destroy({where: {typegroupid: data.id}});
            return true;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 查找字典下的所有字典类型
     * @param groupId
     * @return list Array
     */
    async findDicTypeList(groupId) {
        try {
            return await this.typeModel.findAll({where: {typegroupid: groupId}})
        } catch (err) {
            return this.exceptionService.handleError(err);
        }

    }

    /**
     * 保存字典类型
     * @param data
     * @returns {Promise<*>}
     */
    async saveDicTypeInfo(data) {
        if (!data.id) {
            data.id = think.uuid('v1');
        }
        try {
            return await this.typeModel.upsert(data);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 删除字典类型
     * @param childModel
     * @param foreignKey
     */
    async delDicTypeInfo(data) {
        try {
            return await this.typeModel.destroy({where: data});
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }


}

