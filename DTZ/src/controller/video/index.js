import moment from 'moment';

export default class extends think.BaseSocket {
    indexAction() {
        return this.successJson('hi video');
    }
    /**
     * 获取视频目录
     */
    async getCatalogAction() {
        try {
            let ret = await think.Redis.hget('video:data', 'catalog');
            if (!think.isEmpty(ret)) {
                return this.successJson(JSON.parse(ret));
            }
            return this.errorJson('没有资源列表');
        } catch (e) {
            return this.errorJson('获取失败');
        }

    }
    async saveAction(){
        return this.action('cms/EventController', 'allEventReport');

        // const file = this.file('image');
        // const videoEvent = this.service('video/index');
        // const userData = this.getUser();
        // if(file){
        //     const pathObj = await this.renameFile(file);
        //     if(pathObj){
        //         const data = {
        //             userid:userData.userId,
        //             source:this.post('source'),
        //             baidu_x:this.post('baidu_x'),
        //             baidu_y:this.post('baidu_y'),
        //             ObjPosition:this.post('ObjPosition'),
        //             remarks:this.post('remarks'),
        //             realpath:pathObj.realpath
        //         }
        //         const res = await videoEvent.saveEventByVideo(data);
        //         if(res&&!res.error){
        //             const userIds = await this.getOnlineModuleByUser('jdsl');//可见监督受理中心的用户
        //             let obj = this.getSocketMsgBody(res);
        //             //推给所有受理中心人员
        //             this.sendMsgByUserAction(obj, userIds, 'accept_screen');   
        //             //同时推送到消息盒子
        //             const msgBody = {
        //                 title: '视频监控违法抓拍',
        //                 date:moment(res.create_date).format("YYYY-MM-DD HH:mm:ss"),
        //                 id:res.id,
        //                 userIds:res.create_by
        //             };
        //             let msgData = this.getSocketMsgBody(msgBody);
        //             msgData.menuUrl = "accept";
        //             this.sendMsgByUserAction(msgData, userIds, 'msg_box');  //推送至消息盒子
        //             return this.successJson(); 
        //         }else{
        //             return this.errorJson('违法抓拍事件上报失败'); 
        //         }
        //     }else{
        //         return this.errorJson('抓拍照片上传服务器失败');
        //     }
        // }else{
        //     return this.errorJson('抓拍照片上传服务器失败'); 
        // }
        
    }
}