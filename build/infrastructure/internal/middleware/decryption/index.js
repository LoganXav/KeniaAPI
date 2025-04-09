"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PayloadEncryptService_1 = require("../../../../api/shared/services/encryption/PayloadEncryptService");
class DecryptionMiddleware {
    constructor() {
        this.handle = (req, _res, next) => {
            if (process.env.NODE_ENV === "production") {
                const decryptedRequestBody = PayloadEncryptService_1.PayloadEncryptService.decrypt(req.body.request);
                req.body = decryptedRequestBody;
                delete req.body.request;
            }
            return next();
        };
    }
}
exports.default = new DecryptionMiddleware();
//# sourceMappingURL=index.js.map