import Jimp from 'jimp';
import assert from 'assert';

class PartsService extends think.Service {
    constructor() {
        super();
        this.cmsPartsModel = this.db['cms_parts'];
        this.cmsAreaModel = this.db['cms_area'];
        this.cmsCellModel = this.db['cms_cell'];
        this.partsGroupModel = this.db['cms_parts_group'];
        this.typeModel = this.db['sys_type']
        this.type_group_model = this.db['sys_type_group']
        this.eventModel = this.db['cms_event']
        this.attachmentModel = this.db['sys_attachment']

        // this.cmsPartsModel.belongsTo(this.cmsCellModel, {
        //     foreignKey: 'BGID',
        //     targetKey: 'BGID'
        // })
        this.cmsPartsModel.belongsTo(this.partsGroupModel, {
            foreignKey: 'group_code',
            targetKey: 'group_code'
        })
        this.cmsPartsModel.belongsTo(this.cmsAreaModel, {
            foreignKey: 'area_code',
            targetKey: 'area_code'
        })

        this.eventModel = this.db['cms_event'];
        this.eventGroupModel = this.db['cms_event_group']

    }

    /**
     * 统一的事件上报接口
     * @param data
     * @returns {Promise<void>}
     */
    async addEvent(data) {
        const Redis = think.Redis;
        const namespace = think.config('nameSpace');
        const JDSL_QUEUE = namespace.JDSL_QUEUE;
        let pushUserId = '';
        //移动端有上传的图片，则保存至附件表
        if (!think.isEmpty(data.picPath) && data.picPath.length > 0) {
            const attachmentData = data.picPath.map((item) => {
                let param = {
                    id: think.uuid('v1'),
                    create_date: new Date(),
                    businesskey: data.id,
                    realpath: item,
                    user_id: data.create_by
                };
                return param;
            });
            this.db['sys_attachment'].bulkCreate(attachmentData);

        }
        const permissionQueue = await this.BaseService.getAllUserAuthByPermission('jdsl');
        if (permissionQueue.length > 0) {
            const userQueue = await Redis.lrange(JDSL_QUEUE, 0, -1);
            //如果人员队列不存在，则加入队列
            if (userQueue.length === 0) {
                await Redis.rpush(JDSL_QUEUE, permissionQueue);
                //否则从缓存队列人员，对比数据库数据，如果不一致就更新队列，以数据库为准
            } else {
                //找出两个队列的差集
                const difference = ArrayUtils.difference(userQueue, permissionQueue);
                if (difference.length > 0) {//如果存在差集，就把其添加到队里末尾。
                    Redis.rpush(JDSL_QUEUE, difference);
                }
            }
            //对比在线用户，获取被推送的用户。
            pushUserId = await this._findPushUser('jdsl');
            //如果有人在线，则指定该用户持久化处理人。
            if (pushUserId) {
                data.process_person = pushUserId;
            }
        }
        //持久和到数据库，并绑定处理人。
        this.db['cms_event'].create(data);
        return {pushUserId: pushUserId, data: data};


    }

    async _findPushUser(permission) {
        const Redis = think.Redis;
        const namespace = think.config('nameSpace');
        const JDSL_QUEUE = namespace.JDSL_QUEUE;
        const LOGIN_USER = namespace.LOGIN_USER;
        //先获取所有人员队列
        const userQueue = await Redis.lrange(JDSL_QUEUE, 0, -1);
        const onlineUserIds = await Redis.hkeys(LOGIN_USER);
        const intersection = ArrayUtils.intersection(userQueue, onlineUserIds);
        const userId = await Redis.lpop(JDSL_QUEUE);//从链表左侧弹出一个user
        Redis.rpush(JDSL_QUEUE, userId);//将弹出的user放到链表末尾

        //如果压根没有登陆用户在队列中，则返回空，防止递归死循环
        if (intersection.length === 0) {
            return null;
            //如果符合推送条件(在线用户中有队列人员)，则返回该用户ID
        } else if (onlineUserIds.includes(userId)) {
            return userId;
        } else {
            //递归找下一个推送人员。
            return this._findPushUser(permission);
        }
    }

    //根据在线用户获取未受理的事件列表(分页)
    async getRealTimeEventList(pageSize, page) {
        try {
            const or = this.db.Sequelize.Op.or;
            const result = await this.eventModel.findAll({
                where: {},
                // limit: Number(pageSize),
                // offset: Number(page)
            });
            if (result.length === 0) {
                return null
            }
            return result


        } catch (error) {
            return this.exceptionService.handleError(error)
        }
    }


    /**
     * 获取事件信息
     * @param {Object} data
     */
    async getEvent(data) {
        const Op = this.db.Sequelize.Op;
        let where = {};
        where.status = {
            [Op.in]: [1, 3, 5, 6]
        };
        where.del_flag = 0;
        try {
            return await this.eventModel.findAll({where: where})

        } catch (error) {
            return this.exceptionService.handleError(error);

        }

    }

    /**
     * 查询全部事件列表
     */
    async allEventList(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
        let where = {
            del_flag: 0
        };
        try {
            const result = await this.eventModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    ['create_date', 'DESC'],
                    ['is_check', 'ASC']
                ]
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)
        }
    }

    /**
     * 分页查询事件列表
     * @param data
     * @returns {Promise<*>}
     */
    async eventList(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
        let where = {
            del_flag: 0,
            [Op.or]:[{process_person:null},{process_person:data.process_person}]
        };
        if (data.ObjName) {
            where.ObjName = {
                [Op.like]: '%' + data.ObjName + '%'
            }
        }
        where.status = {
            [Op.in]: [1, 3]
        };

        try {
            // const result = await this.eventModel.findAndCountAll({
            //     where: where,
            //     limit: parseInt(data.pageSize),
            //     offset: parseInt(data.start),
            //     order: [
            //         ['create_date', 'DESC'],
            //         ['is_check', 'ASC']
            //     ]
            // })
            const result = await this.eventModel.findAll({
                where: where,
                order: [
                    ['create_date', 'DESC'],
                    ['is_check', 'ASC']
                ]
            });
            let query = {
                process_person: data.process_person
            };

            const res = await this.eventModel.update(query,{where:{[Op.or]:[{process_person:null}]}});
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }
    }

    async getNewAddEvent(data) {
        const Op = this.db.Sequelize.Op;
        let where = {}
        if (data.new_date) {
            where.create_date = {
                [Op.gt]: data.new_date
            }
        }
        where.status = {
            [Op.in]: [1, 3]
        };

        try {
            let result = await this.eventModel.findAll({
                where: where,
                order: [
                    ['create_date', 'DESC'],
                    ['is_check', 'ASC']
                ]
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)
        }

    }

    async update_read_flag(data) {
        if (data.id) {
            let param = {
                read_flag: 1
            };
            let where = {
                id: data.id
            };
            try {
                return await this.eventModel.update(param, {where: where})

            } catch (error) {
                return this.exceptionService.handleError(error)

            }


        }

    }

    async eventOldList(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
        let where = {
            del_flag: 0
        }
        where.status = {
            [Op.in]: [5, 6],
        };

        try {
            const result = await this.eventModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    ['create_date', 'DESC'],
                    ['is_check', 'ASC']
                ],
            })
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }
    }

    /**
     * 按条件查询事件列表
     */
    async specificEvent(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        let where = {
            del_flag: 0
        };
        if (data.start_date && data.end_date) {
            where.create_date = {
                [Op.between]: [data.start_date, data.end_date]
            }
        }
        if (data.parent_name) {
            where.parent_name = data.parent_name
        }
        if (data.sub_name) {
            where.sub_name = data.sub_name
        }
        if (data.source) {
            where.source = data.source
        }

        if (data.remarks) {
            where.remarks = {
                [Op.like]: '%' + data.remarks + '%'
            }

        }
        where.status = {
            [Op.in]: [5, 6],
        };
        try {
            const result = await this.eventModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    ['create_date', 'DESC'],
                    ['is_check', 'ASC']
                ],
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    async allSpecificEvent(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        let where = {
            del_flag: 0
        };
        if (data.start_date && data.end_date) {
            where.create_date = {
                [Op.between]: [data.start_date, data.end_date]
            }
        }
        if (data.parent_name) {
            where.parent_name = data.parent_name
        }
        if (data.sub_name) {
            where.sub_name = data.sub_name
        }
        if (data.source) {
            where.source = data.source
        }

        if (data.remarks) {
            where.remarks = {
                [Op.like]: '%' + data.remarks + '%'
            }

        }
        try {
            const result = await this.eventModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    ['create_date', 'DESC'],
                    ['is_check', 'ASC']
                ],
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    async EventGroup(data) {
        try {

            return await this.eventGroupModel.findAll()

        } catch (error) {
            return this.exceptionService.handleError(error)
        }

    }

    /**
     * 查询事件大类
     */
    async parentEvent(data) {
        try {
            let where = {
                parent_id: 0
            };

            return await this.eventGroupModel.findAll({where: where})

        } catch (error) {
            return this.exceptionService.handleError(error)
        }

    }

    /**
     * 事件作废
     */
    async eventDone(data) {
        try {
            let query = {
                is_check: 4,
                status: 6
            };
            let where = {
                id: data.id

            };
            return await this.eventModel.update(query, {where: where})
        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    async deleteEvent(data) {
        const Op = this.db.Sequelize.Op;
        let query = {
            del_flag: 1
        };
        let where = {};

        if (typeof (data.id) === 'string') { //单条删除
            where = {
                id: data.id
            };
        } else { //批量删除
            where = {
                id: {
                    [Op.in]: data.id
                }
            };
        }
        try {
            return await this.eventModel.update(query, {where: where})
        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    /**
     * 按事件大类id查询小类
     */
    async childrenEvent(data) {
        try {
            let where = {
                parent_id: data.parent_id
            };
            return await this.eventGroupModel.findAll({where: where})
        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    //获取字典表里的事件来源
    async eventSource() {
        let where = {
            typegroupcode: 'sjly'
        };
        try {

            const type_id = await this.type_group_model.findOne({where: where});
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

    //获取字典表里的事件状态

    async eventState() {
        let where = {
            typegroupcode: 'sjzt'
        };
        try {
            const type_id = await this.type_group_model.findOne({where: where});
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

    /**
     * 添加BGID
     */
    async eventBGID(data) {
        try {
            let query = {
                BGID: data.BGID
            };
            let where = {
                id: data.id
            };

            return await this.eventModel.update(query, {where: where})
        } catch (error) {
            return this.exceptionService.handleError(error);
        }

    }


    /**
     * 事件上报图片
     */
    async eventPic(data) {
        try {
            let query = {
                businesskey: data.id
            };
            return await this.attachmentModel.findAll({where: query})

        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }


}


export default PartsService;