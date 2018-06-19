import Jimp from "jimp";

class PartsService extends think.Service {
  constructor() {
    super();
    this.cmsPartsModel = this.db["cms_parts"];
    this.cmsAreaModel = this.db["cms_area"];
    this.cmsCellModel = this.db["cms_cell"];
    this.partsGroupModel = this.db["cms_parts_group"];

    // this.cmsPartsModel.belongsTo(this.cmsCellModel, {
    //     foreignKey: 'BGID',
    //     targetKey: 'BGID'
    // })
    this.cmsPartsModel.belongsTo(this.partsGroupModel, {
      foreignKey: "group_code",
      targetKey: "group_code"
    });
    this.cmsPartsModel.belongsTo(this.cmsAreaModel, {
      foreignKey: "area_code",
      targetKey: "area_code"
    });
  }

  /**
   * 保存图片
   * @param {Object} pathObj 图片路径对象
   */
  async uploadImg(pathObj) {
    let aj = think.ajaxJson();
    let serverIP =
      "http://" + think.config("staticIp") + ":" + think.config("port"); //开发环境
    const isDev = think.env === "development"; //是否开发环境，true开发环境
    if (!isDev) {
      //生产环境
      serverIP =
        "http://" + think.config("staticIp") + ":" + think.config("proxyPort");
    }
    if (pathObj) {
      console.log(pathObj);
      try {
        // const img800 = await Jimp.read(pathObj.filePath);
        // img800.scaleToFit(800, Jimp.AUTO).write(pathObj.filePath);
        aj.success = true;
        aj.msg = "上传成功";
        aj.result = {
          fileName: pathObj.fileName,
          filePathStatic: serverIP + "/" + pathObj.filePathStatic
        };
        return aj;
      } catch (error) {
        aj.success = false;
        aj.msg = "图片裁切错误" + error;
        return aj;
      }
    } else {
      aj.success = false;
      aj.msg = "图片保存错误";
      return aj;
    }
  }

  /**
   * 新增/更改部件
   * @param {Object} data 部件属性
   */
  async doAddOrUpdate(data) {
    let aj = think.ajaxJson();
    aj.success = false;
    let AUTORes = await this.commonService.querySql(
      "SHOW TABLE STATUS WHERE Name='cms_parts'"
    );
    console.log("68", data);
    if (data) {
      try {
        let newData = {
          DeptCode3: ""
        };
        newData.DeptCode3 = data.DeptCode3 || null;

        //修改
        if (data.id != "" && data.id != null) {
          let code = data.area_code + data.group_code;
          const oldRes = await this.cmsPartsModel.findOne({
            where: {
              id: data.id
            }
          });
          // let code = data.BGID + data.ObjLabelCode;
          data.ObjID = code + this.fix(AUTORes[0].Auto_increment, 6);
          // data.create_date = think.datetime();
          data.update_date = think.datetime(new Date().getTime());
          const Res = await this.cmsPartsModel.update(data, {
            where: {
              id: data.id
            }
          });
          if (Res) {
            aj.success = true;
            aj.msg = "修改成功";
          } else {
            aj.msg = "更新操作失败";
          }
        } else {
          let code = data.area_code + data.group_code;
          //新增
          data.ObjID = code + this.fix(AUTORes[0].Auto_increment, 6);
          data.create_date = new Date();
          const Res = await this.cmsPartsModel.create(data);
          if (Res) {
            aj.success = true;
            aj.msg = "新增成功";
            aj.result = Res
          } else {
            aj.msg = "插入操作失败";
          }
        }
      } catch (error) {
        aj.msg = "数据库查询错误:" + error;
      }
    } else {
      aj.msg = "参数未知";
    }
    return aj;
  }

  /**
   * 获取部件列表
   * @param {*Object} data
   */
  async getPartsList(data) {
    let aj = think.ajaxJson();
    aj.success = false;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    let where = {
      create_by: data.userId
    };
    if (data.userId) {
      try {
        const Res = await this.cmsPartsModel.findAndCountAll({
          where: where,
          order: [
            ["id", "DESC"]
          ],
          limit: parseInt(data.pageSize),
          offset: parseInt(data.start),
          // include: [{
          //     model: this.cmsCellModel,
          //     attributes: ['BGID'],
          //     include: [{
          //         model: this.cmsAreaModel,
          //         attributes: ['parent_ids', 'area_name'],
          //     }]
          // }]
          include: [{
              model: this.partsGroupModel,
              attributes: ["group_name"]
            },
            {
              model: this.cmsAreaModel
            }
          ]
        });
        if (Res) {
          for (const item of Res.rows) {
            if (item.cms_area) {
              const idArr = item.cms_area.parent_ids.split(",");
              const areaRes = await this.cmsAreaModel.findAll({
                where: {
                  id: idArr
                }
              });
              let list = [];
              idArr.map(item2 => {
                areaRes.map(item3 => {
                  if (item2 == item3.id) {
                    list.push(item3.area_name);
                  }
                });
              });
              list.push(item.cms_area.area_name);
              // item.dataValues.cms_area = null
              item.dataValues.address = list;
            } else {
              item.dataValues.address = [];
            }
          }
        }

        aj.msg = "查询成功";
        aj.success = true;
        aj.result = Res;
      } catch (error) {
        aj.msg = error;
      }
    } else {
      aj.msg = "用户名未知";
    }

    return aj;
  }

  async getPartsAllList(data) {
    let aj = think.ajaxJson();
    aj.success = false;
    // data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize)
    // if (data.userId) {
    try {
      const Res = await this.cmsPartsModel.findAll({
        // where: where,
        // order: [
        //     ['id', 'DESC']
        // ],
        // attributes: ['id', 'ObjID', 'ObjName', 'ObjState', 'original_x', 'original_y', 'baidu_x', 'baidu_y', 'pic_path', 'address_name'],
        attributes: ["id", "baidu_x", "baidu_y"]
        // limit: parseInt(data.pageSize),
        // offset: parseInt(data.start),
        // include: [{
        //     model: this.cmsCellModel,
        //     attributes: ['BGID'],
        //     include: [{
        //         model: this.cmsAreaModel,
        //         attributes: ['parent_ids', 'area_name'],
        //     }]
        // }]
        // include: [{
        //     model: this.partsGroupModel,
        //     attributes: ['group_name'],

        // }, {
        //     model: this.cmsAreaModel,
        //     attributes: ['area_name'],
        // }]
      });
      // if (Res) {
      //     for (let item of Res) {
      //         let imgList = item.pic_path.split(",");
      //         let newImgList = [];
      //         imgList.map(item2 => {
      //             if (item2) {
      //                 newImgList.push('http://' + think.config('staticIp') + ':' + think.config('port') + think.config('imagePath') + '/' + item2)
      //             }
      //         })
      //         item.pic_path = newImgList;
      //         // item.pic_path='123'
      //         // if (item.cms_area) {
      //         //     const idArr = item.cms_area.parent_ids.split(",")
      //         //     const areaRes = await this.cmsAreaModel.findAll({
      //         //         where: {
      //         //             id: idArr
      //         //         }
      //         //     })
      //         //     let list = [];
      //         //     idArr.map(item2 => {
      //         //         areaRes.map(item3 => {
      //         //             if (item2 == item3.id) {
      //         //                 list.push(item3.area_name)
      //         //             }
      //         //         })
      //         //     })
      //         //     list.push(item.cms_area.area_name)
      //         //     // item.dataValues.cms_area = null
      //         //     item.dataValues.address = list
      //         // } else {
      //         //     item.dataValues.address = []
      //         // }
      //     }

      // }

      aj.msg = "查询成功";
      aj.success = true;
      aj.result = Res;
    } catch (error) {
      aj.msg = "error" + error;
    }
    // } else {
    //     aj.msg = "用户名未知"
    // }

    return aj;
  }
  async getPartOneInfo(data) {
    let aj = think.ajaxJson();
    aj.success = false;
    console.log(data);
    let where = {
      id: data.id
    };
    if (data.id) {
      try {
        const Res = await this.cmsPartsModel.findOne({
          where: where
        });
        if (Res) {
          aj.msg = "查询成功";
          aj.success = true;
          aj.result = Res;
        } else {
          aj.msg = "当前id不存在";
          aj.success = false;
        }
      } catch (error) {
        aj.msg = error;
      }
    } else {
      aj.msg = "用户名未知";
    }

    return aj;
  }
  /**
   * 获取部件信息
   * @param {Object} data
   */
  async getParts(data) {
    let aj = think.ajaxJson();
    let serverIP =
      "http://" + think.config("staticIp") + ":" + think.config("proxyPort"); //开发环境
    aj.success = false;
    console.log(data);
    let where = {
      id: data.id
    };
    if (data.id) {
      try {
        const Res = await this.cmsPartsModel.findOne({
          where: where,
          // include: [{
          //     model: this.cmsCellModel,
          //     attributes: ['BGID'],
          //     include: [{
          //         model: this.cmsAreaModel,
          //         attributes: ['parent_ids', 'area_name'],
          //     }]
          // }]
          include: [{
              model: this.partsGroupModel,
              attributes: ["group_name"]
            },
            {
              model: this.cmsAreaModel
            }
          ]
        });
        console.log(Res);
        if (Res) {
          if (Res.cms_area) {
            const idArr = Res.cms_area.parent_ids.split(",");
            console.log(idArr);
            const areaRes = await this.cmsAreaModel.findAll({
              where: {
                id: idArr
              }
            });
            let list = [];
            idArr.map(item2 => {
              areaRes.map(item3 => {
                if (item2 == item3.id) {
                  list.push(item3.area_name);
                }
              });
            });
            list.push(Res.cms_area.area_name);
            // Res.dataValues.cms_area = null
            Res.dataValues.address = list;
          } else {
            Res.dataValues.address = [];
          }
          let imgList = Res.pic_path.split(",");
          console.log("img", imgList);
          let newImgList = [];
          imgList.map(item => {
            if (item) {
              newImgList.push(serverIP + "/" + item);
            }
          });
          console.log(newImgList);
          Res.dataValues.pic_path = newImgList;
          aj.msg = "查询成功";
          aj.success = true;
          aj.result = Res;
        } else {
          aj.msg = "当前id不存在";
          aj.success = false;
        }
      } catch (error) {
        aj.msg = error;
      }
    } else {
      aj.msg = "用户名未知";
    }

    return aj;
  }

  /**
   * 获取损坏的部件
   */
  async getBadParts(data) {
    try {
      // let query = {
      //     ObjState: {
      //         $notIn: [data]
      //     }
      // }
      let where = {};
      where.ObjState = {
        $notIn: data
      };
      let sql = `SELECT * FROM cms_parts WHERE ObjState not in ('完好')`;
      return await this.db.sequelize.query(sql, {
        type: this.db.sequelize.QueryTypes.SELECT
      });
      // return await this.cmsPartsModel.findAll({where: {id:{$notIn:[22]}}})
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  /**
   * 删除部件
   * @param {Object} data
   */
  async delParts(data) {
    let aj = think.ajaxJson();
    aj.success = false;
    try {
      if (data.ObjID || data.id) {
        let where = {};
        if (data.ObjID) {
          where = {
            ObjID: data.ObjID
          };
        }
        if (data.id) {
          where = {
            id: data.id
          };
        }
        let Res = await this.cmsPartsModel.destroy({
          where: where
        });
        if (Res) {
          aj.success = true;
          aj.msg = "删除成功";
        } else {
          aj.success = false;
          aj.msg = "id不存在";
        }
      } else {
        aj.msg = "参数位置";
      }
    } catch (error) {
      aj.msg = error;
    }
    return aj;
  }

  /**
   * 获取部件信息及其分类信息
   *
   * @returns
   * @memberof PartsService
   */
  async getPartsAndGroupInfo(data) {
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    try {
      const Res = await this.cmsPartsModel.findAll({
        // where: where,
        // order: [
        // ['id', 'DESC']
        // ],
        attributes: [
          "id",
          "ObjID",
          "ObjName",
          "DeptCode1",
          "DeptName1",
          "DeptCode2",
          "DeptName2",
          "DeptCode3",
          "DeptName3",
          "BGID",
          "ObjState",
          "ORDate",
          "CHDate",
          "DataSource",
          "Note",
          "group_code",
          "create_by",
          "update_by",
          "create_date",
          "update_date",
          "pic_path",
          "area_code",
          "address_name",
          "baidu_x",
          "baidu_y"
        ],
        limit: parseInt(data.pageSize),
        offset: parseInt(data.start),
        // include: [{
        //     model: this.cmsCellModel,
        //     attributes: ['BGID'],
        //     include: [{
        //         model: this.cmsAreaModel,
        //         attributes: ['parent_ids', 'area_name'],
        //     }]
        // }]
        include: [{
          model: this.partsGroupModel,
          attributes: ["id", "parent_id", "group_name", "group_pic_path"]
        }]
        // {
        //     model: this.cmsAreaModel,
        //     attributes: ['area_name'],
        // }]
      });

      return Res;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }
  async getPartCount() {
    try {
      const Res = await this.cmsPartsModel.count();
      return Res;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  /**
   * 获取损坏部件信息及其分类信息
   *
   * @returns
   * @memberof PartsService
   */
  async getBadPartsAndGroupInfo() {
    const Op = this.db.Sequelize.Op;
    let where = {};
    where.ObjState = {
      [Op.ne]: "完好"
    };
    try {
      const Res = await this.cmsPartsModel.findAll({
        where: where,
        // order: [
        // ['id', 'DESC']
        // ],
        // attributes: ['id', 'baidu_x', 'baidu_y',''],
        // limit: parseInt(data.pageSize),
        // offset: parseInt(data.start),
        // include: [{
        //     model: this.cmsCellModel,
        //     attributes: ['BGID'],
        //     include: [{
        //         model: this.cmsAreaModel,
        //         attributes: ['parent_ids', 'area_name'],
        //     }]
        // }]
        include: [{
          model: this.partsGroupModel,
          attributes: ["id", "parent_id", "group_name", "group_pic_path"]
        }]
        // {
        //     model: this.cmsAreaModel,
        //     attributes: ['area_name'],
        // }]
      });

      return Res;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  /**
   * 添加BGID
   */
  async partsBGID(data) {
    try {
      let query = {
        BGID: data.BGID
      };
      let where = {
        id: data.id
      };

      return await this.cmsPartsModel.update(query, {
        where: where
      });
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  /**
   * 更改数据的位数
   * @param {Number} num  需要更改是数字
   * @param {Number} length       需要更为为几位数据
   */
  fix(num, length) {
    return ("" + num).length < length ?
      (new Array(length + 1).join("0") + num).slice(-length) :
      "" + num;
  }
}

export default PartsService;