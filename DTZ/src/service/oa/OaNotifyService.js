export default class extends think.Service {
    constructor() {
        super();
        this.oaNotifyModel = this.db['oa_notify'];
        this.oaNotifyRecordModel = this.db['oa_notify_record'];
        this.userModel = this.db['sys_user'];
        this.orgModel = this.db['sys_org'];
        this.attachmentModel = this.db['sys_attachment'];
        this.eventModel = this.db['cms_event'];
        this.areaCodeModel = this.db['cms_area'];
        this.weChatUserModel = this.db['wechat_user']

        this.typeModel = this.db['sys_type']
        this.type_group_model = this.db['sys_type_group']
        this.pushServerUrl = think.config('pushServerUrl')

    }

    //查询公告列表
    async oaNotifyList(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        let where = {
            del_flag: '0'
        };
        if (data.title) {
            where.title = {
                [Op.like]: '%' + data.title + '%'
            }

        }
        try {
            return await this.oaNotifyModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    ['create_date', 'DESC']
                ],
            });


        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    async userIdOaNotifyList(data) {
        const Op = this.db.Sequelize.Op;

        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        let where = {
            user_id: data.user_id
        };
        if (data.title) {
            where.title = {
                [Op.like]: '%' + data.title + '%'
            }
        }
        try {
            const result = await this.oaNotifyRecordModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start)
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    async getNotifyList(data) {
        console.log('707070707', data)
        let start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        let size = parseInt(data.pageSize);

        try {
            let sql;
            if (data.title) {
                sql = `SELECT a.user_id, a.read_flag, b.id, b.type, b.title, b.content, b.files, b.status, b.create_by, 
            b.create_date, b.update_by, b.update_date, b.remarks, c.username FROM oa_notify_record AS a 
            LEFT OUTER JOIN oa_notify AS b ON a.oa_notify_id = b.id 
            LEFT OUTER JOIN sys_user AS c ON c.id = b.create_by 
            WHERE b.del_flag = 0 AND a.user_id = '${data.user_id}' AND b.title LIKE '%${data.title}%'
            ORDER BY b.create_date DESC LIMIT ${start}, ${size}`;

            } else {
                sql = `SELECT a.user_id, a.read_flag, b.id, b.type, b.title, b.content, b.files, b.status, b.create_by, 
            b.create_date, b.update_by, b.update_date, b.remarks, c.username FROM oa_notify_record AS a 
            LEFT OUTER JOIN oa_notify AS b ON a.oa_notify_id = b.id 
            LEFT OUTER JOIN sys_user AS c ON c.id = b.create_by 
            WHERE b.del_flag = 0 AND a.user_id = '${data.user_id}' 
            ORDER BY b.create_date DESC LIMIT ${start}, ${size}`;
            }

            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }

    }

    async getNotifyListCount(data) {
        try {
            let sql;

            console.log("105105", data)
            if (data.title) {
                sql = `SELECT a.user_id, a.read_flag, b.id, b.type, b.title, b.content, b.files, b.status, b.create_by, 
            b.create_date, b.update_by, b.update_date, b.remarks, c.username FROM oa_notify_record AS a 
            LEFT OUTER JOIN oa_notify AS b ON a.oa_notify_id = b.id 
            LEFT OUTER JOIN sys_user AS c ON c.id = b.create_by 
            WHERE b.del_flag = 0 AND a.user_id = '${data.user_id}' AND b.title LIKE '%${data.title}%'
            ORDER BY b.create_date DESC`;

            } else {
                sql = `SELECT a.user_id, a.read_flag, b.id, b.type, b.title, b.content, b.files, b.status, b.create_by, 
            b.create_date, b.update_by, b.update_date, b.remarks, c.username FROM oa_notify_record AS a 
            LEFT OUTER JOIN oa_notify AS b ON a.oa_notify_id = b.id 
            LEFT OUTER JOIN sys_user AS c ON c.id = b.create_by 
            WHERE b.del_flag = 0 AND a.user_id = '${data.user_id}' 
            ORDER BY b.create_date DESC`;
            }
            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    async getAllNotifyList(data) {

        try {

            const sql = `SELECT a.user_id, a.read_flag, b.id, b.type, b.title, b.content, b.files, b.status, b.create_by, 
            b.create_date, b.update_by, b.update_date, b.remarks, c.username FROM oa_notify_record AS a 
            LEFT OUTER JOIN oa_notify AS b ON a.oa_notify_id = b.id 
            LEFT OUTER JOIN sys_user AS c ON c.id = b.create_by 
            WHERE b.del_flag = 0 AND a.user_id = '${data.user_id}' 
            ORDER BY b.create_date DESC`

            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }

    }
    async notifyTypes(){
        let where = {
            typegroupcode: 'tzlx'
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
            let readed = await this.oaNotifyRecordModel.update(param,{where: notify_id});
            let res =  await this.oaNotifyModel.findOne({where: where});
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
    async allUserIdOaNotifyList(data) {

        let where = {
            user_id: data.user_id
        };

        try {
            const result = await this.oaNotifyRecordModel.findAll({
                where: where,
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    async notifyIdOaNotifyList(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);

        let where = {
            oa_notify_id: data.oa_notify_id
        };
        console.log('44444666', where)
        try {
            const result = await this.oaNotifyRecordModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start)
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }
    }


    async allNotifyIdOaNotifyList(data) {


        let where = {
            oa_notify_id: data.oa_notify_id
        };

        try {
            const result = await this.oaNotifyRecordModel.findAll({
                where: where,
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }
    }

    async notify(data) {
        const Op = this.db.Sequelize.Op;
        let where = {
            id: data.params.oa_notify_id,
        };
        if (data.params.title) {
            where.title = {
                [Op.like]: '%' + data.params.title + '%'
            }
        }
        console.log('117', where);
        try {
            return await this.oaNotifyModel.findOne({
                where: where
            })
        } catch (error) {
            return this.exceptionService.handleError(error);
        }

    }
    //获取用户列表
    async getUserList() {
        try {
            return await this.userModel.findAll()
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
    //获取微信用户列表
    async getWeChatUserList() {
        try {
            return await this.weChatUserModel.findAll();
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    //保存文件（多文件)
    async saveFile(data) {
        try {
            let params = {
                id: think.uuid('v1'),
                user_id: data.id,
                realpath: data.realpath,
                create_date: new Date(),
                businesskey: data.id,
                file_name: '通知通告',

            };
            return await this.attachmentModel.create(params)
        } catch (error) {
            return this.exceptionService.handleError(error);
        }

    }

    //新增通知
    async oaNotifyAdd(data) {

        console.log('255255', data);
        try {

            data.id = think.uuid('v1');
            let result = await this.oaNotifyModel.create(data);
            if (!result.error) {
                return await this.oaNotifyModel.findOne({
                    where: {
                        id: data.id
                    }
                })
            }

        } catch (error) {
            return this.exceptionService.handleError(error);

        }
    }
    // 发送通知
    async sendOaNotify(data) {

        try {
            if (data.user_id.length > 0) {
                let flag;
                for (let item of data.user_id) {

                    let res = {
                        id: think.uuid('v1'),
                        oa_notify_id: data.notify.id,
                        user_id: item,
                    };
                    flag = await this.oaNotifyRecordModel.create(res)

                }
                if (!flag.error) {
                    let param = {
                        status: '1'
                    };

                    let updateResult = await this.oaNotifyModel.update(param, {
                        where: {
                            id: data.notify.id
                        }
                    });


                    //向移动端发送通知
                    var axios = require("axios");
                    var url = this.pushServerUrl;
                    var pushData = {
                        targets: data.user_id,
                        sender: data.notify.id,
                        title: data.notify.title,
                        type: 12,
                        objectName: 'RC:TxtMsg',
                        content: data.notify.remarks,
                        customData: {
                            id: data.notify.id,
                            title: data.notify.title,
                        }
                    };
                    var postData = {
                        data: JSON.stringify(pushData)
                    };

                    axios.post(url, postData).then(function (ret) {
                        console.log('111');
                    }).catch(function (err) {
                        console.log(err);
                    });

                    return updateResult

                }
            }

        } catch (error) {
            return this.exceptionService.handleError(error);

        }

    }
    //发送派遣核实消息
    async sendMsgNotify(data) {
        try {
            console.log('390',data);
            if (data.user_id.length > 0) {
                let query = {
                    verify_by: data.user_id,
                    status: 2,
                    update_by: data.msg.sys_id,
                    update_date: new Date()
                };
                let where = {
                    id: data.msg.id,
                };

                let flag = await this.eventModel.update(query, {
                    where: where
                });
                let area = {
                    area_code: data.msg.area_code
                };

                let areaCode = await this.areaCodeModel.findOne({
                    where: area
                });
                let cont = ''
                if(areaCode && areaCode.area_name){
                    cont = '[' + data.msg.parent_name + ']' + ' ' + areaCode.area_name + ',' + data.msg.remarks;
                } else {
                    cont = '[' + data.msg.parent_name + ']' + data.msg.remarks;
                }



                if (!flag.error) {
                    let axios = require('axios');
                    let url = this.pushServerUrl;
                    console.log('182', data.user_id);
                    let arr = [];
                    arr.push(data.user_id);

                    var pushData = {
                        targets: arr, //目标用户ID数组
                        sender: data.msg.sys_id, //发送者ID，系统消息可以为空
                        title: data.msg.parent_name + ' 待您核实', //手机端通知栏的标题
                        type: 11, //消息类型
                        objectName: 'RC:TxtMsg', //文字类型
                        content: cont, //消息内容（140字符以内）
                        customData: { //自定义业务数据
                            label: 1101, //待审核事件
                            id: data.msg.id, //业务ID – 待办事件ID
                            title: data.msg.parent_name + ' 待您核实',
                            sender_id: data.msg.sys_id,
                            type: 11
                        }
                    };

                    var postData = {
                        data: JSON.stringify(pushData)
                    }

                    axios.post(url, postData).then(function (ret) {
                        console.log('不对吗')
                    }).catch(function (err) {
                        console.log(err);
                    })

                    return flag
                }

            }

        } catch (error) {
            return this.exceptionService.handleError(error);

        }

    }

    //删除通知
    async delOaNotify(data) {
        try {
            if (data.id) {
                let where = {
                    id: data.id
                }
                let param = {
                    del_flag: '1'
                }
                let res = await this.oaNotifyRecordModel.destroy({
                    where: where
                });
                if (!res.error) {
                    return await this.oaNotifyModel.update(param, {
                        where: where
                    })
                }


            }

        } catch (error) {
            return this.exceptionService.handleError(error);

        }

    }
    //修改状态
    async updateOaNotify(data) {

        try {
            if (data.id) {
                let where = {
                    oa_notify_id: data.id,
                    user_id: data.user_id
                }
                let param = {
                    read_flag: 1,
                    read_date: new Date()
                }
                return await this.oaNotifyRecordModel.update(param, {
                    where: where
                })
            }

        } catch (error) {
            return this.exceptionService.handleError(error);

        }

    }

    async getOrgAndUser(data) {
        try {
            let where = {}
            if (data.org_name) {
                where = {
                    org_name: {
                        $like: '%' + data.org_name + '%'
                    }
                }

            }
            const org = await this.orgModel.findAll({
                where: where,
                include: [{
                    association: this.orgModel.hasMany(this.userModel, {
                        foreignKey: 'org_id'
                    }),
                    where: {
                        del_flag: 0,
                    },
                    attributes: ['id', 'realname', 'org_id', 'phone'],
                    required: false
                }],
                order: [
                    ['org_code', 'ASC']
                ]
            })
            let list = []
            if (org) {
                if (data.id) {
                    console.log('org存在-----------')
                    console.log(data.id);

                    list = this.getChild(org, data.id)


                } else {
                    list = org
                }
            }
            return list

        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    async updateNotifyRecord(data) {
        try {
            if (data.id) {
                let where = {
                    oa_notify_id: data.id
                }
                let param = {
                    read_flag: 1,
                    read_date: new Date()
                }
                return await this.oaNotifyRecordModel.update(param, {
                    where: where
                })
            }

        } catch (error) {
            return this.exceptionService.handleError(error);

        }
    }

    getChild(arr, id) {
        var temp = []
        let lev = 0

        for (let item of arr) {
            if (item.id ==id) {
                temp.push(item)
            }

        }

        var forFn = function (arr, id, lev) {
            for (let item of arr) {

                if (item.parent_id ==id) {
                    item.lev = lev;
                    temp.push(item);
                    forFn(arr, item.id, lev + 1);
                }
            }

        }
        forFn(arr, id, lev)
        return temp

    }
}