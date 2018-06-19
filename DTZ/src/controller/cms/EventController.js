// import BaseController from "../../framework/common/controller/BaseController";

export default class extends think.BaseSocket {
    /**
     * 所有事件上报的统一接口
     */
    async allEventReportAction() {
        const obj = this.post('objName,ObjPosition,BGID,area_code,remarks,baidu_x,baidu_y,source,businesskey,group_code,parent_name,sub_name,type,img_push');
        obj.create_by = this.getUser().userId;
        obj.create_date = new Date();
        obj.update_date = obj.create_date;
        obj.update_by = obj.create_by;
        obj.id = think.uuid('v1');
        //移动端上传图片
        if (obj.img_push) {
            const picPath = obj.img_push.split(',');
            obj.picPath = picPath;
        }
        if (obj.area_code && obj.group_code) {
            obj.ObjCode = obj.area_code + obj.group_code;
        }
        //如果web端有图片上传，则保存图片
        if (!think.isEmpty(this.file())) {
            this.uploadFileAction(obj.id);
        }
        const {pushUserId, data} = await this.service('cms/EventService').addEvent(obj);

        if (!think.isEmpty(pushUserId) && !think.isEmpty(data)) {
            const body = this.getSocketMsgBody(data);
            const msgBox = this.getSocketMsgBody();
            msgBox.title = '事件上报';
            msgBox.menuUrl = 'accept';
            msgBox.result.id = obj.id;
            if (pushUserId) {
                this.sendMsgByUserAction(msgBox, pushUserId, 'msg_box');
                this.sendMsgByUserAction(body, pushUserId, 'accept_screen');
            }
            return this.successJson('上报成功');
        } else {
            return this.errorJson('上报失败');
        }


    }

    async getEventListAction() {
        let aj = think.ajaxJson();
        const {pageSize, page} = this.post('pageSize,page');
        const eventService = this.service('cms/EventService');
        const userIds = await this.getOnlineModuleByUser('jdsl');
        const res = await eventService.getRealTimeEventList(userIds, pageSize, page);
        if (!res.error) {
            aj.result = res;
            return this.json(aj);
        }
        return this.json(res)
    }

    /**
     * 查询事件
     */
    async queryEventAction() {
        let aj = think.ajaxJson();
        const eventService = this.service('cms/EventService');
        const res = await eventService.getEvent(this.post());
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }

        return this.json(aj);
    }

    async newAddEventAction() {
        let aj = think.ajaxJson();
        const eventService = this.service('cms/EventService');
        const res = await eventService.getNewAddEvent(this.post());
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }

        return this.json(aj);
    }

    async update_read_flagAction() {
        let aj = think.ajaxJson();
        const eventService = this.service('cms/EventService');
        const res = await eventService.update_read_flag(this.post());
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }

        return this.json(aj);
    }

    async queryEventListAction() {
        let aj = think.ajaxJson();
        const eventListService = this.service('cms/EventService');
        let data = this.post();

        // const RES = await eventListService.allEventList();
        // console.log('39',RES);
        const result = await eventListService.eventList(data);

        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    async queryAllEventListAction() {
        let aj = think.ajaxJson();
        const eventListService = this.service('cms/EventService');
        let data = this.post();

        // const RES = await eventListService.allEventList();
        // console.log('39',RES);
        const result = await eventListService.allEventList(data);

        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    async queryOldEventListAction() {
        let aj = think.ajaxJson();
        const eventListService = this.service('cms/EventService');
        let data = this.post();
        const result = await eventListService.eventOldList(data);

        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    /**
     * 按条件查询事件列表
     */

    async querySpecificAction() {
        let aj = think.ajaxJson();
        const specificEventService = this.service('cms/EventService');
        let data = this.post();
        const result = await specificEventService.specificEvent(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    async queryAllSpecificAction() {
        let aj = think.ajaxJson();
        const specificEventService = this.service('cms/EventService');
        let data = this.post();
        const result = await specificEventService.allSpecificEvent(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //查询事件分类

    async queryEventGroupAction() {
        let aj = think.ajaxJson();

        const parentEventService = this.service('cms/EventService');
        let data = this.get();
        const result = await parentEventService.EventGroup(data);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    /**
     * 查询事件大类
     */

    async queryParentEventAction() {
        let aj = think.ajaxJson();

        const parentEventService = this.service('cms/EventService');
        let data = this.get();
        const result = await parentEventService.parentEvent(data);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    /**
     * 按事件大类id查询小类
     */
    async queryChildrenEventAction() {
        let aj = think.ajaxJson();
        const childrenEventService = this.service('cms/EventService');
        let data = this.post();
        const result = await childrenEventService.childrenEvent(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    /**
     * 获取事件来源类型
     */
    async eventSourceTypeAction() {
        let aj = think.ajaxJson();
        const sourceTypeService = this.service('cms/EventService');
        let data = this.get();
        const result = await sourceTypeService.eventSource(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    /**
     * 从字典表获取事件状态类型
     */
    async eventStateTypeAction() {
        let aj = think.ajaxJson();
        const stateTypeService = this.service('cms/EventService');
        let data = this.get();
        const result = await stateTypeService.eventState(data);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    /**
     * 添加所属单元格id:BGID
     */

    async addEventBGIDAction() {
        let aj = think.ajaxJson();
        const BGIDService = this.service('cms/EventService');
        const res = await BGIDService.eventBGID(this.post());
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '保存失败'
        }

        return this.json(aj)
    }

    // /**
    //  * 修改所属单元格id:BGID
    //  */
    //
    // async updateEventBGIDAction(){
    //     let aj = think.ajaxJson();
    //     const updateBGIDService = this.service('cms/EventService');
    //     const res = await updateBGIDService.updateEventBGID(this.post());
    //
    //     if(!res.error){
    //         aj.result = res
    //
    //     }else{
    //         aj.success = false;
    //         aj.msg = '保存失败'
    //     }
    //     return this.json(aj)
    // }

    /**
     * 事件废弃
     */
    async eventDoneAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const eventDoneService = this.service('cms/EventService');
        const res = await eventDoneService.eventDone(data);
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '操作失败'
        }

        return this.json(aj)

    }

    /**
     * 删除事件
     */

    async deleteEventAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const eventDoneService = this.service('cms/EventService');
        const res = await eventDoneService.deleteEvent(data);
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '操作失败'
        }

        return this.json(aj)
    }


    /**
     * 事件上报图片
     */
    async eventPicAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const eventPicService = this.service('cms/EventService');
        const res = await eventPicService.eventPic(data);
        if (!res.error) {
            aj.result = res
        } else {
            aj.success = false;
            aj.msg = '操作失败'
        }
        return this.json(aj)
    }

}