"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const Result_1 = require("../../../shared/helpers/results/Result");
class BaseService {
    constructor(CONTEXT) {
        this.CONTEXT = CONTEXT;
        this.result = new Result_1.Result();
    }
    initializeServiceTrace(audit, input, propsToRemove) {
        audit.setContext(this.CONTEXT);
        audit.setArgs(input, propsToRemove);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=Base.service.js.map