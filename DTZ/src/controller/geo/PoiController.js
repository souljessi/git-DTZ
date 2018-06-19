export default class extends think.Controller {
  __before() {}
  /**
   *@description 更新/编辑地片
   */
  async doAddOrUpdateAction() {
    let aj = think.ajaxJson();
    const data = this.post(
      "id,POIName,POIID,OldName,SubDisName,SubDisCode,Floor,Baidu_lng,Baidu_lat,DataSource,ORDate,CHDate,Note"
    );
    const PoiService = this.service("geo/PoiService");
    const res = await PoiService.doAddOrUpdatePoi(data);
    if (!res.error) {
      aj.result = res;
    } else {
      aj.success = false;
      aj.msg = "更新失败";
    }
    return this.json(aj);
  }

  /**
   * 获取区片数据 带分页
   *
   * @returns
   */
  async doGetPoiListForPageAction() {
    let aj = think.ajaxJson();
    const data = this.get("page,pageSize,POIName");
    console.log(data);
    const PoiService = this.service("geo/PoiService");
    const Res = await PoiService.getPoiListPage(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }

  async delPoiByIdAction() {
    let aj = think.ajaxJson();
    const data = { id: this.post("id") };
    console.log(data);
    const PoiService = this.service("geo/PoiService");
    const Res = await PoiService.delPoiById(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }
  /**
   * 通过SubDisCode查询街巷数据
   */
  async getPoiBySubCodeAction() {
    let aj = think.ajaxJson();
    const data = {
      SubDisCode: this.get("SubDisCode")
    };
    console.log(data);
    const PoiService = this.service("geo/PoiService");
    const Res = await PoiService.getPoiBySubCode(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }
  /**
   * 获取所有兴趣点数据
   */
  async getPoiAllAction() {
    let aj = think.ajaxJson();
    const PoiService = this.service("geo/PoiService");
    const Res = await PoiService.getPoiAll();
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }
  __call() {}
}
