export default class extends think.Service {
    constructor() {
        super();
        this.userModel = this.db['sys_user'];
        this.orgModel = this.db['sys_org'];
        this.notifyModel = this.db['oa_notify'];
        this.notifyRecordModel = this.db['oa_notify_record'];
    }

    /**
     *获取未读通知列表
     */
    async getNotifyList(data){
        try {
            const sql = `SELECT a.user_id, b.id, b.type, b.title, b.content, b.files, b.status, b.create_by, 
            b.create_date, b.update_by, b.update_date, b.remarks, c.username,c.realname FROM oa_notify_record AS a 
            LEFT OUTER JOIN oa_notify AS b ON a.oa_notify_id = b.id 
            LEFT OUTER JOIN sys_user AS c ON c.id = b.create_by 
            WHERE a.read_flag = 0 AND b.del_flag = 0 AND a.user_id = '${data.userId}' 
            ORDER BY b.create_date DESC LIMIT 0, 10;`
            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
        
    }
    //查询我的待办任务
    async getTaskList(data) {
        let str ='';
        try {
            if(data.roleList&&data.roleList.length>0){
                for(let i=0;i<data.roleList.length;i++){
                    str+=`or a.group like '%${data.roleList[i]}%'`
                }
            }
            let sql = `select b.id, a.act_name, DATE_FORMAT(b.start_time,'%Y-%m-%d %H:%i') as start_time, c.name, c.rev 
                        from bpmn_hi_actinst a 
                        left join bpmn_hi_procinst b on a.proc_inst_id = b.id 
                        left join bpmn_re_procdef c on c.id = b.proc_def_id 
                        where  b.status = 2 and a.act_status=0 and ( a.assignee like '%${data.userId}%' ${str}) 
                        group by b.id order by b.start_time desc limit 0, 10;`
            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    async getQuePartsCount(){//问题部件统计
        try {
           
            let sql = `select count(*) as count,ObjState from cms_parts where ObjState!='完好' GROUP BY ObjState;`;
            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    async getEventGroupCount(){//事件分类统计
        try {
            let sql = `SELECT COUNT(b.id) AS count, a.group_name FROM cms_event_group a 
            LEFT JOIN cms_event b ON (a.group_name = b.parent_name) WHERE a.group_level = 1 
            GROUP BY a.group_code;`;
            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    
    async getCaseStateCount(){//最近30天案卷统计
        try {
            // let sql = `SELECT count(a.id) AS totalCount,
            //             count( CASE WHEN b.status = 2 THEN 1 ELSE NULL END ) AS openCount,
            //             count( CASE WHEN b.status = 1 AND b.duration <= b.overtime THEN 1 ELSE NULL END ) AS onCloseCount,
            //             count( CASE WHEN b.status = 1 AND b.duration > b.overtime THEN 1 ELSE NULL END ) AS overCloseCount,
            //             count( CASE WHEN b.status = 0 THEN 1 ELSE NULL END ) AS rejectCount FROM oa_case a
            //             LEFT JOIN bpmn_hi_procinst b ON (b.id = a.proc_inst_id)
            //             WHERE DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= a.create_date;`;

            const sql = `SELECT a.area_name, count(cc.id) AS totalCount FROM cms_area a 
            LEFT JOIN oa_case cc ON (( cc.area_code IN ( SELECT area_code FROM cms_area b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')) OR cc.area_code = a.area_code ) AND DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= cc.create_date ) 
            WHERE a.area_code IN ( SELECT area_code FROM cms_area WHERE cms_area.parent_ids = '0,2,' ) GROUP BY a.area_code`
            return await this.commonService.querySql(sql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    async getUnfinishedList(userInfo){//最新10条进行中项目
        let whereSql = '';
        try {
            const dataScope = await this.getOrgBydataScope(userInfo);
            if(dataScope&&dataScope.error){
                return {error:'获取数据权限失败'}
            }else{
                if(dataScope.orgSql){
                    whereSql = `and c.org_id ${dataScope.orgSql}`;
                }
                if(dataScope.userSql){
                    whereSql = `and c.id ${dataScope.userSql}`;
                }
                const sql2 = `SELECT a.id,a.case_code,a.ObjPosition,a.case_type,a.remarks,c.realname,
                    b.id as proc_inst_id from oa_case a
                    left join bpmn_hi_procinst b on a.proc_inst_id = b.id 
                    left join sys_user c on c.id = a.create_by
                    where b.status=2 ${whereSql} ORDER BY a.create_date DESC limit 0,10;`
                return await this.commonService.querySql(sql2);
            }
            
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
       
    }
    async getWorkDetail(data){
        try{
            const taskListsql = `SELECT a.name,a.assignee,a.start_time,a.duration,a.task_status,b.realname
                                FROM bpmn_hi_taskinst a 
                                left join sys_user b on b.username=a.assignee
                                where a.proc_inst_id=${data.proc_inst_id};`
            return await this.commonService.querySql(taskListsql);
        } catch (err) {
            return this.exceptionService.handleError(err);
        } 
    }

    // async getCustFormTask(userInfo){//进行中审批
    //     const d = await this.getOrgBydataScope(userInfo);
    //     console.log(1234567,d);return;
    //     const roleStr =  JSON.stringify(userInfo.roleList).replace('[', '(').replace(']', ')');
    //     try {
    //         const sql1 = `select data_scope from sys_role where id in ${roleStr}`;
    //         let dataScopeList = await this.commonService.querySql(sql1);
    //         dataScopeList = dataScopeList.map((ds)=>{
    //             return ds.data_scope
    //         })
    //         const dataScopeMax = ArrayUtils.findArrayMin(dataScopeList);//找出权限范围最大的
    //         let whereUser = '';
    //         switch (dataScopeMax){
    //             case 1://全部
    //                 whereUser = '';
    //                 break;
    //             case 2://所在部门及以下
    //                 const orgInfo = await this.orgModel.findOne({where:{id:userInfo.orgId},attributes:['id','parent_ids']});
    //                 const parentids = `${orgInfo.parent_ids}${orgInfo.id},`;
    //                 const orgSql = `select id from sys_org where id=${userInfo.orgId} or parent_ids like '%${parentids}%'`;
    //                 let orgids = await this.commonService.querySql(orgSql);
    //                 orgids = orgids.map((item)=>{
    //                     return item.id
    //                 });
    //                 const orgidStr = JSON.stringify(orgids).replace('[', '(').replace(']', ')');
                    
    //                 whereUser = `and c.org_id in ${orgidStr}`;
    //                 break;
    //             case 3://所在部门
    //                 whereUser = `and c.org_id=${userInfo.orgId}`;
    //                 break;
    //             case 4://仅本人数据
    //                 whereUser = `and c.id='${userInfo.userId}'`;
    //                 break;
    //             default:
    //                 break;
    //         }
    //         const custListsql = `SELECT a.id,a.id as proc_inst_id, a.review_name, a.form_json,
    //                 DATE_FORMAT(a.start_time,'%Y-%m-%d %H:%i') as start_time,c.realname,
    //                 b.template_code, b.template_name, b.template_group, b.form_items FROM bpmn_hi_procinst a 
    //                 LEFT JOIN oa_cust_form b ON a.proc_def_id LIKE concat("%", b.template_code,':', "%") 
    //                 left join sys_user c on c.username = a.start_user_name
    //                 WHERE a.status = 2 and a.form_json IS NOT NULL ${whereUser} ORDER BY a.start_time DESC LIMIT 0, 10;`
           
    //         return await this.commonService.querySql(custListsql);
    //     } catch (err) {
    //         return this.exceptionService.handleError(err);
    //     }
    // }
    async getCustFormTask(userInfo){//进行中审批
        let whereSql = '';
        try {
            const dataScope = await this.getOrgBydataScope(userInfo);
            if(dataScope&&dataScope.error){
                return {error:'获取数据权限失败'}
            }else{
                if(dataScope.orgSql){
                    whereSql = `and c.org_id ${dataScope.orgSql}`;
                }
                if(dataScope.userSql){
                    whereSql = `and c.id ${dataScope.userSql}`;
                }
                const custListsql = `SELECT a.id,a.id as proc_inst_id, a.review_name, a.form_json,
                    DATE_FORMAT(a.start_time,'%Y-%m-%d %H:%i') as start_time,c.realname,
                    b.template_code, b.template_name, b.template_group, b.form_items FROM bpmn_hi_procinst a 
                    LEFT JOIN oa_cust_form b ON a.proc_def_id LIKE concat("%", b.template_code,':', "%") 
                    left join sys_user c on c.username = a.start_user_name
                    WHERE a.status = 2 and a.form_json IS NOT NULL ${whereSql} ORDER BY a.start_time DESC LIMIT 0, 10;`
                return await this.commonService.querySql(custListsql);
            }
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    async getOrgBydataScope(userInfo){
        const roleStr =  JSON.stringify(userInfo.roleList).replace('[', '(').replace(']', ')');
        try {
            const sql1 = `select data_scope,auth_org_ids from sys_role where id in ${roleStr}`;
            let dataScopeList = await this.commonService.querySql(sql1);
            const dataScopeArr = dataScopeList.map((ds)=>{
                return ds.data_scope
            })
            const dataScopeMax = ArrayUtils.findArrayMin(dataScopeArr);//找出权限范围最大的
            let whereUser = '';
            switch (dataScopeMax){
                case 1://全部
                    whereUser = '';
                    break;
                case 2://所在部门及以下
                    const orgSql = `select id from sys_org where id=${userInfo.orgId} or parent_ids like '%,${userInfo.orgId},%'`;
                    let orgids = await this.commonService.querySql(orgSql);
                    orgids = orgids.map((item)=>{
                        return item.id
                    });
                    whereUser = {orgSql:`in (${orgids.join(',')})`};
                    break;
                case 3://所在部门
                    whereUser = {orgSql:` = ${userInfo.orgId}`};
                    break;
                case 4://仅本人数据
                    whereUser = {userSql:`="${userInfo.userId}"`};
                    break;
                case 5://可见部门数据
                    let arr = [];
                    for(let i=0;i<dataScopeList.length;i++){
                        if(dataScopeList[i].data_scope===5){
                            const item = dataScopeList[i].auth_org_ids;
                            const itemArr = item.split(',');
                            for(let j=0;j<itemArr.length;j++){
                                if(arr.indexOf(itemArr[j])===-1){//不存在则push
                                    arr.push(itemArr[j]);
                                }
                            }
                        }
                    }
                    whereUser = {orgSql:` in (${arr.join(',')})`};
                    break;
                default:
                    break;
            }
            return whereUser;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    

}