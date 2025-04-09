"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const SystemMessages_1 = require("../../../api/shared/helpers/messages/SystemMessages");
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const HttpStatusCode_enum_1 = require("../../../api/shared/helpers/enums/HttpStatusCode.enum");
// https://www.codeconcisely.com/posts/how-to-handle-errors-in-express-with-typescript/
class ErrorHandler {
    handleError(error, response) {
        if (this.isTrustedError(error) && response) {
            this.handleTrustedError(error, response);
        }
        else {
            this.handleCriticalError(error, response);
        }
    }
    isTrustedError(error) {
        if (error instanceof ApplicationError_1.default) {
            return !!error.isOperational;
        }
    }
    handleTrustedError(error, response) {
        response.status(error.httpStatusCode).json({
            statusCode: error.httpStatusCode,
            status: SystemMessages_1.ERROR,
            message: error.message,
        });
    }
    handleCriticalError(error, response) {
        try {
            response?.status(HttpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode_enum_1.HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
                status: SystemMessages_1.ERROR,
                message: SystemMessages_1.CRITICAL_ERROR_EXITING,
            });
        }
        catch (error) {
            console.log("Critical: Error in Error handling", error);
        }
    }
}
exports.errorHandler = new ErrorHandler();
//# sourceMappingURL=ErrorHandler.js.map