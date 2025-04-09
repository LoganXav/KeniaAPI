"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = void 0;
exports.emailConfig = {
    // TODO - Refactor to env
    mailtrap: {
        host: process.env["EMAIL_PROVIDER_HOST"],
        key: process.env["EMAIL_PROVIDER_KEY"] || "",
        port: parseInt(process.env["EMAIL_PROVIDER_PORT"], 10),
        emailFromEmail: process.env["EMAIL_FROM_EMAIL"],
    },
    provider: process.env["EMAIL_PROVIDER"],
    emailFromEmail: process.env["EMAIL_FROM_EMAIL"],
    emailFromName: process.env["EMAIL_FROM_NAME"],
    emailSecure: false,
};
//# sourceMappingURL=EmailConfig.js.map