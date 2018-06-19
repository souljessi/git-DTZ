export default class extends think.Service {
    constructor() {
        super();
    }

    /**
     * 部门评价
     * 
     * @returns 
     */
    async getOrgEval(data) {
        data.orgList = data.orgList.replace('[','(').replace(']',')');
        let FormDate = '';
        const dataSql = this.checkDateFormat(data.cycle,data.rangeDate);
        let sql = `SELECT a.id,a.org_code, a.org_name,count(cc.id) AS totalCount, 
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS closeCount, 
        count( CASE WHEN bb.status = 2 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS openCount, 
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration <= bb.overtime THEN 1 ELSE NULL END ) AS onCloseCount, 
        count( CASE WHEN bb.status = 1 AND bb.id = cc.proc_inst_id AND bb.duration > bb.overtime THEN 1 ELSE NULL END ) AS overCloseCount,
        count( CASE WHEN bb.status = 0 AND bb.id = cc.proc_inst_id THEN 1 ELSE NULL END ) AS rejectCount FROM sys_org a 
        LEFT JOIN oa_case cc ON ( (cc.DeptCode1 IN ( SELECT id FROM sys_org b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR cc.DeptCode1 = a.id ) ${dataSql.FormDate}) 
        LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id) 
        WHERE a.id IN ${data.orgList} GROUP BY a.id`;
        try{
            if(data.page){
                data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);                
                sql = sql+` limit ${data.start},${data.pageSize}`;
            }
            const list = await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    list[i].rangeDate = data.rangeDate;
                }
            }
            return list;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} data 
     */
    checkDateFormat(cycle,rangeDate){
        let result = null;
        switch (cycle){
            case 1:
                result = {
                    FormDate:` and DATE_FORMAT(cc.create_date, '%Y') = '${rangeDate}'`
                }
                break;
            case 2:
                result = {
                    FormDate:`and DATE_FORMAT(cc.create_date, '%Y-%m') = '${rangeDate}'`
                };
                break;
            case 3:
                const d = rangeDate.split('~');
                result = {
                    FormDate:`and (DATE_FORMAT(cc.create_date, '%Y-%m-%d') >= '${d[0]}'
                    AND DATE_FORMAT(cc.create_date, '%Y-%m-%d') <= '${d[1]}')`
                };
                break;
            
            default:
                result = null
                break;
        }
        return result;


    }
    //导出报表excel
    async exportExcel(data) {
        const rows = [];
        const tabHead = [
            '部门名称','部门编码','评价周期','接收案卷数',
            '结案数','未结案数','按期结案数','按期结案率(%)',
            '超期结案数','超期结案率(%)','总结案率(%)',
            '驳回案卷数','完好率(%)','评价结果'
        ];
        rows.push(tabHead);
        const list = await this.getOrgEval(data);
        if(list.length>0){
            for(var i in list){
                const row = list[i];
                let arr = [];
                if(row.totalCount!==0){
                    arr = [
                        row.org_name,
                        row.org_code,
                        row.rangeDate,
                        row.totalCount,
                        row.closeCount,
                        row.openCount,
                        row.onCloseCount,
                        (row.onCloseCount/row.totalCount*100).toFixed(2),
                        row.overCloseCount,
                        (row.overCloseCount/row.totalCount*100).toFixed(2),
                        (row.closeCount/row.totalCount*100).toFixed(2),
                        row.rejectCount,
                        ((1-row.rejectCount/row.totalCount)*100).toFixed(2),
                        (row.closeCount/row.totalCount*60+(1-row.rejectCount/row.totalCount)*40).toFixed(2)
                    ];
    
                }else{
                    arr = [
                        row.org_name,
                        row.org_code,
                        row.rangeDate,
                        row.totalCount,
                        row.closeCount,
                        row.openCount,
                        row.onCloseCount,
                        100,
                        row.overCloseCount,
                        100,
                        100,
                        row.rejectCount,
                        100,
                        100
                    ];
                }

                rows.push(arr);
            }
        }
        return rows;       
    }

    /**
     * 按部门获取超期|驳回案卷列表（包含子部门）
     */
    async getCaseListBy(data){
        const dateSql = this.checkDateFormat(data.cycle,data.rangeDate);
        let statusSql = `AND c.status = ${data.type}`;
        if(data.type===1){
            statusSql = `AND c.status = ${data.type} and c.duration>c.overtime`;
        }
        try{
            const sql = `SELECT cc.id,b.org_name,cc.ObjPosition,cc.parent_name,cc.sub_name,cc.case_code,
            cc.remarks,cc.proc_inst_id,DATE_FORMAT(cc.create_date,'%Y-%m-%d %h:%i') as create_date
            FROM oa_case cc 
            LEFT JOIN sys_org b ON b.id = cc.DeptCode1 
            LEFT JOIN bpmn_hi_procinst c ON c.id = cc.proc_inst_id 
            WHERE ( b.id = ${data.orgid} OR b.parent_ids LIKE concat('%,',${data.orgid}, ',%')) ${dateSql.FormDate} ${statusSql};`
            return await this.db.sequelize.query(sql,{type: this.db.sequelize.QueryTypes.SELECT});
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 导出excel
     * 按部门获取超期|驳回案卷列表（包含子部门）
     */
    async exportCaseExcel(data) {
        const rows = [];
        const tabHead = [
            '部门名称','案卷编号','案发地点',
            '案卷描述','案卷分类','立案时间'
        ];
        rows.push(tabHead);
        const list = await this.getCaseListBy(data);
        if(list.length>0){
            for(var i in list){
                const row = list[i];
                let arr = [];
                if(row.sub_name){
                    arr = [
                        row.org_name,
                        row.case_code,
                        row.ObjPosition,
                        row.remarks,
                        row.parent_name+'-'+row.sub_name,
                        row.create_date
                    ];
                }else{
                    arr = [
                        row.org_name,
                        row.case_code,
                        row.ObjPosition,
                        row.remarks,
                        row.parent_name,
                        row.create_date
                    ]; 
                }
                rows.push(arr);
            }
        }
        return rows;       
    }
    

}