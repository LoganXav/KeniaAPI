"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadEncryptService = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const ServerConfig_1 = __importDefault(require("../../../../config/ServerConfig"));
const InternalServerError_1 = require("../../../../infrastructure/internal/exceptions/InternalServerError");
const KEY = crypto_js_1.default.enc.Hex.parse(ServerConfig_1.default.Params.Security.Decrypt.Key);
const IV = crypto_js_1.default.enc.Hex.parse(ServerConfig_1.default.Params.Security.Decrypt.Iv);
class PayloadEncryptService {
    static encrypt(result) {
        try {
            const encrypted = crypto_js_1.default.AES.encrypt(JSON.stringify(result.data), KEY, {
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7,
                iv: IV,
            });
            let encryptedResult = {};
            if (ServerConfig_1.default.Environment == "development") {
                encryptedResult = { result: result.data, encoded: false };
            }
            else {
                encryptedResult = { result: encrypted.toString(), encoded: true };
            }
            return encryptedResult;
        }
        catch (error) {
            console.log(error);
            throw new InternalServerError_1.InternalServerError("Error encrypting result");
        }
    }
    static decrypt(request) {
        try {
            const decrypted = crypto_js_1.default.AES.decrypt(request, KEY, {
                mode: crypto_js_1.default.mode.CBC,
                padding: crypto_js_1.default.pad.Pkcs7,
                iv: IV,
            });
            // Convert decrypted WordArray to UTF-8 string
            const decryptedText = decrypted.toString(crypto_js_1.default.enc.Utf8);
            console.log(decryptedText, "decryptedTextdec");
            // Parse the decrypted text as JSON
            return JSON.parse(decryptedText);
        }
        catch (error) {
            console.error(error);
            throw new InternalServerError_1.InternalServerError("Error decrypting request");
        }
    }
}
exports.PayloadEncryptService = PayloadEncryptService;
//# sourceMappingURL=PayloadEncryptService.js.map