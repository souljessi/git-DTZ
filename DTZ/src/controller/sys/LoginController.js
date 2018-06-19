export default class extends think.BaseController {
    /**
     * web端登录
     * @returns {Promise<boolean>}
     */
    async loginAction() {
        const {username, password} = this.post('username,password');
        let params = {};
        params.login_ip = this.ctx.ip;
        params.last_login_time = new Date();


        const loginService = this.service('sys/LoginService');
        // //验证登录
        const res = await loginService.checkLogin(username, password, params);
        if (!res.error) {
            let aj = think.ajaxJson();
            aj.result = res.userInfo;
            // aj.attributes.token = res.token;
            aj.msg = '登陆成功';
            aj.attributes.token = res.token;
            this.ctx.cookie('access_token', res.token);
            return this.json(aj);
        }
        return this.json(res);


    }

    /**
     * 注销
     *
     */
    logoutAction() {
        const nameSpace = think.config('nameSpace');
        think.Redis.hdel(nameSpace.LOGIN_USER, this.getUser().userId);
    }

    /**
     *
     */
    cacheRoleAccess() {

    }

}