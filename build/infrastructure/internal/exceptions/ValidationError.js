"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const HttpStatusCode_enum_1 = require("../../../api/shared/helpers/enums/HttpStatusCode.enum");
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
class ValidationError extends ApplicationError_1.default {
    constructor(description = "Validation Error") {
        super({
            description,
            httpStatusCode: HttpStatusCode_enum_1.HttpStatusCodeEnum.UNPROCESSABLE_ENTITY,
            isOperational: undefined,
        });
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map