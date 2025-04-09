"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProvider = void 0;
const LoggingProviderFactory_1 = require("../../internal/logger/LoggingProviderFactory");
class EmailProvider {
    constructor(emailDriver) {
        this.emailDriver = emailDriver;
        this.loggingProvider = LoggingProviderFactory_1.LoggingProviderFactory.build();
    }
    async sendEmail(sendEmailArgs) {
        try {
            await this.emailDriver.sendEmail(sendEmailArgs);
        }
        catch (error) {
            this.loggingProvider.error(error);
        }
    }
}
exports.EmailProvider = EmailProvider;
//# sourceMappingURL=EmailProvider.js.map