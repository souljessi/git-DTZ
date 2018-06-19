export default class extends think.Service {
    async getAreaPosition() {
        const areaModel = this.db['cms_area'];
        let attr = ['id', 'parent_id', 'area_code', 'area_name', 'scope_path'];
        return await areaModel.findAll({attributes: attr});
    }
}