export default class extends think.Controller {
    /**
     * 查询部件分类列表
     *
     */
    async queryPartsGroupListAction() {
        const PartsGroupService = this.service('cms/PartsGroupService');
        const res = await PartsGroupService.getPratsGroupList();
        return this.json(res);
    }

    /**
     * 查询部件分类
     */
    queryPartsListAction() {

    }

    /**
     * 获取分类树形菜单
     */
    getPartsGroupTreeAction() {

    }

    /**
     * 通过parentID获取部件分类信息
     * 
     */
    async queryPartsGroupForParentAction() {
        let aj = think.ajaxJson();
        const PartsGroupService = this.service('cms/PartsGroupService');
        let data = {
            parent_id: this.get('parentId')
        }
        const res = await PartsGroupService.getPratsGroupForParent(data);
        if (!res.error) {
            aj.result = res
        } else {
            aj.success = false;
            aj.msg = `查询失败:${res.error}`;
        }
        return this.json(aj);
    }

    /************************************ */
    /**
     * 分页查询部件分类列表
     */
    async partsGroupListAction() {
        let data = {
            page:Number(this.get('page')),
            pageSize:Number(this.get('pageSize'))
        };
        if(this.get('group_name')){
            data.group_name = this.get('group_name');
        }
        if(this.get('id')){
            data.id = Number(this.get('id'));
        }
        let aj = think.ajaxJson();
        const PartsGroupService = this.service('cms/PartsGroupService');
        const res = await PartsGroupService.getPartsGroupList(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '获取事件分类列表失败';
        }
        return this.json(aj);
    }
    /**
     * 删除部件分类
     */
    async delPGInfoAction(){
        const data = {id:this.post('id')};
        let aj = think.ajaxJson();
        const PartsGroupService = this.service('cms/PartsGroupService');
        const res = await PartsGroupService.delPGInfo(data);
        if(res&&res.error){
            aj.success = false;
            aj.msg = '事件分类删除错误';
        }
        if(res&&res.msg){//有子类
            aj.success = false;
            aj.msg = res.msg;
        }
        return this.json(aj);
    }

    /**
     * 保存部件分类信息
     */
    async savePGInfoAction(){
        const file = this.file('image');
        const PartsGroupService = this.service('cms/PartsGroupService');
        const saveData = this.post('group_name,remark');
        let aj = think.ajaxJson();
        let checkData = {
            group_name:this.post('group_name'),
            group_code:this.post('group_code')
        };
        if(this.post('id')){//编辑
            checkData.id = this.post('id');
            saveData.id = this.post('id');
            if(!saveData.remark){
                saveData.remark = null;
            }
        }else{
            saveData.group_code = this.post('group_code');
            saveData.group_level = Number(this.post('group_level'));
            if(saveData.group_level===2){
                saveData.parent_id = this.post('parent_id');
            }
        }
        const check = await PartsGroupService.checkCode(checkData);
        if(check>0){
            aj.success = false;
            aj.msg = '事件分类名称或分类代码已存在，请重新确认';
        }else{
            if(this.post('group_pic_path')&&file){//删除原图
                // console.log('删除图片');
                const delArr = [this.post('group_pic_path')];
                const del = await this.delFile(delArr);
                if(!del){
                    aj.success = false;
                    aj.msg = '原有图标删除错误';
                    return this.json(aj);  
                }
            }
            if(file){//保存图片
                // console.log('保存图片');
                const pathObj = await this.saveFile(file,'static/upload/partIcons/');
                if (pathObj) {
                    saveData.group_pic_path= pathObj.filePathStatic;
                }else{
                    aj.success = false;
                    aj.msg = '图片保存错误';
                    return this.json(aj);
                }
            }
            const res = await PartsGroupService.savePGInfo(saveData);
            if(res.error){
                aj.success = false;
                aj.msg = "部件分类信息保存失败";
            }
        }
        return this.json(aj);
    }
    /***************************************** */
}