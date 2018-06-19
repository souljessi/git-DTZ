export default class extends think.Logic{
    async getNotifyListAction(){
        this.allowMethods = 'post'
    }

    async getNotifyDetailsAction(){
        this.allowMethods = 'post'
    }
    async downloadFileAction(){
        this.allowMethods = 'get'
    }
}