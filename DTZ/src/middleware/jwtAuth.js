import jwt from 'jsonwebtoken';

/**
 * token验证
 * @param options
 * @param app
 * @returns {function(*, *)}
 */
export default (options, app) => {
    return (ctx, next) => {
        const excludeRouter = options.excludeRouter;
        if (excludeRouter.includes(ctx.path)) {
            return next();
        }
        if (ctx.method === 'WEBSOCKET') {
            return next();
        }
        const tokenKey = options.tokenKey;
        const token = ctx.cookie(tokenKey) || ctx.header[tokenKey] || ctx.post(tokenKey) || ctx.get(tokenKey) || ctx.query[tokenKey];
        if (!token) {
            return ctx.throw('未得到授权,请登录', 403)
        }
        const privateKey = think.config('token').privateKey;
        try {
            //鉴权认证
            const userInfo = jwt.verify(token, privateKey);
            const {userId, orgId, roleList} = userInfo;

            //从token解析用户信息到ctx对象,透传至后续controller
            ctx.state.userInfo = {userId, orgId, roleList};
            return next();
        } catch (e) {
            return ctx.throw('认证失败,token过期或无效', 401)
        }

    }
}