"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordEncryptionService = void 0;
const ServerConfig_1 = __importDefault(require("../../../../config/ServerConfig"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class PasswordEncryptionService {
    static hashPassword(password) {
        return bcryptjs_1.default.hashSync(password, ServerConfig_1.default.Params.Security.Bcrypt.SaltRounds);
    }
    static async verifyPassword(candidatePassword, hashedPassword) {
        return await bcryptjs_1.default.compare(candidatePassword, hashedPassword);
    }
}
exports.PasswordEncryptionService = PasswordEncryptionService;
//# sourceMappingURL=PasswordEncryption.service.js.map