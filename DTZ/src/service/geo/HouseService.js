export default class extends think.Service {
  /**
   * 新增单元格
   *
   * @param {any} data
   * @returns
   */
  async doAddOrUpdateHouse(data) {
    console.log(111, data);
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    let AUTORes = await this.commonService.querySql(
      "SHOW TABLE STATUS WHERE Name='geo_house'"
    );
    let where = {};
    try {
      if (!data.id) {
        //新增
        data.AddID = data.SubDisCode + this.fix(AUTORes[0].Auto_increment, 6);
        const Res = await db["geo_house"].create(data);
        return Res;
      } else {
        //编辑
        const Res = await db["geo_house"].update(data, {
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
  async getHouseListPage(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    let where = {};
    if (data.AddName) {
      where.AddName = {
        [this.db.Sequelize.Op.like]: "%" + data.AddName + "%"
      };
    }
    try {
      const res = await db["geo_house"].findAndCountAll({
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
  async delHouseById(data) {
    const db = this.db;
    try {
      const res = await db["geo_house"].destroy({
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
   * 获取门牌数据
   */
  async getHouseAll() {
    const db = this.db;
    try {
      const res = await db["geo_house"].findAll({
        attributes: ["id", "AddName", "AddID", "Baidu_lng", "Baidu_lat"]
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
