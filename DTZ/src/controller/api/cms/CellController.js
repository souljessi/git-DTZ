export default class extends think.BaseController {
    async getCellByAreaCodeAction() {
        const CellService = this.service('api/cms/CellService');
        const area_code = this.post('area_code');
        const json = think.ajaxJson();
        try {
            const result = await CellService.getCellByAreaCode(area_code);
            json.result = result;
            json.msg = '查询成功';
        } catch (error) {
            json.success = false;
            json.msg = error.name;
        }
        return this.json(json);

    }
}