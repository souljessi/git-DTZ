export default class extends think.Controller {
    __before() {
        this.testKey = 'testkey'
    }
    /**
     * 根据百度原点坐标和范围（米）获取部件列表
     */
    async getPartsListByRangeAction(){
        let aj = think.ajaxJson();        
        const data = {
            baidu_x:Number(this.post('baidu_x')),
            baidu_y:Number(this.post('baidu_y')),
            range:Number(this.post('range'))
        }
        const PartsService = this.service('api/cms/PartsService');
        const res = await PartsService.getPartsListByRange(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '获取部件列表失败'
        }
        return this.json(aj);
    }
     /**
     * 根据行政区域代码|部件分类|用户id获取部件列表
     */
    async getPartsListByAreaAction(){
        let aj = think.ajaxJson();   
        let data = {};
        if(this.post('area_code')){
            data.area_code =this.post('area_code');
        }  
        if(this.post('group_code')){
            data.group_code =this.post('group_code');
        }  
        if(this.post('ObjState')){
            data.ObjState =this.post('ObjState');
        }
        if(this.post('userId')){
            data.create_by =this.post('userId');
        }
        const PartsService = this.service('api/cms/PartsService');
        const res = await PartsService.getPartsListByArea(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '获取部件列表失败'
        }
        return this.json(aj);
    }

    async getCountByAreaAction(){
        let aj = think.ajaxJson();        
        const PartsService = this.service('api/cms/PartsService');
        const res = await PartsService.getCountByArea();
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '查询区域部件数量信息错误';
        }
        return this.json(aj);
    }
    async getCountByStateAction(){
        let aj = think.ajaxJson();        
        const PartsService = this.service('api/cms/PartsService');
        const res = await PartsService.getCountByState();
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '查询部件统计信息错误';
        }
        return this.json(aj);
    }
    __call() {

    }
}