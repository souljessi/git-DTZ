import axios from "axios";
import moment from 'moment';

const isDev = think.env === 'development';

export default class extends think.BaseSocket {
    constructor(ctx) {
        super(ctx);
        this.callConfig = {
            callServer: isDev ? "http://39.129.35.72:4015" : "http://172.16.11.23:8088",
            queuePauseDo: "/smartcrm_2018/index.php?m=api&a=queuePauseDo", //设置分机状态
            clickCall: "/smartcrm_2018/index.php?m=api&a=clickCall", //点击拨号，呼出电话
            pbxAMIFeedBackJson: "/smartcrm_2018/index.php?m=api&a=pbxAMIFeedBackJson",
            setHuzhuanInfo: "/smartcrm_2018/index.php?m=api&a=setHuzhuanInfo",
            callTransfer: "/smartcrm_2018/index.php?m=api&a=callTransfer",
            cdrData: "/smartcrm_2018/index.php?m=api&a=cdrData",
            editBlackPhone: '/smartcrm_2018/index.php?m=api&a=editBlackPhone',
            blackPhoneList: '/smartcrm_2018/index.php?m=api&a=blackPhoneList',
            loginName: "ny",
            password: "ny2018"
        };
    }

    /**
     * 查询通话流水
     */
    async cdrDataAction() {
        let {
            exten,
            startTime,
            endTime,
            phone_num,
            billsec
        } = this.post(
            "exten,startTime,endTime,phone_num,billsec"
        );
        let data = {
            exten
        };
        if (startTime) data.startTime = startTime;
        if (endTime) data.endTime = endTime;
        if (phone_num) data.phone_num = phone_num;
        if (billsec) data.billsec = billsec;
        try {
            const Res = await axios.post(
                this.callConfig.callServer + this.callConfig.cdrData,
                data
            );
            return this.json(Res.data);
        } catch (error) {
            return this.json({
                error: 1
            });
        }
    }

    /**
     * 设置呼叫转移
     *
     * @returns
     */
    async callTransferAction() {
        let {
            type,
            exten,
            to_num
        } = this.post("type,exten,to_num");
        try {
            const Res = await axios.post(
                this.callConfig.callServer + this.callConfig.callTransfer, {
                    type,
                    exten,
                    to_num
                }
            );
            return this.json(Res.data);
        } catch (error) {
            return this.json({
                error: 1
            });
        }
    }

    /**
     * 拨号
     *
     * @returns
     */
    async clickCallAction() {
        let {
            exten,
            phone
        } = this.post("exten,phone");
        let data = {
            exten,
            phone
        };
        try {
            const Res = await axios.post(
                this.callConfig.callServer + this.callConfig.clickCall, {
                    exten,
                    phone
                }
            );
            return this.json(Res.data);
        } catch (error) {
            return this.json({
                error: 1
            });
        }
    }

    /**
     * 设置分机号状态
     *
     * @returns
     */
    async queuePauseDoAction() {
        let {
            exten,
            type,
            queue_id
        } = this.post("exten,type,queue_id");
        try {
            const Res = await axios.post(
                this.callConfig.callServer + this.callConfig.queuePauseDo, {
                    exten,
                    type,
                    queue_id
                }
            );
            return this.json(Res.data);
        } catch (error) {
            return this.json({
                error: 1
            });
        }
    }

    /**
     * 来电弹屏
     */
    async callScreenAction() {
        const {
            phone_num,
            exten,
            uniqueid,
            call_province,
            call_city,
            call_corp
        } = this.post("phone_num,exten,uniqueid,call_province,call_city,call_corp"); //来电号,分机号,通话流水唯一标识
        let callProvince = new Buffer(call_province, 'base64').toString();
        let callCity = new Buffer(call_city, 'base64').toString();
        let callCorp = new Buffer(call_corp, 'base64').toString();

        // const nameSpace = this.config("nameSpace");
        // const allUserExten = await think.Redis.hgetall(nameSpace.callExtenBind);
        const result = await this.service("call/CallService").findUserByExten(exten);
        if (!think.isEmpty(result)) {
            let userId = result.commissioner;
            try {
                this.sendMsgByUserAction({
                        phone_num,
                        exten,
                        uniqueid,
                        call_province: callProvince,
                        call_city: callCity,
                        call_corp: callCorp
                    },
                    userId,
                    "call_screen"
                );
                const msgBody = this.getSocketMsgBody();
                msgBody.title = '有客户来电';
                msgBody.menuUrl = 'Platform';
                msgBody.result.id = uniqueid;
                this.sendMsgByUserAction(msgBody, userId, 'msg_box');
            } catch (e) {
                think.logger.error(e);
            }
        }
        return this.json({
            code: 0,
            msg: "success"
        });
    }

    /**
     * 分机实时状态变更
     */
    async extenStateChangeAction() {
        // const exten = this.post('exten');//分机号
        // const status = this.post('status'); //分机状态
        const {
            exten,
            status
        } = this.post("exten,status"); //分机号,分机实时状态
        let msg = "";
        switch (Number(status)) {
            case 0:
                msg = "空闲";
                break;
            case 1:
                msg = "通话中";
                break;
            case 2:
                msg = "忙";
                break;
            case 4:
                msg = "不可用";
                break;
            case 8:
                msg = "振铃中";
                break;
            case 9:
                msg = "振铃&通话中";
                break;
            case 16:
                msg = "呼叫保持";
                break;
            case 17:
                msg = "通话中&呼叫保持";
                break;
        }
        const nameSpace = this.config("nameSpace");
        const allUserExten = await think.Redis.hgetall(nameSpace.callExtenBind);
        let sendToUserIds = [];
        for (let userId in allUserExten) {
            if (Number(allUserExten[userId]) === Number(exten)) {
                sendToUserIds.push(userId);
            }
        }
        try {
            if (sendToUserIds.length > 0) {
                this.sendMsgByUserAction({
                        label: msg,
                        value: status
                    },
                    sendToUserIds,
                    "call_type"
                );
            }
        } catch (e) {
            think.logger.error(e);
        }

        return this.json({
            code: 0,
            msg: "success"
        });
    }

    /**
     * 查找我的分机号
     */
    async findOneExtenAction() {
        const userId = this.getUser().userId;
        const result = await this.service("call/CallService").findExtenByUser(userId);
        if (!think.isEmpty(result)) {
            return this.successJson(result);
        }
        return this.errorJson("您还不是坐席人员,请联系管理员");
    }

    /**
     * 客户资料保存
     */
    async saveCustomerAction() {
        const {
            id,
            phone,
            real_name,
            customer_type,
            gender,
            address,
            age,
            remark,
            operator_id,
            last_call_date,
            source
        } = this.post(
            "id,phone,real_name,customer_type,gender,address,age,remark,operator_id,last_call_date,source"
        );
        try {
            let res = await this.service("call/CallService").saveCustomer({
                id,
                phone,
                real_name,
                customer_type,
                gender,
                age,
                remark,
                address,
                operator_id,
                last_call_date,
                source
            });
            return this.successJson(res, "保存成功");
        } catch (err) {
            think.logger.error(err);
            return this.errorJson("保存失败");
        }

    }

    /**
     * 工单提交
     */
    async saveWorkOrderAction() {
        let aj = think.ajaxJson();
        let data = this.post(
            "create_by,create_date,objName,ObjPosition,BGID,parent_name,sub_name,area_code,group_code,remarks"
        );
        data.baidu_x = Number(this.post("baidu_x"));
        data.baidu_y = Number(this.post("baidu_y"));
        data.source = Number(this.post("source"));
        data.type = Number(this.post("type"));
        data.update_date = data.create_date;
        data.update_by = data.create_by;
        if (data.area_code && data.group_code) {
            data.ObjCode = data.area_code + data.group_code;
        }
        const EventService = this.service("api/cms/EventService");
        let res = await EventService.addEvent(data);

        if (res && res.error) {
            return this.errorJson("查询失败");
        }

        const userIds = await this.getOnlineModuleByUser("jdsl");
        // const userAll= await this.getOnlineUserIds();
        console.log('userIds:', userIds);
        const result = {
            title: '呼叫中心事件流转',
            date: moment(data.update_date).format("YYYY-MM-DD HH:mm:ss"),
            id: res.id,
            userIds: data.update_by,
        }
        let msgbox = this.getSocketMsgBody(result);
        msgbox.menuUrl = 'accept';
        let obj = this.getSocketMsgBody(res);
        console.log("=====================================");
        console.log("userIds:", userIds);
        // console.log("userAll:",userAll);

        console.log("=====================================");

        //推给所有受理中心人员
        this.sendMsgByUserAction(obj, userIds, "accept_screen");
        this.sendMsgByUserAction(msgbox, userIds, 'msg_box'); //消息推送

        // this.sendMsgByUserAction(obj, userIds, 'control_center');

        return this.successJson();
    }


    /**
     * 设置黑名单
     */
    async saveBlockPhoneAction() {
        let aj = think.ajaxJson();
        let data = this.post(
            "phone,user_name,type"
        );

        try {
            const Res = await axios.post(this.callConfig.callServer + this.callConfig.editBlackPhone, data)

            console.log(typeof Res.data);
            console.log(Res.data);
            // let datacc = JSON.parse(JSON.stringify(Res.data));
            // console.log(datacc);
            return this.json(Res.data);
        } catch (err) {
            think.logger.error(err);
            return this.json({
                error: 1,
                msg: err
            });
        }
    }


    /**
     * 查询黑名单列表
     */
    async getBlockPhoneAction() {
        let aj = think.ajaxJson();
        let data = {
            phone: this.post('phone')
        }
        try {
            const Res = await axios.post(this.callConfig.callServer + this.callConfig.blackPhoneList, data)
            return this.json(Res.data);
        } catch (err) {
            think.logger.error(err);
            return this.json({
                error: 1,
                msg: err
            });
        }
    }
}