export default class extends think.Service {
  /**
   * 获取区域列表信息
   *
   * @returns
   */
  async getAreaList() {
    const db = this.db;
    const attributes = ["id", "area_code", "area_name", "parent_id"];
    // const where = {
    //     [db.Sequelize.Op.or]: [{
    //         parent_id: 0
    //     }, {
    //         parent_id: 2
    //     }]
    // };
    try {
      return await this.commonService.findAll(db["cms_area"], attributes, {});
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }
  /**
   * 获取区域列表信息（分页）
   *
   * @param {any} data
   * @returns
   */
  async getAreaAllList(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    const attributes = ["id", "area_code", "area_name", "parent_id"];
    let where = {};
    if (data.area_name != undefined || data.area_name != null) {
      where = {
        area_name: {
          [this.db.Sequelize.Op.like]: "%" + data.area_name + "%"
        }
      };
    }
    try {
      const res = await db["cms_area"].findAndCountAll({
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
   * 获取区域所有信息
   *
   * @returns
   */
  async getAreaData() {
    const db = this.db;
    const attributes = ["id", "area_code", "area_name", "parent_id"];
    try {
      const res = await db["cms_area"].findAll();
      return res;
    } catch (err) {
      console.log(err);
      return this.exceptionService.handleError(err);
    }
  }
  async delArea(data) {
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    try {
      const Res = await db["cms_area"].findAll({
        where: {
          parent_id: data.id
        }
      });
      if (Res.length > 0) {
        aj.msg = "当前区域下存在子区域，请先删除子区域";
        return aj;
      }
      const cellRes = await db["cms_cell"].findAll({
        where: {
          area_id: data.id
        }
      });
      if (cellRes.length > 0) {
        aj.msg = "当前区域下存在单元格，请先删除单元格";
        return aj;
      }
      const delRes = await db["cms_area"].destroy({
        where: {
          id: data.id
        }
      });
      aj.success = true;
      aj.msg = "删除成功";
      return aj;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }
  /**
   * 保存区域坐标信息
   *
   * @param {any} data
   * @returns
   */
  async saveAreaScope(data) {
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    data.scope_path = JSON.stringify(data.scope_path);
    console.log(data);
    let where = {};
    try {
      const Res = await db["cms_area"].update(data, {
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
      return aj;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }
  /**
   * 新增区域
   *
   * @param {any} data
   * @returns
   */
  async saveNewArea(data) {
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };

    try {
      const oldRes = await db["cms_area"].findAll({
        where: {
          area_code: data.area_code
        }
      });
      if (oldRes.length > 0) {
        aj.msg = "区域编码已存在，请重新输入";
        return aj;
      } else {
        const treeData = await this.TreeService.saveTree(
          "cms_area",
          data.parent,
          data
        );
        console.log("treeData", treeData);
        aj.result = treeData;
        aj.success = true;
        aj.msg = "新增成功";

        // aj.result=oldRes;
        // const Res = await db['cms_area'].update(data, {
        //     where: {
        //         id: data.id
        //     }
        // });
        // if (Res) {
        //     aj.success = true;
        //     aj.msg = '修改成功';
        // } else {
        //     aj.msg = '更新操作失败';
        // }
        return aj;
      }
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }

  async quearCellByAreaId(data) {
    const db = this.db;
    let aj = {
      success: false,
      msg: ""
    };
    try {
      const res = await db["cms_cell"].count({
        where: {
          area_id: data.id
        }
      });
      aj.success = true;
      aj.msg = "查询成功";
      aj.result = res;
      return aj;
    } catch (err) {
      console.log(err);
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 通过parentid查询区域信息
   *
   * @param {any} data
   * @returns
   */
  async queryAreaByParentId(data) {
    try {
      let db = this.db;
      const Res = await db["cms_area"].findAll({
        where: {
          parent_id: data.parent_id
        }
      });
      return Res;
    } catch (error) {
      return this.exceptionService.handleError(error);
    }
  }
}
