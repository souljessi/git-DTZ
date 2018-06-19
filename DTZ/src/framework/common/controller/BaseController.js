import path from 'path';
import fs from 'fs';
import moment from 'moment';
import assert from 'assert';

const renameSync = think.promisify(fs.renameSync, fs);
const unlinkSync = think.promisify(fs.unlinkSync, fs);

/**
 * 基类控制器
 */
export default class BaseController extends think.Controller {
    __before() {

    }
    /**
     * 根据模块标识获取拥有该模块权限的在线用户
     * @param moduleName  模块权限标识名称
     * @returns {Promise<Array>}
     */
    async getOnlineModuleByUser(moduleName) {
        assert(typeof moduleName === 'string', 'moduleName must be a string');
        const nameSpace = this.config('nameSpace');
        const onlineUsers = await think.Redis.hgetall(nameSpace.LOGIN_USER);
        const authUserIds = [];
        for (let key in onlineUsers) {
            let userInfo = JSON.parse(onlineUsers[key]);
            let permission = userInfo.menuList.find((item) => {
                return item.permission === moduleName
            });
            if (permission) {
                authUserIds.push(key);
            }
        }
        return authUserIds;
    }

    /**
     * 获取当前所有在线用户id
     * @returns {Promise<Array>}
     */
    getOnlineUserIds() {
        const nameSpace = this.config('nameSpace');
        return think.Redis.hkeys(nameSpace.LOGIN_USER);
    }

    /**
     * 获取当前用户完整信息
     * @returns Promise<Object>}
     */
    async getUserInfo() {
        const nameSpace = this.config('nameSpace');
        const userInfo = await think.Redis.hget(nameSpace.LOGIN_USER, this.ctx.state.userInfo.userId);
        if (!think.isEmpty(userInfo)) {
            return JSON.parse(userInfo);
        }

    }

    /**
     * 获取当前登录用户简要信息
     * @return  {Object}
     */
    getUser() {
        return this.ctx.state.userInfo;
    }

    /**
     * 判断当前登陆用户是否是最高管理员
     * @returns {boolean}
     */
    isAdmin() {
        const administrator = think.config('administrator');
        if (administrator.includes(this.ctx.state.userInfo.userId)) {
            return true;
        }
        return false;
    }

    /**
     *  直接调用该接口，无需传入file对象，无需关心前端传来的file name
     * 1.支持单文件上传
     * 2.支持不同名多文件上传
     * 3.支持同名多文件上传
     * @param businesskey
     * @param files
     * @returns {successJson}
     */
    async uploadFileAction(businesskey = '', files = this.file()) {
        let fileArray = [];
        try {
            for (let i in files) {
                //同名多文件上传
                if (Array.isArray(files[i])) {
                    let fileArr = files[i];
                    for (let j of fileArr) {
                        let file = j;
                        //避免用户上传空文件
                        if (file.size === 0) {
                            continue;
                        }
                        let result = await this.renameFile(file);
                        fileArray.push(result);
                    }
                    //不同名多文件上传
                } else {
                    let file = files[i];
                    //避免用户上传空文件
                    if (file.size === 0) {
                        continue;
                    }
                    let result = await this.renameFile(file);
                    fileArray.push(result);
                }
            }
            let msg = '';
            if (fileArray.length > 0) {
                //如果存在业务主键,则保存到附件表
                if (!think.isEmpty(businesskey)) {
                    await this.service('sys/AttachmentService').saveFile(fileArray, businesskey);
                }
                msg = '上传成功';
            } else {
                msg = '请选择上传的文件';
            }
            return this.successJson(fileArray, msg);
        } catch (err) {
            return this.errorJson('上传失败');
        }

    }

    /**
     * 重命名文件并保存到指定目录
     * @returns {filePath,fileResource} 文件绝对路径，文件资源路径
     */
    async renameFile(file) {
        const type = file.type;
        if (type) {
            let fileName = file.name; //原始文件名
            let fileSize = file.size;//大小
            let suffix = StringUtils.findStrToEnd(fileName); //后缀名
            let fileRename = moment().format('YYYYMMDDhhmmss') + file.hash.substr(0, 8) + suffix;//重命名文件名
            let staticPath = ''; //静态资源目录名
            let filePath = ''; //文件绝对路径
            let fileResource; //文件资源路径
            //如果是图片文件，就上传到图片文件夹，否则其他文件夹
            if (type === 'image/png' || type === 'image/jpeg') {
                filePath = path.join(think.ROOT_PATH, 'www/static/upload/images', fileRename);
                staticPath = 'static/upload/images/';
            } else {
                filePath = path.join(think.ROOT_PATH, 'www/static/upload/files', fileRename);
                staticPath = 'static/upload/files/';
            }
            fileResource = staticPath + fileRename;
            think.mkdir(path.dirname(filePath)); //如果目录不存在则创建目录
            renameSync(file.path, filePath);
            return {
                file_name: fileName,
                file_size: fileSize,
                realpath: fileResource,
                create_date: new Date(),
                user_id: this.getUser().userId,
            };
        } else {
            return false;
        }

    }

    /**
     * 根据realpath删除文件
     */
    async delFileAction() {
        const realpath = this.post('realpath');
        if (realpath) {
            //删除硬盘文件
            unlinkSync(path.join(think.resource, realpath));
            //删除数据库记录
            await this.service('sys/AttachmentService').delFile({realpath: realpath});
            return this.successJson('删除成功');
        } else {
            return this.errorJson('删除失败')
        }

    }

    /**
     * 根据业务主键删除文件
     * @returns {Promise<void>}
     */
    async delFileByBusKeyAction() {
        const businesskey = this.post('businesskey');
        if (businesskey) {
            //查询跟businesskey相关的文件路径
            const realPaths = await this.service('sys/AttachmentService').getFilePath({businesskey: businesskey});
            //删除硬盘上的文件
            for (let path of realPaths) {
                unlinkSync(think.resource + '/' + path);
            }
            //删除数据库记录
            await this.service('sys/AttachmentService').delFile({businesskey: businesskey});
            return this.successJson();
        } else {
            return false;
        }


    }


    /**
     * 文件下载
     * @returns {void | * | boolean}
     */
    downloadFileAction() {
        const realpath = this.get('realpath');
        if (realpath) {
            const downloadPath = think.resource + '/' + realpath;
            return this.download(downloadPath);
        }
        return this.errorJson('下载失败');

    }

    /**
     * ajax请求统一的返回格式
     * @param result 结果集
     * @param msg  提示信息
     * @param errorno 错误号
     * @returns {{success: boolean, msg: string, result: all,errorno:number}}
     */
    successJson(result = {}, msg = '操作成功', errorno = 0) {
        if (arguments.length === 1 && typeof arguments[0] === 'string') {
            msg = arguments[0];
            result = {};
        }
        let obj = {
            result: result,
            msg: msg,
            errorno: errorno,
            success: true,
        };
        this.type = this.config('jsonContentType');
        this.body = obj;
        return false;
    }

    /**
     * ajax请求统一错误消息返回格式
     * @param result  结果集
     * @param msg   提示信息
     * @param errorno  错误号
     * @returns {{success: boolean, msg: string, result: {}, attributes: {}}}
     */
    errorJson(result = {}, msg = '操作失败', errorno = 1) {
        if (arguments.length === 1 && typeof arguments[0] === 'string') {
            msg = arguments[0];
            result = {};
        }
        let obj = {
            result: result,
            msg: msg,
            errorno: errorno,
            success: false,
        };
        this.type = this.config('jsonContentType');
        this.body = obj;
        return false;
    }

}
