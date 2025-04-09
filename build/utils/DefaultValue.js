"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultValue = void 0;
class DefaultValue {
    static evaluateAndGet(value, defaultValue) {
        if (typeof value === "number" && isNaN(value)) {
            return defaultValue;
        }
        return value ?? defaultValue;
    }
}
exports.DefaultValue = DefaultValue;
//# sourceMappingURL=DefaultValue.js.map