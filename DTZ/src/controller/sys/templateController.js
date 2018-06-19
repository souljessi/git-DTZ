import fs from "fs";
export default class extends think.Controller {
  constructor(ctx) {
    super(ctx);
    this.MenuService = think.service("sys/MenuService");
  }
  indexAction() {}

  /**
   * 获取自定义表单图片
   *
   * @returns
   */
  async appReadCustomTemplateAction() {
    let aj = think.ajaxJson();
    let serverIP =
      "http://" + think.config("staticIp") + ":" + think.config("port"); //开发环境
    const isDev = think.env === "development"; //是否开发环境，true开发环境
    if (!isDev) {
      //生产环境
      serverIP =
        "http://" + think.config("staticIp") + ":" + think.config("proxyPort");
    }
    let url = "./www/static/upload/customTemplate/";
    let imgPath = "/static/upload/customTemplate/";
    let a = fs.readdirSync(url);
    let res = [];
    let obj = {};
    for (let i = 0; i < a.length; i++) {
      obj.img = imgPath + a[i];
      obj.showing = false;
      res.push(obj);
      obj = {};
    }
    aj.success = true;
    aj.msg = "获取成功";
    aj.result = res;
    return this.json(aj);
  }
  //保存文件
  async saveFileAction() {
    let aj = think.ajaxJson();
    let fileDate = this.post();
    const file = this.file("file");
    console.log("105105", file);
    // if (file) {
    //   let file_path = await this.renameFile(file);
    //   if (file_path) {
    //     fileDate.realpath = file_path.filePathStatic;
    //   } else {
    //     aj.success = false;
    //     aj.msg = "文件保存失败";
    //     return this.json(aj);
    //   }
    // }
    let result = {};

    if (!result.error) {
      aj.result = fileDate.realpath;
    } else {
      aj.success = false;
      aj.msg = "保存错误";
      return this.json(aj);
    }
    return this.json(aj);
  }
}
