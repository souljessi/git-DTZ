export default class extends think.Controller {
    
        /**
         * 获取部门及用户（根据用户角色）
         */
        async getDepartAndUserAction() {
            let aj = think.ajaxJson();
            const JobService = this.service('overallmerit/JobService');
            const data = {
                userRole:this.get('userRole')
            };
            const res = await JobService.getDepartAndUser(data);
            if (res&&res.error) {
                aj.success = false;
                aj.msg = '查询失败';
            } else {
                aj.result = res;
            }
            return this.json(aj);
    
        }
        /**
         * 按角色编码获取用户列表
         */
        async getAllUserByRoleCodeAction(){
            let aj = think.ajaxJson();
            const JobService = this.service('overallmerit/JobService');
            const data = {
                userRole:this.get('userRole')
            };
            const res = await JobService.getAllUserByRoleCode(data);
            if (res&&res.error) {
                aj.success = false;
                aj.msg = '查询失败';
            } else {
                aj.result = res;
            }
            return this.json(aj);
        }
        /**
         * 信息采集员岗位评价（人员|时间）
         */
        async getCollectEvalListAction(){
            let aj = think.ajaxJson();
            const JobService = this.service('overallmerit/JobService');
            const data = this.post('cycle,rangeDate,rangeDate2,userList');
            const res = await JobService.getCollectEvalList(data);
            if (res&&res.error) {
                aj.success = false;
                aj.msg = '查询失败';
            } else {
                aj.result = res;
            }
            return this.json(aj);
        }
        /**
         * 受理人员岗位评价
         * 
         */
        async getCenterPerEvalListAction(){
            let aj = think.ajaxJson();
            const JobService = this.service('overallmerit/JobService');
            const data = this.post('cycle,rangeDate,rangeDate2,userList');
            const res = await JobService.getCenterPerEvalList(data);
            if (res&&res.error) {
                aj.success = false;
                aj.msg = '查询失败';
            } else {
                aj.result = res;
            }
            return this.json(aj);
        }
    
    }