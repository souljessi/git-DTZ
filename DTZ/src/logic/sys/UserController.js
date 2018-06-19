export default class extends think.Logic {
    getUserListAction() {
        this.allowMethods = 'get'; //  只允许 POST 请求类型
        let rules = {
            page: {
                required: true,
                int: true,
                trim: true, // 字段需要trim处理
            },
            pageSize: {
                required: true,
                int: true,
                trim: true, // 字段需要trim处理
            },
        }
    }
    saveUserInfoAction() {
        this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules = {
            id: {
                trim: true, // 字段需要trim处理
            },
            username: {
                required: true,
                trim: true, // 字段需要trim处理
            },
            password: {
                trim: true, // 字段需要trim处理
            },
            checkPass: {
                trim: true, // 字段需要trim处理
            },
            realname: {
                trim: true, // 字段需要trim处理
            },
            phone: {
                trim: true, // 字段需要trim处理
                int: true,
            },
            org_id: {
                trim: true, // 字段需要trim处理
            },
            org_name: {
                trim: true, // 字段需要trim处理   
            }
        }
    }
    delUserInfoAction() {
        this.allowMethods = 'post'; //  只允许 POST 请求类型
        let rules = {
            id: {
                trim: true, // 字段需要trim处理
            }
        }
    }
    checkPsdAction(){
        this.allowMethods = 'get'; //  只允许 POST 请求类型
        let rules = {
            id: {
                trim: true, // 字段需要trim处理
            },
            username: {
                trim: true, // 字段需要trim处理
            },
            password: {
                trim: true, // 字段需要trim处理
            }
        }
    }
}