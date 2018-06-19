export default class extends think.Controller {
    __before() {
        this.testKey = 'testkey'
    }

    /**
     * 新增或更新部件
     */
    async doAddOrUpdateAction() {
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.doAddOrUpdate(this.post());
        return this.json(res);
    }

    /**
     * 删除部件
     */
    async doDelAction() {
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.delParts(this.post());
        return this.json(res);
    }

    /**
     * 保存图片
     */
    async doUploadImgAction() {
        const CmsService = this.service('cms/PartsService');
        const file = this.file('image');
        const postData = this.post();
        let aj = think.ajaxJson();
        // console.log("file:", file);
        if (file) { //保存图片
            console.log('图片接口请求');
            const pathObj = await this.renameFile(file);
            const res = await CmsService.uploadImg(pathObj);
            return this.json(res);
        } else {
            aj.success = false;
            aj.msg = "文件请求失败";
            return this.json(aj);
        }
    }

    /**
     * 批量删除部件
     */
    doBatchDelAction() {
    }

    /**
     * 分页查询部件列表
     */
    async queryPartsListAction() {
        const CmsService = this.service('cms/PartsService');
        const res = await CmsService.getPartsList(this.post());
        return this.json(res);
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

    __call() {
        return this.redirect('/www.baidu.com')
    }
}