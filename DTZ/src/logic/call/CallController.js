export default class extends think.Logic {
    findAllExtenAction() {
        this.allowMethods = 'post';
    }

    extenStateChangeAction() {
        this.allowMethods = 'post';
    }

    callScreenAction() {
        this.allowMethods = 'post';
        this.rules = {
            phone_num: {
                required: true
            },
            exten: {
                required: true
            }

        }
    }

    bindExtenAction() {
        this.allowMethods = 'post';
        this.rules = {
            exten: {
                required: true
            }
        }
    }

}