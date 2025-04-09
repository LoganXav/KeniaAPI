"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeParser_1 = require("../../../../utils/TypeParser");
const DefaultValue_1 = require("../../../../utils/DefaultValue");
const HttpHeader_enum_1 = require("../../../../api/shared/helpers/enums/HttpHeader.enum");
class ClientInfoMiddleware {
    constructor() {
        this.handle = (req, _res, next) => {
            TypeParser_1.TypeParser.cast(req).ipAddress = DefaultValue_1.DefaultValue.evaluateAndGet(req.ip, req.headers[HttpHeader_enum_1.HttpHeaderEnum.FORWARDED_FOR]);
            TypeParser_1.TypeParser.cast(req).userAgent = req.headers[HttpHeader_enum_1.HttpHeaderEnum.USER_AGENT];
            TypeParser_1.TypeParser.cast(req).origin = (req.headers[HttpHeader_enum_1.HttpHeaderEnum.ORIGIN] || req.headers[HttpHeader_enum_1.HttpHeaderEnum.REFERRER]);
            return next();
        };
    }
}
exports.default = new ClientInfoMiddleware();
//# sourceMappingURL=index.js.map