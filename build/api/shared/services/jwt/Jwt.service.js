"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppSettings_1 = __importStar(require("../../setttings/AppSettings"));
const UnauthenticatedError_1 = require("../../../../infrastructure/internal/exceptions/UnauthenticatedError");
class JwtService {
    static getJwt(user) {
        const token = (0, jsonwebtoken_1.sign)({
            identifier: user.id,
            email: user.email,
        }, AppSettings_1.default.JWTEncryptionKey, {
            algorithm: AppSettings_1.AppConstants.HS512_ALGORITHM,
            expiresIn: AppSettings_1.default.JWTExpirationTime,
        });
        return Promise.resolve(token);
    }
    static verifyJwt(token) {
        try {
            return (0, jsonwebtoken_1.verify)(token, AppSettings_1.default.JWTEncryptionKey, {
                algorithms: [AppSettings_1.AppConstants.HS512_ALGORITHM],
            });
        }
        catch (error) {
            console.log(error);
            throw new UnauthenticatedError_1.UnauthenticatedError();
        }
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=Jwt.service.js.map