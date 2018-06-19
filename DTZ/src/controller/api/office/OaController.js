import path from 'path'
import fs from 'fs'

const assert = require('assert');
const onFinished = require('on-finished');
const destroy = require('destroy');
export default class extends think.Controller {
    //获取通知列表
    async getNotifyListAction() {
        let aj = think.ajaxJson();
        const data = this.post('page,pageSize,user_id');

        if (!data) {
            aj.success = false;
            aj.msg = '请传入查询参数'

        } else {
            const notifyService = this.service('api/office/OaService');
            const result = await notifyService.notifyList(data);

            const typeResult = await notifyService.getNotifyType();

            // aj.result = result

            if (!result.error) {
                aj.result = result

            } else {
                aj.success = false;
                aj.msg = ' 查询失败'
            }
        }
        return this.json(aj)

    }

    //获取通知详情
    async getNotifyDetailsAction() {
        let aj = think.ajaxJson();
        const data = this.post();
        if (!data) {
            aj.success = false;
            aj.msg = '请传入查询参数'

        } else {
            const detailService = this.service('api/office/OaService');
            const res = await detailService.notifyDetails(data);
            if (res.result.length > 0) {
                let fileArr = [];
                for (let item of res.result) {
                    let num = item.realpath.lastIndexOf('/');

                    this.serverIP = 'http://' + think.config('host') + ':' + think.config('port'); //开发环境
                    const isDev = think.env === 'development'; //是否开发环境，true开发环境
                    if (!isDev) {
                        //生产环境
                        this.serverIP = 'http://' + think.config('host') + ':' + think.config('proxyPort');
                    }

                    let file = {
                        file_path: item.realpath,
                        file_name: item.file_name,
                    };
                    fileArr.push(file)
                }
                let notifyInfo = {
                    id: res.res.id,
                    type: res.res.type,
                    title: res.res.title,
                    content: res.res.content,
                    files: fileArr,
                    status: res.res.status,
                    create_by: res.res.create_by,
                    create_date: res.res.create_date,
                    update_by: res.res.update_by,
                    update_date: res.res.update_date,
                    remarks: res.res.remarks,
                    del_flag: res.res.del_flag,
                    // filename: res.res.filename
                };

                if (!res.error) {
                    aj.result = notifyInfo

                } else {
                    aj.success = false;
                    aj.msg = '获取失败'
                }
            } else {
                let notifyInfo = {
                    id: res.res.id,
                    type: res.res.type,
                    title: res.res.title,
                    content: res.res.content,
                    files: res.res.files,
                    status: res.res.status,
                    create_by: res.res.create_by,
                    create_date: res.res.create_date,
                    update_by: res.res.update_by,
                    update_date: res.res.update_date,
                    remarks: res.res.remarks,
                    del_flag: res.res.del_flag,
                    // filename: res.res.filename
                };
                if (!res.error) {
                    aj.result = notifyInfo
                } else {
                    aj.success = false;
                    aj.msg = '获取失败'
                }

            }
        }

        return this.json(aj)
    }

    //下载文件
    async downloadFileAction() {
        let aj = think.ajaxJson();
        const data = this.get();

        data.file_name = decodeURIComponent(data.file_name);
        data.file_path = decodeURIComponent(data.file_path);

        // const userAgent = this.userAgent.toLowerCase();
        // let hfilename = '';
        // if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
        //     hfilename = `=${encodeURIComponent(data.file_name)}`;
        // } else if(userAgent.indexOf('firefox') >= 0) {
        //     hfilename = `*="utf8''${encodeURIComponent(data.file_name)}"`;
        // } else {
        //     hfilename = `=${new Buffer(file_name).toString('binary')}`;
        // }
        // this.set('Content-Disposition', `attachment; filename${hfilename}`)
        return this.download(path.join(think.ROOT_PATH, 'www', 'static', 'upload', 'other', data.file_name))

    }
}