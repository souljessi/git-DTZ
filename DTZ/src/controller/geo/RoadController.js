export default class extends think.Controller {
  __before() {}
  /**
   *@description 更新/编辑地片
   */
  async doAddOrUpdateAction() {
    let aj = think.ajaxJson();
    const data = this.post(
      "id,StrName,StrID,Alias,OldName,SubDisName,SubDisCode,CommuName,CommuCode,SHousenum,LHousenum,Beginning,Ending,Direction,RouteName,Baidu_lng,Baidu_lat,DataSource,ORDate,CHDate,Note"
    );
    const RoadService = this.service("geo/RoadService");
    const res = await RoadService.doAddOrUpdateRoad(data);
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
  async doGetRoadListForPageAction() {
    let aj = think.ajaxJson();
    const data = this.get("page,pageSize,StrName");
    console.log(data);
    const RoadService = this.service("geo/RoadService");
    const Res = await RoadService.getRoadListPage(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }

  async delRoadByIdAction() {
    let aj = think.ajaxJson();
    const data = { id: this.post("id") };
    console.log(data);
    const RoadService = this.service("geo/RoadService");
    const Res = await RoadService.delRoadById(data);
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
  async getRoadBySubCodeAction() {
    let aj = think.ajaxJson();
    const data = {
      SubDisCode: this.get("SubDisCode")
    };
    console.log(data);
    const RoadService = this.service("geo/RoadService");
    const Res = await RoadService.getRoadBySubCode(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }

  /**
   * 获取所有街巷数据
   */
  async getRoadAllAction() {
    let aj = think.ajaxJson();
    const RoadService = this.service("geo/RoadService");
    const Res = await RoadService.getRoadAll();
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
