import RedisInit from '../framework/common/cache/RedisInit';
import crypto from 'crypto';
import BaseController from '../framework/common/controller/BaseController';
import TcpSocketIndex from '../framework/common/service/socket/index';
import BaseSocket from '../controller/websocket/BaseSocket';
import path from 'path'
export default {
    resource: path.join(think.ROOT_PATH, 'www'),
    Redis: new RedisInit(),
    BaseSocket: BaseSocket,
    BaseController: BaseController,
    TcpSocket: TcpSocketIndex,



    /**
     *ajax请求返回给前端的统一数据格式
     * @param success 成功标识
     * @param msg  提示信息
     * @param result 结果集
     * @param attributes 其他参数
     * @returns {{success: boolean, msg: string, result: {},attributes:{}}}
     */
    ajaxJson: (result = {}, msg = '操作成功', attributes = {}, success = true) => {
        return {
            success: success,
            msg: msg,
            result: result,
            attributes: attributes
        }

    },
    /**
     * 用户名+密码加盐算法，哈希加密，采用sha1不可逆加密方式
     * @param username
     * @param password
     * @returns {*}
     */
    irreversibleEncrypt: (username, password) => {
        var key = 'KMLC';
        var encryptCode = crypto.createHash('sha1').update(password + '{' + username + '}' + key).digest('hex');
        return encryptCode;
    },

    /**
     * 判断json对象是否为空
     * @param json --{key:value}
     * @returns --true|false
     */
    isOptionNull: (json) => {
        var flag = false;
        for (var p in json) { //遍历json对象的每个key/value对,p为key
            if (json[p] != '') {
                flag = true;
            }
        }
        return flag;
    },

};