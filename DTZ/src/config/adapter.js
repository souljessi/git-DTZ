// const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
// const fileSession = require('think-session-file');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';
const socketio = require('think-websocket-socket.io');
const redisAdapter = require('socket.io-redis')(require('./config').redisConfig);

/**
 * socket.io 适配器
 * @type {Object}
 */
exports.websocket = {
    type: 'socketio',
    common: {
        // common config
    },
    socketio: {
        handle: socketio,
        allowOrigin: null,              // 默认情况下允许任何来源
        path: '/socket.io',             // 默认 '/socket.io'
        adapter: redisAdapter,
        messages: [
            {
                open: '/websocket/BaseSocket/open',
                close: '/websocket/BaseSocket/close',
                join: '/websocket/BaseSocket/join' ,//加入房间
                sendMsgByUser: '/websocket/BaseSocket/sendMsgByUser',//指定用户发送
                sendMsgByModule: '/websocket/BaseSocket/sendMsgByModule',//指定模块下的人发送
                sendAll: '/websocket/BaseSocket/sendAll',//群发
                send: '/websocket/BaseSocket/send',//自己发给自己
            },
            {
                // addEvent: '/websocket/EventAccepted/addEvent',//上报事件
                // checkEvent: '/websocket/EventAccepted/checkEvent' //核实事件
                // getEventList: '/websocket/EventAccepted/getEventList'
            },


        ]
    }
};
/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};
