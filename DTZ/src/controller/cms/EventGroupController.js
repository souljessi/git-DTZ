export default class extends think.Controller{
    /**
     * 查询事件分类列表
     * 
     */
    async eventGroupAllAction() {
        const EventGroupService = this.service('cms/EventGroupService');
        const res = await EventGroupService.eventGroupAll();
        return this.json(res);
    }
    /**
     * 分页查询事件分类列表
     */
    async eventGroupListAction() {
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
        const EventGroupService = this.service('cms/EventGroupService');
        const res = await EventGroupService.getEventGroupList(data);
        if(!res.error){
            aj.result = res;
        }else{
            aj.success = false;
            aj.msg = '获取事件分类列表失败';
        }
        return this.json(aj);
    }
    /**
     * 删除事件分类
     */
    async delEGInfoAction(){
        const data = {id:this.post('id')};
        let aj = think.ajaxJson();
        const EventGroupService = this.service('cms/EventGroupService');
        const res = await EventGroupService.delEGInfo(data);
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
     * 保存事件分类信息
     */
    async saveEGInfoAction(){
        const file = this.file('image');
        const EventGroupService = this.service('cms/EventGroupService');
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
        const check = await EventGroupService.checkCode(checkData);
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
                const pathObj = await this.saveFile(file,'static/upload/eventIcons/');
                if (pathObj) {
                    saveData.group_pic_path= pathObj.filePathStatic;
                }else{
                    aj.success = false;
                    aj.msg = '图片保存错误';
                    return this.json(aj);
                }
            }
            const res = await EventGroupService.saveEGInfo(saveData);
            if(res.error){
                aj.success = false;
                aj.msg = "事件分类保存失败";
            }
        }
        return this.json(aj);
    }

}