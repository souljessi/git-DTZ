export default class extends think.Logic {
    saveDepartInfoAction() {
        this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules = {
            org_name: {
                required: true,
                trim: true, // 字段需要trim处理
            }
        }
        let msg = {
            required: '{name} 不能为空',
        }
        let flag = this.validate(rules, msg);

    }

    delDepartInfoAction() {
        this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules = {
            id: {
                required: true,
                trim: true, // 字段需要trim处理
            }
        }
        let msg = {
            required: '{name} 不能为空',
        }
        let flag = this.validate(rules, msg);
    }
    getUserListByDidAction() {
        this.allowMethods = 'get'; //  只允许 POST 请求类型
        let rules = {
            page: {
                required: true,
                trim: true, // 字段需要trim处理
                int: true

            },
            pageSize: {
                required: true,
                trim: true, // 字段需要trim处理
                int: true
            },
        }
        let msg = {
            required: '{name} 不能为空',
        }
        let flag = this.validate(rules, msg);
    }
    unBindUserAction() {
        this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules = {
            userid: {
                required: true,
                trim: true, // 字段需要trim处理
            },
        }
        let msg = {
            required: '{name} 不能为空',
        }
        let flag = this.validate(rules, msg);
    }
    getUserNotBindOrgAction() {
        this.allowMethods = 'get'; //  只允许 POST 请求类型
        let rules = {
            page: {
                required: true,
                int: true

            },
            pageSize: {
                required: true,
                int: true
            },
        }
        let msg = {
            required: '{name} 不能为空',
        }
        let flag = this.validate(rules, msg);
    }
    saveUsersDepartAction(){
        this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules = {
            userlist:{
                required: true,
                trim: true, // 字段需要trim处理
            },
            org_id:{
                required: true,
                trim: true, // 字段需要trim处理
            }
        }
    }

}