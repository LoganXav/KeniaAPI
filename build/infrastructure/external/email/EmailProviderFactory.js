"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProviderFactory = void 0;
const EmailConfig_1 = require("../../../config/EmailConfig");
const EmailProvider_1 = require("./EmailProvider");
const NodeMailerDriver_1 = require("./NodeMailerDriver");
class EmailProviderFactory {
    constructor() { }
    static build() {
        if (EmailProviderFactory.emailProvider() === "nodemailer") {
            return new EmailProvider_1.EmailProvider(new NodeMailerDriver_1.NodeMailerDriver());
        }
        return new EmailProvider_1.EmailProvider(new NodeMailerDriver_1.NodeMailerDriver());
    }
    static emailProvider() {
        return EmailConfig_1.emailConfig.provider;
    }
}
exports.EmailProviderFactory = EmailProviderFactory;
//# sourceMappingURL=EmailProviderFactory.js.map