export default class extends think.Service {
  constructor() {
    super();
    this.customerModel = this.db["call_customer"];
    this.userModel = this.db["sys_user"];
    this.customerModel.belongsTo(this.userModel, {
      foreignKey: "operator_id"
    });
  }
  /**
   * 获取分机数据 分页
   *
   * @param {any} data
   * @returns
   */
  async doGetCustomerListForPage(data) {
    const db = this.db;
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    let where = {};
    if (data.real_name)
      where.real_name = {
        [this.db.Sequelize.Op.like]: "%" + data.real_name + "%"
      };
    if (data.phone)
      where.phone = {
        [this.db.Sequelize.Op.like]: "%" + data.phone + "%"
      };
    try {
      return await this.customerModel.findAndCountAll({
        where: where,
        order: [["id", "DESC"]],
        limit: parseInt(data.pageSize),
        offset: parseInt(data.start),
        include: [
          {
            model: this.userModel,
            attributes: ["username"]
          }
        ]
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
  async doGetCustomerListById(data) {
    const db = this.db;
    try {
      return await this.customerModel.findOne({
        where: {
          id: data.id
        },
        include: [
          {
            model: this.userModel,
            attributes: ["username"]
          }
        ]
      });
    } catch (error) {
      return this.exceptionService.handleError(err);
    }
  }
  /**
   * 通过id查询分机数据
   *
   * @param {any} data
   * @returns
   */
  async doGetCustomerListByPhone(data) {
    const db = this.db;
    try {
      return await this.customerModel.findOne({
        where: {
          phone: data.phone
        },
        include: [
          {
            model: this.userModel,
            attributes: ["username"]
          }
        ]
      });
    } catch (error) {
      return this.exceptionService.handleError(err);
    }
  }

  async doDelCustomerById(data) {
    const db = this.db;
    try {
      return await this.customerModel.destroy({
        where: {
          id: data.id
        }
      });
    } catch (error) {
      return this.exceptionService.handleError(err);
    }
  }
}
