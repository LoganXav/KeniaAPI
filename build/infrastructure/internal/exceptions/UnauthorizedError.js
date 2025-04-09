"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const HttpStatusCode_enum_1 = require("../../../api/shared/helpers/enums/HttpStatusCode.enum");
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
class UnauthorizedError extends ApplicationError_1.default {
    constructor(description = "You are not authorized to perform this operation") {
        super({
            description,
            httpStatusCode: HttpStatusCode_enum_1.HttpStatusCodeEnum.FORBIDDEN,
            isOperational: true,
        });
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map