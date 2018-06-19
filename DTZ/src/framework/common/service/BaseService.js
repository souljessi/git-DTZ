import assert from 'assert';
import jwt from "jsonwebtoken";
import helper from 'think-helper';

/**
 * 业务层基类
 */
class BaseService extends think.Service {
    /**
     * 角色数据范围过滤
     * tableName   (必传)当前过滤的表名
     * userInfo  (必传)用户信息
     * option 选项(可选){
     *    attributes:`field1,field2,field3`,或者['field1','field2','field3']
             page:{
                 start:0,  //第几页
                 limit:0   //每页显示多少条
             }
     * }
     * 返回false代表没有数据权限过滤
     */
    async dataScopeFilter(tableName, userInfo, option) {
        assert(typeof tableName === 'string', 'tableName must be a String');
        assert(ObjectUtils.isObject(userInfo), 'userInfo must be a Object');
        let defaultOption = {
            // attributes: `${tableName}.*`,
            attributes: '*',
            ORG_TABLE_NAME: 'sys_org',
            USER_TABLE_NAME: 'sys_user',
            // page:{
            //     start:null,
            //     limit:null
            // }
        };
        const DB = this.db;
        const model = DB[tableName];
        const orgModel = DB['sys_org'];
        assert(model, 'table does not exist');
        const {userId, orgId, roleList} = userInfo;
        const administrator = think.config('administrator');
        option = helper.extend({}, defaultOption, option);
        const ORG_TABLE_NAME = option.ORG_TABLE_NAME;
        const USER_TABLE_NAME = option.USER_TABLE_NAME;
        // if (option.attributes.includes('*')) {
        //     option.attributes = `${tableName}.*`;
        // }
        let attributes = option.attributes;
        let pageStr = '';
        if ('page' in option) {
            let start = option.page.start;
            let limit = option.page.limit;
            if (start && limit) {
                pageStr = ` limit ${(start - 1) * limit},${limit}`;
            }
        }
        // 数据范围（1：所有数据；2：所在部门及以下数据；3：所在部门数据；4：仅本人数据；）
        /**
         * 1、所有数据： 无where条件,直接返回所有数据。
         * 2、所在部门及以下数据   like当前用户所在部门的parent_ids + 当前用户的'部门id, or部门id=部门id'
         * 3、所在部门数据      =当前用户的部门id
         * 4、仅本人数据　　　　仅跟自己相关的业务数据。
         * 5、按明细设置 跨机构授权,多个角色的授权为并集的关系。
         */

            // 数据权限过滤，多个角色权限范围之间为或者关系。
        const dataScopeArry = await this.getRoleDataScope(roleList);
        if (dataScopeArry.length === 0) {
            return false;
        }
        const dataScopeNum = ArrayUtils.findArrayMin(dataScopeArry);
        let sql = 'SELECT ';
        let field = attributes;
        // let newAttr;
        if (Array.isArray(attributes)) {
            // newAttr = attributes.map((item, index, arr) => {
            //     return `${tableName}.${item}`;
            // });
            field = attributes.join();
        }
        sql += field;
        //如果是超级管理员或者数据权重为1，则跳过数据权限过滤
        if (dataScopeNum === 1 || administrator.includes(userId)) {
            sql += ` FROM ${tableName}`;
            pageStr ? sql += pageStr : sql += '';
            return this.commonService.querySql(sql)
        }

        let orgIds = null;
        let customWhereStr = '';
        //如果存在自定义授权，则先构造自定义where条件
        if (dataScopeArry.includes(5)) {
            orgIds = await this.findCustomAuthOrgIds(roleList);
            customWhereStr = ` OR org.id in(${orgIds})`

        }
        //根据表名构造表连接，用户表,机构表,业务表。
        if (tableName === USER_TABLE_NAME) {
            sql += ` FROM ${tableName} us INNER JOIN ${ORG_TABLE_NAME} org ON us.org_id = org.id`;

        } else if (tableName === ORG_TABLE_NAME) {
            sql += ` FROM ${tableName} org`;
        } else {
            sql += ` FROM ${tableName} INNER JOIN ${USER_TABLE_NAME} us ON ${tableName}.create_by = us.id INNER JOIN ${ORG_TABLE_NAME} org ON us.org_id = org.id`;
        }
        //根据数据权限构造不同的where条件
        switch (dataScopeNum) {
            case 2 ://所在部门及以下
                const object = await orgModel.findById(orgId, {
                    attributes: ['parent_ids']
                });
                const orgParentIds = object.parent_ids;
                sql += ` WHERE org.parent_ids LIKE '%${orgParentIds}${orgId},%' or org.id=${orgId}`;
                break;
            case 3 ://所在部门
                sql += ` WHERE org.id = ${orgId}`;
                break;

            case 4 ://本人数据
                if (tableName === USER_TABLE_NAME) {
                    sql += ` WHERE us.id="${userId}"`
                } else if (tableName === ORG_TABLE_NAME) {
                    sql += ` WHERE org.id="${orgId}"`
                } else {
                    sql += ` WHERE ${tableName}.create_by="${userId}"`
                    // customWhereStr ? sql = `SELECT ${field} FROM ${tableName} INNER JOIN ${USER_TABLE_NAME} us ON ${tableName}.create_by = us.id INNER JOIN ${ORG_TABLE_NAME} org ON us.org_id = org.id WHERE ${tableName}.create_by="${userId}" ${customWhereStr}` : sql = `SELECT ${field} FROM ${tableName} WHERE create_by="${userId}"`;
                }
                break;
            case 5://自定义授权
                customWhereStr = ` WHERE org.id in(${orgIds})`;
                break;
        }

        sql += customWhereStr;
        sql += pageStr;
        const list = await this.commonService.querySql(sql);
        if (pageStr) {
            return {
                rows: list,
                count: option.page.limit
            }
        }
        return list;
    }

    /**
     * 查询自定义权限的机构ids
     * @param roleList
     * @returns {Promise<string>}
     * @private
     */
    async findCustomAuthOrgIds(roleList) {
        const Op = this.db.Sequelize.Op;
        const result = await this.db['sys_role'].findAll({
            where: {id: {[Op.in]: roleList}},
            attributes: ['auth_org_ids'],
            raw: true
        });
        let arry = [];
        for (let value of result) {
            if (!think.isEmpty(value.auth_org_ids)) {
                arry = arry.concat(value.auth_org_ids.split(','));
            }
        }
        const orgIds = ArrayUtils.unique(arry).join();
        return orgIds;
    }

    /**
     * 数据过滤，返回where条件
     * 如果返回1，则在业务代码里没有where条件
     * 如果返回4,则目标表里带create_by=userid的条件
     * 否则返回正确的where条件在sys_org表里
     * @param userInfo
     * @param isOrm
     * @returns {Promise<*>}
     */
    async getDataScopeWhere(userInfo, isOrm) {
        const db = this.db;
        const Op = db.Sequelize.Op;
        const orgModel = db['sys_org'];
        const administrator = think.config('administrator');
        const {roleList, orgId} = userInfo;
        let whereObj = {};
        let whereStr = '';
        if (!think.isEmpty(roleList) && !think.isEmpty(orgId)) {
            const dataScopeNum = await this.getRoleDataScope(roleList);
            //如果是超级管理员或者数据权重为1，则跳过数据权限过滤
            if (dataScopeNum === 1 || administrator.includes(userInfo)) {
                return 1;
            }
            switch (dataScopeNum) {
                case 2:
                    const object = await orgModel.findById(orgId, {
                        attributes: ['parent_ids']
                    });
                    const orgParentIds = object.parent_ids;
                    if (isOrm) {
                        whereObj = {
                            [Op.or]: [
                                {parent_ids: {[Op.like]: `%${orgParentIds}${orgId},%`}},
                                {id: orgId}
                            ]
                        };
                        return whereObj;
                    }
                    whereStr = `WHERE sys_org.parent_ids LIKE '%${orgParentIds}${orgId},%' or sys_org.id=${orgId}`;
                    return whereStr;
                case 3:
                    if (isOrm) {
                        whereObj = {id: orgId};
                        return whereObj;
                    }
                    whereStr = `WHERE sys_org.id = ${orgId}`;
                    return whereStr;
                case 4:
                    return 4;
            }
        }
        return null;


    }

    /**
     * 扫描所有用户，根据权限标识查询有权限用户的id,
     * @returns {Array}
     */
    async getAllUserAuthByPermission(permission) {
        const allUserInfo = [];
        const queue = [];//队列人员
        const roleUserIds = await this.db['sys_role_user'].findAll({group: 'userid', attributes: ['userid']});
        for (let value of roleUserIds) {
            allUserInfo.push(await this.getUserInfo(value.userid));
        }
        for (let value of allUserInfo) {
            const authVal = value.menuList.find((item) => {
                return item.permission === permission;
            });
            if (authVal) {
                queue.push(value.id);
            }
        }
        return queue;
    }

    /**
     * 获取用户完全信息
     * @param userId
     * @returns {Promise<{Object}>}
     */
    async getUserInfo(userId) {
        assert(typeof userId === 'string' && userId, 'userId must not null && is String');
        const user = await this.db['sys_user'].findOne({
            where: {
                id: userId,
            },
            attributes: {exclude: ['password', 'del_flag']}
        });
        const role = await this.db['sys_role_user'].findAll({
            where: {
                userid: userId
            },
            attributes: ['roleid']
        });
        const roleIds = role.map((r) => {
            return r.roleid;
        });
        const menuList = await this.getRoleMenu(roleIds, userId);
        const userInfo = {...user.toJSON()};
        userInfo.roleList = roleIds;
        userInfo.menuList = menuList;
        return userInfo;
    }

    async getParentIdsByOrgId(orgId) {
        return this.db['sys_org'].findOne({where: {org_id: orgId}});
    }

    /**
     * 获取角色访问权限
     * @param roleList Array 角色ids
     * @returns {Promise<*>}
     */
    async getRoleAuth(roleList) {
        assert(Array.isArray(roleList), 'roleList type should eq "Array"');
        let roles = JSON.stringify(roleList).replace('[', '').replace(']', '');
        const sqlAuth = `SELECT mu.href FROM sys_menu mu INNER JOIN sys_role_menu rmu ON mu.id = rmu.menuid WHERE rmu.roleid in (${roles})`;
        const roleAuth = await this.commonService.querySql(sqlAuth);
        let obj = {
            href: [],
        };
        for (let value of roleAuth) {
            obj.href.push(value.href);
        }
        return obj;


    }

    async getRoleDataScope(roleList) {
        assert(Array.isArray(roleList), 'roleList type should eq "Array"');

        const roleDataScope = await this.db['sys_role'].findAll({
            where: {
                id: {
                    [this.db.Sequelize.Op.in]: roleList
                }
            },
            attributes: ['data_scope'],
            raw: true
        });
        return roleDataScope.map(item => {
            return item.data_scope;
        });
        // let roles = JSON.stringify(roleList).replace('[', '').replace(']', '');
        // let sql = `SELECT data_scope FROM sys_role WHERE id in(${roles})`;
        // const dataScopeList = await this.commonService.querySql(sql);

        // const ary = dataScopeList.map((item) => {
        //     return item.data_scope;
        // });
        // return ary;
        // if (ary.includes(5) && ary.length > 1) {
        //     return [Number(ArrayUtils.findArrayMin(ary)), 5]
        // }
        // return Number(ArrayUtils.findArrayMin(ary));

    }

    /**
     * 根据角色ids获取角色菜单列表
     * @param roleList Array  角色ids
     * @param userId  String userId
     * @returns {Promise<*>}
     */
    async getRoleMenu(roleList, userId) {
        assert(Array.isArray(roleList), 'roleList type should eq "Array"');
        assert(typeof userId === 'string', 'userId must be a String');
        const administrator = think.config('administrator');
        let roles = JSON.stringify(roleList).replace('[', '').replace(']', '');
        let sql = '';
        if (administrator.includes(userId)) {
            sql = `SELECT * FROM sys_menu WHERE menu_source=1 GROUP BY id ORDER BY menu_order`;
            // sql = `SELECT * FROM sys_menu WHERE is_show=1 AND menu_source=1`;
        } else {
            // sql = `SELECT * FROM sys_menu mu INNER JOIN sys_role_menu rmu ON mu.id = rmu.menuid WHERE rmu.roleid in (${roles}) AND is_show=1 AND menu_source=1`;
            sql = `SELECT * FROM sys_menu mu INNER JOIN sys_role_menu rmu ON mu.id = rmu.menuid WHERE rmu.roleid in (${roles}) AND menu_source=1 GROUP BY mu.id ORDER BY menu_order`;
        }


        return this.commonService.querySql(sql);
    }

    /**
     * 根据用户信息生成一个token
     * @param userInfo
     * @returns {*}token
     */
    getToken(userInfo) {
        const tokenConfig = think.config('token');
        const privateKey = tokenConfig.privateKey; // （密钥）
        const expiresIn = tokenConfig.expiresIn;
        const token = jwt.sign(userInfo, privateKey, {
            expiresIn: expiresIn // 过期时间
        });
        return token;
    }

    /**
     *  缓存角色权限
     * @param userId  用户Id     type: string
     * @param roleList 角色列表  type:array
     * @returns {Promise<void>}
     */
    // async cacheRolePermission(roleList, userId) {
    //     assert(Array.isArray(roleList), 'roleList type should eq "Array"');
    //     let roles = JSON.stringify(roleList);
    //     roles = roles.replace('[', '').replace(']', '');
    //     let sql = `SELECT mu.href, mu.permission, mu.menu_source, rl.data_scope FROM sys_menu mu INNER JOIN sys_role_menu rmu ON mu.id = rmu.menuid INNER JOIN sys_role rl ON rl.id = rmu.roleid WHERE rl.id in (${roles})`;
    //     try {
    //         let rolePermissionList = await this.commonService.querySql(sql);
    //         // console.log(rolePermissionList);
    //         if (think.redis.isReady()) {
    //             const redisCli = think.redis.client;
    //             // think.redis.client.set(`userInfo:rolePerm:${userId}`, JSON.stringify(rolePermissionList), 'EX', expiresIn);
    //             redisCli.set(`userInfo:rolePerm:${userId}`, JSON.stringify(rolePermissionList));
    //         } else {
    //             throw new Error('连接redis失败')
    //         }
    //     } catch (e) {
    //         this.exceptionService.handleError(e);
    //     }
    //
    // }


}

module.exports = BaseService;