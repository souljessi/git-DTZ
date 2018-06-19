export default class extends think.Service {
    constructor() {
        super();
            this.model=this;
    }
    /**
     *
     * 得到excel模板
     * @param table_name
     */
    async downloadModel(table_name) {
        let where = {
            table_name: table_name
        };
        let obj = {};
        obj.header = [];
        let table = [];
        obj.ass_data = {};
        obj.ass_data1 = {};
        try {
            const Res = await this.db['sys_excel'].findAll({
                where: where
            });
            for (let value of Res) {
                if (value.td_type == 1 && value.is_export == 1) {
                    obj.tip = value;
                } else if (value.td_type == 2 && value.is_export == 1) {
                    obj.title = value;
                } else if (value.td_type == 3 && value.is_export == 1) {
                    obj.header.push(value);
                }
            }
            let sql = `select * from sys_excel where table_name='${table_name}' and association_type!=0`;
            let table = await this.commonService.querySql(sql);
            for (let i = 0; i < table.length; i++) {
                let ret = await  this.db[table[i].association_table].findAll();
                var item = {};
                for (var j = 0; j < ret.length; j++) {
                    item[ret[j][table[i].association_field]] = ret[j]
                }
                obj.ass_data[table[i].field] = item;
                if (i == table.length - 1) {
                    break;
                }
            }
            return obj;
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    /**
     *
     * 查询excel树
     * @param table_name
     */
    async excelTreeList(table_name) {
        let _this = this;
        let arr = [];
        let result = [];
        let associationArr = await this.db['sys_excel'].findAll({
            where: {
                table_name: table_name,
                td_type: 3,
                association_type: 3
            }
        });
        let obj = {};
        if (associationArr.length > 0) {
            obj = associationArr[0]
        }
        let childArr = await  this.db[table_name].findAll();
        for (let i = 0; i < childArr.length; i++) {
            let sub = childArr[i].dataValues;
            sub.tree_name = childArr[i][obj.field];
            arr[arr.length] = sub;
        }
        if (associationArr.length == 0) {
            for (var i = 0; i < childArr.length; i++) {
                var sub = childArr[i].dataValues;
                sub.tree_name = childArr[i].realname;
                arr[arr.length] = sub;
            }
            return arr;
        }
        let parentArr = await  this.db[obj.association_table].findAll();
        for (var i = 0; i < parentArr.length; i++) {
            var sub = parentArr[i].dataValues;
            sub.tree_name = parentArr[i][obj.association_field];
            sub.parentid = parentArr[i][obj.association_field];
            arr[arr.length] = sub;
        }
        this.transData(arr, 'id', obj.map_field, 'children', function (data) {
            _this.transData(data, 'id', obj.association_parent_field, 'children', function (ret) {
                result = ret;

            });
        });
        return result;


    }

    /**
     * 树形结构
     * 方法作用：【获得树形结构】
     * 使用方法：arrUtil.transData(src, idStr, pidStr, chindrenStr);
     * @param src 数组对象
     * @param idStr id
     * @param pidStr 父级id
     * @param chindrenStr 子集
     * @callback [{id:……,chindrenStr:[{id:……}]},{id:……,chindrenStr:[{id:……}]}]
     */
    transData(src, idStr, pidStr, chindrenStr, callback) {
        if ((src == undefined) || (src == null) || (src == '')) {
            callback([]);
        }

        var a = [];
        for (var i = 0; i < src.length; i++) {
            a.push(src[i])
        }

        var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;

        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }

        callback(r);
    }

    /**
     * 得到excel数据
     * @param table_name
     */
    async downloadExcel(table_name) {
        let where = {
            table_name: table_name
        };
        let obj = {};
        obj.header = [];
        let table = [];
        obj.ass_data = {};
        try {
            const Res = await   this.db['sys_excel'].findAll({
                where: where
            });
            for (let value of Res) {
                if (value.td_type == 1 && value.is_export == 1) {
                    obj.tip = value;
                } else if (value.td_type == 2 && value.is_export == 1) {
                    obj.title = value;
                } else if (value.td_type == 3 && value.is_export == 1) {
                    obj.header.push(value);
                }
            }
            obj.body = await this.db[table_name].findAll();
            let sql = `select * from sys_excel where table_name='${table_name}' and association_type!=0`;
            let table = await this.commonService.querySql(sql);
            for (let i = 0; i < table.length; i++) {
                let ret = await  this.db[table[i].association_table].findAll();
                let tableSql=`select * from ${table[i].association_table} where parent_id!=0`;
                ret = await this.commonService.querySql(tableSql);
                var item = {};
                for (var j = 0; j < ret.length; j++) {
                    item[ret[j].id] = ret[j]
                }
                obj.ass_data[table[i].field] = item;
                if (i == table.length - 1) {
                    break;
                }
            }
            return obj;
        } catch (error) {
            return this.exceptionService.handleError(error);
        }
    }

    /**
     * 上传excel数据
     * @param table_name
     */
    async uploadExcel(table_name, data,association_obj,user) {
        let result={
            successCount:0,
            failureCount:0,
            data:[]
        };
        let obj = await this.db['sys_excel'].findOne({
            where: {
                table_name: table_name,
                td_type: 3,
                association_type: 1
            }
        });
        let    sql = `select * from sys_excel where table_name='${table_name}' and regular!='' and is_export=1`;
        let regArr = await this.commonService.querySql(sql);
        let assObj={};
        let rootObj={};
        let tableObj={};
        let createArr=[];
        let updateArr=[];
        let userArr=await this.db['sys_user'].findAll();
        for(let i=0;i<data.length;i++){
            for(let j in association_obj){
                if(!tableObj[association_obj[j].association_table]){
                    tableObj[association_obj[j].association_table]= await this.db[association_obj[j].association_table].findAll();
                }
              let ret=tableObj[association_obj[j].association_table]
                for(let k=0;k<ret.length;k++){
                    if(!assObj[j]){
                        assObj[j]={}
                    }
                    if(ret[k].dataValues[association_obj[j].association_parent_field]==0){
                        rootObj=ret[k]
                    }
                    assObj[j][ret[k][association_obj[j].association_field]] = ret[k].dataValues
                }
            }
        }
        let ass_table_obj={};

        for (let i = 0; i < data.length; i++) {
            for(let j in association_obj) {
                if(association_obj[j].association_type==1) {
                    if(!data[i][j]){
                        continue;
                    }
                    let filed_arr = data[i][j].toString().split('-');
                    let parent =rootObj.id;
                    let parentObj=rootObj;
                    if (filed_arr.length > 1) {
                        for (let k = 0; k < filed_arr.length; k++) {
                            if (assObj[j][filed_arr[k]]) {
                                parent = assObj[j][filed_arr[k]].id;
                                parentObj=assObj[j][filed_arr[k]];
                            } else {
                                let item={
                                    [association_obj[j].association_field]: filed_arr[k],
                                    [association_obj[j].association_parent_field]: parent,
                                };
                                let ret = await this.db[obj.association_table].create(item);
                                parent=ret.dataValues.id;
                                this.TreeService.saveTree(obj.association_table,parentObj,{id:ret.id});
                                ret.dataValues.parent_ids=parentObj.parent_ids+ret.dataValues.parent_id+',';
                                parentObj=ret.dataValues;
                                assObj[j][ret[association_obj[j].association_field]]=ret.dataValues;
                            }
                            if(k==filed_arr.length-1){
                                data[i][j]=assObj[j][filed_arr[k]].id
                            }
                        }
                    } else {
                        if (!assObj[j][filed_arr[0]]) {
                            let item={
                                [association_obj[j].association_field]: filed_arr[0],
                                [association_obj[j].association_parent_field]: parent,
                            };
                            let ret = await this.db[obj.association_table].create(item);
                           this.TreeService.saveTree(obj.association_table,parentObj,{id:ret.id});
                            parent=ret.dataValues.id;
                            assObj[j][ret[association_obj[j].association_field]]=ret.dataValues;
                        }
                        data[i][j]=assObj[j][filed_arr[0]].id
                    }
                }
            }
            let errorObj={
                row:i,
                msg:''
            };
            let regResult=false;
            //设置默认密码123456，创建人，创建时间 ，修改人，修改时间
            if(!data[i].id){
                //用户名验证
                if(data[i].username){
                   for(let k=0;k<userArr.length;k++){
                        if(userArr[k].username==data[i].username){
                            regResult=true;
                            errorObj.msg='用户名已经存在！';
                            errorObj['username']='username';
                            break;
                        }
                    }
                }

                if(data[i].password){
                    let password=data[i].password==''?'123456':data[i].password;
                    data[i].password=think.irreversibleEncrypt(data[i].username,password);
                }else{
                    data[i].password=think.irreversibleEncrypt(data[i].username,'123456');
                }
                data[i].create_by=user.userId;
                data[i].create_date=new Date()
            }else{
                data[i].update_by=user.userId;
                data[i].update_date=new Date();
            }


            //正则验证
            for(let k=0;k<regArr.length;k++){

                let field=regArr[k].field;
                let str=data[i][field];
                let reg=eval(regArr[k].regular);
                if(!reg.test(str)){
                    regResult=true;
                    errorObj.msg+=regArr[k].field_name+'格式不正确!';
                    errorObj[field]=field;

                }
            }

            result.data.push(errorObj);
                if(regResult){
                    result.failureCount++;
                    continue;
                }else{
                    result.successCount++;

                }
                if(data[i].id){
                    await this.db[table_name].update(data[i],{
                        where: {id:data[i].id}
                    });
                }else{
                    data[i].id=think.uuid('v1');
                    createArr.push(data[i])
                }

        }
       if(createArr.length>0){

           await this.commonService.saveMany(this.db[table_name], createArr);
       }
        return result


    }
}


// /**
//  * 导出excel表格列表
//  *
//  */
// exports.exportTableList = function ( data,callback) {
//     data.start = (parseInt(data.page) - 1) * parseInt(data.pageSize);
//         db['sys_excel'].findAndCountAll({
//             where: { td_type: data.td_type},
//             limit: parseInt(data.pageSize),
//             offset: parseInt(data.start)
//         }).then(function (res) {
//             callback({status: true, data: res});
//         }).catch(function (err) {
//             if (err) {
//                 return callback({status: false, data: '查询错误'});
//             }
//         })
//
// }
// /**
//  * 查询导出excel表格列表
//  *
//  */
// exports.findExportTableList = function ( data,callback) {
//         db['sys_excel'].findAll({
//             where: { td_type: data.td_type}
//         }).then(function (res) {
//             callback({status: true, data: res});
//         }).catch(function (err) {
//             if (err) {
//                 return callback({status: false, data: '查询错误'});
//             }
//         })
//
// }
//
