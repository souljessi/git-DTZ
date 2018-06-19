export default class extends think.Service {
    constructor() {
        super();
        const db = this.db;
        this.userModel = db['sys_user'];
        this.orgModel = db['sys_org'];
        this.roleUserModel = db['sys_role_user'];
        this.defData = {
            userid: '000000',
            roleid: '000000'
        };
        this.userModel.belongsTo(this.orgModel, {
            foreignKey: 'org_id',
            targetKey: 'id'
        });
    }

    /**
     * 获取用户个人资料
     * by userid
     */
    async getUserInfo(data) {
        try {
            const condition = `select a.*,b.org_name,c.realname as create_name,
                DATE_FORMAT(a.create_date,'%Y-%m-%d %H:%i') as createdate from sys_user a 
                left join sys_org b on b.id = a.org_id 
                left join sys_user c on c.id = a.create_by 
                where a.id='${data.id}'`
            return await this.commonService.querySql(condition);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 查询用户信息
     * @data
     * departid --部门id
     * username --用户名
     * realname --真实姓名
     * --------以上为条件查询--------
     * options --分页查询条件
     * options.page --页码 0开始
     * opations.pageSize --单页记录数
     * @return
     * flag --标识
     * count --记录总数
     * rows --当前页数据
     */
    async getUserList(data) {
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        const optJson = JSON.parse(data.options);
        const Op = this.db.Sequelize.Op;
        let where = {
            del_flag: 0,
            id: {
                [Op.not]: '000000'
            }
        };
        if (think.isOptionNull(optJson)) {
            if (optJson.org_id.length > 0) {
                where.org_id = {
                    [Op.in]: optJson.org_id
                }
            }
            if (optJson.username) {
                where.username = {
                    [Op.like]: '%' + optJson.username + '%'
                }
            }
            if (optJson.realname) {
                where.realname = {
                    [Op.like]: '%' + optJson.realname + '%'
                }
            }
            if (optJson.phone) {
                where.phone = {
                    [Op.like]: '%' + optJson.phone + '%'
                }
            }
            if (optJson.status) {
                where.status = optJson.status;
            }
        }
        try {
            const condition = {
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                include: [{
                    model: this.orgModel,
                    attributes: ['org_name']
                }],
                order: [
                    ['last_login_time', 'desc']
                ]
            };
            return await this.userModel.findAndCountAll(condition);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 保存用户信息 新增|编辑
     * @data 用户信息
     * @returns Boolean
     */
    async saveUserInfo(data) {
        const Op = this.db.Sequelize.Op;
        try {
            const oldUser = await this.userModel.findOne({
                where: {
                    [Op.or]:{
                        username: data.username,
                        phone:data.phone
                    }
                },
                attributes: ['id', 'username','phone']
            });
            if (data.id) {
                if (oldUser && oldUser.id !== data.id) {
                    return false;
                } else {
                    return await this.userModel.update(data, {
                        where: {
                            id: data.id
                        }
                    });
                }
            } else {
                if (oldUser) {
                    return false;
                } else {
                    data.id = think.uuid('v1');
                    data.login_flag = 1; //默认激活
                    return await this.userModel.create(data);
                }
            }

        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 获取用户名列表
     */
    async getUserName() {
        const Op = this.db.Sequelize.Op;
        try {
            const user = await this.userModel.findAll({
                where: {
                    id: {
                        [Op.not]: this.defData.userid
                    }
                },
                attributes: ['id', 'username', 'realname']
            });
            return user;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    async getUserInfoById(data) {
        try {
            const user = await this.userModel.findOne({
                where: {
                    id: data.id,

                },
                attributes: ['id', 'realname', 'pic_path']
            });
            return user;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    async getUserInfoByIds(data) {
        try {
            const Op = this.db.Sequelize.Op;
            const user = await this.userModel.findAll({
                where: {
                    id: {
                        [Op.in]: data.ids
                    }

                },
                attributes: ['id', ['realname', 'name']]
            });
            return user;
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
    /**
     * 删除用户信息
     * @data
     * data.id --删除用户id
     */
    async delUserInfo(data) {
        const Op = this.db.Sequelize.Op;
        // const userid = this.defData.userid; //系统用户id,现在写死的
        let where = {};
        try {
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
            await this.userModel.update({
                del_flag: 1
            }, {
                where: where
            });
            return true;
            // if (data.id === userid) {
            //     flag = false;
            // } else {
            //     await this.userModel.update({del_flag:1},{
            //         where: {
            //             id: data.id
            //         }
            //     });
            //     // await this.roleUserModel.destroy({
            //     //     where: {
            //     //         userid: data.id
            //     //     }
            //     // });
            //     // await this.userModel.destroy({
            //     //     where: {
            //     //         id: data.id
            //     //     }
            //     // });
            // }
            // return flag;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 验证旧密码
     * @data
     * data.username --用户名
     * data.password --用户密码 明文
     */
    async checkPsd(data) {
        data.password = think.irreversibleEncrypt(data.username, data.password);
        let flag = true;
        try {
            const count = await this.userModel.count({
                where: data
            });
            if (count === 0) {
                flag = false;
            }
            return flag;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**********************用户管理页面与角色相关********************************* */
    /**
     * 保存用户角色关联
     */
    async saveRoleUser(data) {
        const Op = this.db.Sequelize.Op;
        let flag1 = true;
        let flag2 = true;
        try {
            if (data.delList.length > 0) {
                const delRole = await this.roleUserModel.destroy({
                    where: {
                        userid: data.userid,
                        roleid: {
                            [Op.in]: data.delList
                        }
                    }
                });
                if (!delRole) {
                    flag1 = false;
                }
            }
            if (data.addList.length > 0) {
                const addList = data.addList
                const dataArr = addList.map((d) => {
                    const params = {
                        id: think.uuid('v1'),
                        userid: data.userid,
                        roleid: d
                    };
                    return params;
                });
                const addRole = await this.roleUserModel.bulkCreate(dataArr);
                if (!addRole) {
                    flag2 = false;
                }
            }
            if (flag1 && flag2) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

}