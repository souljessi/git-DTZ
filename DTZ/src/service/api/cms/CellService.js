export default class extends think.Service {
    getCellByAreaCode(areaCode) {
        return this.db['cms_cell'].findAll({where: {area_code: areaCode}});
    }
}