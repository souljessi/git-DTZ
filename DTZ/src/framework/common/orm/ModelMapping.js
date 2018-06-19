import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

/**
 * ORM模型装载基类
 */
class ModelMapping {

    static initModelMapping() {
        const sequelConfig = think.config('sequelConfig');
        let db = {};//需要挂载db对象
        const database = sequelConfig.database;
        const username = sequelConfig.username;
        const password = sequelConfig.password;
        const sequelize = new Sequelize(database, username, password, sequelConfig);
        fs.readdirSync(path.join(think.ROOT_PATH, 'src', 'model'))
            .filter(function (file) {
                return (file.indexOf(".") !== 0);
            })
            .forEach(function (file) {
                var model = sequelize.import(path.join(think.ROOT_PATH, 'src', 'model', file));
                db[model.name] = model;
            });
        Object.keys(db).forEach(function (modelName) {
            if ("associate" in db[modelName]) {
                db[modelName].associate(db);
            }
        });
        db.sequelize = sequelize;
        db.Sequelize = Sequelize;
        return db;
    }
}

export default ModelMapping;