"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedError = void 0;
const HttpStatusCode_enum_1 = require("../../../api/shared/helpers/enums/HttpStatusCode.enum");
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
class UnauthenticatedError extends ApplicationError_1.default {
    constructor(description = "Not Authenticated") {
        super({
            description,
            httpStatusCode: HttpStatusCode_enum_1.HttpStatusCodeEnum.UNAUTHORIZED,
            isOperational: undefined,
        });
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
//# sourceMappingURL=UnauthenticatedError.js.map