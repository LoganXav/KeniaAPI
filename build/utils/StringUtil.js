"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtil = void 0;
const AppSettings_1 = require("../api/shared/setttings/AppSettings");
class StringUtil {
    static decodeBase64(base64) {
        if (!base64)
            return null;
        return Buffer.from(base64, AppSettings_1.AppConstants.BASE64_ENCODING).toString(AppSettings_1.AppConstants.ASCII_ENCODING);
    }
    static encodeBase64(text) {
        if (!text)
            return null;
        return Buffer.from(text, AppSettings_1.AppConstants.ASCII_ENCODING).toString(AppSettings_1.AppConstants.BASE64_ENCODING);
    }
    static cleanWhiteSpace(text) {
        if (!text)
            return null;
        return text.replace(/\s/g, StringUtil.EMPTY);
    }
}
exports.StringUtil = StringUtil;
StringUtil.DOT = ".";
StringUtil.EMPTY = "";
StringUtil.WHITE_SPACE = " ";
StringUtil.COMMA_SPACE_SEPARATOR = ", ";
//# sourceMappingURL=StringUtil.js.map