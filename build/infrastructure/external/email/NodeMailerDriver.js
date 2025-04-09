"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailerDriver = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const EmailConfig_1 = require("../../../config/EmailConfig");
const LoggingProviderFactory_1 = require("../../internal/logger/LoggingProviderFactory");
class NodeMailerDriver {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: EmailConfig_1.emailConfig.mailtrap.host,
            port: EmailConfig_1.emailConfig.mailtrap.port,
            secure: EmailConfig_1.emailConfig.emailSecure,
            auth: {
                user: "api",
                pass: this.getPassKey(),
            },
        });
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async sendEmail(sendEmailArgs) {
        const { subject, body, to } = sendEmailArgs;
        try {
            const result = await this.transporter.sendMail({
                from: EmailConfig_1.emailConfig.mailtrap.emailFromEmail,
                to,
                subject,
                html: `<h3>${body}</h3>`,
            });
            this.loggingProvider.info(`Email Sent: ${result.messageId}`);
        }
        catch (error) {
            this.loggingProvider.error(`Error: ${error}`);
        }
    }
    getPassKey() {
        return EmailConfig_1.emailConfig.mailtrap.key;
    }
}
exports.NodeMailerDriver = NodeMailerDriver;
//# sourceMappingURL=NodeMailerDriver.js.map