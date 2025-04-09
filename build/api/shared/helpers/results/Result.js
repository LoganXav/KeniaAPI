"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    constructor() {
        this.metadata = {};
    }
    setStatusCode(statusCode, success) {
        this.statusCode = statusCode;
        this.success = success;
    }
    setData(status, statusCode, message, result, token) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.result = result;
        this.token = token;
    }
    setMessage(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
    setError(status, statusCode, message) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.result = null;
    }
    hasError() {
        return !!this.error;
    }
    hasMessage() {
        return !!this.message;
    }
    toResultDto() {
        return {
            status: this.status,
            statusCode: this.statusCode,
            data: {
                message: this.message,
                data: this.result,
                accessToken: this.token,
            },
        };
    }
    setMetadata(headers) {
        this.metadata = headers;
    }
    addMetadata(key, value) {
        this.metadata[key] = value;
    }
    getMetadata() {
        return this.metadata;
    }
    hasMetadata() {
        return Object.keys(this.metadata).length > 0;
    }
}
exports.Result = Result;
//# sourceMappingURL=Result.js.map