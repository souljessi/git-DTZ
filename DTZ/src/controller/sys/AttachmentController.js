export default class extends think.Controller {
    constructor(ctx) {
        super(ctx);
    }
    async queryAttByKeyAction() {
        let aj = think.ajaxJson();
        let getData = {
            businesskey: this.get('businesskey')
        }
        const AttService = this.service('sys/AttachmentService');
        const res = await AttService.getAttByKey(getData);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

}