export default class extends think.Controller {
    __before() {
        this.testKey = 'testkey'
    }

    /**
     * 获取所有区域全部
     * 
     * @returns 
     */
    async getAreaDataAction() {
        let aj = think.ajaxJson();
        const PartsService = this.service('basesource/PartsService');
        const res = await PartsService.getAreaData();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 获取所有部件分类列表
     */
    async getPGDataAction(){
        let aj = think.ajaxJson();
        const PartsService = this.service('basesource/PartsService');
        const res = await PartsService.getPGData();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    /**
     * 获取所有部件分类列表
     */
    async getEVDataAction(){
        let aj = think.ajaxJson();
        const PartsService = this.service('basesource/PartsService');
        const res = await PartsService.getEVData();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 分页查询部件列表
     */
    async getPartsListAction() {
        let aj = think.ajaxJson();
        const data = {
            page:this.get('page'),
            pageSize:this.get('pageSize'),
            area_id:this.get('area_id'),
            parent_ids:this.get('parent_ids')
        };
        const PartsService = this.service('basesource/PartsService');
        const res = await PartsService.getPartsList(data);
        if(res.error){
            aj.success = false;
            aj.msg = '查询部件列表失败！'
        }else{
            aj.result = res;
        }
        return this.json(aj);
    }

    /**
     * 新增或更新部件
     */
    async doAddOrUpdatePartAction() {
        const file = this.file('image');
        let aj = think.ajaxJson();
        let data = this.post();
        if (file) { //保存图片
            // const pathObj = await this.renameFile(file);
            const pathObj = await this.saveFile(file);
            if(pathObj){
                data.pic_path = pathObj.filePathStatic;
                const PartsService = this.service('basesource/PartsService');
                const res2 = await PartsService.doAddOrUpdate(this.post('userid'),data);
                return this.json(res2);
            }else{
                aj.success = false;
                aj.msg = '图片保存失败'; 
                return this.json(aj);
            }
           
        } else {
            aj.success = false;
            aj.msg = "图片保存失败";
            return this.json(aj);
        }
       
    }

    /**
     * 删除部件
     */
    async delPartAction() {
        let aj = think.ajaxJson();
        const data = {
            id:this.post('id')
        };
        const delPic = await this.delFile(['static/upload/images/'+this.post('pic_path')]);//未考虑无图
        if(delPic){
            const PartsService = this.service('cms/PartsService');
            const res = await PartsService.delParts(data);
            if(res.error){
                aj.msg = '部件信息删除失败';
                aj.success = false;
            }
        }else{
            aj.msg = '图片删除失败';
            aj.success = false;
        }
       
        return this.json(aj);
    }

  

    /**
     * 查询所有部件信息
     *
     * @returns
     */
    async queryPartsAllListAction() {
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.getPartsAllList();
        return this.json(res);
    }

    /**
     * 查询部件与部件分类信息
     *
     * @returns
     */
    async queryPartsAndGroupInfoAction() {
        let aj = think.ajaxJson();
        const data = this.get('page,pageSize');
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.getPartsAndGroupInfo(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    async queryPartCountAction() {
        let aj = think.ajaxJson();
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.getPartCount();
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    async queryBadPartsAndGroupInfoAction() {
        let aj = think.ajaxJson();
        const data = this.post();
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.getBadPartsAndGroupInfo(data);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    /**
     * 查询部件
     */
    async queryPartsAction() {
        const CmsService = this.service('cms/PartsService');
        const postData = {
            id: this.post('id')
        }
        const res = await CmsService.getParts(postData);
        return this.json(res);
    }

    async queryPartOneInfoAction() {
        const CmsService = this.service('cms/PartsService');
        const postData = {
            id: this.post('id')
        }
        const res = await CmsService.getPartOneInfo(postData);
        return this.json(res);
    }

    /**
     * 查询损害的部件
     * @returns {Response | *}
     * @private
     */
    async queryBadPartsAction() {
        let aj = think.ajaxJson();
        const data = this.post('ObjState');
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.getBadParts(data);
        console.log('95', res);
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)

    }

    /**
     * 添加所属单元格id:BGID
     */

    async addPartBGIDAction() {
        let aj = think.ajaxJson();
        const BGIDService = this.service('cms/PartsService');
        const res = await BGIDService.partsBGID(this.post());
        if (!res.error) {
            aj.result = res

        } else {
            aj.success = false;
            aj.msg = '保存失败'
        }

        return this.json(aj)
    }

    /**
     * 查询字典表数据来源
     * @returns {Response | *}
     * @private
     */

    async dataSourceAction(){
        let aj = think.ajaxJson();
        const dataSourceService = this.service('basesource/partsService');
        let data = this.get();
        const result = await dataSourceService.dataSource(data);
        if (!result.error) {
            aj.result = result
        } else {
            aj.success = false;
            aj.msg = '查询失败'
        }
        return this.json(aj)

    }

    __call() {
        return this.redirect('/www.baidu.com')
    }
}