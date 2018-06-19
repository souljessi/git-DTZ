const path = require('path');
const cors = require('kcors');
const payload = require('think-payload');
const isDev = think.env === 'development';
const historyFallback = require('koa2-history-api-fallback');


module.exports = [
    {
        handle: cors,
        options: {
            origin: '*',
            credentials: true,
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
        }
    },
    {
        handle: 'meta',
        options: {
            logRequest: isDev,
            sendResponseTime: isDev
        }
    },
    {
        handle: 'resource',
        enable: true,
        // enable: isDev,
        options: {
            root: path.join(think.ROOT_PATH, 'www'),
            publicPath: /^\/(static|favicon\.ico)/
        }
    },
    {
        handle: 'trace',
        enable: !think.isCli,
        options: {
            debug: isDev,
            error(err) {
                think.logger.error(err);
            }

        }
    },
    {
        handle: payload,//上传文件中间件
        options: {
            uploadDir: path.join(think.ROOT_PATH, 'runtime/tem'),//存放临时的目录，请求结束后自动删除文件
            limit: '5mb',//允许上传的最大容量
            hash: 'md5',
            keepExtensions: true,//保留文件完整后缀名
            multiples: true,//支持获取多个同名(input里的name)文件
            extendTypes: {//扩展支持的上传类型
                json: ['application/x-javascript'], // //将解析应用程序/ x-JavaScript的型体中相同的方式，JSON型
                form: ['application/thinkjs-form'], // 将表单类型相同的方式解析application / thinkjs-form类型的主体
                text: ['application/thinkjs-text'], // 将文本类型相同的方式解析application / thinkjs-text类型的主体
                multipart: ['application/thinkjs-multipart'], //多部分表单类型相同的方式解析application / thinkjs-multipart类型的主体
                xml: ['application/thinkjs-xml'], //将xml类型相同的方式解析application / thinkjs-xml类型的主体
            }
        }
    },
    {
        handle: historyFallback,
        match: ctx => {
            const excludeUrl = ['/index/downloadFile'];//需要特殊处理的请求路径，如基于get方式的(href,download)
            if (!excludeUrl.includes(ctx.path)) {
                return true;
            }
            return false;
        }
    },
    {
        handle: 'jwtAuth',//token鉴权
        options: {
            tokenKey: 'access_token',
            // privateKey: 'kmlc-private-3302133',//秘钥
            excludeRouter: [//需要排除的路由
                '/index.html',
                '/static',
                '/login',
                '/api/login',

            ]
        }
    },
    // {
    //     handle: 'roleAuth',//角色访问验证
    //     options: {
    //         excludeRouter: [//需要排除的路由以什么开头
    //             '/login',
    //             '/static',
    //             '/api'
    //         ]
    //     }
    // },

    {
        handle: 'router',
        options: {}
    },
    'logic',
    'controller'
];
