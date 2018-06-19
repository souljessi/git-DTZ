export default class extends think.BaseController {

    /**
     * 下载通讯录模板
     * @param {String} table_name          表名
     * @returns
     */
    async downloadModelAction() {
        let aj = think.ajaxJson();
          let  table_name=this.post('table_name');
        const excelService = this.service('excel/ExcelService');
        const res = await excelService.downloadModel(table_name);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    /**
     * 下载通讯录
     * @param {String} table_name          表名
     * @returns
     */
    async downloadExcelAction() {
        let aj = think.ajaxJson();
        let table_name= this.post('table_name');
        const excelService = this.service('excel/ExcelService');
        const res = await excelService.downloadExcel(table_name);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
    /**
     * 上传通讯录
     * @param {String} table_name          表名
     * @param {String} data_arr          excel数据数组
     * @param {String} ass_table_obj       模板表对象
     * @returns
     */
    async uploadExcelAction() {
        let aj = think.ajaxJson();
        let table_name=this.post('table_name');
        let data_arr=this.post('data_arr');
        let association_obj=this.post('association_obj');
        let user=this.getUser();
        const excelService = this.service('excel/ExcelService');
        const res = await excelService.uploadExcel(table_name,data_arr,association_obj,user);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }

    /**
     * excel树
     * @param {String} table_name          表名
     * @returns
     */
    async excelTreeListAction() {
        let aj = think.ajaxJson();
        let table_name=this.post('table_name');
        const excelService = this.service('excel/ExcelService');
        const res = await excelService.excelTreeList(table_name);
        if (!res.error) {
            aj.result = res;
        } else {
            aj.success = false;
            aj.msg = '查询失败';
        }
        return this.json(aj);
    }
}

    //
    // get_exporttablelist:function (req, res) {
    //     var pages = req.query;
    //     excelService.exportTableList(pages,function(data){
    //         res.send(data);
    //     })
    // },
    // post_findexporttablelist:function (req, res) {
    //     var pages = req.body;
    //     excelService.findExportTableList(pages,function(data){
    //         res.send(data);
    //     })
    // },
    // post_addorupdateexcel:function (req, res) {
    //     var obj = req.body;
    //     if ('id' in obj) {
    //         commonService.update(db['sys_excel'], obj, function (ret) {
    //             res.send(ret);
    //         });
    //     } else {
    //         commonService.save(db['sys_excel'], obj, function (ret) {
    //             res.send(ret);
    //         });
    //     }
    //
    //
    // },
    // /**
    //  * 单条删除和批量删除
    //  */
    // post_deleteexcel:function (req, res) {
    //     var obj = req.body;
    //     if ('ids' in obj) {
    //         var ids = obj.ids;
    //         var msgStauts = [];
    //         for (var i = 0; i < ids.length; i++) {
    //             var id = ids[i];
    //             commonService.delete(db['sys_excel'], id, function (ret) {
    //                 if (ret.status === false) {
    //                     msgStauts.push(i);
    //                 }
    //             });
    //         }
    //         if (msgStauts.length == 0) {
    //             res.send({status: true, msg: '删除成功'});
    //         } else {
    //             res.send({status: false, msg: '有' + msgStauts.length + '条数据删除失败'});
    //         }
    //
    //
    //     } else {
    //         var id = obj.id;
    //         commonService.delete(db['sys_excel'], id, function (ret) {
    //             res.send(ret);
    //         });
    //
    //     }
    //
    //
    // },
    // //excel树
    //
    // get_getexceltreelist: function (req, res) {
    //     excelService.getExcelTreeList(req.query,function (ret) {
    //         res.send(ret.result);
    //     })
    // }