"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const mustache_1 = require("mustache");
const EmailConfirmationMail_1 = __importDefault(require("./templates/EmailConfirmationMail"));
const PasswordResetMail_1 = __importDefault(require("./templates/PasswordResetMail"));
class TemplateService {
    static getEmailVerificationTemplate(token) {
        return (0, mustache_1.render)(EmailConfirmationMail_1.default, {
            token,
        });
    }
    static getPasswordResetEmailTemplate(resetLink) {
        return (0, mustache_1.render)(PasswordResetMail_1.default, {
            resetLink,
        });
    }
}
exports.TemplateService = TemplateService;
//# sourceMappingURL=Template.service.js.map