export default class extends think.Service {
    constructor() {
        super();
        this.cmsPartsModel = this.db['cms_parts'];
        this.cmsAreaModel = this.db['cms_area'];
        this.cmsCellModel = this.db['cms_cell'];
        this.partsGroupModel = this.db['cms_parts_group'];
        this.cmsPartsModel.belongsTo(this.partsGroupModel, {
            foreignKey: 'group_code',
            targetKey: 'group_code'
        })
        this.cmsPartsModel.belongsTo(this.cmsAreaModel, {
            foreignKey: 'area_code',
            targetKey: 'area_code'
        })
        this.serverIP = 'http://' + think.config('staticIp') + ':' + think.config('proxyPort');
       
    }
    /**
     * 根据百度坐标点和范围查询部件列表
     * @data
     * data.baidu_x --经度
     * data.baidu_y --纬度
     * data.range --范围（米）
     * @return --list 部件列表
     */
    async getPartsListByRange(data){
        const Op = this.db.Sequelize.Op;
        const juli = `ROUND( 6378.138 * 2 * ASIN( SQRT( POW( SIN(( ${data.baidu_y} * PI() / 180 - a.baidu_y * PI() / 180 ) / 2 ), 2 ) + COS(${data.baidu_y} * PI() / 180) * COS(a.baidu_y * PI() / 180) * POW( SIN(( ${data.baidu_x} * PI() / 180 - a.baidu_x * PI() / 180 ) / 2 ), 2 ))) * 1000 )`;
        const fields = `a.*,b.group_name,b.parent_id,c.area_name,c.parent_ids`;
        const sql = `SELECT ${fields}, ${juli} as juli FROM cms_parts a LEFT JOIN cms_parts_group b on(a.group_code=b.group_code) LEFT JOIN cms_area c on(a.area_code=c.area_code) WHERE ${juli}<=${data.range} ORDER BY juli ASC`;
        try{
            const list = await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    const item = list[i];
                    if(item.pic_path){
                        item.pic_path = this.serverIP+'/'+item.pic_path;
                    }else{
                        item.pic_path = this.serverIP+'/default.png';  
                    }
                    const idArr = item.parent_ids.split(',');
                    let address = await this.cmsAreaModel.findAll({
                        where:{
                            id:{
                                [Op.in]:idArr
                            }
                        },
                        attributes:['area_name']
                    });
                    if(address.length>0){
                        address = address.map((a)=>{
                            return a.area_name
                        })
                    }
                    let parentPartsGroup = await this.partsGroupModel.findOne({
                        where:{id:item.parent_id},
                        attributes:['group_code','group_name']
                    });
                    item.parentPartsGroup = parentPartsGroup;
                    item.address = address;
                }
            }
            return list;
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
     /**
     * 根据百度坐标点和范围查询部件列表
     * @data
     * data.area_code --行政区域
     * data.group_code --分类编码
     * data.ObjState --部件状态
     * @return --list 部件列表
     * id,baidu_x,baidu_y,group_code,ObjState
     */
    async getPartsListByArea(data){
        let where = {};
        if(data.area_code){
            where.area_code = data.area_code;
        }
        if(data.group_code){
            where.group_code = data.group_code;
        }
        if(data.ObjState){
            where.ObjState = data.ObjState;
        }
        if(data.create_by){
            where.create_by = data.create_by;
        }
        try{
            return await this.cmsPartsModel.findAll({
                where:where,
                attributes:['id','baidu_x','baidu_y','group_code','ObjState'],
            })
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 按部件状态进行统计
     */
    async getCountByState(){
        try{
            const sql = `SELECT count(*) AS totalCount, 
            count( CASE WHEN ObjState = '完好' THEN 1 ELSE NULL END ) AS intactCount, 
            count( CASE WHEN ObjState = '损坏' THEN 1 ELSE NULL END ) AS damageCount, 
            count( CASE WHEN ObjState != '完好' AND ObjState != '损坏' THEN 1 ELSE NULL END ) AS otherCount FROM cms_parts`
            const partsCount = await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(partsCount.length>0){
                return partsCount[0];
            }else{
                return {error:'查询部件统计信息错误'};
            }
        }catch(err){
            return this.exceptionService.handleError(err);
        }   
    }

    async getCountByArea(){
        try{
            const sql = `SELECT a.id, a.area_code, a.area_name, 
            (SELECT count(*) FROM cms_parts WHERE area_code IN (SELECT area_code FROM cms_area WHERE parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR area_code = a.area_code ) AS count 
            FROM cms_area a WHERE a.area_code = '530322002000' OR a.area_code = '530322001000' 
            GROUP BY a.area_code;`;
            return await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
        }catch(err){
            return this.exceptionService.handleError(err);
        }   
    }
}
