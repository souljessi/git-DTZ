export default class extends think.BaseSocket {
    /**
     * 查询全部事件分类
     */
    async getAllEventGroupAction() {
        let aj = think.ajaxJson();
        const EventService = this.service('api/cms/EventService');
        const res = await EventService.getAllEventGroup();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '数据库查询错误';
        }
        return this.json(aj);
    }

    /**
     * 保存图片
     */
    async doUploadImgAction() {
        const file = this.file('image');
        let aj = think.ajaxJson();
        const serverIP = 'http://' + think.config('staticIp') + ':' + think.config('proxyPort');

        if (file) { //保存图片
            const pathObj = await this.renameFile(file);
            if (pathObj) {
                aj.success = true;
                aj.msg = '上传成功';
                aj.result = {
                    fileName: pathObj.filePathStatic,
                    filePathStatic: serverIP + '/' + pathObj.filePathStatic
                }
            } else {
                aj.success = false;
                aj.msg = '图片保存失败';
            }
        } else {
            aj.success = false;
            aj.msg = "文件上传失败"
        }
        return this.json(aj);
    }

    /**
     * 查询事件列表
     */
    async getEventListAction() {
        let aj = think.ajaxJson();
        const data = {
            page: Number(this.post('page')),
            pageSize: Number(this.post('pageSize')),
            userId: this.post('userId'),
            flag: Number(this.post('flag')),
            group_code: this.post('group_code'),
            area_code: this.post('area_code'),
            is_check: this.post('is_check').split(',')
        };
        const EventService = this.service('api/cms/EventService');
        const res = await EventService.getEventListBy(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '数据库查询错误';
        }
        return this.json(aj);
    }

    /**
     * 事件上报接口
     */
    async addEventAction() {
        return this.action('cms/EventController', 'allEventReport');

        // let data = this.post('objName,ObjPosition,BGID,area_code,remarks');
        // data.baidu_x = Number(this.post('baidu_x'));
        // data.baidu_y = Number(this.post('baidu_y'));
        // data.source = Number(this.post('source'));
        // if (this.post('businesskey') && this.post('businesskey') !== '') {
        //     data.businesskey = this.post('businesskey');
        // }
        // if(this.post('group_code')&&this.post('area_code')){//传分类编码和区域
        //     data.parent_name = this.post('parent_name');
        //     data.sub_name = this.post('sub_name');
        //     data.group_code = this.post('group_code');
        //     data.type = Number(this.post('type'));
        //     data.ObjCode = this.post('area_code') + this.post('group_code');
        // }
        // if (this.post('userId')) {
        //     data.create_by = this.post('userId');
        //     data.create_date = new Date();
        //     data.update_date = data.create_date;
        //     data.update_by = data.create_by;
        //     if (this.post('img_push') && this.post('img_push').length > 0) {
        //         data.pic_path = this.post('img_push').split(',');
        //     }
        //     const EventService = this.service('api/cms/EventService');
        //     let res = await EventService.addEvent(data);
        //     if (res && res.error) {
        //         return this.errorJson('查询失败')
        //     }
        //
        //     const userIds = await this.getOnlineModuleByUser('jdsl');
        //     let obj = this.getSocketMsgBody(res);
        //
        //     //推给所有受理中心人员
        //     this.sendMsgByUserAction(obj, userIds, 'accept_screen');
        //     // this.sendMsgByUserAction(obj, userIds, 'control_center');
        //
        //     // const user_id = await this.getOnlineModuleByUser();
        //     //就事件随机推送给某个用户
        //     // const randomId = userIds[Math.floor(Math.random() * userIds.length)];
        //
        //     // console.log(randomId, 'randomId');
        //     // let obj = this.getSocketMsgBody(result);
        //     // let socketBody = {
        //     //     result: {
        //     //         title: '新的事件上报',
        //     //         date: new Date()
        //     //     },
        //     //     moduleName: 'jdsl',
        //     //
        //     //     menuUrl: 'accept'
        //     // };
        //     // this.sendMsgByUserAction(socketBody, user_id, 'msg_box');
        //
        //     return this.successJson();
        //
        // } else {
        //     return this.errorJson('用户id不能为空')
        // }
        //     //上报成功推送到web端
    }

    /**
     * 修改事件接口
     */
    async editEventAction() {
        let aj = think.ajaxJson();
        let data = this.post('id,objName,ObjPosition,source,parent_name,sub_name,area_code,group_code,remarks');
        if (this.post('userId')) {
            data.type = Number(this.post('type'));
            data.update_by = this.post('userId');
            data.update_date = new Date();
            data.ObjCode = this.post('area_code') + this.post('group_code');
            if (this.post('img_push') && this.post('img_push').length > 0) {
                data.pic_path = this.post('img_push').split(',');
            }
            const EventService = this.service('api/cms/EventService');
            const res = await EventService.editEvent(data);
            if (res && (res.error || res.msg)) {
                aj.success = false;
                aj.msg = '数据库查询错误';
            }
        } else {
            aj.success = false;
            aj.msg = '未接收到用户信息';
        }

        return this.json(aj);
    }

    /**
     * 删除事件
     */
    async delEventAction() {
        let aj = think.ajaxJson();
        const data = {id: this.post('eventId')};
        const EventService = this.service('api/cms/EventService');
        const res = await EventService.delEvent(data);
        if (res.error) {
            aj.msg = "撤回事件失败";
            aj.success = false;
        }
        return this.json(aj);
    }

    /**
     * 核实事件
     */
    async checkEventAction() {
        let aj = think.ajaxJson();
        // let DATA = this.wsData;
        let DATA = this.post();
        const data = {
            id: this.post('eventId'),
            is_check: Number(this.post('is_check')),
            verify_date: new Date(),
            verify_remark: this.post('verify_remark'),
            status: 3
        };
        if (data.is_check === 2) {//不通过
            data.status = 6;//待立案
        }
        const EventService = this.service('api/cms/EventService');
        const res = await EventService.checkEvent(data);
        const result = await EventService.checkEventDetail(data);
        if (res.error) {
            aj.msg = "事件核实失败";
            aj.success = false;
        }
            const randomId = this.post('update_by');
            let obj = this.getSocketMsgBody(result);
            this.sendMsgByUserAction(obj, [randomId], 'accept_screen');

        // let socketBody = {
        //     result: {
        //         title: '新的事件核实',
        //         id: data.id,
        //         date: new Date()
        //     },
        //     moduleName: 'jdsl',
        //
        //     menuUrl: 'accept'
        // };
        // this.sendMsgByUserAction(socketBody, [randomId], 'msg_box');
            return this.successJson()
    }

    /**
     * 根据事件id获取事件详情
     */
    async getEventInfoAction() {
        let aj = think.ajaxJson();
        let res = {};
        const data = {
            id: this.post('eventId'),
        };
        const EventService = this.service('api/cms/EventService');
        if(this.post('flag')){//微信用户上报
            res = await EventService.getWechatEventInfo(data);
        }else{
            res = await EventService.getEventInfo(data);
        }
        if (!res.error) {
            aj.result = res;
        } else {
            aj.msg = "事件详情获取失败或已被删除";
            aj.success = false;
        }
        return this.json(aj);
    }

    /**
     * 获取事件核实状态列表
     */
    async verifyStateListAction() {
        let aj = think.ajaxJson();
        const EventService = this.service('api/cms/EventService');
        const res = await EventService.verifyStateList();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.msg = "事件核实状态列表获取失败";
            aj.success = false;
        }
        return this.json(aj);
    }

}