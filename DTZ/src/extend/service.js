import CommonService from '../framework/common/service/CommonService';
import BaseService from '../framework/common/service/BaseService';
import ModelMapping from '../framework/common/orm/ModelMapping';
import {ExceptionService} from '../framework/common/service/ExceptionService';
import TreeService from '../framework/common/service/TreeService';
const db = ModelMapping.initModelMapping();
export default {
    commonService: new CommonService(db),
    BaseService: new BaseService(),
    db: db,
    exceptionService: ExceptionService,
    TreeService: new TreeService(),
}

