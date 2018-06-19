export default class extends think.Service {
    constructor() {
        super();
        this.areaModel = this.db['cms_area'];
    }
    /**
     * 区域统计
     * 
     * @returns 
     */
    async AreaStatis(data) {
        try{
            const parentids = await this.areaModel.findOne({
                where:{
                    area_code:data.area_code
                },
                attributes:['id','parent_ids']
            });
            if(parentids){
                const likeStr = '%'+parentids.parent_ids+parentids.id+',%';
                if(data.startTime!=''&&data.startTime!=undefined){
                    return await this.getSomeTimeStatic(data,likeStr);
                }else{
                    return await this.getAllTimeStatic(data,likeStr);
                }
            }else{
                return {error:'获取区域统计信息错误'};
            }
            
        }catch(err){

        }
    }
    /**
     * 
     * 统计全部日期
     */
    async getAllTimeStatic(data,likeStr){
        const AreaSql = `SELECT a.area_code, a.area_name, DATE_FORMAT(max(cc.create_date),'%Y-%m-%d') as endDate,
        DATE_FORMAT(min(cc.create_date),'%Y-%m-%d') as startDate,count(cc.id) AS total_care, 
        count( CASE WHEN bb.status = 0 THEN 1 ELSE NULL END ) AS reject_care, 
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration <= bb.overtime THEN 1 ELSE NULL END ) AS adance_care, 
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration > bb.overtime THEN 1 ELSE NULL END ) AS delay_care 
        FROM cms_area a LEFT JOIN oa_case cc ON ( cc.area_code IN ( SELECT area_code FROM cms_area b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR cc.area_code = a.area_code ) 
        LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id) WHERE a.area_code = '${data.area_code}'`
        
        const listSql = `SELECT count(*) as count, DATE_FORMAT(oa_case.create_date,'%Y-%m-%d') AS dates FROM oa_case 
        WHERE area_code IN ( SELECT area_code FROM cms_area WHERE parent_ids LIKE '${likeStr}') 
        OR area_code = '${data.area_code}' group by dates`;
        let seriesArr = [];
        try{
            const countArea = await this.db.sequelize.query(AreaSql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(countArea.length>0){
                let result = {
                    area_code: countArea[0].area_code,
                    area_name: countArea[0].area_name,
                    total_care: countArea[0].total_care,
                    reject_care: countArea[0].reject_care,
                    adance_care: countArea[0].adance_care,
                    delay_care:countArea[0].delay_care
                };
                const dateArr = this.getDateArr(countArea[0].startDate,countArea[0].endDate);
                let res2 = await this.db.sequelize.query(listSql,{type: this.db.sequelize.QueryTypes.SELECT});
                for (var i=0;i< dateArr.length;i++) {
                    var stra = dateArr[i];
                    let item = {
                        total_care:0,
                        date:stra
                    };
                    for (var j = 0; j < res2.length; j++) {
                        var strb = res2[j].dates;
                        if (stra === strb) {
                            item.total_care = res2[j].count;
                        }
                    }
                    seriesArr.push(item);
                }
                result.items = seriesArr;
                return result;        
            }else{
                return {error:'区域统计失败'};
            }

        }catch(err){
            return this.exceptionService.handleError(err);
        }

    }

    /**
     * 根据传入时间进行统计
     */ 
    async getSomeTimeStatic(data,likeStr){
        let seriesArr = [];
        const dateSql = `AND  DATE_FORMAT(cc.create_date, '%Y-%m-%d') >= '${data.startTime}' AND DATE_FORMAT(cc.create_date, '%Y-%m-%d') <= '${data.endTime}'`;
        const AreaSql = `SELECT a.area_code, a.area_name,count(*) as total_care, 
        count( CASE WHEN bb.status = 0 THEN 1 ELSE NULL END ) AS reject_care, 
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration <= bb.overtime THEN 1 ELSE NULL END ) AS adance_care, 
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration > bb.overtime THEN 1 ELSE NULL END ) AS delay_care 
        FROM cms_area a 
        LEFT JOIN oa_case cc ON ( (cc.area_code IN ( SELECT area_code FROM cms_area b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR cc.area_code = a.area_code) ${dateSql} ) 
        LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id) 
        WHERE a.area_code = '${data.area_code}'`;
        const dateArr = this.getDateArr(data.startTime,data.endTime);
        try {
            const res1 = await this.db.sequelize.query(AreaSql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(res1.length>0){
                const listSql = `SELECT count(*) as count, DATE_FORMAT( oa_case.create_date, '%Y-%m-%d' ) AS dates FROM oa_case 
                WHERE ( area_code IN ( SELECT area_code FROM cms_area WHERE parent_ids LIKE '${likeStr}') OR area_code = '${data.area_code}') 
                AND  DATE_FORMAT(create_date, '%Y-%m-%d') >= '${data.startTime}' AND DATE_FORMAT(create_date, '%Y-%m-%d') <= '${data.endTime}' GROUP BY dates`;
                let res2 = await this.db.sequelize.query(listSql,{type: this.db.sequelize.QueryTypes.SELECT});
                for (var i=0;i< dateArr.length;i++) {
                    var stra = dateArr[i];
                    let item = {
                        total_care:0,
                        date:stra
                    };
                    for (var j = 0; j < res2.length; j++) {
                        var strb = res2[j].dates;
                        if (stra === strb) {
                            item.total_care = res2[j].count;
                        }
                    }
                    seriesArr.push(item);
                }
                res1[0].items = seriesArr;
                return res1[0];
                
            }else{
                return {error:'区域统计失败'};
            }

            
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    
    /**
     * 获取日列表
     * @param date1
     * @param date2
     * @returns {Array}
     */
    getDateArr(date1, date2) {
        var date = [];
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        var date3 = d2.getTime() - d1.getTime();
        var days = Math.floor(date3 / (24 * 3600 * 1000)) + 1;
        for (var i = 0; i < days; i++) {
            var x = new Date(d1);
            x.setHours(x.getHours() + 24 * i);
            date.push(this.dateFormat(x,'yyyy-MM-dd'));
        }
        return date;
    }

    /**
     * 日期格式化
     */
    dateFormat(date, fmt) {
        var o = {
          'M+': date.getMonth() + 1, //月份
          'd+': date.getDate(), //日
          'h+': date.getHours(), //小时
          'm+': date.getMinutes(), //分
          's+': date.getSeconds(), //秒
          'q+': Math.floor((date.getMonth() + 3) / 3), //季度
          'S': date.getMilliseconds() //毫秒
        };
      
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "" : "") : "") + week[date.getDay() + ""]);
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        }
        return fmt;
    }   
}