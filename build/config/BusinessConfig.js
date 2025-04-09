"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessConfig = void 0;
exports.businessConfig = {
    emailTokenLength: parseInt(process.env["EMAIL_TOKEN_LENGTH"], 10),
    passwordResetTokenLength: parseInt(process.env["PASSWORD_RESET_TOKEN_LENGTH"]),
    emailTokenExpiresInMinutes: parseInt(process.env["EMAIL_TOKEN_EXPIRES_IN_MINUTES"], 10),
    passwordResetTokenExpiresInMinutes: parseInt(process.env["PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES"], 10),
    passwordResetTokenLink: `${process.env["SERVER_HOST"]}/api/auth/password-reset/request`,
};
//# sourceMappingURL=BusinessConfig.js.map