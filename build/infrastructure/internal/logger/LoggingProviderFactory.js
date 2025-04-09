"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingProviderFactory = void 0;
const LoggingConfig_1 = __importDefault(require("../../../config/LoggingConfig"));
const LoggingProvider_1 = require("./LoggingProvider");
const SystemMessages_1 = require("../../../api/shared/helpers/messages/SystemMessages");
const WinstonDriver_1 = require("./WinstonDriver");
class LoggingProviderFactory {
    static build() {
        if (this.getLoggingProvider() === "winston") {
            return new LoggingProvider_1.LoggingProvider(new WinstonDriver_1.WinstonDriver());
        }
        else {
            throw new Error(SystemMessages_1.PROVIDER_NOT_FOUND);
        }
    }
    static getLoggingProvider() {
        return LoggingConfig_1.default.LOGGING_PROVIDER;
    }
}
exports.LoggingProviderFactory = LoggingProviderFactory;
//# sourceMappingURL=LoggingProviderFactory.js.map