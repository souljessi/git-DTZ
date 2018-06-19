import assert from 'assert';

/**
 *  Tree基类，用于树表生成和更新当前节点的所有父级ids。
 */
class TreeService extends think.Service {
    /**
     *
     * @param tableName  表名 string
     * @param parentEntity 父对象实体 Object
     * @param upsertEntity 要保存或更新的对象实体 Object
     * @param options 选项对象
     */
    async saveTree(tableName, parentEntity, upsertEntity, options) {
        assert(typeof tableName === 'string', 'tableName must be a string');
        assert(parentEntity instanceof Object, 'parentEntity must be a Object');
        assert(upsertEntity instanceof Object, 'upsertEntity must be a Object');
        const tableModel = this.db[tableName];
        //获取父对象
        const {id: pEntityId, parent_id: pEntityPid, parent_ids: pEntityPids} = parentEntity;
        // 获取修改前的parentIds，用于更新子节点的parentIds
        const oldParentIds = upsertEntity.parent_ids;

        // 如果没有设置父节点，则代表为根节点
        if (pEntityPid === null || pEntityPid === '' || pEntityPid === undefined) {
            upsertEntity.parent_id = 0;
            upsertEntity.parent_ids = '0,';
        } else {
            //获取父对象实体的parent_ids并且拼接parent_ids
            const currParentIds = `${pEntityPids}${pEntityId},`;
            upsertEntity.parent_ids = currParentIds;
            upsertEntity.parent_id = pEntityId;
        }

        //保存或更新当前实体
        const upsert = await tableModel.upsert(upsertEntity);


        //更新当前修改实体所有子节点的parentIds
        if (upsertEntity.id) {
            let sql = `SELECT id,parent_ids FROM ${tableName} WHERE parent_ids like '%${oldParentIds}${upsertEntity.id},%'`;
            const list = await this.commonService.querySql(sql);
            if (list.length > 0) {
                for (let value of list) {
                    if (value.parent_ids && oldParentIds) {
                        let obj = {
                            id: value.id,
                            parent_ids: value.parent_ids.replace(oldParentIds, upsertEntity.parent_ids)

                        };
                        tableModel.update(obj, {
                            where: {
                                id: value.id
                            }
                        });
                    }

                }

            }

        }
        return upsert;


    }


}

module.exports = TreeService;
