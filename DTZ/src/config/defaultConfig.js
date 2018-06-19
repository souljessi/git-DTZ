module.exports = {
    videoConfig: {
        port: 2558,
        host: '172.16.11.4',
        username: 'admin',
        password: '123',
        beatTimer: 30000,
    },
    sequelConfig: {
        dialect: 'mysql',
        username: 'remote',
        password: 'Kmlc3302133',
        database: 'digitizing_city_db',
        host: '172.16.11.2',
        timezone: '+08:00',
        logging: false,
        operatorsAliases: false,
        additional: {
            timestamps: false,
            freezeTableName: true
        },
        directory: '../../../model',
    },
    redisConfig: {
        port: 6379,
        host: '172.16.11.2',
        password: 'Kmlc3302133',
        db: 4
    },
    nameSpace: {
        socketRooms: 'socket:rooms',//socket房间频道，在用户登录以后加入。
        userInfo: 'userInfo', //用户的详细信息
        callExtenBind: 'call:extenBind'//分机号绑定信息
    }
};
