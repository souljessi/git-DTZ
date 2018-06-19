export default class extends think.Logic{
    getOaNotifyListAction(){
        this.allowMethods = 'post'
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
    addOaNotifyAction(){
        this.allowMethods = 'post'

    }
    orgAndUserAction(){
        this.allowMethods = 'get'

    }
    UserListAction(){
        this.allowMethods = 'get'

    }
    sendOaNotifyAction() {
        this.allowMethods = 'post'
    }
    sendMsgNotifyAction(){
        this.allowMethods = 'post'
    }
    delOaNotifyAction(){
        this.allowMethods = 'post'
    }
    saveFileAction(){
        this.allowMethods = 'post'
    }
}