const Bpmn = require('bpmn-engine');
const fs = require('fs');

function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);
        return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);
                    var value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        step("next", value);
                    }, function (err) {
                        step("throw", err);
                    });
                }
            }

            return step("next");
        });
    };
}
export default class extends think.Service {
    constructor() {
        super();
        this.serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
        this.pushServerUrl=think.config('pushServerUrl')
    }
    //查询流程列表
    async getBpmnList(data) {
        let _this = this;
        let start = (data.page - 1) * data.pageSize;
        const sql = `select  a.* ,bpmn_re_deployment.is_hang,a.name,bpmn_re_deployment.is_hang,bpmn_re_deployment.deploy_time 
                       from bpmn_re_procdef a INNER JOIN (select c.key ,max(c.rev) as rev from bpmn_re_procdef c GROUP BY  c.key   ) b 
                       on a.key=b.key and a.rev=b.rev INNER JOIN bpmn_re_deployment on bpmn_re_deployment.id=a.deployment_id 
					   order by deploy_time desc limit ${start},${data.pageSize}`;
        const CountSql = `select  count(*) count from bpmn_re_procdef a INNER JOIN (select c.key ,max(c.rev) as rev from bpmn_re_procdef c GROUP BY  c.key   ) b 
                       on a.key=b.key and a.rev=b.rev INNER JOIN bpmn_re_deployment on bpmn_re_deployment.id=a.deployment_id 
					   order by deploy_time desc `;
        try {
            let result = {};
            result.row = await _this.commonService.querySql(sql);
            result.count = await _this.commonService.querySql(CountSql);
            return result;
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

    //保存上传流程
    async saveUplaodBpmn(name, path,overtime) {
        let deploymentModel = {
            name: name,
            deploy_time: new Date()
        };
        let _this = this;
        let aj = think.ajaxJson();
        let xml = fs.readFileSync('www/' + path);
        try {
            let key = await _this.getBpmnProcessID(xml).id;
            const model = await _this.saveBpmnToDeploymnet(xml, deploymentModel, key,overtime);
            const byteArrayInstance = await _this.saveByteArray(xml, model, path);
            aj.result = byteArrayInstance;
            aj.success = true;
            aj.msg = '保存成功';
            return aj
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

    //得到bpmn Process id
    getBpmnProcessID(xml) {
        const engine = new Bpmn.Engine({
            source: xml
        });
        return new Promise(function (resolve, reject) {
            engine.getDefinitions((err, definitions) => {
                _asyncToGenerator(function* () {
                    let model = {
                        id: definitions[0].getProcesses()[0].id,
                        name: definitions[0].getProcesses()[0].name
                    };
                    resolve(model);
                })();
            })
        })
    }

    //保存bpmn到Deployment
    async saveBpmnToDeploymnet(xml, deploymentModel, key,overtime) {
        let _this = this;
        const db = _this.db;
        let sql = `select count(*) count,deployment_id  from bpmn_re_procdef where bpmn_re_procdef.key='${key}' `;
        const modelInstance = await _this.commonService.querySql(sql);
        let model;
        if (modelInstance[0].count > 0) {
            const deployment = await _this.commonService.updateById(db['bpmn_re_deployment'], {deploy_time: new Date()}, modelInstance[0].deployment_id);
            deploymentModel.id = modelInstance[0].deployment_id;
            model = await _this.SaveBpmnToModel(xml, deploymentModel, key,overtime)
        } else {
            const deployment = await _this.commonService.save(db['bpmn_re_deployment'], deploymentModel, key);
            model = await _this.SaveBpmnToModel(xml, deployment, key,overtime)
        }
        return model;
    }

    //解析bpmn文件，并保存到数据库
    async SaveBpmnToModel(xml, deployment, key,overtime) {
        const _this = this;
        const db = _this.db;
        let model = {
            id: '',
            name: deployment.name,
            key: key,
            rev: '',
            bytes: xml,
            deployment_id: deployment.id,
            overtime:overtime
        };
        model.key = key;
        let sql = `select * from bpmn_re_procdef where bpmn_re_procdef.key='${key}'   order by rev desc limit 0,1 `;
        const deploymentArr = await _this.commonService.querySql(sql);
        if (deploymentArr.length > 0) {
            model.rev = parseInt(deploymentArr[0].rev) + 1;
        } else {
            model.rev = 1
        }
        model.id = key + ':' + model.rev + ':' + (model.deployment_id + 3);
        const modelInstance = await _this.commonService.save(db['bpmn_re_procdef'], model);
        return modelInstance
    }

    //将文件解析并保存到数据库
    async saveByteArray(xml, deployment, path) {
        let _this = this;
        const db = _this.db;
        let model = {
            rev: '',
            bytes: xml,
            path: path,
            key: deployment.dataValues.key,
            name: deployment.dataValues.name,
            create_date: new Date()
        };
        let sql = `select * from bpmn_ge_bytearray where bpmn_ge_bytearray.key='${deployment.dataValues.key}' order by rev desc limit 0,1 `;
        const modelArr = await _this.commonService.querySql(sql);
        if (modelArr.length > 0) {
            model.rev = parseInt(modelArr[0].rev) + 1;
        } else {
            model.rev = 1
        }
        const byteArrayInstance = await _this.commonService.save(db['bpmn_ge_bytearray'], model);
        return byteArrayInstance
    }

    //删除流程
    async deleteBpmnById(id) {
        let _this = this;
        const db = _this.db;
        let sql = `select * from bpmn_re_procdef where deployment_id=${id} order by rev desc`;
        const modelArr = await _this.commonService.querySql(sql);
        const modelInstance = await _this.commonService.deleteById(db['bpmn_re_procdef'], modelArr[0].id);
        if (modelArr.length == 1) {
            const deployment = await _this.commonService.deleteById(db['bpmn_re_deployment'], id)
        }
        return modelInstance
    }

    //删除模型
    async deleteModelById(id) {
        let _this = this;
        const db = _this.db;
        const model = await _this.commonService.deleteById(db['bpmn_ge_bytearray'], id);
        if (model == 1) {
            return {error: null}
        } else {
            return {error: '删除失败'}
        }
    }

    //修改流程状态
    async uploadBpmnStatus(id, is_hang,procDefId) {
        let _this = this;
        const db = _this.db;
        const deploymentInstance = await _this.commonService.updateById(db['bpmn_re_deployment'], {is_hang: is_hang}, id);
        const procDef =await  _this.db['bpmn_re_procdef'].findOne({where:{id:procDefId}});
        return deploymentInstance
    }

//查询模型列表
    async getModelList(data) {
        let _this = this;
        let start = (data.page - 1) * data.pageSize;
        const sql = `select  a.*  from bpmn_ge_bytearray a INNER JOIN (select c.key ,max(c.rev) as rev from bpmn_ge_bytearray c GROUP BY  c.key   ) b 
                         on a.key=b.key and a.rev=b.rev    order by create_date desc limit ${start},${data.pageSize}`;
        const CountSql = `select  count(*) count from bpmn_ge_bytearray a INNER JOIN (select c.key ,max(c.rev) as rev from bpmn_ge_bytearray c GROUP BY  c.key   ) b 
                            on a.key=b.key and a.rev=b.rev  `;
        try {
            let result = {};
            result.row = await _this.commonService.querySql(sql);
            result.count = await _this.commonService.querySql(CountSql);
            return result;
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

    //部署模型
    async deploymentModel(data) {
        let _this = this;
        let db = this.db;
        try {
            let deploymentModel = {
                name: data.name,
                deploy_time: new Date()

            };
            let xml = _this.byteToString(data.bytes.data);
            const model = await _this.saveBpmnToDeploymnet(xml, deploymentModel, data.key,data.overtime);
            const procModelArr = await _this.parseXmlSave(xml, model.dataValues.id);
            const saveProcModel=await _this.commonService.saveMany(db['bpmn_re_procmodel'],procModelArr);
            if (saveProcModel) {
                return {error: null}
            } else {
                return {error: '部署失败'}
            }
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

//byte转字符串
    byteToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    //修改model
    async updateModel(id, xml,overtime) {
        let _this = this;
        const db = _this.db;
        try {
            let model = {
                overtime: overtime,
            };
            if(xml!=undefined){
                let ProcessModel = await _this.getBpmnProcessID(xml);
                model.bytes=xml;
                model.name= ProcessModel.name;
                model.key=ProcessModel.id
            }
            const byteArrayInstance = await _this.commonService.updateById(db['bpmn_ge_bytearray'], model, id);
            return byteArrayInstance
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

    //添加model
    async addModel(xml) {
        let _this = this;
        const db = _this.db;
        let processObj = await _this.getBpmnProcessID(xml);
        let key = processObj.id;
        let name = processObj.name;
        try {
            let model = {
                rev: '',
                bytes: xml,
                path: '',
                key: key,
                name: name,
                create_date: new Date()
            };
            let sql = `select * from bpmn_ge_bytearray where bpmn_ge_bytearray.key='${key}' order by rev desc limit 0,1 `;
            const modelArr = await _this.commonService.querySql(sql);
            if (modelArr.length > 0) {
                model.rev = parseInt(modelArr[0].rev) + 1;
            } else {
                model.rev = 1
            }
            const byteArrayInstance = await _this.commonService.save(db['bpmn_ge_bytearray'], model);
            return byteArrayInstance
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

    //查询待办任务
    async queryAgency(assignee, page, pageSize,group) {
        let _this = this;
        let str ='';
        try {
            for(let i=0;i<group.length;i++){
                str+=`or (bpmn_hi_actinst.group like '%"${group[i]}"%' AND bpmn_hi_actinst.proc_inst_id = bpmn_hi_procinst.id)`
            }
            let start = (page - 1) * pageSize;
            let sql = `select bpmn_hi_procinst.id,bpmn_hi_actinst.act_name,bpmn_hi_procinst.start_time,bpmn_re_procdef.name,bpmn_re_procdef.rev,bpmn_re_procdef.form_type,bpmn_hi_procinst.form_json from bpmn_hi_actinst
                       left join bpmn_hi_procinst ON (bpmn_hi_actinst.assignee like '%"${assignee}"%'  AND bpmn_hi_actinst.proc_inst_id = bpmn_hi_procinst.id)  
                       ${str} left join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id left join  oa_case on oa_case.proc_inst_id=bpmn_hi_procinst.id WHERE act_status =0 and bpmn_hi_procinst.id!='' 
                       and bpmn_hi_procinst.status=2 	and ((oa_case.id!='' and bpmn_re_procdef.form_type=3) or ( bpmn_re_procdef.form_type!=3) ) group by bpmn_hi_procinst.id order by start_time desc limit ${start},${pageSize}`;
            let sqlCount = `select count(*) count from (select count(*) count from bpmn_hi_actinst left join bpmn_hi_procinst ON (bpmn_hi_actinst.assignee like '%"${assignee}"%'  AND bpmn_hi_actinst.proc_inst_id = bpmn_hi_procinst.id)  
                       ${str} left join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id left join  oa_case on oa_case.proc_inst_id=bpmn_hi_procinst.id WHERE act_status = 0 and bpmn_hi_procinst.id!='' 
                       and bpmn_hi_procinst.status=2 and ((oa_case.id!='' and bpmn_re_procdef.form_type=3) or ( bpmn_re_procdef.form_type!=3) ) group by bpmn_hi_procinst.id )as  a`;
            const procInstArr = await _this.commonService.querySql(sql);
            const procInstCount = await _this.commonService.querySql(sqlCount);
            return {row: procInstArr, count: procInstCount}
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

    //查询任务的流程图
    async queryAgencyView(proc_id) {
        let _this = this;
        let sql = `SELECT	bpmn_re_procdef.bytes FROM bpmn_hi_procinst LEFT JOIN bpmn_re_procdef ON bpmn_re_procdef.id = bpmn_hi_procinst.proc_def_id
                 WHERE 	bpmn_hi_procinst.id = ${proc_id}`;
        let actSql = `SELECT * FROM	bpmn_hi_actinst WHERE bpmn_hi_actinst.proc_inst_id = ${proc_id} `;
        try {
            const xml = await _this.commonService.querySql(sql);
            const actInstArr = await _this.commonService.querySql(actSql);
            return {xml: xml, actInstArr: actInstArr}
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }
    }

    /**
     * 通过porcid查询案件流程信息
     * @param {any} data  data.id
     * @returns
     */
    async getTaskByProcId(proc_inst_id) {
        let where = {
            proc_inst_id: proc_inst_id,
        };
        try {
            const Res = await this.db['bpmn_hi_taskinst'].findAll({
                where: where,
                include: [{association: this.db['bpmn_hi_taskinst'].belongsTo(this.db['sys_user'], {
                    foreignKey: 'assignee',
                    targetKey: 'username'
                }),
                    attributes:['realname']
                }],
                order: [
                    ['start_time', 'ASC']
                ]
            });
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
    /**
     * 通过porcid查询等待userTask流程信息
     * @param {any} data  data.id
     * @returns
     */
    async getWaitUserTaskByProcId(data) {
        let str='';
        for(let i=0;i<data.group.length;i++){
            str+=`or (act_status=0 and proc_inst_id=${data.proc_inst_id} and bpmn_hi_actinst.group like '%"${data.group[i]}"%' )`
        }
        let sql = `select * from bpmn_hi_actinst where (act_status=0 and proc_inst_id=${data.proc_inst_id} and bpmn_hi_actinst.assignee like '%"${data.assignee}"%') ${str} limit 0,1`;
        try {
            const Res = await this.commonService.querySql(sql);
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
    /**
     * 通过porcid查询等待flow流程信息
     * @param {any} data  data.id
     * @returns
     */
    async queryFlowMsgByElementId(data) {
        try {
            const Actinst=await this.db['bpmn_re_procmodel'].findAll({where:{proc_def_id:data.proc_def_id,proc_element_id:data.proc_element_id}})
            let approveType=1;

            if(Actinst.length>0&&Actinst[0].approve_type!=''){
                    approveType=Actinst[0].approve_type;
            }

            let sql=`select b.*,${approveType} as approveType from bpmn_re_procmodel a right join bpmn_re_procmodel b  
                on  a.target_ref=b.source_ref and a.source_ref='${data.proc_element_id}' and b.proc_def_id='${data.proc_def_id}' 
                where a.id!='' and a.proc_def_id='${data.proc_def_id}' and b.target_ref!='' ORDER BY b.condition`;
            const proc = await this.commonService.querySql(sql);
            return proc
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

//查询已办任务
    async getProcinstEnd(assignee, page, pageSize,deployment_id,key,startTime,endTime) {
        let _this = this;
        let start = (page - 1) * pageSize;
        try {
            const userModel=await this.db['sys_user'].findAll({where:{id:assignee}});
            let typeStr=''
            let timeStr=''
                    if(deployment_id){
                        typeStr=`and bpmn_re_procdef.key='${key}' and bpmn_re_procdef.deployment_id=${deployment_id}`
                    }
                    if(startTime){
                        timeStr=`and bpmn_hi_procinst.start_time BETWEEN '${startTime}' and '${endTime}'`
                    }
            let sql = `select bpmn_hi_procinst.id,bpmn_re_procdef.name ,bpmn_re_procdef.rev,bpmn_hi_procinst.start_time,bpmn_hi_procinst.end_time,bpmn_hi_procinst.duration,bpmn_re_procdef.form_type,bpmn_hi_procinst.form_json  FROM	bpmn_hi_taskinst
                   right join bpmn_hi_procinst on bpmn_hi_taskinst.proc_inst_id=bpmn_hi_procinst.id 
                   left join bpmn_re_procdef on bpmn_re_procdef.id=bpmn_hi_taskinst.proc_def_id
                   left join  oa_case on oa_case.proc_inst_id=bpmn_hi_procinst.id
                   where bpmn_hi_taskinst.assignee='${userModel[0].dataValues.username}'and bpmn_hi_taskinst.task_status=1 ${typeStr} ${timeStr}
                     and ((oa_case.id!='' and bpmn_re_procdef.form_type=3) or ( bpmn_re_procdef.form_type!=3) )  GROUP BY bpmn_hi_procinst.id ORDER BY bpmn_hi_procinst.end_time desc
                    limit ${start},${pageSize}`;
            let sqlCount = `select count(*) count from (select count(*) count  FROM	bpmn_hi_taskinst
                   right join bpmn_hi_procinst on bpmn_hi_taskinst.proc_inst_id=bpmn_hi_procinst.id 
                   left join bpmn_re_procdef on bpmn_re_procdef.id=bpmn_hi_taskinst.proc_def_id
                   left join  oa_case on oa_case.proc_inst_id=bpmn_hi_procinst.id
                   where bpmn_hi_taskinst.assignee='${userModel[0].dataValues.username}' and bpmn_hi_taskinst.task_status=1 ${typeStr} ${timeStr}  and ((oa_case.id!='' and bpmn_re_procdef.form_type=3) or ( bpmn_re_procdef.form_type!=3) )   GROUP BY bpmn_hi_procinst.id ORDER BY bpmn_hi_procinst.end_time desc) as a `;
            const procInstArr = await _this.commonService.querySql(sql);
            const procInstCount = await _this.commonService.querySql(sqlCount);
            return {row: procInstArr, count: procInstCount}
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }


    //我发起的
    async getApprove(assignee, page, pageSize,deployment_id,key,startTime,endTime) {
        let _this = this;
        let start = (page - 1) * pageSize;
        try {
            let typeStr=''
            let timeStr=''
            if(deployment_id){
                typeStr=`and bpmn_re_procdef.key='${key}' and bpmn_re_procdef.deployment_id=${deployment_id}`
            }
            if(startTime){
                timeStr=`and bpmn_hi_procinst.start_time BETWEEN '${startTime}' and '${endTime}'`
            }
            const userModel=await this.db['sys_user'].findAll({where:{id:assignee}});
           let sql = `select   bpmn_hi_procinst.id,bpmn_re_procdef.name ,bpmn_re_procdef.rev,bpmn_hi_procinst.start_time,bpmn_hi_procinst.end_time,bpmn_hi_procinst.duration,bpmn_re_procdef.form_type,bpmn_hi_procinst.form_json from bpmn_hi_procinst
                 	inner join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id  
                 	left join  oa_case on oa_case.proc_inst_id=bpmn_hi_procinst.id 
                   WHERE start_user_name = '${userModel[0].username}' ${typeStr} ${timeStr} and ((oa_case.id!='' and bpmn_re_procdef.form_type=3) or ( bpmn_re_procdef.form_type!=3) )
                    group by bpmn_hi_procinst.id order by start_time desc limit ${start},${pageSize}`;
         let    sqlCount = `select count(*) count from bpmn_hi_procinst
                        inner join bpmn_re_procdef  on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id and bpmn_re_procdef.is_custom_tem=1 
                        left join  oa_case on oa_case.proc_inst_id=bpmn_hi_procinst.id 
                        WHERE start_user_name = '${userModel[0].username}' ${typeStr} ${timeStr} and ((oa_case.id!='' and bpmn_re_procdef.form_type=3) or ( bpmn_re_procdef.form_type!=3) )  `;
            const procInstArr = await _this.commonService.querySql(sql);
            const procInstCount = await _this.commonService.querySql(sqlCount);
            return {row: procInstArr, count: procInstCount}
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
//查询用户列表
    async getUserList() {
        let _this = this;
        const db = _this.db;

        try {
            const Res = await this.db['sys_user'].findAll();
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
//查询角色列表
    async queryRoleList() {
        let _this = this;
        try {
            const Res = await this.db['sys_role'].findAll();
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }


//将文件解析并保存到数据库
    async parseXmlSave(xml,proc_def_id) {
        let _this = this;
        const engine = new Bpmn.Engine({
            source: xml,
            moddleOptions: {
                camunda: require('camunda-bpmn-moddle/resources/camunda')
            }
        });
        return new Promise(function (resolve, reject) {
            engine.getDefinitions((err, definitions) => {
                _asyncToGenerator(function* () {
                    try {
                        let procArr=definitions[0].moddleContext.references;
                        let flowArr=[];
                        flowArr=_this.parseProcFlow(procArr);
                        let procArr1=definitions[0].moddleContext.elementsById;
                        let procDefArr=[];
                        for(let i in procArr1){
                            if(procArr1[i].$type=='bpmn:Process'){
                                procDefArr=procArr1[i].flowElements;
                            }
                        }
                        let arr=[];
                        for(let i in procDefArr){
                            arr.push(_this.parseProc(procDefArr[i],proc_def_id))
                        }
                        for(var i=0;i<flowArr.length;i++){
                            for(var j=0;j<arr.length;j++){
                                if(flowArr[i].proc_element_id==arr[j].proc_element_id){
                                    arr[j].source_ref=flowArr[i].source_ref;
                                    arr[j].target_ref=flowArr[i].target_ref
                                }
                            }
                        }
                        resolve(arr);
                    } catch (error) {
                        return this.exceptionService.handleError(error);
                    }
                })();
            })
        })
    }
//解析流程元素
    parseProc(procObj,proc_def_id) {
        let procModel = {
            act_type: '',
            proc_element_id: '',
            act_name: '',
            condition: '',
            assignee: '',
            depart: '',
            source_ref: '',
            target_ref: '',
            form:'',
            approve_type:'',
            candidate_group: '',
            proc_def_id: proc_def_id,
            candidate_users: ''
        };
        for (let i in procObj) {
            if (i == '$type') {
                procModel.act_type = procObj[i].substr(5);
                if(procObj.$type=='bpmn:StartEvent'){
                    procModel.act_name='发起审批'
                }else if(procObj.$type=='bpmn:SequenceFlow'){
                    procModel.act_name='同意'
                }else if(procObj.$type=='bpmn:EndEvent'){
                    procModel.act_name='结束审批'
                }
            } else if (i == 'id') {
                procModel.proc_element_id = procObj[i]
            } else if (i == 'name') {
                procModel.act_name = procObj[i];
                if(procObj.$type=='bpmn:StartEvent'&&procObj[i]==''){
                    procModel.act_name='发起审批'
                }else  if(procObj.$type=='bpmn:EndEvent'&&procObj[i]==''){
                    procModel.act_name='结束审批'
                }
            } else if (i == 'conditionExpression') {
                procModel.condition = procObj[i].body
            }else if (i == 'assignee') {
                let model=JSON.parse(procObj[i]);
                if(model.assignee!=''){
                    procModel.assignee = JSON.stringify(model.assignee)
                }else if(model.candidateGroup.length!=0){
                    procModel.candidate_group = JSON.stringify(model.candidateGroup)
                }else if(model.candidateUsers.length!=0){
                    procModel.candidate_users = JSON.stringify(model.candidateUsers)
                }else if(model.depart.length!=0){
                    procModel.depart=JSON.stringify(model.depart)
                }
                if(model.approveType==''){
                    procModel.approve_type=1
                }else{
                    procModel.approve_type=model.approveType;
                }



            }else if (i == 'formKey') {
                procModel.form = procObj[i]
            }
        }
        return procModel;
    }
    /**
     * 通过porcid查询案件userTask流程信息
     * @param {any} data  data.id
     * @returns
     */
    async getUserTaskByProcId(data) {
        let _this = this;
        let where = {
            proc_inst_id: data.proc_inst_id,
            act_type: 'UserTask',
            task_status:1
        };
        try {
            const Res = await _this.db['bpmn_hi_taskinst'].findAll({
                where: where,
                order: [['end_time', 'ASC']]
            });
            return Res;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }
//解析流程元素来源，目标
    parseProcFlow(procArr) {
        let procObj={};
        let arr = [];
        for (let i in procArr) {
            if(procArr[i].property=='bpmn:sourceRef'){
                let key=procArr[i].element.id;
                if(procObj[key]!=undefined){
                    procObj[key].source_ref=procArr[i].id;
                }else{
                    procObj[key]={};
                    procObj[key].proc_element_id=procArr[i].element.id;
                    procObj[key].source_ref=procArr[i].id;
                }
            }else if(procArr[i].property=='bpmn:targetRef'){
                let key=procArr[i].element.id;
                if(procObj[key]!=undefined){
                    procObj[key].target_ref=procArr[i].id;
                }else{
                    procObj[key]={};
                    procObj[key].proc_element_id=procArr[i].element.id;
                    procObj[key].target_ref=procArr[i].id;
                }
            }
        }
        for(let i in procObj){
            arr.push(procObj[i])
        }
        return arr;
    }

    //开始流程
    async  startProcessInstance(key,id,userID,data) {
        let _this=this;
        let db=this.db;
        let SendMsgObj={
                backLogsUserIds:'',
               form_type:'',
                review_name:'',
                procInstId:'',
        };
        try {
            const proc= await this.db['bpmn_re_procdef'].findAll({where:{id:key}});
            const procModelArr = await this.db['bpmn_re_procmodel'].findAll({where:{proc_def_id:proc[0].id}});
            const userModel = await this.db['sys_user'].findAll({where:{id:userID}});
            let procInstModel={
                proc_def_id:proc[0].id,
                review_name:userModel[0].realname+'的'+proc[0].name,
                start_time:new Date(),
                start_user_name:userModel[0].dataValues.username,
                overtime:proc[0].overtime,
                status:2,
            };

            if(data!=undefined){
                SendMsgObj.data=data;
                procInstModel.form_json= data
            }else{
                SendMsgObj.data='';
            }
            if(proc[0].form_type!=3){
                procInstModel.review_name=userModel[0].realname+'的'+proc[0].name;
            }else{

                procInstModel.review_name=userModel[0].realname+'提交的'+proc[0].name;
            }
            const procInst=await this.commonService.save(db['bpmn_hi_procinst'], procInstModel);
            const actinstModel=await this.startActinst(proc[0],procModelArr,procInst);
            await this.startTask(proc[0],procModelArr,procInst);
            SendMsgObj.backLogsUserIds=actinstModel;
            SendMsgObj.form_type=proc[0].form_type;
            SendMsgObj.review_name=procInstModel.review_name;
            SendMsgObj.date=procInst.start_time.toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
            SendMsgObj.procInstId=procInst.id;
            SendMsgObj.url=this.pushServerUrl;
            // for(let i in tableName){
            //   const procResult= await this.commonService.updateById(db[i],{proc_inst_id:procInst.id},id);
            // }

            return SendMsgObj;
        } catch (err) {
            return _this.exceptionService.handleError(err);
        }

    }
    //开始历史任务
    async startTask(proc,arr,procInst){
        let _this=this;
        let db=this.db;
        let obj={};
        let startId='';
        let actArr=[];
        try {
            for(let i of arr){
                obj[i.proc_element_id]=i;
                if(i.act_type=='StartEvent'){
                    startId=i.proc_element_id;
                    actArr=i
                }
            }
            let procModelArr=this.getTaskInstList(startId,arr,obj,{});
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
            if(arr[i].act_type=='SequenceFlow'&&arr[i].source_ref==id){
                this.getTaskInstList(arr[i].target_ref,arr,obj,procObj)
            }else if(arr[i].act_type=='UserTask'&&arr[i].proc_element_id==id){
                procObj[arr[i].proc_element_id]=obj[arr[i].proc_element_id];
                break;
            }else if(arr[i].act_type=='ExclusiveGateway'&&arr[i].proc_element_id==id){
                break;
            }
        }
        return procObj;
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
                description:'',
                owner:'',
                assignee:'',
                approve_type:'',
                start_time:new Date(),
                duration:0,
            };
            actinst.approve_type=procModelArr[i].approve_type;
            if(procModelArr[i].act_type=='UserTask'){
                actinst.act_status=0;
                // if(procModelArr[i].assignee!='""'){
                //     let itemArr=JSON.parse(procModelArr[i].candidate_users);
                //     for(let i=0;i<itemArr.length;i++){
                //         userIds.push(itemArr[i])
                //     }
                // }else
                if(procModelArr[i].candidate_users!=''){
                    let itemArr=JSON.parse(procModelArr[i].candidate_users);
                    for(let i=0;i<itemArr.length;i++){
                        userIds.push(itemArr[i])
                    }
                    actinst.assignee=procModelArr[i].candidate_users;
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
                                    userIds.push(param)
                                    userArr.push(param)
                                })
                            }
                        if(item.deputy_person!=null){
                            let arr=item.deputy_person.split(',')
                            arr.forEach(param=>{
                                userIds.push(param)
                                userArr.push(param)
                            })
                        }

                    })

                    actinst.assignee=JSON.stringify(userArr)

                }
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


    //得到流程实例列表
    getActInstList(id,arr,obj,procObj){
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
    //执行实例
    async executeFlow(flowid, taskDescription, act_name, userid, proc_inst_id, proc_element_id,filePath,approveType) {
        let _this = this;
        let db = _this.db;
        try{
            const taskArr = await _this.db['bpmn_hi_taskinst'].findAll({ where: { proc_element_id: proc_element_id, proc_inst_id: proc_inst_id, task_status: 0 } });
            const userModel = await _this.db['sys_user'].findAll({ where: { id: userid } });
            let flowModel=await  this.db['bpmn_re_procmodel'].findOne({where:{id:flowid}});
            if(taskArr.length==0){
                return {state:1}
            }
            let taskModel = {
                description: '【' + act_name + '】' + taskDescription,
                assignee: userModel[0].username,
                end_time: new Date(),
                duration: parseInt((new Date() - new Date(taskArr[0].dataValues.start_time)) / 1000),
                task_status: 1,
                uploadImgs:filePath
            };

            if(approveType==2){
                taskModel.result = 2;
            }else  if(flowModel.condition == 'false') {
                taskModel.result = 0;
            }else{
                taskModel.result = 1;
            }
            let SendMsgObj={
                backLogsUserIds:'',
                form_type:'',
                review_name:'',
                procInstId:proc_inst_id,
            };

            const userTaskAct = await _this.db['bpmn_hi_actinst'].findAll({ where: { proc_inst_id: proc_inst_id, proc_element_id: taskArr[0].dataValues.proc_element_id } });
            const taskUpdateResult = await _this.commonService.updateById(db['bpmn_hi_taskinst'], taskModel, taskArr[0].id);
            let actModel = {
                end_time: new Date(),
                duration: parseInt((new Date() - new Date(userTaskAct[0].dataValues.start_time)) / 1000),
                act_status: 1
            };
            const actUpdateResult = await _this.commonService.updateByWhere(db['bpmn_hi_actinst'], actModel, { proc_inst_id: proc_inst_id, proc_element_id: taskArr[0].dataValues.proc_element_id });
            const procModelArr = await _this.db['bpmn_re_procmodel'].findAll({ where: { proc_def_id: userTaskAct[0].dataValues.proc_def_id } });
            const procArr = await _this.db['bpmn_hi_procinst'].findAll({ where: { id: proc_inst_id } });
            const taskInst = await _this.executeTask(userTaskAct[0].dataValues, procModelArr, procArr, flowid);
            const actinstModel =await _this.executeActinst(userTaskAct[0].dataValues, procModelArr, procArr, flowid);
            const procDef=await _this.db['bpmn_re_procdef'].findOne({where:{id:userTaskAct[0].dataValues.proc_def_id }});
            const createUserMoel=await _this.db['sys_user'].findOne({where:{username:procArr[0].start_user_name }});
            SendMsgObj.backLogsUserIds=actinstModel.userIds;
            SendMsgObj.form_type=procDef.form_type;
            SendMsgObj.review_name=procArr[0].review_name;
            SendMsgObj.date=procArr[0].start_time;
            SendMsgObj.form=procArr[0].form_json;
            return {SendMsgObj:SendMsgObj,userId:createUserMoel.id,nextActinstIds:actinstModel.nextActinstIds,result:act_name};
        }catch(e){
            console.log(e)
        }

    }

    //往下执行流程节点
    async executeActinst(proc, arr, procArr, flowid) {
        var _this = this;
        let obj = {};
        let flowArr=[];
        let flow={};
        for(let i of arr){
            obj[i.proc_element_id]=i;
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
        let userIds = [];
        let isParallelGateway=false
        procModelObj = _this.getFlowActInstList(flow.proc_element_id, arr, obj, procModelObj);
        const actWaitArr = await _this.db['bpmn_hi_actinst'].findAll({ where: { proc_inst_id: proc.proc_inst_id, act_status: 0 } });
        for(let i in procModelObj ){
            let actinst = {
                proc_def_id: proc.proc_def_id,
                proc_inst_id: proc.proc_inst_id,
                act_name: procModelObj[i].act_name,
                act_type: procModelObj[i].act_type,
                assignee:'',
                group:'',
                approve_type:'',
                proc_element_id: procModelObj[i].proc_element_id,
                start_time: new Date(),
                duration: 0
            };
            actinst.approve_type=procModelObj[i].approve_type;
            if (procModelObj[i].act_type == 'UserTask') {
                actinst.act_status = 0;

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
                                userIds.push(param)
                                userArr.push(param)
                            })
                        }
                        if(item.deputy_person!=null){
                            let arr=item.deputy_person.split(',')
                            arr.forEach(param=>{
                                userIds.push(param)
                                userArr.push(param)
                            })
                        }

                    })
                    actinst.assignee=JSON.stringify(userArr)

                }
                arrs.push(actinst)
            } else if (procModelObj[i].act_type == 'EndEvent') {
                actinst.end_time = new Date();
                actinst.act_status = 1;
                if(actWaitArr.length==0){
                    arrs.push(actinst);
                }
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

    /**
     * 自定义模板保存
     * @returns
     */
    async saveFormTemplate(userId,formId,formName,template_code,template_group,data,icon_path,formType,remarks) {
        let _this = this;
        let result={};
        try {
            let procDefModel={
                key:template_code,
                name:formName,
                icon_path:icon_path,
                form_items:data,
                is_custom_tem:1,
                template_group:template_group,
                form_type:formType,
                remarks:remarks
            };
            let revModel=await this.db['bpmn_re_procdef'].findOne({where:{key:template_code},order:[['rev','desc']]});
            if(revModel){
             procDefModel.rev=revModel.rev+1;
             procDefModel.id=template_code+':'+procDefModel.rev+":"+(parseInt(revModel.deployment_id)+3);
             procDefModel.deployment_id=revModel.deployment_id;
            }else{
               let deployModel={
                   name:formName,
                   deploy_time:new Date(),
                   overtime:0,
                   is_hang:0
               };
               let deployInst=await  this.db['bpmn_re_deployment'].create(deployModel);
                procDefModel.rev=1;
                procDefModel.id=template_code+':'+procDefModel.rev+":"+(parseInt(deployInst.id)+3);
                procDefModel.deployment_id=deployInst.id;

            }
            if(formId!=''&&formId!=undefined&&formId!=null){
                procDefModel.id=formId;
                procDefModel.update_time=new Date();
                procDefModel.update_by=userId;
            }else{
                procDefModel.update_time=new Date();
                procDefModel.update_by=userId;
                procDefModel.create_time=new Date();
                procDefModel.create_by=userId;
            }
            const userModel=await this.db['bpmn_re_procdef'].upsert(procDefModel);
            return userModel;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }


//流程列表
   async processList(formType){
       let _this = this;
       let result={};
       try {
           const typeSql = `SELECT sys_type.* from 	sys_type_group LEFT JOIN sys_type ON sys_type_group.id = sys_type.typegroupid
                            WHERE	sys_type_group.typegroupcode = 'bdfz'`;
           const procinstSql = `select a.*,bpmn_re_deployment.is_hang
                       from bpmn_re_procdef a INNER JOIN (select c.key ,max(c.rev) as rev from bpmn_re_procdef c GROUP BY  c.key   ) b 
                       on a.key=b.key and a.rev=b.rev inner  JOIN bpmn_re_deployment on bpmn_re_deployment.id=a.deployment_id 
                        where form_type=${formType} `;
           const procOrgList=await _this.db['bpmn_procdef_org'].findAll({
               include: [{association: this.db['bpmn_procdef_org'].belongsTo(this.db['sys_org'], {
                   foreignKey: 'org_id',
                   targetKey: 'id'
               })
               }]
           });
           let typeList = await _this.commonService.querySql(typeSql);
           let procinstList = await this.commonService.querySql(procinstSql);
                procinstList.forEach(item=>{
                    item.orgList=[];
                    item.orgList1=[];
                        procOrgList.forEach(orgItem=>{
                        if(orgItem.proc_def_id==item.id){
                            item.orgList.push({org_id:orgItem.org_id,org_name:orgItem.sys_org.org_name})
                            if(item.orgList.length<3){
                                item.orgList1.push({org_id:orgItem.org_id,org_name:orgItem.sys_org.org_name})
                            }else if(item.orgList.length==3){
                                item.orgList1.push({org_id:orgItem.org_id,org_name:'……'})
                            }
                        }
                    })
                })
           for (let param of typeList){
               param.list=[];
               for (let item of procinstList) {
                   if(param.typecode==item.template_group){
                       param.list.push(item)
                   }
               }
           }

           return typeList;
       } catch (error) {
           return _this.exceptionService.handleError(error);
       }
    }




//案件流程列表
    async cassProcessList(org_id){
        let _this = this;
        let result={};
        let str='';
        if(org_id){
            str=`right JOIN bpmn_procdef_org on bpmn_procdef_org.org_id=${org_id} and bpmn_procdef_org.proc_def_id=a.id`
        }
        try {
            const procinstSql = `select a.*,bpmn_re_deployment.is_hang
                       from bpmn_re_procdef a INNER JOIN (select c.key ,max(c.rev) as rev from bpmn_re_procdef c GROUP BY  c.key   ) b 
                       on a.key=b.key and a.rev=b.rev inner  JOIN bpmn_re_deployment on bpmn_re_deployment.id=a.deployment_id and bpmn_re_deployment.is_hang=1
                        ${str} where form_type=3 `;
            let procinstList = await this.commonService.querySql(procinstSql);

            return procinstList;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }
    //添加分组
   async addGroup(groupName){
       let _this = this;
       try {
           const typeNameSql = `SELECT sys_type.* from 	sys_type_group LEFT JOIN sys_type ON sys_type_group.id = sys_type.typegroupid
                            WHERE	sys_type_group.typegroupcode = 'bdfz' and sys_type.typename='${groupName}'`;
           const typeSql = `SELECT sys_type.* from 	sys_type_group LEFT JOIN sys_type ON sys_type_group.id = sys_type.typegroupid
                            WHERE	sys_type_group.typegroupcode = 'bdfz'`;
           let typeList = await _this.commonService.querySql(typeNameSql);
           if(typeList.length>0){
               return 1
           }
           const systypegroup=await _this.commonService.querySql(typeSql);
           let result=await _this.db['sys_type'].create({id:think.uuid('v1'),typename:groupName,typegroupid:systypegroup[0].typegroupid,typecode:systypegroup.length});
           return result;
       } catch (error) {
           return _this.exceptionService.handleError(error);
       }
    }
//流程列表流程保存
    async editBpmn(id,xml,overtime,deployment_id,user){
        let _this = this;
       let  byteArrayInstance;
        try {
            let model={};
            if(xml!=undefined){
                model.bytes=xml;
                const updateDeploymentType=await _this.commonService.updateById(this.db['bpmn_re_deployment'],{is_hang:0,overtime:overtime},deployment_id);
                const procDefModel=await _this.db['bpmn_re_procdef'].findOne({where:{id:id}});
                let procDefID=procDefModel.key+':'+(procDefModel.rev+1)+':'+procDefModel.deployment_id;
                model={
                    id:procDefID,
                    key:procDefModel.key,
                    name:procDefModel.name,
                    bytes:xml,
                    deployment_id:deployment_id,
                    icon_path:procDefModel.icon_path,
                    form_items:procDefModel.form_items,
                    is_custom_tem:procDefModel.is_custom_tem,
                    form_type:procDefModel.form_type,
                    created_by:procDefModel.create_by,
                    overtime: overtime,
                    create_time:procDefModel.create_time,
                    rev:(procDefModel.rev+1),
                    template_group:procDefModel.template_group,
                    // update_by:user.id,
                    update_time:new Date()
                };
                byteArrayInstance= await _this.db['bpmn_re_procdef'].create( model);
                const procModelArr = await _this.parseXmlSave(xml,model.id);
                const saveProcModel=await _this.commonService.saveMany(_this.db['bpmn_re_procmodel'],procModelArr);
                const procdef_org=await this.db['bpmn_procdef_org'].update({proc_def_id:procDefID}, {where: {proc_def_id: id}})
                return procdef_org;
            }else{
                let model = {
                    overtime: overtime,
                };
                byteArrayInstance= await _this.commonService.updateById(this.db['bpmn_re_procdef'],model,id);
                return byteArrayInstance;
            }

        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }

    //byte转str
    byteToString(arr) {
        if(typeof arr === 'string') {
            return arr;
        }
        let str = '',
            _arr = arr;
        for(let i = 0; i < _arr.length; i++) {
            let one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if(v && one.length == 8) {
                let bytesLength = v[0].length;
                let store = _arr[i].toString(2).slice(7 - bytesLength);
                for(let st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    /**
     * 自定义模板保存
     * @returns
     */
    async addSysForm(key,name,icon_path,template_group,userId,formId,remarks) {
        let _this = this;
        let result={};
        try {
            let procDefModel={
                key:key,
                name:name,
                icon_path:icon_path,
                is_custom_tem:0,
                template_group:template_group,
                form_type:3,
                create_time:new Date(),
                create_by:userId,
                remarks:remarks
            };
            let revModel=await this.db['bpmn_re_procdef'].findOne({where:{key:key},order:[['rev','desc']]});
            if(revModel){
                procDefModel.rev=revModel.rev+1;
                procDefModel.id=key+':'+procDefModel.rev+":"+(parseInt(revModel.deployment_id)+3);
                procDefModel.deployment_id=revModel.deployment_id;
            }else{
                let deployModel={
                    name:name,
                    deploy_time:new Date(),
                    overtime:0,
                    is_hang:0
                };
                let deployInst=await  this.db['bpmn_re_deployment'].create(deployModel);
                procDefModel.rev=1;
                procDefModel.id=key+':'+procDefModel.rev+":"+(parseInt(deployInst.id)+3);
                procDefModel.deployment_id=deployInst.id;

            }
            if(formId!=''&&formId!=undefined&&formId!=null){
                procDefModel.id=formId;
                procDefModel.update_time=new Date();
                procDefModel.update_by=userId;
            }else{
                procDefModel.create_time=new Date();
                procDefModel.create_by=userId;
            }
            const userModel=await this.db['bpmn_re_procdef'].upsert(procDefModel);
            return userModel;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }
    /**
     * 修改审批人
     * @returns
     */
    async queryProcinstMsg(id) {
        let _this = this;
        try {
            let sql = `select bpmn_hi_procinst.*,bpmn_re_procdef.form_type from  bpmn_hi_procinst 
                right join bpmn_re_procdef on bpmn_re_procdef.id=bpmn_hi_procinst.proc_def_id
                where bpmn_hi_procinst.id=${id}  `;
            let procinstModel = await this.commonService.querySql(sql);
            return procinstModel
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }
    /**
     * 删除流程
     * @returns
     */
    async deleteBpmnDef(id) {
        let _this = this;
        try {
            const userModel=await this.commonService.deleteById(this.db['bpmn_re_deployment'],id);
            return userModel;
        } catch (error) {
            return _this.exceptionService.handleError(error);
        }
    }

    //得到过滤部门信息
    async getOrgAndUser(user) {
        try {
           let org= await this.BaseService.dataScopeFilter('sys_org',user);
           let orgIds=[];
                org.forEach(item=>{
                    orgIds.push(item.id)
                })
            const orgAndUsers = await this.db['sys_org'].findAll({
                where: {id:['$in',orgIds]},
                include: [{
                    association: this.db['sys_org'].hasMany(this.db['sys_user'], {
                        foreignKey: 'org_id'
                    }),
                    where: {
                        del_flag: 0,
                    },
                    attributes: ['id', 'realname', 'org_id', 'phone'],
                    required: false
                }],
                order: [
                    ['org_code', 'ASC']
                ]
            })
            return orgAndUsers

        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
    //获取所有审批类型
    async queryBpmnTypeList() {
        try {
            let sql = `SELECT	bpmn_re_deployment.id,	bpmn_re_procdef.KEY,	bpmn_re_procdef.NAME FROM	bpmn_re_procdef
                       RIGHT JOIN bpmn_re_deployment ON bpmn_re_deployment.id = bpmn_re_procdef.deployment_id
                        WHERE bpmn_re_procdef.KEY != '' GROUP BY	bpmn_re_procdef.KEY,	bpmn_re_deployment.id`
            let BpmnTypeList = await this.commonService.querySql(sql);
            return BpmnTypeList

        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    //设置流程可见部门
    async setBpmnOrg(orgIdList,proc_def_id) {
        try {
            let defOrgList=[]
        await this.db['bpmn_procdef_org'].destroy({where:{proc_def_id:proc_def_id}})
            orgIdList.forEach(item=>{
                let model={
                    proc_def_id:proc_def_id,
                    org_id:item.id
                }
                defOrgList.push(model)
            })
            let bpmnProcdefOrg=await this.commonService.saveMany(this.db['bpmn_procdef_org'],defOrgList)
            return bpmnProcdefOrg

        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }
};
//# sourceMappingURL=BpmnService.js.mapasd