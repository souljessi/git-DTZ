export default class extends think.BaseSocket {

    // async getEventListAction() {
    //     const eventListService = this.service('cms/EventService');
    //     let aj = think.ajaxJson();
    //     const result = await eventListService.eventList({});
    //     const userIds = this.getOnlineModuleByUser('jdsl');
    //     const arr = ArrayUtils.splitArray(result, userIds.length);
    //     const io = this.ctx.req.io;
    //     for (let i = 0; i < userIds.length; i++) {
    //         io.to(userIds[i]).emit('msgbyuser', arr[i]);
    //     }
    //
    //
    // }

    // /**
    //  * 新增事件接口
    //  */
    // async addEventAction() {
    //     let aj = think.ajaxJson();
    //     let data = this.post('objName,ObjPosition,BGID,parent_name,sub_name,area_code,group_code,remarks');
    //     data.baidu_x = Number(this.post('baidu_x'));
    //     data.baidu_y = Number(this.post('baidu_y'));
    //     data.source = Number(this.post('source'));
    //     data.type = Number(this.post('type'));
    //     if(this.post('businesskey')&&this.post('businesskey')!=''){//数据库int型
    //         data.businesskey = Number(this.post('businesskey'));
    //     }
    //     if(this.post('userId')){
    //         data.create_by = this.post('userId');
    //         data.create_date = new Date();
    //         data.update_date = data.create_date;
    //         data.update_by = data.create_by;
    //         data.ObjCode = this.post('area_code')+this.post('group_code');
    //         if(this.post('img_push')&&this.post('img_push').length>0){
    //             data.pic_path =  this.post('img_push').split(',');
    //         }
    //         const EventService = this.service('api/cms/EventService');
    //         const res = await EventService.addEvent(data);
    //         if(res&&res.error){
    //             aj.success = false;
    //             aj.msg = '数据库查询错误';
    //         }
    //     }else{
    //         aj.success = false;
    //         aj.msg = '未接收到用户信息';
    //     }
    //     // return this.json(aj);
    //     this.websocket.emit('onAddEvent', aj);
    //     if(aj.success){//上报成功推送到web端
    //         const io = think.socketIO;
    //         const userIds = await this.getOnlineModuleByUser('jdsl');
    //         //就事件随机推送给某个用户
    //         const randomId = userIds[Math.floor(Math.random() * userIds.length)];
    //         console.log('移动端上报了一条信息，随机推送的用户id：' + randomId,);
    //         let obj = this.getSocketMsgBody(res);
    //         obj.moduleName = 'jsdl';
    //         return io.to(randomId).emit('msgbyuser', obj);
    //     }
    //
    // }

    // /**
    //  * 核实事件
    //  */
    // async checkEventAction() {
    //     let aj = think.ajaxJson();
    //     // let DATA = this.wsData;
    //     let DATA = this.post();
    //     console.log('移动端传的参数',DATA);
    //     const data = {
    //         id: this.post('eventId'),
    //         is_check:Number(this.post('is_check')),
    //         verify_date:new Date(),
    //         verify_remark:this.post('verify_remark'),
    //         status:3
    //     };
    //     if(data.is_check===2){//不通过
    //         data.status=6;//待立案
    //     }
    //     const EventService = this.service('api/cms/EventService');
    //     const res = await EventService.checkEvent(data);
    //     if(res.error){
    //         aj.msg = "事件核实失败";
    //         aj.success = false;
    //     }
    //     this.websocket.emit('onCheckEvent', aj);
    //
    //     if(aj.success){
    //         const io = think.socketIO;
    //         const userIds = await this.getOnlineModuleByUser('jdsl');
    //         //推送给指定用户
    //         // const randomId = userIds[Math.floor(Math.random() * userIds.length)];
    //         const randomId = this.post('update_by');
    //
    //         console.log('8888888移动端上报了一条信息，推送用户id：' + randomId,);
    //         let obj = this.getSocketMsgBody(res);
    //         obj.moduleName = 'jsdl';
    //         return io.to(randomId).emit('msgbyuser', obj);
    //
    //     }
    //     return this.successJson(aj)
    //
    // }

}
