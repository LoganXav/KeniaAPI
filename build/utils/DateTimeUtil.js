"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeUtils = void 0;
const luxon_1 = require("luxon");
class DateTimeUtils {
    getISONow() {
        return luxon_1.DateTime.local().toISO();
    }
    getCurrentDate() {
        return luxon_1.DateTime.now().toJSDate();
    }
    getISOCurrentTime() {
        return luxon_1.DateTime.now().toISOTime();
    }
}
exports.DateTimeUtils = DateTimeUtils;
exports.default = new DateTimeUtils();
//# sourceMappingURL=DateTimeUtil.js.map