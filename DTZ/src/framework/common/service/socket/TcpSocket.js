/**
 * Title：昆明联诚科技-TcpSocket客户端音视频流通信服务
 * Notes:1.服务基于ECMAScript6/7规范编写,Node版本应大于7.6,推荐8.x-10.x
 *       2.服务基于tcp协议,完全根据联诚科技科技视频平台协议定制开发。
 *       3.编码UFT8，数据通信为JSON字符串，需要注意，所有的值类型统一为String
 *       4.支持自定义配置信息。
 * Author：软件部_Jessi
 * CreateDate：2018/5/9
 */

const net = require('net');
const EventEmitter = require('events');
// const Redis = require('think-redis');
// const fs = require('fs');
const options = {
    readable: true,
    writable: true,
    allowHalfOpen: true
};
const defaultConfig = {
    port: 2558,
    host: '192.168.12.84',
    username: 'admin',
    password: '123',
    beatTimer: 30000,
};
const CodeMap = {
    REQUEST_AUTH: 'request_auth',//鉴权
    LOGIN: 'login',//登陆
    LOGOUT: 'logout',//登出
    KEEPALIVE: 'KeepAlive',//心跳
    QUERY_CATALOG: 'query_catalog',//资源目录
    QUERY_DEVICE_INFO: 'query_device_info',//单个设备查询
    QUERY_STATUS: 'query_status',//设备状态查询
    SUBSCRIBE_DEVICE_STATUS: 'subscribe_device_status',//设备状态订阅
    PUBLISH_DEVICE_STATUS: 'publish_device_status',//设备状态推送
    UNSUBSCRIBE_DEVICE_STATUS: 'unsubscribe_device_status',//取消设备状态订阅
    SUBSCRIBE_ALARM_EVENT: 'subscribe_alarm_event',//报警事件订阅
    PUBLISH_ALARM_EVENT: 'publish_alarm_event',//报警事件推送
    UNSUBSCRIBE_ALARM_EVENT: 'unsubscribe_alarm_event',//取消报警事件订阅
    QUERY_CHANNEL: 'query_channel',//获取电视墙配置
    SWITCH_CHANNEL: 'switch_channel',//电视墙切换
    QUERY_HISTORY_RECORD: 'query_history_record',//历史视频查询
    PTZ_CMD: 'ptz_cmd',//云台控制
    RESPONSE_AUTH: 'response_auth',
    RESPONSE_LOGIN: 'response_login',
    RESPONSE_QUERY_CATALOG: 'response_query_catalog',
};

const events = {
    CATALOGS: 'catalogs'
};
const tcpSocket = new net.Socket();


class TcpSocket {
    constructor(config) {
        this._emitter = new EventEmitter();
        Object.assign(defaultConfig, config);
        this.connectStatus = false;//连接状态
        this.sessionId = '';//session会话id
        this.Interval = false;//心跳实例标识
        this.from_index = 1; //数据多段标识，用来规避一次指令返回多段结果,取值从1开始。
        this.data = {//数据源
            catalog: {
                count: 0,
                list: []
            },
            queryChannel: null,
            deviceStatus: null,
            stringMsg: ''

        };
        this.connect();
        tcpSocket.on('connect', () => {
            console.log('tcpServer is connect');
            /**
             * 初始化操作 1.获取令牌　2.登陆 3.保持心跳 4.获取和缓存资源目录 5.订阅设备状态 6.推送设备状态
             */
            this.getToken();
        }).on('data', async (baseData) => {
            try {
                baseData = JSON.parse(baseData);
            } catch (e) {
                baseData = baseData.toString();
            }
            if (typeof baseData !== 'string') {
                const {result, function_code, cmd_num, data} = baseData;
                if (result === 'success') {
                    switch (function_code) {
                        case CodeMap.RESPONSE_AUTH:
                            this.login(data, cmd_num);
                            break;
                        case CodeMap.RESPONSE_LOGIN:
                            this._initTask(data);
                            break;
                        case CodeMap.RESPONSE_QUERY_CATALOG:
                            this._receiveData(data);
                            break;
                        case CodeMap.PUBLISH_DEVICE_STATUS:
                            this._updateDeviceStatus(data);
                            break;
                    }
                } else {

                }
            } else {
                this.data.stringMsg += baseData;
            }


        }).on('error', err => {
            console.error(err);
            if (err.code === 'ECONNREFUSED') {//如果连接超时，则每过5秒发起重连
                console.log('Waiting for 5 seconds before trying port:' + defaultConfig.port + ' again');
                setTimeout(this.connect, 5000);
            }
        }).on('close', () => {
            console.log('TcpServer Connection closed');
            this.disconnect();
        }).on('end', (data) => {
            console.log('TcpServer Connection end');
        });

    }

    /**
     * 连接tcpServer
     */
    connect() {
        tcpSocket.connect(defaultConfig);
    };

    on(event, listener) {
        this._emitter.addListener(event, listener);
    }

    off(event, listener) {
        this._emitter.removeListener(event, listener);
    }

    /**
     * 请求指令
     * @param requestCode   根据对应服务端的指令code
     * @param data        data参数
     * @returns {Promise<any>}
     */
    writeCode(requestCode, data = {}) {
        tcpSocket.write(this.createMessageBody(requestCode, data));
    }

    _initTask(data) {
        this.connectStatus = true;
        this.sessionId = data;
        this.keepAlive();
        this.writeCode(CodeMap.QUERY_CATALOG, {from_index: this.from_index, count: 1});
        this.writeCode(CodeMap.SUBSCRIBE_DEVICE_STATUS);
    }

    _receiveData(data) {
        if (Number(this.from_index) > Number(data['sum_num'])) {
            this._emitter.emit(events.CATALOGS, this.data.catalog);//CATALOGS
            this.from_index = 1;
            this.data.catalog.list = [];
            this.data.count = 0;
        } else {
            const item = data.list[0];
            if (this.data.catalog.count === 0) {
                this.data.catalog.count = data['sum_num'];
            }
            this.data.catalog.list.push(item);
            this.from_index++;
            this.writeCode(CodeMap.QUERY_CATALOG, {from_index: this.from_index, count: 1});
        }
    }

    _updateDeviceStatus(data) {
        this.writeCode(CodeMap.QUERY_CATALOG, {from_index: this.from_index, count: 1});
        // this._emitter.emit(events.DEV_UPDATE, data);
    }

    /**
     * 云台控制
     * @param deviceId 设备ID
     * @param cmdType  指令类型(1.上　2.下 3.左 4.右 5.放大 6.缩小 15.停止控制)
     * @param speed   速度(取值0-100)
     */
    ptz(deviceId, cmdType, speed) {
        this.writeCode(CodeMap.PTZ_CMD, {device_id: deviceId, cmd_type: cmdType, speed: speed});

    }

    /**
     * 同步获取data
     */
    getDataSync() {
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * 获取鉴权令牌
     */
    getToken() {
        tcpSocket.write(this.createMessageBody('request_auth'));

    }


    /**
     * 登录(一般情况下无需调用，该函数在心跳过期或者意外中断后会自动调用)
     * @param token
     */
    login(token, cmdNum) {
        const crypto = require('crypto');
        let {username, password} = defaultConfig;
        let cryptoPassword = crypto.createHash("md5").update(token + password).digest("hex");
        const data = {user_name: username, password: cryptoPassword};
        let body = {
            function_code: 'login',
            cmd_num: cmdNum,
            data: data
        };
        tcpSocket.write(JSON.stringify(body));


    }

    /**
     * 维护心跳周期，默认30秒向服务器握手一次
     */
    keepAlive() {
        const beatTimer = defaultConfig.beatTimer;
        this.Interval = setInterval(() => {
            tcpSocket.write(this.createMessageBody('KeepAlive'));
        }, beatTimer);
    }

    /**
     * 注销登录
     */
    logout() {
        this.createMessageBody('logout');
        this.disconnect();
    }

    disconnect() {
        this.connectStatus = false;
        this.sessionId = '';
        if (this.Interval) {
            clearInterval(this.Interval);
        }
        this.Interval = false;
        tcpSocket.end();
    }

    /**
     * 生成一个指令序号,支持自定义规则，默认值:kmlc_时间戳
     */
    createCmdNumber(customize = `kmlc_${new Date().getTime()}`) {
        return String(customize);
    }

    /**
     * 获取当前的连接状态
     * @returns {boolean}
     */
    isReady() {
        if (this.connectStatus === true) {
            return true;
        }
        return false;
    }

    /**
     * 生成统一的请求消息体
     */
    createMessageBody(functionCode, data = {}, cmdNum) {
        try {
            let obj = {
                function_code: String(functionCode),
                cmd_num: cmdNum || this.createCmdNumber(),
            };
            if (Object.keys(data).length > 0) {
                for (let key in data) {
                    let value = data[key];
                    if (typeof value === 'number') {
                        data[key] = String(value);
                    }
                }
                obj.data = data;
            }

            if (this.sessionId) {
                obj.session_id = String(this.sessionId);
            }
            return JSON.stringify(obj);
        } catch (e) {
            console.error(e)
        }

    }

    getCataLogList() {
        return this.data.catalog;
    }


}

module.exports = TcpSocket;
