export default class extends think.Service {
    constructor() {
        super();
        this.eventGroupModel = this.db['cms_event_group'];
    }
    /**
     * 查询全部事件分类列表
     * @return
     * aj --Object
     * aj.result --部件列表 Array
     */
    async eventGroupAll() {
        const serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
        const defaultImg = '/static/upload/eventIcons/default.svg';
        let aj = think.ajaxJson();
        const attr = { exclude: ['del_flag'] };
        const where = {del_flag:0};
        const EventGroupList = await this.commonService.findAll(this.eventGroupModel,attr,where);
        if(EventGroupList.error){
            aj.success = false;
            aj.msg = "数据库查询错误";
        }else{
            EventGroupList.map((item)=>{
                if(item.group_pic_path){
                    item.group_pic_path = serverIP+'/'+item.group_pic_path;
                }else{
                    item.group_pic_path = serverIP+defaultImg;
                }
                return item;
            })
            aj.result = EventGroupList;
        }
        return aj;
    }

    /**
     * 分页查询事件分类列表
     * @data
     * data.page --页码
     * data.pageSize --单页条数
     * @return 
     * return.count --总记录数
     * return.rows -- 列表
     */
    async getEventGroupList(data){
        data.start = (parseInt(data.page)-1)*parseInt(data.pageSize);
        let where = {del_flag:0};
        const Op = this.db.Sequelize.Op;
        if(data.group_name){
            where.group_name = {[Op.like]:'%'+data.group_name+'%'};
        }
        if(data.id){
            where[Op.or] = {
                id:data.id,
                parent_id:data.id
            }
        }
        try{
            return await this.eventGroupModel.findAndCountAll({
                where:where,
                limit:parseInt(data.pageSize),
                offset:parseInt(data.start)
            })
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 检查事件分类代码和分类名称是否重复
     */
    async checkCode(data){
        const Op = this.db.Sequelize.Op;
        let where = {
            [Op.or]:[
                {group_name:data.group_name},
                {group_code:data.group_code}
            ]
        }
        if(data.id){
            where.id = {
                [Op.not]:data.id
            }
        }
        try{
            return await this.eventGroupModel.count({
                where:where
            })
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 保存事件分类信息
     */
    async saveEGInfo(data){
        try{
            if(data.id){
                return await this.eventGroupModel.update(data,{where:{id:data.id}});
            }else{
                return await this.eventGroupModel.create(data);
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 删除事件分类，逻辑删除
     */
    async delEGInfo(data){
        try{
            const counts = await this.eventGroupModel.count({where:{parent_id:data.id,del_flag:0}});
            if(counts>0){
                return {msg:'当前事件分类包含子类，请先删除子类'};
            }else{
                return await this.eventGroupModel.update({del_flag:1},{where:{id:data.id}});
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /** 
     * 计算一个点是否在多边形里 
     * @param {Object} pt 标注点 
     * @param {Object} poly 多边形数组 
     */  
    async isInsidePolygon(pt, poly){  
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)   
            ((poly[i].lat <= pt.lat && pt.lat < poly[j].lat) || (poly[j].lat <= pt.lat && pt.lat < poly[i].lat)) &&  
            (pt.lng < (poly[j].lng - poly[i].lng) * (pt.lat - poly[i].lat) / (poly[j].lat - poly[i].lat) + poly[i].lng) &&  
            (c = !c);  
        return c;  
    }  
}