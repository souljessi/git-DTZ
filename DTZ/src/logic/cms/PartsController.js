export default class extends think.Logic{
     async queryBadPartsAction(){
         this.allowMethods = 'post'
     }
    async addPartBGIDAction(){
        this.allowMethods = 'post'
    }
}