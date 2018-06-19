export default class extends think.Controller {
  async doAddOrUpdateCellAction() {
    let aj = think.ajaxJson();
    let postData = this.post(
      "id,BGID,area_code,area_id,BGSQua,Note,scope_path"
    );
    const CellService = this.service("cms/CellService");
    const res = await CellService.doAddOrUpdateCell(postData);
    if (!res.error) {
      aj.success = res.success;
      aj.result = res.result;
      aj.msg = res.msg;
    } else {
      aj.success = false;
      aj.msg = `查询失败:${res.error}`;
    }
    return this.json(aj);
  }

  /**
   * 查询所有单元网格（分页）
   *
   * @returns
   */
  async queryAllCellPageListAction() {
    let aj = think.ajaxJson();
    let GetData = this.get("page,pageSize,area_id");
    const CellService = this.service("cms/CellService");
    const res = await CellService.getCellListPage(GetData);
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }
  /**
   * 通过区域id查询单元格信息
   */
  async queryCellListByAreaIdAction() {
    let aj = think.ajaxJson();
    let GetData = {
      area_id: this.get("area_id")
    };
    const CellService = this.service("cms/CellService");
    const res = await CellService.getCellListById(GetData);
    if (!res.error) {
      aj.result = res.result;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }
  /**
   * 查询单元格列表信息
   *
   * @returns
   */
  async querCellAllListAction() {
    let aj = think.ajaxJson();
    const CellService = this.service("cms/CellService");
    const res = await CellService.getCellAllList();
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }

  /**
   * 删除单元格
   *
   * @returns
   */
  async deltCellAction() {
    let aj = think.ajaxJson();
    let postData = {
      id: this.post("id")
    };
    const CellService = this.service("cms/CellService");
    const res = await CellService.deltCell(postData);
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }

  /**
   * 通过坐标查询所属社区和所属单元格
   *
   * @returns
   */
  async queryAreaAndBGIDByCoordinateAction() {
    let aj = think.ajaxJson();
    const postData = {
      point: this.post("point")
    };
    console.log(postData);
    const CellService = this.service("cms/CellService");
    const res = await CellService.queryAreaAndBGIDByCoordinate(postData);
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "查询失败";
    }
    return this.json(aj);
  }
}
