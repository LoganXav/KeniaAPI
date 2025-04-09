"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const HttpStatusCode_enum_1 = require("../../../api/shared/helpers/enums/HttpStatusCode.enum");
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
class BadRequestError extends ApplicationError_1.default {
    constructor(description = "Bad Request Error", httpStatusCode = HttpStatusCode_enum_1.HttpStatusCodeEnum.BAD_REQUEST) {
        super({
            description,
            httpStatusCode,
            isOperational: undefined,
        });
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=BadRequestError.js.map