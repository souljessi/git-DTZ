export default class extends think.Logic{
    async caseListAction(){
        this.allowMethods = 'get'
    }
}