export default class extends think.Controller {
  __before() {}
  /**
   *@description 更新/编辑地片
   */
  async doAddOrUpdateAction() {
    let aj = think.ajaxJson();
    const data = this.post(
      "id,AddName,AddID,RoadName,ZoneName,HouseNum,SubDisName,SubDisCode,CommuName,CommuCode,Baidu_lng,Baidu_lat,DataSource,ORDate,CHDate,Note"
    );
    const HouseService = this.service("geo/HouseService");
    const res = await HouseService.doAddOrUpdateHouse(data);
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
  async doGetHouseListForPageAction() {
    let aj = think.ajaxJson();
    const data = this.get("page,pageSize,AddName");
    console.log(data);
    const HouseService = this.service("geo/HouseService");
    const Res = await HouseService.getHouseListPage(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }

  async delHouseByIdAction() {
    let aj = think.ajaxJson();
    const data = { id: this.post("id") };
    console.log(data);
    const HouseService = this.service("geo/HouseService");
    const Res = await HouseService.delHouseById(data);
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
  async getHouseBySubCodeAction() {
    let aj = think.ajaxJson();
    const data = {
      SubDisCode: this.get("SubDisCode")
    };
    console.log(data);
    const HouseService = this.service("geo/HouseService");
    const Res = await HouseService.getHouseBySubCode(data);
    if (!Res.error) {
      aj.result = Res;
    } else {
      aj.success = false;
      aj.msg = "获取失败";
    }
    return this.json(aj);
  }

  /**
   * 获取所有门牌数据
   */
  async getHouseAllAction() {
    let aj = think.ajaxJson();

    const HouseService = this.service("geo/HouseService");
    const Res = await HouseService.getHouseAll();
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
