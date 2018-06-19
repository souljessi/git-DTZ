/**
 * Created by Jessi on 2018/1/2.
 */
import moment from 'moment'
export default class extends think.Service {
    constructor() {
        super();
        this.caseModel = this.db['oa_case'];
        this.eventModel = this.db['cms_event'];
        this.userModel = this.db['sys_user'];
        this.orgModel = this.db['sys_org'];
        this.partModel = this.db['cms_parts'];
        this.caseModel.belongsTo(this.userModel, {
            foreignKey: 'create_by'
        })
        this.userModel.belongsTo(this.orgModel, {
            foreignKey: 'org_id',
            targetKey: 'id'
        });

        this.hi_procinstModel = this.db['bpmn_hi_procinst'];
        this.caseModel.belongsTo(this.hi_procinstModel, {
            foreignKey: 'proc_inst_id'
        })

    }

    /**
     * 通过businesskey查询案件信息
     *
     * @param {any} data
     * @returns {Array} 案件数组
     */
    async getCaseByKey(data) {
        const Op = this.db.Sequelize.Op;
        let where = {
            businesskey: data.businesskey,
            del_flag: 0
        }
        try {
            const Res = await this.caseModel.findAll({
                where: where
            })
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }




    /**
     * 查询案件信息
     *
     * @param {any} data
     * @returns
     */
    async getCaseAll(userInfo) {
        let where = {
            del_flag: 0
        };
        let orgWhere = {}
        let newWhere = await this.BaseService.getDataScopeWhere(userInfo, 1)
        console.log(userInfo);
        console.log('--------------------------------------');
        console.log('外部whereObj：', newWhere);
        if (newWhere instanceof Object) {
            orgWhere = newWhere
            console.log('orgWhere:', orgWhere);
        } else {
            if (Number(newWhere) == 4) {
                let {
                    userId
                } = userInfo
                where.create_by = userId
            }
        }
        console.log('--------------------------------------');

        try {
            const Res = await this.caseModel.findAll({
                where: where,
                order: [
                    ['create_date', 'DESC']
                ],
                include: [{
                    model: this.userModel,
                    attributes: ['id', 'realname'],
                    include: [{
                        model: this.orgModel,
                        attributes: ['id', 'org_name'],
                        where: orgWhere,
                        required: true
                    }],
                    required: true

                }, {
                    model: this.hi_procinstModel,
                    attributes: ['status'],
                    required: true,

                }]
            });
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    /**
     * 事件立案申请
     */
    async createCase(data) {
        if(!data.id){
            data.id = think.uuid('v1');
        }
        let ID = data.id;
        // data.businesskey = null;
        data.update_date = new Date();
        data.is_check = 1;
        data.status = 5;
        data.create_date = new Date();
        data.case_code = `陆城管源[${(moment().format('YYYY'))}]${moment().format('MMDDhhmmssSSS')}${Math.floor(Math.random()*899+100)}`;
        let where = {
            id: ID
        };
        let state_data = {
            status: data.status,
            ObjName: data.ObjName,
            DeptCode1: data.DeptCode1,
            DeptName1: data.DeptName1,
            is_check:data.is_check,
            parent_name:data.parent_name,
            sub_name:data.sub_name,
            update_date:data.create_date,
            group_code:data.group_code,
            remarks:data.remarks,
        };
        try {
            let res = await this.caseModel.create(data);

            if (!res.error) {
                let result = await this.eventModel.update(state_data, {
                    where: where
                });

                return await this.caseModel.findOne({
                    where: where
                });
            } else {
                return res
            }

        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    /**
     * byId查询
     */

    async caseById(data) {
        let ID = data.id;
        let where = {
            id: ID
        };
        try {
            return await this.caseModel.findOne({
                where: where
            });


        } catch (error) {
            return this.exceptionService.handleError(error);
        }

    }

    /**
     * 部件立案申请
     */

    async createPartCase(data) {
        let queryData = {
            id: think.uuid('v1'),
            DeptCode1: data.DeptCode1 || null,
            DeptName1: data.DeptName1 || null,
            ObjPosition: data.address_name || null,
            BGID: data.BGID || null,
            case_code: `陆城管源[${(moment().format('YYYY'))}]${moment().format('MMDDhhmmssSSS')}${Math.floor(Math.random()*899+100)}`,
            case_type: 2,
            parent_name: data.cms_parts_group.parent_id ||'部件问题',
            sub_name: data.cms_parts_group.group_name || null,
            group_code: data.group_code || '07',
            create_by: data.create_by,
            update_by: data.update_by,
            create_date: new Date(),
            update_date: new Date(),
            remarks: data.Note || null,
            businesskey: data.id,
            baidu_x: data.baidu_x,
            baidu_y: data.baidu_y,
            del_flag: 0,
            area_code: data.area_code || null,
            proc_inst_id: data.proc_inst_id

        };
        data.update_date = new Date();
        let where = {
            id: data.id
        }
        try {
            let res =  await this.caseModel.create(queryData);

            if (!res.error) {
                let result = await this.partModel.update(data, {
                    where: where
                });
                return result
            } else {
                return res
            }

        } catch (error) {
            return this.exceptionService.handleError(error);
        }

    }

    /**
     * 更新案件BGID
     */
    async updateCaseBGID(data) {
        let query = {
            BGID: data.BGID
        }
        let where = {
            id: data.id
        }
        try {
            return await this.caseModel.update(query, {
                where: where
            })

        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }


    /**
     * 通过porcid查询案件信息
     *
     * @param {any} data  data.id
     * @returns
     */
    async getCaseByProcId(proc_inst_id) {
        let _this = this;
        let sql = `SELECT	oa_case.DeptName1,oa_case.ObjPosition,oa_case.case_code,oa_case.parent_name,oa_case.sub_name,oa_case.create_by,oa_case.remarks,sys_user.realname,u.realname update_name,oa_case.create_date,oa_case.update_date
FROM oa_case LEFT JOIN sys_user on sys_user.id=oa_case.create_by LEFT JOIN sys_user u on u.id=oa_case.update_by where oa_case.proc_inst_id= ${proc_inst_id}`
        try {
            const Res = await _this.commonService.querySql(sql);
            return Res
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    /**
     * 部门评价
     *
     * @returns
     */
    async getOrgEval(data) {
        data.orgList = data.orgList.replace('[', '(').replace(']', ')');
        let FormDate = '';
        let sql = `SELECT a.org_code,a.org_name,(SELECT count(*) FROM oa_case c WHERE (c.DeptCode1 IN (
                        SELECT id FROM sys_org b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')
                    ) OR c.DeptCode1 = a.id ) ) AS totalCount,count( CASE WHEN bb. STATUS = 1 AND bb.id = cc.proc_inst_id THEN
                1 ELSE NULL END ) AS closeCount, count( CASE WHEN bb. STATUS = 2  AND bb.id = cc.proc_inst_id THEN
                1 ELSE NULL END ) AS openCount ,	count( CASE WHEN bb. STATUS = 0 AND bb.id = cc.proc_inst_id THEN
                        1 ELSE NULL END ) AS rejectCount FROM sys_org a LEFT JOIN oa_case cc ON ( ( cc.DeptCode1 IN (
                SELECT id FROM sys_org b WHERE b.parent_ids LIKE concat('%', a.parent_ids, a.id, ',%')
            ) OR cc.DeptCode1 = a.id ) ) LEFT JOIN bpmn_hi_procinst bb ON (bb.id = cc.proc_inst_id)
    WHERE a.id IN ${data.orgList} GROUP BY a.id`;
        try {

            const list = await this.db.sequelize.query(sql, {
                type: this.db.sequelize.QueryTypes.SELECT
            });
            return list;
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }

    /**
     * 查询案件列表
     */

    async all_case_list(data){
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
        let where = {
            del_flag: 0
        };
        try{
            const result = await this.caseModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    ['create_date', 'DESC'],
                ]
            })
            return result

        }catch(error){
            return this.exceptionService.handleError(error)
        }

    }


    async specific_case_list(data) {
        const Op = this.db.Sequelize.Op;
        data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
        let where = {
            del_flag: 0
        };
        if(data.start_date && data.end_date){
            where.create_date = {
                [Op.between]: [data.start_date, data.end_date]
            }
        }
        if (data.parent_name) {
            where.parent_name = data.parent_name
        }
        if (data.sub_name) {
            where.sub_name = data.sub_name
        }
        if (data.source) {
            where.source = data.source
        }

        if (data.remarks) {
            where.remarks = {
                [Op.like]: '%' + data.remarks + '%'
            }

        }
        try {
            const result = await this.caseModel.findAndCountAll({
                where: where,
                limit: parseInt(data.pageSize),
                offset: parseInt(data.start),
                order: [
                    ['create_date', 'DESC'],
                ],
            });
            return result

        } catch (error) {
            return this.exceptionService.handleError(error)

        }

    }

    async delete_case(data){
        const Op = this.db.Sequelize.Op;
        let query = {
            del_flag: 1
        };
        let where = {};

        if (typeof (data.id) === 'string') { //单条删除
            where = {
                id: data.id
            };
        } else { //批量删除
            where = {
                id: {
                    [Op.in]: data.id
                }
            };
        }
        try{
            return await this.caseModel.update(query,{where: where})
        }catch(error){
            return this.exceptionService.handleError(error)

        }

    }
}