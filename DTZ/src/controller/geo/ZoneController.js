export default class extends think.Controller {
  __before() {}
  /**
   *@description 更新/编辑地片
   */
  async doAddOrUpdateAction() {
    let aj = think.ajaxJson();
    const data = this.post(
      "id,ZoneName,ZoneID,Alias,OldName,Boundary,SubDisName,SubDisCode,CommuName,CommuCode,Baidu_lng,Baidu_lat,DataSource,ORDate,CHDate,Note"
    );
    const ZoneService = this.service("geo/ZoneService");
    const res = await ZoneService.doAddOrUpdateZone(data);
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
  async doGetZoneListForPageAction() {
    let aj = think.ajaxJson();
    const data = this.get("page,pageSize,ZoneName");
    console.log(data);
    const ZoneService = this.service("geo/ZoneService");
    const Res = await ZoneService.getZoneListPage(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }

  /**
   * 通过id查询区片数据
   */
  async delZoneByIdAction() {
    let aj = think.ajaxJson();
    const data = { id: this.post("id") };
    console.log(data);
    const ZoneService = this.service("geo/ZoneService");
    const Res = await ZoneService.delZoneById(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }
  /**
   * 通过SubDisCode和CommuCode查询区片数据
   */
  async getZoneBySubComCodeAction() {
    let aj = think.ajaxJson();
    const data = this.get("SubDisCode,CommuCode");
    console.log(data);
    const ZoneService = this.service("geo/ZoneService");
    const Res = await ZoneService.getZoneBySubComCode(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }

  /**
   * 获取所有区片数据
   */
  async getZoneAllAction() {
    let aj = think.ajaxJson();
    const ZoneService = this.service("geo/ZoneService");
    const Res = await ZoneService.getZoneAll();
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
