"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidUtil = void 0;
const uuid_1 = require("uuid");
const StringUtil_1 = require("./StringUtil");
class GuidUtil {
    getV4() {
        return (0, uuid_1.v4)();
    }
    getV4WithoutDashes() {
        return (0, uuid_1.v4)().replace(/-/g, StringUtil_1.StringUtil.EMPTY);
    }
}
exports.GuidUtil = GuidUtil;
exports.default = new GuidUtil();
//# sourceMappingURL=GuidUtil.js.map