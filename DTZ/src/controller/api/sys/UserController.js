import jwt from 'jsonwebtoken';
export default class extends think.Controller{
    indexAction(){

    }
    async loginAction(){//用户登录
        const data1 = this.post('username,password');        
        const data2 = {
            login_ip:this.ctx.ip,
            last_login_time:new Date()
        };
        let aj = think.ajaxJson();
        const UserService = this.service('api/sys/UserService');
        const res = await UserService.isLogin(data1,data2);
        if (res.error) {
            aj.success = false;
            aj.msg = '数据库查询错误';
        }else if(res.msg){
            aj.success = false;
            aj.msg = res.msg;
        }else{
        //    const content = {userId:res.id};
        //    const tokenConfig = think.config('token');
        //    const PrivateKey = tokenConfig.privateKey; // （密钥）
        //    const expiresIn = tokenConfig.expiresIn;
        //    const token = jwt.sign(content, PrivateKey, {
        //        expiresIn: expiresIn // 过期时间
        //    });
        //    aj.result = res;
        //    aj.attributes.token = token;
            aj.result = res.UserInfo;
            aj.msg = '登陆成功';
            aj.attributes.token = res.token;
            this.ctx.cookie('access_token', res.token);
        }
        return this.json(aj);
    }

    async doUploadImgAction() {//用户头像上传
        const file = this.file('image');
        const userid = this.ctx.header.userid;
        const serverIP = 'http://'+think.config('staticIp')+':'+think.config('proxyPort');
     
        let aj = think.ajaxJson();
        if (file) { //保存图片
            const pathObj = await this.saveFile(file);
            if(pathObj){
                const cutImg = await this.cutImg(think.resource+'/'+pathObj.filePathStatic);
                if(cutImg){
                    const UserService = this.service('api/sys/UserService');
                    const upfiled = {pic_path:pathObj.filePathStatic};
                    const res = await UserService.saveUserInfo(upfiled,userid);
                    if(!res.error){
                        aj.msg = '用户头像更新成功';
                        aj.result = {
                            fileName: pathObj.fileName,
                            filePathStatic: serverIP+ '/' + pathObj.filePathStatic
                        }
                    }else{
                        aj.success = false;
                        aj.msg = '用户头像信息更新失败';
                    }
                }else{
                    aj.success = false;
                    aj.msg = '图片裁切失败'; 
                }
            }else{
                aj.success = false;
                aj.msg = '图片保存失败'; 
            }
        } else {
            aj.success = false;
            aj.msg = "文件上传失败"
        }
        return this.json(aj);
    }

    async saveUserInfoAction(){//修改用户信息
        let aj = think.ajaxJson();
        const userid = this.post('UserID');
        let data = {};
        data[this.post('Key')] = this.post('Value');
        const UserService = this.service('api/sys/UserService');
        const res = await UserService.saveUserInfo(data,userid);
        if(res&&res.error){
            aj.success = false;
            aj.msg = '用户信息修改失败';
        }
        return this.json(aj)

    }

    async changePsdAction(){//修改密码
        let aj = think.ajaxJson();
        const data = this.post('UserID,OldPsd,NewPsd');
        const UserService = this.service('api/sys/UserService');
        const res = await UserService.changePsd(data);
        if(!res.error){
            if(res&&res.msg){
                aj.success = false;
                aj.msg = res.msg;
            }
        }else{
            aj.success = false;
            aj.msg = '用户密码修改失败';
        }
        return this.json(aj)
    }

    async getUserInfoAction(){//获取用户详情
        let aj = think.ajaxJson();
        const data = {UserID:this.post('UserID')};
        const UserService = this.service('api/sys/UserService');
        const res = await UserService.getUserInfo(data);
        if(!res.error){
            if(res&&res.msg){
                aj.success = false;
                aj.msg = res.msg;
            }else{
                aj.result = res;
            }
        }else{
            aj.success = false;
            aj.msg = '获取用户详情失败';
        }
        return this.json(aj)
    }

    async getUserListByRnameAction(){//按真实姓名模糊分页查询
        let aj = think.ajaxJson();
        const data = {
            page:Number(this.post('page')),
            pageSize:Number(this.post('pageSize')),
            realname:this.post('realname')
        };
        const UserService = this.service('api/sys/UserService');
        const res = await UserService.getUserListByRname(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '获取用户列表失败';
        }
        return this.json(aj)
    }
    async userTaskCountAction(){//获取用户各类工作统计信息
        let aj = think.ajaxJson();
        const data = {
            userId:this.post('userId')
        };
        const UserService = this.service('api/sys/UserService');
        const res = await UserService.getUserTaskCount(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '获取用户待办工作统计信息失败';
        }
        return this.json(aj)
    }
}