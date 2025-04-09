"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceTrace_1 = require("../../../../api/shared/helpers/trace/ServiceTrace");
const TypeParser_1 = require("../../../../utils/TypeParser");
const HttpHeader_enum_1 = require("../../../../api/shared/helpers/enums/HttpHeader.enum");
const GuidUtil_1 = __importDefault(require("../../../../utils/GuidUtil"));
class ServiceTraceMiddleware {
    constructor() {
        this.handle = (req, res, next) => {
            TypeParser_1.TypeParser.cast(res).trace = new ServiceTrace_1.ServiceTrace(TypeParser_1.TypeParser.cast(req).isWhiteList ? TypeParser_1.TypeParser.cast({}) : TypeParser_1.TypeParser.cast(req).session, new Date(), TypeParser_1.TypeParser.cast(req).origin, req.headers[HttpHeader_enum_1.HttpHeaderEnum.TRANSACTION_ID] || GuidUtil_1.default.getV4WithoutDashes())
                .setRequest({
                params: req.params,
                query: req.query,
                body: undefined,
            })
                .setClient({
                ip: TypeParser_1.TypeParser.cast(req).ipAddress,
                agent: TypeParser_1.TypeParser.cast(req).userAgent,
            });
            return next();
        };
    }
}
exports.default = new ServiceTraceMiddleware();
//# sourceMappingURL=index.js.map