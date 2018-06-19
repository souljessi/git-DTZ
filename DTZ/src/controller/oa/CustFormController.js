export default class extends think.Controller {
  /**
   * 自定义表单保存
   *
   * @returns
   */
  async saveCustFormAction() {
    let aj = think.ajaxJson();
    let postData = this.post(
      "create_by,create_date,form_items,id,template_code,template_name,update_by,update_date,form_type,icon_path,template_group"
    );
    const CusFormService = this.service("oa/CusFormService");
    const res = await CusFormService.saveCustForm(postData);
    console.log("Res:", res);
    if (!res) {
      aj.success = false;
      aj.msg = "审批编码重复,请从新输入";
    }
    if (res && res.error) {
      aj.success = false;
      aj.msg = "表单添加错误";
    }
    return this.json(aj);
  }
  /**
   * 获取表单图标
   *
   * @returns
   */
  async getCusFormIconAction() {
    let aj = think.ajaxJson();
    const CusFormService = this.service("oa/CusFormService");
    const res = await CusFormService.getCusFormIcon();

    if (res && res.error) {
      aj.success = false;
      aj.msg = "获取失败";
    } else {
      aj.result = res;
    }
    return this.json(aj);
  }
  /**
   * 获取所有表单信息
   *
   * @returns
   */
  async getCusFormInfoByAllAction() {
    let aj = think.ajaxJson();
    let getData = this.get("template_name,form_type");
    const CusFormService = this.service("oa/CusFormService");
    const res = await CusFormService.getCusFormInfo(getData);
    if (res && res.error) {
      aj.success = false;
      aj.msg = "获取失败";
    } else {
      aj.result = res;
    }
    return this.json(aj);
  }
  /**
   * 通过Id获取表单模板信息
   *
   * @returns
   */
  async getCusFormInfoByIdAction() {
    let aj = think.ajaxJson();
    const CusFormService = this.service("oa/CusFormService");
    let PostData = {
      id: this.post("id")
    };
    const res = await CusFormService.getCusFormInfoById(PostData);
    if (res && res.error) {
      aj.success = false;
      aj.msg = "获取失败";
    } else {
      aj.result = res;
    }
    return this.json(aj);
  }
  /**
   * 通过id删除模板
   *
   * @returns
   */
  async delCusFormByIdAction() {
    let aj = think.ajaxJson();
    const CusFormService = this.service("oa/CusFormService");
    let postData = {
      id: this.post("id")
    };
    const res = await CusFormService.delCusFormById(postData);
    if (res && res.error) {
      aj.success = false;
      aj.msg = "获取失败";
    } else {
      aj.result = res;
    }
    return this.json(aj);
  }
}
