// var SocketIO = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379, password: 'kmlc3302133'});
// SocketIO.redis.on('error', onError);
//
// function onError(err){
//     console.log(err);
// }
export default class extends think.BaseSocket {
    async indexAction() {
        return this.display('index');
    }

    sendMsgAction() {
        const result = {name: 'jessi'};
        const body = this.getSocketMsgBody(result);
        this.sendMsgByUserAction(body, ['000000'], 'msg_box');
    }

    async testAction() {
        const result = await this.service('test/TestService').test();
        return this.successJson(result);

        // this.websocket.emit('hi', {name:'jessi'})
        // console.log(think.socketIO,231456);
        // console.log(this.ctx.req.io,'asdqwesq');
        // console.log(111111111)
        // const Op = this.db.Sequelize.Op;
        //
        // const result = await this.db['sys_role'].findAll({
        //     where: {id: {[Op.in]: [1111, 2222]}},
        //     attributes: ['auth_org_ids'],
        //     raw: true
        // });
        // let arry = [];
        // for (let value of result) {
        //     if (!think.isEmpty(value.auth_org_ids)) {
        //         arry = arry.concat(value.auth_org_ids.split(','));
        //     }
        //
        // }
        // const orgIds = ArrayUtils.unique(arry).join();
        // console.log(orgIds);


        // SocketIO.emit('broadcast','dsadaasd');
        // SocketIO.to('000000').emit('hi','hello')


    }
};