import mqtt from 'async-mqtt';
// const defaultIp = think.config('mqttServer');

/**
 * Mqtt采集服务基类
 */
export default class MqttClientService {
    constructor(mqttServerIp) {
        this.serverIp = mqttServerIp || think.config('mqttServer');
        this.client = mqtt.connect(this.serverIp, {
            clientId: 'mqtt_' + Math.random().toString(16).substr(2, 8),
            clean: true,
            resubscribe: true
        });
        this.onConnect(() => {
            this.connectStatus = true;//连接状态
        });
        this.onErro(() => {
            // this.client.end();
            this.connectStatus = false;
            think.logger.error('error');
        });

        this.onReconnect(() => {
            think.logger.warn('Mqtt is reconnecting');
        });
        this.onClose(() => {
            this.connectStatus = false;
            think.logger.warn('mqtt is disconnect');
        })
    }

    /**
     * 订阅主题
     * @param topic  String/Array 主题
     * @param qos  number  消息传输等级，取值0-2
     * @returns {promise}
     */
    async subscribe(topic, qos = 1) {
        try {
            return await this.client.subscribe(topic, {qos: qos});
        } catch (e) {
            think.logger.error(new Error(e.message));
            return null

        }


    }

    /**
     * 向主题发布消息
     * @param topic   String/Array发布的主题名称
     * @param message 发布的消息体
     * @returns {*}
     */
    async publish(topic, message) {
        try {
            return await this.client.publish(topic, message);
        } catch (e) {
            think.logger.error(new Error(e.message));
            return null

        }

    }

    /**
     * 取消订阅
     * @param topic  String/Array 主题名称
     * @returns {*}
     */
    async unsubscribe(topic) {
        try {
            return await this.client.unsubscribe(topic);
        } catch (e) {
            think.logger.error(new Error(e.message));
            return null

        }
    }

    /**
     * 接收数据,在sub订阅以后，调用该函数
     * @param callback(主题名称,数据)
     */
    getMessage(callback) {
        this.client.on('message', (topic, message) => {
            let jsonData = think.bufferToJsonAndUtf8(message);//转码
            callback(topic, jsonData);
        });
    }

    /**
     * 连接事件
     */
    onConnect(callback) {
        this.client.on('connect', callback);
    }

    /**
     * 连接错误事件
     */
    onErro(callback) {
        this.client.on('error', callback)
    }

    /**
     * 重连事件
     * @param callback
     */
    onReconnect(callback) {
        this.client.on('reconnect', callback);
    }

    /**
     *关闭事件
     */
    onClose(callback) {
        this.client.on('close', callback)
    }

    /**
     * 自定义事件函数
     */
    on(event, callback) {
        this.client.on(event, callback);
    }

    /**
     * 关闭连接
     */
    end() {
        this.client.end();
    }


}
