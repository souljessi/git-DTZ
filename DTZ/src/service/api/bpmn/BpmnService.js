export default class  extends think.Service   {
    constructor() {
        super();
        this.serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
        this.db['bpmn_hi_taskinst'].belongsTo(this.db['sys_user'], {
            foreignKey: 'assignee',
            targetKey: 'username'
        });
        this.db['bpmn_hi_procinst'].belongsTo(this.db['sys_user'], {
            foreignKey: 'start_user_name',
            targetKey: 'username'
        });
        this.pushServerUrl=think.config('pushServerUrl')
    }



    /**
     * 自定义表单首页列表
     * @returns
     */
    async getHomeFormList(user) {
        let _this = this;
        try {
            const typeSql=`SELECT sys_type.typecode,sys_type.typename from 	sys_type_group LEFT JOIN sys_type ON sys_type_group.id = sys_type.typegroupid
                            WHERE	sys_type_group.typegroupcode = 'bdfz'`;
            const ModelSql=`select  a.id,a.name as template_name,a.key as template_code,a.template_group,CONCAT('${this.serverIP}',a.icon_path) as template_icon from bpmn_re_procdef a INNER JOIN (select c.key ,max(c.rev) as rev from bpmn_re_procdef c GROUP BY  c.key   ) b 
                        on a.key=b.key and a.rev=b.rev INNER JOIN bpmn_re_deployment on bpmn_re_deployment.id=a.deployment_id and bpmn_re_deployment.is_hang=1
                        right JOIN bpmn_procdef_org on bpmn_procdef_org.org_id=${user.orgId} and bpmn_procdef_org.proc_def_id=a.id
                        where a.is_custom_tem=1 and form_type=1`;
            let typeList=await _this.commonService.querySql(typeSql);
            let ModelList=await _this.commonService.querySql(ModelSql);
            for(let i=0;i<typeList.length;i++){
                typeList[i].template=[];
                for(let j=0;j<ModelList.length;j++){
                    if(typeList[i].typecode==ModelList[j].template_group){
                        typeList[i].template.push(ModelList[j])
                    }
                }
            }

            return typeList;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }

    /**
     * 自定义表单详情
     * @returns
     */
    async getFormInfo(id) {
        let _this = this;
        let result={};
        try {
            const sql=`select id,bpmn_re_procdef.name as template_name,bpmn_re_procdef.key as template_code,form_items,CONCAT('${this.serverIP}',icon_path) as icon_path from bpmn_re_procdef
                where id='${id}'`;
            let info=await _this.commonService.querySql(sql,{type: this.db.sequelize.QueryTypes.SELECT});
            if(info.length!=0){
                result=info[0]
            }
            return result;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }
//待我审批，我已审批，我发起的审批
    async getMyApprove(sourceUserId,targetUserId,keywords,label,type,applyStatus,page,pageSize) {
        let _this = this;
        let db=this.db;
        let start = (page - 1) * pageSize;
        let typeStr='',approveStr='',str ='',sql='',sqlCount='',searchStr='';
        if(keywords){
            searchStr=`and bpmn_hi_procinst.review_name like '%${keywords}%'`
        }
        if(type){
            typeStr=`and  bpmn_re_procdef.key='${type}'`
        }
        if(targetUserId){
            const roleUser=await db['sys_role_user'].findAll({where:{userid:targetUserId}});
            for(let i=0;i<roleUser.length;i++){
                str+=`or (bpmn_hi_actinst.group like '%${roleUser[i].dataValues.roleid}%' AND bpmn_hi_actinst.proc_inst_id = bpmn_hi_procinst.id)`
            }

            if(label==0){
                approveStr='act_status=0'
            }else{
                if(applyStatus==='0'){
                    approveStr=' act_status=1 and bpmn_hi_procinst.STATUS =2'
                }else if(applyStatus=='1'){
                    approveStr=' act_status=1 and bpmn_hi_procinst.STATUS !=2'
                }else{
                    approveStr=' act_status=1'
                }
            }
             sql = `select  bpmn_hi_procinst.form_json,bpmn_re_procdef.form_type,bpmn_hi_procinst.id,bpmn_hi_procinst.start_time,bpmn_hi_procinst.review_name,sys_user.realname,CONCAT('${this.serverIP}/',sys_user.pic_path) as pic_path,bpmn_hi_procinst.STATUS,	
             CASE bpmn_hi_procinst.STATUS when 0 then  '审批拒绝' when 1 then  '审批同意' when 2  then '审批中' else '' end as statusName from bpmn_hi_actinst
				   left join bpmn_hi_procinst ON (bpmn_hi_actinst.assignee like '%${targetUserId}%'  AND bpmn_hi_actinst.proc_inst_id = bpmn_hi_procinst.id) 
                   ${str}  inner join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id  ${typeStr} 
                   left JOIN sys_user on bpmn_hi_procinst.start_user_name=sys_user.username 
                   WHERE ${approveStr} ${searchStr} group by bpmn_hi_procinst.id order by start_time desc limit ${start},${pageSize}`;
             sqlCount = `select count(*) count from (select count(*) count from bpmn_hi_actinst left join bpmn_hi_procinst ON (bpmn_hi_actinst.assignee like '%${targetUserId}%'  
                        AND bpmn_hi_actinst.proc_inst_id = bpmn_hi_procinst.id)  
				            ${str} inner join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id   ${typeStr} 
				            WHERE ${approveStr} ${searchStr}  group by bpmn_hi_procinst.id ) a`
        }else if(sourceUserId){
            const roleUser=await db['sys_user'].findAll({where:{id:sourceUserId}});
            sql = `select  bpmn_hi_procinst.form_json,bpmn_re_procdef.form_type,bpmn_hi_procinst.id,bpmn_hi_procinst.start_time,bpmn_hi_procinst.review_name,sys_user.realname,CONCAT('${this.serverIP}/',sys_user.pic_path) as pic_path,bpmn_hi_procinst.status from bpmn_hi_procinst
                 	inner join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id  ${typeStr} 
                   left JOIN sys_user on bpmn_hi_procinst.start_user_name=sys_user.username
                   WHERE start_user_name = '${roleUser[0].username}' ${searchStr} 
                    group by bpmn_hi_procinst.id order by start_time desc limit ${start},${pageSize}`;
            sqlCount = `select count(*) count from bpmn_hi_procinst
                        inner join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id and bpmn_re_procdef.is_custom_tem=1 ${typeStr} 
                       left JOIN sys_user on bpmn_hi_procinst.start_user_name=sys_user.username   WHERE start_user_name = '${roleUser[0].username}'  ${searchStr} `
        }

        let procInstArr = await _this.commonService.querySql(sql);
        let arr=[];
        for(let i in procInstArr){
            let html='';
            if(procInstArr[i].form_type==1&&procInstArr[i].form_json!=''&&procInstArr[i].form_json!=null){
                let itemObj=JSON.parse(procInstArr[i].form_json);
                let html='';
                let index=0;
                for(let j of itemObj){
                    if(j.listShow&&index<3){
                        html+=this.getFormJsonValue(j)
                    }else{
                        break;
                    }
                }
                procInstArr[i].formContent=html;
                arr.push(procInstArr[i])
            }else if(procInstArr[i].form_type==3){
                let sql = `SELECT	oa_case.DeptName1,oa_case.ObjPosition,oa_case.case_code,oa_case.parent_name,oa_case.sub_name,oa_case.create_by,oa_case.remarks,sys_user.realname,u.realname update_name,oa_case.create_date,oa_case.update_date
                                FROM oa_case LEFT JOIN sys_user on sys_user.id=oa_case.create_by LEFT JOIN sys_user u on u.id=oa_case.update_by where oa_case.proc_inst_id= ${procInstArr[i].id}`;
                let caseModel = await _this.commonService.querySql(sql);
                if(caseModel.length>0){
                    procInstArr[i].formContent='<p>案件编号:'+caseModel[0].case_code+'</p><p>事发位置:'+caseModel[0].ObjPosition+'</p><p></p>描述:'+caseModel[0].remarks+'</p>'
                    arr.push(procInstArr[i])
                }

            }else{
                procInstArr[i].formContent='';
                arr.push(procInstArr[i])
            }

        }
        const procInstCount = await _this.commonService.querySql(sqlCount);
        if(procInstCount.length==0){
            return {rows: [], count: 0}
        }else{
            return {rows: arr, count: procInstCount[0].count}
        }

    }


    getFormJsonValue(element){
        if(element.type=='m-radio'){
            return '<p>'+element.label+':'+element.value.name+'</p>';
        }else  if(element.type=='m-datetime-range'){
            return '<p>开始时间:'+element.value.begin+'</p>'+'<p>结束时间:'+element.value.end+'</p><p>时长('+element.value.intervalUnit+'):'+element.value.interval+'</p>'
        }else if(element.type=='m-datetime'){
            return '<p>'+element.label+':'+element.value+'</p>';
        }else if(element.type=='m-textarea'){
            return '<p>'+element.label+':'+element.value.text+'</p>';
        }else if(element.type=='m-switch'){
            let value=''
            if(element.value=='false'){
                value='否'
            }else{
                value='是'
            }
            return '<p>'+element.label+':'+value+'</p>';
        }else if(element.type=='m-scan'){
            return '<p>'+element.label+':'+element.value+'</p>';
        }else if(element.type=='m-checkbox'){
            return '<p>'+element.label+':'+element.value[0].name+'</p>';
        }else if(element.type=='m-upload-file'){2
            return '<p>'+element.label+':'+element.value[0].realpath+'</p>';
        }else if(element.type=='m-upload-img'){
            return '<p>'+element.label+':'+element.value[0].url+'</p>';
        }else if(element.type=='m-select-person'){
            return '<p>'+element.label+':'+element.value[0].realname+'</p>';
        }else if(element.type=='m-input'){
            return '<p>'+element.label+':'+element.value+'</p>';
        }else if(element.type=='m-gps-point'){
            return '<p>'+element.label+':'+element.value.address+'</p>';
        }else if(element.type=='m-select-area'){
            return '<p>'+element.label+':'+element.value.name+'</p>';
        }
    }
    /**
     * 表单提交
     * @returns
     */
    async submitForm(userId,formId,data) {
        let _this = this;
        let result={};
        try {
            const userModel=await this.db['sys_user'].findAll({where:{id:userId}});
            const procdef= await this.db['bpmn_re_procdef'].findAll({where:{id:formId}});
            let procInstModel={
                proc_def_id:formId,
                start_time:new Date(),
                review_name:userModel[0].realname+'的'+procdef[0].name,
                start_user_name:userModel[0].username,
                overtime:procdef[0].overtime,
                status:2,
                form_json:data
            };
            const procModelArr = await this.db['bpmn_re_procmodel'].findAll({where:{proc_def_id:procdef[0].id}});
            const procInst=await this.commonService.save(this.db['bpmn_hi_procinst'], procInstModel);
             const backLogsUserIds=await this.startActinst(procdef[0],procModelArr,procInst);
            const tableName=this.startTask(procdef[0],procModelArr,procInst);
            this.pushDataToBacklogPeople(backLogsUserIds,procdef[0].dataValues.form_type,data,procInstModel.review_name,procInst.dataValues.id);
           let obj= this.pushDataToWebBacklogPeople(backLogsUserIds,procdef[0].dataValues.form_type,data,procInstModel.review_name,procInst.dataValues.id,userId);
            return obj;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }

    //开始流程节点
    async startActinst(proc,arr,procInst){
        let obj={};
        let startId='';
        let actArr=[];
        let flow=[];
        for(let i of arr){
            obj[i.proc_element_id]=i;
            if(i.act_type=='StartEvent'){
                startId=i.proc_element_id;
                actArr=i
            }else if (i.act_type=='SequenceFlow'){
                flow.push(i)
            }
        }
        let procModelArr=this.getActInstList(startId,flow,obj,{});
        let db=this.db;
        let arrs=[];
        let userIds=[];
        for(let i in procModelArr){
            let actinst={
                proc_def_id:proc.id,
                task_def_key:proc.key,
              proc_inst_id:procInst.id,
                act_name:procModelArr[i].act_name,
                act_type:procModelArr[i].act_type,
                proc_element_id:procModelArr[i].proc_element_id,
                approve_type:'',
                description:'',
                owner:'',
                assignee:'',
                start_time:new Date(),
                duration:0,
            };
            if(procModelArr[i].act_type=='UserTask'){
                actinst.act_status=0;
                //if(procModelArr[i].assignee!='""'){
                //     let itemArr=JSON.parse(procModelArr[i].assignee);
                //     for(let i=0;i<itemArr.length;i++){
                //         userIds.push(itemArr[i])
                //     }
                // }else
                if(procModelArr[i].candidate_users!=''){
                    let itemArr=JSON.parse(procModelArr[i].candidate_users);
                    for(let i=0;i<itemArr.length;i++){
                        userIds.push(itemArr[i])
                    }
                    actinst.assignee=procModelArr[i].candidate_users
                }else if(procModelArr[i].candidate_group!=''){
                    actinst.group=procModelArr[i].candidate_group;
                    let userList = await db['sys_role_user'].findAll({where:{roleid:['in',actinst.group]}})
                    userList.forEach(item=>{
                        userIds.push(item.userid)
                    })
                }else if(procModelArr[i].depart!=''){
                    let departArr=JSON.parse(procModelArr[i].depart);
                    let orgArr=await this.db['sys_org'].findAll({where:{id:departArr}});
                    let userArr=[];
                    orgArr.forEach(item=>{
                        if(item.primary_person!=null){
                            let arr=item.primary_person.split(',')
                            arr.forEach(param=>{
                                userArr.push(param)
                            })
                        }
                        if(item.deputy_person!=null){
                            let arr=item.deputy_person.split(',')
                            arr.forEach(param=>{
                                userArr.push(param)
                            })
                        }

                    })
                    actinst.assignee=JSON.stringify(userArr)

                }
                actinst.approve_type=procModelArr[i].approve_type;
                arrs.push(actinst)
            }else{
                actinst.end_time=new Date();
                actinst.act_status=1;
                arrs.push(actinst)
            }
        }
       const actinst=await this.commonService.saveMany(db['bpmn_hi_actinst'],arrs);

        return userIds;
    }
    /**
     * 得到审批人
     * @returns
     */
    async getApprover(formId) {
        let _this = this;
        try {
            const procModelArr = await this.db['bpmn_re_procmodel'].findAll({where:{proc_def_id:formId}});
            let obj={};
            let startId='';
            let actArr=[];
            let flow=[];
            for(let i of procModelArr){
                obj[i.proc_element_id]=i;
                if(i.act_type=='StartEvent'){
                    startId=i.proc_element_id;
                    actArr=i
                }else if (i.act_type=='SequenceFlow'){
                    flow.push(i)
                }
            }
            let userArr=[];
            let userIdArrs=[];
            let groupArrs=[];
            let procArr=this.getApproverList(startId,flow,obj,{});
            for(let i in procArr){
                let  actinst={};
                if(procArr[i].act_type=='UserTask'){
                        if(procArr[i].candidate_users!=''){
                        let itemArr=JSON.parse(procArr[i].candidate_users);
                        for(let k in itemArr){
                            userIdArrs.push("'"+itemArr[k]+"'");
                        }
                    }else if(procArr[i].candidate_group!=''){
                        let itemArr=JSON.parse(procArr[i].candidate_group)?JSON.parse(procArr[i].candidate_group):procArr[i].candidate_group;
                        for(let k in itemArr){
                            groupArrs.push("'"+itemArr[k]+"'");
                        }
                    }
                }
            }
            if(groupArrs.length>0){
                let sql=`select * from sys_role_user where roleid in (${groupArrs})`;
             let  roleUserArr=await this.commonService.querySql(sql);
             for(let i in roleUserArr){
                 userIdArrs.push("'"+roleUserArr[i].userid+"'")
             }
            }
            let sql=`select id,realname,CONCAT('${this.serverIP}/',sys_user.pic_path) as pic_path from sys_user where id in (${userIdArrs})  `;
          userArr=await await this.commonService.querySql(sql);
            return userArr
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }

    //得到审批人列表
    getApproverList(id,arr,obj,procObj){
        for(let i=0;i<arr.length;i++){
            if(arr[i].source_ref==id){
                let type=obj[arr[i].target_ref].act_type;
                procObj[arr[i].proc_element_id]=obj[arr[i].proc_element_id];
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='UserTask'){
                    procObj[index]=item;

                }else if(type=='ExclusiveGateway'){
                    procObj[index]=item;

                }else if(type=='EndEvent'){
                    procObj[index]=item;

                }else {
                    procObj[index]=item;
                    this.getApproverList(arr[i].target_ref,arr,obj,procObj)
                }
            }
        }
        return procObj;
    }
    //得到流程实例列表
    getActInstList(id,arr,obj,procObj) {
        procObj[id]=obj[id];
        for(let i=0;i<arr.length;i++){
            if(arr[i].source_ref==id){
                let type=obj[arr[i].target_ref].act_type;
                procObj[arr[i].proc_element_id]=obj[arr[i].proc_element_id];
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='UserTask'){
                    procObj[index]=item;

                }else if(type=='ExclusiveGateway'){
                    procObj[index]=item;

                }else if(type=='EndEvent'){
                    procObj[index]=item;

                }else {
                    procObj[index]=item;
                    this.getActInstList(arr[i].target_ref,arr,obj,procObj)
                }
            }
        }
        return procObj;
    }
    //开始历史任务
    async startTask(proc,arr,procInst){
        let _this=this;
        let db=this.db;
        let obj={};
        let startId='';
        let actArr=[];
        let flow=[];
        try {
            for(let i of arr){
                obj[i.proc_element_id]=i;
                if(i.act_type=='StartEvent'){
                    startId=i.proc_element_id;
                    actArr=i
                }else if (i.act_type=='SequenceFlow'){
                    flow.push(i)
                }
            }
            let procModelArr=this.getTaskInstList(startId,flow,obj,{});
            let arrs=[];
            let tableObj={};
            for(let i in procModelArr){
                let taskModel={
                    proc_def_id:proc.id,
                    task_def_key:proc.key,
                    proc_inst_id:procInst.id,
                    act_type:procModelArr[i].act_type,
                    proc_element_id:procModelArr[i].proc_element_id,
                    name:procModelArr[i].act_name,
                    description:'',
                    owner:'',
                    result:null,
                    assignee:'',
                    start_time:new Date(),
                };
                if(procModelArr[i].act_type=='StartEvent'){
                    taskModel.end_time=new Date();
                    taskModel.task_status=1;
                    taskModel.duration=0;
                    arrs.push(taskModel)
                }else if(procModelArr[i].act_type=='UserTask'){
                    if(!tableObj[procModelArr[i].form]){
                        tableObj[procModelArr[i].form]=procModelArr[i].form;
                    }
                    taskModel.task_status=0;
                    taskModel.result=2;
                    arrs.push(taskModel)
                }
            }
            const task=await this.commonService.saveMany(db['bpmn_hi_taskinst'],arrs);
            return tableObj;
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }

    }
    //得到流程任务列表
    getTaskInstList(id,arr,obj,procObj){
        procObj[id]=obj[id];
        for(let i=0;i<arr.length;i++){
            if(arr[i].source_ref==id){
                let type=obj[arr[i].target_ref].act_type;
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='UserTask'){
                    procObj[index]=item;

                }else if(type=='ExclusiveGateway'){
                    procObj[index]=item;

                }else if(type=='EndEvent'){
                    procObj[index]=item;

                }else {
                    procObj[index]=item;
                    this.getTaskInstList(arr[i].target_ref,arr,obj,procObj)
                }
            }
        }
        return procObj;
    }



    /**
     * 通过porcid查询审批信息
     * @param {any} data  data.id
     * @returns
     */
    async approveInfo(proc_inst_id) {
        let _this = this;
        let procinstSql=`select bpmn_hi_procinst.review_name,bpmn_hi_procinst.form_json,bpmn_re_procdef.form_type,sys_user.realname,CONCAT('${this.serverIP}/',sys_user.pic_path) as pic_path,bpmn_hi_procinst.start_time,bpmn_hi_procinst.status from bpmn_hi_procinst
            left join bpmn_re_procdef on bpmn_hi_procinst.proc_def_id=bpmn_re_procdef.id
            left join sys_user on sys_user.username=bpmn_hi_procinst.start_user_name where bpmn_hi_procinst.id=${proc_inst_id}`;
        let result={};
        try {
            let Res = await _this.commonService.querySql(procinstSql);
            if(Res.length!=0){
                if(Res[0].form_type==1){

                }else if(Res[0].form_type==3){
                    let sql = `SELECT	oa_case.id,oa_case.area_code,oa_case.baidu_x,oa_case.baidu_y,oa_case.DeptName1,cms_area.area_name,	oa_case.ObjPosition,	oa_case.case_code,	oa_case.BGID,	oa_case.case_type,	
                                oa_case.parent_name,	oa_case.sub_name,		oa_case.remarks,	CONCAT('${this.serverIP}/',u.pic_path) as pic_path,	u.realname update_name,	oa_case.create_date,	oa_case.update_date
                                FROM oa_case  LEFT JOIN sys_user u on u.id=oa_case.update_by left join cms_cell on cms_cell.BGID=oa_case.BGID
                                left join cms_area on cms_area.area_code=oa_case.area_code where oa_case.proc_inst_id= ${proc_inst_id}`;
                    let caseModel = await _this.commonService.querySql(sql);
                    let sys_attachment=await this.db['sys_attachment'].findAll({
                        where:{businesskey:caseModel[0].id},
                        attributes:[[this.db.Sequelize.fn('concat',this.serverIP+'/',this.db.Sequelize.col('realpath')),'realpath']]
                    });
                    caseModel[0].file=sys_attachment;
                    Res[0].form_json=caseModel[0];
                    Res[0].id=proc_inst_id;
                }
                result=Res[0]
            }
            return result;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }

    /**
     * 通过porcid查询案件流程信息
     * @param {any} data  data.idsdas
     * @returns
     */
    async getTaskByProcId(proc_inst_id) {
        let where = {
            proc_inst_id: proc_inst_id,
            task_status:1
        };
        //查询案件流转信息
        let result=[];
        let userList=await this.db['sys_user'].findAll({
            attributes:['username','realname',[this.db.Sequelize.fn("concat", this.serverIP+'/',this.db.Sequelize.col('pic_path')),'pic_path']]
        });
        let userObj={};
         for(let item of userList){
             userObj[item.username]=item;
         }
        let procinst=await this.db['bpmn_hi_procinst'].findOne({where: {id:proc_inst_id}});
        try {
            let Res = await this.db['bpmn_hi_taskinst'].findAll({
                where: where,
                order: [
                    ['start_time', 'ASC']
                ],
                include: [{
                    model: this.db['sys_user'],
                    attributes:['realname',[this.db.Sequelize.fn("concat", this.serverIP+'/',this.db.Sequelize.col('pic_path')),'pic_path']]
                }]
            });
                for(let item of Res){
                    let obj={};
                    obj.task_status=item.task_status;
                    obj.act_type=item.act_type;
                    obj.result=item.result;
                    obj.uploadImgs=[]
                    if(item.uploadImgs){
                        let picArr=item.uploadImgs.split(',')
                        for(let j=0;j<picArr.length;j++){
                            picArr[j]=this.serverIP+'/'+picArr[j]
                        }
                        obj.uploadImgs=picArr
                    }
                    if(item.act_type=='StartEvent'){
                        obj.icon=userObj[procinst.start_user_name].pic_path;
                        obj.realname=userObj[procinst.start_user_name].realname;
                        obj.description='发起审批';
                        obj.startTime=item.start_time;
                    }else if(item.act_type=='EndEvent'){
                        obj.duration=procinst.duration;
                        obj.endTime=item.end_time;
                    }else{
                         obj.icon=userObj[item.assignee].pic_path;
                         obj.realname=userObj[item.assignee].realname;
                         obj.description=item.description;
                        obj.startTime=item.start_time;
                        obj.endTime=item.end_time;

                    }
                    result.push(obj)
                }
        //下一步审批人
            let ActInst=[];
            if(procinst.status==2){
                ActInst=await this.db['bpmn_hi_actinst'].findAll({where:{proc_inst_id:proc_inst_id,act_status:0}});
            }
            let userIdArr=[];
            for(let i=0;i<ActInst.length;i++){
               if(ActInst[i].assignee!=''){
                    let assArr=JSON.parse(ActInst[i].assignee);
                    assArr.forEach(item=>{
                        userIdArr.push(item)
                    })
               }else if(ActInst[i].group){
                   let groupArr=JSON.parse(ActInst[i].group);
                   let userList = await db['sys_role_user'].findAll({where:{roleid:[groupArr]}})
                   userList.forEach(item=>{
                       userIdArr.push(item.userid)
                   })
               }
                if(userIdArr.length>2){
                    break;
                }
            }
            if(userIdArr.length>0){
                let actObj={
                    realname:'',
                    result:2
                };
                let userArr=await this.db['sys_user'].findAll({where:{id:[userIdArr]}});
                for(let i=0;i<userArr.length;i++){
                    actObj.realname+=',' +userArr[i].realname;
                    if(i==1){
                        break;
                    }
                }
                actObj.realname=actObj.realname.substr(1)
                if(userArr.length>2){
                    actObj.realname=actObj.realname+'……'
                }
                result.push(actObj)
            }

            return result
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }


    /**
     * 通过porcid查询等待flow流程信息
     * @param {any} data  data.id
     * @returns
     */
    async flowMsgList(proc_inst_id,userId) {
        let userRoleList=await this.db['sys_role_user'].findAll({where:{userid:userId}});
        let ret=[];
        let str='';
        for(let i=0;i<userRoleList.length;i++){
            str+=`or (act_status=0 and proc_inst_id=${proc_inst_id} and bpmn_hi_actinst.group like '%${userRoleList[i].roleid}%' )`
        }
        let sql = `select * from bpmn_hi_actinst where (act_status=0 and proc_inst_id=${proc_inst_id} and bpmn_hi_actinst.assignee like '%${userId}%') ${str} limit 0,1`;
        try {
            const Res = await this.commonService.querySql(sql);
            if(Res.length>0){
                let sql=`select b.*,${Res[0].approve_type} as approveType from bpmn_re_procmodel a right join bpmn_re_procmodel b  
                on  a.target_ref=b.source_ref and a.source_ref='${Res[0].proc_element_id}' and b.proc_def_id='${Res[0].proc_def_id}' 
                where a.id!='' and a.proc_def_id='${Res[0].proc_def_id}'`;
                ret = await this.commonService.querySql(sql)
            }

            return ret
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }


    /**
     * 表单提交
     * @returns
     */
    async submitFlowForm(flowId,option,userId,procInstId,uploadImgs,approveType) {
        let _this = this;
        let result={};
        try {
            const userModel=await this.db['sys_user'].findOne({where:{id:userId}});
            let flowModel=await  this.db['bpmn_re_procmodel'].findOne({where:{id:flowId}});
            let actSql=`select * from bpmn_hi_actinst where proc_inst_id=${procInstId} and act_status=0 and assignee like '%${userId}%' `;
            let actModels = await this.commonService.querySql(actSql);
            if(actModels.length==0){
                return {state:1}
            }
            const taskArr = await _this.db['bpmn_hi_taskinst'].findAll({ where: { proc_element_id: actModels[0].proc_element_id, proc_inst_id: procInstId, task_status: 0 } });
            let taskModel = {
                description: '【' + flowModel.act_name + '】' + option,
                assignee: userModel.username,
                end_time: new Date(),
                duration: parseInt((new Date() - new Date(taskArr[0].dataValues.start_time)) / 1000),
                task_status: 1
            };
            if(uploadImgs){
                taskModel.uploadImgs=uploadImgs;
            }
            if(approveType==2){
                if(flowModel.condition == 'false') {
                    taskModel.result = 4;

                }else{
                    taskModel.result = 3;
                }

            }else  if(flowModel.condition == 'false') {
                taskModel.result = 0;
            }else{
                taskModel.result = 1;
            }
            const userTaskAct = await _this.db['bpmn_hi_actinst'].findAll({ where: { proc_inst_id: procInstId, proc_element_id: taskArr[0].dataValues.proc_element_id } });
           const taskUpdateResult = await _this.commonService.updateById(this.db['bpmn_hi_taskinst'], taskModel, taskArr[0].id);
            let actModel = {
                end_time: new Date(),
                duration: parseInt((new Date() - new Date(userTaskAct[0].dataValues.start_time)) / 1000),
                act_status: 1
            };
            const actUpdateResult = await _this.commonService.updateByWhere(this.db['bpmn_hi_actinst'], actModel, { proc_inst_id: procInstId, proc_element_id: taskArr[0].dataValues.proc_element_id });
            const procModelArr = await _this.db['bpmn_re_procmodel'].findAll({ where: { proc_def_id: userTaskAct[0].dataValues.proc_def_id } });
            const procArr = await _this.db['bpmn_hi_procinst'].findAll({ where: { id: taskArr[0].dataValues.proc_inst_id } });
            const taskInst =await _this.executeTask(userTaskAct[0].dataValues, procModelArr, procArr, flowId,approveType);
            const procDef=await this.db['bpmn_re_procdef'].findOne({where:{id:userTaskAct[0].dataValues.proc_def_id}});
            const backLogsUserIds =await _this.executeActinst(userTaskAct[0].dataValues, procModelArr, procArr, flowId);
            const startUser=await this.db['sys_user'].findOne({where:{username:procArr[0].start_user_name}});
            this.pushDataToBacklogPeople(backLogsUserIds.userIds,procDef.form_type,procArr[0].form_json,procArr[0].review_name,userTaskAct[0].dataValues.proc_inst_id);
            let backObj= this.pushDataToWebBacklogPeople(backLogsUserIds.userIds,procDef.form_type,procArr[0].form_json,procArr[0].review_name,userTaskAct[0].dataValues.proc_inst_id,userId);
            this.pushDataToUserPeople(startUser.id,procDef.form_type,procArr[0].form_json,procArr[0].review_name,userTaskAct[0].dataValues.proc_inst_id,flowModel.act_name);
            let createObj=await this.pushDataToWebCreatePeople(startUser.id,procDef.form_type,procArr[0].form_json,procArr[0].review_name,userTaskAct[0].dataValues.proc_inst_id,flowModel.act_name,userId,flowModel.act_name);
            return {backObj:backObj,createObj:createObj,nextActinstIds:backLogsUserIds.nextActinstIds};

        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }



//往下执行流程节点
    async executeActinst(proc, arr, procArr, flowid) {
        var _this = this;
        let obj = {};
        let flow={};
        let flowArr=[];
        for (let i of arr) {
            obj[i.proc_element_id] = i;
            if (i.act_type=='SequenceFlow'){
                flowArr.push(i)
            }
            if(i.id==flowid){
                flow=i;
            }
        }
        let procModelObj = _this.getExecuteActInstList(proc.proc_element_id, arr, obj, []);
        let db = _this.db;
        let arrs = [];
        let userIds=[];
        let endStatus=0;
        let isParallelGateway=false
        procModelObj = _this.getFlowActInstList(flow.proc_element_id, arr, obj, procModelObj);
        for(let i in procModelObj ){
            let actinst = {
                proc_def_id: proc.proc_def_id,
                proc_inst_id: proc.proc_inst_id,
                act_name: procModelObj[i].act_name,
                act_type: procModelObj[i].act_type,
                assignee:'',
                approve_type:'',
                group:'',
                proc_element_id: procModelObj[i].proc_element_id,
                start_time: new Date(),
                duration: 0
            };
            if (procModelObj[i].act_type == 'UserTask') {
                actinst.act_status = 0;
                if(procModelObj[i].assignee!=''){
                    actinst.assignee=procModelObj[i].assignee;
                    let itemArr=procModelObj[i].assignee;
                    for(let k in itemArr){
                        userIds.push("'"+itemArr[k]+"'");
                    }
                }else
                if(procModelObj[i].candidate_users!=''){
                    let itemArr=JSON.parse(procModelObj[i].candidate_users);
                    for(let i=0;i<itemArr.length;i++){
                        userIds.push(itemArr[i])
                    }
                    actinst.assignee=procModelObj[i].candidate_users
                }else if(procModelObj[i].candidate_group!=''){
                    actinst.group=procModelObj[i].candidate_group;
                    let userList = await db['sys_role_user'].findAll({where:{roleid:['in',actinst.group]}})
                    userList.forEach(item=>{
                        userIds.push(item.userid)
                    })
                }else if(procModelObj[i].depart!=''){
                    let departArr=JSON.parse(procModelObj[i].depart);
                    let orgArr=await this.db['sys_org'].findAll({where:{id:departArr}});
                    let userArr=[];
                    orgArr.forEach(item=>{
                        if(item.primary_person!=null){
                            let arr=item.primary_person.split(',')
                            arr.forEach(param=>{
                                userArr.push(param)
                                userIds.push(param)
                            })
                        }
                        if(item.deputy_person!=null){
                            let arr=item.deputy_person.split(',')
                            arr.forEach(param=>{
                                userArr.push(param)
                                userIds.push(param)
                            })
                        }

                    })
                    actinst.assignee=JSON.stringify(userArr)
                }
                actinst.approve_type=procModelObj[i].approve_type;
                arrs.push(actinst);
            } else if (procModelObj[i].act_type == 'EndEvent') {
                actinst.end_time = new Date();
                actinst.act_status = 1;
                endStatus=1;
                arrs.push(actinst);
            }else if(procModelObj[i].act_type=='ParallelGateway'){
                actinst.end_time = new Date();
                isParallelGateway=true;
                actinst.act_status = 1;
                arrs.push(actinst);
            } else {
                actinst.end_time = new Date();
                actinst.act_status = 1;
                arrs.push(actinst);
            }

        }
        let   actinst=[];
        if(isParallelGateway){
            const actWaitArr = await _this.db['bpmn_hi_actinst'].findAll({ where: { proc_inst_id: proc.proc_inst_id, act_status: 0 } });
            if(actWaitArr.length>0){
                return {userIds:[],nextActinstIds:[]};
            }
        }

        actinst = await _this.commonService.saveMany(db['bpmn_hi_actinst'], arrs);

        let nextActinstIds=[];
        actinst.forEach(item=>{
            if(item.act_type=='UserTask'&&item.assignee==''&&item.group==''){
                nextActinstIds.push(item.id)
            }
        })
        return {userIds:userIds,nextActinstIds:nextActinstIds};
    }
//得到userTask往下执行的flow
    getExecuteActInstList(id, arr, obj, procObj) {
        for(let i=0;i<arr.length;i++){
            if(arr[i].source_ref==id){
                procObj[arr[i].proc_element_id]=obj[arr[i].proc_element_id];
                let type=obj[arr[i].target_ref].act_type;
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='UserTask'){
                    procObj[index]=item;

                }else if(type=='ExclusiveGateway'){
                    procObj[index]=item;

                }else if(type=='ParallelGateway'){
                    procObj[index]=item;

                }else    if(type=='EndEvent'){
                    procObj[index]=item;

                }
                else {
                    procObj[index]=item;
                    this.getExecuteActInstList(arr[i].target_ref,arr,obj,procObj)
                }
            }
        }
        return procObj;
    }
//得到往下执行的节点
    getFlowActInstList(id, arr, obj, procObj) {
        for(let i=0;i<arr.length;i++){
            if(arr[i].proc_element_id==id){
                let type=obj[arr[i].target_ref].act_type;
                procObj[arr[i].proc_element_id]=obj[arr[i].proc_element_id];
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='UserTask'){
                    procObj[index]=item;

                }else if(type=='ExclusiveGateway'){
                    procObj[index]=item;

                }else if(type=='EndEvent'){
                    procObj[index]=item;

                }else {
                    procObj[index]=item;
                    this.getExecuteActInstList(arr[i].target_ref,arr,obj,procObj)
                }
            }
        }
        return procObj;
    }
//执行历史任务
    async executeTask(proc,arr,procArr,flowid){
        let obj={};
        let flow={};
        for (let i of arr) {
            obj[i.proc_element_id] = i;
            if(i.id==flowid){
                flow=i;
            }
        }
        let _this=this;
        let procModelArr=this.getExecuteTaskInstList(proc.proc_element_id,arr,obj,[]);
        procModelArr=this.getFlowTaskInstList(flow.proc_element_id,arr,obj,procModelArr);
        let db=this.db;
        let arrs=[];
        let endStatus=0;
        for(let i in procModelArr){
            let taskModel={
                proc_def_id:proc.proc_def_id,
                proc_inst_id:proc.proc_inst_id,
                task_def_key:proc.proc_def_id.split(':')[0],
                act_type:procModelArr[i].act_type,
                proc_element_id:procModelArr[i].proc_element_id,
                name:procModelArr[i].act_name,
                description:'',
                owner:'',
                result:null,
                assignee:'',
                start_time:new Date(),
            };
            if(procModelArr[i].act_type=='EndEvent'){
                taskModel.end_time=new Date();
                taskModel.task_status=1;
                taskModel.duration=0;
                endStatus=1;
                arrs.push(taskModel)
            }else if(procModelArr[i].act_type=='UserTask'){
                taskModel.task_status=0;
                taskModel.result=2;
                arrs.push(taskModel)
            }
        }
        const actWaitArr=await this.db['bpmn_hi_taskinst'].findAll({where:{proc_inst_id:proc.proc_inst_id,task_status:0}});
        if(actWaitArr.length>0){


        }else{
            if(endStatus){
                let procModel = {
                    end_time: new Date(),
                    duration: parseInt((new Date() - new Date(procArr[0].dataValues.start_time)) / 1000),
                    status: 1
                };
                if (flow.condition == 'false') {
                    procModel.status = 0;
                }
                const procUpdateResult = await this.commonService.updateById(db['bpmn_hi_procinst'], procModel, proc.proc_inst_id);
            }
            const task=await this.commonService.saveMany(db['bpmn_hi_taskinst'],arrs);
            return task;
        }
    }
//得到userTask往下执行的flow
    getExecuteTaskInstList(id,arr,obj,procObj){
        for(let i=0;i<arr.length;i++){
            if(arr[i].source_ref==id){
                let type=obj[arr[i].target_ref].act_type;
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='UserTask'){
                    procObj[index]=item;

                }
                else if(type=='ExclusiveGateway'){

                }else if(type=='EndEvent'){
                    procObj[index]=item;

                }  else {
                    procObj[index]=item;
                    this.getExecuteTaskInstList(arr[i].target_ref,arr,obj,procObj)
                }
            }else if(arr[i].target_ref==id){
                let type=obj[arr[i].target_ref].act_type;
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='EndEvent'){
                    procObj[index]=item;
                    break;
                }
            }
        }
        return procObj;
    }
//得到往下执行的节点
    getFlowTaskInstList(id,arr,obj,procObj){
        for(let i=0;i<arr.length;i++){
            if(arr[i].proc_element_id==id){
                let type=obj[arr[i].target_ref].act_type;
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='UserTask'){
                    procObj[index]=item;

                }
                else if(type=='ExclusiveGateway'){

                } else if(type=='EndEvent'){
                    procObj[index]=item;

                }  else {
                    procObj[index]=item;
                    this.getExecuteTaskInstList(arr[i].target_ref,arr,obj,procObj)
                }
            }else if(arr[i].target_ref==id){
                let type=obj[arr[i].target_ref].act_type;
                let item=obj[arr[i].target_ref];
                let index=obj[arr[i].target_ref].proc_element_id;
                if(type=='EndEvent'){
                    procObj[index]=item;
                    break;
                }
            }
        }
        return procObj;
    }
  //端推送消息到web
    pushDataToWebBacklogPeople(backLogsUserIds,type,form,review_name,procInstId,userId){
        const userIds = backLogsUserIds;
        var mydate = new Date();
        mydate.setHours(mydate.getHours() + 8);
        let socketBody = {
            title: review_name+ ',待您审批',
            result: {
                id: procInstId,
                date: mydate.toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            },
            moduleName: 'xtbg',
            userIds: userId,
            menuUrl: 'myTask'
        };

      return {socketBody:socketBody,userIds:userIds}
    }
    //端推送消息到web
    pushDataToWebCreatePeople(backLogsUserIds,type,form,review_name,procInstId,userId,result){
        const userIds = backLogsUserIds;
        var mydate = new Date();
        mydate.setHours(mydate.getHours() + 8);
        let socketBody = {
            title: review_name+'审批申请已'+result,
            result: {
                id: procInstId,
                date: mydate.toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            },
            moduleName: 'xtbg',
            userIds: userId,
            menuUrl: 'myTask'
        };

        return {socketBody:socketBody,userIds:userIds}
    }

    //推送消息给发待办人backLogsUserIds,procdef.form_type,data,procInstModel.review_name
  async  pushDataToBacklogPeople(backLogsUserIds,type,form,review_name,procInstId){

        let data={
            userId:backLogsUserIds,
            senderId:'',
            type:11,
            id:'',
            title:review_name+',等待您的审批',
            customData: {//自定义业务数据
                id: procInstId,//业务ID – 待办事件ID
            }

        };
        if(type==1){
            data.label=1102;
            let itemObj=JSON.parse(form);
            let html='';
            let index=0;
            for(let j of itemObj){
                if(j.listShow&&index<3){
                    index++;
                    html+=this.getFormJsonValue(j);
                }else{
                    break;
                }
            }
            data.content=html;
        }else if(type==3){
            data.label=1103;
            data.title=review_name+',';
            let sql = `SELECT	oa_case.DeptName1,oa_case.ObjPosition,oa_case.case_code,oa_case.parent_name,oa_case.sub_name,oa_case.create_by,oa_case.remarks,sys_user.realname,u.realname update_name,oa_case.create_date,oa_case.update_date
                                FROM oa_case LEFT JOIN sys_user on sys_user.id=oa_case.create_by LEFT JOIN sys_user u on u.id=oa_case.update_by where oa_case.proc_inst_id= ${procInstId}`;
            let caseModel = await this.commonService.querySql(sql);
            data.content='<p>案件编号:'+caseModel[0].case_code+'</p><p>事发位置:'+caseModel[0].ObjPosition+'</p><p></p>描述:'+caseModel[0].remarks+'</p>'
        }
      this.pushDataToPhone(data)
    }
    //推送消息给发发起人
  async  pushDataToUserPeople(backLogsUserIds,type,form,review_name,procInstId,result){
      let  axios = require("axios");
      let url = this.pushServerUrl;
      let userArr=[];
        let data={
            targets:[backLogsUserIds],
            sender:'',
            type:13,
            title:'审批通知',
            objectName: 'RC:TxtMsg',
            content:review_name+'审批申请已'+result,
            customData: {//自定义业务数据
                id:procInstId,
                title:'审批通知',
            }
        };
      if(type!=3){
          data.customData.label=1102;

      }else {
          data.customData.label=1103;
      }
      let postData = {
          data: JSON.stringify(data)
      };
      axios.post(url, postData).then(function (ret) {
      }).catch(function (err) {
          console.log(err);
      });

    }
    async  pushDataToWebUserPeople(backLogsUserIds,type,form,review_name,procInstId,result,userId){
        const userIds = backLogsUserIds;
        var mydate = new Date();
        mydate.setHours(mydate.getHours() + 8);
        let socketBody = {
            title: review_name+ '审批申请已'+result,
            result: {
                id: procInstId,
                date: mydate.toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            },
            moduleName: 'xtbg',
            userIds: userId,
            menuUrl: 'myTask'
        };
        return {socketBody:socketBody,userIds:userIds}

    }
    //端推送消息到手机
    pushDataToPhone(data){
        let  axios = require("axios");
        let url = this.pushServerUrl;
        let pushData = {
            targets: data.userId,
            sender: data.senderId,
            type: data.type,
            title:data.title,
            objectName: 'RC:TxtMsg',
            content: data.content,
            customData: {
                id:data.customData.id,
                title:data.title,
                label:data.label
            }
        };
        let postData = {
            data: JSON.stringify(pushData)
        };
        axios.post(url, postData).then(function (ret) {
        }).catch(function (err) {
            console.log(err);
        });

    }


    /**
     * 表单提交
     * @returns
     */
    async queryUserTaskByEventID(id) {
        let _this = this;
        try {
            let sql = `SELECT bpmn_hi_taskinst.*,CONCAT('${this.serverIP}',createUser.pic_path) as create_icon,
                        createUser.realname as create_realname ,CONCAT('${this.serverIP}',taskUser.pic_path) as task_icon,
                        taskUser.realname as task_realname  FROM oa_case LEFT JOIN bpmn_hi_taskinst ON bpmn_hi_taskinst.proc_inst_id = oa_case.proc_inst_id
                        left join sys_user createUser on oa_case.create_by=createUser.id   left join sys_user taskUser on bpmn_hi_taskinst.assignee=taskUser.username 
                            WHERE 	oa_case.id ='${id}' AND bpmn_hi_taskinst.task_status = 1  `;
            let caseModel = await this.commonService.querySql(sql);
            for(let item of caseModel){
                if(item.uploadImgs){
                    let picArr=item.uploadImgs.split(',')
                    for(let j=0;j<picArr.length;j++){
                        picArr[j]=this.serverIP+'/'+picArr[j]
                    }
                    item.uploadImgs=picArr
                }
            }

            return caseModel
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }

    /**
     * 修改审批人
     * param:id   bpmn_hi_actinst的id
     * param:userid 用户id
     * @returns
     */
    async updateApprovePerson(id,userid,createId) {
        let _this = this;
        try {

           let model={
               assignee:userid
           }
            let updateState = await this.commonService.updateById(_this.db['bpmn_hi_actinst'],model,id);
            let sql = `select bpmn_hi_procinst.*,bpmn_re_procdef.form_type from bpmn_hi_actinst
                right join bpmn_hi_procinst on bpmn_hi_actinst.proc_inst_id=bpmn_hi_procinst.id
                right join bpmn_re_procdef on bpmn_re_procdef.id=bpmn_hi_actinst.proc_def_id
                where bpmn_hi_actinst.id=${id}  `;
            let actinstModel = await this.commonService.querySql(sql);
            var mydate = new Date();
            mydate.setHours(mydate.getHours() + 8);
            let socketBody = {
                title: actinstModel[0].review_name+ ',待您审批',
                result: {
                    id: actinstModel[0].id,
                    date: mydate.toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                },
                moduleName: 'xtbg',
                userIds: createId,
                menuUrl: 'myTask'
            };
            this.pushDataToBacklogPeople(JSON.parse(userid),actinstModel[0].form_type,actinstModel[0].form_json,actinstModel[0].review_name,actinstModel[0].id)
           return {socketBody:socketBody,userIds:JSON.parse(userid)}
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }


}
