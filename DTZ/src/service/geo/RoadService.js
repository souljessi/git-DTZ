export default class extends think.Service {
  /**
   * 新增单元格
   *
   * @param {any} data
   * @returns
   */
  async doAddOrUpdateRoad(data) {
    console.log(111, data);
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    let AUTORes = await this.commonService.querySql(
      "SHOW TABLE STATUS WHERE Name='geo_road'"
    );
    let where = {};
    try {
      if (!data.id) {
        //新增
        data.StrID = data.SubDisCode + this.fix(AUTORes[0].Auto_increment, 6);
        const Res = await db["geo_road"].create(data);
        return Res;
      } else {
        //编辑
        const Res = await db["geo_road"].update(data, {
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
  async getRoadListPage(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    const attributes = [
      "id",
      "StrName",
      "StrID",
      "Alias",
      "OldName",
      "SubDisName",
      "SubDisCode",
      "CommuName",
      "CommuCode",
      "DataSource",
      "SHousenum",
      "LHousenum",
      "Beginning",
      "Ending",
      "Direction",
      "RouteName",
      "ORDate",
      "CHDate",
      "Note"
    ];
    let where = {};
    if (data.StrName) {
      where.StrName = {
        [this.db.Sequelize.Op.like]: "%" + data.StrName + "%"
      };
    }
    try {
      const res = await db["geo_road"].findAndCountAll({
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
  async delRoadById(data) {
    const db = this.db;
    try {
      const res = await db["geo_road"].destroy({
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
  async getRoadBySubCode(data) {
    const db = this.db;
    try {
      const res = await db["geo_road"].findAll({
        where: {
          SubDisCode: data.SubDisCode
        },
        attributes: ["StrName", "id", "StrID"]
      });
      return res;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }
  /**
   * 获取街巷数据
   */
  async getRoadAll() {
    const db = this.db;
    try {
      const res = await db["geo_road"].findAll({
        attributes: ["id", "StrName", "StrID", "Baidu_lng", "Baidu_lat"]
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
