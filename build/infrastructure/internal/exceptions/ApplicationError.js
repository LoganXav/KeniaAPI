"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApplicationError extends Error {
    constructor(applicationErrorArgs) {
        super(applicationErrorArgs.description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.description = applicationErrorArgs.description;
        this.httpStatusCode = applicationErrorArgs.httpStatusCode;
        if (applicationErrorArgs.isOperational !== undefined) {
            this.isOperational = applicationErrorArgs.isOperational;
        }
        Error.captureStackTrace(this);
    }
}
exports.default = ApplicationError;
//# sourceMappingURL=ApplicationError.js.map