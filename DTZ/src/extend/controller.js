import path from 'path';
import fs from 'fs';
import Jimp from 'jimp';
import BaseService from '../framework/common/service/BaseService';
import ModelMapping from '../framework/common/orm/ModelMapping';
const rename = think.promisify(fs.rename, fs);
const unlink = think.promisify(fs.unlink, fs);
const db = ModelMapping.initModelMapping();
export default {
    db: db,
    BaseService: new BaseService(),
    /**
     * 重命名文件并保存到指定目录，在controller层传入this.file()对象
     * @returns {filePath,filePathStatic} 文件绝对路径，文件静态路径
     */
    // renameFile: async(file) => {
    //     const type = file.type;
    //     const hash = file.hash.substr(0, 8);
    //     if (type) {
    //         let fileName = ''; //文件名
    //         let uploadPath = ''; //上传目录名
    //         let staticPath = ''; //静态资源路径
    //         let suffix = ''; //后缀名
    //         let filePath = ''; //文件绝对路径
    //         let filePathStatic; //文件静态资源路径
    //         if (type === 'image/png' || type === 'image/jpeg') {
    //             uploadPath = path.join(think.ROOT_PATH, 'www/static/upload/images/');
    //             staticPath = 'static/upload/images/';
    //             type === 'image/png' ? suffix = '.png' : suffix = '.jpg';
    //
    //         } else {
    //             uploadPath = path.join(think.ROOT_PATH, 'www/static/upload/other/');
    //             staticPath = 'static/upload/other/';
    //             if (type === 'text/plain') {
    //                 suffix = '.txt';
    //             }else{
    //                 var name=file.name.match(/\.\w+/g);
    //                 if(name) suffix=name[0] ||'.txt';
    //             }
    //         }
    //         fileName = new Date().getTime() + hash + suffix;
    //         filePath = uploadPath + fileName;
    //         filePathStatic = staticPath + fileName;
    //         try {
    //             think.mkdir(path.join(uploadPath)); //如果目录不存在则创建目录
    //             // await rename(file.path, path.join(filePath)); //生成文件
    //             await rename(file.path, path.join(filePath)); //生成文件
    //             return {
    //                 fileName: fileName,
    //                 filePath: filePath,
    //                 filePathStatic: filePathStatic
    //             };
    //         } catch (e) {
    //             think.logger.error(e);
    //             return false
    //
    //         }
    //     } else {
    //         return false;
    //     }
    //
    // },
    /**
     *图片裁切并删除原图
     */
    cutImg: async(filePath) => {
        try {
            let img100 = await Jimp.read(filePath);
            let img250 = await Jimp.read(filePath);
            await img100.scaleToFit(100, 100).write(filePath + '.100x100.png');
            await img250.scaleToFit(250, 250).write(filePath + '.250x250.png');
            unlink(filePath);
            return true;
        }catch(err){
            think.logger.error(err);
            return false

        }
    },

    /**
     * 删除文件
     * @returns Boolean
     */
    delFile: async(filePathArr) => {
        try {
            for(var i in filePathArr){
                await unlink('www/'+filePathArr[i]);
            }
            return true;
        } catch (e) {
            return false
        }
    },
    /**
     * 保存文件 传入文件和路径
     */
    saveFile: async(file,newPath) => {
        const type = file.type;
        const suffix ='.'+ file.name.split('.')[1];
        const hash = file.hash.substr(0, 8);
        if (type) {
            let fileName = ''; //文件名
            let uploadPath = ''; //上传目录名
            let staticPath = ''; //静态资源路径
            let filePath = ''; //文件绝对路径
            let filePathStatic; //文件静态资源路径
            if (newPath) {
                uploadPath = path.join(think.ROOT_PATH, 'www/'+newPath);
                staticPath = newPath;
            } else {
                uploadPath = path.join(think.ROOT_PATH, 'www/static/upload/images/');
                staticPath = 'static/upload/images/';
            }
            fileName = new Date().getTime() + hash + suffix;
            filePath = uploadPath + fileName;
            filePathStatic = staticPath + fileName;
            try {
                think.mkdir(path.join(uploadPath)); //如果目录不存在则创建目录
                await rename(file.path, path.join(filePath)); //生成文件
                return {
                    fileName: fileName,
                    filePath: filePath,
                    filePathStatic: filePathStatic
                };
            } catch (e) {
                think.logger.error(e);
                return false

            }
        } else {
            return false;
        }

    },


}