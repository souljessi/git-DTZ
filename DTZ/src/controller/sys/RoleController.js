export default class extends think.Controller {
    __before() {//前置操作，在action执行，返回false则终止当前控制器
    }
    
    async getOrgByRoleAction() {//分页查询角色信息
        let aj = think.ajaxJson();
        const data = {orgids:this.get('auth_org_ids').split(',')};
        const roleService = this.service('sys/RoleService');
        const res = await roleService.getOrgByRole(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "获取部门列表失败";
        }
        return this.json(aj);
    }

    async getRoleListAction() {//分页查询角色信息
        let aj = think.ajaxJson();
        const data = this.get('page,pageSize,rolename');
        const roleService = this.service('sys/RoleService');
        const res = await roleService.getRoleList(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "角色列表查询错误";
        }
        return this.json(aj);
    }
   
    async delRoleInfoAction() {//删除角色信息
        let aj = think.ajaxJson();
        const data1 = {id:this.post('id')};
        // const data2 = {
        //     del_flag:1,
        //     update_by:this.post('update_by'),
        //     update_date:new Date()
        // };
        const roleService = this.service('sys/RoleService');
        const res = await roleService.delSysRoleInfo(data1);
        if(res&&res.error){
            aj.success = false;
            aj.msg = "角色信息删除错误";
        }
        if(res&&res.msg){
            aj.success = false;
            aj.msg = res.msg;
        }
        return this.json(aj);
    }

    async getRoleNamesAction() {//查询角色名称
        let aj = think.ajaxJson();
        const roleService = this.service('sys/RoleService');
        const res = await roleService.getRoleNames();
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "角色名称查询错误";
        }
        return this.json(aj);
    }
     
    async saveRoleInfoAction() {//保存角色信息
        let aj = think.ajaxJson();
        let data = this.post('rolename,description,enname,rolecode,useable,is_sys,data_scope,update_by,remarks,auth_org_ids');
        data.update_date = new Date();
        if(this.post('id')){
            data.id = this.post('id');
        }else{
            data.create_by = data.update_by;
            data.create_date = new Date();
        }
        const roleService = this.service('sys/RoleService');   
        const res = await roleService.saveRoleInfo(data);
        if(res&&res.error){
            aj.success = false;
            aj.msg = "角色信息保存错误";
        }
        if(!res){
            aj.success = false;
            aj.msg = "角色名称或角色编码已存在，请确认后重新输入";
        }
        return this.json(aj);
    }


    /********************角色用户 start*************************** */

    async getRoleByUserAction() {//根据用户id获取角色列表
        let aj = think.ajaxJson();
        const data = {userid:this.get('userid')};
        const roleService = this.service('sys/RoleService');
        const res = await roleService.getRoleByUser(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "用户角色列表查询错误";
        }
        return this.json(aj);
    }
    async delUserRoleAction() {//用户与当前角色解除绑定
        let aj = think.ajaxJson();
        const postData = this.post('roleid,userid');
        const roleService = think.service('sys/RoleService');
        const res = await roleService.delUserRole(postData);
        if(res&&res.error){
            aj.success = false;
            aj.msg = "用户角色解绑错误";
        }
        return this.json(aj);
    }

    async getUsersByRoleAction() {//获取该角色绑定的所有用户
        let aj = think.ajaxJson();
        const data = this.get('page,pageSize,options,roleid');
        const roleService = think.service('sys/RoleService');
        const res = await roleService.getUsersByRole(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "角色绑定的用户列表查询错误";
        }
        return this.json(aj);
    }

    async getUsersNotBindAction() {//获取未绑定该角色的用户
        let aj = think.ajaxJson();
        const getData = this.get('page,pageSize,options,roleid');
        const roleService = think.service('sys/RoleService');
        const res = await roleService.getUsersNotBindRole(getData);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "未绑定角色的用户列表查询错误";
        }
        return this.json(aj);
    }
    
    async saveUserRoleAction() {//保存用户角色绑定
        let aj = think.ajaxJson();
        const data = this.post('roleid,userList');
        const roleService = think.service('sys/RoleService');
        const res = await roleService.saveUserRole(data);
        if(res&&res.error){
            aj.success = false;
            aj.msg = "用户角色绑定错误";
        }
        return this.json(aj)
    }
    async delUserInfoAction() {
        let aj = think.ajaxJson();
        const data = {id:this.post('id')};
        const userService = think.service('sys/UserService');
        const res = await userService.delUserInfo(data);
        if(res&&res.error){
            aj.success = false;
            aj.msg = "用户信息删除错误";
        }
        if(!res){
            aj.success = false;
            aj.msg = "系统用户不可删除";
        }
        return this.json(aj)
    }
    /***********************角色用户 end************************************* */

    /*********************角色菜单相关 begin************************* */
    async getAllMenuAction() {//获取所有菜单
        let aj = think.ajaxJson();
        const roleService = think.service('sys/RoleService');
        const res = await roleService.getAllMenu();
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "获取菜单列表错误";
        }
        return this.json(aj)
    }
    async getRoleMenuAction() {//根据角色获取菜单权限
        let aj = think.ajaxJson();
        const data = {roleid:this.get('roleid')};
        const roleService = think.service('sys/RoleService');
        const res = await roleService.getRoleMenu(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "获取角色权限错误";
        }
        return this.json(aj)
    }

    async saveRoleMenuAction() {
        let aj = think.ajaxJson();
        const data = this.post('roleid,delList,addList')
        const roleService = think.service('sys/RoleService');
        const res = await roleService.saveRoleMenu(data);
        if(res&&res.error){
            aj.success = false;
            aj.msg = "保存角色权限关联错误"; 
        }
        return this.json(aj);
    }

    async getUserRoleMenuAction() {//根据用户角色获取绑定的全部菜单列表
        let aj = think.ajaxJson();
        const roleList = this.post('roleList');
        const roleService = think.service('sys/RoleService');
        const res = await roleService.getUserRoleMenu(roleList);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = "菜单列表查询错误"
        }
        return this.json(aj);
    }
    /**************************角色菜单相关 end******************************** */
    __after() {//后置操作,在action调用之后执行

    }

    __call() {//魔术函数

    }
}