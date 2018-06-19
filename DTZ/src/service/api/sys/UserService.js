import Jimp from 'jimp';
import path from 'path';
import fs from 'fs';
const unlink = think.promisify(fs.unlink, fs);

export default class extends think.Service {
    constructor() {
        super();
        const db = this.db;
        this.userModel = db['sys_user'];
        this.orgModel = db['sys_org'];
        this.roleUserModel = db['sys_role_user'];
        this.menuModel = db['sys_menu'];
        this.roleMenuModel = db['sys_role_menu'];
        this.roleModel = db['sys_role'];
        this.serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
       
        this.userModel.belongsToMany(this.roleModel, {
            through:this.roleUserModel,foreignKey:'userid',otherKey:'roleid'
        })

    }
    /**
     * 移动端登录
     * @data
     * data.phone --电话号码
     * data.password --密码
     * 
     * @return
     *result --用户信息 Object
     */
    async isLogin(data1,data2) {
        const upfileds = data2;
        // data1.password = think.irreversibleEncrypt(data1.username,data1.password);//加密
        try{
            if(this.isPoneAvailable(data1.username)){
                const appUser = await this.userModel.findOne({where:{phone:data1.username},attributes:['username']});
                if(appUser){
                    data1.username = appUser.username;
                }
            }
            data1.password = think.irreversibleEncrypt(data1.username,data1.password);//加密
            const UserInfo = await this.userModel.findOne({
                where:data1,
                attributes:['id','username','password','realname','job_no','org_id','status','pic_path','gender','phone','email','user_type']
            });
            if(UserInfo){
                if(UserInfo.login_flag==='0'){
                    return {msg:'该账号已被锁定，请联系管理员'};
                }else{
                    let role = await this.roleUserModel.findAll({where:{userid:UserInfo.id},attributes:['roleid']});
                    if(role.length===0){
                        return {msg:'该账号未分配权限，请联系管理员'};
                    }else{
                        await this.userModel.update(upfileds,{where:data1});
                        role = role.map((r)=>{
                            return r.roleid;
                        })
                        UserInfo.dataValues.org_name = "无";
                        if(UserInfo.pic_path){
                            UserInfo.dataValues.pic_path = this.serverIP+'/'+UserInfo.pic_path;
                        }else{
                            UserInfo.dataValues.pic_path = this.serverIP+'/static/upload/images/default.png';
                        }
                        const org = await this.orgModel.findOne({attributes:['org_name'],where:{id:UserInfo.org_id}});
                        if(org){
                            UserInfo.dataValues.org_name = org.org_name
                        }
                        const menuList = await this.getMenu(role);
                        if(!menuList.error){
                            UserInfo.dataValues.menu = menuList;

                             //把用户所有登陆信息缓存
                            const nameSpace = think.config('nameSpace');
                            
                            //移动端用户登录不缓存至redis
                            // think.Redis.hset(nameSpace.LOGIN_USER, UserInfo.id, JSON.stringify(UserInfo));
                            const tokenContent = {
                                userId: UserInfo.id,
                                realName: UserInfo.realname,
                                orgId: UserInfo.org_id,
                                roleList:role
                            };
                            //获取token
                            const token = this.BaseService.getToken(tokenContent);

                            return {UserInfo, token};
                        }else{
                            return {msg:'获取权限配置失败'};
                        }
                        
                    }
                }
            }else{
                return {msg:"用户名或密码输入错误"};
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    //判断是否为手机号  
    isPoneAvailable(pone) {  
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;  
        if (!myreg.test(pone)) {  
            return false;  
        } else {  
            return true;  
        }  
    } 

    /**
     * 获取角色绑定的所有菜单列表
     * roleList --Array 角色id数组
     */
    async getMenu(roleList){
        const Op = this.db.Sequelize.Op;
        let list = [];
        try{
            let menuIds = await this.roleMenuModel.findAll({
                where:{
                    roleid:{
                        [Op.in]:roleList
                    }
                },
                attributes:['menuid']
            });
            if(menuIds.length>0){
                menuIds = menuIds.map((item)=>{
                    return item.menuid
                })
                menuIds = ArrayUtils.unique(menuIds);//去重
                let menus = await this.menuModel.findAll({//只要移动端菜单
                    where:{
                        id:{
                            [Op.in]:menuIds
                        },
                        menu_source:2
                    },
                    attributes:['id']
                })
                if(menus.length>0){
                    list = menus.map((item2)=>{
                        return item2.id
                    })
                }
            }
            return list;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }


    /**
     * 
     * @param {*修改用户信息} 
     * data 更新内容
     * userid 用户id
     */
    async saveUserInfo(data,userid){
        let upfileds = data;
        upfileds.update_by = userid;
        upfileds.update_date = new Date();
        try{
            return await this.userModel.update(upfileds,{where:{id:userid}});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 修改密码
     * @data
     * data.UserID --用户id
     * data.OldPsd -- 旧密码
     * data.NewPsd -- 新密码
     */
    async changePsd(data){
        const where = {id:data.UserID};
        try{
            const user = await this.userModel.findOne({where:where,attributes:['username','password']});
            if(user){
                const oldPass = think.irreversibleEncrypt(user.username,data.OldPsd);//加密
                if(oldPass===user.password){
                    const upfileds = {
                        password:think.irreversibleEncrypt(user.username,data.NewPsd),
                        update_by:data.UserID,
                        update_date:new Date()
                    }
                    return await this.userModel.update(upfileds,{where:where});
                }else{
                    return {msg:'旧密码输入错误'};
                }
            }else{
                return {msg:'查询不到当前用户信息'};
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 获取用户详细信息
     */
    async getUserInfo(data){
        const where = {id:data.UserID};
        try{
            let user = await this.userModel.findOne({
                where:where,
                attributes:{exclude:['create_by','create_date','update_by','update_date','is_login','del_flag','login_ip']},
                include:[
                    {model:this.roleModel,attributes:['rolename']}
                ]
            });
            if(user){
                if(user.org_id){
                    const org = await this.orgModel.findOne({where:{id:user.org_id},attributes:['org_name']});
                    if(org){
                        user.dataValues.org_name = org.org_name;
                    }else{
                        user.dataValues.org_name = '无';
                    }
                }else{
                    user.dataValues.org_name = '无';
                }

                if(user.pic_path){
                    user.dataValues.pic_path = this.serverIP+'/'+user.pic_path;
                }else{
                    user.dataValues.pic_path = this.serverIP+'/static/upload/images/default.png'; 
                }
                return user;
            }else{
                return {msg:'查询不到当前用户信息'};
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    
    /**
     * 按真实姓名模糊分页查询
     * @data
     * data.page -- 页码
     * data.pageSize -- 单页条数
     * data.realname -- 真实姓名连续关键字
     */
    async getUserListByRname(data){
        data.start = (parseInt(data.page)-1)*parseInt(data.pageSize);
        const Op = this.db.Sequelize.Op;
        let where = {
            realname:{
                [Op.like]:'%'+data.realname+'%'
            }
        }
        if(data.realname===''){//空值返回空数组
            where.realname = '';
        }
        try{
            let list = await this.userModel.findAndCountAll({
                where:where,
                attributes:{exclude:['create_by','create_date','update_by','update_date','is_login','del_flag','login_ip']},                
                limit:parseInt(data.pageSize),
                offset:parseInt(data.start)
            });
            if(list.rows.length>0){
                for(var i in list.rows){
                    if(list.rows[i].pic_path){
                        list.rows[i].dataValues.pic_path = this.serverIP+'/'+list.rows[i].pic_path;
                    }else{
                        list.rows[i].dataValues.pic_path = this.serverIP+'/static/upload/images/default.png'; 
                    }
                }
            }
            return list;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 统计用户各类待办工作count,待核实，未读通知公告，待审批
     */
    async getUserTaskCount(data){
        let roleSqlStr = '';

        try{
            let roleList = await this.roleUserModel.findAll({where:{userid:data.userId},attributes:['roleid']});
            if(roleList.length>0){
                for(var i=0;i<roleList.length;i++){
                    roleSqlStr +=` OR b.group LIKE '%"${roleList[i].roleid}"'`;
                }
            }
            const countSql = `SELECT ( SELECT count(*) FROM cms_event WHERE verify_by = a.id AND is_check = 0 ) AS verifyCount, 
                            ( SELECT count(*) FROM oa_notify_record WHERE user_id = a.id AND read_flag = 0 ) AS notifyCount, 
                            ( SELECT count(*) count FROM ( SELECT count(*) count FROM bpmn_hi_actinst b
                                LEFT JOIN bpmn_hi_procinst c ON b.proc_inst_id = c.id 
                                LEFT JOIN bpmn_re_procdef d ON d.id = c.proc_def_id 
                                WHERE act_status = 0 AND ( b.assignee LIKE '%"${data.userId}"%' ${roleSqlStr}) AND c.id != '' AND c.status = 2 GROUP BY c.id ) AS c ) AS reviewCount 
                            FROM sys_user a WHERE a.id = "${data.userId}";`
            const userTaskCount = await this.db.sequelize.query(countSql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(userTaskCount.length>0){
            return userTaskCount[0];
            }else{
                return {error:'获取用户待办工作统计信息失败'};
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
}