export default class extends think.Service {
    constructor() {
        super();
        this.areaModel = this.db['cms_area'];
    }
    /**
     * 部门统计
     * 
     * @returns 
     */
    async OrgStatis(data) {
        const dateArr = this.getDateArr(data.startTime,data.endTime);
        const dateSql = `AND DATE_FORMAT(cc.create_date, '%Y-%m-%d') >= '${data.startTime}' AND DATE_FORMAT(cc.create_date, '%Y-%m-%d') <= '${data.endTime}'`;
        try{
           
            const sql1 = `SELECT a.id,a.parent_ids,a.org_code, a.org_name,count(cc.id) as total_care,
            count( CASE WHEN bb. STATUS = 0 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS reject_care,
            count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id AND bb.duration <= bb.overtime THEN 1 ELSE NULL END ) AS adance_care, 
            count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id AND bb.duration > bb.overtime THEN 1 ELSE NULL END ) AS delay_care FROM sys_org a 
            LEFT JOIN oa_case cc ON (( cc.DeptCode1 IN ( SELECT id FROM sys_org b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR cc.DeptCode1 = a.id ) ${dateSql} ) 
            LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id) WHERE a.id = '${data.orgid}'`
            const list = await this.db.sequelize.query(sql1,{type: this.db.sequelize.QueryTypes.SELECT});
            if(list.length>0){
                let result = list[0];
                let seriesArr = [];
                const likeStr = `%${result.parent_ids}${result.id}%`;
                const listSql = `SELECT count(*) as count, DATE_FORMAT(cc.create_date, '%Y-%m-%d' ) AS dates FROM oa_case cc
                WHERE ( DeptCode1 IN ( SELECT id FROM sys_org WHERE parent_ids LIKE '${likeStr}') OR DeptCode1 = '${result.id}') ${dateSql} GROUP BY dates`;
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
                return {error:'统计失败'};
            }
        }catch(err){
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