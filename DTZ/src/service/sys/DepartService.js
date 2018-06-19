// const uuid = require('node-uuid');

export default class extends think.Service {
    constructor() {
        super();
        this.userModel = this.db['sys_user'];
        this.orgModel = this.db['sys_org'];
        this.orgModel.hasMany(this.userModel, {
            foreignKey: 'org_id'
        })
        this.defData = {
            userid: '000000',
            roleid: '000000'
        };
    }
    /**
     * 查询部门名称列表unBindUser
     */
    async getDepartName() {
        let aj = {
            success: false,
            msg: '',
            result: {},
        };
        try {
            const data = await this.orgModel.findAll({
                attributes: ['id', 'org_name', 'org_code', 'parent_id']
            });
            aj.result = data;
            aj.success = true;
            return aj;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 保存部门信息
     * @data
     * 
     */
    async saveDepartInfo(data) {
        let aj = {
            success: false,
            msg: '',
            result: {},
        };
        aj.success = false;
        try {
            const depart = await this.orgModel.findOne({
                where: {
                    org_code: data.org_code
                },
                attributes: ['id']
            });
            // if (!data.id) {
            //     data.id = think.uuid('v1');
            // }
            if (depart) {
                if (depart.id !== data.id) {
                    aj.msg = "组织机构编码已存在，请重新输入";
                    return aj;
                }
            }
            if (!data.id) {
                const treeData = await this.TreeService.saveTree('sys_org', data.parent, data);
            } else {
                await this.orgModel.upsert(data);
            }
            aj.success = true;
            return aj;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 查询部门信息
     */
    async getDepartList() {
        let aj = {
            success: false,
            msg: '',
            result: {},
        };
        try {
            const list = await this.orgModel.findAll();
            aj.success = true;
            aj.result = list
            return aj;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 删除部门信息/单条删除
     */
    async delDepartInfo(data) {
        let aj = {
            success: false,
            msg: '',
            result: {},
        };
        const where1 = {
            org_id: data.id
        };
        const where2 = {
            id: data.id
        };
        try {
            const userCount = await this.userModel.count({
                where: where1
            });
            if (userCount > 0) {
                aj.msg = "所选部门下有用户，请先删除对应用户信息";
            } else {
                const delDepart = await this.orgModel.destroy({
                    where: where2
                });
                if (delDepart) {
                    aj.success = true;
                }
            }
            return aj;
        } catch (err) {
            return this.exceptionService.handleError(err);

        }
    }
    /*****************与用户相关****************** */
    /*****************与用户相关****************** */
    /**
     * 部门用户解绑
     */
    async unBindUser(data) {
        let aj = {
            success: false,
            msg: '',
            result: {},
        };
        const upData = {
            org_id: null
        };
        const where = {
            where: {
                id: data.userid
            }
        };
        try {
            const userRes = await this.userModel.update(upData, where);
            if (userRes) {
                aj.success = true;
            } else {
                aj.msg = "解绑错误";
            }
            return aj;
        } catch (err) {
            return this.exceptionService.handleError(err);

        }
    }

    /**
     * 获取未分配部门的用户
     */
    async getUserNotBindOrg(data) {
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        let aj = {
            success: false,
            msg: '',
            result: {},
        };
        try {
            let where = {
                id: {
                    [this.db.Sequelize.Op.not]: this.defData.userid //排除系统预设用户
                },
                [this.db.Sequelize.Op.or]: [{
                    org_id: ""
                }, {
                    org_id: null
                }]
            };
            var optJson = JSON.parse(data.options);
            if (think.isOptionNull(optJson)) {
                where.username = {
                    [this.db.Sequelize.Op.like]: '%' + optJson.username + '%'
                }
            }
            const userListRes = await this.userModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
            });
            aj.result = userListRes;
            aj.success = true;
            return aj;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 批量绑定用户到部门
     * @data
     * data.userlist --用户id数组
     * data.org_id --部门id
     */

    async saveUsersDepart(data) {
        let aj = {
            success: false,
            msg: '',
            result: {},
        };
        const upData = {
            org_id: data.org_id
        };
        const where = {
            where: {
                id: {
                    [this.db.Sequelize.Op.in]: data.userlist
                }
            }
        };
        try {
            const userRes = await this.userModel.update(upData, where);
            if (userRes) {
                aj.msg = '保存成功';
                aj.success = true;
            } else {
                aj.msg = "绑定部门错误";
            }
            return aj
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }





    /**
     * 获取部门及其用户数据
     * @param {Object} data 
     */
    async getOrgAndUser(userInfo) {
        try {
            let where = {}
            let newWhere = await this.BaseService.getDataScopeWhere(userInfo, 1);
            if (newWhere instanceof Object) {
                where = newWhere
                console.log('where:', where);
            } else {
                if (Number(newWhere) == 4) {
                    let {
                        userId
                    } = userInfo
                    where.create_by = userId
                }
            }
            // if (data.org_name) {
            //     where.org_name = {
            //         $like: '%' + data.org_name + '%'
            //     }

            // }
            const org = await this.orgModel.findAll({
                where: where,
                include: [{
                    model: this.userModel,
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
            // let list = []
            // if (org) {
            //     if (data.id) {
            //         console.log('org存在-----------')
            //         console.log(data.id);

            //         // list = this.getChild(org, data.id)
            //         list = org

            //     } else {
            //         list = org
            //     }
            // }
            return org

        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

}