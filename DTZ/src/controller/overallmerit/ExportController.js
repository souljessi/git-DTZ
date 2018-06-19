export default class extends think.Controller {
    /**
     * 导出
     * 
     * @returns 
     */
    async exportExcelAction() {
        let aj = think.ajaxJson();
        const flag = Number(this.get('flag'))||Number(this.post('flag'));
        const AreaService = this.service('overallmerit/AreaService');
        const OrgService = this.service('overallmerit/OrgService');
        const JobService = this.service('overallmerit/JobService');

        const xlsx = require('node-xlsx');
        const path = require('path');
        const fs = require('fs');
        let filename = 'com.xlsx';
        let filePath = 'static/upload/com.xlsx';
        let resData = null;
        switch (flag){
            case 1:
                const areaData = {
                    level:Number(this.get('level')),
                    cycle:Number(this.get('cycle')),
                    rangeDate:this.get('rangeDate')
                };
                filename = 'QYPJ.xlsx';
                filePath = 'static/upload/QYPJ.xlsx';
                resData = await AreaService.exportExcel(areaData);
                break;
            case 2:
                const orgData = {
                    cycle:Number(this.get('cycle')),
                    rangeDate:this.get('rangeDate'),
                    orgList:this.get('orgList')
                };
                filename = 'BMPJ.xlsx';
                filePath = 'static/upload/BMPJ.xlsx';
                resData = await OrgService.exportExcel(orgData);
                break;
            case 3:
                const jobData = {
                    userRole:this.post('userRole'),
                    cycle:Number(this.post('cycle')),
                    rangeDate:this.post('rangeDate'),
                    rangeDate2:this.post('rangeDate2'),
                    userList:this.post('userList')
                };
                filename = 'GW.xlsx';
                filePath = 'static/upload/GW.xlsx';
                resData = await JobService.exportExcel(jobData);
                break;
            case 4:
                const Data = {
                    cycle:Number(this.get('cycle')),
                    rangeDate:this.get('rangeDate'),
                    orgid:Number(this.get('orgid')),
                    type:Number(this.get('type'))
                };
                filename = 'AJLB.xlsx';
                filePath = 'static/upload/AJLB.xlsx';
                resData = await OrgService.exportCaseExcel(Data);
                break;
            default:
                break;
        }
        if (resData&&!resData.error) { 
            var buffer = xlsx.build([{name: "mySheetName", data: resData}]); // Returns a buffer
            //将文件内容插入新的文件中
            fs.writeFileSync('www/'+filePath,buffer,{'flag':'w'});
            aj.result = {filePath:filePath};
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    

}