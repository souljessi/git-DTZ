import assert from 'assert';
import BaseController from '../../framework/common/controller/BaseController'

const redisClient = require('redis').createClient(think.config().redisConfig);
const SocketIO = require('socket.io-emitter')(redisClient);

export default class extends BaseController {
    openAction() {
    }

    /**
     * 握手连接，登录成功后为用户分配一个房间号
     * @returns {Promise<boolean>}
     */
    async joinAction() {
        const {userId} = this.wsData;
        if (!userId) {
            return false;
        }
        this.websocket.markName = userId;
        this.websocket.join(userId);
    }

    /**
     * 为连接的socket对象设置唯一标记
     * @returns {Promise<boolean>}
     */
    // async setMarkAction() {
    //     const {userId, menuList} = this.wsData;
    //     if (!userId) {
    //         return false;
    //     }
    //     //为每个客户端连接设置一个唯一标记
    //     this.websocket.markName = userId;
    //     let str = '';
    //     if (Array.isArray(menuList)) {
    //         str = menuList.join();
    //     }
    //     const nameSpace = think.config('nameSpace');
    //     //存储所有在线用户，并为其标记模块权限标识。
    //     think.Redis.hset(nameSpace.socketRooms, userId, str);
    // }

    /**
     * 指定用户发送消息
     * @param socketBody  Object 统一消息结构体
     * @param toUsers  Array或者String  发送的目标用户
     * @param eventName String  事件名称
     */
    sendMsgByUserAction(socketBody, toUsers, eventName = 'defaultMsg') {
        const body = this.wsData || socketBody || this.post('socketBody');//this.wsData(前端socket发socket) socketBody(给其他业务调用传参)，this.post('socketBody')(前端post方式发送消息)
        const user = toUsers || this.post('toUsers');
        assert(Array.isArray(user) || typeof user === 'string', 'sendUsers must be a Array or String');
        assert(!think.isEmpty(body), 'socketBody must not empty');
        if (Array.isArray(user)) {
            for (let id of user) {
                SocketIO.to(id).emit(eventName, body);
            }
        } else {
            SocketIO.to(user).emit(eventName, body);
        }

    }


    /**
     * 对着某个模块的在线用户发
     * moduleName
     * result
     */
    // async sendMsgByModuleAction(socketBody, eventName = 'defaultMsg') {
    //     const {moduleName, result, menuUrl} = this.wsData || socketBody || this.post('socketBody');
    //     assert(moduleName, 'moduleName must not empty');
    //     let body = this.getSocketMsgBody(result);
    //     body.moduleName = moduleName;
    //     body.menuUrl = menuUrl;
    //     const userIds = await this.getOnlineModuleByUser(moduleName);
    //     const io = think.socketIO;
    //     for (let id of userIds) {
    //         io.to(id).emit(eventName, body);
    //     }
    // }

    /**
     * 根据当前连接的socket对象发，（自己对着自己发）
     * @param socketBody
     * @param eventName
     */
    sendAction(socketBody, eventName = 'defaultMsg') {
        const message = this.wsData || socketBody || this.post('socketBody');
        this.websocket.emit(eventName, message)
    }


    /**
     * 给所有客户端广播消息
     */
    sendAllAction(socketBody, eventName = 'defaultMsg') {
        const message = this.wsData || socketBody || this.post('socketBody');
        this.broadcast(eventName, message);
    }

    /**
     * 监听用户退出,并踢出房间
     */
    closeAction() {
        // const nameSpace = think.config('nameSpace');
        const markName = this.websocket.markName;
        if (!think.isEmpty(markName)) {
            this.websocket.leave(markName);
            // think.Redis.hdel(nameSpace.LOGIN_USER, markName);
        }

    }

    // /**
    //  * 根据模块名获取在线用户
    //  * @param moduleName  模块权限标识名称
    //  * @returns {Promise<Array>}
    //  */
    // async getOnlineModuleByUser(moduleName) {
    //     const nameSpace = think.config('nameSpace');
    //     //获取当前在线用户所拥有的模块权限，按需推送事件
    //     const allOnlineUsers = await think.Redis.hgetall(nameSpace.socketRooms);
    //     let ids = [];
    //     for (let id in allOnlineUsers) {
    //         let permission = allOnlineUsers[id];
    //         if (permission.includes(moduleName)) {
    //             ids.push(id);
    //         }
    //     }
    //     return ids;
    // }

    /**
     * 统一的socket通信的消息体
     */
    getSocketMsgBody(result) {
        return {//socket消息体结构
            title: '', //标题
            type: 0,//消息类型或标识
            menuUrl: null,//(可选)路由菜单url，用于跳转菜单
            result: result || {},//消息体
            attributes: {},//其他参数
            sendDate: think.datetime(new Date()),//发送时间
            sendUser: this.getUser().userId,
        }
    }

    testEventAction() {
        // console.log(this.websocket,12356);
        // this.websocket.id='jessi';
        // this.websocket.emit('testEvent',{});

        // console.log('获取客户端 addUser 事件发送的数据', this.wsData);
        // console.log('获取当前 WebSocket 对象', this.websocket);
        // console.log('判断当前请求是否是 WebSocket 请求', this.isWebsocket);
        // console.log('1235', this.websocket.request.headers.cookie);
        // console.log('获取当前的io对象，该对象为socket的一个对象实例', this.ctx.req.io);
        // console.log('获取所有房间的信息//key为房间名', this.ctx.req.io.sockets.manager.rooms);

    }
}


