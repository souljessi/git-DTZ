export default class extends think.Service {
  /**
   * 新增单元格
   *
   * @param {any} data
   * @returns
   */
  async doAddOrUpdatePoi(data) {
    console.log(111, data);
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    let AUTORes = await this.commonService.querySql(
      "SHOW TABLE STATUS WHERE Name='geo_poi'"
    );
    let where = {};
    try {
      if (!data.id) {
        //新增
        data.POIID = data.SubDisCode + this.fix(AUTORes[0].Auto_increment, 6);
        const Res = await db["geo_poi"].create(data);
        return Res;
      } else {
        //编辑
        const Res = await db["geo_poi"].update(data, {
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
  async getPoiListPage(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    const attributes = [
      "id",
      "POIName",
      "POIID",
      "OldName",
      "SubDisName",
      "SubDisCode",
      "Floor",
      "ORDate",
      "CHDate",
      "Note"
    ];
    let where = {};
    if (data.POIName) {
      where.POIName = {
        [this.db.Sequelize.Op.like]: "%" + data.POIName + "%"
      };
    }
    try {
      const res = await db["geo_poi"].findAndCountAll({
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
   * 删除单元格信息
   *
   * @param {any} data  data.id
   * @returns
   */
  async delPoiById(data) {
    const db = this.db;
    try {
      const res = await db["geo_poi"].destroy({
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
   * 通过scu和ComCode 查询区片
   *
   * @param {any} data
   * @returns
   */
  async getPoiBySubCode(data) {
    const db = this.db;
    try {
      const res = await db["geo_poi"].findAll({
        where: {
          SubDisCode: data.SubDisCode
        },
        attributes: ["POIName", "id", "POIID"]
      });
      return res;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

    /**
   * 获取兴趣点数据
   */
  async getPoiAll() {
    const db = this.db;
    try {
      const res = await db["geo_poi"].findAll({
        attributes: ["id", "POIName", "POIID", "Baidu_lng", "Baidu_lat"]
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
