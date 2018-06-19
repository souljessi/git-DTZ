export default class extends think.Service {
    constructor() {
        super();
        const db = this.db;
        this.eventModel = db['cms_event'];
        this.attachmentModel = db['sys_attachment'];
    }

    /**
     * 违法抓拍上报事件
     * userid --上报用户
     * baidu_x --经度
     * baidu_y --纬度
     * source --事件来源
     * realpath --图片路径
     */
    async saveEventByVideo(data) {
        const eventData = {
            create_by:data.userid,
            update_by:data.userid,
            create_date:new Date(),
            update_date:new Date(),
            source:data.source,
            remarks:data.remarks,
            baidu_x:data.baidu_x,
            baidu_y:data.baidu_y,
            ObjPosition:data.ObjPosition,
            id:think.uuid('v1')
        };
        const attachmentData = {
            id:think.uuid('v1'),
            businesskey:eventData.id,
            realpath:data.realpath,
            create_date:eventData.create_date,
            user_id:data.userid
        };
        try {
            const event = await this.eventModel.create(eventData);
            const attachment = await this.attachmentModel.create(attachmentData);
            return JSON.parse(JSON.stringify(event));
        } catch (err) {
            return this.exceptionService.handleError(err);
        }
    }





}