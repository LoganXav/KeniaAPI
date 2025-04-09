"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingProvider = void 0;
class LoggingProvider {
    constructor(driver) {
        this.driver = driver;
    }
    info(str) {
        return this.driver.info(str);
    }
    success(str) {
        return this.driver.success(str);
    }
    warning(str) {
        return this.driver.warning(str);
    }
    error(err) {
        return this.driver.error(err);
    }
}
exports.LoggingProvider = LoggingProvider;
//# sourceMappingURL=LoggingProvider.js.map