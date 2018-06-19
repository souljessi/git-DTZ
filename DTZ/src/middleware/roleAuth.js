/**
 * 角色功能权限访问验证
 * @param options
 * @param app
 * @returns {function(*, *)}
 */
export default (options, app) => {
    return async (ctx, next) => {

        const url = ctx.url;
        const excludeRouter = options.excludeRouter;
        for (let value of excludeRouter) {
            if (url.indexOf(value) >= 0) {
                return next();
            }
        }
        const user = ctx.state.userInfo;
        const userId = user.userId;
        //如果是管理员，则直接跳过验证
        if (userId === '000000') {
            return next();
        } else {
            let list = user.roleAuth;
            let url = ctx.url;
            for (let value of list) {
                if (value === url) {
                    return next();
                    break;
                }
            }
            return ctx.throw('No permission to access', 403);


        }


    }
}