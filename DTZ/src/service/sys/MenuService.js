export default class extends think.Service {
  constructor() {
    super();
    this.defData = {
      userid: "000000",
      roleid: "000000"
    };
    this.menuModel = this.db["sys_menu"];
    this.roleMenuModel = this.db["sys_role_menu"];
    this.transData = function(a, idStr, pidStr, chindrenStr) {
      var r = [],
        hash = {},
        id = idStr,
        pid = pidStr,
        children = chindrenStr,
        i = 0,
        j = 0,
        len = a.length;
      for (; i < len; i++) {
        hash[a[i][id]] = a[i];
      }
      for (; j < len; j++) {
        var aVal = a[j],
          hashVP = hash[aVal[pid]];
        if (hashVP) {
          !hashVP[children] && (hashVP[children] = []);
          hashVP[children].push(aVal);
        } else {
          r.push(aVal);
        }
      }
      return r;
    };
  }
  /**
   * 新增新增菜单/编辑菜单
   *
   * @param {any} data
   * @returns
   */
  async doAddOrUpdate(data) {
    let aj = {
      success: false,
      msg: ""
    };
    try {
      const attributes = ["id"];
      const where = {
        menu_name: data.menu_name
      };
      // const oldMenu = await this.menuModel.findOne({
      //     where: {
      //         menu_name: data.menu_name
      //     },
      //     attributes: ['id']
      // });
      // if (oldMenu) {
      //     if (!data.id || (data.id && data.id !== oldMenu.id)) {
      //         aj.msg = "菜单名称已经存在，请确认后重新输入";
      //         return aj;
      //     }
      // }
      if (data.id) {
        const cc = await this.menuModel.upsert(data);
      } else {
        const treeData = await this.TreeService.saveTree(
          "sys_menu",
          data.parent,
          data
        );
        console.log("treeData", treeData);
        if (treeData) {
          const findres = await this.menuModel.findOne({
            where: {
              menu_name: data.menu_name,
              parent_id: data.parent_id
            },
            attributes: ["id"]
          });
          console.log(findres);
          console.log(22222222222222222222);
          data.id = think.uuid("v1");
          const param = {
            id: think.uuid("v1"),
            roleid: this.defData.roleid,
            menuid: findres.dataValues.id
          };
          const roleMenu = await this.roleMenuModel.create(param);
          // const roleMenu = this.commonService.create(this.db['sys_menu'], param);
          if (!roleMenu) {
            aj.msg = "超级管理员角色菜单插入错误";
            return aj;
          }
        }
      }

      aj.success = true;
      aj.msg = "操作成功";
      return aj;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 条件分页查询菜单信息
   *
   * @param {any} data
   * @returns
   */
  async getSysMenuList(data) {
    data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
    let aj = {
      success: false,
      msg: ""
    };
    let where = {};
    if (data.menu_name != undefined || data.menu_name != null) {
      where = {
        menu_name: {
          [this.db.Sequelize.Op.like]: "%" + data.menu_name + "%"
        }
      };
    }
    try {
      const menuList = await this.menuModel.findAndCountAll({
        where: where,
        limit: parseInt(data.pageSize),
        offset: parseInt(data.start)
      });
      aj.success = true;
      aj.msg = "查询成功";
      aj.result = menuList;
      return aj;
    } catch (err) {
      return this.exceptionService.handleError(err);
      // aj.success = false;
      // aj.msg = "数据库查询错误";
      // return aj;
    }
  }
  /**
   * 删除菜单信息
   *
   * @param {any} data
   * @returns
   */
  async delSysMenuInfo(data) {
    let aj = {
      success: false,
      msg: ""
    };
    try {
      const childMenuCount = await this.menuModel.count({
        where: {
          parent_id: data.id
        }
      });
      if (childMenuCount > 0) {
        aj.msg = "存在下级菜单，请先删除下级菜单";
      } else {
        const delMenu = await this.menuModel.destroy({
          where: {
            id: data.id
          }
        });
        if (delMenu) {
          const delRoleMenu = await this.roleMenuModel.destroy({
            where: {
              menuid: data.id
            }
          });
            aj.success = true;
        } else {
          aj.msg = "菜单信息删除错误";
        }
      }
      return aj;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 查询菜单信息（所有）
   *
   * @param {any} data
   * @returns
   */
  async getAllMenu() {
    let aj = {
      success: true,
      msg: ""
    };
    try {
      const res = await this.menuModel.findAll({
        order: [
          ["menu_order"] // 转义 username 并对查询结果按 DESC 方向排序
        ]
      });
      if (res.length > 0) {
        let data = [];
        // for (let i = 0; i < res.length; i++) {
        //     if (res[i].menu_level === 0) {
        //         const sub = res[i].dataValues;
        //         sub.children = [];
        //         for (let j = 0; j < res.length; j++) {
        //             if (res[j].parent_id == res[i].id) {
        //                 const nextChild = res[j].dataValues;
        //                 nextChild.children = [];
        //                 for (let k = 0; k < res.length; k++) {
        //                     if (res[k].parent_id == res[j].id) {
        //                         nextChild.children.push(res[k].dataValues);
        //                     }
        //                 }
        //                 sub.children.push(res[j]);
        //             }
        //         }
        //         data.push(sub);
        //     }
        // }
        // data = this.transData(res, 'id', 'parent_id', 'children')
        aj.result = res;
      }
      return aj;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }

  /**
   * 查询父级菜单
   */
  async getsysMenuLevel(data) {
    let aj = think.ajaxJson();
    try {
      const highMenuList = await this.menuModel.findAll({
        where: data,
        attributes: ["id", "menu_name"]
      });
      aj.result = highMenuList;
      return aj;
    } catch (err) {
      return this.exceptionService.handleError(err);
    }
  }
}
