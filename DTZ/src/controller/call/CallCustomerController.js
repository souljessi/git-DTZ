export default class extends think.BaseController {
  /**
   * 查询客户信息
   *
   * @returns
   */
  async doGetCustomerListForPageAction() {
    const CallCustomerService = await this.service("call/CallCustomerService");
    let getData = this.get("page,pageSize,real_name,phone");
    const Res = await CallCustomerService.doGetCustomerListForPage(getData);
    if (Res.error) {
      return this.errorJson("操作失败");
    } else {
      return this.successJson(Res);
    }
  }

  /**
   * 通过id 查询客户信息
   *
   * @returns
   */
  async doGetCustomerListByIdAction() {
    const CallCustomerService = await this.service("call/CallCustomerService");
    let getData = {
      id: this.get("id")
    };
    const Res = await CallCustomerService.doGetCustomerListById(getData);
    if (Res && Res.error) {
      return this.errorJson("操作失败");
    } else {
      return this.successJson(Res);
    }
  }

  /**
   * 通过电话号码 查询客户信息
   *
   * @returns
   */
  async doGetCustomerListByPhoneAction() {
    const CallCustomerService = await this.service("call/CallCustomerService");
    let getData = {
      phone: this.get("phone")
    };
    const Res = await CallCustomerService.doGetCustomerListByPhone(getData);
    if (Res && Res.error) {
      return this.errorJson("操作失败");
    } else {
      return this.successJson(Res);
    }
  }
  async doDeleteCustomerByIdAction() {
    const CallCustomerService = await this.service("call/CallCustomerService");
    let postData = {
      id: this.post("id")
    };
    const Res = await CallCustomerService.doDelCustomerById(postData);
    if (Res && Res.error) {
      return this.errorJson("操作失败");
    } else {
      return this.successJson(Res);
    }
  }
}