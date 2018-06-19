export default class extends think.BaseController{
    indexAction(){

    }

    async getOrgsAction(){//根据父id获取所有子部门
        let aj = think.ajaxJson();
        const data = {id: this.post('org_id')}
        const OrgService = this.service('api/sys/OrgService');
        const res = await OrgService.getOrgs(data);
        if(!res.error){
           aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '机构列表查询错误'
        }
        return this.json(aj)

    }

    async getAllOrgAction(){//获取所有部门列表
        let aj = think.ajaxJson();
        const OrgService = this.service('api/sys/OrgService');
        const res = await OrgService.getAllOrg();
        if(!res.error){
           aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '机构列表获取失败';
        }
        return this.json(aj)

    }

    async getUserOrgListAction(){//获取可选部门列表，不分层级
        let aj = think.ajaxJson();
        const OrgService = this.service('api/sys/OrgService');
        const userData = this.getUser();
        const res = await OrgService.getOrgList(userData);
        if(res&&!res.error){
           aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '机构列表获取失败';
        }
        return this.json(aj)

    }

    async getUserListByOrgAction(){//获取部门下用户列表
        let aj = think.ajaxJson();
        const OrgService = this.service('api/sys/OrgService');
        const data = {org_id:this.post('org_id')};
        const res = await OrgService.getUserListByOrg(data);
        if(res&&!res.error){
           aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '用户列表获取失败';
        }
        return this.json(aj)

    }

}