export default class extends think.Logic{
    async queryEventAction(){
        this.allowMethods = 'post'
    }
    async addEventBGIDAction(){
        this.allowMethods = 'post'
    }
    async queryEventListAction(){
        this.allowMethods  = 'post'
    }
    async querySpecificAction(){
        this.allowMethods = 'post'
    }
    async queryParentEventAction(){
        this.allowMethods = 'get'
    }

    async queryChildrenEventAction(){
        this.allowMrthods = 'post'
    }
    async eventSourceTypeAction(){
        this.allowMethods = 'get'
    }

    async eventStateTypeAction(){
        this.allowMethods = 'get'
    }

    async eventDoneAction(){
        this.allowMethods = 'post'
    }
    async eventPicAction(){
        this.allowMethods = 'post'
    }

    allEventReportAction() {
        this.rules = {
        }
    }
}