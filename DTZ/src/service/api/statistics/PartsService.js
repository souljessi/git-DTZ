export default class extends think.Service {
    constructor() {
        super();
        this.areaModel = this.db['cms_area'];
    }
    /**
     * 部件统计
     * 
     * @returns 
     */
    async PartsStatis(data) {
        try{
            const sql1 = `SELECT a.area_code, a.area_name, count(b.id) AS total_parts, 
                count( CASE WHEN b.ObjState = '完好' THEN 1 ELSE NULL END ) AS intact_parts, 
                count( CASE WHEN b.ObjState = '损坏' THEN 1 ELSE NULL END ) AS damage_parts,
                count( CASE WHEN b.ObjState = '丢失' THEN 1 ELSE NULL END ) AS lose_parts,
                count( CASE WHEN b.ObjState = '废弃' THEN 1 ELSE NULL END ) AS disuse_parts,
                count( CASE WHEN b.ObjState = '移除' THEN 1 ELSE NULL END ) AS remove_parts FROM cms_area a 
                LEFT JOIN cms_parts b ON (( b.area_code IN ( SELECT area_code FROM cms_area WHERE parent_ids LIKE concat('%', a.parent_ids, a.id, '%')) OR b.area_code = a.area_code )) WHERE a.area_code = '${data.area_code}'`;
            
            const sql2 = `SELECT a.group_name, a.group_code, count(b.id) AS total_parts, 
                count( CASE WHEN b.ObjState = '损坏' THEN 1 ELSE NULL END ) AS damage_parts 
                FROM cms_parts_group a LEFT JOIN cms_area cc ON (cc.area_code = '${data.area_code}' ) 
                LEFT JOIN cms_parts b ON (b.group_code REGEXP concat("^", a.group_code) AND (b.area_code IN (SELECT area_code FROM cms_area WHERE parent_ids LIKE concat( '%', cc.parent_ids, cc.id, '%' )) OR b.area_code = cc.area_code )) 
                WHERE a.group_level = 1 GROUP BY a.id;`

            const countPatrs = await this.db.sequelize.query(sql1,{type: this.db.sequelize.QueryTypes.SELECT});
            const countOther = await this.db.sequelize.query(sql2,{type: this.db.sequelize.QueryTypes.SELECT});
            
            if(countPatrs.length>0){
                let result = countPatrs[0];
                result.items = countOther;
                return result;
            }else{
                return {error:'部件统计失败'};
            }
            
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
}