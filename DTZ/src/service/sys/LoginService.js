

export default class extends think.Service {
    /**
     * web端登录
     *
     * @return
     *result --用户信息 Object
     */
    async checkLogin(username, password, params) {
        const db = this.db;
        const userModel = db['sys_user'];
        const roleUserModel = db['sys_role_user'];
        const encryptPsd = think.irreversibleEncrypt(username, password);//加密
        const nameSpace = think.config('nameSpace');
        try {
            // this.baseService.getRolePermissionList(['12313'])
            let userInfo = await userModel.findOne({
                where: {
                    username: username,
                    password: encryptPsd
                },
                attributes: {exclude: ['password', 'del_flag']}
            });
            if (userInfo) {
                userInfo = userInfo.toJSON();
                if (userInfo.login_flag === 0) {
                    throw '该账号已被锁定，请联系管理员';
                } else {

                    const administrator = think.config('administrator');
                    const userId = userInfo.id;
                    const orgId = userInfo.org_id;

                    const attributes = ['roleid'];
                    const where = {userid: userId};
                    const role = await this.commonService.findAll(roleUserModel, attributes, where);
                    if (role.length === 0 && !administrator.includes(userId)) {
                        throw '该账号未分配角色和权限，请联系管理员';
                    } else {
                        // params.is_login = 1;  //将当前登录标记设为已登录
                        await userModel.update(params, {where: {id: userId}});
                        userInfo.roleList = role.map((r) => {
                            return r.roleid;
                        });
                        //获取用户的功能菜单
                        const menuList = await this.BaseService.getRoleMenu(userInfo.roleList, userId);
                        userInfo.menuList = menuList;
                        //把用户所有登陆信息缓存
                        think.Redis.hset(nameSpace.LOGIN_USER, userId, JSON.stringify(userInfo));
                        const tokenContent = {
                            userId: userId,
                            realName: userInfo.realname,
                            orgId: orgId,
                            roleList: userInfo.roleList
                        };
                        //获取token
                        const token = this.BaseService.getToken(tokenContent);

                        return {userInfo, token};
                    }
                }
            } else {
                throw '用户名或密码输入错误';
            }
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }


    // //缓存用户信息
    // cacheUserInfo(userId, userInfo) {
    //     const nameSpace = think.config('nameSpace');
    //     const key = nameSpace.userInfo;
    //     think.Redis.set(`${key}:${userId}`, JSON.stringify(userInfo));
    // }


}

