export default class extends think.Service {
  constructor() {
    super();
    this.callExtenMode = this.db["call_exten"];
    this.userModel = this.db['sys_user'];
    this.callExtenMode.belongsTo(this.userModel, {
      foreignKey: 'commissioner',
      targetKey: 'id'
    });
  }
  /**
   * 更新、编辑分机数据
   *
   * @param {Object} data   分机基础数据
   * @returns
   */
  async doAddOrUpdate(data) {
    const db = this.db;
    try {
      const oldExten = await this.callExtenMode.findOne({
        where: {
          exten:data.exten
        }
    });
      if (data.id) {
        return await db["call_exten"].update(data, {
          where: {
            id: data.id
          }
        });
      } else {
        if(oldExten) return false;
        return await db["call_exten"].create(data);
      }
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 获取分机数据 分页
   *
   * @param {any} data
   * @returns
   */
  async doGetExtenListForPage(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    let where = {};
    if (data.exten)
      where.exten = {
        [this.db.Sequelize.Op.like]: "%" + data.exten + "%"
      };
    try {
      return await db["call_exten"].findAndCountAll({
        where: where,
        order: [
          ["id", "DESC"]
        ],
        include: [{
          model: this.userModel,
          attributes: ['id', 'realname'],
        }],
        limit: parseInt(data.pageSize),
        offset: parseInt(data.start)
      });
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 通过id查询分机数据
   *
   * @param {any} data
   * @returns
   */
  async doGetExtenListById(data) {
    const db = this.db;
    try {
      return await db["call_exten"].findOne({
        where: {
          id: data.id
        }
      });
    } catch (error) {
      return this.exceptionService.handleError(err);
    }
  }

  async doDelExtenById(data) {
    const db = this.db;
    try {
      return await db["call_exten"].destroy({
        where: {
          id: data.id
        }
      });
    } catch (error) {
      return this.exceptionService.handleError(err);
    }
  }
}