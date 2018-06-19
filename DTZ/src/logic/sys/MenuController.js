export default class extends think.Logic {
    /**
     * 新增、修改菜单
     * 
     * @returns 
     */
    doAddOrUpdateAction() {
        this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules = {
            menu_name: {
                required: true,
                trim: true, // 字段需要trim处理
            },
            menu_level: {
                int: true
            },
            menu_order: {
                int: true
            },
            menu_type: {
                int: true
            },
            menu_source:{
                int: true   
            }


        }
        let msg = {
            menu_name: '{name} 不能为空',
        }
        let flag = this.validate(rules, msg);
        // if (!flag) {
        //     return this.fail('validate error', this.validateErrors);
        // }
    }

}