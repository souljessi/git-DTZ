export default class extends think.Service {
  /**
   * 新增单元格
   *
   * @param {any} data
   * @returns
   */
  async doAddOrUpdateZone(data) {
    console.log(111, data);
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    let AUTORes = await this.commonService.querySql(
      "SHOW TABLE STATUS WHERE Name='geo_zone'"
    );
    let where = {};
    try {
      if (!data.id) {
        //新增
        data.ZoneID = data.SubDisCode + this.fix(AUTORes[0].Auto_increment, 6);
        const Res = await db["geo_zone"].create(data);
        return Res;
      } else {
        //编辑
        const Res = await db["geo_zone"].update(data, {
          where: {
            id: data.id
          }
        });
        return Res;
      }
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  /**
   * 获取单元格信息 （分页）
   *
   * @param {any} data
   * @returns
   */
  async getZoneListPage(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    const attributes = [
      "id",
      "ZoneName",
      "ZoneID",
      "Alias",
      "OldName",
      "Boundary",
      "SubDisName",
      "SubDisCode",
      "CommuName",
      "CommuCode",
      "DataSource",
      "ORDate",
      "CHDate",
      "Note"
    ];
    let where = {};
    if (data.ZoneName) {
      where.ZoneName = {
        [this.db.Sequelize.Op.like]: "%" + data.ZoneName + "%"
      };
    }
    try {
      const res = await db["geo_zone"].findAndCountAll({
        where: where,
        order: [["id", "DESC"]],
        limit: parseInt(data.pageSize),
        offset: parseInt(data.start)
      });
      return res;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 通过scu和ComCode 查询区片
   *
   * @param {any} data
   * @returns
   */
  async getZoneBySubComCode(data) {
    const db = this.db;
    try {
      const res = await db["geo_zone"].findAll({
        where: {
          SubDisCode: data.SubDisCode,
          CommuCode: data.CommuCode
        },
        attributes: ["ZoneName", "id", "ZoneID"]
      });
      return res;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 获取所有单元格信息
   *
   * @returns
   */
  async getCellAllList() {
    const db = this.db;
    try {
      const res = await db["cms_cell"].findAll();
      return res;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 删除区片
   *
   * @param {any} data  data.id
   * @returns
   */
  async delZoneById(data) {
    const db = this.db;
    try {
      const res = await db["geo_zone"].destroy({
        where: {
          id: data.id
        }
      });
      return res;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }
  /**
   * 获取区片数据
   */
  async getZoneAll() {
    const db = this.db;
    try {
      const res = await db["geo_zone"].findAll({
        attributes: ["id", "ZoneName", "ZoneID", "Baidu_lng", "Baidu_lat"]
      });
      return res;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }
  /**
   * 更改数据的位数
   * @param {Number} num  需要更改是数字
   * @param {Number} length       需要更为为几位数据
   */
  fix(num, length) {
    return ("" + num).length < length
      ? (new Array(length + 1).join("0") + num).slice(-length)
      : "" + num;
  }
}
