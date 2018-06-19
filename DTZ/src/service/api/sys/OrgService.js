export default class extends think.Service {
    constructor() {
        super();
        const db = this.db;
        this.orgModel = db['sys_org'];
        this.userModel = db['sys_user'];
        this.serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
    }
    async getOrgList(userInfo){
        try{
            return await this.BaseService.dataScopeFilter('sys_org',userInfo);
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    async getUserListByOrg(orgData){
        try{
            let userlist = await this.userModel.findAll({where:{org_id:orgData.org_id}});
            if(userlist.length>0){
                userlist = userlist.map((item)=>{
                    
                    if(item.pic_path){
                        item.pic_path = this.serverIP+'/'+item.pic_path;
                    }else{
                        item.pic_path = this.serverIP+'/static/upload/images/default.png';
                    }
                    return item;
                })
            }
            return userlist;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    async getOrgs(data){
        let orgList = [];
        let userList = [];
        const Op = this.db.Sequelize.Op;        
        try{
            orgList = await this.orgModel.findAll({
                where:{
                    parent_id:data.id
                }
            })
            // orgList = await this.getChildeFlag(orgList);
            userList = await this.userModel.findAll({
                where:{
                    org_id:data.id
                },
                attributes:{exclude:['last_login_time','is_login','login_ip','login_flag','del_flag','remarks','create_by','update_by','create_date','update_date']}
            })
            if(userList.length>0){
                userList = userList.map((item)=>{
                    if(item.pic_path){
                        item.pic_path = this.serverIP+'/'+item.pic_path
                    }else{
                        item.pic_path = this.serverIP+'/static/upload/images/default.png'; 
                    }
                    return item;
                })
            }
            const result = {userList:userList,orgList:orgList};
            return result;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 查询当前机构是否存在子集或用户
     * list --机构列表
     */
    async getChildeFlag(list){
        try{
            for(var i=0;i<list.length;i++){
                let data = list[i].dataValues;
                const orgCount = await this.orgModel.count({where:{parent_id:data.id}});
                const userCount = await this.userModel.count({where:{org_id:data.id}});
                if(orgCount>0||userCount>0){
                    data.child = true;
                }else{
                    data.child = false;
                }
            }
            return list;
        }catch(err){
            return this.exceptionService.handleError(err); 
        }
    }
    /**
     * 递归查询所有子孙机构
     * @param {*} data 
     */
    async getOrgIds(data){
        let idArr = [data.id];
        const Op = this.db.Sequelize.Op;
        try{
            const getList = async (childArr)=> {
                const where = {
                    parent_id: {
                        [Op.in]: childArr
                    }
                };
                const childids = await this.orgModel.findAll({
                    where: where,
                    attributes: ['id']
                });
                if (childids && childids.length > 0) {
                    let childid = [];
                    for (let i = 0; i < childids.length; i++) {
                        idArr.push(childids[i].id);
                        childid.push(childids[i].id);
                    }
                    return await getList(childid);
                } else {
                    return idArr;
                }
        
            };
            return await getList(idArr);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 
     */
    // async getOrgs(data){
    //     let idArr = [data.id];
    //     let list = [];
    //     const Op = this.db.Sequelize.Op;
    //     try{
    //         const getList = async (childArr)=> {
    //             const where = {
    //                 parent_id: {
    //                     [Op.in]: childArr
    //                 }
    //             };
    //             const childids = await this.orgModel.findAll({
    //                 where: where,
    //                 attributes: ['id']
    //             });
    //             if (childids && childids.length > 0) {
    //                 let childid = [];
    //                 for (let i = 0; i < childids.length; i++) {
    //                     idArr.push(childids[i].id);
    //                     childid.push(childids[i].id);
    //                 }
    //                 return await getList(childid);
    //             } else {
    //                 return idArr;
    //             }
        
    //         };
    //         const ids = await getList(idArr);
    //         if(ids&&ids.length>0){
    //             list = await this.orgModel.findAll({
    //                 where:{
    //                     id:{
    //                         [Op.in]:ids
    //                     }
    //                 }
    //             })
    //         }
    //         return list;
    //     } catch (err) {
    //         return this.exceptionService.handleError(err);
    //     }
    // }

    async getAllOrg(){
        try{
            return await this.orgModel.findAll({
                attributes:['id','parent_id','org_name','org_code']
            });
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
}