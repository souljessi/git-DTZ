/**
 * Created by Jessi on 2017/11/30.
 */
export default class extends think.Service {
    constructor() {
        super();
        this.partsGroupModel = this.db['cms_parts_group'];
    }
    /**
     * 查询全部部件分类列表
     * @return
     * aj --Object
     * aj.result --部件列表 Array
     */
    async getPratsGroupList() {
        const serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
        const defaultImg = serverIP + '/static/upload/partIcons/default.svg';
        let aj = think.ajaxJson();
        const attr = {
            exclude: ['del_flag']
        };
        const where = {
            del_flag: 0
        };
        const PartsGroupList = await this.commonService.findAll(this.partsGroupModel, attr, where);
        if (PartsGroupList.error) {
            aj.success = false;
            aj.msg = "数据库查询错误";
        } else {
            PartsGroupList.map((item) => {
                if (item.group_pic_path) {
                    item.group_pic_path = serverIP +'/'+ item.group_pic_path;
                } else {
                    item.group_pic_path = defaultImg;
                }
                return item;
            })
            aj.result = PartsGroupList;
        }
        return aj;
    }
    async getPratsGroupForParent(data) {
        const db = this.db;
        const attributes = ['id', 'group_code', 'group_name', 'parent_id']
        try {
            const res = await db['cms_parts_group'].findAll({
                where: {
                    del_flag: 0,
                    parent_id: data.parent_id
                },
                attributes: attributes
            })
            return res
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /************************************************ */

    /**
     * 分页查询部件分类列表
     * @data
     * data.page --页码
     * data.pageSize --单页条数
     * @return 
     * return.count --总记录数
     * return.rows -- 列表
     */
    async getPartsGroupList(data){
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
            return await this.partsGroupModel.findAndCountAll({
                where:where,
                limit:parseInt(data.pageSize),
                offset:parseInt(data.start)
            })
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 检查部件分类代码和分类名称是否重复
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
            return await this.partsGroupModel.count({
                where:where
            })
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 保存部件分类信息
     */
    async savePGInfo(data){
        try{
            if(data.id){
                return await this.partsGroupModel.update(data,{where:{id:data.id}});
            }else{
                return await this.partsGroupModel.create(data);
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 删除部件分类，逻辑删除
     */
    async delPGInfo(data){
        try{
            const counts = await this.partsGroupModel.count({where:{parent_id:data.id,del_flag:0}});
            if(counts>0){
                return {msg:'当前部件分类包含子类，请先删除子类'};
            }else{
                return await this.partsGroupModel.update({del_flag:1},{where:{id:data.id}});
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /*************************************** */
}