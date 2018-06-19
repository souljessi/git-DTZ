export default class extends think.Service {
    constructor() {
        super();
        const db = this.db;
        this.userModel = db['sys_user'];
        this.roleUserModel = db['sys_role_user'];
        this.roleModel = db['sys_role'];
        this.roleMenuModel = db['sys_role_menu'];
        this.menuModel = db['sys_menu'];
        this.defData = {
            userid:'000000',
            roleid: '000000'
        };
        this.userModel.hasMany(this.roleUserModel,{foreignKey:'userid',targetKey: 'id'});
    }

    /**
     * 获取部门列表
     * @param {*} data 
     */
    async getOrgByRole(data){
        const Op = this.db.Sequelize.Op;
        try{
            return await this.db['sys_org'].findAll({
                where:{
                    id:{
                        [Op.in]:data.orgids
                    }
                },
                attributes:['id','org_name','org_code']
            });
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 查询角色列表
     */
    async getRoleList(data){
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page)-1)*parseInt(data.pageSize);        
        let where = {id:{[Op.not]:this.defData.roleid}};
        if(data.rolename){
            where.rolename = {
                [Op.like]:'%'+data.rolename+'%'
            };
        }
        try{
            return await this.roleModel.findAndCountAll({
                where:where,
                limit:parseInt(data.pageSize),
                offset:parseInt(data.start)
            });
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 删除角色信息
     * @data1 Object
     * data1.id --角色id String
     * @data2 Object
     * data2.update_date --更新时间 datetime
     * data2.update_by --更新人 String
     */
    async delSysRoleInfo(data1) {
        const where = {id:data1.id};
        // const where2 = {roleid:data1.id};
        try{
            if(data1.id===this.defData.roleid){
                return {msg:'系统角色不能删除'};
            }else{
                return await this.roleModel.destroy({where:where});
                // const roleUserCount = await this.roleUserModel.count({where:where2});
                // if(roleUserCount>0){
                //     return {msg:'所选角色已绑定用户，请先删除对应用户信息'};
                // }else{
                //     const delRole = await this.roleModel.update(data2,{where:where});
                //     if(delRole){
                //         return true;
                //     }else{
                //         return {msg:"角色信息删除错误"};
                //     }
                // }
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 保存角色信息
     * data --保存字段
     * oldList -- 原部门数组
     * newList --新部门数组
     */
    async saveRoleInfo(data,oldList,newList){
        const Op = this.db.Sequelize.Op;
        try{
            const oldRole = await this.roleModel.findOne({
                where:{[Op.or]:{rolename:data.rolename,rolecode:data.rolecode}},
                attributes:['id']
            });
            if(data.id){
                if(oldRole&&oldRole.id!==data.id){
                    return false;
                }else{
                    return await this.roleModel.update(data,{where:{id:data.id}})
                }
            }else{
                if(oldRole){
                    return false;
                }else{
                    data.id = think.uuid('v1');
                    return await this.roleModel.create(data);
                }
            }

        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 查询角色名称列表
     */
    async getRoleNames() {
        const Op = this.db.Sequelize.Op;
        try{
            return await this.roleModel.findAll({where:{id:{[Op.not]:this.defData.roleid}}});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    
    /*****************角色用户相关 begin*****************/

    /**
     * 根据用户id获取角色列表
     * @data
     * data.userid --用户id
     * 
     * @return
     * 
     */
    async getRoleByUser(data) {
        const where = {
            userid:data.userid
        };
        try{
            return await this.roleUserModel.findAll({where:where,attributes:[['roleid','id']]});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 删除当前用户与当前角色绑定关系
     */
    async delUserRole(data) {
        try{
            return await this.roleUserModel.destroy({where:data});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 按角色分页查询用户列表
     */
    async getUsersByRole(data){
        data.start = (parseInt(data.page)-1)*parseInt(data.pageSize);
        const optJson = JSON.parse(data.options);
        const Op = this.db.Sequelize.Op;
        let where = {
            del_flag:0,
            id:{
                [Op.not]:this.defData.userid//不显示系统用户
            }
        };
        if(optJson.username){
            where.username = {
                [Op.like]:'%'+optJson.username+'%'
            };
        }
        if(optJson.realname){
            where.realname = {
                [Op.like]:'%'+optJson.realname+'%'
            };
        }
        try{
            const userIds = await this.userModel.findAndCountAll({
                where:where,
                limit:parseInt(data.pageSize),
                offset:parseInt(data.start),
                include:[
                    {model:this.roleUserModel,where:{roleid:data.roleid}}
                ]
            });
            return userIds;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 未绑定当前角色的用户列表分页查询
     */
    async getUsersNotBindRole(data){
        let where = {del_flag:0};
        let userids = [];
        const optJson = JSON.parse(data.options);
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page)-1)*parseInt(data.pageSize);
        if(optJson.username){
            where.username = {
                [Op.like]:'%'+optJson.username+'%'
               
            };
        }
        if(optJson.realname){
            where.realname = {
                [Op.like]:'%'+optJson.realname+'%'
            };
        }
      
        try{
            const list = await this.roleUserModel.findAll({
                where:{roleid:data.roleid},
                attributes:['userid']
            });
            userids = list.map((item)=>{
                return item.userid;
            })
            userids.push(this.defData.userid);
            where.id = {[Op.notIn]:userids};
            const list2 = await this.userModel.findAndCountAll({
                where:where,
                limit:parseInt(data.pageSize),
                offset:parseInt(data.start)
            });
            return list2;
        }catch(err){
            return this.exceptionService.handleError(err);
        }

    }
    /**
     * 保存用户角色绑定
     */
    async saveUserRole(data){
        const upData = data.userList.map((item)=>{
            const param = {
                id:think.uuid('v1'),
                roleid:data.roleid,
                userid:item
            }
            return param;
        });
        try{
            return await this.roleUserModel.bulkCreate(upData);
        }catch(err){
            return this.exceptionService.handleError(err);
        }

    }

    /************角色菜单 begin*********** */

    /**
     * 根据角色获取菜单权限
     */
    async getRoleMenu(data) {
        try{
            return await this.roleMenuModel.findAll({
                where:data,
                attributes:[['menuid','id']]
            });
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 保存角色菜单权限关联记录
     */
    async saveRoleMenu(data) {
        const Op = this.db.Sequelize.Op;
        try{
            if(data.delList.length>0){
                const del = await this.roleMenuModel.destroy({
                    where:{
                        roleid:data.roleid,
                        menuid:{
                            [Op.in]:data.delList
                        }
                    }
                });
            }
            if(data.addList.length>0){
                data.addList =  data.addList.map((item)=>{
                    const params = {
                        id:think.uuid('v1'),
                        roleid:data.roleid,
                        menuid:item
                    };
                    return params;
                })
                await this.roleMenuModel.bulkCreate(data.addList);
            }
            return true;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 按分配角色获取所有菜单项
     * @data --Array 角色id数组
     * @return --Array 菜单列表
     * 
     */
    
    async getUserRoleMenu(data) {
        const roleList = data;
        const Op = this.db.Sequelize.Op;
        let arr = [];
        let list = [];
        try{
            const menuIds = await this.roleMenuModel.findAll({
                where:{
                    roleid:{
                        [Op.in]:roleList
                    }
                },
                attributes:['menuid']
            });
            if(menuIds.length>0){
                for(var i=0;i<menuIds.length;i++){
                    arr.push(menuIds[i].menuid);
                }
                let childs = await this.menuModel.findAll({
                    where:{
                        id:{
                            [Op.in]:arr
                        },
                        menu_source:1,
                        is_show:1
                    },
                    attributes:['id']
                });
                if(childs.length>0){
                    childs = childs.map((m)=>{
                        return m.id;
                    });
                    const allIds =await this.getParent(childs);
                    if(!allIds.error){
                        const allMenu = await this.menuModel.findAll({
                            where:{
                                id:{
                                    [Op.in]:allIds
                                },
                                menu_source:1,
                                is_show:1
                            },
                            order:[
                                ['menu_order']
                            ]
                        })
                        list = allMenu;
                    }
                }
            }
            return list;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 向父级递归查询所有菜单id
     */
    async getParent(idArr){
        let arr = idArr;
        const Op = this.db.Sequelize.Op;  
        const getList = async (childArr)=> {
            const where = {
                id: {
                    [Op.in]: childArr
                },
                parent_id:{
                    [Op.notIn]:childArr
                }
            };
            try {
                const parentids = await this.menuModel.findAll({
                    where: where,
                    attributes: ['parent_id']
                })                
                if (parentids && parentids.length > 0) {
                    let parentid = [];
                    for (let i = 0; i < parentids.length; i++) {
                        arr.push(parentids[i].parent_id);
                        parentid.push(parentids[i].parent_id);
                    }
                    return await getList(parentid);
                } else {
                    return arr;
                }
            } catch (err) {
                return this.exceptionService.handleError(err);
            }
    
        };
        return await getList(idArr);
    }

    /**
     * 获取所有菜单项
     * @return --Array 菜单列表
     * 
    */
    async getAllMenu(){
        try{
            return this.menuModel.findAll();
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /************角色菜单 end************* */
}

