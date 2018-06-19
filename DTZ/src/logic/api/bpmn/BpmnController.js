export default class extends think.Logic {
    async getFormInfoAction(){
        this.allowMethods = 'post'
        let rules = {
            id: {
                required: true,
            }
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.json({
                "success": false,
                "msg": '参数id不能为空',
                "result": {},
                "attributes": {}
            });
        }
    }
    async submitFormAction(){
        this.allowMethods = 'post'
        let rules = {
            formId: {
                required: true,
            }, userId: {
                required: true,
            }, data: {
                required: true,
            },
        }

        let flag = this.validate(rules);
        if(!flag){
            return this.json({
                "success": false,
                "msg": '参数不能为空',
                "result": {},
                "attributes": {}
            });
        }
    }

    async getApproverAction(){
        this.allowMethods = 'post'
        let rules = {
            formId: {
                required: true,
            }
        }
        let flag = this.validate(rules);
        if(!flag){
            return this.json({
                "success": false,
                "msg": '参数formId不能为空',
                "result": {},
                "attributes": {}
            });
        }
    }
    async taskMsgListAction(){
        this.allowMethods = 'post'
        let rules = {
            id: {
                required: true,
                int: true
            }
        }

        let flag = this.validate(rules);
        if(!flag){
            return this.json({
                "success": false,
                "msg": '参数id不能为空',
                "result": {},
                "attributes": {}
            });
        }

    }
    async flowMsgListAction(){
        this.allowMethods = 'post'
        let rules = {
            id: {
                required: true,
                int: true
            } ,userId: {
                required: true,
            }
        }

        let flag = this.validate(rules);
        if(!flag){
            return this.json({
                "success": false,
                "msg": '参数不能为空',
                "result": {},
                "attributes": {}
            });
        }

    }
    async submitFlowFormAction(){
        this.allowMethods = 'post'
        let rules = {
            flowId: {
                required: true,
                int: true
            } ,userId: {
                required: true,
            } ,procInstId: {
                required: true,
            }
        }

        let flag = this.validate(rules);
        if(!flag){
            return this.json({
                "success": false,
                "msg": '参数不能为空',
                "result": {},
                "attributes": {}
            });
        }

    }
}