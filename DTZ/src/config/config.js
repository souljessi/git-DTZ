// default config
module.exports = {
    port: 8888,
    proxyPort: 8888,
    host: '172.16.187.83',
    staticIp: '172.16.187.83',
    sequelConfig: {
        dialect: 'mysql',
        username: 'remote',
        password: 'Kmlc3302133',
        database: 'digitizing_city_db',
        host: '120.77.65.31',
        timezone: '+08:00',
        logging: true,
        operatorsAliases: false,
        additional: {
            timestamps: false,
            freezeTableName: true
        },
        directory: '../../../model',
    },
    // sequelConfig: {
    //     dialect: 'mysql',
    //     username: 'root',
    //     password: 'j123456s',
    //     database: 'digitizing_city_db',
    //     host: '127.0.0.1',
    //     timezone: '+08:00',
    //     logging: true,
    //     operatorsAliases: false,
    //     additional: {
    //         timestamps: false,
    //         freezeTableName: true
    //     },
    //     directory: '../../../model',
    // },
    token: {
        privateKey: 'kmlc-private-3302133', // 秘钥
        // expiresIn: 60 * 60 * 24,//1天, token过期时间,单位秒,
        expiresIn: 60 * 60 * 24 * 365, //365天, token过期时间,单位秒,

    },
    redis: {
        port: 6379,
        host: 'http://172.16.187.83',

    },
    redisConfig: {
        // port: 6378,
        // host: '120.77.65.31',
        // password: 'Kmlc3302133',
        // // auth_pass:'Kmlc3302133',
        // db: 4
        // port: 6378,
        // host: '192.168.12.114',
        // password: 'Kmlc3302133',
        // db: 4
        port: 6379,
        host: '127.0.0.1',
        password: 'Kmlc3302133',
        db: 4,
    },
    nameSpace: {
        JDSL_QUEUE: 'jdsl:queue',//监督受理中心人员队列
        LOGIN_USER: 'login:user',
        socketRooms: 'socket:rooms',//socket房间频道，在用户登录以后加入。
        userInfo: 'userInfo', //用户的详细信息
        callExtenBind: 'call:extenBind'//分机号绑定信息
    },
    stickyCluster: true,
    imagePath: '/static/upload/images', //图片默认路径,
    administrator: ['000000'],//管理员id,可以设置多个
    pushServerUrl: 'http://39.129.35.72:4000/push/Msg/sendSystemMsg',
    // video: {
    //     port: 2558,
    //     host: '172.16.11.4',
    //     username: 'admin',
    //     password: '123',
    //     beatTimer: 30000,
    // }
};