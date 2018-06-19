export default class extends think.Controller {
  /**
   * 查询区域
   */
  async queryAreaListAction() {
    let aj = think.ajaxJson();
    const AreaService = this.service("cms/AreaService");
    const res = await AreaService.getAreaList();
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }
  /**
   * 查询所有区域（分页）
   *
   * @returns
   */
  async queryAllAreaListAction() {
    let aj = think.ajaxJson();
    let GetData = this.get("page,pageSize,area_name");
    console.log(11, GetData);
    const AreaService = this.service("cms/AreaService");
    const res = await AreaService.getAreaAllList(GetData);
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }
  /**
   * 获取所有区域全部
   *
   * @returns
   */
  async queryAllAreaDataAction() {
    let aj = think.ajaxJson();
    const AreaService = this.service("cms/AreaService");
    const res = await AreaService.getAreaData();
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }
  /**
   * 保存区域坐标信息
   *
   * @returns
   */
  async saveAreaScopeAction() {
    let aj = think.ajaxJson();
    let postData = this.post("id,scope_path,area_code,area_name,city_type");
    const AreaService = this.service("cms/AreaService");
    const res = await AreaService.saveAreaScope(postData);
    if (!res.error) {
      aj.success = res.success;
      aj.msg = res.msg;
    } else {
      aj.success = false;
      aj.msg = `查询失败:${res.error}`;
    }
    return this.json(aj);
  }

  /**
   * 保存新区域
   */
  async saveNewAreaAction() {
    let aj = think.ajaxJson();
    let postData = this.post("area_code,area_name,city_type,parent,scope_path");
    const AreaService = this.service("cms/AreaService");
    const res = await AreaService.saveNewArea(postData);
    if (!res.error) {
      aj.success = res.success;
      aj.msg = res.msg;
      aj.result = res.result;
    } else {
      aj.success = false;
      aj.msg = `查询失败:${res.error}`;
    }
    return this.json(aj);
  }
  /**
   * 删除区域
   *
   */
  async delAreaAction() {
    let aj = think.ajaxJson();

    let data = {
      id: this.post("id")
    };
    console.log("delt", data);
    const AreaService = this.service("cms/AreaService");

    if (data) {
      const result = await AreaService.delArea(data);
      if (!result.error) {
        aj.success = result.success;
        aj.msg = result.msg;
        aj.result = result.result;
        return this.json(aj);
      } else {
        aj.success = false;
        aj.msg = "删除失败";
        return this.json(aj);
      }
    } else {
      aj.success = false;
      aj.msg = "请传入参数id";
      return this.json(aj);
    }
  }
  async quearCellByAreaIdAction() {
    let aj = think.ajaxJson();
    let data = {
      id: this.get("id")
    };
    const AreaService = this.service("cms/AreaService");

    if (data) {
      const result = await AreaService.quearCellByAreaId(data);
      if (!result.error) {
        aj.success = result.success;
        aj.msg = result.msg;
        aj.result = result.result;
        return this.json(aj);
      } else {
        aj.success = false;
        aj.msg = "查询失败";
        return this.json(aj);
      }
    } else {
      aj.success = false;
      aj.msg = "请传入参数id";
      return this.json(aj);
    }
  }

  async queryAreaByParentIdAction() {
    let aj = think.ajaxJson();
    let data = {
      parent_id: this.get("parent_id")
    };
    const AreaService = this.service("cms/AreaService");
    const result = await AreaService.queryAreaByParentId(data);

    if (data) {
      if (result.error) {
        aj.success = false;
        aj.msg = "查询失败";
        return this.json(aj);
      } else {
        aj.result = result;
        return this.json(aj);
      }
    } else {
      aj.success = false;
      aj.msg = "请传入参数id";
      return this.json(aj);
    }
  }
}
