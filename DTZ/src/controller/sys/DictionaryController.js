export default class extends think.Controller{
    indexAction(){

    }
    /**
     * 获取所有字典表信息
     */
    async initdictionaryAction() {
        let aj = think.ajaxJson();
        const DictionaryService = this.service('sys/DictionaryService');
        const res = await DictionaryService.buildDictData();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '获取数据字典失败';
        }
        return this.json(aj);
    }

    /**
     * 同步字典,缓存至redis
     * @param req
     * @param res
     */
    async initdictcacheAction() {
        let aj = think.ajaxJson();
        const DictionaryService = this.service('sys/DictionaryService');
        const res = await DictionaryService.initDictionaryCache();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '获取数据字典失败';
        }
        return this.json(aj);
    }

    /**
     * 查询字典list(带分页)
     */
    async finddictionarylistAction() {
        let aj = think.ajaxJson();
        const data = this.get('page,pageSize,typegroupname');
        const DictionaryService = this.service('sys/DictionaryService');
        const res = await DictionaryService.findDictionaryList(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '字典信息获取失败';
        }
        return this.json(aj);
    }

    /**
     * 新增或更新字典
     */
    async addorupdatedictionaryAction() {
        let aj = think.ajaxJson();
        let data = this.post('typegroupcode,typegroupname');
        if(this.post('id')){
            data.id = this.post('id');
        }
        const DictionaryService = this.service('sys/DictionaryService');
        const res = await DictionaryService.saveDicInfo(data);
        if (res.error) {
            aj.success = false;
            aj.msg = '字典信息保存错误';
        }
        if(!res){
            aj.success = false;
            aj.msg = '字典编码不能重复，请重新输入';
        }
        return this.json(aj);
    }
    /**
     * 单条删除和批量删除
     */
    async deletedicAction() {
        let aj = think.ajaxJson();
        const data = {id:this.post('id')};
        const DictionaryService = this.service('sys/DictionaryService');
        const res = await DictionaryService.delDicInfo(data);
        if (res.error) {
            aj.success = false;
            aj.msg = '字典信息删除错误';
        }
        return this.json(aj);
    }

    /**
     * 根据groupId查询字典类型
     */
    async finddictypelistAction() {
        let aj = think.ajaxJson();
        const groupId = this.get('groupId');
        const DictionaryService = this.service('sys/DictionaryService');
        const res = await DictionaryService.findDicTypeList(groupId);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '字典类型获取失败';
        }
        return this.json(aj); 
    }

    /**
     * 新增或更新字典类型
     */
    async addorupdatedictypeAction() {
        let aj = think.ajaxJson();
        let data = this.post('typecode,typename,typegroupid,other_attr');
        if(this.post('id')){
            data.id = this.post('id');
        }
        const DictionaryService = this.service('sys/DictionaryService');        
        const res = await DictionaryService.saveDicTypeInfo(data);
        if (res.error) {
            aj.success = false;
            aj.msg = '字典类型信息保存错误';
        }
        return this.json(aj);

    }

    async deletedictypeAction() {
        let aj = think.ajaxJson();
        const data = {id:this.post('id')};
        const DictionaryService = this.service('sys/DictionaryService');        
        const res = await DictionaryService.delDicTypeInfo(data);
        if (res.error) {
            aj.success = false;
            aj.msg = '字典类型信息删除错误';
        }
        return this.json(aj);
    }

}  


