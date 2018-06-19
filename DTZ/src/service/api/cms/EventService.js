import path from 'path';
import fs from 'fs';
import { create } from 'domain';
const unlink = think.promisify(fs.unlink, fs);

export default class extends think.Service {
    constructor() {
        super();
        this.eventGroupModel = this.db['cms_event_group'];
        this.eventModel = this.db['cms_event'];
        this.cellModel = this.db['cms_cell'];
        this.areaModel = this.db['cms_area'];
        this.attachmentModel = this.db['sys_attachment'];
        this.userModel = this.db['sys_user'];
        this.eventModel.belongsTo(this.eventGroupModel, {
            foreignKey: 'group_code',
            targetKey: 'group_code'
        })
        this.eventModel.belongsTo(this.cellModel, {
            foreignKey: 'BGID',
            targetKey: 'BGID'
        })
        this.eventModel.belongsTo(this.areaModel, {
            foreignKey: 'area_code',
            targetKey: 'area_code'
        })
        this.eventModel.hasMany(this.attachmentModel, {
            foreignKey: 'businesskey',
            targetKey: 'id'
        })
        this.serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
              
    }
    async getAllEventGroup(){
        try{
            return await this.eventGroupModel.findAll({where:{del_flag:0}});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 按查询条件获取事件列表
     */
    async getEventListBy(data){
        data.start = (parseInt(data.page)-1)*parseInt(data.pageSize);
        const Op = this.db.Sequelize.Op;
        const is_check = data.is_check.map((numStr)=>{
            return Number(numStr);
        })
        let where = {del_flag:0,is_check:{[Op.in]:is_check}};
        if(data.flag){
            where.verify_by = data.userId;
        }else{
            where.create_by = data.userId;
        }
        if(data.group_code!==''&&data.area_code!==undefined){
            where.group_code = data.group_code;
        }
        if(data.area_code!==''&&data.area_code!==undefined){
            where.area_code = data.area_code;
        }

        let rows = [];
        try{
            let list = await this.eventModel.findAndCountAll({
                where:where,
                include:[
                    {model:this.eventGroupModel,attributes:['group_name']},
                    {model:this.cellModel,attributes:['scope_path']},
                    {model:this.areaModel,attributes:['area_code','area_name']},
                    {model:this.attachmentModel,attributes:['realpath']}
                ],
                limit:parseInt(data.pageSize),
                offset:parseInt(data.start),
                order: [
                    ['is_check', 'ASC'],
                    ['create_date', 'DESC']
                ],
                distinct: true
            });
            if(list.rows.length>0){
                for(var i=0;i<list.rows.length;i++){
                    let item = list.rows[i].dataValues;
                    let sys_attachment = [];
                    if(item.sys_attachments.length>0){
                        for(var j=0;j<item.sys_attachments.length;j++){
                            sys_attachment.push(this.serverIP+ '/'+item.sys_attachments[j].realpath)
                        }
                    }
                    item.sys_attachments = sys_attachment;
                    rows.push(item);
                }
            }
            list.rows = rows;
            return list;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 新增事件
     * @param {Object} data 事件属性 
     */
    async addEvent(data) {
        data.id = think.uuid('v1');
        const Op = this.db.Sequelize.Op;
        try{
            if(data.pic_path){
                // const where = {
                //     realpath:{
                //         [Op.in]:data.pic_path
                //     }
                // };
                // const updateField = {
                //     businesskey:data.id
                // };
                // await this.attachmentModel.update(updateField,{where:where});

                const fileArr = data.pic_path;
                const insertData = fileArr.map((item)=>{
                    const param = {
                        id:think.uuid('v1'),
                        create_date:new Date(),
                        businesskey:data.id,
                        realpath:item,
                        user_id:data.create_by
                    }
                    return param;
                })
                await this.attachmentModel.bulkCreate(insertData);
            }
            const event = await this.eventModel.create(data);
            return JSON.parse(JSON.stringify(event));
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 修改事件
     * @param {Object} data 事件属性 
     */
    async editEvent(data) {
        const attrachWhere = {businesskey:data.id};
        try{
            const old = await this.attachmentModel.findAll({
                where:attrachWhere,
                attributes:['realpath']
            });
            const fileArr = old.map((path)=>{
                return path.realpath;
            })
            if(data.pic_path){
                const newPic = data.pic_path;
                const oldPic = old.map((path)=>{
                    return path.realpath;
                });
                const delORadd = await this.updateAttrachment(oldPic,newPic,data.id,data.update_by);
                if(delORadd.error){
                    return {msg:'附件信息更新失败'};
                }
            }else{
                await this.attachmentModel.destroy({where:attrachWhere});
                const res = await this.delFile(fileArr);
                if(!res){
                    return {msg:'事件相关文件删除失败'};
                }
            }
            return await this.eventModel.update(data,{where:{id:data.id}});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 更新附件表删除图片
     * oldPic --原来的图片名称列表
     * newPic --新的图片名称列表
     * eventid -- 事件id
     * userid -- 用户id
     */
    async updateAttrachment(oldPic,newPic,eventid,userid){
        let flag1 = true;
        let flag2 = true;
        let addList = [];
        let delList = [];
        const Op = this.db.Sequelize.Op;
        const ar =oldPic.filter(function(a) {//重复部分
            return newPic.indexOf(a) != -1
        });
        addList =newPic.filter(function(b) {
            return ar.indexOf(b) === -1
        });
        delList =oldPic.filter(function(c) {
            return ar.indexOf(c) === -1
        });
        try{
            if(addList.length>0){
                addList = addList.map((item)=>{
                    const addData = {
                        id:think.uuid('v1'),
                        realpath:item,
                        create_date:new Date(),
                        atta_title:'事件上报',
                        businesskey:eventid,
                        user_id:userid
                    };
                    return addData;
                })
                const add = await this.attachmentModel.bulkCreate(addList);
                if(!add){
                    flag1 = false;
                }
            }
            if(delList.length>0){
                const fileArr = delList.map((path)=>{
                    return path;
                })
                const del = await this.attachmentModel.destroy({
                    where:{
                        businesskey:eventid,
                        realpath:{
                            [Op.in]:delList
                        }
                    }
                });
                if(!del){
                    flag2 = false;
                }else{
                    const delImg = await this.delFile(fileArr);
                    if(!delImg){
                        flag2 = false;
                    }
                }
            }
            if(flag1&&flag1){
                return true;
            }else{
                return {error:'操作错误'};
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

     /**
     * 删除事件
     * @param {*} data 
     * data.id --事件id
     */
    async delEvent(data){
        const upfields = {del_flag:1};
        try{
            return this.eventModel.update(upfields,{where:data});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 核实事件
     * data.is_check -- 是否核实 0否 1是
     * data.id -- 事件id
     */
    async checkEvent(data){
        const upfield = data;
        const where = {id:data.id};
        try{
            return await this.eventModel.update(upfield,{where:where});
        }catch(err){
            return this.exceptionService.handleError(err);
        }    
    }

    /**
     * 返回核实事件的详情
     */
    async checkEventDetail(data){
        const where = {id:data.id};
        try{
            return await this.eventModel.findOne({where:where});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 事件详情
     * data.id --事件id
     */
    async getEventInfo(data){
        try{
            const sql = `SELECT a.*, b.username AS create_name, c.username AS update_name, d.username AS verify_name, b.pic_path AS create_pic, c.pic_path AS update_pic, d.pic_path AS verify_pic,e.area_name FROM cms_event a LEFT JOIN sys_user b ON (b.id = a.create_by) LEFT JOIN sys_user c ON (c.id = a.update_by) LEFT JOIN sys_user d ON (d.id = a.verify_by) LEFT JOIN cms_area e ON (e.area_code = a.area_code) WHERE a.id = '${data.id}';`
            const eventInfo = await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(eventInfo.length>0){
                let res = eventInfo[0];
                res.create_pic = await this.checkPic(res.create_pic);
                res.update_pic = await this.checkPic(res.update_pic);
                res.verify_pic = await this.checkPic(res.verify_pic);
                let pic_path = await this.attachmentModel.findAll({where:{businesskey:data.id},attributes:['realpath']});
                if(pic_path.length>0){
                    pic_path = pic_path.map((item)=>{
                        return this.serverIP+'/'+item.realpath;
                    })
                }
                if(res.undefined){
                    delete res.undefined;
                }
                res.pic_path = pic_path;
                return res;
            }else{
                return {error:'获取事件信息错误'};
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }  
    }

    async getWechatEventInfo(data){
        try{
            const sql = `SELECT a.*, b.NickName AS create_name, c.username AS update_name, d.username AS verify_name,
             b.HeadPic AS create_pic, c.pic_path AS update_pic, d.pic_path AS verify_pic,e.area_name FROM cms_event a 
             LEFT JOIN wechat_user b ON (b.UserId = a.create_by) 
             LEFT JOIN sys_user c ON (c.id = a.update_by) 
             LEFT JOIN sys_user d ON (d.id = a.verify_by) 
             LEFT JOIN cms_area e ON (e.area_code = a.area_code) WHERE a.id = '${data.id}';`
            const eventInfo = await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(eventInfo.length>0){
                let res = eventInfo[0];
                res.create_pic = this.serverIP+'/static/upload/images/default.png';
                res.update_pic = await this.checkPic(res.update_pic);
                res.verify_pic = await this.checkPic(res.verify_pic);
                let pic_path = await this.attachmentModel.findAll({where:{businesskey:data.id},attributes:['realpath']});
                if(pic_path.length>0){
                    pic_path = pic_path.map((item)=>{
                        return this.serverIP+'/'+item.realpath;
                    })
                }
                if(res.undefined){
                    delete res.undefined;
                }
                res.pic_path = pic_path;
                return res;
            }else{
                return {error:'获取事件信息错误'};
            }
           
        }catch(err){
            return this.exceptionService.handleError(err);
        }  
    }

    /**
     * 
     */
    async verifyStateList(){
        const sql = `select a.typecode as check_code,a.typename as check_name from sys_type a 
        LEFT JOIN sys_type_group b on (b.id=a.typegroupid) where b.typegroupcode='sjzt'`;
        try{
            return await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
        }catch(err){
            return this.exceptionService.handleError(err);
        } 
    }
    /**
     * 组装图片路径
     */
    async checkPic(path){
        let data =  this.serverIP+'/static/upload/images/default.png';
        if(path){
            data = this.serverIP+'/'+path;
        }
        return data;
    }
    /**
     * 删除文件
     * @returns Boolean
     */
    async delFile(filePathArr){
        try {
            for(var i in filePathArr){
                await unlink('www/'+filePathArr[i]);
            }
            return true;
        } catch (e) {
            return false
        }
    }
}