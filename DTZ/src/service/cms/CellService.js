import PolygonUtils from "../../framework/common/utils/PolygonUtils";
export default class extends think.Service {
  /**
   * 新增单元格
   *
   * @param {any} data
   * @returns
   */
  async doAddOrUpdateCell(data) {
    console.log(111, data);
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    let AUTORes = await this.commonService.querySql(
      "SHOW TABLE STATUS WHERE Name='cms_cell'"
    );
    data.scope_path = JSON.stringify(data.scope_path);
    let where = {};
    try {
      if (!data.id) {
        //新增
        data.BGID = data.area_code + this.fix(AUTORes[0].Auto_increment, 3);
        data.ORDate = new Date();
        const Res = await db["cms_cell"].create(data);
        if (Res) {
          aj.success = true;
          aj.result = Res;
          aj.msg = "新增成功";
        } else {
          aj.msg = "插入操作失败";
        }
      } else {
        //编辑
        const Res = await db["cms_cell"].update(data, {
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
      }

      return aj;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
    return aj;
  }

  /**
   * 获取单元格信息 （分页）
   *
   * @param {any} data
   * @returns
   */
  async getCellListPage(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    const attributes = [
      "id",
      "BGID",
      "area_id",
      "BGSQua",
      "ORDate",
      "CHDate",
      "Note",
      "scope_path"
    ];
    let where = {};
    if (data.area_id != undefined || data.area_id != null) {
      where = {
        area_id: data.area_id
      };
    }
    try {
      const res = await db["cms_cell"].findAndCountAll({
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
   * 通过id查询单元格信息
   *
   * @param {any} data
   * @returns
   */
  async getCellListById(data) {
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    let where = {
      area_id: data.area_id
    };
    try {
      const Res = await db["cms_cell"].findAll({
        where: where
      });
      if (Res) {
        aj.success = true;
        aj.msg = "查询成功";
        aj.result = Res;
      } else {
        aj.msg = "查询错误";
      }
      return aj;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
    return aj;
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
   * 删除单元格信息
   *
   * @param {any} data  data.id
   * @returns
   */
  async deltCell(data) {
    const db = this.db;
    try {
      const res = await db["cms_cell"].destroy({
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
   * 通过坐标查询所属社区和所属单元格
   *
   * @param {any} data  data.point
   * @returns
   */
  async queryAreaAndBGIDByCoordinate(data) {
    const point = data.point;
    const db = this.db;
    try {
      const areaData = await db["cms_area"].findAll({
        where: {
          scope_path: {
            [this.db.Sequelize.Op.not]: null
          }
        }
      });
      let areaRes = areaData.filter((item, index) => {
        return PolygonUtils.isPointInPolygon(
          point,
          JSON.parse(item.scope_path)
        );
      });
      let cellData = [];
      if (areaRes.length > 0) {
        cellData = await db["cms_cell"].findAll({
          where: {
            area_id: areaRes[0].id
          }
        });
      }

      let ResData = {
        area: areaRes,
        cell: cellData
      };
      return ResData;
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
