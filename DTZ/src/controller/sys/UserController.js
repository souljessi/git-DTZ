export default class extends think.Controller {
    __before() { //前置操作，在action执行，返回false则终止当前控制器
    }

    async getUserInfoAction() { //获取个人资料
        let aj = think.ajaxJson();
        const data = {
            id: this.get('userid')
        };
        const UserService = think.service('sys/UserService');
        const res = await UserService.getUserInfo(data);
        if (res && !res.error && res.length > 0) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    async getUserListAction() { //获取所有用户列表
        let aj = think.ajaxJson();
        const data = this.get('page,pageSize,options');
        const UserService = think.service('sys/UserService');
        const res = await UserService.getUserList(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    async saveUserInfoAction() { //保存用户信息
        const file = this.file('image');
        const postData = this.post();
        const oldPath = this.post('pic_path') || null;
        let aj = think.ajaxJson();
        let saveData = {};
        const flag = this.post('flag');
        switch (Number(flag)) {
            case 1:
                if (this.post('id')) {
                    saveData = this.post('realname,org_id,status,gender,phone,job_no,email,duties,user_type,update_by,remarks');
                } else {
                    saveData = this.post('username,password,realname,org_id,status,gender,duties,phone,job_no,email,user_type,update_by,pic_path,remarks');
                }
                break;
            case 2:
                saveData = this.post('id,login_flag,update_by');
                break;
            case 3:
                saveData = this.post('id,username,password,update_by');
                break;
            default:
                break;
        }
        saveData.update_date = new Date();
        if (saveData.password) { //密码加密
            saveData.password = think.irreversibleEncrypt(saveData.username, saveData.password);
        }
        if (this.post('delImgInfo')) { //删除原图
            const delArr = [oldPath + '.100x100.png', oldPath + '.250x250.png'];
            const del = await this.delFile(delArr);
            if (!del) {
                aj.success = false;
                aj.msg = '原有头像删除错误';
                return this.json(aj);
            }
            saveData.pic_path = null;
        }
        if (file) { //保存图片
            const pathObj = await this.saveFile(file);
            if (pathObj) {
                saveData.pic_path = pathObj.filePathStatic;
                const cutimg = await this.cutImg(pathObj.filePath);
                if (!cutimg) {
                    aj.success = false;
                    aj.msg = '图片裁切错误';
                    return this.json(aj);
                }

            } else {
                aj.success = false;
                aj.msg = '图片保存错误';
                return this.json(aj);
            }
        }
        if (this.post('id')) {
            saveData.id = this.post('id');
        } else {
            saveData.create_by = saveData.update_by;
            saveData.create_date = saveData.update_date;
        }
        for (var i in saveData) { //更正数据格式
            if (saveData[i] === '' || saveData[i] === 'null' || saveData[i] === 'undefined') {
                saveData[i] = null;
            }
        }
        const UserService = think.service('sys/UserService');
        const res = await UserService.saveUserInfo(saveData);
        if (res.error) {
            aj.success = false;
            aj.msg = "用户信息保存失败";
        }
        if (!res) {
            aj.success = false;
            aj.msg = "用户名或手机号码已存在，请重新输入";
        }
        return this.json(aj);
    }

    async getUserNameAction() { //获取用户名列表
        let aj = think.ajaxJson();
        const UserService = think.service('sys/UserService');
        const res = await UserService.getUserName();
        if (res.error) {
            aj.success = false;
            aj.msg = "获取用户列表失败";
        } else {
            aj.result = res;
        }
        return this.json(aj);
    }

    async delUserInfoAction() { //删除用户
        let aj = think.ajaxJson();
        const delData = {
            id: this.post('id')
        };
        const UserService = think.service('sys/UserService');
        const res = await UserService.delUserInfo(delData);
        if (res.error) {
            aj.success = false;
            aj.msg = "删除用户信息失败";
        }
        if (!res) {
            aj.success = false;
            aj.msg = "系统用户不可删除";
        }
        return this.json(aj);
    }

    async checkPsdAction() { //验证旧密码
        let aj = think.ajaxJson();
        const data = this.get('id,username,password');
        const UserService = think.service('sys/UserService');
        const res = await UserService.checkPsd(data);
        if (!res) {
            aj.success = false;
            aj.msg = "旧密码输入错误";
        }
        if (res.error) {
            aj.success = false;
            aj.msg = "密码验证失败";
        }
        return this.json(aj);
    }
    /*********角色关联操作用户 start************* */
    /*********角色关联操作用户 end************* */
    async saveRoleUserAction() { //保存用户角色关联
        let aj = think.ajaxJson();
        const data = this.post('userid,delList,addList');
        const UserService = this.service('sys/UserService');
        const res = await UserService.saveRoleUser(data);
        if (!res) {
            aj.success = false;
            aj.msg = "用户角色关联错误";
        }
        if (res.error) {
            aj.success = false;
            aj.msg = "保存用户角色关联失败";
        }
        return this.json(aj);
    }


    async getUserInfoByIdAction() {
        let aj = think.ajaxJson();
        const UserService = think.service('sys/UserService');
        const getData = {
            id: this.get('id')
        }
        const res = await UserService.getUserInfoById(getData);
        if (res.error) {
            aj.success = false;
            aj.msg = "获取用户详情失败";
        } else {
            aj.result = res;
        }
        return this.json(aj);
    }


    async getUserInfoByIdsAction() {
        let aj = think.ajaxJson();
        const UserService = think.service('sys/UserService');
        const getData = {
            ids: this.post('ids')
        }
        console.log('ids:', getData);
        const res = await UserService.getUserInfoByIds(getData);
        if (res.error) {
            aj.success = false;
            aj.msg = "获取失败";
        } else {
            aj.result = res;
        }
        return this.json(aj);
    }
    __after() { //后置操作,在action调用之后执行

    }
    __call() { //魔术函数

    }
};