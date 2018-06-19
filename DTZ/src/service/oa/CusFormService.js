import fs from "fs";
export default class extends think.Service {
  constructor() {
    super();
    this.cusFormModel = this.db["oa_cust_form"];

    this.typeGroupModel = this.db["sys_type_group"];
    this.typeModel = this.db["sys_type"];

    this.typeGroupModel.hasMany(this.typeModel, { foreignKey: "typegroupid" });
    // this.cusFormModel.belongsTo(this.typeModel,{
    //   foreignKey:'typecode',
    //   targetKey:'asdasd'
    // })
    // this.typeModel.hasMany(this.cusFormModel, {
    //   foreignKey: "template_group",
    //   constraints: false,
    //   targetKey: "typecode"
    // });
  }
  /**
   * 保存/更新自定义表单
   *
   * @param {any} data
   * @returns
   */
  async saveCustForm(data) {
    console.log(data);
    try {
      const Op = this.db.Sequelize.Op;
      let oldUser = await this.cusFormModel.findOne({
        where: {
          template_code: data.template_code
        },
        attributes: ["id"]
      });
      if (data.id) {
        if (oldUser && oldUser.id != data.id) {
          return false;
        } else {
          return await this.cusFormModel.update(data, {
            where: {
              id: data.id
            }
          });
        }
      } else {
        console.log(3333);
        if (oldUser) {
          return false;
        } else {
          return await this.cusFormModel.upsert(data);
        }
      }
    } catch (error) {
      console.log(error);
      return this.exceptionService.handleError(error);
    }
  }
  /**
   * 获取表单图标信息
   *
   */
  async getCusFormIcon() {
    try {
      let serverIP =
        "http://" + think.config("staticIp") + ":" + think.config("port"); //开发环境
      const isDev = think.env === "development"; //是否开发环境，true开发环境
      if (!isDev) {
        //生产环境
        serverIP =
          "http://" +
          think.config("staticIp") +
          ":" +
          think.config("proxyPort");
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
      return res;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }
  /**
   * 获取所有表单模板信息
   *
   * @returns
   */
  async getCusFormInfo(data) {
    let where = {
      form_type: data.form_type
    };
    if (data.template_name)
      where.template_name = {
        [this.db.Sequelize.Op.like]: "%" + data.template_name + "%"
      };

    try {
      return await this.cusFormModel.findAll({
        where: where
      });
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  /**
   * 通过id查询表单模板信息
   *
   * @param {any} data
   */
  async getCusFormInfoById(data) {
    try {
      let serverIP =
        "http://" + think.config("staticIp") + ":" + think.config("proxyPort");
      let Res = await this.cusFormModel.findOne({
        where: {
          id: data.id
        },
        attributes: [
          "id",
          "template_name",
          "template_code",
          "form_items",
          "create_by",
          "update_by",
          "create_date",
          "update_date",
          "icon_path"
        ]
      });
      if (Res) {
        Res.icon_path = serverIP + Res.icon_path;
      }
      // let arr = [];
      // arr = Res.map(item => {
      //   item.icon_path = serverIP + item.icon_path;
      //   return item;
      // });
      return Res;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  /**
   * 通过id删除模板
   *
   * @param {any} data
   * @returns
   */
  async delCusFormById(data) {
    try {
      const Res = await this.cusFormModel.destroy({
        where: {
          id: data.id
        }
      });
      return Res;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  //移动端接口

  /**
   * 获取所有信息
   *
   * @returns
   */
  async getCusFormSimpleInfoByAll() {
    try {
      let cusForm = await this.cusFormModel.findAll({
        where: {
          form_type: 1
        },
        attributes: [
          "id",
          "template_name",
          "template_code",
          "icon_path",
          "template_group"
        ]
        // group: "template_group"
      });
      let typeGroup = await this.typeGroupModel.findOne({
        where: {
          typegroupcode: "bdfz"
        },
        include: [
          {
            model: this.typeModel,
            attributes: ["typecode", "typename"]
          }
        ]
      });
      let small = typeGroup.sys_types;
      let serverIP =
        "http://" + think.config("staticIp") + ":" + think.config("proxyPort");
      let data = small.map(item => {
        item.dataValues.template = item.dataValues.template || [];
        cusForm.forEach(item2 => {
          let data = {
            id: item2.id,
            template_name: item2.template_name,
            template_code: item2.template_code,
            template_group: item2.template_group,
            template_icon: serverIP + item2.icon_path
          };
          if (item.typecode == item2.template_group) {
            item.dataValues.template.push(data);
          }
        });

        return item;
      });
      return data;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }
}
