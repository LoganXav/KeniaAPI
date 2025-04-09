"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const EmailProviderFactory_1 = require("../../../../infrastructure/external/email/EmailProviderFactory");
const SystemMessages_1 = require("../../helpers/messages/SystemMessages");
const Template_service_1 = require("../template/Template.service");
class EmailService {
    static async sendAccountActivationEmail(sendAccountActivationEmailArgs) {
        const { userEmail, activationToken } = sendAccountActivationEmailArgs;
        const emailProvider = EmailProviderFactory_1.EmailProviderFactory.build();
        const emailTemplate = Template_service_1.TemplateService.getEmailVerificationTemplate(activationToken);
        const activationEmailArgs = {
            body: emailTemplate,
            subject: SystemMessages_1.EMAIL_ACTIVATION_TOKEN_EMAIL_SUBJECT,
            to: userEmail,
        };
        await emailProvider.sendEmail(activationEmailArgs);
    }
    static async sendPasswordResetLink(sendPasswordRestLinkArgs) {
        const { userEmail, passwordResetLink } = sendPasswordRestLinkArgs;
        const emailProvider = EmailProviderFactory_1.EmailProviderFactory.build();
        const emailTemplate = Template_service_1.TemplateService.getPasswordResetEmailTemplate(passwordResetLink);
        const passwordResetEmailArgs = {
            body: emailTemplate,
            subject: SystemMessages_1.PASSWORD_RESET_TOKEN_EMAIL_SUBJECT,
            to: userEmail,
        };
        await emailProvider.sendEmail(passwordResetEmailArgs);
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=Email.service.js.map