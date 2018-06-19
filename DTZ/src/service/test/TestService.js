import {IllegalStateException} from '../../framework/common/service/ExceptionService';

export default class extends think.Service {
    constructor() {
        super();
        // this.TreeService.saveTree('sys_test',{},{name:'联诚',age:29});
        // this.TreeService.saveTree('sys_test',{id:2,parent_id:3,parent_ids:'0,1,3,'},{name:'软件子部门02',age:23});
        // this.TreeService.saveTree('sys_test',{id:1,parent_id:0,parent_ids:'0,'},{id:2,name:'软件总部',age:22,parent_ids:'0,1,3,'});\

    }

    async test() {
        // process.send('think-cluster-reload-workers'); // 给主进程发送重启的指令
        // const list = await this.BaseService.dataScopeFilter('test_busn','*',{userId:'t1', orgId:'8888', roleList:['fbff8510-3d38-11e8-a8d9-9934334c34f3']},{limit:10,start:1});
        // const list = await this.BaseService.dataScopeFilter('sys_user', {
        //     userId: 'eb469790-59a8-11e8-8595-2bf7eabc598a',
        //     orgId: '2',
        //     roleList: ['1491bf10-6b03-11e8-9582-ef51e2fc64d4']
        // },{
        //     page:{
        //         start:1,
        //         limit:10,
        //     }
        // });
        // return list;
        // const testModel = this.db['test_bus'];
        // try {
        //     await this.db.sequelize.transaction(async (t) => {
        //         await testModel.findAll({where: {id: 7}, transaction: t});
        //         await testModel.upsert({id: 7, name: 'jessi'}, {transaction: t});
        // });
        //     //如果没有错误，则事务自动提交！
        // } catch (e) {
        //     console.log(e, 'rollback!')
        // }
        // const OP =  this.db.Sequelize.Op;
        // const testBus = await this.db['test_bus'].findAll({
        //     where:{
        //         [OP.or]:[{name:'jessi'},{name:null}]
        //     },
        //     raw:true
        //
        // });
        // console.log(testBus);
        this.TreeService.saveTree('test_tree',{id:3,parent_id:1,parent_ids:'0,1,'},{id:10,parent_id:4,parent_ids:'0,1,2,5,4,'});

    }


}
