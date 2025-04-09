"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RoutesConfig_1 = require("../../../../../config/RoutesConfig");
const ServerConfig_1 = __importDefault(require("../../../../../config/ServerConfig"));
const BooleanUtil_1 = require("../../../../../utils/BooleanUtil");
const TypeParser_1 = require("../../../../../utils/TypeParser");
const root = ServerConfig_1.default.Server.Root;
class RouteWhiteListMiddleware {
    constructor() {
        this.handle = (req, _res, next) => {
            TypeParser_1.TypeParser.cast(req).isWhiteList = false;
            TypeParser_1.TypeParser.cast(req).isProtected = false;
            const isDynamicPath = RoutesConfig_1.ROUTE_WHITE_LIST.some(() => {
                // TODO: Refactor to parse dynamic routes
                // Match root, auth/password-reset, and capture a combination of alphanumeric characters
                const dynamicRegex = new RegExp(`${root}/auth/password-reset/([a-zA-Z0-9])`);
                return dynamicRegex.test(req.path);
            });
            const existsUnauthorizedPath = RoutesConfig_1.ROUTE_WHITE_LIST.some((path) => BooleanUtil_1.BooleanUtil.areEqual(path, req.path));
            // if (existsUnauthorizedPath || isDynamicPath) {
            //   TypeParser.cast<IRequest>(req).isWhiteList = true;
            // }
            TypeParser_1.TypeParser.cast(req).isWhiteList = true;
            return next();
        };
    }
}
exports.default = new RouteWhiteListMiddleware();
//# sourceMappingURL=index.js.map