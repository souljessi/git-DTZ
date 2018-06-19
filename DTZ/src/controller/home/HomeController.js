export default class extends think.BaseController {
    
        /**
         * 获取最新未读通知列表 （最新10条）
         */
        async getNotifyListAction() {
            let aj = think.ajaxJson();
            const userData = this.getUser();
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getNotifyList(userData);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
        }
        
        /**
         * 获取我的待办任务 （最新10条）
         */
        async getTaskListAction() {
            let aj = think.ajaxJson();
            const userData = this.getUser();
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getTaskList(userData);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
        }

        /**
         * 获取进行中项目列表 （最新10条）
         */
        async getUnfinishedListAction() {
            let aj = think.ajaxJson();
            const userData = this.getUser();
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getUnfinishedList(userData);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
        }

        async getWorkDetailAction(){
            let aj = think.ajaxJson();
            const data = {proc_inst_id:this.get('proc_inst_id')};
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getWorkDetail(data);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
        }
        /**
         * 获取问题部件统计
         */
        async getQuePartsCountAction(){
            let aj = think.ajaxJson();
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getQuePartsCount();
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
        }
        /**
         * 获取事件分类统计
         */
        async getEventGroupCountAction(){
            let aj = think.ajaxJson();
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getEventGroupCount();
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj); 
        }

        /**
         * 最近30天案卷统计
         */
        async getCaseStateCountAction(){
            let aj = think.ajaxJson();
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getCaseStateCount();
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj); 
        }
        /**
         * 获取进行中审批
         */
        async getCustFormTaskAction(){
            let aj = think.ajaxJson();
            const userData = this.getUser();            
            const HomeService = this.service('home/HomeService');
            const res = await HomeService.getCustFormTask(userData);
            if (!res.error) {
                aj.result = res;
            } else {
                aj.success = false;
                aj.msg = '查询失败';
            }
            return this.json(aj);
            
        }

    }