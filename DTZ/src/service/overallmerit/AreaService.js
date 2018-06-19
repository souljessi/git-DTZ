export default class extends think.Service {
    constructor() {
        super();
        this.areaModel = this.db['cms_area'];
        this.cellModel = this.db['cms_cell'];
        this.caseModel = this.db['a_case'];
    }

    /**
     *单元网格立案数
     */
    async getBGIDCase(data){
        const Op = this.db.Sequelize.Op;
        let format = '%Y';
        if(data.cycle===2){
            format = '%Y-%m';
        }
        try {
            const countSql2 = `SELECT a.BGID,a.scope_path,a.BGSQua,a.ORDate,a.CHDate,a.Note,
            ( SELECT count(*) FROM oa_case c WHERE c.BGID = a.BGID AND DATE_FORMAT(c.create_date, '${format}') = '${data.rangeDate}' ) AS count 
            FROM cms_cell a GROUP BY a.BGID`;
            const mapList = await this.db.sequelize.query(countSql2,{type: this.db.sequelize.QueryTypes.SELECT});
            for(var m=0;m<mapList.length;m++){
                mapList[m].range = data.rangeDate;
            }
            return mapList;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }

    }
    /**
     * 区域评价
     * 
     * @returns 
     */
    async getAreaData(data) {
        let formatDate = '%Y';
        if(data.cycle===2){
            formatDate = '%Y-%m';
        }
        if(data.cycle===3){
            formatDate = '%Y-%m-%d';
        }
        try {
            if(data.level===1){
               return await this.JDEval(data,formatDate);
            }else{
                if(data.level===2){
                    return await this.SQEval(data,formatDate);
                }else{
                    return await this.BGIDEval(data,formatDate);
                }
            }
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 街道评价
     */
    async JDEval(data,formatDate){
        // let formatDateSql1 = ` AND DATE_FORMAT(c.create_date, '${formatDate}') = '${data.rangeDate}'`;
        let formatDateSql2 = ` AND DATE_FORMAT(cms_event.create_date, '${formatDate}') = '${data.rangeDate}'`;
        let formatDateSql3 = ` AND DATE_FORMAT(cc.create_date, '${formatDate}') = '${data.rangeDate}'`;
        if(data.cycle===3){
            const dateArr = data.rangeDate.split('~');
            // formatDateSql1 = ` AND DATE_FORMAT(c.create_date, '${formatDate}') >= '${dateArr[0]}' AND DATE_FORMAT(c.create_date, '${formatDate}') <= '${dateArr[1]}'`;
            formatDateSql2 = ` AND DATE_FORMAT(cms_event.create_date, '${formatDate}') >= '${dateArr[0]}' AND DATE_FORMAT(cms_event.create_date, '${formatDate}') <= '${dateArr[1]}'`;
            formatDateSql3 = ` AND DATE_FORMAT(cc.create_date, '${formatDate}') = '${dateArr[0]}' AND DATE_FORMAT(cc.create_date, '${formatDate}') >= '${dateArr[1]}'`;
        }
        const sql = `SELECT a.area_name,count(cc.id) AS totalCount, 
        ( SELECT count(*) FROM cms_event WHERE (area_code IN ( SELECT area_code FROM cms_area WHERE parent_ids LIKE concat('%', parent_ids, id, ',%')) OR area_code = a.area_code) ${formatDateSql2})  AS eventCount,
        ( SELECT count(*) FROM cms_event WHERE (area_code IN ( SELECT area_code FROM cms_area WHERE parent_ids LIKE concat('%', parent_ids, id, ',%')) OR area_code = a.area_code) and cms_event.id=a.id ${formatDateSql2})  AS eventCaseCount,
        count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS closeCount, 
        count( CASE WHEN bb. STATUS = 2 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS openCount, 
        count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id AND bb.duration <= bb.overtime THEN 1 ELSE NULL END ) AS onCloseCount, 
        count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id AND bb.duration > bb.overtime THEN 1 ELSE NULL END ) AS overCloseCount,
        count( CASE WHEN bb. STATUS = 0 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS rejectCount FROM cms_area a 
        LEFT JOIN oa_case cc ON (( cc.area_code IN ( SELECT area_code FROM cms_area b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR cc.area_code = a.area_code )  ${formatDateSql3} ) 
        LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id) 
        WHERE a.area_code IN ( SELECT area_code FROM cms_area WHERE cms_area.parent_ids = '0,2,') 
        GROUP BY a.area_code`;
        try{
            const res = await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(res.length>0){
                for(var i=0;i<res.length;i++){
                    let r1 = 70;
                    let r2 = 30;
                    if(res[i].totalCount!=0){
                        r1 = Number((res[i].closeCount/res[i].totalCount*70).toFixed(2));
                    }
                    if(res[i].eventCount!=0){
                        r2 = Number((res[i].eventCaseCount/res[i].eventCount*30).toFixed(2));
                    }
                    res[i].grade = r1+r2;
                    res[i].result = this.checkLevel(r1+r2);
                    res[i].rangeDate = data.rangeDate;
                }
            }
            return res;
        }catch(err){

        }
    }

    /**
     * 社区评价
     */
    async SQEval(data,formatDate){
        // let formatDateSql1 = ` AND DATE_FORMAT(c.create_date, '${formatDate}') = '${data.rangeDate}'`;
        let formatDateSql2 = ` AND DATE_FORMAT(cms_event.create_date, '${formatDate}') = '${data.rangeDate}'`;
        let formatDateSql3 = ` AND DATE_FORMAT(cc.create_date, '${formatDate}') = '${data.rangeDate}'`;
        
        if(data.cycle===3){
            const dateArr = data.rangeDate.split('~');
            // formatDateSql1 = ` AND DATE_FORMAT(c.create_date, '${formatDate}') >= '${dateArr[0]}' AND DATE_FORMAT(c.create_date, '${formatDate}') <= '${dateArr[1]}'`;
            formatDateSql2 = ` AND DATE_FORMAT(cms_event.create_date, '${formatDate}') >= '${dateArr[0]}' AND DATE_FORMAT(cms_event.create_date, '${formatDate}') <= '${dateArr[1]}'`;
            formatDateSql3 = ` AND DATE_FORMAT(cc.create_date, '${formatDate}') = '${dateArr[0]}' AND DATE_FORMAT(cc.create_date, '${formatDate}') >= '${dateArr[1]}'`;
            
        }
        const countSql = `SELECT a.area_name,count(cc.id) AS totalCount,
        ( SELECT count(*) FROM cms_event WHERE (area_code IN ( SELECT area_code FROM cms_area WHERE parent_ids LIKE concat('%', parent_ids, id, ',%')) OR area_code = a.area_code) ${formatDateSql2})  AS eventCount,
        ( SELECT count(*) FROM cms_event WHERE (area_code IN ( SELECT area_code FROM cms_area WHERE parent_ids LIKE concat('%', parent_ids, id, ',%')) OR area_code = a.area_code) and cms_event.id=a.id  ${formatDateSql2})  AS eventCaseCount,
        count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS closeCount,
        count( CASE WHEN bb. STATUS = 2 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS openCount,
        count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id AND bb.duration <= bb.overtime THEN 1 ELSE NULL END ) AS onCloseCount,
        count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id AND bb.duration > bb.overtime THEN 1 ELSE NULL END ) AS overCloseCount,
        count( CASE WHEN bb. STATUS = 0 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS rejectCount FROM cms_area a
        LEFT JOIN oa_case cc ON (( cc.area_code IN ( SELECT area_code FROM cms_area b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR cc.area_code = a.area_code ) ${formatDateSql3})
        LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id)
        WHERE a.area_code IN (select area_code from cms_area where length(parent_ids)-length(replace(parent_ids, ',', ''))=3)
        GROUP BY a.area_code`;
        const sqList = await this.db.sequelize.query(countSql,{type: this.db.sequelize.QueryTypes.SELECT});
        if(sqList.length>0){
            for(var i=0;i<sqList.length;i++){
                let r1 = 70;
                let r2 = 30;
                if(sqList[i].totalCount!=0){
                    r1 = Number((sqList[i].closeCount/sqList[i].totalCount*70).toFixed(2));
                }
                if(sqList[i].eventCount!=0){
                    r2 = Number((sqList[i].eventCaseCount/sqList[i].eventCount*30).toFixed(2));
                }
                sqList[i].grade = r1+r2;
                sqList[i].result = this.checkLevel(r1+r2);
                sqList[i].rangeDate = data.rangeDate;
            }
           
        }
        return sqList;
    }

    /**
     * 网格评价
     * 
     */
    async BGIDEval(data,formatDate){
        // let formatDateSql1 = ` AND DATE_FORMAT(c.create_date, '${formatDate}') = '${data.rangeDate}'`;
        let formatDateSql2 = ` AND DATE_FORMAT(cms_event.create_date, '${formatDate}') = '${data.rangeDate}'`;
        let formatDateSql3 = ` AND DATE_FORMAT(cc.create_date, '${formatDate}') = '${data.rangeDate}'`;
        
        if(data.cycle===3){
            const dateArr = data.rangeDate.split('~');
            // formatDateSql1 = ` AND DATE_FORMAT(c.create_date, '${formatDate}') >= '${dateArr[0]}' AND DATE_FORMAT(c.create_date, '${formatDate}') <= '${dateArr[1]}'`;            
            formatDateSql2 = ` AND DATE_FORMAT(cms_event.create_date, '${formatDate}') >= '${dateArr[0]}' AND DATE_FORMAT(cms_event.create_date, '${formatDate}') <= '${dateArr[1]}'`;
            formatDateSql3 = ` AND DATE_FORMAT(cc.create_date, '${formatDate}') = '${dateArr[0]}' AND DATE_FORMAT(cc.create_date, '${formatDate}') >= '${dateArr[1]}'`;
            
        }
        const countSql = `SELECT a.BGID as area_name,count(cc.id) AS totalCount,
        ( SELECT count(*) FROM cms_event WHERE BGID = a.BGID ${formatDateSql2}) AS 'eventCount',
        ( SELECT count(*) FROM cms_event WHERE BGID = a.BGID and cms_event.id=a.id ${formatDateSql2}) AS eventCaseCount,
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS closeCount,
        count( CASE WHEN bb.status = 2 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS openCount,
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration <= bb.overtime THEN 1 ELSE NULL END ) AS onCloseCount,
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration > bb.overtime THEN 1 ELSE NULL END ) AS overCloseCount,
        count( CASE WHEN bb.status = 0 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS rejectCount FROM cms_cell a
        LEFT JOIN oa_case cc ON ( cc.BGID = a.BGID  ${formatDateSql3})
        LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id)
        GROUP BY a.BGID`;
        const bgidList = await this.db.sequelize.query(countSql,{type: this.db.sequelize.QueryTypes.SELECT});
        if(bgidList.length>0){
            for(var i=0;i<bgidList.length;i++){
                let r1 = 70;
                let r2 = 30;
                if(bgidList[i].totalCount!=0){
                    r1 = Number((bgidList[i].closeCount/bgidList[i].totalCount*70).toFixed(2));
                }
                if(bgidList[i].eventCount!=0){
                    r2 = Number((bgidList[i].eventCaseCount/bgidList[i].eventCount*30).toFixed(2));
                }
                bgidList[i].grade = r1+r2;
                bgidList[i].result = this.checkLevel(r1+r2);
                bgidList[i].rangeDate = data.rangeDate;
            }
           
        }
        return bgidList;
    }
    /**
     * 评价级别判断
     */
    checkLevel(res){
        let result = "";
        switch (true){
            case res>95:
                result = "A 优秀";
                break;
            case 82.5<=res&&res<95:
                result = "B 良好";
                break;
            case 67.5<=res&&res<82.5:
                result = "C 及格";
                break;
            case 50<=res&&res<67.5:
                result = "D 较差";
                break;
            case res<50:
                result = "E 极差";
                break;
            default:
                result = "未知";
                break;
        }
        return result;
    }

    //导出报表excel
    async exportExcel(data) {
        const rows = [];
        const tabHead = this.getExcelColsByLevel(Number(data.level));
        rows.push(tabHead);
        const list = await this.getAreaData(data);
        if(list.length>0){
            for(var i in list){
                var row = list[i];
                var arr = [];
                if(row.totalCount!==0){
                    arr = [
                        row.area_name,
                        row.rangeDate,
                        row.totalCount,
                        row.onCloseCount,
                        (row.onCloseCount/row.totalCount*100).toFixed(2),
                        row.overCloseCount,
                        (row.overCloseCount/row.totalCount*100).toFixed(2),
                        row.eventCaseCount/row.eventCount*100||100,
                        row.result,
                        row.grade
                    ]; 
                }else{
                    arr = [
                        row.area_name,
                        row.rangeDate,
                        row.totalCount,
                        row.onCloseCount,
                        100,
                        row.overCloseCount,
                        100,
                        row.eventCaseCount/row.eventCount*100||100,
                        row.result,
                        row.grade
                    ];
                }
              
                rows.push(arr);
            }
        }
        return rows;   
        
    }

    /**
     * 根据查询层级生成excel cols
     */
    getExcelColsByLevel(level){
        let tabHead = [];
        switch (level){
            case 1:
                tabHead = [
                    '街道名称','评价周期','立案数','按期结案数','按期结案率(%)',
                    '超期案卷结案数','超期案卷结案率(%)','上报立案率(%)',
                    '综合评价等级','综合评价得分'
                ];
                break;
            case 2:
            tabHead = [
                    '社区名称','评价周期','立案数','按期结案数',
                    '按期结案率(%)','超期案卷结案数','超期案卷结案率(%)',
                    '上报立案率(%)','综合评价等级','综合评价得分'
                ];
                break;
            case 3:
            tabHead = [
                    '单元网格','评价周期','立案数','按期结案数',
                    '按期结案率(%)','超期案卷结案数','超期案卷结案率(%)',
                    '上报立案率(%)','综合评价等级','综合评价得分'
                ];
                break;
            default:
                break;
        }
        return tabHead;
    }
    
}