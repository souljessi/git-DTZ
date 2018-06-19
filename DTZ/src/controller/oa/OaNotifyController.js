/**
 * 通知公告模块
 */
import BaseSocket from "../websocket/BaseSocket";
import moment from 'moment'


export default class extends BaseSocket {
    // 获取通告列表
    async getOaNotifyListAction() {
        let aj = think.ajaxJson();
        const data = this.post();
        const oaNotifyService = this.service('oa/OaNotifyService');
        const result = await oaNotifyService.oaNotifyList(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    async getNotifyListAction() {
        let aj = think.ajaxJson();
        const data = {
            user_id: this.get('user_id'),
            pageSize: this.get('pageSize'),
            page: this.get('page'),
            title: this.get('title')
        };
        const NotifyService = this.service('oa/OaNotifyService');
        const res = await NotifyService.getNotifyList(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    async getNotifyListCountAction() {
        let aj = think.ajaxJson();
        const data = {
            user_id: this.get('user_id'),
            title: this.get('title')

        };
        const NotifyService = this.service('oa/OaNotifyService');
        const res = await NotifyService.getNotifyListCount(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    async getAllNotifyListAction() {
        let aj = think.ajaxJson();
        const data = {
            user_id: this.get('user_id'),
        };
        const NotifyService = this.service('oa/OaNotifyService');
        const res = await NotifyService.getAllNotifyList(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }


    //根据user_id获取通知
    async userIdOaNotifyListAction() {
        let aj = think.ajaxJson();
        const data = this.post('params');
        const oaNotifyService = this.service('oa/OaNotifyService');
        const result = await oaNotifyService.userIdOaNotifyList(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }


    //获取通知详情
    async getNotifyDetailsAction() {

        const data = this.post('params');

        if (!data) {
          return this.errorJson('请传入参数')

        } else {

            try{

                const res = await this.service('oa/OaNotifyService').notifyDetails(data);
                return this.successJson(res)
            }catch(error){
                return this.errorJson('查询失败')

            }

        }

    }

    //获取通知类型
    async getNotifyTypeAction() {

        const data = this.post();

            try{

                const res = await this.service('oa/OaNotifyService').notifyTypes(data);
                return this.successJson(res)
            }catch(error){
                return this.errorJson('查询失败')

            }



    }

    async allUserIdOaNotifyListAction() {
        let aj = think.ajaxJson();
        const data = this.post('params');
        const oaNotifyService = this.service('oa/OaNotifyService');
        const result = await oaNotifyService.allUserIdOaNotifyList(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //分页查询接收人接收状态
    async notifyIdOaNotifyListAction() {
        let aj = think.ajaxJson();
        const data = this.post('params');
        const oaNotifyService = this.service('oa/OaNotifyService');
        const result = await oaNotifyService.notifyIdOaNotifyList(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //查询全部接收状态
    async allNotifyIdOaNotifyListAction() {
        let aj = think.ajaxJson();
        const data = this.post('params');
        const oaNotifyService = this.service('oa/OaNotifyService');
        const result = await oaNotifyService.allNotifyIdOaNotifyList(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //根据通知id获取通知详情
    async notifyAction() {
        let aj = think.ajaxJson();
        const data = this.post();
        const notifyService = this.service('oa/OaNotifyService');
        const result = await notifyService.notify(data);
        if (!result) {
            aj.result = result

        } else if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //保存文件
    async saveFileAction() {
        let aj = think.ajaxJson();
        let fileDate = this.post();
        this.uploadFileAction(fileDate.id)
      //   const file = this.file('file');
      //   if (file) {
      //       let file_path = await this.renameFile(file,fileDate.id);
      //       if (file_path) {
      //           fileDate.realpath = file_path.filePathStatic
      //
      //       } else {
      //           aj.success = false;
      //           aj.msg = '文件保存失败';
      //           return this.json(aj)
      //       }
      //   }
      //   // const fileService = this.service('oa/OaNotifyService');
      //   // const result = await fileService.saveFile(fileDate);
      // const result =   await this.service('sys/AttachmentService').saveFile(fileDate);
      //
      //   if (!result.error) {
      //       aj.result = result
      //
      //   } else {
      //       aj.success = false;
      //       aj.msg = '保存错误';
      //       return this.json(aj)
      //   }
      //   return this.json(aj)
    }

    // 新增通告
    async addOaNotifyAction() {
        let aj = think.ajaxJson();

        let addDate = this.post();

        const oaNotifyService = this.service('oa/OaNotifyService');

        const result = await oaNotifyService.oaNotifyAdd(addDate);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '保存失败'
        }
        return this.json(aj)

    }
    //发送通知通告
    async sendOaNotifyAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const notifyService = this.service('oa/OaNotifyService');
        const result = await notifyService.sendOaNotify(data);
        if (!result.error) {

            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '发送失败'
        }

        let msgBox = this.getSocketMsgBody();
        msgBox.title = '通知公告';
        msgBox.menuUrl = 'myOffice';
        msgBox.result.id = data.notify.id
        // this.sendMsgByUserAction(socketBody);  //消息推送

        this.sendMsgByUserAction(msgBox,data.user_id,'msg_box');  //消息推送

        return this.json(aj)
    }

    //发送派遣核实消息

    async sendMsgNotifyAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const msgNotifyService = this.service('oa/OaNotifyService');
        const result = await msgNotifyService.sendMsgNotify(data);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '发送失败'
        }
        return this.json(aj)
    }

    //删除通知通告
    async delOaNotifyAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const delNotifyService = this.service('oa/OaNotifyService');

        if (data) {
            const result = await delNotifyService.delOaNotify(data);
            if (!result.error) {
                aj.result = result;
                return this.json(aj)

            } else {
                aj.success = false;
                aj.msg = '删除失败';
                return this.json(aj)
            }
        } else {
            aj.success = false;
            aj.msg = '请传入参数id';
            return this.json(aj)
        }
    }

    //修改状态
    async updateOaNotifyAction() {
        let aj = think.ajaxJson();
        let data = this.post();
        const delNotifyService = this.service('oa/OaNotifyService');

        if (data) {
            const result = await delNotifyService.updateOaNotify(data);
            if (!result.error) {
                aj.result = result;
                return this.json(aj)

            } else {
                aj.success = false;
                aj.msg = '修改失败';
                return this.json(aj)
            }
        } else {
            aj.success = false;
            aj.msg = '请传入参数id';
            return this.json(aj)
        }
    }

    //获取所有用户
    async userListAction() {
        let aj = think.ajaxJson();
        let data = this.get();
        const userService = this.service('oa/OaNotifyService');
        const result = await userService.getUserList(data);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //获取微信用户
    async weChatUserListAction() {
        let aj = think.ajaxJson();
        let data = this.get();
        const userService = this.service('oa/OaNotifyService');
        const result = await userService.getWeChatUserList(data);
        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    //获取所有组织机构和人员
    async orgAndUserAction() {
        let aj = think.ajaxJson();
        let data = this.get();
        const orgUserService = this.service('oa/OaNotifyService');
        const result = await orgUserService.getOrgAndUser(data);

        if (!result.error) {
            aj.result = result

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)
    }

    async updateNotifyRecordAction() {
        let aj = think.ajaxJson();
        let data = {
            id: this.post('id')
        }
        const delNotifyService = this.service('oa/OaNotifyService');

        if (data) {
            const result = await delNotifyService.updateNotifyRecord(data);
            if (!result.error) {
                aj.result = result;
                return this.json(aj)

            } else {
                aj.success = false;
                aj.msg = '更新失败';
                return this.json(aj)
            }
        } else {
            aj.success = false;
            aj.msg = '请传入参数id';
            return this.json(aj)
        }
    }
}
