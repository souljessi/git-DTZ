export default class extends think.BaseController {
    __before() { //前置操作，在action执行，返回false则终止当前控制器
    }
    async getDepartNameAction() { //查询部门名称
        let aj = think.ajaxJson();
        const departService = this.service('sys/DepartService');
        const res = await departService.getDepartName();
        if (!res.error) {
            aj.success = res.success;
            aj.msg = res.msg;
            aj.result = res.result;
        } else {
            aj.success = false;
            aj.msg = `查询失败:${res.error}`;
        }
        return this.json(aj);
    }

    async getDepartListAction() { //查询部门信息
        let aj = think.ajaxJson();
        const departService = this.service('sys/DepartService');
        const res = await departService.getDepartList();
        if (!res.error) {
            aj.success = res.success;
            aj.msg = res.msg;
            aj.result = res.result;
        } else {
            aj.success = false;
            aj.msg = `查询失败:${res.error}`;
        }
        return this.json(aj);
    }

    async saveDepartInfoAction() { //保存部门信息
        let aj = think.ajaxJson();
        let postData = this.post('id,org_name,description,parent_id,org_code,org_type,parent_ids,parent,primary_person,deputy_person')
        console.log(postData);
        const departService = this.service('sys/DepartService');
        const res = await departService.saveDepartInfo(postData);
        if (!res.error) {
            aj.success = res.success;
            aj.msg = res.msg;
            aj.result = res.result;
        } else {
            aj.success = false;
            aj.msg = `查询失败:${res.error}`;
        }
        return this.json(aj);
    }

    async delDepartInfoAction() { //删除部门信息
        let aj = think.ajaxJson();
        const postData = {
            id: this.post('id')
        }
        if (postData.id) {
            const departService = this.service('sys/DepartService');
            const res = await departService.delDepartInfo(this.post());
            if (!res.error) {
                aj.success = res.success;
                aj.msg = res.msg;
                aj.result = res.result;
            } else {
                aj.success = false;
                aj.msg = `查询失败:${res.error}`;
            }
        } else {
            aj.success = false;
            aj.msg = "没有接收到相关参数";
        }
        return this.json(aj);
    }
    /*******************与用户有关****************** */
    async getUserListByDidAction() { //根据部门id获取用户列表
        let aj = think.ajaxJson();
        const UserService = this.service('sys/UserService'); //调用userservice
        let getData = this.get('page,pageSize,options')
        const res = await UserService.getUserList(getData);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    async unBindUserAction() { //用户部门解绑
        // console.log(this.post());
        let aj = think.ajaxJson();
        const postData = {
            userid: this.post('userid')
        }
        const departService = this.service('sys/DepartService');
        const res = await departService.unBindUser(postData);
        if (!res.error) {
            aj.success = res.success;
            aj.msg = res.msg;
            aj.result = res.result;
        } else {
            aj.success = false;
            aj.msg = `查询失败:${res.error}`;
        }
        return this.json(aj);
    }

    async getUserNotBindOrgAction() { //获取未绑定组织机构的警员
        let aj = think.ajaxJson();
        const getData = this.get('page,pageSize,options');
        const departService = this.service('sys/DepartService');
        const res = await departService.getUserNotBindOrg(getData);
        if (!res.error) {
            aj.success = res.success;
            aj.msg = res.msg;
            aj.result = res.result;
        } else {
            aj.success = false;
            aj.msg = `查询失败:${res.error}`;
        }
        return this.json(aj);
    }

    async saveUsersDepartAction() { //保存用户信息
        const postData = this.post('userlist,org_id');
        let aj = think.ajaxJson();
        const departService = this.service('sys/DepartService');
        const res = await departService.saveUsersDepart(postData);
        if (!res.error) {
            aj.success = res.success;
            aj.msg = res.msg;
            aj.result = res.result;
        } else {
            aj.success = false;
            aj.msg = `查询失败:${res.error}`;
        }
        return this.json(aj);
    }



    //获取所有组织机构和人员
    async orgAndUserAction() {
        let aj = think.ajaxJson();
        let data = this.get();
        const orgUserService = this.service('sys/DepartService');
        const result = await orgUserService.getOrgAndUser(this.getUser());

        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }
    __after() { //后置操作,在action调用之后执行

    }

    __call() { //魔术函数

    }
};