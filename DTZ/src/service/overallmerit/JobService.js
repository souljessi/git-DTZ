import moment from 'moment';

export default class extends think.Service {
    constructor() {
        super();
        this.caseModel = this.db['a_case'];
        this.orgModel = this.db['sys_org']
        this.userModel = this.db['sys_user'];
        this.roleModel = this.db['sys_role'];
        this.roleUserModel = this.db['sys_role_user'];
        this.userModel.belongsToMany(this.roleModel, {
            through:this.roleUserModel,foreignKey:'userid',otherKey:'roleid'
        })
    }
    /**
     * 获取部门及用户（根据用户角色）
     */
    async getDepartAndUser(data){
        try{
            const userList = await this.userModel.findAll({
                attributes:['id','username','realname','org_id'],
                include:[
                    {model:this.roleModel,where:{rolecode:data.userRole},attributes:[]}
                ]
            });
            const orgList = await this.orgModel.findAll({attributes:['id','org_name','org_code','parent_id']});
            return {userList:userList,orgList:orgList};
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 根据角色编码获取人员列表
     * @param {*} data 
     */
    async getAllUserByRoleCode(data){
        try{
            return await this.userModel.findAll({
                attributes:['id','username','realname','org_id'],
                include:[
                    {model:this.roleModel,where:{rolecode:data.userRole},attributes:[]}
                ]
            });
        }catch(err){
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 信息采集员岗位评价
     * @param {} data 
     */
    async getCollectEvalList(data){
        let createDateStr = '';
        let verifyDateStr = '';
        let caseCreateDateStr = '';
        const userIDsStr = JSON.stringify(data.userList).replace('[','(').replace(']',')');
        try{
            const dateSource = await this.getRangeDate(data);
            if(typeof(dateSource.date)!=='string'){
                verifyDateStr = ` and DATE_FORMAT(d.verify_date,'${dateSource.dateFormat}')>='${dateSource.date[0]}' 
                and DATE_FORMAT(d.verify_date,'${dateSource.dateFormat}')<='${dateSource.date[1]}'`;
                createDateStr = ` and DATE_FORMAT(d.create_date,'${dateSource.dateFormat}')>='${dateSource.date[0]}' 
                and DATE_FORMAT(d.create_date,'${dateSource.dateFormat}')<='${dateSource.date[1]}'`;
                caseCreateDateStr = ` and DATE_FORMAT(e.create_date,'${dateSource.dateFormat}')>='${dateSource.date[0]}' 
                and DATE_FORMAT(e.create_date,'${dateSource.dateFormat}')<='${dateSource.date[1]}'`;
            }else{
                verifyDateStr = ` and DATE_FORMAT(d.verify_date,'${dateSource.dateFormat}')='${dateSource.date}'`;
                createDateStr = ` and DATE_FORMAT(d.create_date,'${dateSource.dateFormat}')='${dateSource.date}'`;
                caseCreateDateStr = ` and DATE_FORMAT(e.create_date,'${dateSource.dateFormat}')='${dateSource.date}'`;
            }
            const sql = `SELECT res.*, FORMAT(res.ownECCount/res.ownECount*100,2) as onECRate,FORMAT(res.onVerifyCount/res.verifyCount*100,2) as onVerifyRate from 
                    (SELECT a.id,a.username,a.realname,a.phone,'${dateSource.rangeDate}' as rangeDate,
                        count(case when d.verify_by = a.id and d.is_check!=0 ${verifyDateStr} then 1 ELSE null end) as 'verifyCount',
                        count(case when d.verify_by = a.id and d.is_check!=0 ${verifyDateStr} and 
                            round(TIMESTAMPDIFF(minute,d.update_date,d.verify_date),2)<30 then 1 ELSE null end) as 'onVerifyCount',
                        count(case when e.id=d.id and e.create_by=a.id ${caseCreateDateStr} then 1 ELSE null end) as 'ownECCount',
                        count(case when d.create_by=a.id ${createDateStr} then 1 ELSE null end) as 'ownECount'
                        from sys_user a
                        LEFT JOIN cms_event d on (d.create_by=a.id or d.verify_by = a.id) 
                        left join oa_case e on e.id = d.id
                        where a.id in ${userIDsStr} group by a.id) as res;`

            const sql2 = `SELECT res.*, FORMAT(res.userCount/res.orgCount*100,2) as activeRate from
                        (SELECT a.id, count( CASE WHEN e.DeptCode1 = b.id ${caseCreateDateStr} THEN 1 ELSE NULL END ) AS 'orgCount', 
                        count( CASE WHEN f.create_by = a.id AND f.id = e.id ${caseCreateDateStr} THEN 1 ELSE NULL END ) AS 'userCount' 
                        FROM sys_user a 
                        LEFT JOIN sys_org b ON b.id = a.org_id 
                        LEFT JOIN oa_case e ON e.DeptCode1 = b.id 
                        LEFT JOIN cms_event f ON f.id = e.id 
                        WHERE a.id IN ${userIDsStr} GROUP BY a.id) as res;`
            let countList = await this.commonService.querySql(sql);
            const orgCountList = await this.commonService.querySql(sql2);
            for(var i=0;i<countList.length;i++){
                for(var j=0;j<orgCountList.length;j++){
                    if(countList[i].id===orgCountList[j].id){
                        countList[i] = Object.assign(countList[i],orgCountList[j]);
                    }
                }
            }
            return countList;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 受理人员岗位评价
     * @param {*} data 
     */
    async getCenterPerEvalList(data){
        let createDateStr = '';
        let verifyDateStr = '';
        let endDateStr = '';
        const userIDsStr = JSON.stringify(data.userList).replace('[','(').replace(']',')');
        try{
            const dateSource = await this.getRangeDate(data);
            if(typeof(dateSource.date)!=='string'){
                verifyDateStr = ` and DATE_FORMAT(b.verify_date,'${dateSource.dateFormat}')>='${dateSource.date[0]}' 
                and DATE_FORMAT(b.verify_date,'${dateSource.dateFormat}')<='${dateSource.date[1]}'`;
                createDateStr = ` and DATE_FORMAT(b.create_date,'${dateSource.dateFormat}')>='${dateSource.date[0]}' 
                and DATE_FORMAT(b.create_date,'${dateSource.dateFormat}')<='${dateSource.date[1]}'`;
                endDateStr = ` and DATE_FORMAT(b.end_time,'${dateSource.dateFormat}')>='${dateSource.date[0]}' 
                and DATE_FORMAT(b.end_time,'${dateSource.dateFormat}')<='${dateSource.date[1]}'`;
            }else{
                verifyDateStr = ` and DATE_FORMAT(b.verify_date,'${dateSource.dateFormat}')='${dateSource.date}'`;
                createDateStr = ` and DATE_FORMAT(b.create_date,'${dateSource.dateFormat}')='${dateSource.date}'`;
                endDateStr = ` and DATE_FORMAT(b.end_time,'${dateSource.dateFormat}')='${dateSource.date}'`;
            }
            const sql1 = `SELECT res.*, FORMAT(res.onTaskCount/res.taskCount*100,2) as taskRate from 
                (SELECT a.id, a.username, a.realname, a.phone, '${dateSource.rangeDate}' AS rangeDate, 
                count( CASE WHEN b.task_status = 1 ${endDateStr} THEN 1 ELSE NULL END ) AS 'taskCount', 
                count( CASE WHEN b.task_status = 1 AND b.duration < 1800 ${endDateStr} THEN 1 ELSE NULL END ) AS 'onTaskCount' 
                FROM sys_user a 
                LEFT JOIN bpmn_hi_taskinst b ON b.assignee = a.username 
                WHERE a.id IN ${userIDsStr} GROUP BY a.id) as res;`
            const sql2 = `SELECT res.*, FORMAT(res.onECCount/res.eventCaseCount*100,2) as ECRate from
                (SELECT a.id,count( CASE WHEN b.create_by = a.id ${createDateStr} THEN 1 ELSE NULL END ) AS 'caseCount', 
                count( CASE WHEN b.create_by = a.id AND b.id = c.id ${createDateStr} THEN 1 ELSE NULL END ) AS 'eventCaseCount', 
                count( CASE WHEN b.create_by = a.id AND b.id = c.id AND round( TIMESTAMPDIFF( MINUTE, c.verify_date, b.create_date ), 2 ) < 30 ${createDateStr} THEN 1 ELSE NULL END ) AS 'onECCount' 
                FROM sys_user a 
                LEFT JOIN oa_case b ON b.create_by = a.id 
                LEFT JOIN cms_event c ON c.id = b.id 
                WHERE a.id IN ${userIDsStr} GROUP BY a.id ) as res;`
            const sql3 = `SELECT res.*, FORMAT(res.onVECount/res.verifyEventCount*100,2) as VERate from
                (SELECT a.id,count(case when b.verify_by = a.id and b.is_check!=0 ${verifyDateStr} then 1 ELSE null end) as 'verifyEventCount',
                count(case when b.verify_by = a.id and b.is_check!=0 and round(TIMESTAMPDIFF(minute,b.update_date,b.verify_date),2)<30  ${verifyDateStr} then 1 ELSE null end) as 'onVECount'
                from sys_user a
                LEFT JOIN cms_event b on b.verify_by = a.id
                where a.id in ${userIDsStr} group by a.id) as res;`
            let caseTaskList = await this.commonService.querySql(sql1);
            const caseCountList = await this.commonService.querySql(sql2);
            const eventCountList = await this.commonService.querySql(sql3);
            for(var i=0;i<caseTaskList.length;i++){
                for(var j=0;j<caseCountList.length;j++){
                    if(caseTaskList[i].id===caseCountList[j].id){
                        caseTaskList[i] = Object.assign(caseTaskList[i],caseCountList[j])
                    }
                }
                for(var k=0;k<eventCountList.length;k++){
                    if(caseTaskList[i].id===eventCountList[k].id){
                        caseTaskList[i] = Object.assign(caseTaskList[i],eventCountList[k])
                    } 
                }
            }
            return caseTaskList;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }
    /**
     * 导出信息采集员评价excel
     * @param {*} data 
     */
    async exportCollector(data){
        let rows = [];
        const tabHead = [
            '采集员姓名','手机号码','及时核实次数','核实次数','及时核实率','及时核实级别',
            '上报立案次数','部门立案次数','主动上报信息率','主动上报级别','主动上报立案次数',
            '主动上报次数','信息准确率','信息准确级别','评价时间'
        ];
        rows.push(tabHead);
        const tabRow =  [
            'realname',
            'phone',
            'onVerifyCount',
            'verifyCount',
            'onVerifyRate',
            'verifyLevel',
            'userCount',
            'orgCount',
            'activeRate',
            'activeLevel',
            'ownECCount',
            'ownECount',
            'onECRate',
            'onECLevel',
            'rangeDate'
        ];
        const list = await this.getCollectEvalList(data);
        if(list.length>0){
            for(var i in list){
                let row = list[i];
                row.verifyLevel = this.gradeLevel(row.onVerifyRate);
                row.activeLevel = this.gradeLevel(row.activeRate);
                row.onECLevel = this.gradeLevel(row.onECRate);
                let arr =[];
                for(var j in tabRow){
                    const key =tabRow[j];
                    if(row[key]!==null){
                        arr[j]=row[key];
                    }else{
                        arr[j]='--';
                    }
                }
                rows.push(arr);
            }
        }
        return rows; 
    }

    /**
     * 导出受理人员评价列表excel
     */
    async exportCenterPerson(data){
        let rows = [];
        const tabHead = [
            '受理员姓名','手机号码','派遣核实次数','及时核实次数','及时派遣核实率',
            '及时派遣核实级别', '批转案卷数','及时批转案卷数','案卷批转及时率',
            '案卷批转级别','发起立案次数','事件立案次数','事件及时立案次数',
            '事件及时立案率','事件及时立案级别','评价时间'
        ];
        rows.push(tabHead);
        const tabRow =  [
            'realname',
            'phone',
            'verifyEventCount',
            'onVECount',
            'VERate',
            'VELevel',
            'taskCount',
            'onTaskCount',
            'taskRate',
            'taskLevel',
            'caseCount',
            'eventCaseCount',
            'onECCount',
            'ECRate',
            'ECLevel',
            'rangeDate'
        ];
        const list = await this.getCenterPerEvalList(data);
        if(list.length>0){
            for(var i in list){
                let row = list[i];
                row.VELevel = this.gradeLevel(row.VERate);
                row.taskLevel = this.gradeLevel(row.taskRate);
                row.ECLevel = this.gradeLevel(row.ECRate);
                let arr =[];
                for(var j in tabRow){
                    const key =tabRow[j];
                    if(row[key]!==null){
                        arr[j]=row[key];
                    }else{
                        arr[j]='--';
                    }
                }
                rows.push(arr);
            }
        }
        return rows; 
    }
    //导出报表excel
    async exportExcel(data) {
        if(data.userRole==='cjy'){
            return this.exportCollector(data);
        }else{
            return this.exportCenterPerson(data);
        }
        
    }
    
    getRangeDate(data){
        let dateFormat = '%Y-%m-%d';
        let date = new Date();
        let rangeDate = '';
        switch(Number(data.cycle)){
            case 1:
            dateFormat = '%Y';
            date = data.rangeDate.substr(0,4);
            rangeDate = `${date}`;
            break;
            case 2:
            dateFormat = '%Y-%m';
            date = data.rangeDate.substr(0,7);
            rangeDate = `${date}`
            break;
            case 3:
            dateFormat = '%Y-%u';
            const week = this.initSearchMajorChanges(data.rangeDate);
            date = [week.monday,week.sunday]
            rangeDate = `${date[0]}—${date[1]}`;
            break;
            case 4:
            dateFormat = '%Y-%m-%d';
            date = data.rangeDate;
            rangeDate = `${date}`;
            break;
            case 5:
            dateFormat = '%Y-%m-%d';
            date = data.rangeDate2;
            rangeDate = `${date[0]}—${date[1]}`;
            break;
            default:
            break;
        }
        return {date:date,dateFormat:dateFormat,rangeDate:rangeDate};
    }


    /**
     * 根据传入日期获取周一周日
     * */
    initSearchMajorChanges(dateStr){
        //实现当前日期对应周一，周日
        const vNowDate=moment(new moment(dateStr).format("YYYY-MM-DD"));//.add('month',0).add('days',-1);
        const vWeekOfDay=moment(vNowDate).format("E");//算出这周的周几
        const vWeekOfDays=7-vWeekOfDay;
        const vStartDate=moment(vNowDate).add('days',-vWeekOfDay+1).format("YYYY-MM-DD");//周一
        const vEndDate=moment(vNowDate).add('days',vWeekOfDays).format("YYYY-MM-DD");//周日
        return {monday:vStartDate,sunday:vEndDate};
    }

    
    gradeLevel(value){
        let level = 'A';
        if(value===null){
            level = '-';
        }else{
            const val = parseFloat(value);
            switch (true){
                case val>=0&&val<=80:
                level ='E';
                break;
                case val>80&&val<=85:
                level ='D';
                break;
                case val>85&&val<90:
                level ='C';
                break;
                case val>90&&val<=95:
                level ='B';
                break;
                case val>95&&val<=100:
                level ='A';
                break;
                default:
                level='-'
                break;
            }
        }
        return level;
    }

    
}
