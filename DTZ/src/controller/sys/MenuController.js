export default class extends think.Controller {
    constructor(ctx) {
        super(ctx);
        this.MenuService = think.service('sys/MenuService');
    }
    indexAction() {

    }
    /**
     * 新增/修改菜单
     * 
     * @returns 
     */
    async doAddOrUpdateAction() {
        let aj = think.ajaxJson();
        // console.log(this.post());
        let PostData = this.post('id,menu_level,menu_name,menu_order,menu_url,comp_path,parent_id,menu_type,menu_icon,menu_source,is_show,is_button,is_crumb,href,permission,parent');
        const res = await this.MenuService.doAddOrUpdate(PostData)
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
     * 查询菜单信息  （分页）
     * 
     * @returns 
     */
    async doQueryMenuListAction() {
        let aj = think.ajaxJson();
        let GetData = this.get('page,pageSize,menu_name');
        const res = await this.MenuService.getSysMenuList(GetData);
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
     * 删除菜单
     * 
     * @returns 
     */
    async delSysMenuInfoAction() {
        let aj = think.ajaxJson();
        let postData = {
            id: this.post('id')
        }
        const res = await this.MenuService.delSysMenuInfo(postData);
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
     * 查询菜单信息 全部
     * 
     * @returns 
     */
    async doQueryMenuAllAction() {
        let aj = think.ajaxJson();
        const res = await this.MenuService.getAllMenu();
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
     * 查询父级菜单
     * 
     * @returns 
     */
    async doQueryMenuLevelAction() {
        let aj = think.ajaxJson();
        const res = await this.MenuService.getsysMenuLevel(this.get());
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
    async getMenuListByAction() { //条件查询菜单信息
        const getData = this.get();
        const res = await this.MenuService.getSysMenuList(getData);
        return this.json(res);
    }
}