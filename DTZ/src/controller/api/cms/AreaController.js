export default class extends think.BaseController {
    /**
     * 获取区域坐标信息
     * @returns {Promise<void>}
     */
    async getAreaPositionAction() {
        const AreaService = this.service('api/cms/AreaService');
        let json = think.ajaxJson();
        try {
            const result = await AreaService.getAreaPosition();
            json.result = result;
            json.msg = '查询成功';
        } catch (err) {
            json.success = false;
            json.result = err.name;
            json.msg = '查询失败';
        }
        return this.json(json);

    }
}