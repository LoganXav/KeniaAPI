"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SystemMessages_1 = require("../../../../../api/shared/helpers/messages/SystemMessages");
const Jwt_service_1 = require("../../../../../api/shared/services/jwt/Jwt.service");
const UnauthorizedError_1 = require("../../../../internal/exceptions/UnauthorizedError");
const ArrayUtil_1 = __importDefault(require("../../../../../utils/ArrayUtil"));
const TryWrapper_1 = require("../../../../../utils/TryWrapper");
const TypeParser_1 = require("../../../../../utils/TypeParser");
const TOKEN_PARTS = 2;
const TOKEN_POSITION_VALUE = 1;
class AuthorizationMiddleware {
    constructor() {
        this.handle = (req, _res, next) => {
            if (TypeParser_1.TypeParser.cast(req).isWhiteList)
                return next();
            const auth = req.body.authorization;
            if (!auth)
                return next(this.getUnauthorized(SystemMessages_1.ERROR_MISSING_TOKEN));
            const jwtParts = ArrayUtil_1.default.allOrDefault(auth.split(/\s+/));
            if (jwtParts.length !== TOKEN_PARTS)
                return next(this.getUnauthorized(SystemMessages_1.ERROR_INVALID_TOKEN));
            const token = ArrayUtil_1.default.getWithIndex(jwtParts, TOKEN_POSITION_VALUE);
            const tokenValidation = TryWrapper_1.TryWrapper.exec(Jwt_service_1.JwtService.verifyJwt, [token]);
            if (!tokenValidation.success)
                return next(this.getUnauthorized(SystemMessages_1.ERROR_EXPIRED_TOKEN));
            TypeParser_1.TypeParser.cast(req).session = TypeParser_1.TypeParser.cast(tokenValidation.value);
            return next();
        };
    }
    getUnauthorized(message) {
        return new UnauthorizedError_1.UnauthorizedError(message);
    }
}
exports.default = new AuthorizationMiddleware();
//# sourceMappingURL=index.js.map