export default class extends think.BaseController {
  /**
   * 新增、编辑分机号
   *
   * @returns
   */
  async doAddOrUpdateAction() {
    const CallExtenService = await this.service("call/CallExtenService");
    let postData = this.post("id,exten,note,sort,commissioner");
    const Res = await CallExtenService.doAddOrUpdate(postData);
    if (Res.error) {
      return this.errorJson("操作失败");
    } else {
      if (Res) return this.successJson(Res);
      return this.errorJson("当前分机号已存在，请重新输入")
    }
  }
  /**
   * 查询分机数据
   *
   * @returns
   */
  async doGetExtenListForPageAction() {
    const CallExtenService = await this.service("call/CallExtenService");
    let getData = this.get("page,pageSize,exten");
    const Res = await CallExtenService.doGetExtenListForPage(getData);
    if (Res.error) {
      return this.errorJson("操作失败");
    } else {
      return this.successJson(Res);
    }
  }

  /**
   * 通过id 查询分机数据
   *
   * @returns
   */
  async doGetExtenListByIdAction() {
    const CallExtenService = await this.service("call/CallExtenService");
    let getData = {
      id: this.get("id")
    };
    const Res = await CallExtenService.doGetExtenListById(getData);
    if (Res.error) {
      return this.errorJson("操作失败");
    } else {
      return this.successJson(Res);
    }
  }

  /**
   * 通过id删除分机数据
   *
   * @returns
   */
  async doDelExtenByIdAction() {
    const CallExtenService = await this.service("call/CallExtenService");
    let postData = {
      id: this.post("id")
    };
    console.log(postData);
    const Res = await CallExtenService.doDelExtenById(postData);
    if (Res.error) {
      return this.errorJson("操作失败");
    } else {
      return this.successJson(Res);
    }
  }
}